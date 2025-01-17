import React, { useContext, useEffect, useState } from 'react';
import '../../Notice/NoticeSelectForm.css'
import { Link } from 'react-router-dom';
import { LoginContext } from '../../../contexts/LoginContextProvider';

const MyInquirySelectForm = ({inquiry,inquiryDelete}) => {
  const userRoles = JSON.parse(localStorage.getItem("roles"));
  const isAdmin = userRoles.isAdmin
  const isInquiry = userRoles.isInquiry
  const {userInfo } = useContext(LoginContext)
  const [username, setUsername] = useState(userInfo?.username)

  const deleteInquiry = (id) => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
        inquiryDelete(id)
    }
  };

  
  if (!inquiry) {
    return <div>Loading...</div>;
  }
  

  return (
    <div className='select-title'>
      <div className="title">
        <h5 style={{ color: 'white' }}>문의내역</h5>
      </div>
      <div className="container">
        <div className="d-flex justify-content-between p-3 select-notice-title" style={{ backgroundColor: 'rgb(243, 243, 243)', borderTop: '1px solid gray' }}>
          <h5>{inquiry.title}</h5>
          <div className="d-flex">
            <h6 className="me-3">{`등록일 : ${new Date(inquiry.regDate).toLocaleDateString()}`}</h6>
            <h6>{`작성자 : ${inquiry.username} `}</h6>
          </div>
        </div>
        <p className="w-100 p-3 notice-content mb-3" style={{ whiteSpace: 'pre-wrap' }}>
          {inquiry.content}
        </p>
        <div className="mb-5">
          {(inquiry.username === username || isAdmin || isInquiry) && (
            <>
              <Link className="btn select-list-btn me-2" to={`/user/myInquiry/update/${inquiry.id}`}>수정</Link>
              <button className="btn cancel-btn me-2" onClick={() => deleteInquiry(inquiry.id)}>삭제</button>
            </>
          )}
          <Link className="btn select-custom-btn me-2" to="/user/myInquiry/inquiries">목록</Link>
        </div>
        {inquiry.reply !== null && inquiry.reply !== '' &&
          <div>
                <h5>답변</h5>
                <p
                  id="replyP"
                  className="p-3 w-100"
                  style={{ whiteSpace: 'pre-wrap', backgroundColor: '#f5f4f4'}}
                >
                  {inquiry.reply}
                </p>
          </div>
        }
      </div>
    </div>
  );
};

export default MyInquirySelectForm;
