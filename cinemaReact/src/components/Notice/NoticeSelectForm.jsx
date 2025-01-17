import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import './NoticeSelectForm.css'

const NoticeSelectForm = ({notice, before, after}) => {
    if (!notice) {
        return <div>Loading...</div>;
      }
  return (
    
    <div>
      <div className="title" style={{ marginBottom: '80px' }}>
        <h5 style={{ color: 'white' }}>공지사항</h5>
      </div>
      <div className="container mb-3" style={{ minHeight: '200px' }}>
        <div
          className="d-flex justify-content-between p-3 select-notice-title"
          style={{ backgroundColor: 'rgb(243, 243, 243)', borderTop: '1px solid gray' }}
        >
          <h5>{notice.title}</h5>
          <div className="d-flex">
            <h6 className="me-3">{`등록일 : ${new Date(notice.regDate).toLocaleDateString()}`}</h6>
            <h6>{`조회수 : ${notice.view}`}</h6>
          </div>
        </div>
        <p
          className="p-3 notice-content mb-4"
          style={{ whiteSpace: 'pre-wrap', borderBottom: '1px solid gray' }}
        >
          {notice.content}
        </p>
        <div className="mb-4 d-flex justify-content-end">
            <Link to={`/notice/list`} className="btn select-list-btn">목록</Link>
        </div>
      </div>
      <div className="container" style={{ marginBottom: '80px' }}>
        {before ? (
          <div className="d-flex notice-bottom before align-items-center">
            <p className="mb-0">이전글</p>
            <i className="fa-solid fa-caret-up fs-4"></i>
            <Link to={`/notice/select?id=${before.id}`} className='notice-link'>{before.title}</Link>
          </div>
        ) : (
          <div className="d-flex notice-bottom before align-items-center">
            <p className="mb-0">이전글</p>
            <i className="fa-solid fa-caret-up fs-4"></i>
            <span>이전 글이 없습니다</span>
          </div>
        )}
        {after ? (
          <div className="d-flex notice-bottom after">
            <p className="mb-0">이후글</p>
            <i className="fa-solid fa-caret-down fs-4"></i>
            <Link to={`/notice/select?id=${after.id}`} className='notice-link'>{after.title}</Link>
          </div>
        ) : (
          <div className="d-flex notice-bottom after">
            <p className="mb-0">이후글</p>
            <i className="fa-solid fa-caret-down fs-4" ></i>
            <span>이후 글이 없습니다</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default NoticeSelectForm;
