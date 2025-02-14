import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:cinema_flutter/screen/cuscenter/cuscenter_list_screen.dart';
import 'package:cinema_flutter/screen/cuscenter/cuscenter_read_screen.dart';
import 'package:cinema_flutter/screen/movie/movie_info_screen.dart';
import 'package:cinema_flutter/screen/notice/notice_list_screen.dart';
import 'package:cinema_flutter/screen/notice/notice_read_screen.dart';
import 'package:cinema_flutter/screen/ticket/seatSelection_screen.dart';
import 'package:cinema_flutter/screen/ticket/ticket_screen.dart';
import 'package:flutter/material.dart';
import 'package:cinema_flutter/screen/home_screen.dart';
import 'package:cinema_flutter/screen/join_screen.dart';
import 'package:cinema_flutter/screen/login_screen.dart';
import 'package:cinema_flutter/screen/main_screen.dart';
import 'package:cinema_flutter/screen/mypage_screen.dart';
import 'package:provider/provider.dart';

void main() {
  // runApp() : Flutter 앱의 시작점을 지정하는 함수
  // - Provider(MyApp) 을 루트 위젯으로 설정하여 앱을 실행
  runApp(
      // ⭐ Provider
      // - ChangeNotifierProvider 를 사용하여 UserProvider를 전역으로 사용할 수 있도록 지정
      ChangeNotifierProvider(
    create: (context) => UserProvider(),
    child: const MyApp(),
  ));
  //runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    // 앱 실행 시, 자동로그인
    Provider.of<UserProvider>(context, listen: false).autoLogin();

    return MaterialApp(
      title: 'user_app',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      initialRoute: '/main',
      onGenerateRoute: (settings) {
        switch (settings.name) {
          case '/main':
            return PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) =>
                  MainScreen(),
              transitionDuration: Duration(seconds: 0),
            );
          case '/home':
            return PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) =>
                  HomeScreen(),
              transitionDuration: Duration(seconds: 0),
            );
          case '/login':
            return PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) =>
                  LoginScreen(),
              transitionDuration: Duration(seconds: 0),
            );
          case '/join':
            return PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) =>
                  JoinScreen(),
              transitionDuration: Duration(seconds: 0),
            );
          case '/mypage':
            return PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) =>
                  MypageScreen(),
              transitionDuration: Duration(seconds: 0),
            );

          case '/notice/list':
            return PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) =>
                  NoticeListScreen(),
              transitionDuration: Duration(seconds: 0),
            );
          case '/inquiry/list':
            return PageRouteBuilder(
              pageBuilder: (context, animation, secondaryAnimation) =>
                  CuscenterListScreen(),
              transitionDuration: Duration(seconds: 0),
            );
          case '/ticket':
            return PageRouteBuilder(
              settings: settings,
              pageBuilder: (context, animation, secondaryAnimation) {
                final args = settings.arguments as Map<String, dynamic>;
                return TicketScreen();
              },
              transitionDuration: Duration(seconds: 0),
            );
            // 좌석 선택
          case '/seatselection':
          return PageRouteBuilder(
            settings: settings,
            pageBuilder: (context, animation, secondaryAnimation) {
              final args = settings.arguments as Map<String, dynamic>;
              return SeatselectionScreen();
            },
            transitionDuration: Duration(seconds: 0),
          );
          // case '/notice/read':
          //   final args = settings.arguments as String?;
          //   print("Arguments passed to /notice/read: $args");
          //   return PageRouteBuilder(
          //     // ModalRoute를 통해 arguments 받기
          //     pageBuilder: (context, animation, secondaryAnimation) {
          //       if (args is String) {
          //         return NoticeReadScreen(id: args);
          //       }
          //       return NoticeReadScreen(id: null);
          //     },
          //     transitionDuration: Duration(seconds: 0),
          //   );
        }
      },
      routes: {
        '/notice/read': (context) => const NoticeReadScreen(),
        '/movieInfo': (context) => const MovieInfoScreen(),
        '/inquiry/read': (context) => const CuscenterReadScreen(),
      },
      debugShowCheckedModeBanner: false,
    );
  }
}
