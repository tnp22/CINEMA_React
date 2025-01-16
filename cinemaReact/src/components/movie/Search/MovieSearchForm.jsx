import React from 'react'
import '../MovieChart/MovieChartForm.css'
import { Link } from 'react-router-dom';
const MovieSearchForm = ({moviePageInfo, search}) => {

  
    const formatDate = (dateString) => {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(dateString).toLocaleDateString('ko-KR', options);
    };
  
    return (
      <div className="container chart-form">
        <div className="d-flex justify-content-between">
          <h2>영화 검색</h2>
        </div>
        <hr className="mb-4" />
  
        <div className="row gy-5">
          {moviePageInfo && moviePageInfo.list && moviePageInfo.list.length > 0 && moviePageInfo.list.map((movie, index) => (
            <div key={movie.id} className="col-md-3 d-flex justify-content-center">
              <div className="card">
                <div className="card-header">
                  <p style={{ position: 'relative', bottom: '5px' }}>
                    No. {(moviePageInfo.pageNum - 1) * 8 + 1 + index}
                  </p>
                </div>
                <Link to={`/movie/movieInfo?id=${movie.id}`} className="link-black">
                  <img src={`/api/files/img?id=${movie.files.id}`} alt={movie.title} className="card-img-top" />
                </Link>
                <div className="card-body">
                  <Link to={`/movie/movieInfo?id=${movie.id}`} className="link-black">
                    <h5 className="card-title">{movie.title}</h5>
                  </Link>
                  <p className="card-text">개봉일 {formatDate(movie.releaseDate)}</p>
                  <Link to={`/m/t?id=${movie.id}`} className="btn chart-btn-purple">예매하기</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
  
        {/* 페이지네이션 */}
        {moviePageInfo.pages > 0 && (
          <div className="pagination flex justify-content-center">
            <ul style={{ display: 'flex', listStyleType: 'none', gap: '10px' }}>
              {moviePageInfo.pageNum > 1 && (
                <li>
                  <Link to={`/movie/search?page=1&search=${search}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" transform="scale(-1, 1)">
                      <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
                    </svg>
                  </Link>
                </li>
              )}
              {moviePageInfo.hasPreviousPage && (
                <li>
                  <Link to={`/movie/search?page=${moviePageInfo.prePage}&search=${search}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16">
                      <path d="M34.52 239l194.34-194.34c9.37-9.37 24.57-9.37 33.94 0l22.34 22.34c9.37 9.37 9.37 24.57 0 33.94L128.97 256l156.17 156.17c9.37 9.37 9.37 24.57 0 33.94l-22.34 22.34c-9.37 9.37-24.57 9.37-33.94 0L34.52 273c-9.37-9.37-9.37-24.57 0-33.94z" />
                    </svg>
                  </Link>
                </li>
              )}
              {Array.from({ length: moviePageInfo.navigateLastPage - moviePageInfo.navigateFirstPage + 1 }, (_, i) => {
                const pageNum = moviePageInfo.navigateFirstPage + i;
                return (
                  <li key={pageNum}>
                  <Link
                    to={`/movie/search?page=${pageNum}&search=${search}`}
                    className={`page ${moviePageInfo.pageNum === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </Link>
                </li>
                );
              })}
              {moviePageInfo.hasNextPage && (
                <li>
                <Link to={`/movie/search?page=${moviePageInfo.nextPage}&search=${search}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16">
                    <path d="M285.48 273l-194.34 194.34c-9.37 9.37-24.57 9.37-33.94 0l-22.34-22.34c-9.37-9.37-9.37-24.57 0-33.94L191.03 256 34.86 99.83c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L285.48 239c9.37 9.37 9.37 24.57 0 33.94z" />
                  </svg>
                </Link>
              </li>
              )}
              {moviePageInfo.pageNum < moviePageInfo.pages && (
                <li>
                <Link to={`/movie/search?page=${moviePageInfo.pages}&search=${search}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16">
                    <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
                  </svg>
                </Link>
              </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

export default MovieSearchForm