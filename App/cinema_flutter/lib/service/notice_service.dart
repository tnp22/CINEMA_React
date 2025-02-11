import 'package:dio/dio.dart';

class NoticeService {
  final Dio dio = Dio();
  final String host = 'http://10.0.2.2:8080';
  // 데이터 목록 조회
  Future<Map<String, dynamic>> list(int page,int size,
    int option,String keyword) async{
    var url = 
    "$host/notice/list?page=$page&size=$size&option=$option&keyword=$keyword";
    dynamic list;
    try{
      Response response = await dio.get(url);
      print("::::: response - body :::::");
      print(response.data);
      // response.data :: List<dynamic>
      // -> list
      // -> List<Map<String, dynamic>
      return response.data as Map<String, dynamic>;
    }catch(e){
      print(e);
    }
    return list;
  }

  // Future<Uint8List> getImage(String fileId) async {
  // try {
  //   print("이미지 요청 시작: $fileId");

  //   final response = await dio.get(
  //     '$host/files/img',
  //     queryParameters: {'id': fileId},
  //     options: Options(responseType: ResponseType.bytes), // 응답을 바이너리로 받음
  //   );

  //   if (response.statusCode == 200) {
  //     print("이미지 응답 성공: ${response.data.length} bytes");
  //     return Uint8List.fromList(response.data);
  //   } else {
  //     print("이미지 응답 실패 (HTTP ${response.statusCode})");
  //     return Uint8List(0); // 빈 이미지 반환
  //   }
  // } catch (e) {
  //   print('이미지 요청 실패: $e');
  //   return Uint8List(0); // 에러 발생 시 빈 데이터 반환
  // }
}
