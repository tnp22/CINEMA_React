import 'package:cinema_flutter/service/movie_service.dart';
import 'package:flutter/material.dart';

class MovieInfoScreen extends StatefulWidget {
  const MovieInfoScreen({super.key});

  @override
  State<MovieInfoScreen> createState() => _MovieInfoScreenState();
}

class _MovieInfoScreenState extends State<MovieInfoScreen> {

  // 🧊 state
  String? id;
  final movieService = MovieService();
  late Future<Map<String, dynamic>?> movie;

  

  @override
  void initState() {
    super.initState();

    // id 파라미터 넘겨받기
    WidgetsBinding.instance.addPostFrameCallback( (_) {
      final args = ModalRoute.of(context)!.settings.arguments;
      if( args is String ) {
        print('넘어오는 중이다');
        setState(() {
          id = args;
          print("id : $id");
          
          // 게시글 조회 요청
          movie = movieService.select(id!);
        });
      }
      
    });
  }

  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(title: Text("영화 정보")),
      body: Center(
        child: Text("선택한 영화 ID: $id"), // 전달된 movieId 출력
      ),
    );
  }
}