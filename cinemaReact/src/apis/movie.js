import api from './api'

export const list = async (page = 1, size = 18) => {
    return await api.get('/', {
      params: { page, size }, // 요청 파라미터 추가
    });
};

export const movieChart = (type, page, otherPage) => api.get(`/movie/movieChart?type=${type}&page=${page}&otherPage=${otherPage}`)


