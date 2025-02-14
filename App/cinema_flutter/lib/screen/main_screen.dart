import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:cinema_flutter/screen/inquiry/inquiry_list_screen.dart';
import 'package:cinema_flutter/screen/home_screen.dart';
import 'package:cinema_flutter/screen/login_screen.dart';
import 'package:cinema_flutter/screen/logout_screen.dart';
import 'package:cinema_flutter/screen/mypage_screen.dart';
import 'package:cinema_flutter/screen/notice/notice_list_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {


  late Widget _selectedScreen;
  //int selectedIndex = 0;

  
    
  @override
  Widget build(BuildContext context) {
  UserProvider userProvider = Provider.of<UserProvider>(context, listen: true);
              switch (userProvider.selectedIndex) {
                case 0:
                  _selectedScreen = userProvider.isLogin?LogoutScreen() : LoginScreen();
                  break;
                case 1:
                  _selectedScreen = HomeScreen();
                  break;
                case 2:
                  _selectedScreen = HomeScreen();
                  break;
                case 3:
                  _selectedScreen = MypageScreen();
                  break;
                case 4:
                  _selectedScreen = NoticeListScreen();
                case 5:
                  _selectedScreen = InquiryListScreen();
                  break;
                default:
                  _selectedScreen = HomeScreen(); // 기본 화면 설정
              }
    return Scaffold(
      // appBar: AppBar(title: Text("메인 화면"),),
      body: _selectedScreen,
      bottomNavigationBar: NavigationBar(
        animationDuration: const Duration(seconds: 1),
        selectedIndex: userProvider.selectedIndex,
        onDestinationSelected: (index) {
          setState(() {
            userProvider.selectedIndex = index;
          });
        },
        destinations: userProvider.isLogin ?
         _navBarItems2 : _navBarItems,
      ),
    );
  }
}

const _navBarItems = [
  NavigationDestination(
    icon: Icon(Icons.login_outlined),
    selectedIcon: Icon(Icons.login_rounded),
    label: '로그인',
  ),
  NavigationDestination(
    icon: Icon(Icons.movie_outlined),
    selectedIcon: Icon(Icons.movie),

    label: '영화',
  ),
    NavigationDestination(
    icon: Icon(Icons.home_outlined),
    selectedIcon: Icon(Icons.home_rounded),
    label: '홈',
  ),
  NavigationDestination(
    icon: Icon(Icons.person_outline_rounded),
    selectedIcon: Icon(Icons.person_rounded),
    label: '마이페이지',
  ),
  NavigationDestination(
    icon: Icon(Icons.announcement_outlined),
    selectedIcon: Icon(Icons.announcement),
    label: '공지사항',
  ),
  NavigationDestination(
    icon: Icon(Icons.help_outline),
    selectedIcon: Icon(Icons.help_rounded),
    label: '고객센터',
  ),
];

const _navBarItems2 = [
    NavigationDestination(
    icon: Icon(Icons.logout_outlined),
    selectedIcon: Icon(Icons.logout_outlined),
    label: '로그아웃',
  ),
  NavigationDestination(
    icon: Icon(Icons.movie_outlined),
    selectedIcon: Icon(Icons.movie),
    label: '영화',
  ),
    NavigationDestination(
    icon: Icon(Icons.home_outlined),
    selectedIcon: Icon(Icons.home_rounded),
    label: '홈',
  ),
  NavigationDestination(
    icon: Icon(Icons.person_outline_rounded),
    selectedIcon: Icon(Icons.person_rounded),
    label: '마이페이지',
  ),
  NavigationDestination(
    icon: Icon(Icons.announcement_outlined),
    selectedIcon: Icon(Icons.announcement),
    label: '공지사항',
  ),
  NavigationDestination(
    icon: Icon(Icons.help_outline),
    selectedIcon: Icon(Icons.help_rounded),
    label: '고객센터',
  ),
];