import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useNavigate, useParams } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import * as Swal from '../../../apis/alert'

const MovieUpdate = () => {

  const { id } = useParams() // URL에서 id 파라미터 추출
  const [movie, setMovie] = useState({})
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

  // 게시글 수정 요청 이벤트 핸들러
  const onUpdate = async (formData, headers) => {
    try {
      // const response = await boards.update(id, title, writer, content)
      const response = await admins.movieUpdate(formData, headers)
      const data = await response.data
      const status = response.status
      console.log(data);
      if(status == 200){
        console.log('성공!');
        Swal.alert('SUCCESS', '이동합니다', 'success',
                    () => {navigate(`/admin/movie/select/${id}`)}
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
  
  const onMainPlus = async (mid) => {

    // 파일 업로드
    // application/json ➡ multipart/form-data
    const formData = new FormData()
    // 게시글 정보 세팅
    formData.append('id', id)
    //<input type="hidden" name="FileId" th:value="${files.id}" />
    formData.append('FileId',mid)

    // 📄 파일 데이터 세팅
    if( mainFiles ) {
      formData.append('mainFiles', mainFiles)
    }

    // 🎫 헤더
    const headers = {
      'Content-Type' : 'multipart/form-data'
    }

    try {
      // const response = await boards.update(id, title, writer, content)
      const response = await admins.movieMainPlus(formData, headers)
      const data = await response.data
      console.log(data);
      getList()
    } catch (error) {
      console.log(error);
      
    }

  }


  const onStilcutDelete = async (stid) =>{
    console.log(stid +","+id)
    const response = await admins.movieStilcutDelete(stid,id)
    const data = await response.data
    console.log(data)
    getList()
  }

  const onStilcutPlus = async () => {

    // 파일 업로드
    // application/json ➡ multipart/form-data
    const formData = new FormData()
    // 게시글 정보 세팅
    formData.append('id', id)

    // 📄 파일 데이터 세팅
    // if( mainFiles ) {
    //   formData.append('mainFiles', mainFiles)
    // }
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

    try {
      // const response = await boards.update(id, title, writer, content)
      const response = await admins.movieStilcutPlus(formData, headers)
      const data = await response.data
      console.log(data);
      getList()
      setStilcuts(null)
    } catch (error) {
      console.log(error);
      
    }

  }

  const onSubmit = () => {

    // 파일 업로드
    // application/json ➡ multipart/form-data
    const formData = new FormData()
    // 게시글 정보 세팅
    formData.append('id',id)
    formData.append('title', title)
    formData.append('content', content)
    formData.append('type', type)

    const formattedReleaseDate = new Date(releaseDate).toISOString().split('T')[0];

    formData.append('releaseDate', formattedReleaseDate);

    // 🎫 헤더
    const headers = {
      'Content-Type' : 'multipart/form-data'
    }

    // onUpdate(title, writer, content)   // application/json 
    onUpdate(formData, headers)           // multipart/form-data

  }

    // 🎁 게시글 목록 데이터
    const getList = async () => {
      const response = await admins.movieSelect(id)
      const data = await response.data
      const list = data.movie
      console.dir(data)
      console.dir(data.movie)
  
      setMovie( list )
    }
  
    useEffect( () => {
      getList()
    }, [])

    useEffect( () => {
      if(movie){
        setTitle(movie.title)
        setContent(movie.content)
        setType(movie.type)
        setReleaseDate(movie.releaseDate)
        setMainFiles(movie.mainFiles)
        setStilcuts(movie.stilcuts)
      }
    }, [movie])

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
          <h1>영화 조회</h1>
          <br />
          <div style={{ display: 'flex' }}>
            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '37%',
              }}
            >
              {/* 서버 사이드 렌더링 태그 그대로 유지 */}
              {movie?.filesList?.map(files =>
                  files.division === 'main' ? (
                    <div key={files.id} style={{display : 'flex', justifyItems : 'center' ,  flexDirection: 'column'}}> {/* key를 div에 할당 */}
                    <img
                      className="mx-auto"
                      style={{ width: '90%', overflow: 'hidden' }}
                      src={`/api/files/img?id=${files.id}`}
                      alt={files.id}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                          <input style={{ marginTop: '10px', marginLeft: '50px' }} type="file" onChange={changeMainFiles} required />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '10px' }}>
                          <button type="submit" onClick={() => onMainPlus(files.id)} className={ResetCs.a_butten} >변경</button>
                        </div>
                    </div>
                  </div>
                  ) : null
                )}
            </div>

            {/* <form action="/admin/movie/update" method="post"> */}
              <table style={{ width: '120%' }}>
                <tbody>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>
                    제목
                  </th>
                  <td>
                    <input style={{ width: '90%' }} type="text" defaultValue={title} onChange={changeTitle} />
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>내용</th>
                  <td>
                    <textarea style={{ width: '90%', height: '450px' }} defaultValue={content} onChange={changeContent} />
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%',  textAlign: 'center' }}>장르</th>
                  <td>
                    <li>
                      <input style={{ width: '90%' }} type="text" name="type" defaultValue={type} onChange={changeType} />
                    </li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>개봉일</th>
                  <td>
                    <li>
                      <input
                        style={{ width: '90%' }}
                        type="date"
                        defaultValue={movie.releaseDate ? movie.releaseDate.split('T')[0] : ""} // 날짜만 추출해서 설정
                        onChange={changeReleaseDate}
                        required
                      />
                    </li>
                  </td>
                </tr>
                </tbody>
              </table>


          </div>
          <br />
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to={`/admin/movie/select/${id}`} className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>
              취소
            </Link>
            <button type="submit" className={ResetCs.a_butten} onClick={onSubmit} >수정</button>
          </div>
          <br />
          <br />
          <br />
          <div>
            <h4>스틸 컷</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', columnGap: '30px', rowGap: '30px' }}>
              {movie?.filesList?.map(files =>
                  files.division === 'stilcut' ? (
                    <div key={files.id} style={{display : 'flex', justifyItems : 'center' ,  flexDirection: 'column'}}> {/* key를 div에 할당 */}
                    <img
                      className="w-100 mx-auto"
                      style={{ overflow: 'hidden' }}
                      src={`/api/files/img?id=${files.id}`}
                      alt={files.id}
                    />
                    <button onClick={() => onStilcutDelete(files.id)} className={`mx-auto mt-1 ${ResetCs.a_butten}`}>
                      삭제
                    </button>
                  </div>
                  ) : null
                )}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100px' }}>
              {/* <form action="" method="post" encType="multipart/form-data"> */}
                <input type="file" onChange={changeStilcuts} multiple />
                <button type="submit" onClick={onStilcutPlus} className={ResetCs.a_butten} >추가</button>
              {/* </form> */}
            </div>
            <div style={{ height : '100px'}}>

            </div>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
};

export default MovieUpdate;
