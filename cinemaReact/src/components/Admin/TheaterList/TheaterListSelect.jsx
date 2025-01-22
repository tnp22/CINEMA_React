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

const TheaterListSelect = () => {

  const { id } = useParams() // URL에서 id 파라미터 추출
  const { theaterListId } = useParams()

  const [theaterList, setTheaterList] = useState()

  // 🎁 게시글 목록 데이터
  const getList = async () => {
    const response = await admins.theaterListSelect(id,theaterListId)
    const data = await response.data
    const list = data.theaterList
    console.dir(data)

    setTheaterList( list )
  }


  useEffect( () => {
    getList()
    .then(() => {
      
    })
    .catch((error) => {
      console.error("Error occurred:", error);
      navigate('/admin/error'); // 예외가 발생하면 에러 페이지로 리디렉션
    });
  }, [])


  return (
   <div className={`container-fluid ${ResetCs.adminLEE}`} style={{ height: '98vh' }}>
      <br />
      <AdminHeader/>

      <div className="row" style={{ height: '90%' }}>
        <div className="col-md-2">
          <div style={{ marginTop: '100px', fontSize: '26px' }}>
            <ul>
              <li><Link to={`/admin/theater/list/${id}`} >상영관</Link></li>
              <li><Link to={`/admin/theaterList/list/${id}`} style={{ color: '#583BBF' }}>상영리스트</Link></li>
            </ul>
          </div>
        </div>
        <div className="col-md-8">
          <br />
          <h1>상영 조회</h1>
          <br />
          <div style={{ display: 'flex' }}>
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>영화</th>
                  <td>
                    <li>{theaterList?.movie?.title}</li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>상영관</th>
                  <td>
                    <li>{theaterList?.theater?.name}</li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>시간</th>
                  <td>
                    <li>{formatDate(theaterList?.time)}</li>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Link to={`/admin/theaterList/list/${id}`} className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>
              취소
            </Link>
            <Link
              to={`/admin/theaterList/update/${id}/${theaterListId}`}
              className={ResetCs.a_butten}
            >
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

export default TheaterListSelect;
