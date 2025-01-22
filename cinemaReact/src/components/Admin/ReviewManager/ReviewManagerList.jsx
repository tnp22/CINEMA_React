import React, { useEffect, useState } from 'react'
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import formatDate from '../formatDate';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const ReviewManagerList = () => {
  // 🧊 state
  const [reviewList, setReviewList] = useState([])
  const [pagination, setPagination] = useState({})
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(6)
  const [search, setSearch] = useState()
  const navigate = useNavigate();
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
    response = await admins.reviewListSearch(page,size,search)
  }
  else{
    response = await admins.reviewList(page, size)
  }
  const data = await response.data
  const list = data.pageInfo
  const pagination = data.pagination
  console.dir(data)
  console.dir(data.pageInfo)
  console.dir(data.pagination)

  setReviewList( list )
  setPagination( pagination )
}

 // 리뷰 삭제 함수
 const removeReview = async (id) => {
  if (window.confirm("정말로 삭제하시겠습니까?")) {
    let response
    try {
      response = await admins.reviewDelete(id)
    } catch (error) {
      console.log(error);
      console.error(`리뷰삭제 중 에러가 발생하였습니다.`);
      return
    }
    
    const status = response.status

    if(status == 200){
      console.log('리뷰삭제 성공!');
      navigate(`/admin/reviewManager/list?`);
    }else{
      console.log('리뷰삭제 실패!');
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
        <div className="col-md-8" style={{ textAlign: 'center', padding: '20px' }}>
          <h1 className="text-center">리뷰 관리</h1>
          <div className="container mt-5">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">아이디</th>
                  <th scope="col">영화</th>
                  <th scope="col">별점</th>
                  <th scope="col">댓글</th>
                  <th scope="col">비고</th>
                </tr>
              </thead>
              <tbody>
                {reviewList.length === 0 ? (
                  <tr>
                    <td colSpan={5} align="center">조회된 리뷰가 없습니다.</td>
                  </tr>
                ) : (
                  reviewList.map((review) => (
                    <tr key={review.id} style={{ lineHeight: "40px" }}>
                      <th>{review.username}</th>
                      <td>{review.title}</td>
                      <td>{review.ratingValue}</td>
                      <td>{review.content}</td>
                      <td>
                        <button
                          className={ResetCs.butten}
                          type="button"
                          onClick={() => removeReview(review.id)}
                        >
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            <div className="container mt-4">
              <form action="/admin/reviewManager/list" className="d-flex" method="get">
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
                      <Link to={`/admin/reviewManager/list?page=${pagination.first}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                        <KeyboardDoubleArrowLeftIcon />
                      </Link>
                      {
                        ( pagination.page <= pagination.first )
                        ||
                        <Link to={`/admin/reviewManager/list?page=${pagination.prev}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowLeftIcon />        
                        </Link>
                      }
                      {
                        pageList.map( page => (
                          <div key={page}>
                            <Link className={`${ResetCs.btnPPage} ${page === pagination.page ? ResetCs.activI : ''}`}  to={`/admin/reviewManager/list?page=${page}&search=${search || ''}&size=${pagination.size}`} >{page}</Link>
                          </div>
                        ))
                      }
                      {
                        (pagination.page >= pagination.last)
                        ||
                        <Link to={`/admin/reviewManager/list?page=${pagination.next}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowRightIcon />
                        </Link>
                      }
                      <Link to={`/admin/reviewManager/list?page=${pagination.last}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                        <KeyboardDoubleArrowRightIcon />
                      </Link>
                    </div>
                  )
                }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReviewManagerList