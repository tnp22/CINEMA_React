import 'package:cinema_flutter/provider/user_provider.dart';
import 'package:cinema_flutter/widget/ticket_buttom.dart';
import 'package:flutter/material.dart';
import 'package:cinema_flutter/service/ticket_service.dart';
import 'package:provider/provider.dart';

class TicketScreen extends StatefulWidget {
  
  const TicketScreen({super.key,});

  @override
  State<TicketScreen> createState() => _TicketScreenState();
}

class _TicketScreenState extends State<TicketScreen> {

  String id = "";

  // state
  late Future<List<Map<String, dynamic>>> dataSelection;
  final ticket_service = TicketService();

  List<Map<String, dynamic>> list = []; // 전체 정보
  List<dynamic> ticketList = []; // 예매 정보
  String? movieId; // 예매 정보
  String? movieTitle; // 영화 제목

  List<String> Region = []; // 지역
  List Theaters = []; // 극장
  List Dates = []; // 날짜

  // 해야하나?
  // Map<dynamic, dynamic> regionTheater = {}; // 지역별 극장

  // state
  late Future<List<String>> _Region = Future.value([]);
  late Future<List<dynamic>> _Theaters = Future.value([]);
  late Future<List<dynamic>> _Dates = Future.value([]);

  // 날짜 클릭 이후 state
  late Future<List<String>> _Theater = Future.value([]); // 상영관
  late Future<List<Map<String, dynamic>>> _times = Future.value([]); // 상영관 : 시간, 좌석, 영화 ID

  // 현제 선택된 극장 정보
  String targetTheater = "";
  List<Map<String,dynamic>> theaterData = []; // 상영관 : 시간, 좌석, 영화 ID
  // 현제 선택된 날짜 정보
  String targetDate = "";
  // 현제 선택된 시간 정보
  String targetTime = "";
  // 현제 선택된 TheatersList Id
  String targetTheaterListId = "";

  // 극장 기준 날짜 정보
  var dateTimeData = {};

  // 예매 인원수 카운트
  int adultCount = 0;
  int youthCount = 0;

  // 메세지
  String message = "";

  Map<String,Object> obj = {};
  @override
  void initState() {
    super.initState();

    // id 파라미터 넘겨받기
    WidgetsBinding.instance.addPostFrameCallback( (_) {
      final args = ModalRoute.of(context)!.settings.arguments;
      obj = args as Map<String, Object>;
      // print("obj : ${obj["theatersListId"]}"); // 정상 출력
      String movieid = obj["movieId"] as String;
      print("object : ${obj["movieId"]}");
        setState(() {
          id = movieid;
          // 무비 ID로 예매 정보 불러오기
          fetchTickets();
        });
      
    });

    
  }

