import 'dart:typed_data';

import 'package:dio/dio.dart';

class MovieService {
  final Dio dio = Dio();
  final String host = 'http://10.0.2.2:8080';

  // 홈 화면 조회
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

  // 리뷰리스트 조회
  Future<Map<String, dynamic>> reviewList(String id, String username) async{
    var url = "$host/review/list?id=$id&username=$username";
    dynamic list;
    try{
      Response response = await dio.get(url);
      return response.data as Map<String, dynamic>;
    }catch(e){
      print(e);
    }
    return list;
  }

  // 영화정보 조회
  Future<Map<String, dynamic>> movieInfo(String id) async{
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
  Future<String?> getUser(String userId) async {
    var url = "$host/usersss/profile?id=$userId"; // 사용자 정보 가져오는 URL
    try {
      Response response = await dio.get(url);
      if (response.statusCode == 200) {
        var responseData = response.data;
        if (responseData == null)
          return null;
        if (responseData is! Map<String, dynamic>)
          return null;
        if (!responseData.containsKey("orifile") || responseData["orifile"] == null)
          return null;
        var orifile = responseData["orifile"];
        if (orifile is! Map<String, dynamic> || !orifile.containsKey("id"))
          return null;
        String orifileId = orifile["id"].toString();
        return orifileId;
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
}
}