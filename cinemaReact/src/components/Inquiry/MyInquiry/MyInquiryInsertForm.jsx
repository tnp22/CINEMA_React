import React, { useState, useEffect, useContext } from 'react';
import '../../Notice/NoticeListForm.css'
import { Link } from 'react-router-dom';
import { LoginContext } from '../../../contexts/LoginContextProvider';

const MyInquiryInsertForm = ({inquiryInsert}) => {
  const [type, setType] = useState('1'); // 공개 기본값
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [title, setTitle] = useState()
  const [content, setContent] = useState()
  const [password, setPassword] = useState()
  const {userInfo } = useContext(LoginContext)
  const [username, setUsername] = useState(userInfo?.username)
  
  useEffect(() => {
    // 초기 로드시 공개/비공개 값에 따라 비밀번호 필드 상태 설정
    togglePassword(type);
  }, [type]);

  const togglePassword = (selectedType) => {
    if (selectedType === '0') {
      setPasswordVisible(true);
    } else {
      setPasswordVisible(false);
    }
  };

  // 문의 추가
  const handleSubmitEdit = () => {
    event.preventDefault(); // 기본 동작 방지
    const formData = {
      "title" : title,
      "content" : content,
      "type" : type,
      "password" : password,
      "username" : username
    }
    inquiryInsert(formData)
  };

  return (
    <div>
      <div className="title" style={{ marginBottom: '80px' }}>
        <h5 style={{ color: 'white' }}>문의내역</h5>
      </div>
      <div className="container w-50" style={{ minHeight: '450px' }}>
        <form onSubmit={handleSubmitEdit} method="post">
          <div className="d-flex mb-3">
            <select
              className="form-select me-1"
              style={{ width: '100px', marginRight: '1px' }}
              name="type"
              id="typeSelect"
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                togglePassword(e.target.value);
              }}
            >
              <option value="1">공개</option>
              <option value="0">비공개</option>
            </select>
            <input
              name="title"
              className="form-control"
              type="text"
              placeholder="문의사항 제목을 입력해주세요."
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          {passwordVisible && (
            <div id="passwordDiv" style={{ display: 'block' }}>
              <input
                type="password"
                id="passwordInput"
                name="password"
                className="form-control mb-3 w-25"
                placeholder="비밀번호를 입력해주세요"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          <textarea
            name="content"
            className="form-control mb-4"
            style={{ height: '200px', resize: 'none' }}
            placeholder="해당 문의사항에 관련된 글을 작성해주세요."
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <div className="text-center">
            <Link to="/inquiry/list" className="btn custom-btn me-3">
              취소
            </Link>
            <button type="submit" className="btn custom-btn">
              작성
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyInquiryInsertForm;
