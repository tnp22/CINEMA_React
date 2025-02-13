import 'package:flutter/material.dart';

class MovieInfoScreen extends StatefulWidget {
  const MovieInfoScreen({super.key});

  @override
  State<MovieInfoScreen> createState() => _MovieInfoScreenState();
}

class _MovieInfoScreenState extends State<MovieInfoScreen> {

  // 🧊 state
  String? movieId;

  @override
  void initState() {
    super.initState();

    // id 파라미터 넘겨받기
    WidgetsBinding.instance.addPostFrameCallback( (_) {
      final args = ModalRoute.of(context)!.settings.arguments;

      if( args is String ) {
        setState(() {
          movieId = args;
          print("id : $movieId");
        
        });
      }
      
    });

  }
  @override
  Widget build(BuildContext context) {

    return Scaffold(
      appBar: AppBar(title: Text("영화 정보")),
      body: Center(
        child: Text("선택한 영화 ID: $movieId"), // 전달된 movieId 출력
      ),
    );
  }
}