import React, { useEffect } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'

const CastInsert = () => {

      const [selectedMovie, setSelectedMovie] = useState("없음");
      const [selectedMovieId, setSelectedMovieId] = useState(null);
      const [name, setName] = useState("");
      const [role, setRole] = useState("actor");
      const [file, setFile] = useState(null);
      const [searchTerm, setSearchTerm] = useState(search);
    
      const handleMovieSelection = (movieId, movieTitle) => {
        setSelectedMovie(movieTitle);
        setSelectedMovieId(movieId);
      };
    
      const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
      };
    
      const handleFileChange = (event) => {
        setFile(event.target.files[0]);
      };
    
      const submitSearchForm = () => {
        console.log("검색어:", searchTerm);
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
              <form action="/admin/cast/insert" method="post" encType="multipart/form-data">
                {/* CSRF TOKEN */}
                <input type="hidden" name="id" value={id} />
                <br />
                <h1>출연진 추가</h1>
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
                                    onClick={() => handleMovieSelection(movie.id, movie.title)}
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
                          type="hidden"
                          id="id"
                          name="cinemaId"
                          value={id}
                        />
                        <input
                          className="form-control me-3"
                          style={{ width: '85%' }}
                          id="search"
                          type="search"
                          value={searchTerm}
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
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                        />
                      </li>
                    </td>
                  </tr>
                  <tr>
                    <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>역할</th>
                    <td>
                      <li>
                        <select
                          name="rule"
                          id="rule"
                          value={role}
                          onChange={(e) => setRole(e.target.value)}
                        >
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
                          name="mainFiles"
                          id="mainFiles"
                          required
                          onChange={handleFileChange}
                        />
                      </li>
                    </td>
                  </tr>
                </table>
                <br />
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <a href="javascript:history.back()" className="sub_butten" style={{ marginRight: '20px' }}>
                    취소
                  </a>
                  <input type="submit" value="생성" className="butten" />
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

export default CastInsert