import 'package:cinema_flutter/notifications/snackbar.dart';
import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:cinema_flutter/widget/custom_drawer.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {

  final _formKey = GlobalKey<FormState>();

  bool _isPasswordVisible = false;      // 비밀번호 노출 여부
  bool _rememberMe = false;             // 자동 로그인
  bool _rememberId = false;             // 아이디 저장

  TextEditingController _usernameController = TextEditingController();
  TextEditingController _passwordController = TextEditingController();

    // 🔒 안전한 저장소
  final storage = const FlutterSecureStorage();
  String? _username;

  @override
  void initState() {
    super.initState();
    _loadUseranme();        // 저장된 아이디 가져오기
  }

  // 저장된 아이디 가져오기 (아이디 저장 했을 때)
  void _loadUseranme() async {
    _username = await storage.read(key: 'username');
    if( _username != null ) {
    setState(() {
      _usernameController.text = _username!;  // 저장된 아이디를 텍스트 필드에 넣기
      _rememberId = true;  // 체크박스를 체크된 상태로 설정
    });
    }
  }

  @override
  Widget build(BuildContext context) {

    // Provider 선언
    UserProvider userProvider = Provider.of<UserProvider>(context, listen: false);
    
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
              TextFormField(
                autofocus: true,
                controller: _usernameController,
                validator: (value) {},
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  label: Icon(Icons.person),
                  hintText: "아이디를 입력해주세요."
                ),
              ),
              SizedBox(height: 20,),
              TextFormField(
                obscureText: !_isPasswordVisible,
                controller: _passwordController,
                validator: (value) {},
                decoration: InputDecoration(
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15.0),
                  ),
                  label: Icon(Icons.lock),
                  hintText: "비밀번호를 입력해주세요.",
                  //prefixIcon: Icon(Icons.lock_outline_rounded),
                  suffixIcon: IconButton(
                    icon: 
                      Icon(
                        _isPasswordVisible
                        ? Icons.visibility_off
                        : Icons.visibility
                      ),
                    onPressed: () {
                      setState(() {
                        _isPasswordVisible = !_isPasswordVisible;
                      });
                    }, 
                  ),
                ),
              ),
              SizedBox(height: 10),
              // 자동 로그인 & 아이디 저장
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Checkbox(value: _rememberMe, onChanged: (bool? value) {
                    setState(() {
                      _rememberMe = value!;
                    });
                  }),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _rememberMe = !_rememberMe;
                      });
                    },
                    child: Text("자동로그인"),
                  ),
                  Checkbox(value: _rememberId, onChanged: (bool? value) {
                    setState(() {
                      _rememberId = value!;
                    });
                  }),
                  GestureDetector(
                    onTap: () {
                      setState(() {
                        _rememberId = !_rememberId;
                      });
                    },
                    child: Text("아이디 저장"),
                  ),
                ],
              ),
              SizedBox(height: 20),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  ElevatedButton(
                    onPressed: () async {
                      // 로그인 로직 추가 가능
                      // 유효성 검사
                      print(_usernameController.text);
                      print( _passwordController.text);
                      // if( !_formKey.currentState!.validate() ) {
                      //     return;
                      // }

                      final username = _usernameController.text;
                      final password = _passwordController.text;

                          // username이나 password가 비어있다면
                      if (username.isEmpty || password.isEmpty) {
                      // 사용자에게 알림 (Snackbar)
                      Snackbar(
                        text: '아이디와 비밀번호를 입력하세요.',
                        icon: Icons.error,
                        backgroundColor: Colors.red,
                      ).showSnackbar(context);
                        return;
                      }

                      // 🔐 로그인 요청
                      await userProvider.login(
                          username, password, 
                          rememberId: _rememberId,
                          rememberMe: _rememberMe
                          );

                      if( userProvider.isLogin ) {
                        print('로그인 성공');

                        Snackbar(
                          text: '로그인에 성공했습니다.',
                          icon: Icons.check_circle,
                          backgroundColor: Colors.green,
                        ).showSnackbar(context);

                        // 메인으로 이동
                        //Navigator.pop(context);
                        userProvider.selectedIndex=2;
                        Navigator.pushReplacementNamed(context, '/main');
                        return;
                      }
                      print('로그인 실패');
                      Snackbar(
                        text: '로그인에 실패했습니다.',
                        icon: Icons.error,
                        backgroundColor: Colors.red,
                      ).showSnackbar(context);
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