import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useParams } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'

const NoticeSelect = () => {
  const { id } = useParams() // URL에서 id 파라미터 추출
  const [notice, setNotice] = useState()

  // 🎁 게시글 목록 데이터
  const getSelect = async () => {
    const response = await admins.noticeSelect(id)
    const data = await response.data
    const newNotice = data.notice
    console.dir(data.notice)
    setNotice( newNotice )
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

  useEffect( () => {
    getSelect()
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
        <div className="col-md-8" style={{ textAlign: 'center', padding: '20px' }}>
          <h1>공지 조회</h1>
          <br />
          <table style={{ width: "100%" }}>
            <tbody>
              <tr>
                <th style={{ padding: "12px 0", width: "20%", textAlign: "center" }}>
                  제목
                </th>
                <td>
                  <li>{notice?.title}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: "12px 0", width: "20%", textAlign: "center" }}>
                  내용
                </th>
                <td>
                  <li style={{ whiteSpace: "pre-line" }}>{notice?.content}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: "12px 0", width: "20%", textAlign: "center" }}>
                  생성일자
                </th>
                <td>
                  <li>
                    {new Date(notice?.regDate).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: "12px 0", width: "20%", textAlign: "center" }}>
                  수정일자
                </th>
                <td>
                  <li>
                    {new Date(notice?.updDate).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      weekday: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </li>
                </td>
              </tr>
            </tbody>
          </table>
          <br />
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Link to="/admin/notice/list" className={ResetCs.sub_butten} style={{ marginRight: "20px" }}>
              취소
            </Link>
            <Link to={`/admin/notice/update/${notice?.id}`} className={ResetCs.a_butten}>
              수정
            </Link>
          </div>
        </div>
     </div>
    </div>
  )
}

export default NoticeSelect