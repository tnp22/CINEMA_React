import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useNavigate } from 'react-router-dom';
import LeftSideBar1 from '../../LeftSideBar1'
import AdminHeader from '../../AdminHeader';
import * as admins from '../../../../apis/admins'
import formatDate from '../../../Admin/formatDate'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


const UserList = () => {
      // 🧊 state
      const [userList, setUserList] = useState([])
      const [pagination, setPagination] = useState({})
      const [page, setPage] = useState(1)
      const [size, setSize] = useState(16)
      const [search, setSearch] = useState()
  
      // ?파라미터=값 가져오는 방법
      const location = useLocation()
    
      const updatePage = () => {
        const query = new URLSearchParams(location.search)
        const newPage = query.get("page") ?? 1
        const newSize = query.get("size") ?? 16
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
        response = await admins.userListSearch(page,size,search)
      }
      else{
        response = await admins.userList(page, size)
      }
      const data = await response.data
      const list = data.pageInfo
      const pagination = data.pagination
      console.dir(data)
      console.dir(data.pageInfo)
      console.dir(data.pagination)
  
      setUserList( list )
      setPagination( pagination )
    }

    const remove = async (username) =>{
      if( !confirm('정말로 전환 하시겠습니까?') )
        return
      console.log(username)
      const response = await admins.userSleep(username)
      getList()
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
        `}
      </style>
      <br />
      <AdminHeader/>
      <div className="row" style={{ height: '90%' }}>
        <LeftSideBar1/>
        <div className="col-md-8">
          <h1 className="text-center">유저 관리</h1>
          <div className="container mt-5">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">아이디</th>
                  <th scope="col">이름</th>
                  <th scope="col">활성화여부</th>
                  <th scope="col">수정날짜</th>
                  <th scope="col">비고</th>
                </tr>
              </thead>
              <tbody>
                {
                  userList.length == 0
                  ?
                  <tr>
                    <td colSpan={5} align="center">조회된 데이터가 없습니다.</td>
                  </tr>
                  :
                  userList.map( (index) => {
                    return(
                      
                        <tr key={index.id} style={{ lineHeight: '40px' }}>
                            <td>{index.username}</td>
                            <td>{index.name}</td>               
                            <td>{index.enabled.toString()}</td>
                            <td>{formatDate(index.updDate)}</td>
                            <td>
                              <Link
                                style={{marginRight: '5px'}}
                                className={`btn ${ResetCs.butten}`}
                                type="button"
                                to={`/admin/user/select/${index.username}`}
                              >
                                조회
                              </Link>
                              <button
                                className={`btn ${ResetCs.butten_l}`}
                                type="button"
                                onClick={ ()=> remove(index.username)}
                              >
                                활성화 전환
                              </button>
                            </td>
                          </tr>
                          
                    )
                  })
                }
                </tbody>
            </table>
          </div>
          <div className="container mt-4">
            <form
              action="/admin/user/list"
              className="d-flex"
              method="get"
            >
              <input
                className="form-control me-3"
                style={{ width: '90%' }}
                name="search"
                type="search"
                th:value="${search}"
                placeholder="검색어를 입력하세요"
                aria-label="Search"
              />
              <input
                className="btn btn-outline-success"
                type="submit"
                value="검색"
              />
            </form>
          </div>
            {/* 페이지네이션 - Link */}
            {
                  ( pagination != null && pagination.total > 0 )
                  &&
                  (
                    <div className="pagination">
                      <Link to={`/admin/user/list?page=${pagination.first}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                        <KeyboardDoubleArrowLeftIcon />
                      </Link>
                      {
                        ( pagination.page <= pagination.first )
                        ||
                        <Link to={`/admin/user/list?page=${pagination.prev}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowLeftIcon />        
                        </Link>
                      }
                      {
                        pageList.map( page => (
                          <div key={page}>
                            <Link className={`${ResetCs.btnPPage} ${page === pagination.page ? ResetCs.activI : ''}`}  to={`/admin/user/list?page=${page}&search=${search || ''}&size=${pagination.size}`} >{page}</Link>
                          </div>
                        ))
                      }
                      {
                        (pagination.page >= pagination.last)
                        ||
                        <Link to={`/admin/user/list?page=${pagination.next}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowRightIcon />
                        </Link>
                      }
                      <Link to={`/admin/user/list?page=${pagination.last}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                        <KeyboardDoubleArrowRightIcon />
                      </Link>
                    </div>
                  )
            }
            <div style={{ height: '200px' }}></div>
        </div>
        <div className="col-md-2">
          <div style={{ marginTop: '100px', fontSize: '26px' }}>
            <ul className="mt-5"></ul>
          </div>
        </div>
      </div>
      <br />
    </div>
  );
};

export default UserList;
