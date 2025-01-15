import React, { useContext, useState } from "react";
import { LoginContext } from '../../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom'; // React Router 사용
import styles from './MyPageForm.module.css'; // CSS Module을 import
import * as auth from "../../apis/auth";
import * as Swal from "../../apis/alert";

const MyPageForm = () => {
  const { userInfo, logout } = useContext(LoginContext);
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); // useNavigate 훅 사용

  const handlePasswordChange = (e) => setPassword(e.target.value);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password) {
      Swal.alert("비밀번호 입력", "비밀번호를 입력해주세요.", "warning");
      return;
    }

    try {
      const response = await auth.verifyPassword(password);
      if (response.status === 200) {
        Swal.alert("인증 성공", "회원 정보를 수정할 수 있습니다.", "success");
        // 비밀번호가 올바르면 /user 경로로 이동
        navigate("/user");
      } else {
        Swal.alert("인증 실패", "비밀번호가 올바르지 않습니다.", "error");
      }
    } catch (error) {
      console.error("비밀번호 확인 중 오류 발생:", error);
      Swal.alert("오류", "비밀번호 확인에 실패했습니다.", "error");
    }
  };

  const handleCancel = () => setPassword("");

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.mypageContainer}>
        {/* Header Section */}
        <div className={styles.mypageHeader}>
          <div className={styles.profileImageContainer}>
            <img
              id="profileImage"
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
          <div className={styles.textSection}>
            <h2>{`${userInfo.username}님, 반갑습니다.`}</h2>
          </div>
          <div className={styles.userStats}>
            <span>
              시청한 영화: <strong>{userInfo.movieCount || 0}</strong>
            </span>
            <span>
              리뷰: <strong>{userInfo.reviewCount || 0}</strong>
            </span>
          </div>
        </div>

        {/* Main Section */}
        <div className={styles.mypageMain}>
          {/* Sidebar */}
          <div className={styles.mypageSidebar}>
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
          <div className={styles.mypageContent}>
            <div className={styles.profileSection}>
              {/* 프로필 이미지 */}
              <div className={styles.logoContainer}>
                <img
                  id="profileImage"
                  src={
                    userInfo.orifile
                      ? `/api/files/img?id=${userInfo.orifile.id}`
                      : "/api/image?id=C:/upload/normal.png"
                  }
                  alt="프로필 이미지"
                  className={styles.profileImage}
                />
              </div>
              <p>회원 정보를 수정하려면 비밀번호를 다시 입력해주세요.</p>
              <form id="passwordForm" onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="비밀번호 입력"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>
                <div className={styles.formButtons}>
                  <button
                    type="button"
                    className={styles.btnCancel}
                    onClick={handleCancel}
                  >
                    취소
                  </button>
                  <button type="submit" className={styles.btnConfirm}>
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
