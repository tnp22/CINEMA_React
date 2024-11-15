import React, { useState } from 'react'
import './JoinForm.css'
import * as auth from '../../apis/auth'

const JoinForm = ({join}) => {

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validationState, setValidationState] = useState("mb-4");
  
  // 가입하기 클릭
  const onJoin = async (e) => {
    e.preventDefault()  // submit 기본 동작 방지
    console.log('시이작')

    console.log(username, password, name, email);
    const formData = {
      "username" : username,
      "password" : password,
      "name" : name,
      "email" : email
    }

    const isIdAvailable = await check(username);

    if (!isIdAvailable){
      alert("아이디가 중복되었습니다.");
      return;
    } 

    if (!validatePasswords()) {
      alert("비밀번호를 다시 확인해주세요.");
      return;
    }
    console.dir(formData)
    join(formData)
  }
  
  


  const validatePasswords = () => {
    console.log(password)
    console.log(passwordCheck)
    if (password !== passwordCheck) {
      setErrorMessage("비밀번호가 다릅니다. 확인해주세요.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  // 중복 확인
  const check = async ( username ) => {
    console.log(username);

    let response
    let data
    try {
      response = await auth.check(username)
    } catch (error) {
      console.log(error);
      console.error(`중복확인 중 에러가 발생하였습니다.`);
      return
    }
    
    data = response.data
    const status = response.status
    console.log(`data : ${data}`);
    console.log(`status : ${status}`);
    if(data === true){
      setValidationState('was-validated mb-4');  // 'was-validated' 클래스를 적용
      return true;
    }else{
      setValidationState('is-invalid'); 
      return false;
    }
  }

  return (
    <form id="form" className="join-form" onSubmit={(e) => onJoin(e)}>
      <div className="title">
        <h5 style={{ color: "white" }}>회원가입</h5>
      </div>
      <div className="form-container">
        <div className="text-center mb-5">
          <img src="/upload/vora_purple_black.png" alt="Logo" style={{ width: "105px", height: "40px" }} />
        </div>
        <div className="mb-4">
          <label htmlFor="name" className="form-label">
            이름
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            placeholder="이름을 입력해주세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={`${validationState}`} id="box-id">
          <label htmlFor="username" className="form-label">
            아이디
          </label>
          <div className="d-flex align-items-center">
            <input
              type="text"
              className="form-control me-2"
              style={{ flex: 1 }}
              id="username"
              name="username"
              placeholder="아이디를 입력해주세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <button
              type="button"
              className="btn btn-secondary"
              style={{ flex: "0 0 20%" }}
              onClick={() => check(username)}
            >
              중복확인
            </button>
          </div>
          
        </div>
        <div className="invalid-feedback mb-4">
          <p className="alert-text" style={{ color: "red" }}>
            중복된 아이디입니다.
          </p>
          </div>
        <div className="mb-2">
          <label htmlFor="password" className="form-label">
            비밀번호
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            name="password"
            placeholder="설정하실 비밀번호를 입력해주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            className="form-control"
            id="passwordCheck"
            placeholder="설정하실 비밀번호를 다시 입력해주세요"
            value={passwordCheck}
            onBlur={validatePasswords}
            onChange={(e) => setPasswordCheck(e.target.value)}
            required
          />
          <p className="alert-text" style={{ color: "red" }}>
            {errorMessage}
          </p>
        </div>
        <div className="mb-5">
          <label htmlFor="email" className="form-label">
            이메일
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder="등록하실 이메일을 입력해주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="text-center">
          <button type="submit" style={{ width: "150px" }} className="btn btn-purple">
            회원 가입
          </button>
        </div>
      </div>
    </form>
  )
}

export default JoinForm