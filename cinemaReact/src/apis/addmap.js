import api from './api';

api.defaults.baseURL = "/api"

// 맵 생성
export const addmap = (data, headers) => api.post('/admin/theater/insert', data, headers)