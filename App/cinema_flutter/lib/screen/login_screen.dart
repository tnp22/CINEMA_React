import 'package:flutter/material.dart';
import 'package:cinema_flutter/widget/custom_drawer.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: CustomDrawer(),
      body: Container(
        padding: EdgeInsets.all(30.0),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Image.asset(
                'image/vora_purple_black.png',
                width: 100,
                height: 100,
              ),
              TextField(
                autofocus: true,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  label: Icon(Icons.person),
                  hintText: "아이디를 입력해주세요."
                ),
              ),
              SizedBox(height: 20,),
              TextField(
                obscureText: true,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  label: Icon(Icons.lock),
                  hintText: "비밀번호를 입력해주세요."
                ),
              ),
              SizedBox(height: 10),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  Row(
                    children: [
                      Checkbox(
                        value: true,
                        onChanged: (bool? value) {
                        },
                      ),
                      Text("아이디 저장"),
                    ],
                  ),
                  Row(
                    children: [
                      Checkbox(
                        value: false,
                        onChanged: (bool? value) {
                        },
                      ),
                      Text("자동 로그인"),
                    ],
                  ),
                ],
              ),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton(
                    onPressed: () {
                      // 로그인 로직 추가 가능
                    },
                    style: ElevatedButton.styleFrom(
                      minimumSize: Size(80, 50),
                      backgroundColor: Color(0xFF583BBF),
                      foregroundColor: Colors.white,
                      padding: EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                      ),
                    ),
                    child: Text(
                      "로그인",
                      style: TextStyle(fontSize: 18),
                    ),
                  ),
                  ElevatedButton(
                    onPressed: () {
                      Navigator.pushNamed(context, "/join", arguments: 'join');
                    },
                    style: ElevatedButton.styleFrom(
                      minimumSize: Size(80, 50),
                      backgroundColor: Colors.white,
                      foregroundColor: Colors.black,
                      padding: EdgeInsets.symmetric(horizontal: 40, vertical: 15),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(10),
                        side: BorderSide( // ✅ 경계선 추가
                          color: Colors.black, // 경계선 색상
                          width: 2.0,          // 경계선 두께
                        ),
                      ),
                    ),
                    child: Text(
                      "회원가입",
                      style: TextStyle(fontSize: 18),
                    ),
                  )
                ]
              ),
              
            ],
          ),
        ),
      )
    );
  }
}