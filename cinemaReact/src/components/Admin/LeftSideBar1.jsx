import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const LeftSideBar1 = () => {

  const location = useLocation();

  useEffect(() => {
    // 스타일을 동적으로 삽입하기
    const links = document.querySelectorAll('.AdminCINEMA');
    links.forEach(link => {
      if (link.getAttribute('to') === "/admin") {
        link.classList.add('aactivee');  // 특정 링크에만 'aactivee' 클래스 추가
      }
    });

    return () => {
    };
  }, []);

  return (
    <div className="col-md-2">
      <style>
        {`
          .aactivee {
            color: #583BBF !important;
          }
          .aactivee:hover {
            color: #A88EFF !important;
          }
        `}
      </style>
    <div style={{ marginTop: '100px', fontSize: '26px' }}>
      <ul>
        <li>
          <Link className={(location.pathname === "/admin" || location.pathname.startsWith("/admin/cinema")) ? "aactivee" : ""}
            to={`/admin`}>
            영화관
          </Link>
        </li>
        <li className="mainLi">
          <Link to={`/admin/movie/list`}
            className={location.pathname.startsWith("/admin/movie") ? "aactivee" : ""} 
          >영화관리</Link>
          <nav className="movieLi">
            <li>
              <Link to={`/admin/movie/list`}
             className={location.pathname.startsWith("/admin/movie") ? "aactivee" : ""}>영화 관리</Link>
            </li>
            <li>
              <Link to={`/admin/cast/list`} 
              className={location.pathname.startsWith("/admin/cast") ? "aactivee" : ""}>출연진 관리</Link>
            </li>
          </nav>
        </li>
        <li className="mainLi">
          <Link to={`/admin/user/list`}
          className={location.pathname.startsWith("/admin/user") ? "aactivee" : ""}>유저관리</Link>
          <nav className="subLi">
            <li>
              <Link to={`/admin/user/list`}
              className={location.pathname.startsWith("/admin/user") ? "aactivee" : ""}>유저 관리</Link>
            </li>
            <li>
              <Link to={`/admin/auth/list`}
              className={location.pathname.startsWith("/admin/auth") ? "aactivee" : ""} >권한 관리</Link>
            </li>
          </nav>
        </li>
        <li>
          <Link to={`/admin/banner/list`}
          className={location.pathname.startsWith("/admin/banner") ? "aactivee" : ""}>배너관리</Link>
        </li>
        <li>
          <Link to={`/admin/reviewManager/list`} 
          className={location.pathname.startsWith("/admin/reviewManager") ? "aactivee" : ""}>리뷰관리</Link>
        </li>
        <li>
          <Link to={`/admin/notice/list`}
          className={location.pathname.startsWith("/admin/notice") ? "aactivee" : ""}>공지관리</Link>
        </li>
      </ul>
    </div>
  </div>
  )
}

export default LeftSideBar1