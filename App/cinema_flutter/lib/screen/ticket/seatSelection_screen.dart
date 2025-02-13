import 'package:flutter/material.dart';
import 'package:cinema_flutter/service/ticket_service.dart';

class SeatselectionScreen extends StatefulWidget {
  final Map<String, dynamic>? arguments;
  const SeatselectionScreen({Key? key, this.arguments}) : super(key: key);

  @override
  State<SeatselectionScreen> createState() => _SeatselectionScreenState();
}

class _SeatselectionScreenState extends State<SeatselectionScreen> {
  // state
  Map<String,Object> obj = {};
  final ticket_service = TicketService();
  String? theaterListId;
  String? person;


  @override
  void initState() {
    super.initState();

    // 정보 파라미터 넘겨받기
    WidgetsBinding.instance.addPostFrameCallback( (_) {
      final args = ModalRoute.of(context)!.settings.arguments;
      obj = args as Map<String, Object>;
      // print("obj : ${obj["theatersListId"]}"); // 정상 출력
      int adultCount = obj["adultCount"] as int;
      int youthCount = obj["youthCount"] as int;
      int money = adultCount * 10000 + youthCount * 7000;
        setState(() {
          
          person = (adultCount + youthCount).toString()+"_"+money.toString();
          print(person);
          theaterListId = obj["theatersListId"] as String;
          fetchSeatSelection();
        });
      
    });

  }

  void fetchSeatSelection() async {
    var result = await ticket_service.seatSelection(theaterListId!, person!);
    print("result : $result");
  }


  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('SeatselectionScreen'),
      ),
    );
  }
}