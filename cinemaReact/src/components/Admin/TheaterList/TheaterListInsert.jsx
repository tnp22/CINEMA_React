import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import * as Swal from '../../../apis/alert'

const TheaterListInsert = () => {

  const { id } = useParams() // URL에서 id 파라미터 추출

  const location = useLocation()
  const navigate = useNavigate();
  const [searchText, setSearchText] = useState('');

  const [search, setSearch] = useState();
  const [movieList, setMovieList] = useState([]);
  const [theaterLists, setTheaterLists] = useState([]);
  
  const handleSearch = (e) => {
    e.preventDefault();
    // 검색 처리를 하고 새로운 URL로 이동
    navigate(`/admin/theaterList/insert/${id}?search=${searchText}`);
  }

    // 🧊 state 선언
    const [movieId, setMovieId] = useState()
    const [theaterId, setTheaterId] = useState()
    const [time, setTime] = useState(null) 

  const updateSelectedValue = (setmovieTitle) => {
    const selectedItem = document.getElementById("selectedValue");
    selectedItem.innerText = setmovieTitle || "없음";
  }

  const changeMovieId = (e) => { setMovieId( e.target.value ) }
  const changeTheaterId = (e) => { setTheaterId( e.target.value )}

  const changeTime = (e) => {
    const selectedDate = new Date(e.target.value);
    setTime(selectedDate); // 문자열을 Date 객체로 변환하여 상태 업데이트
  };
  
    // 게시글 등록 요청 이벤트 핸들러
    // const onInsert = async (title, writer, content) => {
    const onInsert = async (formData, headers) => {
      try {
        // const response = await boards.insert(title, writer, content)
        const response = await admins.theaterListInsert(id,formData, headers)
        const data = await response.data
        const status = response.status
        console.log(data);
        if(status == 200){
          console.log('성공!');
          Swal.alert('SUCCESS', '이동합니다', 'success',
                      () => {navigate(`/admin/theaterList/list/${id}`)}
          )
        }else{
          console.log('실패!');
          //alert('회원가입 실패!')
          Swal.alert('FAIL', '실패했습니다.', 'error')
        }
      
      } catch (error) {
        console.log(error);
        
      }
    }
  
  
    const onSubmit = () => {
      if(movieId == null || theaterId == null || theaterId === '' || time ==null ){
        alert('선택이 제대로 되지 않았습니다. 확인해주세요.')
        return
      }
      // 파일 업로드
      // application/json ➡ multipart/form-data
      const formData = new FormData()
      // 게시글 정보 세팅
      formData.append('movieId', movieId)
      formData.append('cinemaId',id)
      formData.append('theaterId', theaterId)
      
      const formattedReleaseDate = new Date(time);

      // 한국 시간(KST, UTC+9)으로 변환
      const localTime = new Date(formattedReleaseDate.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }));
      
      // 한국 시간(KST)으로 변환된 시간 값을 "yyyy-MM-ddThh:mm" 형식으로 포맷팅
      const formattedTime = localTime.getFullYear() + '-' + 
                            String(localTime.getMonth() + 1).padStart(2, '0') + '-' + 
                            String(localTime.getDate()).padStart(2, '0') + 'T' + 
                            String(localTime.getHours()).padStart(2, '0') + ':' + 
                            String(localTime.getMinutes()).padStart(2, '0');
      
      console.log(formattedTime);  // 예시 출력: "2025-01-20T15:30"
      
      // FormData로 서버에 전송
      formData.append('time', formattedTime);

      // 🎫 헤더
      const headers = {
        'Content-Type' : 'multipart/form-data'
      }

      onInsert(formData, headers)           // multipart/form-data
  
    }

    // 🎁 게시글 목록 데이터
    const getList = async () => {
      let response = null
      if(search != null){
        response = await admins.theaterListInsertGetSearch(id,search)
      }
      else{
        response = await admins.theaterListInsertGet(id)
      }
      const data = await response.data
      const movieList = data.pageInfo
      const theaterLists = data.theaterLists
      console.dir(data)

      setMovieList( movieList )
      setTheaterLists(theaterLists)
    }

    const updatePage = () => {
      const query = new URLSearchParams(location.search)
      const newsearch = query.get("search")
      console.log(`newsearch : ${newsearch}`);
      setSearch(newsearch)
    }

    useEffect( () => {
      updatePage()
    }, [location.search])
  
    useEffect( () => {
      getList()
      .then(() => {
      
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        navigate('/admin/error'); // 예외가 발생하면 에러 페이지로 리디렉션
      });
    }, [search])

  return (
    <div className={`container-fluid ${ResetCs.adminLEE}`} style={{ height: '98vh' }}>
      <style>
      {`
            .table-container {
          max-height: 200px; /* 원하는 높이를 설정 */
          overflow-y: auto; /* 세로 스크롤 적용 */
      }

      table {
          width: 100%; /* 테이블 폭을 100%로 설정 */
          table-layout: fixed; /* 열 너비 고정 */
      }
          /* 스크롤 박스 스타일 */
      .scroll {
      max-height: 200px; /* 스크롤 가능한 높이 */
      overflow-y: auto; /* 수직 스크롤 활성화 */
      border: 1px solid #ddd; /* 경계선 */
      border-radius: 5px; /* 둥근 모서리 */
      padding: 10px; /* 내부 여백 */
      }

      /* 스크롤 커스터마이징 */
      .scroll::-webkit-scrollbar {
      width: 5px;
      }

      .scroll::-webkit-scrollbar-track {
      background: #ddd;
      }

      .scroll::-webkit-scrollbar-thumb {
      background: #666;
      
      }
      `}
  </style>
    <br />
    <AdminHeader/>

      <div className="row" style={{ height: '90%' }}>
        <div className="col-md-2">
          <div style={{ marginTop: '100px', fontSize: '26px' }}>
            <ul>
              <li><Link to={`/admin/theater/list/${id}`} >상영관</Link></li>
              <li><Link to={`/admin/theaterList/list/${id}`} style={{ color: '#583BBF' }}>상영리스트</Link></li>
            </ul>
          </div>
        </div>
        <div className="col-md-8">
          <br />
          <h1>상영리스트 생성</h1>
          <br />
          <div>
            {/* <form action="/admin/theaterList/insert" method="post"> */}
              <table style={{ width: '100%' }}>
                <tbody>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>
                    영화
                  </th>
                  <td>
                    <div className="table-container scroll">
                      <table className="table table-striped table-hover">
                        <thead className="table-light">
                          <tr>
                            <th scope="col">선택</th>
                            <th scope="col">영화</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* 영화 리스트를 반복하는 부분은 실제 데이터를 사용하여 동적으로 작성해야 함 */}
                            {movieList?.map(movie => (
                              <tr key={movie.id}>
                                <td><input type="radio" className="movieRadio" name="movie" value={movie.id} onChange={changeMovieId} onClick={() => updateSelectedValue(movie.title,movie.id)} required /></td>
                                <td>{movie.title}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                    <br />
                    <div id="selectedItem" style={{ textAlign: 'center' }}>
                      <p>선택된 항목: <span id="selectedValue">없음</span></p>
                    </div>
                    <div className="container mt-4" style={{ display: 'flex' }}>
                      <input
                        className="form-control me-3"
                        style={{ width: '85%' }}
                        id="search"
                        type="search"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        placeholder="검색어를 입력하세요"
                        aria-label="Search"
                      />
                      <button className="btn btn-outline-success" type="button" onClick={handleSearch}>검색</button>
                    </div>
                    <br />
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>상영관</th>
                  <td>
                    <li>
                      <select value={theaterId} // 선택된 값을 상태로 설정
                              onChange={changeTheaterId}>
                          <option value={''}>
                              선택 안 됨
                          </option>
                        {theaterLists?.map(theater => (
                          <option key={theater.id} value={theater.id}>
                            {theater.name}
                          </option>
                        ))}
                      </select>
                    </li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>시간대</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="datetime-local" onChange={changeTime} required /></li>
                  </td>
                </tr>
                </tbody>
              </table>
              <br />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <button type="button" className={ResetCs.sub_butten} style={{ marginRight: '20px' }} onClick={() => navigate(-1)}>취소</button>
                <button type="submit" onClick={onSubmit} className={ResetCs.butten} >생성</button>
              </div>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
      <br /><br /><br /><br /><br />
    </div>
  );
}

export default TheaterListInsert;
