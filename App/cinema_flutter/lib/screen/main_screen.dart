import 'package:flutter/material.dart';
import 'package:cinema_flutter/screen/home_screen.dart';
import 'package:cinema_flutter/screen/join_screen.dart';
import 'package:cinema_flutter/screen/login_screen.dart';
import 'package:cinema_flutter/screen/mypage_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {


  Widget _selectedScreen = HomeScreen();
  int _selectedIndex = 0;
    
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      // appBar: AppBar(title: Text("메인 화면"),),
      body: _selectedScreen,
      bottomNavigationBar: NavigationBar(
        animationDuration: const Duration(seconds: 1),
        selectedIndex: _selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            _selectedIndex = index;
            switch(_selectedIndex){
              case 0: _selectedScreen = HomeScreen(); break;
              case 1: _selectedScreen = LoginScreen(); break;
              case 2: _selectedScreen = JoinScreen(); break;
              case 3: _selectedScreen = MypageScreen(); break;
            }
          });
        },
        destinations: _navBarItems,
      ),
    );
  }
}

const _navBarItems = [
  NavigationDestination(
    icon: Icon(Icons.home_outlined),
    selectedIcon: Icon(Icons.home_rounded),
    label: '홈',
  ),
  NavigationDestination(
    icon: Icon(Icons.login_outlined),
    selectedIcon: Icon(Icons.login_rounded),
    label: '로그인',
  ),
  NavigationDestination(
    icon: Icon(Icons.person_add_outlined),
    selectedIcon: Icon(Icons.person_add_rounded),
    label: '회원가입',
  ),
  NavigationDestination(
    icon: Icon(Icons.person_outline_rounded),
    selectedIcon: Icon(Icons.person_rounded),
    label: '마이페이지',
  ),
];