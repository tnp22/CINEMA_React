import React, { useEffect } from 'react';
import $ from 'jquery';
import ResetCs from './css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import './css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link } from 'react-router-dom';
import LeftSideBar1 from './LeftSideBar1'
import AdminHeader from './AdminHeader'


const AdminMainForm = () => {

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
    <div className={`container-fluid  ${ResetCs.adminLEE}`} style={{ height: '98vh' }}>
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
        <AdminHeader/>

      <div className="row" style={{ height: '90%' }}>
        {/* Left Navigation */}
        <LeftSideBar1/>

        {/* Main Content */}
        <div className="col-md-8" style={{ textAlign: 'center' }}>
          <h1>영화관</h1>
          <br />
          <div className="row">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                columnGap: '20px',
                rowGap: '20px',
              }}
            >
              {/* Example Cinema Card */}
              <div className="card" style={{ border: 'none', fontSize: '20px' }}>
                <Link to={`/admin/cinema/enter?id=1`}>
                  <img
                    className="w-50 mx-auto"
                    style={{ overflow: 'hidden' }}
                    src="/path-to-cinema-image.jpg"
                    alt="Cinema"
                  />
                </Link>
                <Link to={`/admin/cinema/enter?id=1`} href="">
                  <span className="mx-auto">Area Sub 점</span>
                </Link>
              </div>
            </div>

            {/* Search Form */}
            <div className="container mt-4">
              <form action="/admin/cinema/list" className="d-flex" method="get">
                <input
                  className="form-control me-3"
                  style={{ width: '90%' }}
                  name="search"
                  type="search"
                  placeholder="검색어를 입력하세요"
                  aria-label="Search"
                />
                <input className="btn btn-outline-success" type="submit" value="검색" />
              </form>
            </div>
          </div>
        </div>

        {/* Right Navigation */}
        <div className="col-md-2">
          <div style={{ marginTop: '100px', fontSize: '26px' }}>
            <ul className="mt-5">
              <li>
                <Link to={`/admin/cinema/updateList`} >영화관 관리</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMainForm;
