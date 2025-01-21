import React, { useState, useEffect } from 'react';
import './MyPageReservationListForm.css';
import { getMyPage } from '../../apis/my';
import ticket from '../../apis/ticket';

function MyPageReservationListForm() {
  const [reservationList, setReservationList] = useState([]);
  const [userData, setUserData] = useState(null); // 사용자 데이터 상태

  useEffect( () => {
    if(userData){
      console.log("유저이름",userData.username);
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
    console.log("여기까진 옴");
    
    // const response = await ticket.rsList(data,headers)
  }

  const handleDetail = (id) => {
    window.location.href = `/m/payment?id=${id}`;
  };

  const handleRemove = (id) => {
    if (window.confirm('삭제하시겠습니까?')) {
      const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
      fetch('/m/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': csrfToken,
        },
        body: JSON.stringify({ id }),
      })
        .then((response) => response.text())
        .then((data) => {
          if (data === 'SUCCESS') {
            alert('예매 취소 성공');
            window.location.href = '/mypagereservationlist';
          } else {
            alert('예매 취소 실패');
          }
        });
    }
  };

  return (
    <div className="container" style={{ minHeight: '800px', marginTop: '180px' }}>
      <h1 className="mb-4">예매 목록</h1>
      {reservationList.map((reservation) => (
        <div key={reservation.id} className="movie-card row align-items-center">
          <div className="col-md-2 text-center">
            <img
              src={`/api/img?id=${reservation.file}`}
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
      <div className="mypagereservationlist-pagination flex justify-content-center" style={{ margin: '30px 0' }}>
        <ul style={{ display: 'flex', listStyleType: 'none', gap: '10px' }}>
          {/* 페이지 번호들 */}
          <li>
            <a href="/mypagereservationlist?page=1">1</a>
          </li>
          <li>
            <a href="/mypagereservationlist?page=2">2</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default MyPageReservationListForm;
