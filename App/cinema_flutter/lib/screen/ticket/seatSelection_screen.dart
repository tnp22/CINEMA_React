import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:cinema_flutter/service/user_service.dart';
import 'package:flutter/material.dart';
import 'package:cinema_flutter/widget/seat_button.dart';
import 'package:cinema_flutter/service/ticket_service.dart';
import 'package:provider/provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

class SeatselectionScreen extends StatefulWidget {
  final Map<String, dynamic>? arguments;
  const SeatselectionScreen({Key? key, this.arguments}) : super(key: key);

  @override
  State<SeatselectionScreen> createState() => _SeatselectionScreenState();
}

class _SeatselectionScreenState extends State<SeatselectionScreen> {


  final ticket_service = TicketService();
  Map<String, Object> obj = {};
  String? theaterListId;
  int? person;
  String? Sperson;
  List<List<String>> mapData = [];


  String? movieId;

  // 선택된 좌석
  List<String> selectSeat = [];
  String resetSeat = "";

  String? theaterId;
  String? authUserName;
  int? money;
  String? orderId; 



  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addPostFrameCallback((_) {
      final args = ModalRoute.of(context)!.settings.arguments;
      print("obj 불러오기");
      if (args != null) {
        obj = args as Map<String, Object>;
        print(obj);
        int adultCount = obj["adultCount"] as int;
        int youthCount = obj["youthCount"] as int;

        setState(() {
          money = adultCount * 10000 + youthCount * 7000;
          person = adultCount + youthCount;
          Sperson = "${adultCount + youthCount}_$money";
          theaterListId = obj["theatersListId"] as String;
          fetchSeatSelection();
        });
      }
    });
  }

  void onButtonTap(String seatId) {
    if( seatId == ""){
      return; // 통로 혹은 null 일때 리턴
    }
    print("seatId : $seatId");
    // print("인원 $person");

    
      // 중복검사
      for(String s in selectSeat){
        if(s == seatId){
          // print(selectSeat);
          return;
        }
      }
      
      // 중복이 없을때
      setState(() {
        if (person == selectSeat.length) {
        // selectSeat에서 첫 번째 인덱스의 내용 삭제
          selectSeat.removeAt(0);
        }
        selectSeat.add(seatId);
      });

    // print(selectSeat);

    setState(() {
      var r = List.from(selectSeat);
      r.sort();
      resetSeat = r.join(', ');
    });
  }

  void fetchSeatSelection() async {
    if (theaterListId != null && Sperson != null) {
      List<Map<String, dynamic>> result =
          await ticket_service.seatSelection(theaterListId!, Sperson!);
      // print(result);
      setState(() {
        orderId = "IMP" + result[1]["uuuuid"] as String;
        theaterId = result[2]["theaterId"] as String;
        // print("movieId : ${result[5]["movieId"].runtimeType}");
        movieId = result[5]["movieId"] as String;
        
        List<dynamic> rawData = result[0]["mapData"];
        for (var row in rawData) {
          List<String> newRow = [];

          for (var seat in row) {
            var emp = seat.split("_"); // "_" 기준으로 분리

            if (emp.length > 1) { // 길이가 1보다 크면 "_" 포함됨
              // print(emp); // [좌선번호, 통로]
              newRow.add(emp[0]);
              newRow.add(emp[1]);
            }
            else if(seat == "통로" || seat == "null"){
              newRow.add("통로");
            }
            else{
              newRow.add(seat);
            }

          }
          // print(newRow);

          mapData.add(newRow);
        }
        print("예매정보 : ${result[7]["reserve"][0]["seat"]}");
        print("예매정보 : ${result[7]["reserve"][0]["seat"].runtimeType}");
        List<dynamic> reserveSeat = result[7]["reserve"];
        List<String> reserve = [];
        for(var reserveseat in reserveSeat){
          List<String> r = reserveseat["seat"].split(", ");
          if(r.length > 0){
            // 예매좌석이 2개 이상일때
            // print(r);
            for(String re in r){
              reserve.add(re);
            }
          }
          else{
            // 예매좌석 1개일때
            reserve.add(reserveseat["seat"]);
          }
        }
        // print(reserve);
        // print(reserve.length);
        // print("맵데이터 $mapData");

        Set<String> reserveSet = reserve.toSet(); // 리스트를 Set으로 변환 (O(1) 조회 가능)
        setState(() {
          for (int i = 0; i < mapData.length; i++) {
            for (int n = 0; n < mapData[i].length; n++) {
              if (reserveSet.contains(mapData[i][n])) { 
                mapData[i][n] = "reserve";
                // print("중복값 ${mapData[i][n]}");
              }
            }
          }
        });


        int maxsize = 0;
        for(var map in mapData){
          if(map.length > maxsize){
            maxsize = map.length;
          }
        }
        for(var map in mapData){
          if(maxsize > map.length){
            int size = maxsize - map.length;
            for (int i = 0; i < size; i++) {
              map.add("통로");
            }
          }
        }

      });
    }
  }

  void payment() async {
    print("orderId ${orderId.runtimeType}");
    print("money : ${money.runtimeType}");
    print("authUsetName : ${authUserName.runtimeType}");
    print("person : ${person.runtimeType}");
    print("seat : ${resetSeat.runtimeType}");
    print("theaterId : ${theaterId.runtimeType}");

    Map<String, String> resverData = ({
      "orderId" : orderId as String,
      "money" : money.toString(),
      "userName" : authUserName as String,
      "person" : person.toString(),
      "seat" : resetSeat,
      "id" : theaterId as String,
      "movieId" : movieId as String,
    });

    print(resverData);
    
    bool result = await ticket_service.payment(resverData!);
    // 예매 성공시 true
    if(result){
      Navigator.pushNamed(context, "/payment", 
      arguments: {
        "orderId" : orderId as String,
        "money" : money.toString(),
        "userName" : authUserName as String,
        "person" : person.toString(),
        "seat" : resetSeat,
        "id" : theaterId as String,
        "movieId" : movieId as String,
      });
    }
    
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[300], // 전체 배경색 설정
      appBar: AppBar(title: Text("좌석 선택")),
      body: SafeArea(
        child: Column(
          children: [
            Consumer<UserProvider>(
              builder: (context, userProvider, child) {
                final user = userProvider.userInfo;
                print("유저 정보 : ${user.username}");
                authUserName = user.username;
                return SizedBox.shrink();
              },
            ),
            // 상단에 "스크린" 텍스트가 들어있는 그레이 색 박스 추가
            Container(
              width: MediaQuery.of(context).size.width * 0.7, // 화면 가로 크기 70%
              height: 40, // 고정된 세로 크기 40
              color: Colors.grey, // 그레이 색 배경
              alignment: Alignment.center, // 텍스트 가운데 정렬
              child: Text(
                "스크린", // 텍스트 내용
                style: TextStyle(
                  color: Colors.white, // 텍스트 색상
                  fontWeight: FontWeight.bold, // 텍스트 두께
                  fontSize: 16, // 텍스트 크기
                ),
              ),
            ),
            
            // 좌석 컨테이너를 화면 상단에 고정
            Align(
              alignment: Alignment.topCenter,
              child: Container(
                height: 400, // 고정된 세로 크기
                color: Colors.grey[300], // 나머지 공간에 배경색 설정
                child: InteractiveViewer(
                  boundaryMargin: EdgeInsets.only(top: 40, bottom: 20, right: 10, left: 10), // 축소 시 숨겨진 버튼이 나타나도록 설정
                  minScale: 0.5, // 축소 가능
                  maxScale: 3.0, // 확대 가능
                  panEnabled: true, // 드래그 가능
                  scaleEnabled: true, // 확대/축소 가능
                  constrained: false, // 대각선 이동 가능
                  child: Transform.scale(
                    scale: 1.0, // 기본 크기 설정
                    child: Padding(
                      padding: EdgeInsets.all(20), // 버튼 간격 조정
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: mapData
                            .map((row) => Row(
                                  mainAxisAlignment: MainAxisAlignment.center,
                                  children: row
                                      .map((seat) => Padding(
                                            padding: EdgeInsets.all(4),
                                            child: SeatButton(
                                              seatId: seat == "통로" ? "" : seat == "reserve" ? "X":seat,
                                              seatNumber: seat == "통로" ? "" : seat == "reserve" ? "X":seat,
                                              isSelected : selectSeat.contains(seat),
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
            ),
            Expanded(
              child: Row(
                children: [
                  // 가로 크기 30%의 img 영역
                  Expanded(
                    flex: 3, // 30%를 차지
                    child : Padding(
                      padding: EdgeInsets.symmetric(
                        vertical: MediaQuery.of(context).size.height * 0.03
                      ),
                      child: SizedBox.expand(
                        child : movieId == null ?
                          Center(child: CircularProgressIndicator()) :
                          Image.network(
                            "http://10.0.2.2:8080/files/img?id=$movieId", // 실제 이미지 경로로 변경
                            fit: BoxFit.cover, // 이미지 크기에 맞게 조정
                          ),
                      )
                    )
                  ),

                  // 가로 크기 40%의 내용 영역
                  Expanded(
                    flex: 4, // 40%를 차지
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text("예약인원 : $person"),
                        SizedBox(child: Text(""),),
                        Text("선택된 좌석 : ${resetSeat}"),
                      ],
                    ),
                  ),

                  // 가로 크기 30%의 예매하기 버튼 영역
                  Expanded(
                    flex: 3, // 30%를 차지
                    child : SizedBox.expand(
                      child : Padding(
                        padding: EdgeInsets.symmetric(
                          vertical: MediaQuery.of(context).size.height * 0.05
                        ),
                        child: ElevatedButton(
                          onPressed: () {
                            // 예매하기 버튼 클릭 시 수행할 동작을 여기에 추가
                            print("예매하기 클릭");
                            payment();
                          },
                          child: Text("예매하기"),
                        ),
                      )
                    )
                  ),
                ],
              ),
            )

          ],
        ),
      ),
    );
  }


}
