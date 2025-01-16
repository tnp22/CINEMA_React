import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useNavigate } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';

const BannerInsert = ({ pageInfo }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selectedMovie, setSelectedMovie] = useState('');

  // 영화 선택 시 호출되는 함수
  const updateSelectedValue = (movieTitle) => {
    setSelectedMovie(movieTitle);
  };

  // 검색 폼 제출 시 호출되는 함수
  const submitSearchForm = () => {
    if (search && search !== '') {
      navigate(`/admin/banner/insert?search=${search}`);
    } else {
      navigate('/admin/banner/insert');
    }
  };

  const handleBack = () => {
    navigate(-1); // 뒤로 가기
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

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
          .movieLi {
            display: none;
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
          <form action="/admin/banner/insert" method="post" encType="multipart/form-data">
            <br />
            <h1>배너 생성</h1>
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
                          {/* `pageInfo`를 사용하여 영화 목록을 렌더링 */}
                          {/* {pageInfo.map((movie) => (
                            <tr key={movie.id}>
                              <td>
                                <input
                                  type="radio"
                                  className="movieRadio"
                                  name="movieId"
                                  value={movie.id}
                                  onClick={() => updateSelectedValue(movie.title)}
                                  required
                                />
                              </td>
                              <td>{movie.title}</td>
                            </tr>
                          ))} */}
                        </tbody>
                      </table>
                    </div>

                    <br />
                    <div id="selectedItem" style={{ textAlign: 'center' }}>
                      <p>선택된 항목: <span id="selectedValue">{selectedMovie || '없음'}</span></p>
                    </div>

                    <div className="container mt-4" style={{ display: 'flex' }}>
                      <input type="hidden" id="id" name="cinemaId" value="${id}" />
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
                      <button className="btn btn-outline-success" type="button" onClick={submitSearchForm}>
                        검색
                      </button>
                    </div>
                    <br />
                  </td>
                </tr>

                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>이름</th>
                  <td>
                    <input
                      className="form-control me-3"
                      style={{ width: '85%' }}
                      type="text"
                      name="name"
                      id="name"
                    />
                  </td>
                </tr>

                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>배너종류</th>
                  <td>
                    <select name="bannerDivi" id="bannerDivi">
                      <option value="main">main</option>
                      <option value="sub">sub</option>
                    </select>
                  </td>
                </tr>

                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>타이틀 파일</th>
                  <td>
                    <input style={{ width: '90%' }} type="file" name="mainFiles" id="mainFiles" required />
                  </td>
                </tr>
              </tbody>
            </table>

            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <button onClick={handleBack} className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>
                취소
              </button>
              <input type="submit" value="생성" className={ResetCs.butten} />
            </div>
          </form>
        </div>
        <div className="col-md-2"></div>
      </div>
      <br /><br /><br /><br /><br /><br />
      <br /><br /><br />
    </div>
  );
};

export default BannerInsert;
