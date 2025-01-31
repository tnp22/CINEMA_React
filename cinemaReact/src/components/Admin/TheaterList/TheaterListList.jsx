import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import LeftSideBar1 from '../LeftSideBar1'
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const TheaterListList = () => {

  const { id } = useParams() // URL에서 id 파라미터 추출


  // 🧊 state
  const [cinema, setCinema] = useState({})
  const [theaterList, setTheaterList] = useState([])
  const [pagination, setPagination] = useState({})
  const [page, setPage] = useState(1)
  const [size, setSize] = useState(10)
  const [search, setSearch] = useState()
  const [searchText,setSearchText] = useState()
  const changeSearchText = (e) => {
    setSearchText(e.target.value )
  }

  // ?파라미터=값 가져오는 방법
  const location = useLocation()
  const navigate = useNavigate()

  const Search = () =>{
    navigate(`/admin/theaterList/list/${id}?search=${searchText}`)
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
      response = await admins.theaterListListSearch(page,size,id,search)
    }
    else{
      response = await admins.theaterListList(page,size,id)
    }
    
    const data = await response.data

    const list = data.pageInfo
    const ncinema = data.cinema
    const pagination = data.pagination
    //console.dir(data)
    //console.dir(list)
    //console.dir(ncinema)

    setTheaterList( list )
    setCinema(ncinema)
    setPagination( pagination )
  }

  useEffect(() => {
    document.title = "ADMINISTRATOR";

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 핸들러 제거
    };
  }, []);

  // ❓ 
  useEffect( () => {
    getList()
    .then(() => {
      
    })
    .catch((error) => {
      console.error("Error occurred:", error);
      navigate('/admin/error'); // 예외가 발생하면 에러 페이지로 리디렉션
    });

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
      <br />
      <AdminHeader/>

      <div className="row" style={{ height: '90%' }}>
        <div className="col-md-2">
          <div style={{ marginTop: '100px', fontSize: '26px' }}>
            <ul>
              <li><Link to={`/admin/theater/list/${cinema?.id}`} >상영관</Link></li>
              <li><Link to={`/admin/theaterList/list/${cinema?.id}`} style={{ color: '#583BBF' }}>상영리스트</Link></li>
            </ul>
          </div>
        </div>
        <div className="col-md-8" style={{ textAlign: 'center' }}>
          <h1>{cinema?.area} {cinema?.areaSub}점</h1>
          <div className="container mt-5">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th scope="col">영화</th>
                  <th scope="col">상영관</th>
                  <th scope="col">시간대</th>
                  <th scope="col">비고</th>
                </tr>
              </thead>
              <tbody>
                {
                    theaterList && theaterList?.map(theater => (
                      <tr style={{ lineHeight: '40px' }} key={theater.id}>
                        <td>{theater?.movie?.title}</td>
                        <td>{theater?.theater?.name}</td>
                        <td>{theater?.time && new Date(theater?.time).toLocaleString()}</td>
                        <td>
                          <Link to={`/admin/theaterList/select/${cinema?.id}/${theater?.id}`} className={`btn ${ResetCs.butten}`}>
                            조회
                          </Link>
                        </td>
                      </tr>
                    ))
                  }
              </tbody>
            </table>
          </div>
          <div className="row">
            <div className="container mt-4">
            <div style={{display:'flex'}}>
                {/* <input type="hidden" name="id" value={id} /> */}
                <input
                  className="form-control me-3"
                  style={{ width: '90%' }}
                  name="search"
                  value={searchText || ''}
                  onChange={changeSearchText}
                  placeholder="검색어를 입력하세요"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit" onClick={Search} >검색</button>
              </div>
            </div>

                {/* 페이지네이션 - Link */}
                {
                  ( pagination != null && pagination.total > 0 )
                  &&
                  (
                    <div className="pagination">
                      <Link to={`/admin/theaterList/list/${id}?page=${pagination.first}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                        <KeyboardDoubleArrowLeftIcon />
                      </Link>
                      {
                        ( pagination.page <= pagination.first )
                        ||
                        <Link to={`/admin/theaterList/list/${id}?page=${pagination.prev}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowLeftIcon />        
                        </Link>
                      }
                      {
                        pageList.map( page => (
                          <div key={page}>
                            <Link className={`${ResetCs.btnPPage} ${page === pagination.page ? ResetCs.activI : ''}`}  to={`/admin/theaterList/list/${id}?page=${page}&search=${search || ''}&size=${pagination.size}`} >{page}</Link>
                          </div>
                        ))
                      }
                      {
                        (pagination.page >= pagination.last)
                        ||
                        <Link to={`/admin/theaterList/list/${id}?page=${pagination.next}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                          <KeyboardArrowRightIcon />
                        </Link>
                      }
                      <Link to={`/admin/theaterList/list/${id}?page=${pagination.last}&search=${search || ''}&size=${pagination.size}`} className={ResetCs.btnPPage}>
                        <KeyboardDoubleArrowRightIcon />
                      </Link>
                    </div>
                  )
                }
              <div style={{ height: '200px' }}></div>         


          </div>
        </div>
        <div className="col-md-2">
          <div style={{ marginTop: '100px', fontSize: '26px' }}>
            <ul className="mt-5">
              <li>
                <Link to={`/admin/theaterList/insert/${id}`}>상영리스트 생성</Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TheaterListList;