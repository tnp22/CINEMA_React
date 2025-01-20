import React, { useState, useEffect, useContext } from "react";
import { LoginContext } from '../../contexts/LoginContextProvider';
import { useNavigate, Link } from 'react-router-dom'; // React Router 사용
import './MyPageForm.css';
import * as Swal from "../../apis/alert";
import { getMyPage, checkPassword } from "../../apis/my"; // API 호출 함수 임포트

const MyPageForm = () => {
  const { userInfo, login } = useContext(LoginContext);
  const [password, setPassword] = useState(""); // 비밀번호 상태
  const [error, setError] = useState(false); // 에러 상태
  const [userData, setUserData] = useState(null); // 사용자 데이터 상태
  const navigate = useNavigate(); // useNavigate 훅 사용

  useEffect(() => {
    // 컴포넌트 마운트 시 사용자 정보 가져오기
    const fetchUserData = async () => {
      try {
        const response = await getMyPage();
        setUserData(response.data);
      } catch (error) {
        console.error("사용자 정보 가져오기 중 오류 발생:", error);
        Swal.alert("오류", "사용자 정보를 가져오는 데 실패했습니다.", "error");
      }
    };

    fetchUserData();
  }, []);

  // 비밀번호 입력 값 처리
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // 비밀번호 제출 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      Swal.alert("비밀번호 입력", "비밀번호를 입력해주세요.", "warning");
      return;
    }

    try {
      // 비밀번호 검증 후 페이지 이동
      const response = await checkPassword(password);
      if (response.status === 200) {
        navigate("/mypageedit");
      } else {
        Swal.alert(response.data.message, "error");
        setError(true); // 서버 오류 시 오류 상태 true
      }
    } catch (error) {
      console.error("비밀번호 확인 중 오류 발생:", error);
      Swal.alert("오류", "비밀번호 확인에 실패했습니다.", "error");
      setError(true); // 서버 오류 시 오류 상태 true
    }
  };

  // 취소 버튼 처리
  const handleCancel = () => {
    setPassword(""); // 비밀번호 초기화
    setError(false); // 에러 상태 초기화
  };

  if (!userData) {
    return <p>로딩 중...</p>;
  }

  return (
    <div className="mypage-page-wrapper">
      <div className="mypage-container">
        {/* Header Section */}
        <div className="mypage-header">
          <div className="mypage-profile-image-container">
            <img
              id="mypage-profileImage"
              src={userData.orifile ? `/api/files/img?id=${userData.orifile.id}` : "/api/files/image?id=C:/upload/normal.png"}
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
            <h2>{`${userData.username}님, 반갑습니다.`}</h2>
          </div>
          <div className="mypage-user-stats">
            <span>
              시청한 영화: <strong>{userData.movieCount || 0}</strong>
            </span>
            <span>
              리뷰: <strong>{userData.reviewCount || 0}</strong>
            </span>
          </div>
        </div>

        {/* Main Section */}
        <div className="mypage-main">
          <div className="mypage-sidebar">
            <ul>
              <li><Link to="/mypageedit">나의 정보</Link></li>
              <li><Link to="/mypagereservationlist">예매 내역</Link></li>
              <li><Link to="/user/myInquiry/inquiries">문의 내역</Link></li>
            </ul>
          </div>

          {/* Content */}
          <div className="mypage-content">
            <div className="mypage-profile-section">
              <div className="mypage-logo-and-upload">
                <div className="mypage-logo-container" style={{ marginRight: "auto", display: "flex", justifyContent: "center" }}>
                  <img
                    id="mypage-profileImage"
                    src={userData.orifile ? `/api/files/img?id=${userData.orifile.id}` : "/api/files/image?id=C:/upload/normal.png"}
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
                  <button type="button" className="mypage-btn-cancel" onClick={handleCancel}>
                    취소
                  </button>
                  <button type="submit" className="mypage-btn-confirm">
                    확인
                  </button>
                </div>
              </form>

              {/* 오류 메시지 표시 */}
              <div className="mypage-error-message-container">
                <p className={`mypage-error-message ${error ? "active" : ""}`}>
                  비밀번호가 올바르지 않습니다. 다시 시도해주세요.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageForm;