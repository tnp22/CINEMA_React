import React, { useEffect, useState } from 'react';
import $, { Callbacks } from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import * as Swal from '../../../apis/alert'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const CastList = () => {

      const navigate = useNavigate();
    // ?파라미터=값 가져오는 방법
    const location = useLocation()
          // 🧊 state
          const [castList, setCastList] = useState([])
          const [pagination, setPagination] = useState({})
          const [page, setPage] = useState(1)
          const [size, setSize] = useState(10)
        const [search, setSearch] = useState();
        const [searchText, setSearchText] = useState();
        
          useEffect( () => {
            updatePage()
          }, [location.search])
        
          useEffect( () => {
            getList()
          }, [search])
          
          const handleSearch = (e) => {
            e.preventDefault();
            // 검색 처리를 하고 새로운 URL로 이동
            navigate(`/admin/cast/list?search=${searchText}`);
          }
      

        
          const updatePage = () => {
            const query = new URLSearchParams(location.search)
            const newPage = query.get("page") ?? 1
            const newSize = query.get("size") ?? 10
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
            response = await admins.castListSearch(page,size,search)
          }
          else{
            response = await admins.castList(page, size)
          }
          const data = await response.data
          const list = data.pageInfo
          const pagination = data.pagination
          console.dir(data)
          console.dir(data.pageInfo)
          console.dir(data.pagination)
      
          setCastList( list )
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
          <h1>출연진 관리</h1>
          <br />
          <div className="container mt-5">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">이름</th>
                  <th scope="col">역할</th>
                  <th scope="col">영화</th>
                  <th scope="col">비고</th>
                </tr>
              </thead>
              <tbody>
                {castList?.map((cast) => (
                  <tr key={cast.id} style={{ lineHeight: '40px' }}>
                    <td>{cast.name}</td>
                    <td>{cast.rule}</td>
                    <td>{cast.movie.title}</td>
                    <td>
                      <Link
                        className={ResetCs.butten}
                        type="button"
                        to={`/admin/cast/select/${cast.id}`}
                        >
                        조회
                      </Link>
                    </td>
                  </tr>
                ))}
                {/* 추가 행 삽입 */}
              </tbody>
            </table>
            <div className="container mt-4">
            <div className="container mt-4" style={{ display: 'flex' }}>
                <input
                    className="form-control me-3"
                    style={{ width: '85%' }}
                    id="search"
                    type="search"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="검색어를 입력하세요"
                    aria-label="Search"
                    />
                    <button className="btn btn-outline-success" type="button" onClick={handleSearch}>검색</button>
                </div>
            </div>
            {/* 페이지네이션 */}
            {/* 페이지네이션 - Link */}
            {
                  ( pagination != null && pagination.total > 0 )
                  &&
                  (
                    <div className="pagination">
                      <Link to={`/admin/cast/list?page=${pagination.first}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                        <KeyboardDoubleArrowLeftIcon />
                      </Link>
                      {
                        ( pagination.page <= pagination.first )
                        ||
                        <Link to={`/admin/cast/list?page=${pagination.prev}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowLeftIcon />        
                        </Link>
                      }
                      {
                        pageList.map( page => (
                          <div key={page}>
                            <Link className={`${ResetCs.btnPPage} ${page === pagination.page ? ResetCs.activI : ''}`}  to={`/admin/cast/list?page=${page}&search=${search || ''}&size=${pagination.size}`} >{page}</Link>
                          </div>
                        ))
                      }
                      {
                        (pagination.page >= pagination.last)
                        ||
                        <Link to={`/admin/cast/list?page=${pagination.next}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowRightIcon />
                        </Link>
                      }
                      <Link to={`/admin/cast/list?page=${pagination.last}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
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
                <Link to="/admin/cast/insert">출연진 생성</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div style={{ height: '200px' }}></div>
    </div>
  );
};

export default CastList;
