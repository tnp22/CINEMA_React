import api from './api'

export const list = (option,keyword,page) => api.get(`/inquiry/list?option=${option}&keyword=${keyword}&page=${page}`)
export const myList = (option,keyword,page,username) => api.get(`/usersss/myInquiry/inquiries?option=${option}&keyword=${keyword}&page=${page}&username=${username}`)

export const select = (id) => api.get(`/inquiry/select/${id}`)
export const mySelect = (id) => api.get(`/usersss/myInquiry/select/${id}`)

export const selectPassword = (id,password) => api.get(`/inquiry/select/${id}/${password}`)

export const insert = (data) => api.post(`/inquiry/insert`, data,{
  headers: {
    'Content-Type': 'application/json'
  }
});
export const myInsert = (data) => api.post(`/usersss/myInquiry/insert`, data,{
  headers: {
    'Content-Type': 'application/json'
  }
});

export const update = (data) => api.put(`/inquiry/update`, data,{
  headers: {
    'Content-Type': 'application/json'
  }
});
export const myUpdate = (data) => api.put(`/usersss/myInquiry/update`, data,{
  headers: {
    'Content-Type': 'application/json'
  }
});

export const remove = (id) => api.delete(`/inquiry/delete?id=${id}`)
export const myRemove = (id) => api.delete(`/usersss/myInquiry/delete?id=${id}`)

export const replyUpdate = (data) => api.put(`/inquiry/replyUpdate`, data,{
    headers: {
      'Content-Type': 'application/json'
    }
  });

export const replyRemove = (id) => api.delete(`/inquiry/replyDelete?id=${id}`)