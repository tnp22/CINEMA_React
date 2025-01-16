import React, { useEffect } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';



const BannerList = () => {
    // select 함수는 아직 구현되지 않았습니다.
    const select = (bannerId) => {
      console.log(`Banner ID selected: ${bannerId}`);
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
      <AdminHeader/>
      <div className="row" style={{ height: '90%' }}>
        <LeftSideBar1/>

        <div className="col-md-8">
          <h1 className="text-center">배너 관리</h1>
          <div className="container mt-5">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">이름</th>
                  <th scope="col">배너종류</th>
                  <th scope="col">영화</th>
                  <th scope="col">비고</th>
                </tr>
              </thead>
              <tbody>
                {/* {bannerList.map((banner) => (
                  <tr style={{ lineHeight: '40px' }} key={banner.id}>
                    <td>{banner.name}</td>
                    <td>{banner.bannerDivi}</td>
                    <td>{banner.movie.title}</td>
                    <td>
                      <button className="btn butten" type="button" onClick={() => select(banner.id)}>
                        조회
                      </button>
                    </td>
                  </tr>
                ))} */}
                {/* 추가 행 삽입 */}
              </tbody>
            </table>
          </div>
        </div>

        <div className="col-md-2">
          <div style={{ marginTop: '100px', fontSize: '26px' }}>
            <ul className="mt-5">
              <li><Link to="/admin/banner/insert">배너 생성</Link></li>
            </ul>
          </div>
        </div>
      </div>
      <br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br />
    </div>

  )
}

export default BannerList