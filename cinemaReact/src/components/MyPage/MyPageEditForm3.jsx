import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import './MyPageEditForm3.css';
import * as my from '../../apis/my';
import * as auth from '../../apis/auth';

const MyPageEditForm3 = ({ username, email, orifile, encryptedPassword }) => {
    const [userInfo, setUserInfo] = useState({ username: '', email: '', orifile: null });
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const response = await my.getUserInfo();
                setUserInfo(response.data);
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        };
        fetchUserInfo();
    }, []);

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

    return (
        <div className="mypageedit-content">
            <div className="mypageedit-title">
                <h5 style={{ color: 'white' }}>나의 정보</h5>
            </div>

            <div style={{ marginLeft: '290px', marginTop: '10px' }}>
                <h5 style={{ color: '#6c757d', fontSize: '24px', display: 'inline' }}>
                    {userInfo.username}
                </h5>
                <span style={{ color: '#6c757d', fontSize: '16px' }}>님</span>
            </div>

            <hr style={{ margin: '20px 290px', border: '1px solid #ddd' }} />

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input type="hidden" name="username" value={userInfo.username} />
                <div className="mypageedit-logo-and-upload" style={{ marginLeft: '290px' }}>
                    <div className="mypageedit-logo-container">
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
                    <div className="mypageedit-profile-upload-btn" style={{ marginLeft: '10px', display: 'flex', flexDirection: 'column', rowGap: '9px' }}>
                        <label htmlFor="fileInput" className="mypageedit-btn btn-purple">
                            이미지 변경
                        </label>
                        <input type="file" name="file" id="fileInput" style={{ display: 'none' }} onChange={handleImageChange} />
                    </div>
                </div>
            </form>

            <form id="infoForm" onSubmit={handleSubmit} className="mypageedit-needs-validation" encType="multipart/form-data">
                <div className="mypageedit-divider" />

                <div className="mypageedit-mb-4" id="box-id">
                    <label htmlFor="username" className="mypageedit-form-label">아이디</label>
                    <div className="mypageedit-d-flex align-items-center">
                        <input
                            type="text"
                            className="mypageedit-form-control me-2"
                            style={{ backgroundColor: '#e9ecef', color: '#6c757d' }}
                            id="username"
                            name="username"
                            placeholder="현재 아이디"
                            value={userInfo.username}
                            readOnly
                        />
                    </div>
                </div>

                <div className="mypageedit-mb-4" id="box-email">
                    <label htmlFor="email" className="mypageedit-form-label">이메일</label>
                    <div className="mypageedit-d-flex align-items-center">
                        <input
                            type="email"
                            className="mypageedit-form-control me-2"
                            id="email"
                            name="email"
                            placeholder="새 이메일을 입력해주세요"
                            value={userInfo.email}
                            required
                            onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
                        />
                    </div>
                </div>

                <div className="mypageedit-mb-2">
                    <label htmlFor="password" className="mypageedit-form-label">새 비밀번호</label>
                    <div className="mypageedit-d-flex align-items-center">
                        <input
                            type="password"
                            className="mypageedit-form-control"
                            id="password"
                            name="password"
                            placeholder="새 비밀번호를 입력해주세요"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                </div>

                <div className="mypageedit-mb-4">
                    <label htmlFor="passwordCheck" className="mypageedit-form-label">새 비밀번호 확인</label>
                    <div className="mypageedit-d-flex align-items-center">
                        <input
                            type="password"
                            className="mypageedit-form-control"
                            id="passwordCheck"
                            placeholder="새 비밀번호를 다시 입력해주세요"
                            required
                            value={passwordCheck}
                            onChange={(e) => setPasswordCheck(e.target.value)}
                        />
                    </div>
                    <p className="mypageedit-alert-text" style={{ color: 'red' }}>{errorMessage}</p>
                </div>

                <div className="mypageedit-btn-container" style={{ marginBottom: '20px' }}>
                    <button type="submit" className="mypageedit-btn-purple" style={{ width: '125px' }}>
                        저장
                    </button>
                </div>
            </form>

            <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <a
                    href="/mypage"
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
                </a>
            </div>

            <div style={{ marginBottom: '30px' }} />
        </div>
    );
};

export default MyPageEditForm3;
