import 'dart:async';
import 'dart:io';
import 'dart:typed_data';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:cinema_flutter/service/movie_service.dart';
import 'package:cinema_flutter/widget/custom_drawer.dart';
import 'package:intl/intl.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {

  late Future<Map<String, dynamic>> homeData;
  final movieService = MovieService();

  @override
  void initState(){
    super.initState();
    homeData = movieService.list(); // Map 타입으로 받기
  }

  @override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: Text("사용자님"),
    ),
    body: FutureBuilder<Map<String, dynamic>>(
      future: homeData, // Spring Boot에서 받아온 데이터
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return Center(child: CircularProgressIndicator()); // 로딩 중
        } else if (snapshot.hasError) {
          return Center(child: Text("데이터 로드 실패"));
        } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
          return Center(child: Text("데이터가 없습니다."));
        }

        // 데이터 받아오기
        Map<String, dynamic> data = snapshot.data!;
        List<Map<String, dynamic>> bannerList = List<Map<String, dynamic>>.from(data["bannerList"] ?? []);
        List<Map<String, dynamic>> subBannerList = List<Map<String, dynamic>>.from(data["subBannerList"] ?? []);
        List<Map<String, dynamic>> movieList = List<Map<String, dynamic>>.from(data["moviePageInfo"]["list"]?? []);
        List<Map<String, dynamic>> expectList = List<Map<String, dynamic>>.from(data["expectPageInfo"]["list"]?? []);
        List<Map<String, dynamic>> notices = List<Map<String, dynamic>>.from(data["noticeList"] ?? []);
        print(data["moviePageInfo"]["list"]);

        return SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start, // 왼쪽 정렬
            children: [
              // 📌 슬라이드 배너 (데이터 전달)
              BannerSlider(banners: bannerList),

              SizedBox(height: 20),

              // 📌 영화 슬라이더 (데이터 전달)
              MovieSlider(),

              SizedBox(height: 20),

              Padding(
                padding: const EdgeInsets.all(20), // 좌우 여백 추가
                child: Text(
                  "무비스낵",
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
              ),

              // 📌 스낵 메뉴 (예제상 데이터 없이 유지)
              SnackMenuScreen(),

              SizedBox(height: 20),

              // 📌 공지사항 (데이터 전달)
              NotificationCenter(notices: notices),

              Padding(
                padding: const EdgeInsets.all(20),
                child: Image.asset('image/ad.png', fit: BoxFit.cover),
              )
            ],
          ),
        );
      },
    ),
  );
}

}

// 배너 슬라이더

class BannerSlider extends StatefulWidget {
  final List<Map<String, dynamic>> banners; // 배너 리스트 받기

  BannerSlider({required this.banners});

  @override
  State<BannerSlider> createState() => _BannerSliderState();
}

class _BannerSliderState extends State<BannerSlider> {
  late PageController _pageController;
  int _currentPage = 1;
  late Timer _timer;
  MovieService movieService = MovieService();
  List<Uint8List> _bannerImages = [];
  List<String> movieId = [];

  @override
  void initState() {
    super.initState();
    _pageController = PageController(initialPage: _currentPage);
    _loadBanners(); // 배너 이미지 로드
    _startAutoSlide();
  }

  // 자동 슬라이드 시작
  void _startAutoSlide() {
    _timer = Timer.periodic(const Duration(seconds: 5), (timer) {
      if (mounted) {
        _pageController.animateToPage(
          _currentPage + 1,
          duration: const Duration(milliseconds: 500),
          curve: Curves.easeInOut,
        );
      }
    });
  }

  // 배너 이미지 로드
  Future<void> _loadBanners() async {
    List<Future<Uint8List>> imageFutures = widget.banners.map((banner) {
      
      String fileId = banner["files"]["id"].toString();
      return movieService.getImage(fileId);
    }).toList();

    List<Uint8List> images = await Future.wait(imageFutures);

    setState(() {
      _bannerImages = images;
      movieId = widget.banners.map((banner) => banner["movie"]["id"].toString()).toList();
    });
  }

