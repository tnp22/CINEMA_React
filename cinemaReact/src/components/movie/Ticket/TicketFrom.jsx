import React, { useContext, useEffect, useState } from 'react';
import styles from './TicketFrom.module.css';

const TicketFrom = ({movie,ticketList1,movieTitle}) => {
  console.log(movie);
  // const title = movieTitle
  const [ticketList, setTicketList] = useState([]);
  
  // setMovie(data.movie)
  // console.log(movie);
  let Region = [];
  let Theaters = [];
  let Dates = [];
  


  // 예시 데이터
  // const ticketList = [
  //   {
  //     area: "경기",
  //     areaSub: "부평",
  //     time: "Sat Dec 07 12:14:41 KST 2024",
  //     title: "모아나2",
  //     theaterName: "1관",
  //     id: "test",
  //     mapUrl: "C:\\upload\\map1.text",
  //     movieId: "6e937900-b05b-11ef-b8e4-4ccc6ad7549d",
  //     theaterId: "test",
  //     cinemaId: "2a21298e-ad43-4a7f-bac2-84714de3a175",
  //     seat: 5
  //   },
  //   {
  //     area: "경기",
  //     areaSub: "부평",
  //     time: "Mon Dec 09 12:14:41 KST 2024",
  //     title: "모아나2",
  //     theaterName: "2관",
  //     id: "test2",
  //     mapUrl: "da2511eb-c95e-40c9-a610-ee76c5e9934d",
  //     movieId: "6e937900-b05b-11ef-b8e4-4ccc6ad7549d",
  //     theaterId: "da2511eb-c95e-40c9-a610-ee76c5e9934d",
  //     cinemaId: "2a21298e-ad43-4a7f-bac2-84714de3a175",
  //     seat:"10"
  //   }
  // ];


  
  
  // 지역 출력
  const area = () =>{
    const region = document.getElementById("region-list")
    region.innerHTML = "";
    
    for(var R of Region){
      const newli = document.createElement("li");
      newli.className = styles.list_group_item
      newli.setAttribute("data-region", R);
      newli.textContent = R;
      region.appendChild(newli); // 새 리스트 항목을 리스트에 추가
      
    }
  };

  const [regionTheaterData, setRegionTheaterData] = useState([]);
  // const [theaterDateData,setTheaterDateData] = useState([]);
  const [theaterDateData] = useState([]); 
  const endExport = (ticketList) => {
    
    console.log("티켓",ticketList);
    // 지역 데이터 저장
    for(var list of ticketList){
      Region.push(list.area);
    }
    // 중복제거 오름차순 정렬
    Region = [...new Set(Region)].sort((a, b) => a.localeCompare(b));
    console.log("지역",Region);
    // ticketList 정렬 (areaSub -> time 순서로 정렬)
    ticketList.sort((a, b) => {
      if (a.areaSub === b.areaSub) {
        return new Date(a.time) - new Date(b.time); // 시간 순 정렬
    }
    return a.areaSub.localeCompare(b.areaSub); // areaSub 기준 정렬
  });

  for (var R of Region) {
    let Theater = [];
    let regionDate = {}; // areaSub을 기준으로 그룹화하기 위해 객체 사용
    for (var [index, list] of ticketList.entries()) {
      // console.log(list.theaterName) // 상영관 출력
      if (R === list.area) {
        Theater.push(list.areaSub);
        
        const timeString = list.time.replace("KST", "+09:00");
        const dateObj = new Date(timeString);
        // 날짜 분리 (연-월-일)
        const datePart = dateObj.toISOString().split("T")[0]; // "2024-12-23"
        // console.log(datePart);
        
        if (!regionDate[list.areaSub]) {
          regionDate[list.areaSub] = []; // 초기화는 딱 한 번만 수행
          }
          if (!regionDate[list.areaSub].includes(datePart)) {
            regionDate[list.areaSub].push(datePart); // 중복 방지
          }
          // console.log(regionDate[list.areaSub])
          // console.log(list.areaSub);
          // console.log(datePart);
          
          
          // 날짜 기준 시간 분리 (시:분) + seat 분리
          const timePart = dateObj.toTimeString().slice(0, 5); // "15:40"
          // console.log(index + " " +list.seat)
          // console.log(timePart);
        }
      }
      Theaters.push(Theater);
      Dates.push(regionDate); // 이제 Dates에는 areaSub 기준으로 나눈 객체가 저장됨
    }
    // console.log(Dates)
    
    
    regionTheaterData[Region[0]] = Theaters[0]; // JSON 형식으로 저장
    Region.forEach((region, index) => {
      if (regionTheaterData[region]) {
        // 중복 제거 및 정렬
        const mergedTheaters = [...new Set([...regionTheaterData[region], ...Theaters[index]])].sort((a, b) => a.localeCompare(b));
        regionTheaterData[region] = mergedTheaters;
      } else {
        // 초기 데이터 설정 및 중복 제거 및 정렬 적용
        regionTheaterData[region] = [...new Set(Theaters[index])].sort((a, b) => a.localeCompare(b));
      }
    });
    // Region.forEach( (region, index) => {
    //   setRegionTheaterData(pervData => {
    //     const newRegionTheaterData = { ...pervData}; // 기존 데이터 복사

    //     if ( newRegionTheaterData[region]){
    //       // 중복 제거 및 정렬
    //       const mergedTheaters = [ ...new Set([ ...newRegionTheaterData[region], ...Theaters[index]])]
    //       .sort((a,b) => a.localeCompare(b)); newRegionTheaterData[region] = mergedTheaters;
    //     } else {
    //       // 초기 데이터 설정 및 중복 제거 및 정렬 적용
    //       newRegionTheaterData[region] = [...new Set(Theaters[index])].sort((a, b) => a.localeCompare(b));

    //     }

    //     return newRegionTheaterData;
    //   })
    // })
    console.log(Region);
    console.log(regionTheaterData);
    
    for (let i = 0; i < Dates.length; i++) {
      const regionTheaters = Dates[i]; // Dates에서 각 지역별 데이터 가져오기
      for (let areaSub in regionTheaters) { 
        // theaterDateData 초기화
        if (!theaterDateData[areaSub]) {
          theaterDateData[areaSub] = [];
        }
        
        // 중복 제거 후 날짜 병합
        const uniqueDates = [...new Set([...theaterDateData[areaSub], ...regionTheaters[areaSub]])];
        
        theaterDateData[areaSub] = uniqueDates;
      }
    }
    // console.log(theaterDateData);
    
  } // endExport 끝
    
    const dateTimeData = {};
    // 시간 및 관 JSON 형식 저장 코드 
    // ticketList를 순회하며 dateTimeData를 구성
    for (let list of ticketList) {
    const { areaSub, time, seat, theaterName } = list;
    
    const timeString = time.replace("KST", "+09:00")
    const dateObj = new Date(timeString);
    const datePart = dateObj.toISOString().split("T")[0]; // 날짜 부분 추출
    const timePart = dateObj.toTimeString().slice(0, 5); // 시간 부분 추출
    const MovieId = list.id;
    
    // 지역이 없으면 초기화
    if (!dateTimeData[areaSub]) {
      dateTimeData[areaSub] = [];
    }
    
    // 날짜 엔트리가 없으면 생성
    let dateEntry = dateTimeData[areaSub].find(entry => entry.date === datePart);
    if (!dateEntry) {
      dateEntry = {
        date: datePart,
        theaters: []
      };
      dateTimeData[areaSub].push(dateEntry);
    }
    
    // 극장 정보가 없으면 생성
    let theater = dateEntry.theaters.find(t => t.theater === theaterName);
    if (!theater) {
      theater = {
        theater: theaterName,
        times: []
      };
      dateEntry.theaters.push(theater);
    }
      
    // console.log(list.id)

    // 시간 및 좌석 정보를 추가
    theater.times.push({
      time: timePart,
      seats: seat,
      movieId: MovieId
    });
  }

  // DOM 요소
  // const regionList = document.getElementById("region-list");
  // const theaterList = document.getElementById("theater-list");
  // const dateList = document.getElementById("date-list");
  // const timeContainer = document.getElementById("time-container");

  // // 추가부분
  // // 하단의 예매 정보 띄우는 부분
  // const theaterInfo = document.querySelector("#theater-info");
  // const dateInfo = document.querySelector("#date-info");
  // const timeInfo = document.querySelector("#time-info");

  // 추가부분
    // 스크롤바의 날짜 포맷함수
    function formatDate(dateString) {
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const date = new Date(dateString);
      const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
      const day = date.getDate(); // 일(day) 얻기
      const dayOfWeek = days[date.getDay()]; // 요일 얻기

      
      // 요일에 따라 색상 결정
      let color = "black"; // 기본 글자색
      if (dayOfWeek === "토") {
        color = "#6781E8"; // 토요일은 파란색
      } else if (dayOfWeek === "일") {
        color = "#F47777"; // 일요일은 빨간색
      }

      return { formattedDate: `${month}/${day} (${dayOfWeek})`, color };
    }

    // 추가부분
    // 하단의 정보창의 날짜 포맷 함수
    function formatDate2(dateString) {
      const days = ["일", "월", "화", "수", "목", "금", "토"];
      const date = new Date(dateString);
      const month = date.getMonth() + 1; // 월은 0부터 시작하므로 +1
      const day = date.getDate(); // 일(day) 얻기
      const dayOfWeek = days[date.getDay()]; // 요일 얻기
      
      return `${date.getFullYear()}.${month.toString().padStart(2, "0")}.${day.toString().padStart(2, "0")}(${dayOfWeek})`;
    }

  // 지역 클릭 이벤트
  // regionList.addEventListener('click', function (e) {
  const regionClick = (e,theaterInfo, dateInfo, timeInfo, theaterList, dateList, timeContainer) => {
    // console.log('클릭');
    
    const region = e.target.getAttribute("data-region");
    if (!region) return;

    // 스크롤바에서 선택한 부분 active 클래스 추가해서 활성화
    const activeItem = document.querySelector("#region-list .list-group-item.active");
    if (activeItem) {
      // active 모두 지우기
      activeItem.classList.remove("active");
    }
    // 클릭된 항목에 'active' 클래스 추가
    e.target.classList.add("active");

    
    // 하단의 정보창 비우기
    theaterInfo.textContent="";
    dateInfo.textContent="";
    timeInfo.textContent="";
    
    
    // 극장 리스트 업데이트
    theaterList.innerHTML = "";
    // console.log(region);
    
      regionTheaterData[region].forEach(theater => {
        const li = document.createElement("li");
        li.className = styles.list_group_item;
        li.textContent = theater;
        li.setAttribute("data-theater", theater);
        theaterList.appendChild(li);
      });

    // 초기화
    dateList.innerHTML = "";
    timeContainer.innerHTML = "";
  };  

  // 극장 클릭 이벤트
  const theaterClick = (e, dateInfo, timeInfo, theaterInfo, dateList, timeContainer) =>{
    const theater = e.target.getAttribute("data-theater");
    if (!theater) return;
    
    // 스크롤바에서 선택한 부분 active 클래스 추가해서 활성화
    const activeItem = document.querySelector("#theater-list .list-group-item.active");
    if (activeItem) {
      // active 모두 지우기
      activeItem.classList.remove("active");
    }
    // 클릭된 항목에 'active' 클래스 추가
    e.target.classList.add("active");
    
    // 하단의 정보창 비우기
    dateInfo.textContent="";
    timeInfo.textContent="";
    // 하단의 극장 정보에 선택한 극장 정보 입력
    theaterInfo.textContent = theater+' VORA';
    
    // 날짜 리스트 업데이트
    dateList.innerHTML = "";
    theaterDateData[theater].forEach(date => {
      const li = document.createElement("li");
      li.className = styles.list_group_item;
      const { formattedDate, color } = formatDate(date); // 날짜 포맷과 색상 정보 받기
      li.textContent = formattedDate; // 날짜 텍스트만 추가
      li.setAttribute("data-date", date);
      li.setAttribute("cinema", theater)
      li.style.color = color; // 색상 적용
      li.style.textAlign = "center"; // 가운데 정렬
      dateList.appendChild(li);

      // 클릭 이벤트 리스너 추가
      li.addEventListener("click", function (e) {
        const selectedDate = e.target.getAttribute("data-date");
        const selectedCinema = e.target.getAttribute("cinema");

        // console.log("클릭된 날짜:", selectedDate);
        // console.log("클릭된 영화관:", selectedCinema);

        // 선택 후 원하는 작업 수행
        handleDateClick(selectedCinema, selectedDate, timeInfo, dateInfo);
      });

    });

    // 초기화
    timeContainer.innerHTML = "";
  };

  const handleDateClick = (cinema,date, timeInfo, dateInfo) => {
    const activeItem = document.querySelector("#date-list .list-group-item.active");
      if (activeItem) {
        activeItem.classList.remove("active");
      }
      const clickedItem = document.querySelector(`[data-date="${date}"][cinema="${cinema}"]`);
      if (clickedItem) {
        clickedItem.classList.add("active");
      }

      // 시간 정보 초기화 및 업데이트
      timeInfo.textContent = "";
      dateInfo.textContent = formatDate2(date);

      // 하단 데이터 초기화 및 새 시간 리스트 업데이트 (있다면)
      const timeContainer = document.querySelector("#time-container");
      timeContainer.innerHTML = "";
      
      const selectedData = dateTimeData[cinema].find(d => d.date === date);

      if (selectedData && selectedData.theaters) {
        selectedData.theaters.forEach(({ theater, times }) => {
          const theaterHeader = document.createElement("h5");
          theaterHeader.className = "theater-header";
          theaterHeader.textContent = `${theater} 상영실`;
          timeContainer.appendChild(theaterHeader);

          const flexContainer = document.createElement("div");
          flexContainer.className = "d-flex flex-wrap";

          times.forEach(({ time, seats , movieId }) => {
            const timeBox = document.createElement("div");
            timeBox.className = "d-flex align-items-center me-3 mb-3 "+ styles.time_box;
            timeBox.innerHTML = `
              <button class="${seats !== 0 ? "btn-time" : "btn-mazin"}" seat="${seats}" data-MovieId="${movieId}" data-theater="${theater}" ${seats === 0 ? "disabled" : ""}>
                ${time}
              </button>
              <p class="m-0">${seats === 0 ? "매진" : `${seats}석`}</p>
            `;
            flexContainer.appendChild(timeBox);
          });

          timeContainer.appendChild(flexContainer);
          const theaterHr = document.createElement("hr");
          timeContainer.appendChild(theaterHr);
        });
      } else {
        console.error("해당 선택한 날짜 및 영화관 데이터가 존재하지 않습니다.");
      }
  }

  const timeContainerClick = (e, timeInfo) =>{
    
    console.log(e.target.getAttribute("data-movieId"));
    if (e.target && e.target.classList.contains("btn-time")) {
      const button = e.target;
      const time = button.textContent;
      const theater = button.getAttribute("data-theater"); // 상영관 정보 가져오기
      var movieId = e.target.getAttribute("data-movieId"); // 상영시간 무비ID 가져오기
      
      // 임시 번호
      // var movieId = 12341234;
      var seatInfo = document.querySelector("#seat-info"); // 시트 정보
      // console.log("아이디 : ",movieId)
      timeInfo.textContent = theater+' 상영실, '+time
      seatInfo.textContent = e.target.getAttribute("seat")
      // console.log(seatInfo.textContent)

      // **활성화된 항목 관리**: 기존 활성화된 항목 제거
      // 모든 .btn-time 버튼들을 선택
      const timeButtons = document.querySelectorAll('.btn-time');
      // 각 버튼에 대해 배경색을 하얀색으로 설정
      timeButtons.forEach(button => {
        button.classList.remove("active");
      });
      // 클릭된 항목에 'active' 클래스 추가
      e.target.classList.add("active");
      
      // 좌석선택 버튼 클릭 이벤트 초기화 및 재등록
      const ticketSeatButton = document.getElementById("ticketSeat");

      // 기존 이벤트 리스너 제거
      ticketSeatButton.replaceWith(ticketSeatButton.cloneNode(true));
      
      document.getElementById("ticketSeat").addEventListener("click", function() {
        ticketSeat(movieId, seatInfo)
      });
    }
  } 

  const ticketSeat = (movieId, seatInfo) => {
    console.log(movieId);
    
    
    let theaterListId = movieId; //햇갈릴까봐 변경 상영시간기준 영화ID
    var adult = document.getElementById("adult")
    var student = document.getElementById("student")
    var person1 = parseInt(adult.getAttribute("person"))
    var person2 = parseInt(student.getAttribute("person"))
    
    var person = person1 + person2;
    
    if(parseInt(seatInfo.textContent) < person){
      alert("남은 좌석수가 부족합니다.")
      return
    }
    
    var money = (person1 * 10000) + (person2 * 5000);
    
    console.log(theaterListId);
    console.log(person);
    console.log(money);
    
    location.href = "/Ticket/SeatSelection?theaterListId="+theaterListId+"&person=" + person +"_"+money;
  }

  const aup = () =>{
    var adult = document.getElementById("adult")
    var person = parseInt(adult.getAttribute("person"))
    person = person + 1;
    adult.setAttribute("person", person);
    adult.textContent = person;
    // console.log(person);
  }
  const adown = () =>{
    var adult = document.getElementById("adult")
    var person = parseInt(adult.getAttribute("person"))
    if(person > 0){
      person = person - 1;
    }
    adult.setAttribute("person", person);
    adult.textContent = person;
    
  }
  const sup = () =>{
    var student = document.getElementById("student")
    var person = parseInt(student.getAttribute("person"))
    person = person + 1;
    student.setAttribute("person", person);
    student.textContent = person;
    
  }
  const sdown = () =>{
    var student = document.getElementById("student")
    var person = parseInt(student.getAttribute("person"))
    if(person > 0){
      person = person - 1;
    }
    student.setAttribute("person", person);
    student.textContent = person;

  }
  useEffect( () => {
    if(ticketList1 && ticketList1.length > 0){
      setTicketList(ticketList1);
      console.log("티켓리스트 : ",ticketList1);
      endExport(ticketList1);
      area(); // area 함수 호출
    }
  }, [ticketList1]);


  
  
  useEffect( () => {
        const regionList = document.getElementById("region-list");
        const theaterList = document.getElementById("theater-list");
        const dateList = document.getElementById("date-list");
        const timeContainer = document.getElementById("time-container");

        // 추가부분
        // 하단의 예매 정보 띄우는 부분
        const theaterInfo = document.querySelector("#theater-info");
        const dateInfo = document.querySelector("#date-info");
        const timeInfo = document.querySelector("#time-info");

        // 지역 클릭 이벤트
        regionList.addEventListener('click', function(e){
          regionClick(e,theaterInfo, dateInfo, timeInfo, theaterList, dateList, timeContainer);
        })

        // 극장 클릭 이벤트
        theaterList.addEventListener('click', function(e){
          theaterClick(e, dateInfo, timeInfo, theaterInfo, dateList, timeContainer)
        });

        // 시간 클릭 이벤트
        timeContainer.addEventListener('click', function(e){
          timeContainerClick(e, timeInfo);
        });
        
      }, [ticketList]);
      
  return (
    <div>
      <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" rel="stylesheet"></link>
      <div className="container-fluid p-0 d-flex">
        <div className={styles.header+" flex-fill"}></div>
        <div className="container p-0">
          <div className="row m-0 p-0 w-100 col-3 text-center">

            {/* 지역 */}
            <div className={"col-2 p-0 "+styles.b_right}>
              <div className={styles.header}><h5>지역</h5></div>
              {/* 지역 스크롤 바 */}
              <div className={styles.content+" p-0"}>
                <div className={styles.scroll+" h-100 w-100 mt-3 mb-3"}>
                  <ul className={styles.list_group} id='region-list'>
                    {/* 비동기 생성 */}
                  </ul>
                </div>
              </div>
            </div>
            {/* 극장 */}
            <div className={"col-2 p-0 "+styles.b_right}>
              <div className={styles.header}><h5>극장</h5></div>
              {/* 극장 스크롤바 */}
              <div className={styles.content}>
                <div className={styles.scroll+" mt-3 mb-3"}>
                  <ul className={styles.list_group} id="theater-list">
                    {/* 비동기 생성 */}
                  </ul>
                </div>
              </div>
            </div>
            {/* 날짜 */}
            <div className={"col-2 p-0 "+styles.b_right}>
                <div className={styles.header}><h5>날짜</h5></div>
                {/* 날짜 스크롤바 */}
                <div className={styles.content}>
                  <div className={styles.scroll+" mt-3 mb-3"}>
                    <ul className={styles.list_group} id="date-list">
                      {/* 비동기 생성 */}
                    </ul>
                  </div>
                </div>
            </div>
            {/* 시간 */}
            <div className="col-6 p-0">
                <div className={styles.header}><h5>시간</h5></div>
                {/* 시간 스크롤바 */}
                <div className={styles.content}>
                  <div id="time-container" className={styles.scroll+" mt-3 mb-3"}>
                    {/* 비동기 생성 */}
                  </div>
                </div>
            </div>

          </div>
        </div>
        <div className={styles.header+" flex-fill"}></div>
      </div>

      {/** 하단 바  **/}
      <div className={'container-fluid '+ styles.b_top}>
        <div className="container d-flex justify-content-between p-0" style={{height:"200px"}}>
          <div className="align-content-center">
            <div className={"d-flex "+styles.reserve_img}>
              <img src={`/api/files/img?id=${movie}`} alt="" />
              <div className="align-content-center ms-5">
                <h3>{movieTitle}</h3>
              </div>
              <div className='align-content-center ms-5'>
              <p className="m-1">극장 &nbsp; &nbsp; &nbsp; <span id="theater-info"></span></p>
                    <p className="m-1">날짜 &nbsp; &nbsp; &nbsp; <span id="date-info"></span></p>
                    <p className="m-1">시간 &nbsp; &nbsp; &nbsp; <span id="time-info"></span></p>
                    <input type="hidden" id="seat-info" value=""/>
              </div>
            </div>
          </div>
          <div className="align-content-center d-flex align-items-center">
          <div className="me-5">
            <div className="d-flex mb-2 align-items-center align-content-center">
              <p className="p-0 m-0">어른</p>
              <span className={styles.span1} id="adult" person="1">1</span>
              <button className={"btn btn-secondary "+styles.btnUp} onClick={aup}><i className="fa-solid fa-arrow-up"></i></button>
              <button className={"btn btn-secondary "+styles.btnDown} onClick={adown}><i className="fa-solid fa-arrow-down"></i></button>
            </div>
            <div className="d-flex align-items-center align-content-center">
              <p className="p-0 m-0">학생</p>
              <span className={styles.span1} id="student" person="0">0</span>
              <button className={"btn btn-secondary "+styles.btnUp} onClick={sup}><i className="fa-solid fa-arrow-up"></i></button>
              <button className={"btn btn-secondary "+styles.btnDown} onClick={sdown}><i className="fa-solid fa-arrow-down"></i></button>
            </div>
          </div>
            <button className={"btn "+styles.reserve_btn} id="ticketSeat"><i className="fa-solid fa-angle-right fa-3x"></i><p>좌석선택</p></button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TicketFrom