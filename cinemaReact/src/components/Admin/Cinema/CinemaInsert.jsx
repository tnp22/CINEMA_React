import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useNavigate } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import * as Swal from '../../../apis/alert'

const CinemaInsert = () => {
  
  const [authList, setAuthList] = useState([])

  const [selectedAuth, setSelectedAuth] = useState(''); // 기본값은 빈 문자열
  
  // select의 변경 처리 함수
  const handleAuthChange = (event) => {
    setSelectedAuth(event.target.value); // 선택된 값으로 상태 업데이트
  };
  

    // 🧊 state 선언
  const [area, setArea] = useState('')
  const [areaSub, setAreaSub] = useState('')
  const [mainFiles, setMainFiles] = useState(null)


  const changeArea = (e) => { setArea( e.target.value ) }
  const changeAreaSub = (e) => { setAreaSub( e.target.value ) }

  const changeMainFiles = (e) => {
    setMainFiles(e.target.files[0])
  }

  const navigate = useNavigate()

  // 게시글 수정 요청 이벤트 핸들러
  const onInsert = async (formData, headers) => {
    try {
      // const response = await boards.update(id, title, writer, content)
      const response = await admins.cinemaInsert(formData, headers)
      const data = await response.data
      const status = response.status
      console.log(data);
      if(status == 200){
        console.log('성공!');
        Swal.alert('SUCCESS', '이동합니다', 'success',
                    () => {navigate(`/admin/cinema/updateList`)}
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

    if(!mainFiles){
      alert('파일을 지정하세요')
      return
    }
    // 파일 업로드
    // application/json ➡ multipart/form-data
    const formData = new FormData()
    // 게시글 정보 세팅
    formData.append('area', area)
    formData.append('areaSub', areaSub)
    if( mainFiles ) {
      formData.append('mainFiles', mainFiles)
    }
    formData.append('auth',selectedAuth)
    // 🎫 헤더
    const headers = {
      'Content-Type' : 'multipart/form-data'
    }
    // onUpdate(title, writer, content)   // application/json 
    onInsert(formData, headers)           // multipart/form-data

  }

  // 🎁 게시글 목록 데이터
  const getList = async () => {
    const response = await admins.cinemaInsertGet()
    const data = await response.data
    const nauthList = data.authList
    console.dir(data)

    setAuthList(nauthList)
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
          <h1>영화관 생성</h1>
          <br />
          <div>
            {/* <form action="/admin/cinema/insert" method="post" encType="multipart/form-data"> */}

              <table style={{ width: '100%' }}>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>지역</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="text" onChange={changeArea} /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>상세지역</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="text" onChange={changeAreaSub} /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>권한</th>
                  <td>
                    <li>
                    <select
                        value={selectedAuth} // 선택된 값을 상태로 설정
                        onChange={handleAuthChange} // 상태 업데이트
                      >
                      {authList?.map(authL => (
                        <option key={authL.typeName} value={authL.typeName}>
                          {authL.typeName}
                        </option>
                      ))}
                        </select>
                    </li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>이미지</th>
                  <td><input type="file" onChange={changeMainFiles} required /></td>
                </tr>
              </table>
              <br />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/admin/cinema/updateList" className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>취소</Link>
                <button type="submit" onClick={onSubmit} className={ResetCs.butten}>생성</button>
              </div>
          </div>
        </div>
        <div className="col-md-2">
        </div>
      </div>
    </div>
  );
}

export default CinemaInsert;
