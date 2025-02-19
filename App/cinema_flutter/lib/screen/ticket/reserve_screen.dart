import 'package:cinema_flutter/model/users.dart';
import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:cinema_flutter/service/ticket_service.dart';
import 'package:cinema_flutter/widget/reserveCard.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class ReserveScreen extends StatefulWidget {
  const ReserveScreen({super.key});

  @override
  State<ReserveScreen> createState() => _ReserveScreenState();
}

class _ReserveScreenState extends State<ReserveScreen> {
  final ticket_service = TicketService();
  List<dynamic> reservationList = [];

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final userProvider = Provider.of<UserProvider>(context, listen: false);
      final user = userProvider.userInfo;

      if (user is Users) {
        getdata(user.username as String);
      } else {
        print("userInfo가 Users 타입이 아닙니다: ${user.runtimeType}");
      }
    });
  }

  void getdata(String username) async {
    print("username : $username");

    try {
      Response response = await ticket_service.rsList(username);
      var data = response.data;

      print("데이타 : ${data["reservationList"]["list"]}");
      print("영화제목 : ${data["reservationList"]["list"][0]["title"]}");
      print("타입 : ${data["reservationList"]["list"].runtimeType}");

      setState(() {
        reservationList = data["reservationList"]["list"];
      });
    } catch (e) {
      print("데이터 불러오기 실패: $e");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("예매내역"),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Expanded( // Column 내부에서 ListView를 감싸야 함
              child: reservationList.isEmpty
                  ? Center(child: Text("예약된 내역이 없습니다."))
                  : ListView.builder(
                      itemCount: reservationList.length,
                      itemBuilder: (context, index) {
                        final reserve = reservationList[index];
                        return ReserveCard(
                          imageUrl: "http://10.0.2.2:8080/files/img?id=${reserve["file"]}",
                          title: "${reserve["title"]}",
                          date: "${reserve["date"]} / ${reserve["time"]}",
                          seat: "${reserve["theater"]} / ${reserve["seat"]}",
                          id: reserve["id"]!,
                          onTap: () {
                            print("카드 클릭됨: ${reserve["id"]}");
                            payment(reserve["id"]);
                          },
                        );
                      },
                    ),
            ),
          ],
        ),
      ),
    );
  }
  
  void payment(String id) {
    Navigator.pushNamed(context, "/payment",
    arguments: {
      "Impid" : id
    });
  }
}
