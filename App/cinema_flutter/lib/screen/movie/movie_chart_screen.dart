import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:intl/intl.dart';
import 'package:provider/provider.dart';

class MovieChartScreen extends StatefulWidget {
  const MovieChartScreen({super.key});

  @override
  State<MovieChartScreen> createState() => _MovieChartScreenState();
}

class _MovieChartScreenState extends State<MovieChartScreen> with SingleTickerProviderStateMixin {
  late TabController _tabController;
  late ScrollController _scrollController1;
  late ScrollController _scrollController2;

  List<dynamic> movieList = [];
  List<dynamic> expectList = [];

  bool isLoading = true;
  bool isLoadingMore = false;

  int moviePage = 1;
  int expectPage = 1;

  bool isLastMoviePage = false;
  bool isLastExpectPage = false;

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
    _tabController.addListener(_onTabChanged);

    _scrollController1 = ScrollController()..addListener(_scrollListener);
    _scrollController2 = ScrollController()..addListener(_scrollListener);

    fetchMovies();
  }

  @override
  void dispose() {
    _tabController.dispose();
    _scrollController1.dispose();
    _scrollController2.dispose();
    super.dispose();
  }

  void _onTabChanged() {
    fetchMovies(); // 탭 변경 시 새 데이터 요청
  }

  Future<void> fetchMovies() async {
  if (isLoadingMore) return;

  bool isMovieTab = _tabController.index == 0;
  int currentPage = isMovieTab ? moviePage : expectPage;
  bool isLastPage = isMovieTab ? isLastMoviePage : isLastExpectPage;

  if (isLastPage) return; // 🔥 마지막 페이지이면 즉시 반환

  setState(() => isLoadingMore = true);

  try {
    String host = "http://192.168.30.8:8080";
    String type = isMovieTab ? "movie" : "expect";
    var url = "$host/movie/movieChart?page=$currentPage&type=$type";

    Response response = await Dio().get(url);
    var data = response.data as Map<String, dynamic>;

    List<dynamic> newMovies = data["moviePageInfo"]["list"] ?? [];
    List<dynamic> newExpect = data["expectPageInfo"]["list"] ?? [];

    // 🚀 디버깅용 출력
    print("Fetched ${newMovies.length} movies, ${newExpect.length} expects");

    setState(() {
      if (isMovieTab) {
        if (newMovies.isEmpty) {
          isLastMoviePage = true; // ✅ 마지막 페이지 도달
        } else {
          movieList.addAll(newMovies);
          if(newMovies.length < 8){
            isLastMoviePage = true;
          }
          moviePage++;
        }
      } else {
        if (newExpect.isEmpty) {
          isLastExpectPage = true; // ✅ 마지막 페이지 도달
        } else {
          expectList.addAll(newExpect);
          if(newExpect.length < 8){
            isLastExpectPage = true;
          }
          expectPage++;
        }
      }
    });
  } catch (e) {
    print("Error: $e");
  } finally {
    setState(() => isLoadingMore = false);
  }
}


  void _scrollListener() {
    if (_tabController.index == 0 &&
        _scrollController1.position.pixels >= _scrollController1.position.maxScrollExtent - 200) {
      fetchMovies();
    } else if (_tabController.index == 1 &&
        _scrollController2.position.pixels >= _scrollController2.position.maxScrollExtent - 200) {
      fetchMovies();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("영화 차트")),
      body: Column(
        children: [
          TabBar(
            controller: _tabController,
            tabs: [
              Tab(text: "영화 차트"),
              Tab(text: "상영 예정작"),
            ],
          ),
          Expanded(
            child: TabBarView(
              controller: _tabController,
              children: [
                MovieList(movies: movieList, scrollController: _scrollController1, isLoadingMore: isLoadingMore),
                MovieList(movies: expectList, scrollController: _scrollController2, isLoadingMore: isLoadingMore),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class MovieList extends StatelessWidget {
  final List<dynamic> movies;
  final ScrollController scrollController;
  final bool isLoadingMore;

  const MovieList({Key? key, required this.movies, required this.scrollController, required this.isLoadingMore})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListView.builder(
      controller: scrollController,
      itemCount: movies.length + (isLoadingMore ? 1 : 0),
      itemBuilder: (context, index) {
        if (index == movies.length) {
          return Center(child: CircularProgressIndicator());
        }
        return MovieItem(movie: movies[index]);
      },
    );
  }
}

class MovieItem extends StatelessWidget {
  final dynamic movie;

  const MovieItem({Key? key, required this.movie}) : super(key: key);

  @override
  Widget build(BuildContext context) {

    UserProvider userProvider = Provider.of<UserProvider>(context, listen: true);

    String formattedDate = DateFormat('yyyy-MM-dd').format(DateTime.parse(movie["releaseDate"]));

    return GestureDetector(
      onTap: () {
        Navigator.pushNamed(context, "/movieInfo", arguments: movie["id"]);
      },
      child: Card(
        margin: EdgeInsets.all(10),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        child: Row(
          children: [
            ClipRRect(
              borderRadius: BorderRadius.circular(10),
              child: Image.network(
                "http://192.168.30.8:8080/files/img?id=${movie["files"]["id"]}",
                width: 100,
                height: 150,
                fit: BoxFit.cover,
              ),
            ),
            SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    movie["title"],
                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 5),
                  Text(
                    "개봉일: $formattedDate",
                    style: TextStyle(color: Colors.grey),
                  ),
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 0, horizontal: 0),
                    child: ElevatedButton(
                      onPressed: () {
                        Navigator.pushNamed(context, "/ticket", 
                          arguments: {
                            "movieTitle": movie["title"].toString(),
                            "movieId": movie["id"].toString(),
                          }
                        );
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
          ],
        ),
      ),
    );
  }
}

