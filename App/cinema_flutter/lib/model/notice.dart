import 'dart:convert';

import 'package:uuid/uuid.dart';

class Notice{
  static final Uuid _uuid = Uuid();  // static 선언
  final int? no;
  final String? id;
  late String? title;
  late String? content;
  final DateTime? regDate;
  final DateTime? updDate;
  final int? view;

  Notice(
    {
      this.no,
      String? id,
      required this.title, 
      required this.content,
      this.regDate, 
      this.updDate,
      this.view
    }
  ): id = id ?? _uuid.v4();
    

  // 객체 -> Map
  Map<String, dynamic> toMap(){
    return {
      'no' : no,
      'id' : id,
      'title' : title,
      'content' : content,
      'regDate' : regDate?.toIso8601String(),
      'updDate' : updDate?.toIso8601String(),
      'view' : view,
    };
  }

  // Map -> 객체
  factory Notice.fromMap(Map<String, dynamic> map){
    return Notice(
      no: map['no'],
      id: map['id'],
      title: map['title'],
      content: map['content'],
      regDate: map['regDate'],
      updDate: map['updDate'],
      view: map['view'],
    );
  }

  // factory
  // : 조건에 맞게 새로운 개체를 생성하는 생성자
  // * 반환값을 객체로 지정하는 키워드
}