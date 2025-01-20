import api from './api';

api.defaults.baseURL = "/api"

// 맵 생성
export const addmap = (data, headers) => api.post('/admin/theater/insert', data, headers)

// 맵 생성
export const updatemap = (data, headers) => api.post('/admin/theater/update', data, headers)

// 맵 불러오기
export const readMap = (theaterId, headers) => api.get(`/admin/theater/select?id=${theaterId}`, headers)