import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const MovieList = () => {

    // 🧊 state
    const [movieList, setMovieList] = useState([])
    const [pagination, setPagination] = useState({})
    const [page, setPage] = useState(1)
    const [size, setSize] = useState(6)

    // ?파라미터=값 가져오는 방법
    const location = useLocation()
  
    const updatePage = () => {
      const query = new URLSearchParams(location.search)
      const newPage = query.get("page") ?? 1
      const newSize = query.get("size") ?? 6
      console.log(`newPage : ${newPage}`);
      console.log(`newSize : ${newSize}`);
      setPage(newPage)
      setSize(newSize)
    }

  // 🎁 게시글 목록 데이터
  const getList = async () => {
    const response = await admins.movieList(page, size)
    const data = await response.data
    const list = data.pageInfo
    const pagination = data.pagination
    console.dir(data)
    console.dir(data.pageInfo)
    console.dir(data.pagination)

    setMovieList( list )
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
  }, [page, size])

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
          <h1>영화 관리</h1>
          <br />
          <div className="row">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3,1fr)',
                columnGap: '20px',
                rowGap: '20px',
              }}>
              {/* movie 리스트를 반복해서 출력 */}
              {/* 데이터가 React로 전달되지 않았으므로 해당 부분을 유지 */}
              {/* 여기에 map()을 이용해 movie 리스트를 렌더링 가능 */}
              {/* 데이터를 props로 전달하거나 useState로 관리 */}
              {
                movieList.length == 0
                ?
                <span colSpan={5} align='center'>조회된 데이터가 없습니다.</span>
                :
                movieList.map( (index) => {
                  return(
                    <div key={index.id} className="card" style={{ border: 'none', fontSize: '20px' }}>
                      <Link to={`/admin/movie/select/${index.id}`}>
                      <img className="w-100 mx-auto" style={{ overflow: 'hidden' }} src={`/api/files/img?id=${index.files.id}`} alt={index.files} />
                        </Link>
                        <Link to={`/admin/movie/select/${index.id}`}><span className="mx-auto">{index.title}</span></Link>
                    </div>
                  )
                })
              }

            </div>
            <div className="container mt-4">
              <form action="/admin/movie/list" className="d-flex" method="get">
                <input
                  className="form-control me-3"
                  style={{ width: '90%' }}
                  name="search"
                  type="search"
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
                      <Link to={`/admin/movie/list?page=${pagination.first}`} className={ResetCs.btnPPage}>
                        <KeyboardDoubleArrowLeftIcon />
                      </Link>
                      {
                        ( pagination.page <= pagination.first )
                        ||
                        <Link to={`/admin/movie/list?page=${pagination.prev}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowLeftIcon />        
                        </Link>
                      }
                      {
                        pageList.map( page => (
                          <div key={page}>
                            <Link className={`${ResetCs.btnPPage} ${page === pagination.page ? ResetCs.activI : ''}`}  to={`/admin/movie/list?page=${page}`} >{page}</Link>
                          </div>
                        ))
                      }
                      {
                        (pagination.page >= pagination.last)
                        ||
                        <Link to={`/admin/movie/list?page=${pagination.next}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowRightIcon />
                        </Link>
                      }
                      <Link to={`/admin/movie/list?page=${pagination.last}`} className={ResetCs.btnPPage}>
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
                <Link to="/admin/movie/insert">영화 생성</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </div>
  );
};

export default MovieList;
