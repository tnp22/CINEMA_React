import 'package:flutter/material.dart';
import 'package:cinema_flutter/screen/home_screen.dart';
import 'package:cinema_flutter/screen/join_screen.dart';
import 'package:cinema_flutter/screen/login_screen.dart';
import 'package:cinema_flutter/screen/main_screen.dart';
import 'package:cinema_flutter/screen/mypage_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'user_app',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),initialRoute: '/main',
      routes: {
        '/main' : (context) => const MainScreen(),
        '/home' : (context) => const HomeScreen(),
        '/login' : (context) => const LoginScreen(),
        '/join' : (context) => const JoinScreen(),
        '/mypage' : (context) => const MypageScreen(),
      },
      debugShowCheckedModeBanner: false,
      
    );
  }
}
