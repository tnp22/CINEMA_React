import React, { useContext, useState } from "react";
import { LoginContext } from '../../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom'; // React Router 사용
import './MyPageForm.css';
import * as auth from "../../apis/auth";
import * as Swal from "../../apis/alert";

const MyPageForm = () => {
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const navigate = useNavigate(); // 라우팅
  const { userInfo } = useContext(LoginContext); // 사용자 정보
  
  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      Swal.alert("비밀번호 입력", "비밀번호를 입력해주세요.", "warning");
      return;
    }

    try {
      const response = await auth.verifyPassword(password); // 비밀번호 검증
      if (response.status === 200) {
        Swal.alert("인증 성공", "회원 정보를 수정할 수 있습니다.", "success");
        navigate("/mypageedit"); // 인증 성공 시 이동
      } else {
        Swal.alert("인증 실패", "비밀번호가 올바르지 않습니다.", "error");
      }
    } catch (error) {
      console.error("비밀번호 확인 중 오류 발생:", error);
      Swal.alert("오류", "비밀번호 확인에 실패했습니다.", "error");
    }
  };

  const handleCancel = () => setPassword(""); // 입력 초기화

  return (
    <div className="mypage-page-wrapper">
      <div className="mypage-container">
        {/* Header Section */}
        <div className="mypage-header">
          <div className="mypage-profile-image-container">
            <img
              id="mypage-profileImage"
              src={
                userInfo.orifile
                  ? `/api/files/img?id=${userInfo.orifile.id}`
                  : "/api/files/image?id=C:/upload/normal.png"

              }
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
          <div className="mypage-text-section">
            <h2>{`${userInfo.username}님, 반갑습니다.`}</h2>
          </div>
          <div className="mypage-user-stats">
            <span>
              시청한 영화: <strong>{userInfo.movieCount || 0}</strong>
            </span>
            <span>
              리뷰: <strong>{userInfo.reviewCount || 0}</strong>
            </span>
          </div>
        </div>

        {/* Main Section */}
        <div className="mypage-main">
          {/* Sidebar */}
          <div className="mypage-sidebar">
            <ul>
              <li>
                <a href="/mypageedit">나의 정보</a>
              </li>
              <li>
                <a href="/mypagereservationlist">예매 내역</a>
              </li>
              <li>
                <a href="/user/myInquiry/inquiries">문의 내역</a>
              </li>
            </ul>
          </div>


          {/* Content */}
          <div className="mypage-content">
            <div className="mypage-profile-section">
              {/* 프로필 이미지 */}
              <div className="mypage-logo-and-upload">
                <div
                  className="mypage-logo-container"
                  style={{ marginRight: "auto", display: "flex", justifyContent: "center" }}
                >
                  <img
                    id="mypage-profileImage"
                    src={
                      userInfo.orifile
                        ? `/api/files/img?id=${userInfo.orifile.id}`
                        : "/api/files/image?id=C:/upload/normal.png"
                    }
                    alt="프로필 이미지"
                    style={{
                      width: "124px",
                      height: "124px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      objectPosition: "center",
                    }}
                  />
                </div>
              </div>
              {/* 텍스트와 입력 필드 */}
              <p>회원 정보를 수정하려면 비밀번호를 다시 입력해주세요.</p>
              <form id="mypage-passwordForm" onSubmit={handleSubmit}>
                <div className="mypage-form-group">
                  <input
                    type="password"
                    id="mypage-password"
                    name="password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className="mypage-form-buttons">
                  <button
                    type="button"
                    className="mypage-btn-cancel"
                    onClick={handleCancel}
                  >
                    취소
                  </button>
                  <button type="submit" className="mypage-btn-confirm">
                    확인
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageForm;
