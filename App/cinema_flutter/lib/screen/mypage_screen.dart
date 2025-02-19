import 'package:flutter/material.dart';
import 'package:cinema_flutter/widget/custom_drawer.dart';
import 'mypage_edit_screen.dart'; // 추가: 마이페이지 수정 화면 임포트

class MypageScreen extends StatefulWidget {
  const MypageScreen({super.key});

  @override
  State<MypageScreen> createState() => _MypageScreenState();
}

class _MypageScreenState extends State<MypageScreen> {
  TextEditingController passwordController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 20.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center, // 중앙 정렬
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            SizedBox(height: 50), // 상단 여백 추가
            // 프로필 영역
            CircleAvatar(
              radius: 50,
              backgroundImage:
                  AssetImage('assets/profile_image.png'), // 실제 프로필 이미지 경로로 변경
            ),
            const SizedBox(height: 10),
            const Text(
              "사용자 님, 반갑습니다.",
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 20),

            // 메뉴 버튼
            _buildMenuButton("나의 정보", () {
              // "나의 정보" 버튼을 클릭하면 마이페이지 수정 화면으로 이동
              Navigator.push(
                context,
                MaterialPageRoute(
                    builder: (context) => const MyPageEditScreen()),
              );
            }),
            _buildMenuButton("예매 내역", () {
              print("예매 내역 클릭");
              Navigator.pushNamed(context, "/reserve");
            }),
            _buildMenuButton("문의 내역", () {}),

            const SizedBox(height: 30),

            // 비밀번호 입력 필드
            const Text(
              "회원 정보를 수정하려면 비밀번호를 다시 입력해주세요.",
              style: TextStyle(fontSize: 14, color: Colors.grey),
            ),
            const SizedBox(height: 10),
            TextField(
              controller: passwordController,
              obscureText: true,
              decoration: InputDecoration(
                hintText: "비밀번호 입력",
                border:
                    OutlineInputBorder(borderRadius: BorderRadius.circular(10)),
                contentPadding:
                    const EdgeInsets.symmetric(horizontal: 15, vertical: 10),
              ),
            ),
            const SizedBox(height: 10),

            // 확인 & 취소 버튼
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                ElevatedButton(
                  onPressed: () {
                    // 취소 버튼 기능 추가
                    passwordController.clear();
                  },
                  style: ElevatedButton.styleFrom(backgroundColor: Colors.grey),
                  child: const Text("취소"),
                ),
                const SizedBox(width: 10),
                ElevatedButton(
                  onPressed: () {
                    // 비밀번호 확인 기능 추가
                  },
                  child: const Text("확인"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  // 카드형 버튼 위젯 (클릭 이벤트 추가)
  Widget _buildMenuButton(String title, VoidCallback onTap) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5),
      child: Card(
        elevation: 2,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        child: ListTile(
          title: Center(
              child: Text(title,
                  style: const TextStyle(
                      fontSize: 16, fontWeight: FontWeight.bold))),
          onTap: onTap, // 버튼 클릭 시 동작
        ),
      ),
    );
  }
}