  void _onBannerTap(int index) {
    Navigator.pushNamed(context, "/movieInfo", arguments: movieId[index]);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 100,
      width: double.infinity,
      child: _bannerImages.isEmpty
          ? Center(child: CircularProgressIndicator()) // 로딩 표시
          : PageView.builder(
              controller: _pageController,
              itemCount: _bannerImages.length + 2,
              onPageChanged: (index) {
                setState(() {
                  _currentPage = index;
                  if (index == _bannerImages.length + 1) {
                    Future.delayed(const Duration(milliseconds: 300), () {
                      _pageController.jumpToPage(1);
                    });
                  } else if (index == 0) {
                    Future.delayed(const Duration(milliseconds: 300), () {
                      _pageController.jumpToPage(_bannerImages.length);
                    });
                  }
                });
              },
              itemBuilder: (context, index) {
                if (index == 0) {
                  return GestureDetector(
                    onTap: () => _onBannerTap(_bannerImages.length - 1),
                    child: Image.memory(_bannerImages.last, fit: BoxFit.cover),
                  );
                } else if (index == _bannerImages.length + 1) {
                  return GestureDetector(
                    onTap: () => _onBannerTap(0),
                    child: Image.memory(_bannerImages.first, fit: BoxFit.cover),
                  );
                } else {
                  return GestureDetector(
                    onTap: () => _onBannerTap(index - 1),
                    child: Image.memory(_bannerImages[index - 1], fit: BoxFit.cover),
                  );
                }
              },
            ),
    );
  }
}



// 영화 차트
class MovieSlider extends StatefulWidget {
  @override
  _MovieSliderState createState() => _MovieSliderState();
}

class _MovieSliderState extends State<MovieSlider> with SingleTickerProviderStateMixin {
  late TabController _tabController;

  final List<String> _movieImages = [
    'image/moana.png',
    'image/movie_fire.png',
    'image/movie_hidden.png',
    'image/movie_snow.png',
    'image/movie_wickid.png',
    'image/movie_win.png',
    'image/endgame.png',
  ];

  final List<String> _movieTitles = [
    '모아나2',
    '소방관',
    '히든페이스',
    '청설',
    '위키드',
    '1승',
    '엔드게임'
  ];

  final List<String> _upcomingMovieImages = [
    'image/inter.png',
    'image/tenet.png',
    'image/fury.png',
    'image/gladi.png',
  ];

