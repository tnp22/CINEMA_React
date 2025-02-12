import 'package:cinema_flutter/model/notice.dart';
import 'package:cinema_flutter/service/notice_service.dart';
import 'package:cinema_flutter/widget/pagination.dart';
import 'package:flutter/material.dart';

class NoticeListScreen extends StatefulWidget {
  const NoticeListScreen({super.key});

  @override
  State<NoticeListScreen> createState() => _NoticeListScreenState();
}

class _NoticeListScreenState extends State<NoticeListScreen> {

  // 페이지 변경 시 호출될 함수
  void onPageChanged(int page) {
    setState(() {
      _page = page;
      _loadNotices();
    });
  }

  final _formKey = GlobalKey<FormState>();
  late List<Map<String, dynamic>> _noticeList = []; // Future 제거, 바로 List로 사용
  late int _total;
  final noticeService = NoticeService();
  int _page = 1; // 초기 페이지 1
  final int _size = 8;
  final int _option = 0;
  final TextEditingController _keywordController = TextEditingController();
  String _keyword = '';

  @override
  void initState() {
    super.initState();
    _loadNotices(); // 화면 초기화 시 데이터 로드
  }

  // 게시글 목록 요청 함수
  Future<void> _loadNotices() async {
    try {
      // 게시글 목록 요청 (비동기 처리)
      var _respon = await noticeService.list(_page, _size, _option, _keyword);

      // _respon에서 'list'와 'total' 데이터를 추출하여 상태 갱신
      setState(() {
        _noticeList = _respon['list'] ?? [];  // list가 없으면 빈 리스트
        _total = ((_respon['total'] ?? 0) / _size).toInt();  // total 값을 받는 경우
      });
    } catch (e) {
      print("Error: $e");
      setState(() {
        _noticeList = []; // 에러 발생 시 빈 리스트 반환
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("공지사항"),
      ),
      body: Container(
        padding: const EdgeInsets.fromLTRB(5, 0, 5, 10),
        child: _noticeList.isEmpty
            ? Center(child: CircularProgressIndicator())  // 리스트가 비어 있으면 로딩 표시
            : Column(
                children: [
                  // 게시글 목록
                  Expanded(
                    child: ListView.builder(
                      itemCount: _noticeList.length,
                      itemBuilder: (context, index) {
                        final notice = Notice.fromMap(_noticeList[index]);
                        return GestureDetector(
                          onTap: () {
                            Navigator.pushNamed(context, "/notice/read", arguments: notice.id);
                          },
                          child: Card(
                            child: ListTile(
                              leading: Text(notice.no.toString()),
                              title: Text(notice.title ?? ''),
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                  // 페이지네이션
                  Pagination(
                    currentPage: _page,
                    totalPages: _total,
                    onPageChanged: onPageChanged,
                  ),
                ],
              ),
      ),
    );
  }
}
