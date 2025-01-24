import React, { useEffect, useState } from 'react'
import '../Payment/PaymentFrom.css'
import * as ticket from '../../../apis/ticket';

const PaymentFrom = () => {

    const [reserve,setReserve] = useState([])
    const [movie,setMovie] = useState([])
    const [movieImgId,setMovieImgId] = useState("")

    const [regDate,setRegDate] = useState()
    const [times,setTimes] = useState()

    useEffect( () => {
        if(reserve.id){
            console.log("예약목록",reserve);
        }
        // console.log("영화정보",movie);
        if(movie.no >= 0){
            // console.log("영화정보 들어옴");
            setMovieImgId(movie.files.id) 
            setRegDate(reserve.regDate)
        }
        
        
    }, [reserve,movie])
    useEffect( () => {
        if(movieImgId){
            console.log("영화포스터 : " , movieImgId);
        }
        
    },[movieImgId])

    useEffect( () => {
        if(regDate){
            console.log("시간 : ",regDate);
            const dateObj = new Date(regDate);
            // 날짜 포맷팅
            const options = {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                weekday: 'short', // 월요일, 화요일 등
                hour: '2-digit',
                minute: '2-digit'
            };
    
            const formattedDate = dateObj.toLocaleDateString('ko-KR', options)
                .replace(/ /g, ''); // 필요하면 공백 제거
    
            // 포맷된 날짜를 HTML에 추가
            setTimes(formattedDate);
        }

    },[regDate])

    useEffect( () => {
        if(times){
            console.log("시간", times);
            
        }
    })

    const getDate = async () => {
        const searchParams = new URLSearchParams(location.search);
        const reserveId = searchParams.get("id");
        // const reserveId = "af074bdf-4ad4-4482-a0ca-c12c9352cb87"

        const headers = {
            'Content-Type' : 'multupart/form-data'
        }

        const response = await ticket.GETPayment2(reserveId,headers)
        const data = response.data;
        console.log(response.status);
        
        setReserve(data.reserve);
        setMovie(data.movie);
    }

    useEffect ( () => {
        getDate()
    }, [])


    const remove = async() =>{
        console.log("삭제시도",reserve.id);
        const reserveId = reserve.id
        const headers = {
            'Content-Type' : 'application/json'
        }
        const response = await ticket.remove(reserveId,headers)
        console.log(response.status);
        if(response.status == 200){
            alert('예매 취소 완료')
            var mId = reserveId
            const response2 = await ticket.hanbul(mId)
            if(response2.status == 200){
                console.log("환불완료");
                location.href = '/Ticket/ReserveList'
            }
        }
        
    }

    const rsList = () => {
        location.href = '/mypagereservationlist'
    }








  return (
    <div>
    {/* 상단 헤더 */}
    <div className="container-fluid p-0">
        <div className="header text-center py-3 text-white">
            <h4>예매 완료</h4>
        </div>
    </div>

    {/* 본문 */}
    <div className="container mt-4">
        <div className="text-center mb-4">
            <h2>결제가 완료되었습니다.</h2>
        </div>

        <div className="row">
            {/* 영화 포스터 */}
            <div className="col-md-4 text-center">
                <img
                    src={`/api/files/img?id=${movieImgId}`}
                    width="200"
                    height="300"
                    alt="영화 포스터"
                    className="img-fluid rounded"
                />
            </div>

            {/* 결제 정보 */}
            <div className="col-md-8">
                <table className="table table-bordered">
                    <tbody>
                        <tr>
                            <th>영화명</th>
                            <td>{reserve.title}</td>
                            <th>일시</th>
                            <td>{reserve.date}</td>
                        </tr>
                        <tr>
                            <th>극장</th>
                            <td>{reserve.areaSub} VORA</td>
                            <th>거래일시</th>
                            <td>{times}</td>
                        </tr>
                        <tr>
                            <th>상영관</th>
                            <td>{reserve.theater} 상영관, {reserve.time}</td>
                            <th>거래상태</th>
                            <td>승인</td>
                        </tr>
                        <tr>
                            <th>좌석</th>
                            <td colSpan="3">{reserve.seat}</td>
                        </tr>
                        <tr>
                            <th>인원</th>
                            <td colSpan="3">총 {reserve.person}명</td>
                        </tr>
                        <tr>
                            <th>승인번호</th>
                            <td colSpan="3">{reserve.id}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    {/* 하단 버튼 */}
    <div className="container mt-4">
        <div className="d-flex justify-content-center">
            <button className="btn btn-secondary mx-2" onClick={remove}>예매취소</button>
            <button className="btn btn-primary mx-2" onClick={rsList}>예매 내역</button>
            <button className="btn btn-primary mx-2">메인으로</button>
        </div>
    </div>
</div>
  )
}

export default PaymentFrom