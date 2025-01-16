import api from './api'

export const list = (option,keyword,page) => api.get(`/notice/list?option=${option}&keyword=${keyword}&page=${page}`)
export const select = (id) => api.get(`/notice/select?id=${id}`)