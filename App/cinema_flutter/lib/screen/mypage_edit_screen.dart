import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:cinema_flutter/service/user_service.dart';

class MyPageEditScreen extends StatefulWidget {
  const MyPageEditScreen({super.key});

  @override
  State<MyPageEditScreen> createState() => _MyPageEditScreenState();
}

class _MyPageEditScreenState extends State<MyPageEditScreen> {
  TextEditingController emailController = TextEditingController();
  TextEditingController passwordController = TextEditingController();
  TextEditingController confirmPasswordController = TextEditingController();
  final UserService userService = UserService();

  @override
  void initState() {
    super.initState();
    final userProvider = Provider.of<UserProvider>(context, listen: false);
    emailController.text = userProvider.userInfo.email ?? '';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("나의 정보"),
        backgroundColor: Colors.purple, // 상단바 색상
      ),
      body: Consumer<UserProvider>(
        builder: (context, userProvider, child) {
          final user = userProvider.userInfo;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                // 프로필 이미지 및 버튼
                CircleAvatar(
                  radius: 50,
                  // backgroundImage: user.profileImageUrl != null
                  //     ? NetworkImage(user.profileImageUrl!)
                  //     : const AssetImage('assets/profile_image.png') as ImageProvider,
                ),
                const SizedBox(height: 10),
                ElevatedButton(
                  onPressed: () {
                    // 이미지 변경 로직 추가
                  },
                  child: const Text("이미지 변경"),
                ),

                const SizedBox(height: 20),

                // 사용자 정보 출력 (UserProvider)
                _buildInfoRow("아이디 (Provider)", user.username),
                _buildInfoRow("이름 (Provider)", user.name),
                _buildInfoRow("이메일 (Provider)", user.email),
                _buildInfoRow("가입 날짜 (Provider)", user.regDate?.toString()),
                _buildInfoRow("마지막 수정 날짜 (Provider)", user.updDate?.toString()),
                _buildInfoRow("사용 가능 여부 (Provider)",
                    user.enabled == true ? "활성화됨" : "비활성화됨"),

                const SizedBox(height: 20),

                // 아이디 (수정 불가)
                _buildTextField(user.username ?? '', user.username ?? '',
                    enabled: false),

                // 이메일 입력 (수정 가능)
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
                  onPressed: () async {
                    if (passwordController.text !=
                        confirmPasswordController.text) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("비밀번호가 일치하지 않습니다.")),
                      );
                      return;
                    }

                    final success = await userService.updateUser({
                      'email': emailController.text,
                      'password': passwordController.text,
                    });

                    if (success) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("사용자 정보가 업데이트되었습니다.")),
                      );
                      userProvider.getUserInfo(); // 업데이트된 정보 가져오기
                    } else {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text("사용자 정보 업데이트에 실패했습니다.")),
                      );
                    }
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

                const SizedBox(height: 10),

                // 새로고침 버튼
                // ElevatedButton(
                //   onPressed: () async {
                //     bool success = await userProvider.getUserInfo();
                //     if (!success) {
                //       ScaffoldMessenger.of(context).showSnackBar(
                //         const SnackBar(content: Text("사용자 정보를 가져오는 데 실패했습니다.")),
                //       );
                //     }
                //   },
                //   child: const Text("새로고침"),
                // ),
              ],
            ),
          );
        },
      ),
    );
  }

  // 사용자 정보 출력 위젯
  Widget _buildInfoRow(String label, String? value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 8.0),
      child: Row(
        children: [
          Text(
            "$label : ",
            style: const TextStyle(fontWeight: FontWeight.bold),
          ),
          Expanded(
            child: Text(value ?? "정보 없음"),
          ),
        ],
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
