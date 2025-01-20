import React, { useEffect, useState } from 'react';
import $, { Callbacks } from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import * as Swal from '../../../apis/alert'

const CastSelect = () => {


  const { id } = useParams() // URL에서 id 파라미터 추출

  const [cast, setCast] = useState()

  // 🎁 게시글 목록 데이터
  const getList = async () => {
    let response = null
    response = await admins.castSelect(id)
    const data = await response.data
    const list = data.cast
    console.dir(data)

    setCast( list )
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

  // ❓ 
  useEffect( () => {
    getList()
  }, [])

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
      <AdminHeader/>
      <div className="row" style={{ height: '90%' }}>
        <LeftSideBar1/>
        <div className="col-md-8">
          <br />
          <h1>출연진 조회</h1>
          <br />
          <table style={{ width: '100%' }}>
            <tbody>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>영화</th>
              <td>
                <li>{cast?.movie.title}</li>
              </td>
            </tr>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>이름</th>
              <td>
                <li>{cast?.name}</li>
              </td>
            </tr>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>역할</th>
              <td>
                <li>{cast?.rule}</li>
              </td>
            </tr>
            <tr>
              <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>사진</th>
              <td>
                <li>
                    {
                      cast ?
                      <img className="w-50 mx-auto" 
                      style={{ overflow: 'hidden' }} 
                      src={`/api/files/img?id=${cast?.files.id}`} 
                      alt={cast?.files} />
                      :
                      null
                    }
                </li>
              </td>
            </tr>
            </tbody>
          </table>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/admin/cast/list" className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>
              취소
            </Link>
            <Link to={`/admin/cast/update/${id}`} className={ResetCs.a_butten}>
              수정
            </Link>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
      <div style={{ height: '200px' }}></div>
    </div>
  );
};

export default CastSelect;
