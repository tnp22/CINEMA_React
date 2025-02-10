import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:cinema_flutter/model/Files.dart';
import 'package:uuid/uuid.dart';

class Movie{
  static final Uuid _uuid = Uuid();  // static 선언
  final int? no;
  final String? id;
  late String? title;
  late String? type;
  late String? content;
  final DateTime? releaseDate;
  final DateTime? regDate;
  final DateTime? updDate;
  final Files? files;
  final List<Files>? fileList;
  final List<Files>? filesList;
  final List<MultipartFile>? mainFiles;
  final List<MultipartFile>? stilcuts;
  final String? FileId;

  Movie(
    {
      this.no,
      String? id,
      required this.title, 
      required this.type, 
      required this.content,
      this.releaseDate,
      this.regDate,
      this.updDate,
      this.files,
      this.fileList,
      this.filesList,
      this.mainFiles,
      this.stilcuts,
      this.FileId,
    }
  ): id = id ?? _uuid.v4();
    

  // 객체 -> Map
  Map<String, dynamic> toMap(){
    return {
      'no' : no,
      'id' : id,
      'title' : title,
      'type' : type,
      'content' : content,
      'releaseDate' : releaseDate?.toIso8601String(),
      'regDate' : regDate?.toIso8601String(),
      'updDate' : updDate?.toIso8601String(),
      'files' : files,
      'fileList' : fileList,
      'filesList' : filesList,
      'mainFiles' : mainFiles,
      'stilcuts' : stilcuts,
      'FileId' : FileId,
    };
  }

  // Map -> 객체
  factory Movie.fromMap(Map<String, dynamic> map){
    return Movie(
      no: map['no'],
      id: map['id'],
      title: map['title'],
      type: map['type'],
      content: map['content'],
      releaseDate: map['releaseDate'],
      regDate: map['regDate'],
      updDate: map['updDate'],
      files: map['files'],
      fileList: map['fileList'],
      mainFiles: map['mainFiles'],
      stilcuts: map['stilcuts'],
      FileId: map['FileId'],
    );
  }

  // factory
  // : 조건에 맞게 새로운 개체를 생성하는 생성자
  // * 반환값을 객체로 지정하는 키워드
}