  void fetchTickets() async {
    // String id = "919359c6-4f46-4580-93f7-a67b2b577516";

    if(id == ""){
      return;
    }

    List<Map<String, dynamic>> result = await ticket_service.dateSelection(id);

    // result의 구조를 출력하여 확인
    // print("Result: ${result[0]}");
    print('ticketList 타입: ${result[0]['ticketList'].runtimeType}');
    // print('movieId 타입: ${result[1]['movieId'].runtimeType}');
    // print('movieTitle 타입: ${result[2]['movieTitle'].runtimeType}');
    ticketList = result.first["ticketList"].toList();
    movieId = result[1]["movieId"];
    movieTitle = result[2]["movieTitle"];
    print("영화 ID: $movieId");
    print("영화 제목: $movieTitle");

    // print("예매 정보: $ticketList");
    for (var t in ticketList) {
      if(t is Map<String, dynamic>) {
        Region.add(t["area"]);
      }
    }

    // 중복 제거
    Region = Region.toSet().toList();
    Region.sort((a,b) => a.compareTo(b));

    for( var R in Region){
      var Theater = [];
      var regionDate = {};
      for( var list in ticketList){
        
        if(R == list["area"]){
          Theater.add(list["areaSub"]);
          // print("극장 : ${list["areaSub"]}"); // 정상 출력
          // print("시간 : ${list["time"]}"); // 정상출력
          String timeString = list["time"].replaceAll("KST", "+09:00");
          DateTime dateObj = DateTime.parse(timeString);
          String datePart = "${dateObj.year}-${dateObj.month.toString().padLeft(2, '0')}-${dateObj.day.toString().padLeft(2, '0')}";
          // print(datePart); // 정상출력

          if( regionDate[list["areaSub"]] == null){
            regionDate[list["areaSub"]] = []; // 초기화는 한번만 수행
          }
          if ( !regionDate[list["areaSub"]].contains(datePart)){
            regionDate[list["areaSub"]].add(datePart); // 중복 방지
          }

          // 날짜 기준 시간 분리
          // String timePart = "${dateObj.hour.toString().padLeft(2, '0')}:${dateObj.minute.toString().padLeft(2, '0')}";
        }
      }
      Theater = Theater.toSet().toList();
      Theaters.add(Theater);
      Dates.add(regionDate);
    }
    // print("Theaters : ${Theaters}");
    // print("Dates : ${Dates}");

    
    for (var list in ticketList) {
      var areaSub = list["areaSub"];
      var time = list["time"];
      var seat = list["seat"];
      var theaterName = list["theaterName"];

      String timeString = time.replaceAll("KST", "+09:00");
      DateTime dateObj = DateTime.parse(timeString);
      String datePart = "${dateObj.year}-${dateObj.month.toString().padLeft(2, '0')}-${dateObj.day.toString().padLeft(2, '0')}";
      String timePart = "${dateObj.hour.toString().padLeft(2, '0')}:${dateObj.minute.toString().padLeft(2, '0')}";
      String theaterListId = list["id"]; // null일 경우 기본값을 사용

      // 지역이 없으면 초기화
      if (dateTimeData[areaSub] == null) {
        dateTimeData[areaSub] = [];
      }

      // 날짜 엔트리가 없으면 생성
      var dateEntry = dateTimeData[areaSub].firstWhere(
        (e) => e["date"] == datePart,
        orElse: () => {"date": datePart, "theaters": []}, // 없으면 새로운 엔트리 생성 (theaters 초기화)
      );
      // 날짜 엔트리 추가 (중복 방지 처리 필요)
      if (!dateTimeData[areaSub].contains(dateEntry)) {
        dateTimeData[areaSub].add(dateEntry);
      }

      // 극장 정보가 없으면 생성
      // theaters가 null이라면 빈 리스트로 초기화
      if (dateEntry["theaters"] == null) {
        dateEntry["theaters"] = [];
      }

      var theater = dateEntry["theaters"].firstWhere(
        (t) => t["theater"] == theaterName,
        orElse: () => {"theater": theaterName, "times": []}, // 없으면 새로운 극장 생성
      );
      // 극장 추가 (중복 방지 처리 필요)
      if (!dateEntry["theaters"].contains(theater)) {
        dateEntry["theaters"].add(theater);
      }

      // 시간 추가
      theater["times"].add({
        "time": timePart,
        "seat": seat,
        "Id": theaterListId,
      });
    }
    // print("시간? $dateTimeData");



    // 초기값 설정
    setState(() {
      _Region = Future.value(Region);
      _Theaters = Future.value(Theaters[0]);

      Map<dynamic, dynamic> regionTheater = Dates[0];
      print("Theaters : ${Theaters[0]}");
      targetTheater = Theaters[0][0];
      print("regionTheater : ${regionTheater[Theaters[0][0]]}");
      _Dates = Future.value(regionTheater[Theaters[0][0]]);
    });

    print("Dates : ${Dates}");
    // for( int i = 0; i< Dates.length; i++){
    //   if(Dates[i] is Map<dynamic, dynamic>){
    //     // print("타입 : ${Dates[i].runtimeType}");
    //     // print("내용 : ${Dates[i]}");
    //     // print("$i번 타입 정상");
    //     Map<dynamic, dynamic> regionTheater = Dates[i];
    //     print(regionTheater);
    //   }
    // }
    
  }


