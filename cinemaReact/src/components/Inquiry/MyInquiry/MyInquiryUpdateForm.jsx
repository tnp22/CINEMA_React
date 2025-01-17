import React, { useState, useEffect, useContext } from 'react';
import '../../Notice/NoticeListForm.css';
import { Link } from 'react-router-dom';
import { LoginContext } from '../../../contexts/LoginContextProvider';

const MyInquiryUpdateForm = ({ inquiry, inquiryUpdate }) => {
  const [type, setType] = useState('1'); // 기본값을 "공개"로 설정
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const { userInfo } = useContext(LoginContext);
  const username = userInfo?.username;

  useEffect(() => {
    if (inquiry) {
      setType(String(inquiry.type)); // `inquiry.type` 값을 문자열로 변환하여 설정
      setTitle(inquiry.title || '');
      setContent(inquiry.content || '');
      setPassword(inquiry.password || '');
    }
  }, [inquiry]);

  useEffect(() => {
    togglePassword(type);
  }, [type]);

  const togglePassword = (selectedType) => {
    setPasswordVisible(selectedType === '0');
  };

  const handleSubmitEdit = (event) => {
    event.preventDefault();
    const formData = {
      id: inquiry.id,
      title: title,
      content: content,
      type: type,
      password: password,
      username: username,
    };
    inquiryUpdate(formData);
  };

  if (!inquiry) {
    return <div>Loading...</div>;
  }

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
              value={type} // `value`로 설정
              onChange={(e) => {
                setType(e.target.value);
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
              value={title}
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
                value={password}
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
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
          <div className="text-center">
            <Link to={`/inquiry/select/${inquiry.id}`} className="btn custom-btn me-3">
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

export default MyInquiryUpdateForm;
