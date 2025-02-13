import 'package:cinema_flutter/notifications/snackbar.dart';
import 'package:cinema_flutter/service/user_service.dart';
import 'package:flutter/material.dart';
import 'package:cinema_flutter/widget/custom_drawer.dart';

class JoinScreen extends StatefulWidget {
  const JoinScreen({super.key});

  @override
  State<JoinScreen> createState() => _JoinScreenState();
}

class _JoinScreenState extends State<JoinScreen> {


  final _formKey = GlobalKey<FormState>();

  String? _username;         //아이디
  String? _password;          //
  String? _confirmPassword;  //
  String? _name;
  String? _email;

  UserService userService = UserService();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
      ),
      
      body: SingleChildScrollView(
        
        padding: EdgeInsets.fromLTRB(30, 0, 30, 30),
          child: Form(
            key: _formKey,
            child: Column(
              children: [
              Image.asset(
                'image/vora_purple_black.png',
                width: 100,
                height: 100,
              ),
              Align(
                alignment: Alignment.centerLeft,
                child: Text("이름", style: TextStyle(fontSize: 18)),
              ),
              TextFormField(
                autofocus: true,
                validator: (value) {
                    if(value == null || value.isEmpty){
                      return '이름을 다시 입력해주세요';
                    }
                    return null;
                },
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  hintText: "이름을 입력해주세요."
                ),
                onChanged: (value){
                    setState(() {
                      _name = value;
                    });
                  },
              ),
              SizedBox(height: 20,),
              Align(
                alignment: Alignment.centerLeft,
                child: Text("아이디", style: TextStyle(fontSize: 18)),
              ),
              TextFormField(
                  validator: (value) {
                    if(value == null || value.isEmpty){
                      return '아이디를 다시 입력해주세요';
                    }
                    return null;
                  },
                autofocus: true,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  hintText: "아이디를 입력해주세요."
                ),
                onChanged: (value){
                    setState(() {
                      _username = value;
                    });
                },
              ),
              SizedBox(height: 20,),
              Align(
                alignment: Alignment.centerLeft,
                child: Text("비밀번호", style: TextStyle(fontSize: 18)),
              ),
              TextFormField(
                  validator: (value) {
                    if(value == null || value.isEmpty){
                      return '비밀번호를 다시 입력해주세요';
                    }
                    if(value.length < 2){
                      return '비밀번호는 2자 이상이어야 합니다.';
                    }
                    return null;
                  },
                obscureText: true,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  hintText: "비밀번호를 입력해주세요."
                ),
                onChanged: (value){
                  setState(() {
                    _password = value;
                  });
                },
              ),
              SizedBox(height: 5),
              TextFormField(
                  validator: (value) {
                    if(value == null || value.isEmpty){
                      return '비밀번호 확인을 입력해주세요';
                    }
                    if(value != _password){
                      return '비밀번호가 불일치 합니다.';
                    }
                    return null;
                  },
                obscureText: true,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  hintText: "설정하신 비밀번호를 다시 입력해주세요."
                ),
                  onChanged: (value){
                    setState(() {
                      _confirmPassword = value;
                    });
                  },
              ),
              SizedBox(height: 20),
              Align(
                alignment: Alignment.centerLeft,
                child: Text("이메일", style: TextStyle(fontSize: 18)),
              ),
              TextFormField(
                  validator: (value) {
                    if(value == null || value.isEmpty){
                      return '이메일을 입력해주세요';
                    }
                    bool emailValid = RegExp(
                      r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+"
                    ).hasMatch(value);
                    if(!emailValid){
                      return "유효한 이메일로 다시 입력해주세요";
                    }
                    return null;
                  },
                autofocus: true,
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  hintText: "이메일을 입력해주세요."
                ),
                onChanged: (value){
                  setState(() {
                    _email = value;
                  });
                },
              ),
              SizedBox(height: 15,),
              ElevatedButton(
                onPressed: () async {
                   // 회원가입 요청
            if(!_formKey.currentState!.validate()){
              return;
            }

            bool result = await userService.registerUser(
            {
              'username' : _username!,
              'password' : _password!,
              'name' : _name!,
              'email' : _email!
            }
            );

            if(result){
              print("회원 가입 성공!");
              Snackbar(
                text: "회원가입 설공!",
                icon: Icons.check_circle,
                backgroundColor: Colors.greenAccent              
              ).showSnackbar(context);
              Navigator.pop(context);
            } else{
              print("회원 가입 실패!");
              Snackbar(
                text: "회원가입 실패!",
                icon: Icons.check_circle,
                backgroundColor: const Color.fromARGB(255, 196, 64, 23)              
              ).showSnackbar(context);
            }
                },
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50),
                  backgroundColor: Color(0xFF583BBF),
                  foregroundColor: Colors.white,
                  padding: EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(0),
                  ),
                ),
                child: Text(
                  "회원가입",
                  style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ),
            ]
          )
          )
        )
      );
  }
}