  // 지역 클릭 버튼
  void regionButtonTap(String text, String id, int index) {
    // print("버튼이 클릭되었습니다! ID: $id");
    // print("나와라 쫌 : ${index}");
    // print(Theaters[index].runtimeType); // 타입 확인
    setState(() {
      _Theaters = Future.value(Theaters[index]);
      _Dates = Future.value([]);
      _Theater = Future.value([]);
      _times = Future.value([]);

      // 기존 내용 초기화
      targetTheater = "";
      targetDate = "";
      targetTime = "";
      targetTheaterListId = "";
    });
  }

  // 극장 클릭 버튼
  void theaterButtonTap(String text,String id, int index){
    print("극장 클릭 버튼 클릭됨 ${id}");
    setState(() {
      targetTheater = id;
      targetDate = "";
      targetTime = "";
      targetTheaterListId = "";

      _Theater = Future.value([]);
      _times = Future.value([]);
    });

    for( int i = 0; i< Dates.length; i++){
      if(Dates[i] is Map<dynamic, dynamic>){
        // print("타입 : ${Dates[i].runtimeType}");
        // print("내용 : ${Dates[i]}");
        // print("$i번 타입 정상");
        Map<dynamic, dynamic> regionTheater = Dates[i];
        List<dynamic> keyList = regionTheater.keys.toList();
        // print(regionTheater);
        for(dynamic key in keyList){
          if(key == id){
            // print("아이디와 같다 ${key}");
            (regionTheater[key] as List).sort((a,b) => a.compareTo(b));
            print("regionTheater : ${regionTheater[key]}");

            setState(() {
              _Dates = Future.value(regionTheater[key]);
            });
          }
        }
      }
    }
  }

  void datesButtonTap (String text,String id, int index){
    // print("선택된 극장 : $targetTheater");
    // print("선택된 날짜 : ${id}");

    // 아래 내용 초기화
    setState(() {
      targetTime = "";
      targetTheaterListId = "";
    });

    targetDate = id;
    // print(dateTimeData.runtimeType); // _Map<dynamic, dynamic>

    // print(dateTimeData[targetTheater]);  
    // print("날짜 정보 : ${dateTimeData[targetTheater][index]["theaters"][0]["times"][0]["time"]}");
    // print("1Type : ${dateTimeData[targetTheater].runtimeType}");
    // print("2Type : ${dateTimeData[targetTheater][index].runtimeType}");
    // print("3Type : ${dateTimeData[targetTheater][index]["theaters"].runtimeType}");
    // print("4Type : ${dateTimeData[targetTheater][index]["theaters"][0].runtimeType}");
    // print("5Type : ${dateTimeData[targetTheater][index]["theaters"][0]["times"].runtimeType}");
    // print("6Type : ${dateTimeData[targetTheater][index]["theaters"][0]["times"][0].runtimeType}");
    // print("7Type : ${dateTimeData[targetTheater][index]["theaters"][0]["times"][0]["time"].runtimeType}");
    // dateTimeData 구조
    // ㄴ dateTimeData = Map<dynamic, dynamic> // 극장 : dynamic
    // ㄴ key(dynamic) 값 입력후 dynamic => List<dynamic>
    // ㄴ index 값 입력후 List<dynamic> => Map<String, Object>
    // ㄴ key(String) 값 입력후 Object => List<dynamic>
    // ㄴ index 값 입력후 List<dynamic> => Map<String, Object>
    // ㄴ key(String) 값 입력후 Object => String

    // print("날짜 정보 : ${dateTimeData[targetTheater][index]["date"]}");
    List<String> theaters = [];
    theaterData = [];
    for(var a in dateTimeData[targetTheater]){
      if(a["date"] == id){
        print("날짜 정보 : ${a["date"]}");
        for(var b in a["theaters"]){
          print("상영관 : ${b["theater"]}");
          theaters.add(b["theater"]);
          for(var c in b["times"]){
            print(c);
            theaterData.add({b["theater"]: c});
            // print("시간 정보 : ${c["time"]}");
            // print("영화 ID : ${c["movieId"]}");
            // print("좌석 정보 : ${c["seat"]}");
          }
        }
      }
    }
    // print(theaters);
    // print(theaterData);

    setState(() {
      _Theater = Future.value(theaters);
      _times = Future.value(theaterData);
    });
      
  }

