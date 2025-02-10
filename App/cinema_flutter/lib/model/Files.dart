import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:uuid/uuid.dart';
class Files {
  static final Uuid _uuid = Uuid();  // static 선언
    final int? no;
    final String? id;
    final String? fkId;
    final String? fkTable;
    final String? division;
    final String? url;
    final MultipartFile file;

    Files(
    {
      this.no,
      String? id,
      this.fkId,
      this.fkTable,
      this.division,
      this.url,
      required this.file
    }
  ): id = id ?? _uuid.v4();

// 객체 -> Map
  Map<String, dynamic> toMap(){
    return {
      'no' : no,
      'id' : id,
      'fkId' : fkId,
      'fkTable' : fkTable,
      'division' : division,
      'url' : url,
      'file' : file
    };
  }

  // Map -> 객체
  factory Files.fromMap(Map<String, dynamic> map){
    return Files(
      no: map['no'],
      id: map['id'],
      fkId: map['fkId'],
      fkTable: map['fkTable'],
      division: map['division'],
      url: map['url'],
      file: map['file']
    );
  }

}