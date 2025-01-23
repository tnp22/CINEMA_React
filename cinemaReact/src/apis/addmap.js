import api from './api';

api.defaults.baseURL = "/api"

// 맵 생성
export const addmap = (id,data, headers) => api.post(`/admin/theater/insert?id=${id}`, data, headers)

// 맵 생성
export const updatemap = (id,data, headers) => api.post(`/admin/theater/update?id=${id}`, data, headers)

// 맵 불러오기
export const readMap = (id,theaterId, headers) => api.get(`/admin/theater/select?id=${id}&theaterId=${theaterId}`, headers)