
import 'package:cinema_flutter/model/user_auth.dart';
import 'package:dio/dio.dart';

class Users {
  int? no;
  String? id;
  String? username;
  String? password;
  String? name;
  String? email;
  DateTime? regDate;
  DateTime? updDate;
  MultipartFile? file;
  bool? enabled;

  List<UserAuth>? authList;

  Users({
    this.no,
    this.id,
    this.username,
    this.password,
    this.name,
    this.email,
    this.regDate,
    this.updDate,
    this.enabled,
    this.authList = const []
  });

  // User 👩‍💼 ➡ Map 🎁
  Map<String, dynamic> toMap() {
    return {
      'no' : no,
      'id' : id,
      'useranme' : username,
      'password' : password,
      'name' : name,
      'email' : email,
      'regDate' : regDate,
      'updDate' : updDate,
      'enabled' : enabled,
    };
  }

  // Map 🎁 ➡  User 👩‍💼
  factory Users.fromMap(Map<String, dynamic> map) {
    return Users(
      no: map['no'],
      id: map['id'].toString(),
      username: map['username'],
      password: map['password'],
      name: map['name'],
      email: map['email'],
      regDate: map['regDate'] != null ? DateTime.fromMillisecondsSinceEpoch(map['regDate']) : null,
      updDate: map['updDate'] != null ? DateTime.fromMillisecondsSinceEpoch(map['updDate']) : null,
      enabled: map['enabled'],
      authList: map['authList'] != null
          ? List<UserAuth>.from(map['authList'].map((auth) => UserAuth.fromMap(auth)))
          : [],
    );
  }

}