import React from 'react'
import {Link} from 'react-router-dom'
import { useContext } from 'react'
import { LoginContext } from '../../contexts/LoginContextProvider'
import 'bootstrap/dist/css/bootstrap.min.css'
import styles from './Layout.module.css';

const Header = () => {

  // LoginContext 가져오기
  // isLogin 변수
  // logout 함수
  const {isLogin, logout} = useContext(LoginContext)

  // localStorage에서 roles 가져오기
  const rolesString = localStorage.getItem("roles");
  let isAdmin = false;
  if (rolesString) {
      // JSON 문자열을 객체로 변환
      const roles = JSON.parse(rolesString);

      // isAdmin 값만 변수로 추출
      isAdmin = roles.isAdmin;
  } else {
  console.log("roles가 없습니다.");
  }

  return (
<header className={styles.headerForm}>
      <nav className={`${styles.navbar} bg-white`}>
        <div className="container d-flex justify-content-between align-items-center align-content-center p-2">
          <Link to="/" className={styles.navbarBrand}>
            <img src="/upload/vora_purple_black.png" alt="Logo" style={{ width: "105px", height: "40px" }} />
          </Link>
          <ul className={`${styles.navbarNav} d-flex justify-content-between align-items-center align-content-center`}>
          {
            isLogin ?
              <>
                {isAdmin && (
                  <li className={`${styles.navItem} mx-2`}>
                    <Link to="/admin" className={styles.navLink}>관리자</Link>
                  </li>
                )}
                <li className={`${styles.navItem} mx-2`}>
                  <a className={styles.navLink} onClick={() => logout()}>로그아웃</a>
                </li>
                <li className={`${styles.navItem} mx-2`}>
                    <Link to="/mypage" className={styles.navLink}>마이페이지</Link>
                </li>
                <li className={`${styles.navItem} mx-2`}>
                    <Link to="/inquiry" className={styles.navLink}>고객센터</Link>
                </li>
              </>
            :
              <>
                <li className={`${styles.navItem} mx-2`}>
                    <Link to="/login" className={styles.navLink}>로그인</Link>
                </li>
                <li className={`${styles.navItem} mx-2`}>
                  <Link to="/join" className={styles.navLink}>회원가입</Link>
                </li>
                <li className={`${styles.navItem} mx-2`}>
                    <Link to="/inquiry" className={styles.navLink}>고객센터</Link>
                </li>
              </>
            }  
          </ul>
        </div>
        <div className={`${styles.subNav} container d-flex justify-content-between align-items-center`}>
          <ul className={`${styles.navbarNav} flex-row`}>
            <li className={`${styles.navItem} mx-3`}>
              <a className={styles.navLink} href="/movie/movieChart">
                영화
              </a>
            </li>
          </ul>
          <div className={styles.searchBar}>
            <form action="/movie/search" method="get" className="d-flex align-items-center">
              <input
                type="text"
                className={`form-control ${styles.searchInput} me-2`}
                name="search"
                placeholder="검색어를 입력하세요"
              />
              <button className={`btn ${styles.btnSearch}`}>
                <i className={`${styles.searchIcon} bi bi-search`}></i>
              </button>
            </form>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header