import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useParams } from 'react-router-dom';
import formatDate from '../../../Admin/formatDate'
import LeftSideBar1 from '../../LeftSideBar1'
import AdminHeader from '../../AdminHeader';
import * as admins from '../../../../apis/admins'

const UserSelect = () => {


  const { id } = useParams() // URL에서 id 파라미터 추출
  const [user, setUser] = useState()

  // 🎁 게시글 목록 데이터
  const getList = async () => {
    const response = await admins.userSelect(id)
    const data = await response.data
    const list = data.user
    console.dir(data)
    console.dir(data.user)

    setUser( list )
  }

  useEffect( () => {
    getList()
  }, [])

  useEffect(() => {
    document.title = "ADMINISTRATOR";

    $(".mainLi").on("mouseover",function(){
      //$(this).find(".subLi").stop().slideDown();
      $(this).find(".movieLi").stop().slideDown();
    })
    $(".mainLi").on("mouseout",function(){
        $(this).find(".movieLi").stop().slideUp();
        //$(this).find(".subLi").stop().slideUp();
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
            `}
          </style>
      <br />
      <AdminHeader/>
      <div className="row" style={{ height: '90%' }}>
        <LeftSideBar1/>
        <div className="col-md-8">
          <br />
          <h1>유저 조회</h1>
          <br />
          <div>
            <table style={{ width: '100%' }}>
              <tbody>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>
                  아이디
                </th>
                <td>
                  <li>{user?.username}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>이름</th>
                <td>
                  <li>{user?.name}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>이메일</th>
                <td>
                  <li>{user?.email}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>활성화 여부</th>
                <td>
                  <li>{user?.enabled.toString()}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>권한 목록</th>
                <td>
                  <li>
                  {
                      user?.authList?.map(auths => auths.auth).slice(0, -1).join(', ') 
                      + (user?.authList?.length > 0 ? `, ${user?.authList[user?.authList.length - 1]?.auth}` : '')
                  }
                  </li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>가입 일자</th>
                <td>
                  <li>{formatDate(user?.regDate)}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>수정 일자</th>
                <td>
                <li>{formatDate(user?.updDate)}</li>
                </td>
              </tr>
              </tbody>
            </table>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/admin/user/list" className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>
                취소
              </Link>
              <Link to={`/admin/user/update/${user?.username}`} className={ResetCs.a_butten}>
                수정
              </Link>
            </div>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
};

export default UserSelect;
