import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../Notice/NoticeListForm.css';
const MyInquiryListForm = ({ inquiryList, option, keyword, handleSearch }) => {
  const navigate = useNavigate();


  const [newOption, setNewOption] = useState(option)
  const [newKeyword, setNewKeyword] = useState(keyword)

  const handleOptionChange = (event) => {
      setNewOption(event.target.value);
  };

  const handleKeywordChange = (event) => {
      setNewKeyword(event.target.value);
  };

  const checkType = (inquiry) => {
      navigate(`/user/myInquiry/select/${inquiry.id}`);
  };

  const handleSubmit = (event) => {
    event.preventDefault(); // 기본 동작 방지
    
    if (newOption!==null && newKeyword!==null) {
     handleSearch(newOption,newKeyword)
    }
 };

  return (
    <div style={{ minHeight: '450px', marginBottom:'50px' }}>
      <div className="title">
        <h5 style={{ color: 'white' }}>문의내역</h5>
      </div>
      {/* Search Form */}
      <div className="container">
        <form onSubmit={handleSubmit} method="get" id="form">
            <div className="mb-2 d-flex">
            <select className="form-select" style={{ width: '100px', marginRight: '1px' }} name="option" defaultValue={option} onChange={handleOptionChange}>
                <option value="1">제목</option>
                <option value="2">내용</option>
                <option value="3">작성자</option>
            </select>
            <input
                type="text"
                className="form-control"
                style={{ width: '200px', marginRight: '1px' }}
                name="keyword"
                placeholder="검색어를 입력해주세요."
                defaultValue={keyword}
                onChange={handleKeywordChange}
            />
            <button type="submit" className="btn custom-btn" style={{ width: '80px' }}>검색</button>
            </div>
        </form>
        {/* Inquiry List */}
        <table className="custom-table mb-5">
            <thead>
            <tr>
                <th scope="col" className="text-center" style={{ width: '10%' }}>번호</th>
                <th scope="col" className="text-center" style={{ width: '10%' }}>상태</th>
                <th scope="col" style={{ width: '50%' }}>제목</th>
                <th scope="col" className="text-center" style={{ width: '20%' }}>작성자</th>
                <th scope="col" className="text-center" style={{ width: '10%' }}>등록일</th>
            </tr>
            </thead>
            <tbody>
            {inquiryList && inquiryList.list && inquiryList.list.length > 0 && inquiryList.list.map((inquiry) => (
                <tr key={inquiry.no}>
                <td className="text-center">{inquiry.no}</td>
                <td className="text-center">{inquiry.status === 1 ? '답변완료' : '답변대기'}</td>
                <td className="text-start">
                    <button
                    type="button"
                    className="btn btn-link p-0 text-decoration-none"
                    style={{ color: 'black' }}
                    onClick={() => checkType(inquiry)}
                    >
                    {inquiry.title}
                    </button>
                </td>
                <td className="text-center">{inquiry.username}</td>
                <td className="text-center">{new Date(inquiry.regDate).toLocaleDateString('ko-KR')}</td>
                </tr>
            ))}
            </tbody>
        </table>
            <Link to="/user/myInquiry/insert" className="btn custom-btn float-end">작성</Link>
        {/* Pagination */}
        {inquiryList.pages > 0 && (
            <div className="pagination mt-5 flex justify-content-center">
                <ul style={{ display: 'flex', listStyleType: 'none', gap: '10px', justifyContent: 'center' }}>
                {inquiryList.pageNum > 1 && (
                <li>
                    <Link  to={`/inquiry/list?page=1&option=${option}&keyword=${keyword}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" className="icon" transform="scale(-1, 1)">
                        <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
                    </svg>
                    
                    </Link>
                </li>
                )}
                {inquiryList.hasPreviousPage && (
                <li>
                    <Link to={`/inquiry/list?page=${inquiryList.prePage}&option=${option}&keyword=${keyword}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16" className="icon">
                        <path d="M34.52 239l194.34-194.34c9.37-9.37 24.57-9.37 33.94 0l22.34 22.34c9.37 9.37 9.37 24.57 0 33.94L128.97 256l156.17 156.17c9.37 9.37 9.37 24.57 0 33.94l-22.34 22.34c-9.37 9.37-24.57 9.37-33.94 0L34.52 273c-9.37-9.37-9.37-24.57 0-33.94z" />
                        </svg>
                    </Link>
                </li>
                )}
                {Array.from({ length: inquiryList.navigateLastPage - inquiryList.navigateFirstPage + 1 }, (_, i) => (
                <li key={i} className={`${inquiryList.pageNum === inquiryList.navigateFirstPage + i ? 'active' : ''}`}>
                    <Link to={`/inquiry/list?page=${inquiryList.navigateFirstPage + i}&option=${option}&keyword=${keyword}`}
                    className={`page ${inquiryList.pageNum === inquiryList.navigateFirstPage + i ? 'active' : ''}`}>
                    {inquiryList.navigateFirstPage + i}
                    </Link>
                </li>
                ))}
                {inquiryList.hasNextPage && (
                <li>
                    <Link to={`/inquiry/list?page=${inquiryList.nextPage}&option=${option}&keyword=${keyword}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16" className="icon">
                        <path d="M285.48 273l-194.34 194.34c-9.37 9.37-24.57 9.37-33.94 0l-22.34-22.34c-9.37-9.37-9.37-24.57 0-33.94L191.03 256 34.86 99.83c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L285.48 239c9.37 9.37 9.37 24.57 0 33.94z" />
                        </svg>
                    </Link>
                </li>
                )}
                {inquiryList.pageNum < inquiryList.pages && (
                <li>
                    <Link to={`/inquiry/list?page=${inquiryList.pages}&option=${option}&keyword=${keyword}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" className="icon">
                        <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
                        </svg>
                    </Link>
                </li>
                )}
            </ul>
            </div>
        )}
      </div>
    </div>
  );
};

export default MyInquiryListForm;
