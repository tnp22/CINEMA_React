import React, { useEffect, useState } from 'react'
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import formatDate from '../formatDate';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
const NoticeList = () => {
    // 🧊 state
    const [noticeList, setNoticeList] = useState([])
    const [pagination, setPagination] = useState({})
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(6)
    const [search, setSearch] = useState()

    // ?파라미터=값 가져오는 방법
    const location = useLocation()

    const updatePage = () => {
      const query = new URLSearchParams(location.search)
      const newPage = query.get("page") ?? 1
      const newSize = query.get("size") ?? 6
      const newsearch = query.get("search")
      console.log(`newPage : ${newPage}`);
      console.log(`newSize : ${newSize}`);
      console.log(`newsearch : ${newsearch}`);
      setPage(newPage)
      setSize(newSize)
      setSearch(newsearch)
    }

  // 🎁 게시글 목록 데이터
  const getList = async () => {
    let response = null
    if(search != null){
      response = await admins.noticeListSearch(page,size,search)
    }
    else{
      response = await admins.noticeList(page, size)
    }
    const data = await response.data
    const list = data.pageInfo
    const pagination = data.pagination
    console.dir(data)
    console.dir(data.pageInfo)
    console.dir(data.pagination)

    setNoticeList( list )
    setPagination( pagination )
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
  }, [page, size,search])

  useEffect( () => {
    updatePage()
  }, [location.search])

    // 🧊 state
    const [pageList, setPageList] = useState([])

    const createPageList = () => {
      let newPageList = []
      for (let i = pagination.start; i <= pagination.end; i++) {
        newPageList.push(i)
      }
      setPageList(newPageList)
    }

  useEffect(() => {
    createPageList()

  }, [pagination])
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
        <h1>공지 관리</h1>
          <br />
          <div className="container mt-5">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">제목</th>
                  <th scope="col">생성일자</th>
                  <th scope="col">수정일자</th>
                  <th scope="col">비고</th>
                </tr>
              </thead>
              <tbody>
                {noticeList.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: "center" }}>
                      조회된 데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  noticeList.map((notice) => (
                    <tr key={notice.id} style={{ lineHeight: "40px" }}>
                      <td>{notice.title}</td>
                      <td>{formatDate(notice.regDate)}</td>
                      <td>{formatDate(notice.updDate)}</td>
                      <td>
                        <Link
                          style={{ marginRight: "5px" }}
                          className={`btn ${ResetCs.butten}`}
                          type="button"
                          to={`/admin/notice/select/${notice.id}`}
                        >
                          조회
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="container mt-4">
              <form action="/admin/notice/list" className="d-flex" method="get">
                <input
                  className="form-control me-3"
                  style={{ width: "90%" }}
                  name="search"
                  type="search"
                  defaultValue={search}
                  placeholder="검색어를 입력하세요"
                  aria-label="Search"
                />
                <input className="btn btn-outline-success" type="submit" value="검색" />
              </form>
            </div>
             {/* 페이지네이션 */}
            {/* 서버 측 페이지네이션이므로 React에서는 해당 HTML을 유지 */}

                {/* 페이지네이션 - Link */}
                {
                  ( pagination != null && pagination.total > 0 )
                  &&
                  (
                    <div className="pagination">
                      <Link to={`/admin/notice/list?page=${pagination.first}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                        <KeyboardDoubleArrowLeftIcon />
                      </Link>
                      {
                        ( pagination.page <= pagination.first )
                        ||
                        <Link to={`/admin/notice/list?page=${pagination.prev}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowLeftIcon />        
                        </Link>
                      }
                      {
                        pageList.map( page => (
                          <div key={page}>
                            <Link className={`${ResetCs.btnPPage} ${page === pagination.page ? ResetCs.activI : ''}`}  to={`/admin/notice/list?page=${page}&search=${search || ''}&size=${pagination.size}`} >{page}</Link>
                          </div>
                        ))
                      }
                      {
                        (pagination.page >= pagination.last)
                        ||
                        <Link to={`/admin/notice/list?page=${pagination.next}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowRightIcon />
                        </Link>
                      }
                      <Link to={`/admin/notice/list?page=${pagination.last}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                        <KeyboardDoubleArrowRightIcon />
                      </Link>
                    </div>
                  )
                }
                
          </div>
        </div>
        <div className="col-md-2">
          <div style={{ marginTop: '100px', fontSize: '26px' }}>
            <ul className="mt-5">
              <li>
                <Link to="/admin/notice/insert">공지 생성</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoticeList