import 'package:cinema_flutter/notifications/snackbar.dart';
import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:flutter/material.dart';
import 'package:cinema_flutter/widget/custom_drawer.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:provider/provider.dart';

class LogoutScreen extends StatefulWidget {
  const LogoutScreen({super.key});

  @override
  State<LogoutScreen> createState() => _LogoutScreenState();
}

class _LogoutScreenState extends State<LogoutScreen> {

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
              SizedBox(height: 10),
              ElevatedButton(
                    onPressed: () async {
                                        // 🔓 로그아웃 처리
                  userProvider.logout();
                  userProvider.selectedIndex=0;
                  Navigator.pushReplacementNamed(context, '/main');

                  Snackbar(
                    text: "로그아웃되었습니다.",
                    icon: Icons.check_circle,
                    backgroundColor: Colors.green
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
                      "로그아웃",
                      style: TextStyle(fontSize: 18),
                    ),
                  ),
            ],
          ),
        ),
      )
    );
  }
}