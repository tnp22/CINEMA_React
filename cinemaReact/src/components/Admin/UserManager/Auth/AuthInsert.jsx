import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useNavigate } from 'react-router-dom';
import LeftSideBar1 from '../../LeftSideBar1'
import AdminHeader from '../../AdminHeader';
import * as admins from '../../../../apis/admins'
import formatDate from '../../../Admin/formatDate'
import * as Swal from '../../../../apis/alert'

const AuthInsert = () => {


      // 🧊 state 선언
      const [typeName, setTypeName] = useState('')
      const [description, setDescription] = useState('')       

      const changeTypeName = (e) => { setTypeName( e.target.value ) }
      const changeDescription = (e) => { setDescription( e.target.value ) }
    
      const navigate = useNavigate()
    
      // 게시글 등록 요청 이벤트 핸들러
      // const onInsert = async (title, writer, content) => {
      const onInsert = async (formData, headers) => {
        try {
          // const response = await boards.insert(title, writer, content)
          const response = await admins.authPlus(formData, headers)
          const data = await response.data
          const status = response.status
          console.log(data);
          if(status == 200){
            console.log('성공!');
            Swal.alert('SUCCESS', '이동합니다', 'success',
                        () => {navigate('/admin/auth/list')}
            )
          }else{
            console.log('실패!');
            //alert('회원가입 실패!')
            Swal.alert('FAIL', '실패했습니다.', 'error')
          }
        
        } catch (error) {
          console.log(error);
          
        }
      }
    
    
      const onSubmit = () => {
    
        // 파일 업로드
        // application/json ➡ multipart/form-data
        const formData = new FormData()
        // 게시글 정보 세팅
        formData.append('typeName', typeName)
        formData.append('description', description)
    
        // 🎫 헤더
        const headers = {
          'Content-Type' : 'multipart/form-data'
        }
    
        // onInsert(title, writer, content)   // application/json 
        onInsert(formData, headers)           // multipart/form-data
    
      }


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
          <h1>권한 생성</h1>
          <br />
          <div>
            {/* <form action="/admin/userManager/auth/insert" method="post"> */}
              <table style={{ width: '100%' }}>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>
                    권한 이름
                  </th>
                  <td>
                    <li><input style={{ width: '90%' }} type="text" onChange={changeTypeName} /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>설명</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="text" onChange={changeDescription} /></li>
                  </td>
                </tr>
              </table>
              <br />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/admin/auth/list" className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>
                  취소
                </Link>
                <button type="submit" onClick={onSubmit} className={ResetCs.butten}>생성</button>
              </div>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  )
}

export default AuthInsert;
