import 'package:cinema_flutter/model/inquiry.dart';
import 'package:cinema_flutter/model/notice.dart';
import 'package:cinema_flutter/notifications/snackbar.dart';
import 'package:cinema_flutter/service/inquiry_service.dart';
import 'package:cinema_flutter/service/notice_service.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart'; // intl 패키지 import

class InquiryReadScreen extends StatefulWidget {
  
  const InquiryReadScreen({super.key});

  // 생성자에서 id를 받음
  //final String? id;
  //const NoticeReadScreen({Key? key, this.id}) : super(key: key);
  
  @override
  State<InquiryReadScreen> createState() => _CuscenterReadScreenState();
}

class _CuscenterReadScreenState extends State<InquiryReadScreen> {

  // 🧊 state
  String? id;
  String? password;
  final inquiryService = InquiryService();
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
          
          password == null ?
          _notice = inquiryService.select(id!)
          :
          // 게시글 조회 요청
          _notice = inquiryService.selectPassword(id!, password!);
        });
      }
      else{
      // arguments 받기
          final Map<String, dynamic> arguments =
                ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
                  setState(() {
          // arguments에서 id와 password 꺼내기
          id = arguments['id'];
          password = arguments['password'];          
          password == null ?
          _notice = inquiryService.select(id!)
          :
          // 게시글 조회 요청
          _notice = inquiryService.selectPassword(id!, password!);
        });
      }
      
    });
  }

  //   @override
  // void initState() {
  //   super.initState();

  //   // widget.id로 부모에서 전달된 id를 바로 사용할 수 있음
  //   if (widget.id != null) {
  //     print("Notice ID: ${widget.id}");
  //     // 게시글 조회 요청
  //     _notice = noticeService.select(widget.id!);
  //   } else {
  //     // id가 null일 경우 처리
  //     print("ID is null");
  //   }
  // }
  
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
        title: Text("공지사항"),
        actions: [],
      ),
      body: Padding(
        padding: EdgeInsets.fromLTRB(5, 0, 5, 10),
        child: 
          id == null
          //widget.id == null
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
               else if (snapshot.hasData) {
                  // 데이터가 존재할 경우
                  if (snapshot.data!.isEmpty) {
                    // 데이터는 있지만 비어있는 경우
                    return Center(child: Text("데이터를 조회할 수 없습니다."));
                  } else {
                    // 데이터를 정상적으로 반환한 경우
                Inquiry inquiry = Inquiry.fromMap( snapshot.data! ); // map -> board
                return Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Card(
                            child: ListTile(
                              leading: const Icon(Icons.article),
                              title: Text(inquiry.title ?? ''),
                            ),
                          ),
                          Card(
                            child: ListTile(
                              leading: const Icon(Icons.access_time),
                             title: Text(formatDate(inquiry.regDate.toString()) ?? '등록일 없음'),
                            ),
                          ),
                          const SizedBox(height: 10.0,),
                          Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4.0),
                            padding: const EdgeInsets.all(12.0),
                            width: double.infinity,
                            height: 
                            
                            inquiry.reply == null ?
                            480.0
                            :
                            240.0,
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
                              child: Text(inquiry.content ?? ''),
                            ),
                          ),
                          const SizedBox(height: 10.0,),
                          inquiry.reply == null ?
                          Container()
                          :
                          Container(
                            margin: const EdgeInsets.symmetric(horizontal: 4.0),
                            padding: const EdgeInsets.all(12.0),
                            width: double.infinity,
                            height: 240.0,
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
                              child: Text('[reply]\n ${inquiry.reply ?? ''}'),
                            ),
                          )
                        ],
                      );
                  }
                } else {
                  // snapshot에 데이터가 없을 경우
                  WidgetsBinding.instance.addPostFrameCallback((_) {
                    // 페이지 닫기
                    Navigator.pop(context);  
                    
                    // Snackbar 메시지 표시
                    Snackbar(
                      text: "비밀번호가 틀렸습니다.",
                      icon: Icons.check_circle,
                      backgroundColor: const Color.fromARGB(255, 196, 64, 23),
                    ).showSnackbar(context);  // Snackbar 표시
                  });
                   return Container();  // 위젯을 반환해야 하므로 빈 Container 반환
                }              
            }
          )
      ),
    );
  }
}