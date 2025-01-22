import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
const NoticeUpdate = () => {
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

  useEffect( () => {
    getSelect()
    }, [])

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = {
      "id" : id,
      "title" : title,
      "content" : content
    }

    console.dir(formData);
    let response
    let data
    try {
      response = await admins.noticeUpdate(JSON.stringify(formData))
    } catch (error) {
      console.log(error);
      console.error(`공지수정 중 에러가 발생하였습니다.`);
      return
    }
    
    data = response.data
    const status = response.status
    console.log(`data : ${data}`);
    console.log(`status : ${status}`);

    if(status == 200){
      console.log('공지수정 성공!');
      navigate(`/admin/notice/select/${id}`);
    }else{
      console.log('공지수정 실패!');
    }
  };

  const remove = async (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      let response
      try {
        response = await admins.noticeDelete(id)
      } catch (error) {
        console.log(error);
        console.error(`공지삭제 중 에러가 발생하였습니다.`);
        return
      }
      
      const status = response.status
  
      if(status == 200){
        console.log('공지삭제 성공!');
        navigate(`/admin/notice/list?`);
      }else{
        console.log('공지삭제 실패!');
      }
    }
  };

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
        <div className="col-md-8" style={{ padding: '20px' }}>
          <form onSubmit={handleSubmit}>
            <br />
            <div style={{display : 'flex'}}>
              <h1>공지 수정</h1>
              <button
              className={ResetCs.delete_butten}
              type="button"
              onClick={() => remove(notice.id)}
            >
              삭제
            </button>
            </div>
            <br />
            <table style={{ width: '100%' }}>
              <tbody>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>제목</th>
                  <td>
                    <li>
                      <input
                        className="form-control me-3"
                        style={{ width: '85%' }}
                        type="text"
                        name="title"
                        id="title"
                        defaultValue={notice?.title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>내용</th>
                  <td>
                    <textarea
                      name="content"
                      id="content"
                      className='form-control'
                      style={{ width: '100%', height: '500px' }}
                      defaultValue={notice?.content}
                      onChange={(e) => setContent(e.target.value)}
                    ></textarea>
                  </td>
                </tr>
              </tbody>
            </table>
            <br />
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Link to="/admin/notice/list" className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>
                취소
              </Link>
              <input type="submit" value="수정" className={ResetCs.butten} />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default NoticeUpdate