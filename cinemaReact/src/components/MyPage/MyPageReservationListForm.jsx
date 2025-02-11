import React, { useState, useEffect } from 'react';
import './MyPageReservationListForm.css';
import { getMyPage } from '../../apis/my';
import { rsList, rsList2 } from '../../apis/ticket';
import Pagination from './Pagination';
import * as ticket from '../../apis/ticket'

function MyPageReservationListForm() {
  const [reservationList, setReservationList] = useState([]);
  const [userData, setUserData] = useState(null); // 사용자 데이터 상태
  const [pageData, setPageData] = useState(null)

  useEffect ( () => {
    if(reservationList){
      console.log("예매 목록",reservationList);
    }
    if(pageData){
      console.log("페이지 정보 : ", pageData);
    }
  }, [reservationList,pageData])

  useEffect( () => {
    if(userData){
      // console.log("유저이름",userData.username);
      getData()
    }
  },[userData])

  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await getMyPage();
        setUserData(response.data);
      } catch (error) {
        console.error("사용자 정보 가져오기 중 오류 발생:", error);
        Swal.alert("오류", "사용자 정보를 가져오는 데 실패했습니다.", "error");
      }
    };

    fetchUserData();
  }, []);

  const getData = async () => {
    const headers = {
      'Content-Type' : 'multupart/form-data'
    }
    const data = {
      'username' : userData.username
    }
    
    const searchParams = new URLSearchParams(location.search);
    const page = searchParams.get("page");
    if(page){
      const response = await rsList2(userData.username,page,headers)
      const d = response.data
      setReservationList(d.reservationList.list)
      setPageData(d.reservationList)
    } else {
      const response = await rsList(userData.username,headers)
      const d = response.data
      setReservationList(d.reservationList.list)
      setPageData(d.reservationList)
    }
    // console.log(d.reservationList);
  }

  const handleDetail = (id) => {
    window.location.href = `/Ticket/Payment?id=${id}`;
  };

  const handleRemove = async (id) => {
    if (window.confirm('예약 취소하시겠습니까?')) {
      const headers = {
        'Content-Type' : 'application/json'
      }
      const reserveId = id
      var mId = reserveId
      const response2 = await ticket.hanbul(mId)
      console.log(response2.status);
      if(response2.status == 200){
        console.log("환불완료");
        const response = await ticket.remove(reserveId,headers)
        if(response.status == 200){
              alert('예매 취소 완료')
              location.replace('/mypagereservationlist');
        }
      }
    }
  };

  return (
    <div className="container" style={{ minHeight: '800px', marginTop: '180px' }}>
      <h1 className="mb-4">예매 목록</h1>
      {reservationList.map((reservation) => (
        <div key={reservation.id} className="movie-card row align-items-center">
          <div className="col-md-2 text-center">
            <img
              src={`/api/files/img?id=${reservation.file}`}
              alt="Movie Poster"
              className="movie-poster"
            />
          </div>
          <div className="col-md-7">
            <h5>{reservation.title}</h5>
            <p>{`${reservation.date} (요일) ${reservation.time}`}</p>
            <p>{`상영관: ${reservation.theater}`}</p>
            <p>{`좌석: ${reservation.seat}`}</p>
          </div>
          <div className="col-md-3 text-end">
            <button
              className="btn btn-custom mb-2 w-100"
              onClick={() => handleDetail(reservation.id)}
            >
              자세히 보기
            </button>
            <button
              className="btn btn-outline-secondary w-100"
              onClick={() => handleRemove(reservation.id)}
            >
              예약 취소
            </button>
          </div>
        </div>
      ))}

      {/* 페이지네이션 (예시로 static 페이지 번호 처리) */}
      {
        pageData && pageData.total > 1 && <Pagination pageData={pageData} />
      }
    </div>


    

    
    
  );
}

export default MyPageReservationListForm;
