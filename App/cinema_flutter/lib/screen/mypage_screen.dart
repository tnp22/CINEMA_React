import 'package:flutter/material.dart';
import 'package:cinema_flutter/widget/custom_drawer.dart';

class MypageScreen extends StatefulWidget {
  const MypageScreen({super.key});

  @override
  State<MypageScreen> createState() => _MypageScreenState();
}

class _MypageScreenState extends State<MypageScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: CustomDrawer(),
      body: Container(
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Text("마이페이지", style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),),
              ElevatedButton(onPressed: (){}, child: Text("내정보수정")),
              ElevatedButton(onPressed: (){}, child: Text("예매내역")),
              ElevatedButton(onPressed: (){}, child: Text("문의내역")),
            ],
          ),
        ),
      )
    );
  }
}