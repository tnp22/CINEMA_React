import 'package:cinema_flutter/model/users.dart';
import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:shared_preferences/shared_preferences.dart';

class UserProvider extends ChangeNotifier {
  // 상태 관리할 정보
  // 사용자 정보 👩‍💼
  late Users _userInfo;
  // 로그인 상태 🔐
  bool _loginStat = false;

  int selectedIndex = 0;

  // getter
  Users get userInfo => _userInfo;
  bool get isLogin => _loginStat;

  // setter
  set userInfo(Users userInfo) {
    _userInfo = userInfo;
  }

  set loginStat(bool loginStat) {
    _loginStat = loginStat;
  }

  // 🎫 HTTP 요청 객체
  final Dio _dio = Dio();
  // 🔒 안전한 저장소
  final storage = const FlutterSecureStorage();

  /// 🔐 로그인 요청
  Future<void> login(String username, String password,
      {bool rememberId = false, bool rememberMe = false}) async {
    _loginStat = false; // 로그인 여부 초기화

    String url =
        'http://10.0.2.2:8080/login?username=$username&password=$password';

    try {
      final response = await _dio.get(url);
      if (response.statusCode == 200) {
        // JWT ➡ 🎁 SecureStorage 에 저장
        final authorization = response.headers['authorization']?.first;
        if (authorization == null) {
          print("아이디 또는 비밀번호가 일치하지 않습니다.");
          return;
        }
        print("로그인 성공...");
        // ########## 로그인 처리 ##########
        final jwt = authorization.replaceFirst('Bearer ', '');
        print("JWT : $jwt");
        await storage.write(key: 'jwt', value: jwt);

        // 사용자 정보, 로그인 상태 ➡ ⚡ Provider 에 업데이트
        _userInfo = Users.fromMap(response.data);
        _loginStat = true;
        // ########## 로그인 처리 ##########

        // 아이디 저장
        if (rememberId) {
          print("아이디 저장");
          await storage.write(key: 'username', value: username);
        } else {
          print("아이디 저장 해제");
          await storage.delete(key: 'username');
        }

        // 자동 로그인
        if (rememberMe) {
          print("자동 로그인");
          final prefs = await SharedPreferences.getInstance();
          await prefs.setBool('auto_login', true);
        } else {
          final prefs = await SharedPreferences.getInstance();
          await prefs.setBool('auto_login', false);
        }
      } else if (response.statusCode == 403) {
        print('아이디 또는 비밀번호가 일치하지 않습니다.');
      } else {
        print('네트워크 오류 또는 알 수 없는 오류로 로그인에 실패하였습니다.');
      }
    } catch (e) {
      print('로그인 처리 중 에러 발생 : $e');
      return;
    }
    // 업데이트 된 상태를 구독하고 있는 위젯에 다시 빌드
    notifyListeners();
  }

  // 사용자 정보 요청
  Future<bool> getUserInfo() async {
    final url = 'http://10.0.2.2:8080/users/info';
    try {
      String? jwt = await storage.read(key: 'jwt');
      print('jwt : $jwt');

      final response = await _dio.get(url,
          options: Options(headers: {
            'Authorization': 'Bearer $jwt',
            'Content-Type': 'application/json'
          }));
      if (response.statusCode == 200) {
        final userInfo = response.data;
        print('userInfo : $userInfo');
        if (userInfo == null) {
          return false;
        }
        // provider 에 사용자 정보 저장
        _userInfo = Users.fromMap(userInfo);
        notifyListeners(); // 구독 하고 있은 위젯에 공유
        return true;
      } else {
        print("사용자 정보 조회 실패");
        return false;
      }
    } catch (e) {
      print('사용자 정보 요청 실패 : $e');
      return false;
    }
  }

  // 사용자 정보 업데이트 메서드
  Future<void> updateUserInfo(String email, String password) async {
    final url = 'http://10.0.2.2:8080/users/update';
    try {
      String? jwt = await storage.read(key: 'jwt');
      final response = await _dio.post(url,
          data: {
            'email': email,
            'password': password,
          },
          options: Options(headers: {
            'Authorization': 'Bearer $jwt',
            'Content-Type': 'application/json'
          }));
      if (response.statusCode == 200) {
        // 사용자 정보 업데이트 성공 시, provider에 저장
        _userInfo.email = email;
        _userInfo.password = password;
        notifyListeners();
      } else {
        print("사용자 정보 업데이트 실패");
      }
    } catch (e) {
      print('사용자 정보 업데이트 실패 : $e');
    }
  }

  // 자동 로그인 처리
  Future<void> autoLogin() async {
    final prefs = await SharedPreferences.getInstance();
    final rememberMe = prefs.getBool('auto_login') ?? false;
    print('자동 로그인');
    if (rememberMe) {
      final jwt = await storage.read(key: 'jwt');
      if (jwt != null) {
        // 사용자 정보 요청
        bool result = await getUserInfo();

        // 사용자 요청 정보 응답 성공 시, 로그인 여부 true 로 설정
        if (result) {
          _loginStat = true;
          notifyListeners();
        }
      }
    }
  }

  // 로그아웃
  Future<void> logout() async {
    try {
      // 🔓 로그아웃 처리
      // JWT 토큰 삭제
      await storage.delete(key: 'jwt');
      // 사용자 정보 초기화
      _userInfo = Users();
      // 로그인 상태 초기화
      _loginStat = false;
      // 아이디 저장, 자동 로그인 여부 삭제
      storage.delete(key: 'username');
      final prefs = await SharedPreferences.getInstance();
      prefs.remove('auto_login');
      print("로그아웃 성공");
    } catch (e) {
      print("로그아웃 실패 : $e");
    }
    notifyListeners();
  }
}
