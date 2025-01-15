import React, { useState } from 'react';
import Swal from 'sweetalert2';
import styles from './MyPageEditForm.module.css';

const MyPageEditForm = ({ username, email, orifile, encryptedPassword }) => {
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [file, setFile] = useState(null);

    const validatePasswords = () => {
        if (password !== passwordCheck) {
            setErrorMessage("비밀번호가 다릅니다. 확인해주세요.");
            return false;
        } else {
            setErrorMessage('');
            return true;
        }
    };

    const handleImageChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setFile(e.target.result);
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (validatePasswords()) {
            // 실제 폼 제출 로직 (예: API 호출)
            Swal.fire({
                title: '변경 사항이 저장되었습니다.',
                icon: 'success',
            });
        }
    };

    return (
        <div className={styles.content}>
            <div className={styles.title}>
                <h5 style={{ color: 'white' }}>나의 정보</h5>
            </div>

            {/* 유저 아이디 표시 */}
            <div style={{ marginLeft: '290px', marginTop: '10px' }}>
                <h5 style={{ color: '#6c757d', fontSize: '24px', display: 'inline' }}>
                    {username}
                </h5>
                <span style={{ color: '#6c757d', fontSize: '16px' }}>님</span>
            </div>

            <hr style={{ margin: '20px 290px', border: '1px solid #ddd' }} />

            {/* 프로필 이미지 변경 폼 */}
            <form action="/user/mypageImageUpdate" method="post" encType="multipart/form-data">
                <input type="hidden" name="_csrf" value={window.CSRF_TOKEN} />
                <input type="hidden" name="username" value={username} />
                <div className={styles.logoAndUpload} style={{ marginLeft: '290px' }}>
                    <div className={styles.logoContainer}>
                        <img
                            id="profileImage"
                            src={orifile ? `/img?id=${orifile.id}` : '/image(id="C:/upload/normal.png")'}
                            style={{
                                width: '124px',
                                height: '124px',
                                borderRadius: '50%',
                                objectFit: 'cover',
                                objectPosition: 'center',
                            }}
                            alt="프로필 이미지"
                        />
                    </div>
                    <div className={styles.profileUploadBtn} style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', rowGap: '9px' }}>
                        <label htmlFor="fileInput" className={`${styles.btnPurple} btn`}>
                            이미지 변경
                        </label>
                        <label htmlFor="imageSubmit" className={`${styles.btnPurple} btn`}>
                            변경 확인
                        </label>
                        <input type="file" name="file" id="fileInput" style={{ display: 'none' }} onChange={handleImageChange} />
                        <input type="submit" id="imageSubmit" className={`${styles.btnPurple} btn`} style={{ display: 'none' }} />
                    </div>
                </div>
            </form>

            {/* 마이페이지 기본 정보 수정 폼 */}
            <form id="infoForm" onSubmit={handleSubmit} className="needs-validation" encType="multipart/form-data">
                <input type="hidden" name="_csrf" value={window.CSRF_TOKEN} />

                <div className={styles.divider} />

                {/* 아이디 */}
                <div className="mb-4" id="box-id">
                    <label htmlFor="username" className={styles.formLabel}>아이디</label>
                    <div className="d-flex align-items-center">
                        <input
                            type="text"
                            className={`${styles.formControl} me-2`}
                            id="username"
                            name="username"
                            placeholder="현재 아이디"
                            value={username}
                            readOnly
                        />
                    </div>
                </div>

                {/* 이메일 수정 가능 */}
                <div className="mb-4" id="box-email">
                    <label htmlFor="email" className={styles.formLabel}>이메일</label>
                    <div className="d-flex align-items-center">
                        <input
                            type="email"
                            className={`${styles.formControl} me-2`}
                            id="email"
                            name="email"
                            placeholder="새 이메일을 입력해주세요"
                            value={email}
                            required
                        />
                    </div>
                </div>

                {/* 비밀번호 수정 */}
                <div className="mb-2">
                    <label htmlFor="password" className={styles.formLabel}>새 비밀번호</label>
                    <input
                        type="password"
                        className={styles.formControl}
                        id="password"
                        name="password"
                        placeholder="새 비밀번호를 입력해주세요"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="passwordCheck" className={styles.formLabel}>새 비밀번호 확인</label>
                    <input
                        type="password"
                        className={styles.formControl}
                        id="passwordCheck"
                        placeholder="새 비밀번호를 다시 입력해주세요"
                        required
                        value={passwordCheck}
                        onChange={(e) => setPasswordCheck(e.target.value)}
                    />
                    <p className={styles.alertText}>{errorMessage}</p>
                </div>

                {/* 변경 사항 저장 버튼 */}
                <div style={{ marginBottom: '20px' }}>
                    <button type="submit" className={`${styles.btnPurple} btn`} style={{ width: '125px' }}>
                        저장
                    </button>
                </div>

                {/* 마이페이지 메인으로 돌아가기 버튼 */}
                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                    <a
                        href="/mypage"
                        className={`${styles.btnSecondary} btn`}
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
                    </a>
                </div>

                {/* 아래 간격 추가 */}
                <div style={{ marginBottom: '30px' }} />
            </form>
        </div>
    );
};

export default MyPageEditForm;
