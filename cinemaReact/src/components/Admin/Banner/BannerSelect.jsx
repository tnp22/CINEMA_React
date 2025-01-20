import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import * as Swal from '../../../apis/alert'
import formatDate from '../../Admin/formatDate'

const BannerSelect = () => {

  const { id } = useParams() // URL에서 id 파라미터 추출

  const [banner, setBanner] = useState()

  // 🎁 게시글 목록 데이터
  const getList = async () => {
    const response = await admins.bannerSelect(id)
    const data = await response.data
    const list = data.banner
    console.dir(data)

    setBanner( list )
  }
  
  
    useEffect( () => {
      getList()
    }, [])

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
          <br />
          <h1>배너 조회</h1>
          <br />
          <table style={{ width: '100%' }}>
            <tbody>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>영화</th>
              <td>{banner?.movie.title}</td>
            </tr>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>이름</th>
              <td>{banner?.name}</td>
            </tr>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>배너종류</th>
              <td>{banner?.bannerDivi}</td>
            </tr>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>타이틀 파일</th>
              <td>
                {
                  banner ?
                  <img className="w-50 mx-auto" style={{ overflow: 'hidden' }} src={`/api/files/img?id=${banner?.files.id}`} alt={banner?.files} />
                  :
                  null
                }
              </td>
            </tr>
            </tbody>
          </table>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/admin/banner/list" className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>취소</Link>
            <Link to={`/admin/banner/update/${id}`} className={ResetCs.a_butten}>수정</Link>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
      <div style={{ height: '200px' }}></div>
    </div>

  )
}

export default BannerSelect