  void timesButtonTap(String text,String id, int index){
    print("선택된 시간 : ${text}");
    print("선택된 Id : ${id}");
    setState(() {
      targetTime = text;
      targetTheaterListId = id;
    });
  }

  void adultCountUp(){
    setState(() {
      adultCount++;
    });
  }

  void adultCountDown(){
    setState(() {
      if(adultCount > 0){
        adultCount--;
      }
    });
  }

  void youthCountUp(){
    setState(() {
      youthCount++;
    });
  }

  void youthCountDown(){
    setState(() {
      if(youthCount > 0){
        youthCount--;
      }
    });
  }

  // 예매하기
  void seatSelection(){
    // print("선택된 극장 : $targetTheater");
    // print("선택된 영화 ID : $movieId");
    // print("선택된 TheaterList ID : $targetTheaterListId");
    // print("선택된 날짜 : $targetDate");
    // print("선택된 시간 : $targetTime");
    // print("성인 : $adultCount");
    // print("청소년 : $youthCount");
    int count = adultCount + youthCount;
    setState(() {
      if(targetTheater == ""){
        message = "극장을 선택해주세요";
      }
      else if(targetDate == ""){
        message = "날짜를 선택해주세요";
      }
      else if(targetTime == ""){
        message = "시간을 선택해주세요";
      }
      else if(count == 0){
        message = "인원을 선택해주세요";
      }
      else{
        message = "";
      }
      
    });

    if(message == ""){
      // 스크린 이동 및 좌석 선택 이동
      print("이동!!");
      Navigator.pushNamed(context, "/seatselection", 
      arguments: {
        "theatersListId": targetTheaterListId,
        "adultCount": adultCount, // 성인 10000
        "youthCount": youthCount, // 청소년 5000
      });
    }
  }

