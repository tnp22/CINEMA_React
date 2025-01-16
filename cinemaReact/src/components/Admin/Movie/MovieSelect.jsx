import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useParams } from 'react-router-dom';
import * as format from '../../../utils/format'
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
// import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
// import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
// import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
// import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const MovieSelect = () => {

  const { id } = useParams() // URL에서 id 파라미터 추출
  const [movie, setMovie] = useState()

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
            {/* th:each를 리액트에서 반복문으로 대체 */}
            {/* 해당 부분은 서버에서 movie 정보가 어떻게 전달되는지에 따라 처리 필요 */}
            {/* 예시로 movie 파일을 렌더링하는 부분 */}

            {movie?.filesList?.map(files =>
              files.division === 'main' ? (
                <img
                  key={files.id}
                  className="mx-auto"
                  style={{ width: '50%', overflow: 'hidden' }}
                  src={`/api/files/img?id=${files.id}`} // 이미지 경로 수정
                  alt={files.id}
                />
              ) : null
            )}

            <table style={{ width: '100%' }}>
              <tbody>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>
                  제목
                </th>
                <td>
                  <li>{movie?.title}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>내용</th>
                <td>
                  <li style={{ whiteSpace: 'pre-line' }}>{movie?.content}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>장르</th>
                <td>
                  <li>{movie?.type}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>개봉일</th>
                <td>
                  <li>{format.formatDate(movie?.releaseDate)}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>생성 일자</th>
                <td>
                  <li>{format.formatDate(movie?.regDate)}</li>
                </td>
              </tr>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>수정 일자</th>
                <td>
                  <li>{format.formatDate(movie?.updDate)}</li>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <br /><br /><br />
          <div>
            <h4>스틸 컷</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', columnGap: '30px', rowGap: '30px' }}>
              {movie?.filesList?.map(files =>
                files.division === 'stilcut' ? (
                  <img
                    key={files.id}
                    className="w-100 mx-auto"
                    style={{ overflow: 'hidden' }}
                    src={`/api/files/img?id=${files.id}`}
                    alt={files.id}
                  />
                ) : null
              )}
            </div>
          </div>
          <br /><br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to="/admin/movie/list" className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>취소</Link>
            <Link to={`/admin/movie/update/${id}`} className={ResetCs.a_butten}>수정</Link>
          </div>
          <div style={{ height: '200px' }}>

          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  )
}

export default MovieSelect
