import React, { useEffect } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'

const MovieInsert = () => {

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
          .subLi {
            display: none;
          }
        `}
      </style>
      <br />
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
          <Link style={{ marginRight: '30px' }} to={"/"}>
            <img
              src="/image(id='C:/upload/vora_purple_black.png')"  // 리액트에서 th:src는 사용 불가. 경로를 직접 설정.
              alt="Logo"
              style={{ width: '105px', height: '40px' }}
            />
          </Link>
          <h1>
            <Link to={"/admin"}>
              ADMINISTRATOR : <span className="adminTitle" sec:authentication="principal.user.name"></span>
            </Link>
          </h1>
        </div>
        <div>
          <hr className="ms-0" style={{ width: '700px' }} />
        </div>
      </div>
      <div className="row" style={{ height: '90%' }}>
        <LeftSideBar1/>
        <div className="col-md-8">
          <form action="/admin/movie/insert" method="post" encType="multipart/form-data">
            <br />
            <h1>영화 생성</h1>
            <br />
            <div style={{ display: 'flex' }}>
              <table style={{ width: '100%' }}>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>
                    제목
                  </th>
                  <td>
                    <li><input style={{ width: '90%' }} type="text" name="title" id="" required /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>내용</th>
                  <td>
                    <li><textarea style={{ width: '90%' }} name="content" id=""></textarea></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>장르</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="text" name="type" id="" /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>개봉일</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="date" name="releaseDate" id="releaseDate" required /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>타이틀 파일</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="file" name="mainFiles" id="mainFiles" required /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>스틸 컷 파일</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="file" name="stilcuts" id="stilcuts" multiple /></li>
                  </td>
                </tr>
              </table>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to={"/admin/movie/list"} className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>취소</Link>
              <input type="submit" className={ResetCs.butten} value="생성" />
            </div>
          </form>
        </div>
        <div className="col-md-2">
          {/* 여기에 필요한 내용 추가 */}
        </div>
      </div>
      <br /><br /><br /><br /><br /><br />
      <br /><br /><br />
    </div>
  )
}

export default MovieInsert