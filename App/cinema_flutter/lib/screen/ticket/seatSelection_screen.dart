import 'package:flutter/material.dart';
import 'package:cinema_flutter/service/ticket_service.dart';
import 'package:cinema_flutter/widget/seat_button.dart';

class SeatselectionScreen extends StatefulWidget {
  final Map<String, dynamic>? arguments;
  const SeatselectionScreen({Key? key, this.arguments}) : super(key: key);

  @override
  State<SeatselectionScreen> createState() => _SeatselectionScreenState();
}

class _SeatselectionScreenState extends State<SeatselectionScreen> {
  // 상태 변수
  Map<String, Object> obj = {};
  final ticket_service = TicketService();
  String? theaterListId;
  String? person;

  // 확대 기능
  double _scale = 1.0; // 기본 확대 배율
  final double _minScale = 1.0;
  final double _maxScale = 4.0;
  final TransformationController _transformationController = TransformationController();

  // 좌석 데이터
  List<List<dynamic>> mapData = [];

  @override
  void initState() {
    super.initState();

    // 정보 파라미터 넘겨받기
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final args = ModalRoute.of(context)!.settings.arguments;
      if (args != null) {
        obj = args as Map<String, Object>;
        int adultCount = obj["adultCount"] as int;
        int youthCount = obj["youthCount"] as int;
        int money = adultCount * 10000 + youthCount * 7000;

        setState(() {
          person = "${adultCount + youthCount}_$money";
          theaterListId = obj["theatersListId"] as String;
          fetchSeatSelection();
        });
      }
    });
  }

  void onButtonTap(String seatId) {
    print("seatId : $seatId");
  }

  void fetchSeatSelection() async {
    if (theaterListId != null && person != null) {
      List<Map<String, dynamic>> result =
          await ticket_service.seatSelection(theaterListId!, person!);

      setState(() {
        List<dynamic> rawData = result[0]["mapData"]; // 원본 데이터
        print("맵데이터 $rawData");
        print("맵데이터타입 ${rawData.runtimeType}");

        // mapData를 List<List<String>> 형태로 변환
        mapData = rawData.map<List<String>>((row) => List<String>.from(row)).toList();
      });
    }
  }

  void _zoomIn() {
    setState(() {
      _scale = (_scale * 1.2).clamp(_minScale, _maxScale); // 1.2배 확대
      _transformationController.value = Matrix4.identity()..scale(_scale);
    });
  }

  void _zoomOut() {
    setState(() {
      _scale = (_scale / 1.2).clamp(_minScale, _maxScale); // 1.2배 축소
      _transformationController.value = Matrix4.identity()..scale(_scale);
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text("좌석 선택")),
      body: SafeArea(
        child: Column(
          children: [
            Expanded(
              child: Center(
                child: InteractiveViewer(
                  transformationController: _transformationController,
                  boundaryMargin: EdgeInsets.all(100), // 여백 추가
                  minScale: _minScale,
                  maxScale: _maxScale,
                  panEnabled: true, // 드래그 가능
                  scaleEnabled: true, // 확대/축소 가능
                  child: Container(
                    width: 500, // 고정된 가로 크기
                    height: 300, // 고정된 세로 크기
                    color: Colors.grey[300],
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: mapData
                          .map((row) => Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: row
                                    .map((seat) => Padding(
                                          padding: EdgeInsets.all(4),
                                          child: SeatButton(
                                            seatId: seat,
                                            seatNumber: seat,
                                            onButtonTap: onButtonTap,
                                          ),
                                        ))
                                    .toList(),
                              ))
                          .toList(),
                    ),
                  ),
                ),
              ),
            ),
            // 확대/축소 버튼
            Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                FloatingActionButton(
                  onPressed: _zoomOut,
                  child: Icon(Icons.remove),
                ),
                SizedBox(width: 20),
                FloatingActionButton(
                  onPressed: _zoomIn,
                  child: Icon(Icons.add),
                ),
              ],
            ),
            SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
