import React, { useEffect } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'

const BannerSelect = ({banner}) => {

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
    <div className="container-fluid" style={{ height: '720px' }}>
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
          <br />
          <h1>배너 조회</h1>
          <br />
          <table style={{ width: '100%' }}>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>영화</th>
              <td>{banner?.movie?.title}</td>
            </tr>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>이름</th>
              <td>{banner.name}</td>
            </tr>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>배너종류</th>
              <td>{banner.bannerDivi}</td>
            </tr>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>타이틀 파일</th>
              <td>
                <a href={`/img?id=${banner.files.id}`}>
                  <img className="w-50 mx-auto" style={{ overflow: 'hidden' }} src={`/img?id=${banner.files.id}`} alt={banner.files} />
                </a>
              </td>
            </tr>
          </table>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/admin/banner/list" className="sub_butten" style={{ marginRight: '20px' }}>취소</Link>
            <Link to={`/admin/banner/update?id=${banner.id}`} className="a_butten">수정</Link>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
      <br /><br /><br /><br /><br /><br />
      <br /><br /><br />
    </div>

  )
}

export default BannerSelect