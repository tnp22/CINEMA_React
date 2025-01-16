import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button, Form } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import * as review from '../../../apis/movie';
import { LoginContext } from '../../../contexts/LoginContextProvider';
import { Link } from 'react-router-dom';

const ReviewList = ({movie, myReview, reviews, count, movieId, username, handlePageChange, reviewInsert, reviewUpdate, reviewDelete}) => {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);


  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState(null);
  const [rating, setRating] = useState(0);
  const [content, setContent] = useState('');
  const [id, setId] = useState()
  const [hoveredRating, setHoveredRating] = useState(0); // 마우스 오버시 보여지는 별점

  // 리뷰 작성 모달 열기
  const handleAddReview = () => {
    if (count > 0) {
      alert('이미 평점을 작성하셨습니다.');
    } else {
      setShowAddModal(true);
    }
  };

  // 리뷰 수정 모달 열기
  const handleEditReview = review => {
    setReviewToEdit(review);
    setRating(review.ratingValue);
    setContent(review.content);
    setShowEditModal(true);
    setId(review.id);
  };

  // 리뷰 삭제
  const handleDeleteReview = reviewId => {
    const deleteOk = confirm('정말로 삭제하시겠습니까?')
    if(deleteOk)
      reviewDelete(reviewId)
  };

  // 리뷰 추가
  const handleSubmitAdd = () => {
    const formData = {
      "username" : username,
      "ratingValue" : rating,
      "content" : content,
      "movieId" : movieId
    }
    reviewInsert(formData)
    setShowAddModal(false);
  };

  // 리뷰 수정
  const handleSubmitEdit = () => {
    const formData = {
      "id" : id,
      "ratingValue" : rating,
      "content" : content,
    }
    reviewUpdate(formData)
    setShowEditModal(false);
  };


  // 별점 클릭 처리
  const handleRatingClick = (ratingValue) => {
    setRating(ratingValue);
  };

  // 마우스를 올렸을 때, hoveredRating 값을 설정
  const handleMouseEnter = (value) => {
    setHoveredRating(value); 
  };

  // 마우스를 떼었을 때, hoveredRating 초기화
  const handleMouseLeave = () => {
    setHoveredRating(0); 
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="ms-3 mb-4">평점 / 리뷰</h3>
        <button className="btn btn-purple" onClick={handleAddReview}>
          평점작성
        </button>
      </div>
      <div className="row g-6">

      {myReview && myReview.id && (
        <div key={myReview.id} className="col-md-6 mb-4"> {/* col-md-6 클래스를 사용하여 2열로 분할 */}
          <div id="review-section" className="review-section d-flex justify-content-between myReview">
            <div className="review-user">
              <img
                src={myReview.fileId ? `/api/files/img?id=${myReview.fileId}` : "/api/files/image?id=C:/upload/normal.png"}
                alt="User"
              />
              <div>
                <p>{myReview.username}</p>
                <div className="star-ratings">
                  <div className="star-ratings-fill" style={{ width: `${myReview.ratingValue * 20}%` }}>
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                  <div className="star-ratings-base">
                    <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                  </div>
                </div>
                <p>{myReview.content}</p>
              </div>
            </div>
            {myReview.username === username && (
              <div className="dropdown">
                <button className="btn btn-light custom-dropdown-btn myReview" data-bs-toggle="dropdown" aria-expanded="false">
                  &#8942;
                </button>
                <ul className="dropdown-menu text-center">
                  <li>
                    <button
                      className="btn edit-review dropdown-item"
                      onClick={() => handleEditReview(myReview)}
                    >
                      <i className="fa-solid fa-pencil"></i> 수정
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="btn dropdown-item"
                      onClick={() => handleDeleteReview(myReview.id)}
                    >
                      <i className="fa-solid fa-trash-can"></i> 삭제
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}


  {reviews && reviews.list && reviews.list.length > 0 && reviews.list.map(review => (
    <div key={review.id} className="col-md-6 mb-4"> {/* col-md-6 클래스를 사용하여 2열로 분할 */}
      <div id="review-section" className="review-section d-flex justify-content-between">
        <div className="review-user">
          <img
            src={review.fileId ? `/api/files/img?id=${review.fileId}` : "/api/files/image?id=C:/upload/normal.png"}
            alt="User"
          />
          <div>
            <p>{review.username}</p>
            <div className="star-ratings">
              <div className="star-ratings-fill" style={{ width: `${review.ratingValue * 20}%` }}>
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
              <div className="star-ratings-base">
                <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
              </div>
            </div>
            <p>{review.content}</p>
          </div>
        </div>
        {review.username === username && (
          <div className="dropdown">
            <button className="btn btn-light custom-dropdown-btn" data-bs-toggle="dropdown" aria-expanded="false">
              &#8942;
            </button>
            <ul className="dropdown-menu text-center">
              <li>
                <button
                  className="btn edit-review dropdown-item"
                  onClick={() => handleEditReview(review)}
                >
                  <i className="fa-solid fa-pencil"></i> 수정
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="btn dropdown-item"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  <i className="fa-solid fa-trash-can"></i> 삭제
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  ))}
</div>

      

      {/* 페이지네이션 */}
      {reviews.pages > 0 && (
          <div className="pagination flex justify-content-center">
            <ul style={{ display: 'flex', listStyleType: 'none', gap: '10px' }}>
              {reviews.pageNum > 1 && (
                <li>
                  <Link to="#" onClick={() => handlePageChange(1)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" transform="scale(-1, 1)">
                      <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
                    </svg>
                  </Link>
                </li>
              )}
              {reviews.hasPreviousPage && (
                <li>
                  <Link to="#" onClick={() => handlePageChange(reviews.prePage)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16">
                      <path d="M34.52 239l194.34-194.34c9.37-9.37 24.57-9.37 33.94 0l22.34 22.34c9.37 9.37 9.37 24.57 0 33.94L128.97 256l156.17 156.17c9.37 9.37 9.37 24.57 0 33.94l-22.34 22.34c-9.37 9.37-24.57 9.37-33.94 0L34.52 273c-9.37-9.37-9.37-24.57 0-33.94z" />
                    </svg>
                  </Link>
                </li>
              )}
              {Array.from({ length: reviews.navigateLastPage - reviews.navigateFirstPage + 1 }, (_, i) => {
                const pageNum = reviews.navigateFirstPage + i;
                return (
                  <li key={pageNum}>
                  <Link
                    to="#" onClick={() => handlePageChange(pageNum)}
                    className={`page ${reviews.pageNum === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </Link>
                </li>
                );
              })}
              {reviews.hasNextPage && (
                <li>
                <Link to="#" onClick={() => handlePageChange(reviews.nextPage)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16">
                    <path d="M285.48 273l-194.34 194.34c-9.37 9.37-24.57 9.37-33.94 0l-22.34-22.34c-9.37-9.37-9.37-24.57 0-33.94L191.03 256 34.86 99.83c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L285.48 239c9.37 9.37 9.37 24.57 0 33.94z" />
                  </svg>
                </Link>
              </li>
              )}
              {reviews.pageNum < reviews.pages && (
                <li>
                <Link to="#" onClick={() => handlePageChange(reviews.pages)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16">
                    <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
                  </svg>
                </Link>
              </li>
              )}
            </ul>
          </div>
        )}

      {/* 평점 작성 모달 */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} className="review-modal">
        <Modal.Header closeButton>
          <Modal.Title>평점 작성</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h3 className="text-center">{movie.title}</h3>
          <div className="star-rating text-center">
            {[1, 2, 3, 4, 5].map(i => (
              <span
                key={i}
                className={`star ${i <= (hoveredRating || rating) ? 'full' : ''}`}
                onClick={() => handleRatingClick(i)}
                onMouseEnter={() => handleMouseEnter(i)} // 마우스를 올릴 때 해당 별점까지 색상 채움
                onMouseLeave={handleMouseLeave} // 마우스를 떼었을 때 색상 초기화
              >
                &#9733;
              </span>
            ))}
          </div>
          <Form.Control
            as="textarea"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength="68"
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            취소
          </Button>
          <button type="button" className="btn btn-purple me-0" onClick={handleSubmitAdd}>
            작성완료
          </button>
        </Modal.Footer>
      </Modal>

      {/* 평점 수정 모달 */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} className="review-modal">
        <Modal.Header closeButton>
          <Modal.Title>평점 수정</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <h3 className="text-center">{movie.title}</h3>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map(i => (
              <span
                key={i}
                className={`star ${i <= (hoveredRating || rating) ? 'full' : ''}`}
                onClick={() => handleRatingClick(i)}
                onMouseEnter={() => handleMouseEnter(i)} // 마우스를 올릴 때 해당 별점까지 색상 채움
                onMouseLeave={handleMouseLeave} // 마우스를 떼었을 때 색상 초기화
              >
                &#9733;
              </span>
            ))}
          </div>
          <Form.Control
            as="textarea"
            rows={3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength="68"
            required
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            취소
          </Button>
          <button type="button" className="btn btn-purple me-0" onClick={handleSubmitEdit}>
            수정완료
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewList;
