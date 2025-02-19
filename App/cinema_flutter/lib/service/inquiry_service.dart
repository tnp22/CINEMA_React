import 'package:dio/dio.dart';

class InquiryService {
 final Dio _dio = Dio();
  final String host = 'http://10.0.2.2:8080';

Future<Map<String, dynamic>> list(int page, int size, int option, String keyword) async {
  var url =
      "$host/inquiry/list?page=$page&size=$size&option=$option&keyword=$keyword";
  Map<String, dynamic> result = {};

  try {
    Response response = await _dio.get(url);
    print("::::: response - body :::::");
    print(response.data);

    // 응답이 Map<String, dynamic>이라면 바로 사용
    if (response.data is Map<String, dynamic>) {
      Map<String, dynamic> jsonResponse = response.data;

      // 'noticeList' 키에 해당하는 값 추출
      if (jsonResponse.containsKey('inquiryList')) {
        var noticeList = jsonResponse['inquiryList'];

        if (noticeList != null) {
          // 'list' 값이 있는지 확인하고 추출
          if (noticeList['list'] is List) {
            List<dynamic> listData = noticeList['list'];
            result['list'] = List<Map<String, dynamic>>.from(listData);
          } else {
            print("Error: 'list' key not found in 'noticeList'.");
          }

          // 'total' 값이 있는지 확인하고 추출
          if (noticeList.containsKey('total')) {
            result['total'] = noticeList['total'];
          } else {
            print("Error: 'total' key not found in 'noticeList'.");
          }
        } else {
          print("Error: 'noticeList' is null.");
        }
      } else {
        print("Error: 'noticeList' key not found.");
      }
    } else {
      print("Error: Response is not a valid Map<String, dynamic>");
    }
  } catch (e) {
    print(e);
  }

  return result;  // 수정된 부분: 'list'와 'total'을 포함한 Map 반환
}

Future<Map<String, dynamic>> myList(int page, int size, int option, String keyword,String username) async {
  var url =
      "$host/usersss/myInquiry/inquiries/list?page=$page&size=$size&option=$option&keyword=$keyword&username=$username";
  Map<String, dynamic> result = {};

  try {
    Response response = await _dio.get(url);
    print("::::: response - body :::::");
    print(response.data);

    // 응답이 Map<String, dynamic>이라면 바로 사용
    if (response.data is Map<String, dynamic>) {
      Map<String, dynamic> jsonResponse = response.data;

      // 'noticeList' 키에 해당하는 값 추출
      if (jsonResponse.containsKey('inquiryList')) {
        var noticeList = jsonResponse['inquiryList'];

        if (noticeList != null) {
          // 'list' 값이 있는지 확인하고 추출
          if (noticeList['list'] is List) {
            List<dynamic> listData = noticeList['list'];
            result['list'] = List<Map<String, dynamic>>.from(listData);
          } else {
            print("Error: 'list' key not found in 'noticeList'.");
          }

          // 'total' 값이 있는지 확인하고 추출
          if (noticeList.containsKey('total')) {
            result['total'] = noticeList['total'];
          } else {
            print("Error: 'total' key not found in 'noticeList'.");
          }
        } else {
          print("Error: 'noticeList' is null.");
        }
      } else {
        print("Error: 'noticeList' key not found.");
      }
    } else {
      print("Error: Response is not a valid Map<String, dynamic>");
    }
  } catch (e) {
    print(e);
  }

  return result;  // 수정된 부분: 'list'와 'total'을 포함한 Map 반환
}

    // 데이터 조회
  Future<Map<String, dynamic>?> select(String id) async {
    var url = "$host/inquiry/select/$id";
    var notice;
    try{
      var response = await _dio.get(url);
      print("::::: response - body :::::");
      //print(response.body);

      // 응답이 Map<String, dynamic>이라면 바로 사용
      if (response.data is Map<String, dynamic>) {
        Map<String, dynamic> jsonResponse = response.data;

        notice = Map<String, dynamic>.from(jsonResponse['inquiry']);
        print(notice);


      } else {
        print("Error: Response is not a valid Map<String, dynamic>");
      }

      // 'list' 키에 해당하는 값을 추출
      //JSON 디코딩
      // board = jsonDecode(utf8Decoded);
      // boardList :: List<Map<String, dynamic>>
    } catch (e){
      print(e);
    }
    return notice;
  }

    // 데이터 조회
  Future<Map<String, dynamic>?> selectPassword(String id,String password) async {
    var url = "$host/inquiry/select/$id/$password";
    var notice;
    try{
      var response = await _dio.get(url);
      print("::::: response - body :::::");
      //print(response.body);

      // 응답이 Map<String, dynamic>이라면 바로 사용
      if (response.data is Map<String, dynamic>) {
        Map<String, dynamic> jsonResponse = response.data;

        notice = Map<String, dynamic>.from(jsonResponse['inquiry']);
        print(notice);


      } else {
        print("Error: Response is not a valid Map<String, dynamic>");
      }

      // 'list' 키에 해당하는 값을 추출
      //JSON 디코딩
      // board = jsonDecode(utf8Decoded);
      // boardList :: List<Map<String, dynamic>>
    } catch (e){
      print(e);
    }
    return notice;
  }

    /// 회원가입
  Future<bool> insert(Map<String, dynamic> userData) async {
    try {
      final response = await _dio.post('$host/inquiry/insert', data: userData);
      if (response.statusCode == 200 || response.statusCode == 201) {
        return true;
      } else {
        return false;
      }
    } catch (e) {
      rethrow;
    }
  }
}
