import React, { useEffect, useState } from 'react';
import * as ticket from '../../../apis/ticket';
import styles from './SeatSelectionFrom.module.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';


const SeatSelectionFrom = () => {
    // 딜레이
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    const [mapData,setMapData] = useState([]);

    const [reserve,setReserve] = useState([]);
    const [reservationSeat,setReservationSeat] = useState([]);
    const [reservationSeat1,setReservationSeat1] = useState([]); // 중복검사용
    const [count, setCount] = useState(0);
    const [movieId, setMovieId] = useState()
    const [movieTitle, setMovieTitle] = useState()
    const [uuuuid,setUuuuId] = useState()

    const [authUserName, setAuthUserName] = useState()
    const [authUserEmail, setAuthUserEmail] = useState()
    const [money, setMoney] = useState();
    const [person, setPerson] = useState();
    const [theaterId, setTheaterId] = useState();

    const [seatChecked, SetSeatChecked] = useState();

    useEffect( () => {
        console.log("seatChecked 체크 : ", seatChecked);
        if(seatChecked == 1){
            console.log("값 1");
            getdata()
        }
        if(seatChecked == 2){
            console.log("값 2");
            console.log(reservationSeat1);

            var seatcount = 0;
            var seat = document.getElementById("seat").getAttribute("seat"); // 예약 좌석
            var seats = seat.split(",")
            console.log("선택한 seat값 : ", seat);
            
            for( var s1 of  reservationSeat1){
                for( var s2 of seats){
                    if(s1 == s2){
                        console.log(s1,"좌석이 중복되었습니다");
                        seatcount = 1;
                    }
                }
            }
            let data = {
                'id' : theaterId, // theaterId
                'seat': seat, // 시트값 외부 부러오기
                'person': person, // 예약인원 외부에서
                'userName' : authUserName, // 외부에서
                'money' : money, // 외부에서
                'orderId' : orderId // 외부?
            };
            const headers = {
                'Content-Type' : 'multupart/form-data'
            }
            if( seatcount == 1){
                console.log("환불진행");
                jungbok(orderId)
                alert("결제실패하였습니다.")
                // location.href = `/Ticket/SeatSelection?theaterListId=${theaterId}&person=${person}_${money}`
            } else {
                // DB 등록
                payment(data,headers)
            }
        }     

    }, [seatChecked])


    async function jungbok(){
        var count = 0
        while (true) {
            var mId = orderId;
            console.log(mId);
            const response = await ticket.hanbul(mId);
            console.log("결과?",response.status);
            if(response.status == 200){
                return
            }
            
            
            count++
            console.log("카운트 : ", count);
            
            if(count == 1000){
                return
            }
        }
    }

    async function payment(data,headers){
        const response = await ticket.moviePayment(data,headers);
        console.log(response.status);
        const status = response.status
        const data2 = response.data
        if(status == 200){
            console.log("결제 성공");
            console.log("예매 ID",data2.reserveId);
            location.href = '/Ticket/Payment?id='+data2.reserveId
            // 이동경로 설정해줘야함
        } else {
            console.log("결제 실패");
            alert('결제 실패')
        }
    }

    // const getdata1 = async(seatcount) => {
    //     if(seatcount ==1){
    //         // 주소에서 불러오자
    //         const searchParams = new URLSearchParams(location.search);
    //         const theaterListId = searchParams.get("theaterListId");
    //         const person = searchParams.get("person")
    //         console.log("상영영화ID",theaterListId);
            
    //         const headers = {
    //             'Content-Type' : 'multupart/form-data'
    //         }
    //         const response = await ticket.seatSelection(theaterListId,person,headers)
    //         const data = response.data;

    //         setReserve(data.reserve)
    //         return data.reserve
    //     }
    // }

    const getdata = async () => {
        if(!seatChecked){
            if(count == 1){
                // 주소에서 불러오자
                const searchParams = new URLSearchParams(location.search);
                const theaterListId = searchParams.get("theaterListId");
                const person = searchParams.get("person")
                console.log("상영영화ID",theaterListId);
                
                const headers = {
                    'Content-Type' : 'multupart/form-data'
                }
                const response = await ticket.seatSelection(theaterListId,person,headers)
                const data = response.data;
                setMapData(data.mapData);
                setReservationSeat(data.reservationSeat)
                setMovieId(data.movieId)
                setMovieTitle(data.movieTitle)
                setUuuuId(data.uuuuid)
                setAuthUserName(data.authUserName)
                setAuthUserEmail(data.authUserEmail)
                setTheaterId(data.theaterId)
                setMoney(data.money)
                setPerson(data.person)
                
                setReservationSeat1(data.reservationSeat)
            }
        } else{
            console.log("SetSeatChecked 값 존제");
            
            // 주소에서 불러오자
            const searchParams = new URLSearchParams(location.search);
            const theaterListId = searchParams.get("theaterListId");
            const person = searchParams.get("person")
            
            const headers = {
                'Content-Type' : 'multupart/form-data'
            }
            await delay(1000); // 1초 딜레이
            const response = await ticket.seatSelection(theaterListId,person,headers)
            const data = response.data;
            setReservationSeat1(data.reservationSeat)
            console.log("setReservationSeat1 등록");
            
            SetSeatChecked(2)
        }
      
      
    }


    const [boidcount,setBoidcount] = useState(0);
    
    const [x,setX] = useState(); 
    const [y,setY] = useState();



    // 2️⃣  객체 초기화 하기
    

    let uuida = uuuuid;
  
    var orderId = "IMP"+uuida

    // console.log(reservationSeat);
    const endExport = (mapData) => { 
        
        setX(mapData[0].length); 
        setY(mapData.length);

        setCount(2)

        // console.log(boidcount,ascii,mapData[0].length,mapData.length);
        
    }
        // console.log("Y = " + y)
        // console.log("X = " + x)
        
        
    const [ascii,setAscii] = useState(65);
    const [seatNum, setSeatNum] = useState(0);
    /** 맵 생성 */
    const addMap = () => {
        console.log("addMap 생성 시작");
        var mapdiv = document.getElementById("map")
        if(y > 9){
            mapdiv.classList.add((styles.scroll));
        mapdiv.style.overflowX = "hidden";
        
    }
    for(var n = 0; n < y; n++){
        let boidcountCheck=0
        var map = document.createElement("div")
        let ascii2 = String.fromCharCode(ascii + n); // 아스키코드 문자변환
        
        map.id = ascii2;
        map.className=styles.mapBACHI;
        
        
        mapdiv.appendChild(map);
        
        // 좌석 생성
        var count = 1;
        for(var mapdate of mapData[n]){
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
                // console.log(mapdate)
            }
        }
        
        if(boidcount<boidcountCheck){
            setBoidcount(boidcountCheck)
        }
        
        
        // 좌석 통로 구분
        var countt = 1;
        for(var [index, mapdate] of mapData[n].entries()){
            // console.log(ascii2 + " : " + index); // index 번호 0~끝까지 찍는 예제
            var seatId = ascii2 + countt; countt++;
            // console.log("좌석생성 : ",countt);
            // console.log(seatId);
            
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
            // console.log("시트 ID : " + mapdate);
            seat.classList.add("select");
        }
        // console.log(seat);
        
        // 좌석 빨간색 X 처리
        var counttt = 1;
        for(var mapdate of mapData[n]){
                    var seatId = ascii2+counttt;counttt++;
                    for(var seat of reservationSeat){
                                if(seatId == seat){
                                    // console.log(seat);
                                    var noneSeat = document.getElementById(seatId);
                                    noneSeat.classList.remove("select") 
                                    noneSeat.style.backgroundColor = "Red";
                                    noneSeat.style.color = "white";
                                    noneSeat.textContent = "";
                                    noneSeat.classList.add(styles.close);
                                    noneSeat.classList.add(styles.close2);
                            }
                        }
                    }

                }
                
            } // for 끝
        } /** addMap 끝 */
        
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
                    setSeatNum(selectedSeats.length);
                }
                
                // 상태를 화면에 표시
                document.getElementById("seat").textContent = `${selectedSeats.map(seat => seat.getAttribute("seatNumber")).sort().join(", ")}`;
                document.getElementById("seat").setAttribute("seat",`${selectedSeats.map(seat => seat.getAttribute("seatNumber")).sort().join(",")}`);
            });
        });
    }
    // 예매하기 버튼
    const reservation = async () =>{
        //   var person = "[[${person}]]";
        var person = document.getElementById("person").getAttribute("person"); // 예약 인원
        console.log('selectedSeats');
        console.log(selectedSeats)
        console.log("예매수",person,"현제 예매수",seatNum);
        if(person != seatNum){
            alert("예약인원수만큼 좌석을 선택하시오")
            return;
        }


        
        // 결제 정보 가져오기
        let productName = document.getElementById('theater-info').textContent
        console.log('상품이름은 ' + productName);
        console.log('상품아이디는 ' + orderId);

        var IMP = window.IMP;

        // console.log("예매정보 전부 : ",reserve);
        console.log("reserve",reserve);
        
        
        console.log("요까진 옴?");
          IMP.request_pay({
                  pg : 'kcp',                                 // PG사
                  pay_method : 'card', 
                  merchant_uid: orderId,                       // 결제방식
                  name : productName,                         // 상품명
                  amount : '100',                              // 결제금액
                  buyer_email : 'authUserName@naver.com',                        // 결제자 이메일
                  buyer_name : authUserName,                          // 결제자 이름
                  buyer_tel : '010-1234-1234',                            // 결제자 전화번호
                    buyer_addr : '테스트 테스트대로',                       // 결제자 주소
                    buyer_postcode : '1234-1234'                   // 결제자 우편번호
                }, async function (rsp) { // callback
                if (rsp.success) {
                    // 결제 성공
                    console.log("rsp",rsp);
                    // 새로 데이터 불러오기
                    SetSeatChecked(1)
                } else {
                    // 결제 실패
                    console.log("결제 실패");
                    console.log(rsp);
                    return;
                }
            });
                        
    }

    useEffect( () => {
        setCount(1);      
    }, [])




    useEffect( () => {
        console.log("reservationSeat : ", reservationSeat);
        console.log("movieId : ", movieId);
        console.log("movieTitle : ", movieTitle);
        console.log("UUID: ", uuuuid);
        console.log("mapData", mapData);
        if(mapData.length > 0){
            console.log("endExport 실행");
            endExport(mapData)
        }

    }, [reservationSeat,movieId,movieTitle,uuuuid,authUserName,authUserEmail,theaterId,money,person])
                    
    useEffect(() => {

        getdata()
        console.log("addMap 실행전 count : ", count );
        if(count == 2){
            addMap()
            let seats = document.querySelectorAll(".select");
            seatsClick(seats)
            console.dir(seats);
            // 동적으로 아임포트 스크립트를 로드
            const script = document.createElement("script");
            script.src = "https://cdn.iamport.kr/v1/iamport.js";
            script.async = true;
            document.body.appendChild(script);
            
            script.onload = () => {
                // 아임포트 초기화
                if (window.IMP) {
                    const IMP = window.IMP;
                    IMP.init("imp00366386");
                    console.log("IMP re-initialized with imp00366386");
                } else {
                    console.error("아임포트 스크립트를 로드할 수 없습니다.");
                }
            };
            return () => {
                // 컴포넌트가 언마운트될 때 스크립트 제거
                document.body.removeChild(script);
            };
        }//if 끝
    }, [count])
    

    
    
    
    return (
    <>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet"></link>
    <style>
        {`.select {cursor: pointer;}`}
    </style>
    <div className="container-fluid p-0 d-flex">
        {/* <div className="header flex-fill" ></div> */}
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
        <div className={styles.header + " flex-fill"}></div>
    </div>

    {/* 하단바 */}
    <div className={"container-fluid " + styles.bTop}>
        <div className={styles.container1 +' container d-flex justify-content-between p-0'}>
            <div className="align-content-center">
                <div className={'d-flex ' + styles.reserveImg}>
                    <img src={`/api/files/img?id=${movieId}`} alt="" />
                    <div className="align-content-center ms-5">
                        <h3 id="theater-info">{movieTitle}</h3>
                    </div>
                    <div className="align-content-center ms-5">
                    <p className="m-1">명수 &nbsp; &nbsp; &nbsp; <span type="number" id="person"  person={person}>{person}</span></p>
                    <p className="m-1">좌석 &nbsp; &nbsp; &nbsp; <span id="seat"></span></p>
                    </div>
                </div>
            </div>

            <div className="align-content-center">
                <button className={'btn ' +styles.reserveBtn} id='reservatio' onClick={reservation} ><FontAwesomeIcon icon={faAngleRight} size="3x" /><p>예매하기</p></button>
            </div>
        </div>
    </div>
    </>
  )
  
}
export default SeatSelectionFrom  