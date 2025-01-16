import api from './api';
// 기본 URL 설정
api.defaults.baseURL = "/api"


// 영화
export const movieList = (page, size) => api.get(`/admin/movie/list?page=${page}&size=${size}`)
export const movieListSearch = (page, size,search) => api.get(`/admin/movie/list?page=${page}&size=${size}&search=${search}`)
export const movieInsert = (formData, headers) => {
    return api.post('/admin/movie/insert', formData, { headers: headers });
  }
export const movieSelect = (id) => api.get(`/admin/movie/select?id=${id}`)

export const movieUpdate = (formData, headers) => 
    api.post("/admin/movie/update", formData, { headers: headers } )

export const movieStilcutDelete = (stid,id) => api.get(`/admin/movie/stilcutDelete?stilcutId=${stid}&id=${id}`)

export const movieStilcutPlus = (formData, headers) => {
    return api.post('/admin/movie/stilcutPlus', formData, { headers: headers });
  }
export const movieMainPlus = (formData, headers) => {
    return api.post('admin/movie/mainPlus', formData, { headers: headers });
}

// 유저
export const userList = (page, size) => api.get(`/admin/userManager/user/list?page=${page}&size=${size}`)
export const userListSearch = (page, size,search) => api.get(`/admin/userManager/user/list?page=${page}&size=${size}&search=${search}`)

export const userSleep = (username) => api.get(`/admin/userManager/user/sleep?username=${username}`)


