import 'package:cinema_flutter/screen/ticket/ticket_screen.dart';
import 'package:cinema_flutter/service/ticket_service.dart';
import 'package:flutter/material.dart';
/* 포트원 V1 결제 모듈을 불러옵니다. */
import 'package:portone_flutter/iamport_payment.dart';
/* 포트원 V1 결제 데이터 모델을 불러옵니다. */
import 'package:portone_flutter/model/payment_data.dart';
import 'package:intl/intl.dart';
import 'package:intl/date_symbol_data_local.dart';

class PayScreen extends StatefulWidget {
  @override
  _PayScreenState createState() => _PayScreenState();
}

class _PayScreenState extends State<PayScreen> {
  final ticket_service = TicketService();
  String? orderId;
  String? money;
  String? userName;
  String? person;
  String? seat;
  String? id;
  String? movieId;

  @override
  void initState() {
    super.initState();
    initializeDateFormatting('ko_KR', null).then((_) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        final args = ModalRoute.of(context)!.settings.arguments;
        print("payment 정보 불러오기");
        if (args != null) {
          final obj = args as Map<String, String?>;
          print("obj : \$obj");
          if (obj["Impid"] != null) {
            print("예매내역에서 접근");
            setState(() {
              orderId = obj["Impid"];
              getReserveData();
            });
          } else {
            setState(() {
              orderId = obj["orderId"];
              money = obj["money"];
              userName = obj["userName"];
              person = obj["person"];
              seat = obj["seat"];
              id = obj["id"];
              movieId = obj["movieId"];
              print(movieId);
              getReserveData();
            });
          }
        }
      });
    });
  }

  void getReserveData() {
    // 예매 정보 불러오는 로직 (구현 필요)
  }

  @override
  Widget build(BuildContext context) {
    return IamportPayment(
      appBar: AppBar(
        title: Text('앱 결제'),
      ),
      initialChild: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Padding(padding: EdgeInsets.symmetric(vertical: 15)),
            Text('잠시만 기다려주세요...', style: TextStyle(fontSize: 20)),
          ],
        ),
      ),
      userCode: 'imp00366386',
      data: PaymentData(
        pg: 'kcp',
        payMethod: 'card',
        name: '영화 예매',
        merchantUid: "$orderId",
        amount: 100,
        buyerName: userName ?? '홍길동',
        buyerTel: '010-1234-5678',
        buyerEmail: 'test@naver.com',
        buyerAddr: '테스트 테스트대로',
        buyerPostcode: '1234-1234', // 결제자 우편번호
        appScheme: 'example',
        cardQuota: [2, 3],
      ),
      callback: (Map<String, String> result) {
        Navigator.pushReplacementNamed(context,'payment',
          arguments: {
            "orderId" : orderId as String,
            "money" : money.toString(),
            "userName" : userName as String,
            "person" : person.toString(),
            "seat" : seat,
            "id" : id as String,
            "movieId" : movieId as String,
          }
        );
      },
    );
  }
}