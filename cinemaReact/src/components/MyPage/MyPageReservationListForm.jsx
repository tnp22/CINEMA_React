import React, { useState, useEffect } from 'react';
import './MyPageReservationListForm.css';

function MyPageReservationListForm() {
  const [reservationList, setReservationList] = useState([]);

  useEffect(() => {
    // 이 부분은 실제 API 호출 로직으로 교체해 주세요.
    // 예시로 임시 데이터를 사용합니다.
    const fetchedReservations = [
      {
        id: 1,
        file: 'poster1.jpg',
        title: '영화 1',
        date: '2025-01-14',
        time: '14:00',
        theater: '상영관 1',
        seat: 'A1',
      },
      {
        id: 2,
        file: 'poster2.jpg',
        title: '영화 2',
        date: '2025-01-15',
        time: '16:00',
        theater: '상영관 2',
        seat: 'B2',
      },
    ];
    setReservationList(fetchedReservations);
  }, []);

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
