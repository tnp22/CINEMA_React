import React, { useContext, useEffect, useState } from 'react';
import '../Notice/NoticeSelectForm.css'
import { Link } from 'react-router-dom';
import { LoginContext } from '../../contexts/LoginContextProvider';

const InquirySelectForm = ({inquiry,inquiryDelete,replyUpdate}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [reply, setReply] = useState()
  const userRoles = JSON.parse(localStorage.getItem("roles"));
  const isAdmin = userRoles?.isAdmin ?? false
  const isInquiry = userRoles?.isInquiry ?? false
  const {userInfo } = useContext(LoginContext)
  const [username, setUsername] = useState(userInfo?.username)

  const deleteInquiry = (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
        inquiryDelete(id)
    }
  };

  const enableEditing = () => {
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
  };
  
  if (!inquiry) {
    return <div>Loading...</div>;
  }
  
  // 리뷰 수정
  const handleSubmitEdit = () => {
    event.preventDefault(); // 기본 동작 방지
    const formData = {
      "id" : inquiry.id,
      "reply" : reply
    }
    replyUpdate(formData)
    cancelEdit()
  };

  return (
    <div className='select-title'>
      <div className="title">
        <h5 style={{ color: 'white' }}>고객센터</h5>
      </div>
      <div className="container">
        <div className="d-flex justify-content-between p-3 select-notice-title" style={{ backgroundColor: 'rgb(243, 243, 243)', borderTop: '1px solid gray' }}>
          <h5>{inquiry.title}</h5>
          <div className="d-flex">
            <h6 className="me-3">{`등록일 : ${new Date(inquiry.regDate).toLocaleDateString()}`}</h6>
            <h6>{`작성자 : ${inquiry.username}`}</h6>
          </div>
        </div>
        <p className="w-100 p-3 notice-content mb-3" style={{ whiteSpace: 'pre-wrap' }}>
          {inquiry.content}
        </p>
        <div className="mb-5">
          {(inquiry.username === username || isAdmin || isInquiry) && (
            <>
              <Link className="btn select-list-btn me-2" to={`/inquiry/update/${inquiry.id}`}>수정</Link>
              <button className="btn cancel-btn me-2" onClick={() => deleteInquiry(inquiry.id)}>삭제</button>
            </>
          )}
          <Link className="btn select-custom-btn me-2" to="/inquiry/list">목록</Link>
        </div>
        <div>
          {inquiry.reply && inquiry.reply !== '' ? (
            <form onSubmit={handleSubmitEdit} method="post">
              <h5>답변</h5>
              <textarea
                id="updateArea"
                name="reply"
                className="form-control reply-content p-3 mb-3"
                defaultValue={inquiry?.reply}
                style={{ display: isEditing ? 'inline-block' : 'none' }}
                onChange={(e) => setReply(e.target.value)}
              />
              <p
                id="replyP"
                className="p-3 w-100"
                style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f4f4', display: isEditing ? 'none' : 'inline-block' }}
              >
                {inquiry.reply}
              </p>
              {(isAdmin || isInquiry) && (
                <button
                  type="button"
                  className="btn select-list-btn"
                  onClick={enableEditing}
                  style={{ display: isEditing ? 'none' : 'inline-block' }}
                >
                  수정
                </button>
              )}
              <button className="btn select-custom-btn" type="submit" style={{ display: isEditing ? 'inline-block' : 'none' }}>저장</button>
              <button className="btn cancel-btn me-2" type="button" onClick={cancelEdit} style={{ display: isEditing ? 'inline-block' : 'none' }}>
                취소
              </button>
            </form>
          ) : (
            (isAdmin || isInquiry) && (
              <form onSubmit={handleSubmitEdit} method="post">
                <h5>답변</h5>
                <textarea
                  name="reply"
                  className="form-control reply-content p-3 mb-3"
                  onChange={(e) => setReply(e.target.value)}
                />
                <input type="submit" className="btn select-list-btn" value="작성" />
              </form>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default InquirySelectForm;
