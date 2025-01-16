import api from './api';


// DateSelection 불러오기
export const dateSelection = (movieId, headers) => api.get(`/movie/dateSelection?id=${movieId}`, headers)

export const seatSelection = (theaterListId,person, headers) => api.get(`/movie/seatSelection?theaterListId=${theaterListId}&person=${person}`, headers)