import axios from 'axios';
// 기본 URL 설정
axios.defaults.baseURL = "/api"

export const movieList = (page, size) => axios.get(`/admin/movie/list?page=${page}&size=${size}`)
export const movieListSearch = (page, size,search) => axios.get(`/admin/movie/list?page=${page}&size=${size}&search=${search}`)
export const movieInsert = (formData, headers) => axios.post("/boards", formData, headers )
// 조회
export const movieSelect = (id) => axios.get(`/admin/movie/select?id=${id}`)

export const movieUpdate = (formData, headers) => axios.put("/boards", formData, headers )

// 삭제
export const movieRemove = (id) => axios.delete(`/boards/${id}`)