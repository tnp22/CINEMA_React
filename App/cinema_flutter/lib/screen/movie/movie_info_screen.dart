import 'package:cinema_flutter/notifications/snackbar.dart';
import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:cinema_flutter/service/movie_service.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:photo_view/photo_view.dart';
import 'package:photo_view/photo_view_gallery.dart';
import 'package:provider/provider.dart';

class MovieInfoScreen extends StatefulWidget {
  const MovieInfoScreen({super.key});

  @override
  State<MovieInfoScreen> createState() => _MovieInfoScreenState();
}

class _MovieInfoScreenState extends State<MovieInfoScreen> with TickerProviderStateMixin {
  String? id;
  final movieService = MovieService();
  late Future<Map<String, dynamic>?> movieInfo;
  late Future<Map<String, dynamic>?> reviewInfo;
  bool showAllImages = false;
  late TabController _tabController;

  double tabViewHeight = 600; // 기본 높이

  void updateReviewListHeight(int reviewCount) {
    setState(() {
      tabViewHeight = 600 + (reviewCount * 70.0); // 리뷰 개수에 따라 높이 조절
    });
  }

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      UserProvider userProvider = Provider.of<UserProvider>(context, listen: false);
      final args = ModalRoute.of(context)!.settings.arguments;
      if (args is String) {
        setState(() {
          id = args;
          movieInfo = movieService.movieInfo(id!);
        });
      }
    });

    // TabController 초기화
    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(() {
      // 관람평 탭을 선택할 때만 스틸컷을 숨기도록 설정
      if (_tabController.index == 1) {
        setState(() {
          showAllImages = false;  // 관람평 탭으로 전환 시 스틸컷 숨기기
        });
      }
    });
  }

  Future<Map<String, dynamic>?> fetchReviewData(int page) async {
    UserProvider userProvider = Provider.of<UserProvider>(context, listen: false);
    return await movieService.reviewList(id!, userProvider.userInfo.username?.toString() ?? "null", page);
  }

  @override
  Widget build(BuildContext context) {
    UserProvider? userProvider = Provider.of<UserProvider>(context, listen: false);
    int maxVisibleImages = 5;
    return Scaffold(
      appBar: AppBar(title: Text("영화 정보")),
      body: Padding(
        padding: EdgeInsets.fromLTRB(10, 0, 10, 10),
        child: id == null
            ? Center(child: CircularProgressIndicator())
            : FutureBuilder<Map<String, dynamic>?>( 
                future: movieInfo,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text("데이터 로드 실패"));
                  } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return Center(child: Text("데이터가 없습니다."));
                  } else {
                    Map<String, dynamic> data = snapshot.data!;
                    Map<String, dynamic> movie = Map<String, dynamic>.from(data["movie"] ?? {});
                    List<Map<String, dynamic>> castList = List<Map<String, dynamic>>.from(data["castList"] ?? []);
                    List<Map<String, dynamic>> stilList = List<Map<String, dynamic>>.from(data["stilList"] ?? []);
                    final rawDate = movie["releaseDate"] ?? '';
                    String formattedDate = DateFormat('yyyy-MM-dd').format(DateTime.parse(rawDate));

                    // 스틸컷의 개수에 따라 컨테이너 높이 동적 계산
                    double stilListHeight = showAllImages
                        ? (stilList.length / 3).ceil() * 120.0 // 모든 스틸컷을 다 보여줄 때
                        : (stilList.length > maxVisibleImages
                            ? (maxVisibleImages / 3).ceil() * 120.0 // 최대 5개 이미지만 보여줄 때
                            : (stilList.length / 3).ceil() * 120.0); // 5개 미만일 때

                    return SingleChildScrollView( // Column이 스크롤 되도록 설정
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              SizedBox(
                                width: 100,
                                height: 150,
                                child: Image.network(
                                  "http://${userProvider.hostIP}:8080/files/img?id=${movie["files"]["id"]}",
                                  fit: BoxFit.cover,
                                ),
                              ),
                              SizedBox(width: 20),
                              Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text("${movie["title"]}", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                  Text("개봉일 : $formattedDate", style: TextStyle(fontSize: 15, color: Colors.grey)),
                                  Text("장르 : ${movie["type"]}", style: TextStyle(fontSize: 15, color: Colors.grey)),
                                  Padding(
                                    padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 0),
                                    child: ElevatedButton(
                                    onPressed: () {
                                      Navigator.pushNamed(context, "/ticket", 
                                      arguments: {
                                        "movieTitle": movie["title"].toString(),
                                        "movieId": movie["id"].toString(),
                                      });
                                    },
                                    style: ElevatedButton.styleFrom(
                                      backgroundColor: const Color(0xFF583BBF), // 버튼 배경색: 보라색
                                      foregroundColor: Colors.white, // 글자색: 흰색
                                      shape: RoundedRectangleBorder(
                                        borderRadius: BorderRadius.circular(10), // 버튼 모서리 둥글게 (radius 10)
                                      ),
                                    ),
                                    child: const Text("예매하기"),
                                  ),
                                  ),
                                ],
                              ),
                            ],
                          ),
                          SizedBox(height: 10),
                          Divider(color: Colors.grey, thickness: 1),
                          SizedBox(height: 10),
                          ExpandableText(text: movie["content"]),
                          SizedBox(height: 10),
                          Divider(color: Colors.grey, thickness: 1),
                          SizedBox(height: 10),
                          // TabBar
                          TabBar(
                            controller: _tabController,
                            tabs: [
                              Tab(text: "상세정보"),
                              Tab(text: "관람평"),
                            ],
                            indicatorColor: Color(0xFF583BBF),
                            labelColor: Color(0xFF583BBF),
                            unselectedLabelColor: Colors.black,
                          ),
                          SizedBox(height: 10),
                          // TabBarView
                          Container(
                            // 높이를 탭에 맞게 설정
                            height: _tabController.index == 0 ? stilListHeight + 300 : tabViewHeight,
                            child: TabBarView(
                              controller: _tabController,
                              children: [
                                Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Text("감독/등장인물", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                    ),
                                    SizedBox(
                                      height: 150, // 고정된 높이
                                      child: ListView.builder(
                                        scrollDirection: Axis.horizontal,
                                        itemCount: castList.length,
                                        itemBuilder: (context, index) {
                                          return Padding(
                                            padding: EdgeInsets.only(right: 10),
                                            child: Column(
                                              children: [
                                                ClipOval(
                                                  child: SizedBox(
                                                    width: 80,
                                                    height: 80,
                                                    child: Image.network(
                                                      "http://${userProvider.hostIP}:8080/files/img?id=${castList[index]["files"]["id"]}",
                                                      fit: BoxFit.cover,
                                                    ),
                                                  ),
                                                ),
                                                SizedBox(height: 5),
                                                Text(
                                                  castList[index]["name"].length > 6
                                                  ? castList[index]["name"].substring(0, 6) + '\n' + castList[index]["name"].substring(6)
                                                  : castList[index]["name"],
                                                  style: TextStyle(fontSize: 14),
                                                  textAlign: TextAlign.center,
                                                ),
                                              ],
                                            ),
                                          );
                                        },
                                      ),
                                    ),
                                    Padding(
                                      padding: const EdgeInsets.all(8.0),
                                      child: Text("스틸컷", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                                    ),
                                    // GridView는 shrinkWrap과 physics 설정
                                    GridView.builder(
                                      shrinkWrap: true,
                                      physics: NeverScrollableScrollPhysics(),
                                      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
                                        crossAxisCount: 3,
                                        crossAxisSpacing: 8,
                                        mainAxisSpacing: 8,
                                      ),
                                      itemCount: showAllImages
                                          ? stilList.length
                                          : (stilList.length > maxVisibleImages ? maxVisibleImages : stilList.length),
                                      itemBuilder: (context, index) {
                                        if (!showAllImages && index == maxVisibleImages - 1 && stilList.length > maxVisibleImages) {
                                          return GestureDetector(
                                            onTap: () {
                                              setState(() {
                                                showAllImages = true;
                                              });
                                            },
                                            child: Stack(
                                              fit: StackFit.expand,
                                              children: [
                                                Image.network(
                                                  "http://${userProvider.hostIP}:8080/files/img?id=${stilList[index]["id"]}",
                                                  fit: BoxFit.cover,
                                                ),
                                                Container(
                                                  color: Colors.black.withOpacity(0.5),
                                                  alignment: Alignment.center,
                                                  child: Text(
                                                    "+${stilList.length - maxVisibleImages}",
                                                    style: TextStyle(fontSize: 24, color: Colors.white, fontWeight: FontWeight.bold),
                                                  ),
                                                ),
                                              ],
                                            ),
                                          );
                                        }
                                        return GestureDetector(
                                          onTap: () {
                                            showFullScreenImage(context, stilList, index);
                                          },
                                          child: Image.network(
                                            "http://${userProvider.hostIP}:8080/files/img?id=${stilList[index]['id']}",
                                            fit: BoxFit.cover,
                                          ),
                                        );
                                      },                                    ),
                                  ],
                                ),
                                // 관람평 탭
                                ReviewListWidget(
                                  fetchReviews: fetchReviewData,
                                  onReviewListUpdated: updateReviewListHeight,
                                  username: userProvider.userInfo.username,
                                  id: id,
                                )

                              ],
                            ),
                          ),
                        ],
                      ),
                    );
                  }
                },
              ),
      ),
    );
  }
}

class ExpandableText extends StatefulWidget {
  final String text;

  const ExpandableText({Key? key, required this.text}) : super(key: key);

  @override
  _ExpandableTextState createState() => _ExpandableTextState();
}

class _ExpandableTextState extends State<ExpandableText> {
  bool isExpanded = false;

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          widget.text,
          style: TextStyle(fontSize: 16),
          maxLines: isExpanded ? null : 3,
          overflow: isExpanded ? TextOverflow.visible : TextOverflow.ellipsis,
        ),
        if (widget.text.length > 100)
          TextButton(
            onPressed: () {
              setState(() {
                isExpanded = !isExpanded;
              });
            },
            child: Text(isExpanded ? "접기" : "...더보기", style: TextStyle(color: Colors.grey, fontWeight: FontWeight.bold)),
          ),
      ],
    );
  }
}

void showFullScreenImage(BuildContext context, List<Map<String, dynamic>> stilList, int initialIndex) {

  UserProvider userProvider = Provider.of<UserProvider>(context, listen: true);
  showDialog(
    context: context,
    builder: (context) {
      return Dialog(
        backgroundColor: Colors.black,
        insetPadding: EdgeInsets.zero, // 전체 화면을 사용하도록 설정
        child: Stack(
          children: [
            PhotoViewGallery.builder(
              scrollPhysics: BouncingScrollPhysics(),
              builder: (context, index) {
                return PhotoViewGalleryPageOptions(
                  imageProvider: NetworkImage("http://${userProvider.hostIP}:8080/files/img?id=${stilList[index]['id']}"),
                  minScale: PhotoViewComputedScale.contained,
                  maxScale: PhotoViewComputedScale.covered * 2,
                );
              },
              itemCount: stilList.length,
              pageController: PageController(initialPage: initialIndex),
              backgroundDecoration: BoxDecoration(color: Colors.black),
            ),
            Positioned(
              top: 40,
              right: 20,
              child: IconButton(
                icon: Icon(Icons.close, color: Colors.white, size: 30),
                onPressed: () => Navigator.pop(context),
              ),
            ),
          ],
        ),
      );
    },
  );
}

class ReviewListWidget extends StatefulWidget {
  final Future<Map<String, dynamic>?> Function(int page) fetchReviews;
  final Function(int) onReviewListUpdated;
  final String? username;
  final String? id;

  ReviewListWidget({required this.fetchReviews, required this.onReviewListUpdated, required this.username, required this.id});

  @override
  _ReviewListWidgetState createState() => _ReviewListWidgetState();
}

class _ReviewListWidgetState extends State<ReviewListWidget> {
  List<Map<String, dynamic>> reviews = [];
  bool isLoading = false;
  int currentPage = 1;
  bool hasMore = true;
  int count=0;

  ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _fetchReviewData();

    _scrollController.addListener(() {
      if (_scrollController.position.pixels >= _scrollController.position.maxScrollExtent - 100) {
        _fetchReviewData();
      }
    });
  }

  Future<void> _fetchReviewData() async {
    if (isLoading || !hasMore) return;

    setState(() {
      isLoading = true;
    });

    try {
      Map<String, dynamic>? data = await widget.fetchReviews(currentPage);
      if (data != null && data["reviewList"]["list"] != null) {
        List<Map<String, dynamic>> newReviews = List<Map<String, dynamic>>.from(data["reviewList"]["list"]);
        count = data["count"];
        if (data["reviewList"]["pages"] >= currentPage) {
          setState(() {
            reviews.addAll(newReviews);
            if(newReviews.length < 6){
              hasMore = false;
            }
            currentPage++;
          });
        } else {
          setState(() {
            hasMore = false;
          });
        }
      }
    } catch (e) {
      print("Error fetching reviews: $e");
    }

    setState(() {
      isLoading = false;
    });
  }

  void _showAddReviewDialog() {
  int ratingValue = 5; // 기본 별점 값
  TextEditingController reviewController = TextEditingController();
  MovieService movieService = MovieService();

  showDialog(
    context: context,
    builder: (context) {
      return StatefulBuilder( // StatefulBuilder 사용하여 내부 상태 관리
        builder: (context, setState) {
          return AlertDialog(
            title: Text("리뷰 추가"),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: List.generate(5, (index) {
                    return IconButton(
                      icon: Icon(
                        index < ratingValue ? Icons.star : Icons.star_border,
                        color: Color(0xFF583BBF),
                      ),
                      onPressed: () {
                        setState(() {
                          ratingValue = index + 1; // 선택한 별점 값
                        });
                      },
                    );
                  }),
                ),
                SizedBox(height: 10),
                TextField(
                  controller: reviewController,
                  decoration: InputDecoration(hintText: "리뷰를 입력하세요"),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text("취소"),
              ),
              TextButton(
                onPressed: () async {
                  // 리뷰 추가 로직
                  bool result = await movieService.reviewInsert(
                    {
                      'username': widget.username,
                      'content': reviewController.text,
                      'ratingValue': ratingValue,
                      'movieId': widget.id
                    }
                  );
                  Navigator.pop(context); // 리뷰 추가 후 다이얼로그 닫기
                  if (result) {
                      // 리뷰가 추가되었으면 새로운 리뷰 목록을 불러옴
                      setState(() {
                        reviews.clear(); // 기존 리뷰 목록을 초기화
                        currentPage = 1;  // 페이지 번호 초기화
                        _fetchReviewData(); // 리뷰 데이터를 새로 가져옴
                      });
                    }
                },
                child: Text("확인"),
              ),
            ],
          );
        },
      );
    },
  );
}



  void _showEditReviewDialog(Map<String, dynamic> review, int index) {
  int ratingValue = review['ratingValue']; // 기존 별점 값
  TextEditingController reviewController = TextEditingController(text: review['content']);
  MovieService movieService = MovieService();
  showDialog(
    context: context,
    builder: (context) {
      return StatefulBuilder( // StatefulBuilder 사용하여 내부 상태 관리
        builder: (context, setState) {
          return AlertDialog(
            title: Text("리뷰 수정"),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Row(
                  children: List.generate(5, (index) {
                    return IconButton(
                      icon: Icon(
                        index < ratingValue ? Icons.star : Icons.star_border,
                        color: Color(0xFF583BBF),
                      ),
                      onPressed: () {
                        setState(() {
                          ratingValue = index + 1; // 수정된 별점 값
                        });
                      },
                    );
                  }),
                ),
                SizedBox(height: 10),
                TextField(
                  controller: reviewController,
                  decoration: InputDecoration(hintText: "리뷰를 수정하세요"),
                ),
              ],
            ),
            actions: [
              TextButton(
                onPressed: () {
                  Navigator.pop(context);
                },
                child: Text("취소"),
              ),
              TextButton(
                onPressed: () async{
                  bool result = await movieService.reviewUpdate(
                    {
                      'content': reviewController.text,
                      'ratingValue': ratingValue,
                      'id': review['id']
                    }
                  );
                  setState(() {
                    reviews[index]['content'] = reviewController.text;
                    reviews[index]['ratingValue'] = ratingValue; // 수정된 별점 반영
                  });
                  Navigator.pop(context);
                },
                child: Text("확인"),
              ),
            ],
          );
        },
      );
    },
  );
}


  void _showDeleteConfirmationDialog(int index, String reviewId) async {
    MovieService movieService = MovieService();
    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: Text("리뷰 삭제"),
          content: Text("정말로 이 리뷰를 삭제하시겠습니까?"),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.pop(context);
              },
              child: Text("취소"),
            ),
            TextButton(
              onPressed: () async{
                bool result = await movieService.reviewDelete(reviewId);

                if (result) {
                      // 리뷰가 추가되었으면 새로운 리뷰 목록을 불러옴
                      setState(() {
                        reviews.clear(); // 기존 리뷰 목록을 초기화
                        currentPage = 1;  // 페이지 번호 초기화
                        _fetchReviewData(); // 리뷰 데이터를 새로 가져옴
                      });
                    }
                Navigator.pop(context);
              },
              child: Text("확인"),
            ),
          ],
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    UserProvider userProvider = Provider.of<UserProvider>(context, listen: false);
    String? loggedInUsername = userProvider.userInfo?.username;

    return Padding(
      padding: EdgeInsets.fromLTRB(10, 0, 10, 10),
      child: reviews.isEmpty && isLoading
          ? Center(child: CircularProgressIndicator())
          : Column(
              children: [
                ReviewButton(
                  onPressed: () {
                    if (count < 1) {
                      loggedInUsername != null ? _showAddReviewDialog() : null;
                    }
                  },
                ),
                Expanded(
                  child: ListView.builder(
                    controller: _scrollController,
                    itemCount: reviews.length + (hasMore ? 1 : 0),
                    itemBuilder: (context, index) {
                      if (index >= reviews.length) {
                        return Center(child: CircularProgressIndicator()); // 로딩 인디케이터
                      }

                      final review = reviews[index];

                      return Padding(
                        padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              children: [
                                CircleAvatar(
                                  radius: 20,
                                  backgroundImage: review['fileId'] != null
                                      ? NetworkImage("http://${userProvider.hostIP}:8080/files/img?id=${review['fileId']}")
                                      : null,
                                  child: review['fileId'] == null
                                      ? ClipOval(
                                          child: Image.asset(
                                            'image/normal.png',
                                            fit: BoxFit.cover,
                                            width: 40,
                                            height: 40,
                                          ),
                                        )
                                      : null,
                                ),
                                SizedBox(width: 10),
                                Text(
                                  review['username'],
                                  style: TextStyle(fontWeight: FontWeight.bold),
                                ),
                                Spacer(),
                                if (loggedInUsername != null && review['username'] == loggedInUsername)
                                  PopupMenuButton<String>(
                                    onSelected: (value) {
                                      if (value == 'edit') {
                                        _showEditReviewDialog(review, index);
                                      } else if (value == 'delete') {
                                        _showDeleteConfirmationDialog(index, review['id']);
                                      }
                                    },
                                    itemBuilder: (context) => [
                                      PopupMenuItem(
                                        value: 'edit',
                                        child: Text("수정"),
                                      ),
                                      PopupMenuItem(
                                        value: 'delete',
                                        child: Text("삭제"),
                                      ),
                                    ],
                                  ),
                              ],
                            ),
                            SizedBox(height: 5),
                            Row(
                              children: List.generate(
                                    review['ratingValue'],
                                    (i) => Icon(Icons.star, color: Color(0xFF583BBF), size: 16),
                                  ) +
                                  List.generate(
                                    5 - (review['ratingValue'] as int),
                                    (i) => Icon(Icons.star_border, color: Color(0xFF583BBF), size: 16),
                                  ),
                            ),
                            SizedBox(height: 5),
                            Text(
                              review['content'],
                              style: TextStyle(fontSize: 14),
                            ),
                            Divider(),
                          ],
                        ),
                      );
                    },
                  ),
                ),
              ],
            ),
    );
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }
}

class ReviewButton extends StatelessWidget {
  final VoidCallback? onPressed;

  const ReviewButton({Key? key, this.onPressed}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return OutlinedButton.icon(
      onPressed: onPressed,
      icon: Icon(Icons.edit, color: Colors.black), // 연필 아이콘
      label: Text(
        "관람평 등록하기",
        style: TextStyle(color: Colors.black),
      ),
      style: OutlinedButton.styleFrom(
        side: BorderSide(color: Colors.grey), // 회색 테두리
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8), // 모서리 둥글게
        ),
        padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16), // 패딩
      ),
    );
  }
}



