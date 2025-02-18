import 'package:cinema_flutter/model/inquiry.dart';
import 'package:cinema_flutter/model/notice.dart';
import 'package:cinema_flutter/notifications/snackbar.dart';
import 'package:cinema_flutter/service/inquiry_service.dart';
import 'package:cinema_flutter/service/notice_service.dart';
import 'package:cinema_flutter/widget/pagination.dart';
import 'package:flutter/material.dart';

class InquiryListScreen extends StatefulWidget {
  const InquiryListScreen({super.key});

  @override
  State<InquiryListScreen> createState() => _CuscenterListScreenState();
}

class _CuscenterListScreenState extends State<InquiryListScreen> {

  // 페이지 변경 시 호출될 함수
  void onPageChanged(int page) {
    setState(() {
      _page = page;
      _loadNotices();
    });
  }

  late List<Map<String, dynamic>> _inquiryList = []; // Future 제거, 바로 List로 사용
  late int _total;
  final inquiryService = InquiryService();
  int _page = 1; // 초기 페이지 1
  final int _size = 8;
  int _option = 1; // 기본 옵션 값
  final TextEditingController _keywordController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
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
      var _respon = await inquiryService.list(_page, _size, _option, _keyword);

      // _respon에서 'list'와 'total' 데이터를 추출하여 상태 갱신
      setState(() {
        _inquiryList = _respon['list'] ?? [];  // list가 없으면 빈 리스트
        double total = (_respon['total'] ?? 0).toDouble();
        double size = _size.toDouble();
        // 나누기 연산 후 올림
        _total = (total / size).ceilToDouble().toInt();
        if(_total == 0){
          _inquiryList = [
          {'title': '결과 없음'}
          ];
        }
      });
    } catch (e) {
      print("Error: $e");
      setState(() {
        _inquiryList = []; // 에러 발생 시 빈 리스트 반환
      });
    }
  }

  // 검색 버튼 클릭 시 호출되는 함수
  void _onSearchPressed() {
    setState(() {
      _keyword = _keywordController.text.trim(); // 검색어 갱신
    });
    _loadNotices(); // 검색어에 맞게 목록 다시 로드
  }

