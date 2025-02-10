import 'package:flutter/material.dart';

class CustomDrawer extends StatelessWidget {
  const CustomDrawer({super.key});

  @override
  Widget build(BuildContext context) {
    return Drawer(
        child: ListView(
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(color: Color(0xFF583BBF)),
              child: Text("메뉴", 
                style: TextStyle(color: Colors.white, fontSize: 24),
              )
            ),
            ListTile(
              leading: const Icon(Icons.home),
              title: const Text("홈"),
              onTap: (){
                Navigator.pop(context);
                Navigator.pushNamed(context, "/main");
              },
            ),
            ListTile(
              leading: const Icon(Icons.login),
              title: const Text("로그인"),
              onTap: (){
                Navigator.pop(context);
                Navigator.pushNamed(context, "/login");
              },
            ),
            ListTile(
              leading: const Icon(Icons.person_add_alt_1),
              title: const Text("회원가입"),
              onTap: (){
                Navigator.pop(context);
                Navigator.pushNamed(context, "/join");
              },
            ),
            ListTile(
              leading: const Icon(Icons.person),
              title: const Text("마이페이지"),
              onTap: (){
                Navigator.pop(context);
                Navigator.pushNamed(context, "/mypage");
              },
            ),
            ListTile(
              leading: const Icon(Icons.logout),
              title: const Text("로그아웃"),
              onTap: (){
                Navigator.pop(context);
                Navigator.pushNamed(context, "/main");
              },
            ),
          ],
        )
      );
  }
}