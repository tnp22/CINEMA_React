import React, { useEffect, useState } from 'react';
import styles from './SeatSelectionFrom.module.css';
import { useLocation } from 'react-router-dom';
import * as ticket from '../../../apis/ticket'

const SeatSelectionFrom = () => {

    const [mapData,setMapData] = useState([]);
    const [count, setCount] = useState(0);

    useEffect( () => {
        console.log("mapData updated: ", mapData);
        if(mapData.length > 0){
            endExport(mapData)
            setCount(1);
        }
    }, [mapData]);

    const getdata = async() => {
      // 주소에서 불러오자
      const searchParams = new URLSearchParams(location.search);
      const theaterListId = searchParams.get("theaterListId");
      const person = searchParams.get("person")
      // console.log("상영영화ID",theaterListId);
      
      const headers = {
        'Content-Type' : 'multupart/form-data'
      }
  
      const response = await ticket.seatSelection(theaterListId,person,headers)
      const data = response.data;
      setMapData(data.mapData);
    }
    useEffect( () =>{
        getdata();
    }, []);



    const [boidcount,setBoidcount] = useState(0);
    const [ascii,setAscii] = useState(65);
    const [x,setX] = useState(); 
    const [y,setY] = useState();
    
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);

    const theaterListId = searchParams.get("theaterListId");
    const data = searchParams.get("person").split("_");
    const person = data[0];
    const money = data[1];

    console.log(theaterListId)
    console.log(person)
    console.log(money)


    // 2️⃣  객체 초기화 하기
    // var IMP = window.IMP; 
    // IMP.init("imp67011510"); 
    // IMP.init("imp00366386"); 
    // let uuida = '[[${uuuuid}]]'
  
    // var orderId = "IMP"+uuida
    // let potName = "[[${authUser.name}]]"
    // let potEmail = "[[${authUser.email}]]"
    // const mapData = [
    //     ["A1_통로", "A2_통로", "A3", "A4", "A5", "A6", "A7", "A8"],
    //     ["B1_통로", "B2_통로", "B3", "B4", "B5", "B6", "B7", "B8"],
    //     ["C1_통로", "C2_통로", "C3", "C4", "C5", "C6", "C7", "C8"],
    //     ["D1_통로", "D2_통로", "D3", "D4", "D5", "D6", "D7", "D8"]
    // ]

    // console.log(reservationSeat);
    const endExport = (mapData) => { 
        
        setX(mapData[0].length); 
        setY(mapData.length);

        console.log(boidcount,ascii,mapData[0].length,mapData.length);
        
    }
        // console.log("Y = " + y)
        // console.log("X = " + x)
        
        
        const addMap = (mapdiv) => {
            
            if(y > 9){
                mapdiv.classList.add((styles.scroll));
                mapdiv.style.overflowX = "hidden";
                
            }
            for(var n = 0; n < y; n++){
        let boidcountCheck=0
        // console.log(mapData[n])
        // console.log(mapData[n][0]);
        var map = document.createElement("div")
        let ascii2 = String.fromCharCode(ascii); // 아스키코드 문자변환
        map.id = ascii2;
        map.className=styles.mapBACHI;
        
        
        // map.textContent = mapData[n][0];
        mapdiv.appendChild(map);
        
        // 좌석 생성
        var count = 1;
        for(var mapdate of mapData[n]){
            // console.log(map)
            var seat = document.createElement("div");
            seat.className = `${styles.seat} ${styles.available}`;
            var seatId = ascii2+count;count++;
            seat.setAttribute("seat", mapdate);
            seat.setAttribute("seatNumber", seatId);
            seat.id = seatId;
            seat.textContent = seatId;
            map.appendChild(seat);
            if(mapdate == "통로" || mapdate == (seatId+"_통로")){
                boidcountCheck++
                var seat1 = document.createElement("div")
                seat1.className = styles.seat;
                map.appendChild(seat1)
                // seat.style.marginRight = "50px"
                // console.log(mapdate)
            }
        }
        if(boidcount<boidcountCheck){
            setBoidcount(boidcountCheck)
        }

        
        // 좌석 통로 구분
        count = 1;
        for(var [index, mapdate] of mapData[n].entries()){
            // console.log(ascii2 + " : " + index); // index 번호 0~끝까지 찍는 예제
            var seatId = ascii2 + count; count++;
            var seat = document.getElementById(seatId);
            if(mapdate == "통로" || mapdate == (seatId+"_통로")){
                // var seat1 = document.createElement("div")
                // seat1.className = "seat";
                // map.appendChild(seat1)
                // seat.style.marginRight = "50px"
            }
            else if(mapdate == "null"){
                seat.textContent = "";
                // seat.className = "";
            }
            
            if(mapdate == "null" || mapdate == "통로"){
                seat.className = styles.seat;
                seat.textContent = "";
                seat.style.backgroundColor = "";
            }
            else{
                seat.classList.add("select");
            }
        }
        
        // 좌석 빨간색 X 처리
        count = 1;
        // for(var mapdate of mapData[n]){
    //     var seatId = ascii2+count;count++;
        
    //     for(var seat of reservationSeat){
    //         if(seatId == seat){
        //             console.log(seat);
        //             var noneSeat = document.getElementById(seatId);
        //             noneSeat.classList.remove("select") 
        //             noneSeat.style.backgroundColor = "Red";
        //             noneSeat.style.color = "white";
        //             noneSeat.textContent = "";
        //             noneSeat.classList.add("close");
    //             noneSeat.classList.add("close2");
    //         }
    //     }
    // }
    
    setAscii(ascii+1);
    // ascii++;
}
} //끝

let sjfql = document.getElementsByClassName("mapBACHI2")
for (let i = 0; i < sjfql.length; i++) {
    if((40*y+(y+2)*4+8)>800){
          sjfql[i].style.height = "400px";
         }
         else{
          sjfql[i].style.width = 42*(x+2+boidcount)+"px";
          sjfql[i].style.height = (40*y+(y+2)*4+8)+"px";
         }
    }

    let selectedSeats = []; // 선택된 요소를 저장할 배열
    // let seats = document.querySelectorAll(".select");
    // console.dir(seats);
    
    const seatsClick =(seats) => {

        // 각 요소 클릭 이벤트 추가
        seats.forEach(function(seat) {
        seat.addEventListener("click", function(e) {
          let person = document.getElementById("person"); // 선택 가능한 인원 수
          let personCount = parseInt(person.getAttribute("person"))
          let seatNumber = seat.getAttribute("seatNumber");
          
          // 클릭 이벤트에서 이미 선택 상태인지 확인
          if (selectedSeats.includes(seat)) {
              // 클릭한 요소가 이미 선택 상태라면 초기 상태로 되돌림
              seat.style.backgroundColor = "";
              selectedSeats = selectedSeats.filter(s => s !== seat); // 선택 배열에서 제거
            } else {
                // 최대 인원 제한 확인
                if (selectedSeats.length >= personCount) {
                    // 가장 오래 선택된 요소부터 초기 상태로 되돌림
                    let removedSeat = selectedSeats.shift();
                    removedSeat.style.backgroundColor = "";
                }
                
                // 선택한 요소 배경색 변경
                seat.style.backgroundColor = "#b0b0b0";
                selectedSeats.push(seat); // 선택 요소 배열에 추가
            }
            
            // 상태를 화면에 표시
            document.getElementById("seat").textContent = `${selectedSeats.map(seat => seat.getAttribute("seatNumber")).sort().join(", ")}`;
            document.getElementById("seat").setAttribute("seat",`${selectedSeats.map(seat => seat.getAttribute("seatNumber")).sort().join(",")}`);
        });
    });
}
// 예매하기 버튼
    const reservation = () =>{
    //   var person = "[[${person}]]";
    console.log('selectedSeats');
    console.log(selectedSeats)
    console.log('setnum');
    var setnum = selectedSeats.length;
      console.log(setnum);
      if(person != setnum){
        alert("예약인원수만큼 좌석을 선택하시오")
        return;
      }

      // 결제 정보 가져오기
      let productName = document.getElementById('theater-info').textContent
      console.log('상품이름은 ' + productName);
      console.log('상품아이디는 ' + orderId);

    //   IMP.request_pay({
    //       pg : 'kcp',                                 // PG사
    //       pay_method : 'card', 
    //       merchant_uid: orderId,                       // 결제방식
    //       name : productName,                         // 상품명
    //       amount : '100',                              // 결제금액
    //       buyer_email : potEmail ,                        // 결제자 이메일
    //       buyer_name : potName,                          // 결제자 이름
    //       buyer_tel : '010-1234-1234',                            // 결제자 전화번호
    //       buyer_addr : '테스트 테스트대로',                       // 결제자 주소
    //       buyer_postcode : '1234-1234'                   // 결제자 우편번호
    //   }, function (rsp) { // callback
    //       if (rsp.success) {
    //           // 결제 성공
    //           console.log(rsp);
    //           // 결제 완료 페이지로 이동
    //           var person = document.getElementById("person").getAttribute("person"); // 예약 인원
    //           var seat = document.getElementById("seat").getAttribute("seat"); // 예약 좌석
    //           var id = "[[${theaterId}]]";
    //           var name = "[[${#authentication.name}]]";
    //           var money = "[[${money}]]"        
    //           // console.log(seat)
    //           // console.log(person);
    //           console.log(id);
    //           let data = {
    //               'id' : id,
    //               'seat': seat,
    //               'person': person,
    //               'userName' : name,
    //               'money' : money
    //           };

    //           let request = new XMLHttpRequest();
    //           let url = '/m/p';
    //           request.open('POST', url, true);
    //           request.setRequestHeader('Content-Type', 'application/json');
    //           let csrfToken = "[[${_csrf.token}]]";
    //           request.setRequestHeader("X-CSRF-TOKEN", csrfToken);

    //           request.onreadystatechange = function () {
    //               if (request.readyState === 4 && request.status === 200) {
    //                   window.location.href = '/m/payment';
    //               }
    //           };

    //           request.send(JSON.stringify(data));
    //       } else {
    //           // 결제 실패
    //           console.log(rsp);
    //           return;
    //       }
    //   });

    }
    
    useEffect(() => {
        var mapdiv = document.getElementById("map")
        addMap(mapdiv)
        let seats = document.querySelectorAll(".select");
        seatsClick(seats)
        console.dir(seats);
    }, [count])
    


  return (
    <>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet"></link>
    <style>
        {`.select {cursor: pointer;}`}
    </style>
    <div className="container-fluid p-0 d-flex">
        <div className="header flex-fill" ></div>
        <div className="container p-0">
            {/* 본문 */}
            <div className="row m-0 p-0 w-100 col-3 text-center">
                <div className="col p-0">
                    {/* 좌석 */}
                    <div className={styles.header}><h5>좌석 선택</h5></div>
                    <div className={styles.content + " p-0"}>
                        <div className={styles.content1}>
                            <div className={styles.mapBACHI2} id='map'>
                                <div className={styles.content2}>
                                    <h1 className={styles.content3}>SCREEN</h1>
                                </div>
                                {/* 비동기 생성 */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className={styles.header + " flex-fill"}></div>
    </div>

    {/* 하단바 */}
    <div className={"container-fluid " + styles.bTop}>
        <div className={styles.container1 +' container d-flex justify-content-between p-0'}>
            <div className="align-content-center">
                <div className={'d-flex ' + styles.reserveImg}>
                    <img src="" alt="" />
                    <div className="align-content-center ms-5">
                        <h3 id="theater-info">movie.title</h3>
                    </div>
                    <div className="align-content-center ms-5">
                    <p className="m-1">명수 &nbsp; &nbsp; &nbsp; <span type="number" id="person"  person={person}>{person}</span></p>
                    <p className="m-1">좌석 &nbsp; &nbsp; &nbsp; <span id="seat"></span></p>
                    </div>
                </div>
            </div>

            <div className="align-content-center">
                <button className={'btn ' +styles.reserveBtn} id='reservatio' onClick={reservation} ><i className="fa-solid fa-angle-right fa-3x"></i><p>예매하기</p></button>
            </div>
        </div>
    </div>
    </>
  )
}

export default SeatSelectionFrom