@override
Widget build(BuildContext context) {
  return Scaffold(
    appBar: AppBar(
      title: Text("고객센터"),
    ),
    body: Container(
      padding: const EdgeInsets.fromLTRB(10, 0, 10, 10),
      child: _inquiryList.isEmpty
          ? Center(child: CircularProgressIndicator())  // 리스트가 비어 있으면 로딩 표시
          : Column(
              children: [
                // 검색 입력과 버튼을 배치
                Padding(
                  padding: const EdgeInsets.all(8.0),
                  child: Row(
                    children: [
                      // option 선택 드롭다운
                      Container(
                        decoration: BoxDecoration(
                          borderRadius: BorderRadius.circular(8),
                          border: Border.all(color: const Color.fromARGB(255, 100, 100, 100)),
                        ),
                        padding: EdgeInsets.symmetric(horizontal: 10),
                        child: DropdownButton<int>(
                          value: _option,
                          onChanged: (int? newOption) {
                            setState(() {
                              _option = newOption ?? 1; // 선택된 옵션 값으로 변경
                            });
                          },
                          items: [
                            DropdownMenuItem(
                              value: 1,
                              child: Text('제목'),
                            ),
                            DropdownMenuItem(
                              value: 2,
                              child: Text('내용'),
                            ),
                            DropdownMenuItem(
                              value: 3,
                              child: Text('아이디'),
                            ),
                          ],
                          underline: SizedBox(), // 기본 밑줄 제거
                          isExpanded: false,
                          style: TextStyle(color: Colors.black, fontSize: 16),
                        ),
                      ),
                      SizedBox(width: 10),
                      // 검색어 입력란
                      Expanded(
                        child: Container(
                          decoration: BoxDecoration(
                            borderRadius: BorderRadius.circular(8),
                            border: Border.all(color: Colors.grey.shade300),
                          ),
                          child: TextField(
                            controller: _keywordController,
                            decoration: InputDecoration(
                              labelText: '검색어를 입력하세요',
                              border: InputBorder.none,
                              contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                            ),
                          ),
                        ),
                      ),
                      SizedBox(width: 10),
                      // 검색 버튼
                      ElevatedButton(
                        onPressed: _onSearchPressed,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color.fromARGB(255, 103, 24, 250),
                          padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(8),
                          ),
                        ),
                        child: Text("검색", style: TextStyle(fontSize: 16, color: Colors.white)),
                      ),
                      SizedBox(width: 10),
                    ],
                  ),
                ),
                SizedBox(height: 12),
                // If no results found, show a message
                _total == 0 ?
                  Padding(
                    padding: const EdgeInsets.all(8.0),
                    child: Text(
                      '검색결과 없음',
                      style: TextStyle(fontSize: 18, color: Colors.grey),
                    ),
                  )
                :
                // 게시글 목록
                Expanded(
                  child: ListView.builder(
                    itemCount: _inquiryList.length,
                    itemBuilder: (context, index) {
                      final inquiry = Inquiry.fromMap(_inquiryList[index]);
                      return inquiry.type == 1
                          ? GestureDetector(
                              onTap: () {
                                Navigator.pushNamed(context, "/inquiry/read", arguments: inquiry.id);
                              },
                              child: Card(
                                child: ListTile(
                                  leading: Text(inquiry.no.toString()),
                                  title: Text(inquiry.title ?? ''),
                                ),
                              ),
                            )
                          : GestureDetector(
                              onTap: () {
                                showModalBottomSheet(
                                  context: context,
                                  isScrollControlled: true,
                                  builder: (context) {
                                    return Padding(
                                      padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
                                      child: Container(
                                        height: 250,
                                        padding: EdgeInsets.all(20),
                                        decoration: BoxDecoration(
                                          color: Colors.white,
                                          borderRadius: BorderRadius.circular(30),
                                          boxShadow: [
                                            BoxShadow(
                                              color: Colors.grey.withOpacity(0.5),
                                              spreadRadius: 5,
                                              blurRadius: 7,
                                              offset: Offset(0, 3),
                                            ),
                                          ],
                                        ),
                                        child: Column(
                                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                                          crossAxisAlignment: CrossAxisAlignment.start,
                                          children: [
                                            Text(
                                              '비밀번호 입력',
                                              style: TextStyle(
                                                fontSize: 25,
                                                fontWeight: FontWeight.bold,
                                              ),
                                            ),
                                            TextField(
                                              controller: _passwordController,
                                              decoration: InputDecoration(
                                                hintText: '비밀번호를 입력하시오',
                                                border: OutlineInputBorder(),
                                              ),
                                            ),
                                            ElevatedButton(
                                              onPressed: () async {
                                                Navigator.pop(context);
                                                Navigator.pushNamed(
                                                  context,
                                                  "/inquiry/read",
                                                  arguments: {
                                                    'id': inquiry.id,
                                                    'password': _passwordController.text,
                                                  },
                                                );
                                                _passwordController.clear();
                                              },
                                              style: ElevatedButton.styleFrom(
                                                minimumSize: const Size(double.infinity, 50),
                                                backgroundColor: Color(0xFF583BBF),
                                                foregroundColor: Colors.white,
                                                padding: EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                                                shape: RoundedRectangleBorder(
                                                  borderRadius: BorderRadius.circular(0),
                                                ),
                                              ),
                                              child: Text(
                                                "입력",
                                                style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                                              ),
                                            ),
                                          ],
                                        ),
                                      ),
                                    );
                                  },
                                ).whenComplete(() {
                                  _passwordController.clear();
                                });
                              },
                              child: Card(
                                child: ListTile(
                                  leading: Text(inquiry.no.toString()),
                                  title: Row(
                                    mainAxisSize: MainAxisSize.min,
                                    children: [
                                      Icon(Icons.lock),
                                      Text(inquiry.title ?? ''),
                                    ],
                                  ),
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
    floatingActionButton: FloatingActionButton(
      onPressed: () {
        // 버튼을 눌렀을 때 실행할 동작
        Navigator.pushNamed(context, "/inquiry/insert");
      },
      child: Icon(Icons.edit, color: Colors.white),
      backgroundColor: Color.fromARGB(255, 103, 24, 250),
    ),
  );
}
}