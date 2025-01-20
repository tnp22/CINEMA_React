import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './MyPageEditForm3.css';
import * as my from '../../apis/my';
import * as auth from '../../apis/auth';

const MyPageEditForm3 = ({ userInfo, updateUser, deleteUser }) => {
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

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (validatePasswords()) {
            const formData = new FormData();
            formData.append('username', userInfo.username);
            formData.append('email', userInfo.email);
            formData.append('password', password);
            if (file) {
                formData.append('file', file);
            }

            try {
                const response = await my.updateMyPageInfo(formData);
                Swal.fire({
                    title: '변경 사항이 저장되었습니다.',
                    icon: 'success',
                });
            } catch (error) {
                console.error('Error updating user info:', error);
                Swal.fire({
                    title: '저장 중 오류가 발생했습니다.',
                    icon: 'error',
                });
            }
        }
    };

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

    return (
        <div className="userform-form">
            <h2 className="userform-login-title">회원 정보</h2>

            <form className='userform-login-form' onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="hidden" name="username" value={userInfo.username} />
                <div className="userform-logo-and-upload" style={{ marginLeft: '290px' }}>
                    <div className="userform-logo-container">
                        <img
                            id="profileImage"
                            src={userInfo.orifile ? `/api/files/img?id=${userInfo.orifile.id}` : "/api/files/image?id=C:/upload/normal.png"}
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
                    <div className="userform-profile-upload-btn" style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', rowGap: '9px' }}>
                        <label htmlFor="fileInput" className="userform-btn btn-purple">
                            이미지 변경
                        </label>
                        <input type="file" name="file" id="fileInput" style={{ display: 'none' }} onChange={handleImageChange} />
                    </div>
                </div>
            </form>

            <form id="infoForm" onSubmit={onUpdate} className="userform-needs-validation" encType="multipart/form-data">
                <div className="userform-divider" />

                <div className="userform-mb-4" id="box-id">
                    <label htmlFor="username" className="userform-form-label">아이디</label>
                    <div className="userform-d-flex align-items-center">
                        <input
                            type="text"
                            className="userform-form-control me-2"
                            style={{ backgroundColor: '#e9ecef', color: '#6c757d' }}
                            id="username"
                            name="username"
                            placeholder="현재 아이디"
                            value={userInfo.username}
                            readOnly
                        />
                    </div>
                </div>

                <div className="userform-mb-4" id="box-email">
                    <label htmlFor="email" className="userform-form-label">이메일</label>
                    <div className="userform-d-flex align-items-center">
                        <input
                            type="email"
                            className="userform-form-control me-2"
                            id="email"
                            name="email"
                            placeholder="새 이메일을 입력해주세요"
                            value={userInfo.email}
                            required
                            onChange={(e) => setUserInfoState({ ...userInfo, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="userform-mb-2">
                    <label htmlFor="password" className="userform-form-label">새 비밀번호</label>
                    <div className="userform-d-flex align-items-center">
                        <input
                           type="password"
                           className="userform-form-control"
                           id="password"
                           name="password"
                           placeholder="새 비밀번호를 입력해주세요"
                           required
                           value={password}
                           onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="userform-mb-4">
                    <label htmlFor="passwordCheck" className="userform-form-label">새 비밀번호 확인</label>
                    <div className="userform-d-flex align-items-center">
                        <input
                           type="password"
                           className="userform-form-control"
                           id="passwordCheck"
                           placeholder="새 비밀번호를 다시 입력해주세요"
                           required
                           value={passwordCheck}
                           onChange={(e) => setPasswordCheck(e.target.value)}
                        />
                    </div>
                    <p className="userform-alert-text" style={{ color: 'red' }}>{errorMessage}</p>
                </div>

                <div className="userform-btn-container" style={{ marginBottom: '20px' }}>
                    <button type="submit" className="userform-btn-purple" style={{ width: '125px' }}>
                        저장
                    </button>
                </div>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <a
                    href="/mypage"
                    className="userform-btn btn-secondary"
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

            <div style={{ marginBottom: '30px' }} />
        </div>
    );
};

export default MyPageEditForm3;