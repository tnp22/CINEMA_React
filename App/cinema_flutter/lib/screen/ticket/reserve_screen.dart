import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:cinema_flutter/service/ticket_service.dart';
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
  
  void getdata(String username) async{
    print("username : $username");
      Response response = await ticket_service.rsList(username);
      // print("데이타 : $response");
      // print("타입 : ${response.runtimeType}");
      var data = response.data;
      print("데이타 : ${data["reservationList"]["list"]}");
      print("타입 : ${data["reservationList"]["list"].runtimeType}");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("예매내역"),
      ),body: SafeArea(
        child: Column(
          children: [
            Consumer<UserProvider>(
              builder: (context, userProvider, child) {
                final user = userProvider.userInfo;
                print("유저 정보 : ${user.username}");
                getdata(user.username as String);
                return SizedBox.shrink();
              },
            ),
          ],
        )
      ),
    );
  }
}