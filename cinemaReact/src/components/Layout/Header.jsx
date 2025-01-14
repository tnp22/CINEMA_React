import React from 'react'
import {Link} from 'react-router-dom'
import { useContext } from 'react'
import { LoginContext } from '../../contexts/LoginContextProvider'
import 'bootstrap/dist/css/bootstrap.min.css'

const Header = () => {

  // LoginContext 가져오기
  // isLogin 변수
  // logout 함수
  const {isLogin, logout} = useContext(LoginContext)

  return (
<header>
      <nav className="navbar bg-white">
        <div className="container d-flex justify-content-between align-items-center">
          <Link to="/" className='navbar-brand'>
            <img src="/upload/vora_purple_black.png" alt="Logo" style={{ width: "105px", height: "40px" }} />
          </Link>
          <ul className="navbar-nav flex-row align-items-center">
          {
            isLogin ?
              <>
                <li className="nav-item mx-2">
                <Link to="/admin" className='nav-link'>관리자</Link>
                </li>
                <form action="/logout" method="post">
                  <li className="nav-item mx-2">
                    <button className='link' onClick={() => logout()}>로그아웃</button>
                  </li>
                </form>
                <li className="nav-item mx-2">
                    <Link to="/mypage" className='nav-link'>마이페이지</Link>
                </li>
                <li className="nav-item mx-2">
                    <Link to="/inquiry" className='nav-link'>고객센터</Link>
                </li>
              </>
            :
              <>
                <li className="nav-item mx-2">
                    <Link to="/login" className='nav-link'>로그인</Link>
                </li>
                <li className="nav-item mx-2">
                  <Link to="/join" className='nav-link'>회원가입</Link>
                </li>
                <li className="nav-item mx-2">
                    <Link to="/inquiry" className='nav-link'>고객센터</Link>
                </li>
              </>
            }  
          </ul>
        </div>
        <div className="container sub-nav d-flex justify-content-between align-items-center">
          <ul className="navbar-nav flex-row">
            <li className="nav-item mx-3">
              <a className="nav-link" href="/movie/movieChart">
                영화
              </a>
            </li>
          </ul>
          <div className="search-bar">
            <form action="/movie/search" method="get" className="d-flex align-items-center">
              <input
                type="text"
                className="form-control search-input me-2"
                name="search"
                placeholder="검색어를 입력하세요"
              />
              <button className="btn btn-search">
                <i className="bi bi-search search-icon"></i>
              </button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header