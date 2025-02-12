import 'package:flutter/material.dart';
import 'package:cinema_flutter/widget/custom_drawer.dart';

class MyPageEditScreen extends StatefulWidget {
  const MyPageEditScreen({super.key});

  @override
  State<MyPageEditScreen> createState() => _MyPageEditScreenState();
}

class _MyPageEditScreenState extends State<MyPageEditScreen> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("나의 정보"),
        backgroundColor: Colors.purple, // 상단바 색상
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            // 프로필 이미지 및 버튼
            CircleAvatar(
              radius: 50,
              backgroundImage:
                  AssetImage('assets/profile_image.png'), // 실제 경로 설정 필요
            ),
            const SizedBox(height: 10),
            ElevatedButton(
              onPressed: () {
                // 이미지 변경 로직 추가
              },
              child: const Text("이미지 변경"),
            ),

            const SizedBox(height: 20),

            // 아이디 (수정 불가)
            _buildTextField("아이디", "bjw1015", enabled: false),

            // 이메일 입력
            _buildTextField("이메일", "새 이메일을 입력해주세요",
                controller: emailController),

            // 비밀번호 입력
            _buildTextField("새 비밀번호", "새 비밀번호를 입력해주세요",
                controller: passwordController, obscureText: true),
            _buildTextField("새 비밀번호 확인", "새 비밀번호를 다시 입력해주세요",
                controller: confirmPasswordController, obscureText: true),

            const SizedBox(height: 20),

            // 저장 버튼
            ElevatedButton(
              onPressed: () {
                // 저장 로직 추가
              },
              style: ElevatedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50)),
              child: const Text("저장"),
            ),

            const SizedBox(height: 10),

            // 마이페이지로 이동 버튼
            OutlinedButton(
              onPressed: () {
                Navigator.pop(context); // 이전 페이지로 이동
              },
              style: OutlinedButton.styleFrom(
                  minimumSize: const Size(double.infinity, 50)),
              child: const Text("마이페이지 메인으로"),
            ),
          ],
        ),
      ),
    );
  }

  // 공통 텍스트 필드 위젯
  Widget _buildTextField(String label, String hint,
      {bool enabled = true,
      TextEditingController? controller,
      bool obscureText = false}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 15),
      child: TextField(
        controller: controller,
        obscureText: obscureText,
        enabled: enabled,
        decoration: InputDecoration(
          labelText: label,
          hintText: hint,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
          filled: !enabled, // 비활성화된 필드는 회색 배경
          fillColor: enabled ? Colors.white : Colors.grey[200],
        ),
      ),
    );
  }
}
