import React from 'react'
import { Link } from 'react-router-dom'

const AdminHeader = () => {

// localStorage에서 userInfo 가져오기
  const userInfoStorage = localStorage.getItem("userInfo");
    let username = '';
    if (userInfoStorage) {
        // JSON 문자열을 객체로 변환
        const userInfo = JSON.parse(userInfoStorage);
  
        // isAdmin 값만 변수로 추출
        username = userInfo.name;
    } else {
    console.log("userInfoStorage 없습니다.");
    }

  return (
    <div>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'start' }}>
      <Link style={{ marginRight: '30px' }} to={`/`}>
        <img src="/upload/vora_purple_black.png" alt="Logo" style={{ width: '105px', height: '40px' }} />
      </Link>
      <h1>
        <Link to={`/admin`}>
          ADMINISTRATOR : <span className="adminTitle">{username}</span>
        </Link>
      </h1>
    </div>
    <hr className="ms-0" style={{ width: '700px' }} />
  </div>
  )
}

export default AdminHeader