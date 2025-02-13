import 'package:cinema_flutter/model/notice.dart';
import 'package:cinema_flutter/service/notice_service.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // intl 패키지 import

class NoticeReadScreen extends StatefulWidget {
  const NoticeReadScreen({super.key});

  @override
  State<NoticeReadScreen> createState() => _NoticeReadScreenState();
}

class _NoticeReadScreenState extends State<NoticeReadScreen> {

  // 🧊 state
  String? id;
  final noticeService = NoticeService();
  late Future<Map<String, dynamic>?> _notice;

  @override
  void initState() {
    super.initState();

    // id 파라미터 넘겨받기
    WidgetsBinding.instance.addPostFrameCallback( (_) {
      final args = ModalRoute.of(context)!.settings.arguments;

      if( args is String ) {
        print('넘어오는 중이다');
        setState(() {
          id = args;
          print("id : $id");
          
          // 게시글 조회 요청
          _notice = noticeService.select(id!);
        });
      }
      
    });

  }
    // 날짜와 시간 포맷팅 함수
  String formatDate(String? date) {
    if (date == null) return '등록일 없음';

    try {
      DateTime parsedDate = DateTime.parse(date); // 'yyyy-MM-ddTHH:mm:ss' 형식으로 파싱
      return DateFormat('yyyy년 MM월 dd일 HH:mm').format(parsedDate); // "2025년 02월 11일 14:30" 형식으로 포맷
    } catch (e) {
      return '날짜 형식 오류';
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        leading: GestureDetector(
          onTap: () {
            Navigator.pop(context);
          },
          child: Icon(Icons.arrow_back),
        ),
        title: Text("공지사항 조회"),
        actions: [],
      ),
      body: Padding(
        padding: EdgeInsets.fromLTRB(5, 0, 5, 10),
        child: 
          id == null
          ? Center(child: CircularProgressIndicator(),)
          : FutureBuilder(
            future: _notice, 
            builder: (context, snapshot) {
              // 로딩중
              if( snapshot.connectionState == ConnectionState.waiting ) {
                return Center(child: CircularProgressIndicator(),);
              }
              // 에러
              else if ( snapshot.hasError ) {
                return Center(child: Text("게시글 조회 중, 에러"),);
              }
              // 데이터 없음
              else if( !snapshot.hasError && snapshot.data!.isEmpty) {
                return Center(child: Text("데이터를 조회할 수 없습니다."),);
              }
              // 데이터 있음
              else {
                Notice notice = Notice.fromMap( snapshot.data! ); // map -> board
                return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Card(
                            child: ListTile(
                              leading: const Icon(Icons.article),
                              title: Text(notice.title ?? ''),
                            ),
                          ),
                          Card(
                            child: ListTile(
                              leading: const Icon(Icons.access_time),
                             title: Text(formatDate(notice.regDate.toString()) ?? '등록일 없음'),
                            ),
                          ),
                          const SizedBox(height: 10.0,),
                          Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4.0),
                            padding: const EdgeInsets.all(12.0),
                            width: double.infinity,
                            height: 480.0,
                            decoration: BoxDecoration(
                              color: Theme.of(context).scaffoldBackgroundColor,
                              boxShadow: [
                                BoxShadow(
                                  color: Colors.black.withValues(alpha: 0.3), // 그림자 색상,투명도
                                  spreadRadius: 2,      // 그림자 확산 정도
                                  blurRadius: 8,        // 그림자 흐림 정도
                                  offset: const Offset(4, 4), // 그림자 위치 (x, y)
                                )
                              ],
                              borderRadius: BorderRadius.circular(8),   // 테두리 곡률
                            ),
                            child: SingleChildScrollView(
                              child: Text(notice.content ?? ''),
                            ),
                          )
                        ],
                      );
              }
              
            }
          )
        

      ),
    );
  }
}