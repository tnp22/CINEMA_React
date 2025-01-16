import React, { useState } from "react";
import { FaPencilAlt, FaTrashAlt } from "react-icons/fa";

const ReviewList = ({ reviewList, myReview, movieId, onEditReview, onDeleteReview }) => {
  const [pageNum, setPageNum] = useState(1);
  
  const handlePageChange = (page) => {
    setPageNum(page);
  };

  const renderStarRating = (rating) => {
    const width = rating * 20 + 1;
    return (
      <div className="star-ratings">
        <div className="star-ratings-fill space-x-2 text-lg" style={{ width: `${width}%` }}>
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
        <div className="star-ratings-base space-x-2 text-lg">
          <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
        </div>
      </div>
    );
  };

  return (
    <div className="row g-6">
      {/* My Review Section */}
      {myReview && (
        <div className="col-md-6">
          <div className="review-section d-flex justify-content-between myReview">
            <div className="review-user">
              <img 
                src={myReview.fileId ? `/img?id=${myReview.fileId}` : "/image?id=C:/upload/normal.png"} 
                alt={myReview.username}
              />
              <div>
                <p>{myReview.username}</p>
                {renderStarRating(myReview.ratingValue)}
                <p style={{ whiteSpace: "pre-wrap" }}>{myReview.content}</p>
              </div>
            </div>
            {myReview.username === "current-user" && (
              <div className="dropdown dropstart">
                <button 
                  className="btn btn-light custom-dropdown-btn myReview" 
                  type="button" 
                  id="dropdownMenuButton" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  &#8942;
                </button>
                <ul className="dropdown-menu text-center" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button 
                      className="btn edit-review dropdown-item"
                      onClick={() => onEditReview(myReview)} 
                      data-bs-toggle="modal" 
                      data-bs-target="#updateModal"
                    >
                      <FaPencilAlt /> 수정
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button 
                      className="btn dropdown-item" 
                      onClick={() => onDeleteReview(myReview.id, movieId)}
                    >
                      <FaTrashAlt /> 삭제
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reviews List */}
      {reviewList.list.map((review) => (
        <div className="col-md-6" key={review.id}>
          <div className="review-section d-flex justify-content-between">
            <div className="review-user">
              <img 
                src={review.fileId ? `/img?id=${review.fileId}` : "/image?id=C:/upload/normal.png"} 
                alt={review.username}
              />
              <div>
                <p>{review.username}</p>
                {renderStarRating(review.ratingValue)}
                <p style={{ whiteSpace: "pre-wrap" }}>{review.content}</p>
              </div>
            </div>
            {review.username === "current-user" && (
              <div className="dropdown dropstart">
                <button 
                  className="btn btn-light custom-dropdown-btn" 
                  type="button" 
                  id="dropdownMenuButton" 
                  data-bs-toggle="dropdown" 
                  aria-expanded="false"
                >
                  &#8942;
                </button>
                <ul className="dropdown-menu text-center" aria-labelledby="dropdownMenuButton">
                  <li>
                    <button 
                      className="btn edit-review dropdown-item" 
                      onClick={() => onEditReview(review)} 
                      data-bs-toggle="modal" 
                      data-bs-target="#updateModal"
                    >
                      <FaPencilAlt /> 수정
                    </button>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button 
                      className="btn dropdown-item" 
                      onClick={() => onDeleteReview(review.id, movieId)}
                    >
                      <FaTrashAlt /> 삭제
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      ))}

      {/* Pagination */}
      {reviewList.pages > 0 && (
        <div className="pagination mt-5 flex justify-content-center">
          <ul style={{ display: "flex", listStyleType: "none", gap: "10px", justifyContent: "center" }} id="pagination">
            {reviewList.pageNum > 1 && (
              <li>
                <a 
                  href="#" 
                  onClick={() => handlePageChange(1)} 
                  className="custom-page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" className="icon" transform="scale(-1, 1)">
                    <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z"/>
                  </svg>
                </a>
              </li>
            )}
            {reviewList.hasPreviousPage && (
              <li>
                <a 
                  href="#" 
                  onClick={() => handlePageChange(reviewList.prePage)} 
                  className="custom-page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16" className="icon">
                    <path d="M34.52 239l194.34-194.34c9.37-9.37 24.57-9.37 33.94 0l22.34 22.34c9.37 9.37 9.37 24.57 0 33.94L128.97 256l156.17 156.17c9.37 9.37 9.37 24.57 0 33.94l-22.34 22.34c-9.37 9.37-24.57 9.37-33.94 0L34.52 273c-9.37-9.37-9.37-24.57 0-33.94z"/>
                  </svg>
                </a>
              </li>
            )}
            {reviewList.navigatePages.map((page) => (
              <li key={page}>
                <a 
                  href="#" 
                  onClick={() => handlePageChange(page)} 
                  className={`custom-page ${reviewList.pageNum === page ? "active" : ""}`}
                >
                  {page}
                </a>
              </li>
            ))}
            {reviewList.hasNextPage && (
              <li>
                <a 
                  href="#" 
                  onClick={() => handlePageChange(reviewList.nextPage)} 
                  className="custom-page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16" className="icon">
                    <path d="M285.48 273l-194.34 194.34c-9.37 9.37-24.57 9.37-33.94 0l-22.34-22.34c-9.37-9.37-9.37-24.57 0-33.94L191.03 256 34.86 99.83c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L285.48 239c9.37 9.37 9.37 24.57 0 33.94z"/>
                  </svg>
                </a>
              </li>
            )}
            {reviewList.pageNum < reviewList.pages && (
              <li>
                <a 
                  href="#" 
                  onClick={() => handlePageChange(reviewList.pages)} 
                  className="custom-page"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" className="icon">
                    <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z"/>
                  </svg>
                </a>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReviewList;
