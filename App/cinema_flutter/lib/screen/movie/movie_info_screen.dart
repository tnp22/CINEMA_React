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
          reviewInfo = movieService.reviewList(id!,userProvider.userInfo.username!.toString());
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

  @override
  Widget build(BuildContext context) {
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
                    final rawDate = movie["regDate"] ?? '';
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
                                  "http://10.0.2.2:8080/files/img?id=${movie["files"]["id"]}",
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
                            height: stilListHeight + 300, // 상세정보 탭에서만 동적 높이
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
                                                      "http://10.0.2.2:8080/files/img?id=${castList[index]["files"]["id"]}",
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
                                                  "http://10.0.2.2:8080/files/img?id=${stilList[index]["id"]}",
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
                                            "http://10.0.2.2:8080/files/img?id=${stilList[index]['id']}",
                                            fit: BoxFit.cover,
                                          ),
                                        );
                                      },
                                    ),
                                  ],
                                ),
                                // 관람평 탭
                               Padding(
                                  padding: EdgeInsets.fromLTRB(10, 0, 10, 10),
                                  child: 
                                  id == null
                                    ? Center(child: CircularProgressIndicator())
                                    : FutureBuilder<Map<String, dynamic>?>( 
                                        future: reviewInfo,
                                        builder: (context, snapshot) {
                                          if (snapshot.connectionState == ConnectionState.waiting) {
                                            return Center(child: CircularProgressIndicator());
                                          } else if (snapshot.hasError) {
                                            return Center(child: Text("데이터 로드 실패"));
                                          } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                                            return Center(child: Text("데이터가 없습니다."));
                                          } else {
                                            Map<String, dynamic> data = snapshot.data!;
                                            List<Map<String, dynamic>> reviewList = List<Map<String, dynamic>>.from(data["reviewList"]["list"] ?? []);
                                            return ListView.builder(
                                              itemCount: reviewList.length,
                                              itemBuilder: (context, index) {
                                                return Padding(
                                                  padding: const EdgeInsets.symmetric(vertical: 5, horizontal: 10),
                                                  child: Column(
                                                    crossAxisAlignment: CrossAxisAlignment.start,
                                                    children: [
                                                      Row(
                                                        children: [
                                                          CircleAvatar(
                                                            backgroundImage: NetworkImage("http://10.0.2.2:8080/files/img?id=${reviewList[index]['fileId']}"),
                                                            radius: 20,
                                                          ),
                                                          SizedBox(width: 10),
                                                          Text(
                                                            reviewList[index]['username'],
                                                            style: TextStyle(fontWeight: FontWeight.bold),
                                                          ),
                                                        ],
                                                      ),
                                                      SizedBox(height: 5),
                                                      Row(
                                                        children: [
                                                          ...List.generate(
                                                            reviewList[index]['ratingValue'], // ⭐ 별 개수 지정
                                                            (i) => Icon(Icons.star, color: Color(0xFF583BBF), size: 16),
                                                          ),
                                                          SizedBox(width: 5),
                                                        ],
                                                      ),
                                                      SizedBox(height: 5),
                                                      Text(
                                                        reviewList[index]['content'],
                                                        style: TextStyle(fontSize: 14),
                                                      ),
                                                      Divider(),
                                                    ],
                                                  ),
                                                );
                                              },
                                            );
                                          }
                                        }
                                    )
                                ),
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
                  imageProvider: NetworkImage("http://10.0.2.2:8080/files/img?id=${stilList[index]['id']}"),
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
