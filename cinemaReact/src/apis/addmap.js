import axios from 'axios';

axios.defaults.baseURL = "/api"

// 맵 생성
export const addmap = (data, headers) => axios.post('/admin/theater/insert', data, headers)