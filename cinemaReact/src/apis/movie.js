import api from './api'

// 목록
export const list = async (page = 1, size = 18) => {
    return await api.get('/', {
      params: { page, size }, // 요청 파라미터 추가
    });
};


