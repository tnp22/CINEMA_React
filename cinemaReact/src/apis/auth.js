import api from './api'

// 회원가입
export const join = (data) => api.post(`/join`, data,{
  headers: {
    'Content-Type': 'application/json'
  }
});

// 로그인
export const login = (username, password) => { 
                      return api.get(`/login?username=${username}&password=${password}`) 
                    }

// 회원 정보
export const info = () => api.get(`/users/info`)

// 회원 정보 수정
export const update = (data) => api.put(`/users`, data)

// 회원 탈퇴
export const remove = (username) => api.delete(`/users/${username}`)

// 중복 확인
export const check = (username) => api.get(`/check/${username}`)

export const profileUpdate = (formData, headers) => api.post(`/usersss/mypageImageUpdate`, formData, headers)
