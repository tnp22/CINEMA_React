import 'package:dio/dio.dart';

class TicketService {
  
  // 정보 조회
  Future<List<Map<String, dynamic>>> dateSelection(String id) async {
    Dio dio = Dio();
    var url = "http://10.0.2.2:8080/movie/dateSelection?id=${id}";
    List<Map<String, dynamic>> list = [];
    try {
      // print("아이디 : $id");
      var response = await dio.get(url);
      // print("::: response - body ::::");
      // print("조회");
      // print("데이타 : ${response.data}");
      var data = response.data as Map<String, dynamic>;

      // ticketList 가져오기
      var ticketList = data["ticketList"] as List<dynamic>; // 예매정보
      var movieId = data["movieId"];
      var movieTitle = data["movieTitle"];

      list.add({"ticketList" : ticketList});
      list.add({"movieId" : movieId});
      list.add({"movieTitle" : movieTitle});
      // print("리스트 $list");
      //조회 테스트
      // int count = 1;
      // for(var t in ticketList){
      //   print("$count번 티켓 리스트 : $t");
      //   count++;
      // }
      
    } catch (e) {
      print("에러 발생 $e");
    }
    return list;
  }

  // 좌석 선택
  Future<List<Map<String, dynamic>>> seatSelection(String theaterListId, String person) async {
    Dio dio = Dio();
    print("theaterListId : $theaterListId");
    print("person : $person");
    var url = "http://10.0.2.2:8080/movie/seatSelection?theaterListId=${theaterListId}&person=${person}";
    List<Map<String, dynamic>> list = [];
    try {
      // print("아이디 : $id");
      var response = await dio.get(url);
      print("::: response - body ::::");
      print("조회");
      print("데이타 : ${response.data}");
      var data = response.data as Map<String, dynamic>;

      print("정보 : $data");

      // seat정보 가져오기
      // 맵정보 MapData
      // 이미 예매한정보 ReservationSeat
      // 영화 ID MovieId
      // 영화 제목 MovieTitle
      // UUID UuuuuId
      // 로그인된 유저 이름 AuthUserName
      // 로그인된 유저 이메일 AuthUserEmail
      // 상영관 ID theaterId
      // 금액 Money
      // 인원 person


    } catch (e) {
      print("에러 발생 $e");
    }
    return list;
  }
}