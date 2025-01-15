import React from 'react'
import { Link, NavLink } from 'react-router-dom'

const LeftSideBar1 = () => {
  return (
    <div className="col-md-2">
        <style>
    {`
        .aactivee {
        color: #583BBF;
        }
    `}
    </style>
    <div style={{ marginTop: '100px', fontSize: '26px' }}>
      <ul>
        <li>
          <NavLink to={`/admin`}
            className={({ isActive }) => (isActive ? "aactivee" : "")}
          >
            영화관
          </NavLink>
        </li>
        <li className="mainLi">
          <NavLink to={`/admin/movie/list`}
          className={({ isActive }) => (isActive ? "aactivee" : "")} >영화관리</NavLink>
          <nav className="subLi">
            <li>
              <NavLink to={`/admin/movie/list`}
              className={({ isActive }) => (isActive ? "aactivee" : "")}>영화 관리</NavLink>
            </li>
            <li>
              <NavLink to={`/admin/cast/list`} 
              className={({ isActive }) => (isActive ? "aactivee" : "")}>출연진 관리</NavLink>
            </li>
          </nav>
        </li>
        <li className="mainLi">
          <NavLink to={`/admin/userManager/user/list`}
          className={({ isActive }) => (isActive ? "aactivee" : "")}>유저관리</NavLink>
          <nav className="subLi">
            <li>
              <NavLink to={`/admin/userManager/user/list`}
              className={({ isActive }) => (isActive ? "aactivee" : "")}>유저 관리</NavLink>
            </li>
            <li>
              <NavLink to={`/admin/userManager/auth/list`}
              className={({ isActive }) => (isActive ? "aactivee" : "")} >권한 관리</NavLink>
            </li>
          </nav>
        </li>
        <li>
          <NavLink to={`/admin/banner/list`}
          className={({ isActive }) => (isActive ? "aactivee" : "")}>배너관리</NavLink>
        </li>
        <li>
          <NavLink to={`/admin/reviewManager/list`} 
          className={({ isActive }) => (isActive ? "aactivee" : "")}>리뷰관리</NavLink>
        </li>
        <li>
          <NavLink to={`/admin/notice/list`}
          className={({ isActive }) => (isActive ? "aactivee" : "")}>공지관리</NavLink>
        </li>
      </ul>
    </div>
  </div>
  )
}

export default LeftSideBar1