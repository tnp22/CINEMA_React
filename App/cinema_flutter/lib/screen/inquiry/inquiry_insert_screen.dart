import 'package:cinema_flutter/notifications/snackbar.dart';
import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:cinema_flutter/service/inquiry_service.dart';
import 'package:cinema_flutter/service/user_service.dart';
import 'package:flutter/material.dart';
import 'package:cinema_flutter/widget/custom_drawer.dart';
import 'package:provider/provider.dart';

class InquiryInsertScreen extends StatefulWidget {
  const InquiryInsertScreen({super.key});

  @override
  State<InquiryInsertScreen> createState() => _JoinScreenState();
}

class _JoinScreenState extends State<InquiryInsertScreen> {


  final _formKey = GlobalKey<FormState>();

  int? _type = 1;
  String? _title;         //아이디
  String? _content;
  String? _password;      //
  bool _isSwitched = false;  

  void _toggleSwitch(bool value) {
    setState(() {
      _isSwitched = value;  // 스위치 상태가 바뀔 때마다 값을 갱신
      if(_isSwitched){
        _type =0;
      }
      else{
        _type=1;
        _password = null;
      }
    });
  }

  InquiryService inquiryService = InquiryService();

  @override
  Widget build(BuildContext context) {
    
    UserProvider userProvider = Provider.of<UserProvider>(context, listen: true);

    if( !userProvider.isLogin){
      WidgetsBinding.instance.addPostFrameCallback( (_) {
        if(Navigator.canPop(context)){
          Navigator.pop(context);
        }
        Navigator.pushNamed(context, '/login');
      });
    }

    return Scaffold(
      appBar: AppBar(
        title: Text("고객센터"),
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
              Row(
                  //mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: <Widget>[
                    Text(
                      '비밀글',
                      style: TextStyle(fontSize: 20),
                    ),
                    SizedBox(width: 10),
                    Switch(
                      value: _isSwitched,  // 스위치의 현재 상태
                      onChanged: _toggleSwitch,  // 스위치 상태가 변경되면 호출되는 함수
                    ),
                  ],
                ),
                _isSwitched ?
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
                  hintText: "비밀번호를 입력해주세요.",
                  label: Text("비밀번호"),
                ),
                onChanged: (value){
                  setState(() {
                    _password = value;
                  });
                },
              )
              :
              Container(),
              SizedBox(height: 10,),
              // Align(
              //   alignment: Alignment.centerLeft,
              //   child: Text("제목", style: TextStyle(fontSize: 18)),
              // ),
              TextFormField(
                autofocus: true,
                validator: (value) {
                    if(value == null || value.isEmpty){
                      return '제목을 다시 입력해주세요';
                    }
                    return null;
                },
                
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  hintText: "제목을 입력해주세요.",
                  label: Text("제목"),
                ),
                onChanged: (value){
                    setState(() {
                      _title = value;
                    });
                  },
              ),
              SizedBox(height: 10,),
              TextFormField(
                        autofocus: true,
                        validator: (value) {
                          if (value == null || value.isEmpty) {
                            return '글을 다시 입력해주세요';
                          }
                          return null;
                        },
                        maxLines: 10,  // 최대 5줄까지 입력 가능
                        minLines: 3,  // 최소 3줄로 시작
                        decoration: InputDecoration(
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(15.0),
                          ),
                          hintText: "글을 입력해주세요.",
                          label: Text("내용"),
                          contentPadding: EdgeInsets.symmetric(vertical: 15.0, horizontal: 10.0), // 수직, 수평 여백
                        ),
                        onChanged: (value) {
                          setState(() {
                            _content = value;  // 입력된 내용을 _content 변수에 저장
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

            bool result = await inquiryService.insert(
            {
              'type' : _type!,
              'username' : userProvider.userInfo.username,
              'password' : _password,
              'title' : _title!,
              'content' : _content!
            }
            );

            if(result){
              print("문의 성공!");
              Snackbar(
                text: "문의 작성이 되었습니다.",
                icon: Icons.check_circle,
                backgroundColor: Colors.greenAccent              
              ).showSnackbar(context);
              Navigator.pop(context);
              setState(() {
                userProvider.selectedIndex=5;
                Navigator.pushNamed(context, '/main');
              });
              
            } else{
              print("문의 실패");
              Snackbar(
                text: "문의 작성에 실패하였습니다.",
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
                  "작성",
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

