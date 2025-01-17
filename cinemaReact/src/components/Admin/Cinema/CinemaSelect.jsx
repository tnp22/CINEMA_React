import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useNavigate, useParams } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import * as Swal from '../../../apis/alert'

const CinemaSelect = () => {


  const { id } = useParams() // URL에서 id 파라미터 추출
  const [cinema, setCinema] = useState()

  // 🎁 게시글 목록 데이터
  const getList = async () => {
    const response = await admins.cinemaSelect(id)
    const data = await response.data
    const ncinema = data.cinema
    //const nauthList = data.authList
    console.dir(data)

    setCinema(ncinema)
    //setAuthList(nauthList)
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
          <h1>영화관 조회</h1>
          <br />
          <div style={{ display: 'flex' }}>
            {/* 이미지 처리 부분 */}
            {cinema?.filesList?.map(files =>
              files.division === 'main' ? (
                <img key={files.id} className="w-25 mx-auto" style={{ overflow: 'hidden' }} src={`/api/files/img?id=${files.id}`} alt={files.id} />
              ) : null
            )}
            <table style={{ width: '100%' }}>
              <tbody>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>지역</th>
                <td>
                  <li>{cinema?.area}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>내용</th>
                <td>
                  <li>{cinema?.areaSub}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>권한</th>
                <td>
                  <li>{cinema?.auth}</li>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <br /><br /><br />
          <br /><br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/admin/cinema/updateList" className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>취소</Link>
            <Link to={`/admin/cinema/update/${id}`} className={ResetCs.a_butten}>수정</Link>
          </div>
        </div>

        <div className="col-md-2"></div>
      </div>

      <div style={{ height: '200px' }}></div>
    </div>
  )
}

export default CinemaSelect