import 'dart:convert';
import 'dart:io';

import 'package:dio/dio.dart';
import 'package:cinema_flutter/model/Files.dart';
import 'package:cinema_flutter/model/movie.dart';
import 'package:uuid/uuid.dart';
class Banner {
  static final Uuid _uuid = Uuid();  // static 선언
    final int? no;
    final String? id;
    final String? name;
    final String? bannerDivi;
    final String? movieId;
    final Files? files;
    final List<Files>? filesList;
    final List<MultipartFile>? mainFiles;
    final String? FileId;
    final Movie? movie;

    Banner(
    {
      this.no,
      String? id,
      this.name,
      this.bannerDivi,
      this.movieId,
      this.files,
      this.filesList,
      this.mainFiles,
      this.FileId,
      this.movie,
    }
  ): id = id ?? _uuid.v4();

// 객체 -> Map
  Map<String, dynamic> toMap(){
    return {
      'no' : no,
      'id' : id,
      'name' : name,
      'bannerDivi' : bannerDivi,
      'movieId' : movieId,
      'files' : files,
      'filesList' : filesList,
      'mainFiles' : mainFiles,
      'FileId' : FileId,
      'movie' : movie,
    };
  }

  // Map -> 객체
  factory Banner.fromMap(Map<String, dynamic> map){
    return Banner(
      no: map['no'],
      id: map['id'],
      name: map['name'],
      bannerDivi: map['bannerDivi'],
      movieId: map['movieId'],
      files: map['files'],
      filesList: map['filesList'],
      mainFiles: map['mainFiles'],
      FileId: map['FileId'],
      movie: map['movie'],
    );
  }

}