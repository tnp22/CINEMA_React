import React, { useContext, useState } from 'react'
import './LoginForm.css'
import { LoginContext } from '../../contexts/LoginContextProvider'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import {Link} from 'react-router-dom'


const LoginForm = () => {
  const { login } = useContext(LoginContext)  // 📦 LoginContext 의 🌞 login 함수

  const [username, setUsername] = useState(localStorage.getItem("username"));  // username 상태
  const [password, setPassword] = useState("");  // password 상태
  const [rememberId, setRememberId] = useState(localStorage.getItem("rememberId") === "true" || false);  // 아이디 저장 상태
  const [rememberMe, setRememberMe] = useState(localStorage.getItem("rememberMe") === "true" || false);
  const [error, setError] = useState(false);  // 에러 상태
  console.log(`username의 현재 값은 ${localStorage.getItem("username")}`)

  const onLogin = (e) => {
    console.log(`rememberId는 ${rememberId}`)
    console.log(`rememberMe는 ${rememberMe}`)
    console.log(`username은 ${username}`)
    if(rememberId == true){
      console.log('아이디 저장 성공');
      localStorage.setItem("username",username)
      localStorage.setItem("rememberId",true)
    }else{
      localStorage.removeItem("username")
      localStorage.setItem("rememberId",false)
    }
    if(rememberMe == true){
      localStorage.setItem("rememberMe",true)
    }else{
      localStorage.setItem("rememberMe",false)
    }
    e.preventDefault() 
    login( username, password ) 
  }

  return (
    <div className="login-form">
      <form onSubmit={(e) => onLogin(e)} className="login-form">
      <section className="container-sm mt-5 mb-5">
        <div className="login-header">
          <h5>로그인</h5>
        </div>
        <div className="container-md">
          <div className="login-logo">
            <img src="/upload/vora_purple_black.png" alt="Vora Logo" style={{ width: "105px", height: "40px" }} />
          </div>
          <div className="mb-3 text-center">
            <FontAwesomeIcon icon={faUser} />
            <input
              type="text"
              className="input-form"
              id="username"
              name="username"
              placeholder="아이디"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-5 text-center">
            <FontAwesomeIcon icon={faLock} />
            <input
              type="password"
              className="input-form"
              id="password"
              name="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-check text-start my-3 d-flex justify-content-around mb-3">
            <div className="item">
              <input
                className="form-check-input"
                type="checkbox"
                name="remember-id"
                id="remember-id-check"
                checked={rememberId}
                onChange={() => setRememberId(!rememberId)}
              />
              <label className="form-check-label" htmlFor="remember-id-check">
                아이디 저장
              </label>
            </div>
            <div className="item">
              <input
                className="form-check-input"
                type="checkbox"
                name="remember-me"
                id="remember-me-check"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
              />
              <label className="form-check-label" htmlFor="remember-me-check">
                자동 로그인
              </label>
            </div>
          </div>
          {/* 로그인 에러 메시지 */}
          {error && <p className="text-center text-danger">아이디 또는 비밀번호를 잘못 입력했습니다.</p>}
          <div className="text-center">
            <button type="submit" className="btn btn-purple">
              로그인
            </button>
            <Link to="/join" className="btn btn-white">
              회원가입
            </Link>
          </div>
        </div>
      </section>
    </form>

    </div>
  )
}

export default LoginForm