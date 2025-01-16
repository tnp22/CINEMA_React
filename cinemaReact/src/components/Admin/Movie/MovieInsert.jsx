import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useNavigate } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import * as Swal from '../../../apis/alert'

const MovieInsert = () => {

  // 🧊 state 선언
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [type, setType] = useState('')
  const [releaseDate, setReleaseDate] = useState(null)
  const [mainFiles, setMainFiles] = useState(null)          
  const [stilcuts, setStilcuts] = useState(null)          


  const changeTitle = (e) => { setTitle( e.target.value ) }
  const changeContent = (e) => { setContent( e.target.value ) }
  const changeType = (e) => { setType( e.target.value ) }
  const changeReleaseDate = (e) => {
    const selectedDate = new Date(e.target.value);
    setReleaseDate(selectedDate); // 문자열을 Date 객체로 변환하여 상태 업데이트
  };
  const changeMainFiles = (e) => {
    setMainFiles(e.target.files[0])
  }
  const changeStilcuts = (e) => {
    setStilcuts(e.target.files)
  }

  const navigate = useNavigate()

  // 게시글 등록 요청 이벤트 핸들러
  // const onInsert = async (title, writer, content) => {
  const onInsert = async (formData, headers) => {
    try {
      // const response = await boards.insert(title, writer, content)
      const response = await admins.movieInsert(formData, headers)
      const data = await response.data
      const status = response.status
      console.log(data);
      if(status == 200){
        console.log('성공!');
        Swal.alert('SUCCESS', '이동합니다', 'success',
                    () => {navigate('/admin/movie/list')}
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
    formData.append('title', title)
    formData.append('content', content)
    formData.append('type', type)

    const formattedReleaseDate = new Date(releaseDate).toISOString().split('T')[0];

    formData.append('releaseDate', formattedReleaseDate);

    // 📄 파일 데이터 세팅
    if( mainFiles ) {
      formData.append('mainFiles', mainFiles)
    }
    if( stilcuts ) {
      for (let i = 0; i < stilcuts.length; i++) {
        const file = stilcuts[i];
        formData.append('stilcuts', file)
      }
    }

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
            <h1>영화 생성</h1>
            <br />
            <div style={{ display: 'flex' }}>
              <table style={{ width: '100%' }}>
                <tbody>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>
                    제목
                  </th>
                  <td>
                    <li><input style={{ width: '90%' }} type="text" onChange={changeTitle} required /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>내용</th>
                  <td>
                    <li><textarea style={{ width: '90%' }} onChange={changeContent}></textarea></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>장르</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="text" onChange={changeType} /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>개봉일</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="date" onChange={changeReleaseDate} required /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>타이틀 파일</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="file" onChange={changeMainFiles} required /></li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>스틸 컷 파일</th>
                  <td>
                    <li><input style={{ width: '90%' }} type="file" onChange={changeStilcuts} multiple /></li>
                  </td>
                </tr>
                </tbody>
              </table>
            </div>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to={"/admin/movie/list"} className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>취소</Link>
              <button type="submit" className={ResetCs.butten} onClick={onSubmit}>생성</button>
            </div>
        </div>
        <div className="col-md-2">
          {/* 여기에 필요한 내용 추가 */}
        </div>
      </div>
      <br /><br /><br /><br /><br /><br />
      <br /><br /><br />
    </div>
  )
}

export default MovieInsert