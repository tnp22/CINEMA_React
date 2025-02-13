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

  // 프로필 이미지 불러오기 
  Future<Map<String, dynamic>> getUser(String userId) async {
  var url = "$host/usersss/profile?id=$userId"; // 사용자 정보 가져오는 URL
  dynamic list;
  try {
    // 사용자 정보 요청
    Response response = await dio.get(url);
    var responseData = response.data as Map<String, dynamic>;

    // orifile의 id를 추출
    String orifileId = responseData['orifile']['id'];

    // 이미지 요청을 위해 orifileId를 사용하여 파일 가져오기
    final imageResponse = await dio.get(
      '$host/files/img',
      queryParameters: {'id': orifileId}, // orifileId를 파라미터로 전달
      options: Options(responseType: ResponseType.bytes), // 바이너리 응답 받기
    );

    // 이미지 데이터를 반환받아서 Map에 추가
    responseData['imageBytes'] = imageResponse.data;

    return responseData;  // 사용자 정보와 이미지 데이터를 포함한 Map 반환
  } catch (e) {
    print(e);
  }
  return list;
}

  Future<Uint8List> getImage(String fileId) async {
  try {
    final response = await dio.get(
      '$host/files/img',
      queryParameters: {'id': fileId},
      options: Options(responseType: ResponseType.bytes), // 응답을 바이너리로 받음
    );

    if (response.statusCode == 200) {
      return Uint8List.fromList(response.data);
    } else {
      print("이미지 응답 실패 (HTTP ${response.statusCode})");
      return Uint8List(0); // 빈 이미지 반환
    }
  } catch (e) {
    print('이미지 요청 실패: $e');
    return Uint8List(0); // 에러 발생 시 빈 데이터 반환
  }
}
}