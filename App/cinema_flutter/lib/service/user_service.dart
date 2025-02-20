import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class UserService {
  final Dio _dio = Dio();
  final String host = 'http://192.168.30.8:8080';

  /// 회원가입
  Future<bool> registerUser(Map<String, dynamic> userData) async {
    try {
      final response = await _dio.post('$host/users', data: userData);
      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      rethrow;
    }
  }

  /// 회원정보 조회
  Future<Map<String, dynamic>> getUser(String? username) async {
    if (username == null) {
      return {};
    }

    try {
      final storage = const FlutterSecureStorage();
      String? jwt = await storage.read(key: "jwt");
      final response = await _dio.get('$host/users/info',
          options: Options(headers: {
            'Authorization': 'Bearer $jwt',
            'Content-Type': 'application/json'
          }));
      if (response.statusCode == 200) {
        print("회원정보 조회");
        return response.data;
      } else {
        return {};
      }
    } catch (e) {
      print("회원 정보 조회 요청 시, 에러 발생 : $e");
    }
    return {};
  }

// 회원정보 수정
  Future<bool> updateUser(Map<String, dynamic> userData) async {
    try {
      final storage = const FlutterSecureStorage();
      String? jwt = await storage.read(key: "jwt");
      final response = await _dio.post('$host/usersss/mypageUpdateF',
          data: userData,
          options: Options(headers: {
            'Authorization': 'Bearer $jwt',
            'Content-Type': 'application/json'
          }));
      if (response.statusCode == 200) {
        print("회원정보 수정");
        return true;
      } else {
        return false;
      }
    } catch (e) {
      print('회원정보 수정 실패 : $e');
    }
    return false;
  }

  // 비밀번호 확인
  Future<Map<String, String>> checkPassword(String password) async {
    try {
      final storage = const FlutterSecureStorage();
      String? jwt = await storage.read(key: "jwt");
      final response = await _dio.get('$host/usersss/checkMypage',
          queryParameters: {'password': password},
          options: Options(headers: {
            'Authorization': 'Bearer $jwt',
            'Content-Type': 'application/json'
          }));
      if (response.statusCode == 200) {
        return Map<String, String>.from(response.data);
      } else {
        return {'message': '비밀번호 확인 실패'};
      }
    } catch (e) {
      print('비밀번호 확인 실패 : $e');
      return {'message': '비밀번호 확인 실패'};
    }
  }

  // 이미지 업로드
  Future<bool> uploadProfileImage(String username, String filePath) async {
    try {
      final storage = const FlutterSecureStorage();
      String? jwt = await storage.read(key: "jwt");

      FormData formData = FormData.fromMap({
        'username': username,
        'file': await MultipartFile.fromFile(filePath,
            filename: 'profile_image.png'),
      });

      final response = await _dio.post('$host/usersss/mypageImageUpdate',
          data: formData,
          options: Options(headers: {
            'Authorization': 'Bearer $jwt',
            'Content-Type': 'multipart/form-data'
          }));

      if (response.statusCode == 200) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      print('이미지 업로드 실패 : $e');
      return false;
    }
  }

  /// 회원탈퇴
  // Future<bool> deleteUser(String? username) async {
  //   if( username == null ) {
  //     return false;
  //   }

  //   try {
  //     final storage = const FlutterSecureStorage();
  //     String? jwt = await storage.read(key: "jwt");
  //     final response = await _dio.delete('$host/users/$username',
  //                                         options: Options(
  //                                           headers: {
  //                                             'Authorization' : 'Bearer $jwt',
  //                                             'Content-Type' : 'application/json'
  //                                           }
  //                                         )
  //                                       );
  //     if( response.statusCode == 200 ) {
  //       print("회원 탈퇴 성공");
  //       return true;
  //     }
  //     else {
  //       return false;
  //     }
  //   } catch (e) {
  //     print("회원 탈퇴 요청 시, 에러 발생 : $e");
  //   }
  //   return false;
  // }
}
