import React from 'react'
import '../MovieChart/MovieChartForm.css'
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
                <a href={`/movie/movieInfo?id=${movie.id}`}>
                  <img src={`/api/files/img?id=${movie.files.id}`} alt={movie.title} className="card-img-top" />
                </a>
                <div className="card-body">
                  <a href={`/movie/movieInfo?id=${movie.id}`}>
                    <h5 className="card-title">{movie.title}</h5>
                  </a>
                  <p className="card-text">개봉일 {formatDate(movie.releaseDate)}</p>
                  <a href={`/m/t?id=${movie.id}`} className="btn btn-purple">예매하기</a>
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
                  <a href={`/movie/movieInfo?moviePage=1&search=${search}`}>&laquo;</a>
                </li>
              )}
              {moviePageInfo.hasPreviousPage && (
                <li>
                  <a href={`/movie/search?moviePage=${moviePageInfo.prePage}&search=${search}`}>&lsaquo;</a>
                </li>
              )}
              {Array.from({ length: moviePageInfo.navigateLastPage - moviePageInfo.navigateFirstPage + 1 }, (_, i) => {
                const pageNum = moviePageInfo.navigateFirstPage + i;
                return (
                  <li key={pageNum}>
                    <a
                      href={`/movie/search?moviePage=${pageNum}&search=${search}`}
                      className={`page ${moviePageInfo.pageNum === pageNum ? 'active' : ''}`}
                    >
                      {pageNum}
                    </a>
                  </li>
                );
              })}
              {moviePageInfo.hasNextPage && (
                <li>
                  <a href={`/movie/search?moviePage=${moviePageInfo.nextPage}&search=${search}`}>&rsaquo;</a>
                </li>
              )}
              {moviePageInfo.pageNum < moviePageInfo.pages && (
                <li>
                  <a href={`/movie/search?moviePage=${moviePageInfo.pages}&search=${search}`}>&raquo;</a>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    );
  };

export default MovieSearchForm