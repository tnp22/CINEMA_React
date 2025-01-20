import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import * as Swal from '../../../apis/alert'

const CastInsert = () => {

    const location = useLocation()
    const navigate = useNavigate();
    const [search, setSearch] = useState('');
    const [searchText, setSearchText] = useState('');
  
    const [movieList, setMovieList] = useState([]);
  
    // 🧊 state 선언
    const [movieId, setMovieId] = useState()
    const [name, setName] = useState()
    const [rule, setRule] = useState('actor')
    const [mainFiles, setMainFiles] = useState(null)  
  
    
    const changeMovieId = (e) => { setMovieId( e.target.value ) }
    const changeName = (e) => { setName( e.target.value ) }
    const changeRule = (e) => { setRule( e.target.value ) }
    const changeMainFiles = (e) => {
      setMainFiles(e.target.files[0])
    }
  
    const updateSelectedValue = (setmovieTitle) => {
      const selectedItem = document.getElementById("selectedValue");
      selectedItem.innerText = setmovieTitle || "없음";
    }
  
  
    // 게시글 등록 요청 이벤트 핸들러
    // const onInsert = async (title, writer, content) => {
    const onInsert = async (formData, headers) => {
      try {
        // const response = await boards.insert(title, writer, content)
        const response = await admins.castInsert(formData, headers)
        const data = await response.data
        const status = response.status
        console.log(data);
        if(status == 200){
          console.log('성공!');
          Swal.alert('SUCCESS', '이동합니다', 'success',
                      () => {navigate(`/admin/cast/list`)}
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
      console.log(movieId)
      console.log(name)
      console.log(rule)
      console.log(mainFiles)
      if(movieId == null || name == null || rule === '' || rule == null || mainFiles == null ){
        alert('선택이 제대로 되지 않았습니다. 확인해주세요.')
        return
      }
      // 파일 업로드
      // application/json ➡ multipart/form-data
      const formData = new FormData()
      // 게시글 정보 세팅
      formData.append('movieId', movieId)
      formData.append('name',name)
      formData.append('rule',rule)
  
      // 📄 파일 데이터 세팅
      if( mainFiles ) {
        formData.append('mainFiles', mainFiles)
      }
  
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
        response = await admins.bannerInsertGetSearch(search)
      }
      else{
        response = await admins.bannerInsertGet()
      }
      const data = await response.data
      const movieList = data.pageInfo
      console.dir(data)
  
      setMovieList( movieList )
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
    }, [search])
    
    const handleSearch = (e) => {
      e.preventDefault();
      // 검색 처리를 하고 새로운 URL로 이동
      navigate(`/admin/banner/insert?search=${searchText}`);
    }

  useEffect(() => {
    document.title = "ADMINISTRATOR";

    $(".mainLi").on("mouseover",function(){
      $(this).find(".subLi").stop().slideDown();
      //$(this).find(".movieLi").stop().slideDown();
    })
    $(".mainLi").on("mouseout",function(){
        //$(this).find(".movieLi").stop().slideUp();
        $(this).find(".subLi").stop().slideUp();
    })

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 핸들러 제거
      $(".mainLi").off("mouseover mouseout");
    };
  }, []);

  return (
  <div className={`container-fluid ${ResetCs.adminLEE}`} style={{ height: '98vh' }}>
        <style>
          {`
                      /* 테이블을 감싸는 div에 스크롤 적용 */
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
            .subLi {
              display: none;
            }
          `}
        </style>
      <br />
      <AdminHeader/>
      <div className="row" style={{ height: '90%' }}>
        <LeftSideBar1/>
        <div className="col-md-8">
          {/* <form action="/admin/cast/insert" method="post" encType="multipart/form-data"> */}
            <br />
            <h1>출연진 추가</h1>
            <br />
            <table style={{ width: '100%' }}>
              <tbody>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>영화</th>
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
                                <td><input type="radio" className="movieRadio" name="movie" value={movie.id} onChange={changeMovieId} onClick={() => updateSelectedValue(movie.title)} required /></td>
                                <td>{movie.title}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  {/* 선택된 체크박스 표시 */}
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
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>이름</th>
                <td>
                  <li>
                    <input
                      className="form-control me-3"
                      style={{ width: '85%' }}
                      type="text"
                      onChange={changeName}
                    />
                  </li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>역할</th>
                <td>
                  <li>
                    <select onChange={changeRule}>
                      <option value="actor">배우</option>
                      <option value="director">감독</option>
                    </select>
                  </li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>사진</th>
                <td>
                  <li>
                    <input
                      style={{ width: '90%' }}
                      type="file"
                      onChange={changeMainFiles}
                      required
                    />
                  </li>
                </td>
              </tr>
              </tbody>
            </table>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button className={ResetCs.sub_butten} onClick={() => navigate(-1)} style={{ marginRight: '20px' }}>
                취소
              </button>
              <button type="submit" onClick={onSubmit} className={ResetCs.butten} >생성</button>
            </div>
        </div>
        <div className="col-md-2"></div>
      </div>
      <div style={{ height: '200px' }}></div>
    </div>
  );
};

export default CastInsert;
