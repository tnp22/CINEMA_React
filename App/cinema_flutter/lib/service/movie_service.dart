import 'dart:typed_data';

import 'package:dio/dio.dart';

class MovieService {
  final Dio dio = Dio();
  final String host = 'http://10.0.2.2:8080';

  // 데이터 목록 조회
  Future<Map<String, dynamic>> list() async{
    var url = "$host/";
    dynamic list;
    try{
      Response response = await dio.get(url);
      return response.data as Map<String, dynamic>;
    }catch(e){
      print(e);
    }
    return list;
  }

  // 데이터 목록 조회
  Future<Map<String, dynamic>> select(String id) async{
    var url = "$host/movie/movieInfo?id=$id";
    dynamic list;
    try{
      Response response = await dio.get(url);
      return response.data as Map<String, dynamic>;
    }catch(e){
      print(e);
    }
    return list;
  }

  // 프로필 이미지 불러오기 
  Future<String> getUser(String userId) async {
  var url = "$host/usersss/profile?id=$userId"; // 사용자 정보 가져오는 URL
  try {
    // 사용자 정보 요청
    Response response = await dio.get(url);
    var responseData = response.data as Map<String, dynamic>;

    // orifile의 id를 추출
    String orifileId = responseData['orifile']['id'];

    return orifileId;  // 사용자 정보와 이미지 데이터를 포함한 Map 반환
  } catch (e) {
    print(e);
    return "";
  }
}
}