  final List<String> _upcomingMovieTitles = [
    '인터스텔라',
    '테넷',
    '퓨리',
    '글래디에이터',
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      height: 370,
      child: Padding(
        padding: EdgeInsets.fromLTRB(20, 0, 20, 0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("영화차트", style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),),
            // 탭 메뉴
            TabBar(
              controller: _tabController,
              onTap: (index) {
                setState(() {}); // 탭 변경 시 UI 갱신
              },
              tabs: [
                Tab(text: '상영중'),
                Tab(text: '상영 예정작'),
              ],
            ),
            // 탭에 맞는 리스트 (애니메이션 없이 즉시 전환)
            Expanded(
              child: IndexedStack(
                index: _tabController.index, // 현재 선택된 탭의 인덱스를 사용
                children: [
                  // 영화차트 ListView
                  SizedBox(
                    height: 350,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _movieImages.length,
                      itemBuilder: (context, index) {
                        return MovieCard(
                          image: _movieImages[index],
                          title: _movieTitles[index],
                        );
                      },
                    ),
                  ),
                  // 상영 예정작 ListView
                  SizedBox(
                    height: 350,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      itemCount: _upcomingMovieImages.length,
                      itemBuilder: (context, index) {
                        return MovieCard(
                          image: _upcomingMovieImages[index],
                          title: _upcomingMovieTitles[index],
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      )
    );
  }
}

class MovieCard extends StatelessWidget {
  final String image;
  final String title;

  MovieCard({required this.image, required this.title});

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        print("영화 클릭됨: $title");
      },
      child: Card(
        clipBehavior: Clip.hardEdge,
        elevation: 5,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Column(
          children: [
            Expanded(
              child: Image.asset(image, fit: BoxFit.cover),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(0, 5, 0, 0),
              child: Text(
                title,
                textAlign: TextAlign.center,
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
            ),
            Padding(
              padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 0),
              child: ElevatedButton(
              onPressed: () {
                print("예매하기 클릭됨: $title");
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
      ),
    );
  }
}

// 무비스낵
class SnackMenuScreen extends StatelessWidget {
  const SnackMenuScreen({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final snackItems = [
      SnackItem(
        imagePath: 'image/snack1.png',
        name: '보라 팝콘 더블 세트',
        price: '11,000원',
      ),
      SnackItem(
        imagePath: 'image/snack3.png',
        name: '보라 커플 세트',
        price: '9,500원',
      ),
      SnackItem(
        imagePath: 'image/snack5.png',
        name: '보라 나초칩',
        price: '4,500원',
      ),
      SnackItem(
        imagePath: 'image/snack2.png',
        name: '보라 칠리치즈 핫도그',
        price: '5,500원',
      ),
      SnackItem(
        imagePath: 'image/snack4.png',
        name: '보라 플레인 핫도그',
        price: '5,000원',
      ),
      SnackItem(
        imagePath: 'image/snack6.png',
        name: '보라 아이스 아메리카노',
        price: '3,500원',
      ),
    ];
    return Padding(
      padding: const EdgeInsets.fromLTRB(20, 0, 20, 0),
      child: GridView.count(
        crossAxisCount: 2, // 2열
        crossAxisSpacing: 16, // 열 간격
        mainAxisSpacing: 16, // 행 간격
        childAspectRatio: 3 / 4, // 카드 비율 (너비 대비 높이)
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(), // 부모 스크롤과 충돌 방지
        children: snackItems.map((snack) {
          return _buildSnackCard(snack);
        }).toList(),
      ),
    );
  }

  Widget _buildSnackCard(SnackItem snack) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // 이미지
        Expanded(
          child: ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: Image.asset(
              snack.imagePath,
              fit: BoxFit.cover,
              width: double.infinity,
            ),
          ),
        ),
        const SizedBox(height: 8),
        // 이름 (특정 단어 "보라"만 색상 변경)
        RichText(
          text: TextSpan(
            children: snack.name.split('보라').expand((part) {
              return [
                TextSpan(
                  text: '보라',
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Color(0xFF583BBF), // 보라색 적용
                  ),
                ),
                TextSpan(
                  text: part,
                  style: const TextStyle(
                    fontSize: 16,
                    fontWeight: FontWeight.bold,
                    color: Colors.black, // 나머지는 검은색
                  ),
                ),
              ];
            }).skip(1).toList(),
          ),
        ),
        const SizedBox(height: 4),
        // 가격
        Text(
          snack.price,
          style: const TextStyle(
            fontSize: 14,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }
}

class SnackItem {
  final String imagePath;
  final String name;
  final String price;

  SnackItem({
    required this.imagePath,
    required this.name,
    required this.price,
  });
}

// 공지사항
class NotificationCenter extends StatelessWidget {
  final List<Map<String, dynamic>> notices; // 공지사항 리스트 받기

  const NotificationCenter({Key? key, required this.notices}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // 공지사항 Header
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  '공지사항',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                TextButton(
                  onPressed: () {},
                  child: const Text(
                    '더보기',
                    style: TextStyle(color: Colors.purple),
                  ),
                ),
              ],
            ),
          ),
          const Divider(color: Colors.purple, thickness: 0.5, height: 1),
          // 공지사항 리스트
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: ListView.builder(  // ListView.builder를 사용하여 동적 데이터 처리
              shrinkWrap: true,  // ListView가 부모의 크기만큼만 크기를 차지하게 해줌
              physics: const NeverScrollableScrollPhysics(),  // 부모가 스크롤을 처리하도록 설정
              itemCount: notices.length,  // 데이터의 갯수만큼 아이템을 생성
              itemBuilder: (context, index) {
                final notice = notices[index];
                final rawDate = notice['regDate'] ?? '';
                String formattedDate = '';

                if (rawDate.isNotEmpty) {
                  try {
                    DateTime parsedDate = DateTime.parse(rawDate);
                    formattedDate = DateFormat('yyyy-MM-dd').format(parsedDate);
                  } catch (e) {
                    formattedDate = 'Invalid date'; // 날짜 변환 실패 시 기본값 설정
                  }
                }
                return Padding(
                  padding: const EdgeInsets.only(bottom: 8.0),
                  child: _buildNoticeItem(
                    title: notice['title'] ?? '',
                    date: formattedDate,
                  ),
                );
              },
            ),
          ),

          const Divider(color: Colors.purple, thickness: 0.5, height: 1),
          // 고객센터
          Padding(
            padding: const EdgeInsets.all(12.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: const [
                Text(
                  '고객센터',
                  style: TextStyle(
                    fontWeight: FontWeight.bold,
                    fontSize: 20,
                  ),
                ),
                SizedBox(height: 8),
                Text('전화번호: 010-8753-8710'),
                SizedBox(height: 4),
                Text(
                  '고객센터 운영시간: 평일 (09:00 - 18:00) / 주말 및 공휴일 (09:00 - 14:00)',
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildNoticeItem({required String title, required String date}) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        Expanded(
          child: Text(
            title,
            style: const TextStyle(
              fontSize: 14,
            ),
          ),
        ),
        const SizedBox(width: 8),
        Text(
          date,
          style: const TextStyle(
            fontSize: 12,
            color: Colors.grey,
          ),
        ),
      ],
    );
  }
}



