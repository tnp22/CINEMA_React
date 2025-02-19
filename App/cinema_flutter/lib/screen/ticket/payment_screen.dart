import 'package:cinema_flutter/service/ticket_service.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:intl/date_symbol_data_local.dart'; // 추가

class PaymentScreen extends StatefulWidget {
  final Map<String, dynamic>? arguments;
  const PaymentScreen({Key? key, this.arguments}) : super(key: key);

  @override
  State<PaymentScreen> createState() => _PaymentScreen();
}

class _PaymentScreen extends State<PaymentScreen> {
  // Service
  final ticket_service = TicketService();

  Map<String, String?> obj = {};

  // State
  String? orderId;
  String? money;
  String? userName;
  String? person;
  String? seat;
  String? id;
  String? movieId;
  var data;
  var time;
  String regDate = "";

  String? formattedDate;

  // 테이블 행 생성 함수
  TableRow _buildTableRow(String title, String value) {
    return TableRow(
      children: [
        Padding(
          padding: EdgeInsets.all(8.0),
          child: Text(
            title,
            style: TextStyle(fontWeight: FontWeight.bold),
            textAlign: TextAlign.center, // 왼쪽 열 가운데 정렬
          ),
        ),
        Padding(
          padding: EdgeInsets.all(8.0),
          child: Text(value),
        ),
      ],
    );
  }

  @override
  void initState() {
    super.initState();
    initializeDateFormatting('ko_KR', null).then((_) { // 로케일 데이터 초기화
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final args = ModalRoute.of(context)!.settings.arguments;
        print("payment 정보 불러오기");
        if (args != null) {
          obj = args as Map<String, String?>;
          print("obj : $obj");
          if(obj["Impid"] != null){
            // 예매내역에서 예매정보 불러오기
            print("예매내역에서 접근");
            setState(() {
              orderId = obj["Impid"];
              getReserveData();
            });
          }else{
            // 결제완료 후 예매정보 불러오기
            setState(() {
              orderId = obj["orderId"] as String;
              money = obj["money"] as String;
              userName = obj["userName"] as String;
              person = obj["person"] as String;
              seat = obj["seat"] as String;
              id = obj["id"] as String;
              movieId = obj["movieId"] as String;
              print(movieId);
              getReserveData();
            });
          }
        }
      });
    });
  }

  void getReserveData() async {
    String id = orderId as String;
    print("아이디 : $id");
    Response response = await ticket_service.reserveSelect(id);
    print("리스폰 데이터 ${response.data}");
    setState(() {
      data = response.data;
      regDate = data["reserve"]["regDate"];
      print("무비아이디 있나? ${movieId}");
      if(movieId == null){
        // 예매내역에서 접근시 movieId 없음
        print("movieId 없음 ${data["movie"]["files"]["id"]}");
        movieId = data["movie"]["files"]["id"];
      }
      print("regDate: $regDate"); // "2025-02-17T07:55:52.000+00:00" 확인
      if (regDate.isNotEmpty) {
        DateFormat dateFormat = DateFormat("yyyy-MM-dd'T'HH:mm:ss.SSSZ"); // 시간대 포함 형식
        DateTime dateObj = dateFormat.parse(regDate); // DateFormat으로 파싱
        print("시간 : $dateObj");

        // 원하는 포맷으로 날짜를 변환
        DateFormat outputFormat = DateFormat('yyyy-MM-dd (EEE) HH:mm', 'ko_KR');
        formattedDate = outputFormat.format(dateObj);

        // 포맷된 시간 저장
        time = formattedDate;
        print("시간 : $time");
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("예매 완료")),
      body: Stack(
        children: [
          // 결제 정보와 영화 포스터 영역
          SingleChildScrollView(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Text(
                  "결제가 완료되었습니다.",
                  style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                ),
                SizedBox(height: 20),

                // 영화 포스터 (임시 이미지)
                movieId == null
                    ? Center(child: CircularProgressIndicator())
                    : Image.network(
                        "http://10.0.2.2:8080/files/img?id=$movieId",
                        width: 200,
                        height: 250,
                        fit: BoxFit.cover,
                      ),
                SizedBox(height: 20),

                // 결제 정보 테이블
                data == null
                    ? Center(child: CircularProgressIndicator())
                    : Table(
                        border: TableBorder.all(),
                        columnWidths: {
                          0: FixedColumnWidth(MediaQuery.of(context).size.width * 0.2), // 왼쪽 열: 30%
                          1: FixedColumnWidth(MediaQuery.of(context).size.width * 0.8), // 오른쪽 열: 70%
                        },
                        children: [
                          _buildTableRow("영화명", "${data["reserve"]["title"]}"),
                          _buildTableRow("일시", "${data["reserve"]["date"]} ${data["reserve"]["time"]}"),
                          _buildTableRow("극장", "${data["reserve"]["areaSub"]} VORA"),
                          _buildTableRow("거래일시", "$time"),
                          _buildTableRow("상영관", "${data["reserve"]["theater"]}"),
                          _buildTableRow("거래상태", "승인"),
                          _buildTableRow("좌석", "${data["reserve"]["seat"]}"),
                          _buildTableRow("인원", "총 ${data["reserve"]["person"]}명"),
                          _buildTableRow("승인번호", "${data["reserve"]["id"]}"),
                        ],
                      ),
                SizedBox(height: 20),

                // 하단 공간을 만들어서 드래그시 마지막까지 보이도록 함
                SizedBox(height: 80), // 하단 버튼 공간 크기만큼 추가적인 공간
              ],
            ),
          ),

          // 하단 버튼 영역, 배경을 투명하게
          Align(
            alignment: Alignment.bottomCenter,
            child: Container(
              padding: EdgeInsets.all(16.0),
              width: double.infinity,
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.5), // 버튼 주변 배경 투명 (반투명)
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _buildButton("결제API"),
                  SizedBox(width: 10),
                  _buildButton("예매 내역"),
                  SizedBox(width: 10),
                  _buildButton("메인으로"),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 버튼 스타일 함수
  Widget _buildButton(String text) {
    return ElevatedButton(
      onPressed: () {
        print(text);
        switch(text){
          case '예매 내역' : Navigator.pushNamed(context, "/reserve");
          case '메인으로' : Navigator.pushReplacementNamed(context, "/main");
          case '결제API' :Navigator.pushNamed(context, "/ppp");
        }
      },
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.blue, // 버튼 배경색 (원래대로 복구)
        foregroundColor: Colors.white, // 버튼 글자색
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 10),
        textStyle: TextStyle(fontSize: 16),
      ),
      child: Text(text),
    );
  }
}
