import 'package:uuid/uuid.dart';

class Inquiry{
  static final Uuid _uuid = Uuid();  // static 선언

  final int? no;
  final String? id;
  final int? type;
  final String? title;
  final String? password;
  final String? content;
  final String? username;
  final DateTime? regDate;
  final DateTime? updDate;
  final String? reply;
  final int? status;

  Inquiry(
    {
      this.no,
      String? id,
      this.type,
      required this.title, 
      this.password,
      required this.content,
      this.username,
      this.regDate, 
      this.updDate,
      this.reply,
      this.status
    }
  ): id = id ?? _uuid.v4();
    

  // 객체 -> Map
  Map<String, dynamic> toMap(){
    return {
      'no' : no,
      'id' : id,
      'type' : type,
      'title' : title,
      'password' : password,
      'content' : content,
      'regDate' : regDate?.toIso8601String(),
      'updDate' : updDate?.toIso8601String(),
      'reply' : reply,
      'status' : status
    };
  }

  // Map -> 객체
  factory Inquiry.fromMap(Map<String, dynamic> map){
    return Inquiry(
      no: map['no'],
      id: map['id'],
      type: map['type'],
      title: map['title'],
      password: map['password'],
      content: map['content'],
      regDate: map['regDate'] != null ? DateTime.parse(map['regDate']) : null,
      updDate: map['updDate'] != null ? DateTime.parse(map['updDate']) : null,
      reply: map['reply'],
      status: map['status'],
    );
  }

  // factory
  // : 조건에 맞게 새로운 개체를 생성하는 생성자
  // * 반환값을 객체로 지정하는 키워드
}