import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as my from '../../apis/my';
import Swal from 'sweetalert2';
import './MyPageEditForm.css';
import { getMyPage, checkPassword } from "../../apis/my"; // API 호출 함수 임포트



const MyPageEditForm = ({ userInfo, updateUser, deleteUser , updateImage}) => {
const [userData, setUserData] = useState(null); // 사용자 데이터 상태
const [mainFile, setMainFile] = useState(null)

  // 정보 수정 
  const onUpdate = (e) => {
    e.preventDefault();

    const form = e.target;
    const username = form.username.value;
    const password = form.password.value;
    const name = form.name.value;
    const email = form.email.value;
    const enabled = userInfo.enabled; // enabled 필드를 포함

    console.log(username, password, name, email, enabled);

    updateUser({ username, password, name, email, enabled });
  };

  const [selectedImage, setSelectedImage] = useState(
    userData?.orifile
      ? `api/files/img?id=${userData?.orifile?.id}`
      : "api/files/image?id=C:/upload/normal.png"
  );

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target.result); // 미리 보기 이미지 설정
      };
      reader.readAsDataURL(file);
      setMainFile(file)
    }
  };
  const fetchUserData = async () => {
        try {
          const response = await getMyPage();
          setUserData(response.data);
        } catch (error) {
          console.error("사용자 정보 가져오기 중 오류 발생:", error);
        }
      };

  const onSumbit = () => {
    const formData = new FormData()

    formData.append('username',userInfo?.username)

    if(mainFile){
        formData.append('file', mainFile)
    }

    const headers = {
        'Content-Type' : 'multipart/form-data'
    }

    updateImage(formData,headers)
  }

  useEffect(() => {
    
    if (userData) {
      setSelectedImage(`api/files/img?id=${userData?.orifile?.id}`);
    }
  }, [userData]);

  useEffect(() => {
    fetchUserData()
  }, [])
  

  return (

    <div>
      <div className="mypageedit-title">
        <h5 style={{ color: 'white' }}>나의 정보</h5>
      </div>
      <div className="container">
      <div style={{marginTop: '10px' }}>
        <h5 style={{ color: '#6c757d', fontSize: '24px', display: 'inline' }}>
          {userInfo.username}
        </h5>
        <span style={{ color: '#6c757d', fontSize: '16px' }}> 님</span>
      </div>

      <div className="mypage-profile-image-container mt-3 d-flex align-items-center">
        {/* 프로필 이미지 및 변경 버튼 */}
      <div
        className="logo-and-upload"
        style={{display: "flex", alignItems: "center" }}
      >
        <div className="logo-container">
          <img
            id="profileImage"
            src={selectedImage}
            style={{
              width: "124px",
              height: "124px",
              borderRadius: "50%",
              objectFit: "cover",
              objectPosition: "center",
            }}
            alt="프로필 이미지"
          />
        </div>

        <div
          className="profile-upload-btn"
          style={{
            marginLeft: "10px",
            display: "flex",
            flexDirection: "column",
            rowGap: "9px",
          }}
        >
          <label htmlFor="fileInput" className="mypageedit-btn-purple" style={{ width: '110px', textAlign: 'center', marginTop:'0' }}>
            이미지 변경
          </label>
          <button htmlFor="imageSubmit" className="mypageedit-btn-purple" onClick={onSumbit} style={{ width: '110px', textAlign: 'center', marginTop:'10px' }}>
            변경 확인
          </button>
          <input
            type="file"
            name="file"
            id="fileInput"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
      </div>
      </div>

      <form className='mypageedit-login-form mt-3' onSubmit={(e) => onUpdate(e)} >
        {/* <div>
                        <label htmlFor="username">username</label>
                        <input type="text"
                            id='username'
                            placeholder='username'
                            name='username'
                            autoComplete='username'
                            required
                            readOnly
                            defaultValue={userInfo?.username}
                        />
                    </div> */}
        <div className="mypageedit-mb-4" id="box-id">
          <label htmlFor="username" className="mypageedit-form-label">아이디</label>
          <div className="mypageedit-d-flex align-items-center">
            <input
              type="text"
              id='username'
              className="mypageedit-form-control form-control me-2"
              style={{ backgroundColor: '#e9ecef', color: '#6c757d' }}
              placeholder='username'
              name='username'
              autoComplete='username'
              required
              readOnly
              defaultValue={userInfo?.username}
            />
          </div>
        </div>

        {/* <div>
            <label htmlFor="email">email</label>
            <input type="email"
              id='email'
              placeholder='email'
              name='email'
              autoComplete='email'
              required
              defaultValue={userInfo?.email} />
          </div> */}
        <div className="mypageedit-mb-4" id="box-email">
          <label htmlFor="email" className="mypageedit-form-label">이메일</label>
          <div className="mypageedit-d-flex align-items-center">
            <input
              type="email"
              className="mypageedit-form-control form-control me-2"
              id='email'
              name='email'
              autoComplete='email'
              placeholder="새 이메일을 입력해주세요"
              required
              defaultValue={userInfo?.email} />
          </div>
        </div>

        {/* <div>
            <label htmlFor="password">password</label>
            <input type="password"
              id='password'
              placeholder="새 비밀번호를 입력해주세요"
              name='password'
              autoComplete='password'
              required />
          </div> */}
        <div className="mypageedit-mb-2">
          <label htmlFor="password" className="mypageedit-form-label">새 비밀번호</label>
          <div className="mypageedit-d-flex align-items-center">
            <input
              type="password"
              className="mypageedit-form-control form-control"
              id='password'
              placeholder="새 비밀번호를 입력해주세요"
              name='password'
              autoComplete='password'
              required
            />
          </div>

        </div>
        <div className="mypageedit-mb-2">
          <label htmlFor="password" className="mypageedit-form-label">이름</label>
          <div className="mypageedit-d-flex align-items-center">
            <input
              type="text"
              className="mypageedit-form-control form-control"
              id='name'
              placeholder='name'
              name='name'
              autoComplete='name'
              defaultValue={userInfo?.name}
              required
            />
          </div>
        </div>

        <div className="mypageedit-btn-container" style={{ marginBottom: '20px' }}>
          <button type="submit" className="mypageedit-btn-purple" style={{ width: '95px' }}>
            정보 수정
          </button>
          </div>
      </form>
      <div>
        <button type="submit" className="mypageedit-btn-purple" style={{ width: '95px' }}
            onClick={() => deleteUser(userInfo.username)}>
            회원 탈퇴
        </button>
      </div>
      

      <form id="infoForm" className="mypageedit-needs-validation" encType="multipart/form-data">
        <div className="mypageedit-divider" />
      </form>

      <div className="mypageedit-btn-container" style={{ textAlign: 'center', marginTop: '20px' }}>
        <Link
          to="/mypage"
          className="mypageedit-btn btn-secondary"
          style={{
            width: '200px',
            backgroundColor: '#6c757d',
            color: 'white',
            textDecoration: 'none',
            padding: '10px',
            display: 'inline-block',
            textAlign: 'center',
            borderRadius: '5px',
          }}
        >
          마이페이지 메인으로
        </Link>
      </div>

      <div style={{ marginBottom: '30px' }} />

      </div>
    </div>


  );
};

export default MyPageEditForm;