import api from './api';


// DateSelection 불러오기
export const dateSelection = (movieId, headers) => api.get(`/movie/dateSelection?id=${movieId}`, headers)

export const seatSelection = (theaterListId,person, headers) => api.get(`/movie/seatSelection?theaterListId=${theaterListId}&person=${person}`, headers)

export const moviePayment = (data, headers) => api.post(`/movie/payment`,data,headers)

export const GETPayment = (headers) => api.get(`/movie/payment`,headers)

export const GETPayment2 = (reserveId, headers) => api.get(`/movie/payment?id=${reserveId}`,headers)

export const remove = (reserveId, headers) => api.delete(`/movie/delete?id=${reserveId}`,headers)

export const rsList = (username, headers) => api.get(`/movie/rsList?usesname=${username}`,headers)

export const rsList2 = (username,page, headers) => api.get(`/movie/rsList?usesname=${username}&page=${page}`,headers)

export const hanbul = (data,headers) => api.post(`https://api.iamport.kr/payments/cancel`,data,headers)


