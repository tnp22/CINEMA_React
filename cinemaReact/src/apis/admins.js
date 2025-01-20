import api from './api';
// 기본 URL 설정
api.defaults.baseURL = "/api"


//출연진
export const castList = (page, size) => api.get(`/admin/cast/list?page=${page}&size=${size}`)
export const castListSearch = (page, size,search) => api.get(`/admin/cast/list?page=${page}&size=${size}&search=${search}`)

export const castSelect = (id) => api.get(`admin/cast/select/${id}`)


export const castInsert = (formData, headers) => {
  return api.post('admin/cast/insert', formData, { headers: headers });
}

export const castUpdateGet = (id) => 
  api.get(`admin/cast/update?id=${id}` )
export const castUpdateGetSearch = (id,search) => 
  api.get(`admin/cast/update?id=${id}&search=${search}` )

export const castUpdate = (formData, headers) => 
  api.post("admin/cast/update", formData, { headers: headers } )

export const castDelete = (id) => 
  api.get(`admin/cast/delete?id=${id}` )

//배너
export const bannerList = () => api.get(`/admin/banner/list`)
export const bannerSelect = (id) => api.get(`admin/banner/select?id=${id}`)

export const bannerInsertGet = () => 
  api.get(`admin/banner/insert` )
export const bannerInsertGetSearch = (search) => 
  api.get(`admin/banner/insert?search=${search}` )

export const bannerInsert = (formData, headers) => {
  return api.post('admin/banner/insert', formData, { headers: headers });
}

export const bannerUpdateGet = (id) => 
  api.get(`admin/banner/update?id=${id}` )
export const bannerUpdateGetSearch = (id,search) => 
  api.get(`admin/banner/update?id=${id}&search=${search}` )

export const bannerUpdate = (formData, headers) => 
  api.post("admin/banner/update", formData, { headers: headers } )

export const bannerDelete = (id) => 
  api.get(`admin/banner/delete?id=${id}` )

// 영화관
export const cinemaList = (page, size) => api.get(`/admin?page=${page}&size=${size}`)
export const cinemaListSearch = (page, size,search) => api.get(`/admin?page=${page}&size=${size}&search=${search}`)

export const cinemaInsertGet = () => 
  api.get(`admin/cinema/insert` )
export const cinemaInsert = (formData, headers) => {
  return api.post('admin/cinema/insert', formData, { headers: headers });
}
export const cinemaSelect = (id) => api.get(`admin/cinema/select/${id}`)

export const cinemaUpdateGet = (id) => 
  api.get(`admin/cinema/update/${id}` )

export const cinemaUpdate = (formData, headers) => 
  api.post("/admin/cinema/update", formData, { headers: headers } )

export const cinemaMainPlus = (formData, headers) => {
  return api.post('admin/cinema/mainPlus', formData, { headers: headers });
}

// 상영관
export const theaterList = (page, size,id) => api.get(`/admin/cinema/enter?page=${page}&size=${size}&id=${id}`)



// 상영리스트
export const theaterListList = (page, size,id) => api.get(`/admin/theaterList/list?page=${page}&size=${size}&id=${id}`)
export const theaterListListSearch = (page, size,id,search) => api.get(`/admin/theaterList/list?page=${page}&size=${size}&id=${id}&search=${search}`)

export const theaterListInsertGet = (id) => 
  api.get(`admin/theaterList/insert?id=${id}` )
export const theaterListInsertGetSearch = (id,search) => 
  api.get(`admin/theaterList/insert?id=${id}&search=${search}` )

export const theaterListInsert = (formData, headers) => {
  return api.post('admin/theaterList/insert', formData, { headers: headers });
}

export const theaterListSelect = (id,theaterListId) => api.get(`admin/theaterList/select?id=${id}&theaterListId=${theaterListId}`)

export const theaterListUpdateGet = (id,theaterListId) => 
  api.get(`admin/theaterList/update?id=${id}&theaterListId=${theaterListId}` )
export const theaterListUpdateGetSearch = (id,theaterListId,search) => 
  api.get(`admin/theaterList/update?id=${id}&theaterListId=${theaterListId}&search=${search}` )

export const theaterListUpdate = (formData, headers) => 
  api.post("/admin/theaterList/update", formData, { headers: headers } )

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

export const userSelect = (id) => api.get(`admin/userManager/user/select?username=${id}`)

export const userUpdateGet = (id) => 
  api.get(`admin/userManager/user/update?username=${id}` )

export const userUpdate = (formData, headers) => 
  api.post("admin/userManager/user/update", formData, { headers: headers } )

export const userAuthDelete = (id,no) => 
  api.get(`admin/userManager/user/authDelete?username=${id}&no=${no}` )

export const userAuthPlus = (formData, headers) => {
  return api.post('admin/userManager/user/authPlus', formData, { headers: headers });
}

//권한
export const authList = (page, size) => api.get(`/admin/userManager/auth/list?page=${page}&size=${size}`)
export const authListSearch = (page, size,search) => api.get(`/admin/userManager/auth/list?page=${page}&size=${size}&search=${search}`)

export const authPlus = (formData, headers) => {
  return api.post('admin/userManager/auth/insert', formData, { headers: headers });
}

export const authDelete = (no) => 
  api.get(`admin/userManager/auth/delete?no=${no}` )

// 공지사항
export const noticeList = (page, size) => api.get(`/admin/notice/list?page=${page}&size=${size}`)
export const noticeListSearch = (page, size,search) => api.get(`/admin/notice/list?page=${page}&size=${size}&search=${search}`)

export const noticeSelect = (id) => api.get(`/admin/notice/select?id=${id}`)

export const noticeInsert = (data) => api.post(`/admin/notice/insert`, data,{
  headers: {
    'Content-Type': 'application/json'
  }
});

export const noticeUpdate = (data) => api.post(`/admin/notice/update`, data,{
  headers: {
    'Content-Type': 'application/json'
  }
});

export const noticeDelete = (id) => api.get(`/admin/notice/delete?id=${id}`)

// 리뷰
export const reviewList = (page, size) => api.get(`/admin/reviewManager/list?page=${page}&size=${size}`)
export const reviewListSearch = (page, size,search) => api.get(`/admin/reviewManager/list?page=${page}&size=${size}&search=${search}`)

export const reviewDelete = (id) => api.get(`/admin/reviewManager/delete?id=${id}`)

