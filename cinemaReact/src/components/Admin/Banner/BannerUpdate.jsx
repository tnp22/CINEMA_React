import React, { useEffect } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'


const BannerUpdate = ({ banner, pageInfo }) => {
  const [selectedMovie, setSelectedMovie] = useState(banner.movie.title);
  const [search, setSearch] = useState("");

  // 영화 선택 변경 처리
  const handleMovieSelection = (movieTitle) => {
    setSelectedMovie(movieTitle);
  };

  // 검색어 변경 처리
  const handleSearchChange = (event) => {
    setSearch(event.target.value);
  };

  // 검색 처리
  const submitSearchForm = () => {
    // 검색을 위한 로직을 구현해야 합니다. 예: API 호출
    console.log("검색어:", search);
  };

  useEffect(() => {
    document.title = "ADMINISTRATOR";

    $(".mainLi").on("mouseover",function(){
      $(this).find(".subLi").stop().slideDown();
      $(this).find(".movieLi").stop().slideDown();
    })
    $(".mainLi").on("mouseout",function(){
        $(this).find(".movieLi").stop().slideUp();
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
          .movieLi {
            display: none;
          }
          .subLi {
            display: none;
          }
        `}
      </style>
      <br />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
          <a style={{ marginRight: '30px' }} href="/">
            <img src="/image/id='C:/upload/vora_purple_black.png'" style={{ width: '105px', height: '40px' }} alt="Logo" />
          </a>
          <h1>
            <a href="/admin">
              ADMINISTRATOR : <span className="adminTitle">admin</span>
            </a>
          </h1>
        </div>
        <div>
          <hr className="ms-0" style={{ width: '700px' }} />
        </div>
      </div>

      <div className="row" style={{ height: '90%' }}>
        <LeftSideBar1/>

        <div className="col-md-8">
          <form action="/admin/banner/update" method="post" encType="multipart/form-data">
            {/* CSRF TOKEN */}
            <input type="hidden" name="id" value={banner.id} />
            <br />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <h1>배너 수정</h1>
              <button 
                className="delete_butten" 
                type="button" 
                onClick={() => remove(banner.id)}
              >
                삭제
              </button>
            </div>
            <br />
            <table style={{ width: '100%' }}>
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
                        {pageInfo.map((movie) => (
                          <tr key={movie.id}>
                            <td>
                              <input 
                                type="radio" 
                                className="movieRadio" 
                                name="movieId" 
                                value={movie.id} 
                                checked={banner.movie.id === movie.id}
                                onClick={() => handleMovieSelection(movie.title)}
                                required 
                              />
                            </td>
                            <td>{movie.title}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <br />
                  <div id="selectedItem" style={{ textAlign: 'center' }}>
                    <p>선택된 항목: <span id="selectedValue">{selectedMovie}</span></p>
                  </div>
                  <div className="container mt-4" style={{ display: 'flex' }}>
                    <input 
                      className="form-control me-3" 
                      style={{ width: '85%' }} 
                      id="search" 
                      type="search" 
                      value={search} 
                      onChange={handleSearchChange} 
                      placeholder="검색어를 입력하세요" 
                      aria-label="Search" 
                    />
                    <button 
                      className="btn btn-outline-success" 
                      type="button" 
                      onClick={submitSearchForm}
                    >
                      검색
                    </button>
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
                      name="name" 
                      id="name" 
                      value={banner.name} 
                    />
                  </li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>배너종류</th>
                <td>
                  <li>
                    <select name="bannerDivi" id="bannerDivi" defaultValue={banner.bannerDivi}>
                      <option value="main">main</option>
                      <option value="sub">sub</option>
                    </select>
                  </li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>타이틀 파일</th>
                <td>
                  <li><input style={{ width: '90%' }} type="file" name="mainFiles" id="mainFiles" /></li>
                </td>
              </tr>
            </table>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/admin/banner/list" className="sub_butten" style={{ marginRight: '20px' }}>취소</Link>
              <input type="submit" value="수정확인" className="butten" />
            </div>
          </form>
        </div>
        <div className="col-md-2"></div>
      </div>
      <br /><br /><br /><br /><br /><br />
      <br /><br /><br />
    </div>
  )
}

export default BannerUpdate