  @override
  Widget build(BuildContext context) {
  
  UserProvider userProvider = Provider.of<UserProvider>(context, listen: true);
  if( !userProvider.isLogin){
    WidgetsBinding.instance.addPostFrameCallback( (_) {
      if(Navigator.canPop(context)){
        Navigator.pop(context);
      }
      Navigator.pushNamed(context, '/login');
    });
  }

    return Scaffold(
      appBar: AppBar(
        title: Text("$movieTitle"),
      ),
      body: Container(
        padding: const EdgeInsets.fromLTRB(5, 0, 5, 10),
        child: Column(
          children: [
            // 지역 구역 버튼
            FutureBuilder(
              future: _Region, 
              builder: (context, snapshot){
                // print("로딩전");
                // 로딩중
                if( snapshot.connectionState == ConnectionState.waiting ) {
                  return Center(child: CircularProgressIndicator());
                }
                else if( snapshot.hasError){
                  return Center(child: Text("데이터 조회 시, 에러 발생"),);
                }
                else if( !snapshot.hasError && snapshot.data!.isEmpty){
                  // print(_Region);
                  // print(snapshot.data);
                  return Center(child: Text("조회된 데이터가 없습니다."),);
                }
                else{
                  List<String> region = snapshot.data!;
                  // print("정상 출력 region ${region}");
                  // print("정상 출력 region ${region.length}");
                  // return Center(child: Text("정상출력이긴한대 return 값 에러"),);
                 return SizedBox(
                  height: 50,
                    child: SingleChildScrollView( // 스크롤 가능하도록 추가
                      scrollDirection: Axis.horizontal, // 가로 스크롤
                      child: Row(
                        children: region.asMap().entries.map((e) {
                          int index = e.key;
                          String area = e.value;
                          return Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 8),
                            child: TicketButtom(
                              text: area,
                              id: area,
                              index: index,
                              onButtonTap: regionButtonTap,
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  );
                }
              }
            ),
            // 극장 구역 버튼
            FutureBuilder(
              future: _Theaters, 
              builder: (context, snapshot){
                // print("로딩전");
                // 로딩중
                if( snapshot.connectionState == ConnectionState.waiting ) {
                  return Center(child: CircularProgressIndicator());
                }
                else if( snapshot.hasError){
                  return Center(child: Text("데이터 조회 시, 에러 발생"),);
                }
                else if( !snapshot.hasError && snapshot.data!.isEmpty){
                  print("조회된 데이터가 없습니다.");
                  return Center(child: Text("지역을 먼저 클릭해주세요"),);
                }
                else{
                  List<dynamic> theaters = snapshot.data!;
                  // print("정상 출력 theaters ${theaters}");
                  // print("정상 출력 theaters ${theaters.length}");
                  // return Center(child: Text("정상출력이긴한대 return 값 에러"),);
                 return SizedBox(
                  height: 50,
                    child: SingleChildScrollView( // 스크롤 가능하도록 추가
                      scrollDirection: Axis.horizontal, // 가로 스크롤
                      child: Row(
                        children: theaters.asMap().entries.map((e) {
                          String areaSub = e.value;
                          int index = e.key;
                          return Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 8),
                            child: TicketButtom(
                              text: areaSub,
                              id: areaSub,
                              index: index,
                              onButtonTap: theaterButtonTap,
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  );
                }
              }
            ),
            // 날짜 구역 버튼
            FutureBuilder(
              future: _Dates, 
              builder: (context, snapshot){
                // print("로딩전");
                // 로딩중
                if( snapshot.connectionState == ConnectionState.waiting ) {
                  return Center(child: CircularProgressIndicator());
                }
                else if( snapshot.hasError){
                  return Center(child: Text("데이터 조회 시, 에러 발생"),);
                }
                else if( !snapshot.hasError && snapshot.data!.isEmpty){
                  print("조회된 데이터가 없습니다.");
                  return Center(child: Text("극장을 먼저 클릭해주세요"),);
                }
                else{
                  List<dynamic> Dates = snapshot.data!;
                  // print("정상 출력 theaters ${theaters}");
                  // print("정상 출력 theaters ${theaters.length}");
                  // return Center(child: Text("정상출력이긴한대 return 값 에러"),);
                 return SizedBox(
                  height: 50,
                    child: SingleChildScrollView( // 스크롤 가능하도록 추가
                      scrollDirection: Axis.horizontal, // 가로 스크롤
                      child: Row(
                        children: Dates.asMap().entries.map((e) {
                          String areaSub = e.value;
                          int index = e.key;
                          return Padding(
                            padding: const EdgeInsets.symmetric(horizontal: 8),
                            child: TicketButtom(
                              text: areaSub,
                              id: areaSub,
                              index: index,
                              onButtonTap: datesButtonTap,
                            ),
                          );
                        }).toList(),
                      ),
                    ),
                  );
                }
              }
            ),
            // 상영관 별 시간 구역 버튼
            FutureBuilder(
              future: _Theater, 
              builder: (context, snapshot){
                // print("로딩전");
                // 로딩중
                if( snapshot.connectionState == ConnectionState.waiting ) {
                  return Center(child: CircularProgressIndicator());
                }
                else if( snapshot.hasError){
                  return Center(child: Text("데이터 조회 시, 에러 발생"),);
                }
                else if( !snapshot.hasError && snapshot.data!.isEmpty){
                  print("조회된 데이터가 없습니다.");
                  return Center(child: Text("날짜를 먼저 클릭해주세요"),);
                }
                else{
                  List<dynamic> theaters = snapshot.data!;
                  // print("정상 출력 theaters ${theaters}");
                  // print("정상 출력 theaters ${theaters.length}");
                  // return Center(child: Text("정상출력이긴한대 return 값 에러"),);
                 return SizedBox(
                  height: 300,
                    child: SingleChildScrollView( // 스크롤 가능하도록 추가
                      scrollDirection: Axis.vertical, // 가로 스크롤
                      child: Column(
                        children: theaters.asMap().entries.map((e) {
                          String theater = e.value;
                          int index = e.key;
                          return Column(
                            children: [
                              Padding(
                                padding: const EdgeInsets.symmetric(horizontal: 8),
                                child: Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(theater,
                                    style: TextStyle(
                                      fontSize: 20,
                                      fontWeight: FontWeight.bold,
                                    ),),
                                ),
                              ),
                              SingleChildScrollView(
                                scrollDirection: Axis.horizontal,
                                child: Row(
                                  children: theaterData.asMap().entries.where((e) => e.value[theater] is Map<String, dynamic>).map((e) {
                                    
                                    String time = e.value[theater]["time"];
                                    String id = e.value[theater]["Id"];

                                    // String time = e.value["time"];
                                    // String id = e.value["Id"];
                                    // int index = e.key;
                                    return Padding(
                                      padding: const EdgeInsets.symmetric(horizontal: 8),
                                      child: TicketButtom(
                                        text: time, 
                                        id: id, 
                                        index: 0, 
                                        onButtonTap: timesButtonTap,
                                      )
                                    );
                                  }).toList(),
                                ), 
                              ),
                            ],
                            
                          );
                        },).toList(),
                      ),
                      
                    ),
                  );
                }
              }
            ),
            Divider(thickness: 2, color: Colors.grey,),
            Center(child: Text("영화 제목: $movieTitle")),
            Center(child: Text("예매 일자: $targetDate $targetTime")),
            Center(child: Text("$message",style: TextStyle(color: Colors.red),)),
            
            // 예매하기 버튼
            Row(
              children: [
                // 인원 선택
                Expanded(
                  flex:7,
                  child: Column(
                    children: [
                      // 성인
                      Row(
                        children: [
                          SizedBox(width: 30,),
                          Text("성인", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          SizedBox(width: 25,),
                          Text("$adultCount", style: TextStyle(fontSize: 20),),
                          IconButton(
                            icon: Icon(Icons.arrow_drop_up),
                            onPressed:() {
                              // 성인 티켓 증가 로직
                              adultCountUp();
                            } ,
                          ),
                          IconButton(
                            icon: Icon(Icons.arrow_drop_down),
                            onPressed:() {
                              // 성인 티켓 감소 로직
                              adultCountDown();
                            } ,
                          ),
                        ],
                      ),
                      SizedBox(height: 10),

                      // 청소년
                      Row(
                        children: [
                          SizedBox(width: 30,),
                          Text("청소년", style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                          SizedBox(width: 10,),
                          Text("$youthCount", style: TextStyle(fontSize: 20),),
                          IconButton(
                            icon: Icon(Icons.arrow_drop_up),
                            onPressed:() {
                              // 청소년 티켓 증가 로직
                              youthCountUp();
                            } ,
                          ),
                          IconButton(
                            icon: Icon(Icons.arrow_drop_down),
                            onPressed:() {
                              // 청소년 티켓 감소 로직
                              youthCountDown();
                            } ,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),

                // 예매하기 버튼
                Expanded(
                  flex: 3,
                  child: Padding( // Padding을 Align 밖으로 이동
                    padding: EdgeInsets.only(right: 20),
                    child: Align(
                      alignment: Alignment.centerRight,
                      child: ElevatedButton(
                        child: Text("예매하기"),
                        onPressed: () {
                          seatSelection();
                        },
                        style: ElevatedButton.styleFrom(
                          padding: EdgeInsets.symmetric(vertical: 40, horizontal: 20),
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ],
          
          ),
      ),
    );
  }
}