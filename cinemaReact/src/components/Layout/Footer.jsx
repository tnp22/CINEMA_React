import React from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import styles from './Layout.module.css';

const Footer = () => {
  return (
    <footer className={`${styles.footerForm} py-4`}>
      <div className="container">
        <div className="row">
          <div className={`col-12 ${styles.footerLink} mb-3`}>
            <p>회사소개</p>
            <p>지속가능경영</p>
            <p>IR</p>
            <p>채용정보</p>
            <p>이용약관</p>
            <p>개인정보처리방침</p>
            <p>법적고지</p>
            <p>이메일주소무단수집거부</p>
            <p>윤리경영</p>
            <p>사이트맵</p>
          </div>
          <hr />
          <div className={`col-md-10 ${styles.footerInfo}`}>
            <p>(21404) 인천광역시 부평구 부평동 534-48 스테이션 타워</p>
            <p>대표이사: 한성호</p>
            <p>
              사업자등록번호: 640-81-01354 통신판매업신고번호:
              2021-서울서초-2443 대표이메일: voramaster@vora.com
            </p>
            <p>© VORA. All Rights Reserved</p>
          </div>
          <div className="col-md-2 text-end">
            <img
              src="/upload/vora_white.png"
              alt="VORA Logo"
              style={{ width: "105px", height: "40px" }}
            />
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer