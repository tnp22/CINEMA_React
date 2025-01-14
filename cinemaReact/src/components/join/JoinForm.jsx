import React, { useState } from 'react'
import './JoinForm.css'

const JoinForm = ({join}) => {
  
  // 가입하기 클릭
  const onJoin = async (e) => {
    e.preventDefault()  // submit 기본 동작 방지
    const form = e.target
    const username = form.username.value
    const password = form.password.value
    const name = form.name.value
    const email = form.email.value

    console.log(username, password, name, email);

    const isIdAvailable = await checkId(false);

    if (!isIdAvailable) return;

    if (!validatePasswords()) {
      alert("비밀번호를 다시 확인해주세요.");
      return;
    }

    join({username, password, name, email})
  }
  
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validatePasswords = () => {
    if (password !== passwordCheck) {
      setErrorMessage("비밀번호가 다릅니다. 확인해주세요.");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const checkId = async (alertEnabled = true) => {
    if (!username) {
      alert("아이디를 입력해주세요");
      return false;
    }

    try {
      const response = await fetch(`/check/${username}`, {
        method: "GET",
        headers: {
          "X-CSRF-TOKEN": "your-csrf-token", // 적절히 설정
        },
      });

      if (response.ok) {
        const result = await response.text();
        if (result === "true") {
          if (alertEnabled) alert("사용 가능한 아이디입니다.");
          setIsUsernameValid(true);
          return true;
        } else {
          alert("중복된 아이디입니다.");
          setIsUsernameValid(false);
          return false;
        }
      } else {
        alert("아이디 중복 확인 중 오류가 발생했습니다.");
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      alert("아이디 중복 확인 중 오류가 발생했습니다.");
      return false;
    }
  };

  return (
    <form id="form" className="needs-validation" onSubmit={() => onJoin(e)}>
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
        <div className="mb-4" id="box-id">
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
              onClick={() => checkId(true)}
            >
              중복확인
            </button>
          </div>
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