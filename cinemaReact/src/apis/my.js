import api from './api';

// 마이페이지 조회
export const getMyPage = () => api.get('/usersss/mypage');

// 마이페이지 비밀번호 확인
export const checkPassword = (password) => api.get(`/usersss/checkMypage?password=${password}`);

// 마이페이지 업데이트 조회
export const getMyPageUpdate = () => api.get('/usersss/mypageUpdate');

// 이미지 업데이트
export const updateProfileImage = (formData) => api.post('/usersss/mypageImageUpdate', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// 마이페이지 정보 수정
export const updateMyPageInfo = (formData) => api.post('/usersss/mypageUpdate', formData, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});
