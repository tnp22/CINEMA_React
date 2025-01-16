import React, { useState, useEffect } from 'react';
import './MovieChartForm.css'
import { Link } from 'react-router-dom';

const MovieChartForm = ({ moviePageInfo, expectPageInfo, moviePage, expectPage }) => {
  const [currentTab, setCurrentTab] = useState('movie');

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
  };



  const renderMovies = () => {
    if (moviePageInfo && moviePageInfo.list && moviePageInfo.list.length > 0) {
      return moviePageInfo.list.map((movie, index) => (
        <div className="col-md-3 d-flex justify-content-center" key={movie.id}>
          <div className="card">
            <div className="card-header">
              <p style={{ position: 'relative', bottom: '5px' }}>
                No. {(moviePageInfo.pageNum - 1) * 8 + 1 + index}
              </p>
            </div>
            <Link to={`/movie/movieInfo?id=${movie.id}`}>
              <img src={`/api/files/img?id=${movie.files.id}`} alt={movie.title} />
            </Link>
            <div className="card-body">
              <Link to={`/movie/movieInfo?id=${movie.id}`} className="link-black">
                <h5 className="card-title">{movie.title}</h5>
              </Link>
              <p className="card-text">
                개봉일 {new Date(movie.releaseDate).toLocaleDateString('ko-KR')}
              </p>
              <Link to={`/m/t?id=${movie.id}`} className="btn chart-btn-purple">
                예매하기
              </Link>
            </div>
          </div>
        </div>
      ));
    } else {
      return <p>No movies available.</p>; // or any placeholder message
    }
  };
  

  const renderUpcomingMovies = () => {
    return expectPageInfo.list.map((expect, index) => (
      <div className="col-md-3 d-flex justify-content-center" key={expect.id}>
        <div className="card">
          <div className="card-header">
            <p style={{ position: 'relative', bottom: '5px' }}>
              No. {(expectPageInfo.pageNum - 1) * 8 + 1 + index}
            </p>
          </div>
          <Link to={`/movie/movieInfo?id=${expect.id}`} className="link-black">
            <img src={`/api/files/img?id=${expect.files.id}`} alt={expect.title} />
          </Link>
          <div className="card-body">
            <Link to={`/movie/movieInfo?id=${expect.id}`} className="link-black">
              <h5 className="card-title">{expect.title}</h5>
            </Link>
            <p className="card-text">
              개봉일 {new Date(expect.releaseDate).toLocaleDateString('ko-KR')}
            </p>
            <Link to={`/m/t?id=${expect.id}`} className="btn chart-btn-purple">
              예매하기
            </Link>
          </div>
        </div>
      </div>
    ));
  };

  const renderPagination = (pageInfo, type, otherPage) => {
    return (
        <div className="pagination flex justify-content-center">
        <ul style={{ display: 'flex', listStyleType: 'none', gap: '10px' }}>
          {pageInfo.pageNum > 1 && (
            <li>
              <Link to={`/movie/movieChart?tab=${type}&page=1&otherPage=${otherPage}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16" transform="scale(-1, 1)">
                  <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
                </svg>
              </Link>
            </li>
          )}
          
          {pageInfo.hasPreviousPage && (
            <li>
              <Link to={`/movie/movieChart?tab=${type}&page=${pageInfo.prePage}&otherPage=${otherPage}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16">
                  <path d="M34.52 239l194.34-194.34c9.37-9.37 24.57-9.37 33.94 0l22.34 22.34c9.37 9.37 9.37 24.57 0 33.94L128.97 256l156.17 156.17c9.37 9.37 9.37 24.57 0 33.94l-22.34 22.34c-9.37 9.37-24.57 9.37-33.94 0L34.52 273c-9.37-9.37-9.37-24.57 0-33.94z" />
                </svg>
              </Link>
            </li>
          )}
          
          {Array.from({ length: pageInfo.navigateLastPage - pageInfo.navigateFirstPage + 1 }, (_, index) => {
            const page = pageInfo.navigateFirstPage + index;
            return (
              <li key={page}>
                <Link
                  to={`/movie/movieChart?tab=${type}&page=${page}&otherPage=${otherPage}`}
                  className={`page ${pageInfo.pageNum === page ? 'active' : ''}`}
                >
                  {page}
                </Link>
              </li>
            );
          })}
          
          {pageInfo.hasNextPage && (
            <li>
              <Link to={`/movie/movieChart?tab=${type}&page=${pageInfo.nextPage}&otherPage=${otherPage}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="16" height="16">
                  <path d="M285.48 273l-194.34 194.34c-9.37 9.37-24.57 9.37-33.94 0l-22.34-22.34c-9.37-9.37-9.37-24.57 0-33.94L191.03 256 34.86 99.83c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L285.48 239c9.37 9.37 9.37 24.57 0 33.94z" />
                </svg>
              </Link>
            </li>
          )}
          
          {pageInfo.pageNum < pageInfo.pages && (
            <li>
              <Link to={`/movie/movieChart?tab=${type}&page=${pageInfo.pages}&otherPage=${otherPage}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="16" height="16">
                  <path d="M224 239L29.66 44.66c-9.37-9.37-24.57-9.37-33.94 0L-26.34 67c-9.37 9.37-9.37 24.57 0 33.94L128.97 256-26.34 410.05c-9.37 9.37-9.37 24.57 0 33.94l22.34 22.34c9.37 9.37 24.57 9.37 33.94 0L224 273c9.37-9.37 9.37-24.57 0-33.94zM448 273L253.66 467.34c-9.37 9.37-24.57 9.37-33.94 0L197.34 445c-9.37-9.37-9.37-24.57 0-33.94L352.97 256 197.34 100.95c-9.37-9.37-9.37-24.57 0-33.94l22.34-22.34c9.37-9.37 24.57-9.37 33.94 0L448 239c9.37 9.37 9.37 24.57 0 33.94z" />
                </svg>
              </Link>
            </li>
          )}
        </ul>
      </div>
    );
  };

  return (
    <div className="container chart-form">
      <div className="d-flex justify-content-between align-items-center">
        <h2>영화차트</h2>
        <ul className="nav nav-tabs" id="movieTabs" role="tablist">
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${currentTab === 'movie' ? 'active' : ''}`}
              onClick={() => handleTabClick('movie')}
              role="tab"
            >
              영화 차트
            </a>
          </li>
          <h3 style={{ opacity: '50%' }}>│</h3>
          <li className="nav-item" role="presentation">
            <a
              className={`nav-link ${currentTab === 'expect' ? 'active' : ''}`}
              onClick={() => handleTabClick('expect')}
              role="tab"
            >
              상영 예정작
            </a>
          </li>
        </ul>
      </div>
      <hr className="mb-4" />
      <div className="tab-content">
        {currentTab === 'movie' && (
          <div className="tab-pane fade show active" id="chart" role="tabpanel">
            <div className="row gy-5 mb-5">{renderMovies()}</div>
            {renderPagination(moviePageInfo, 'movie', expectPage)}
          </div>
        )}
        {currentTab === 'expect' && (
          <div className="tab-pane fade show active" id="upcoming" role="tabpanel">
            <div className="row gy-5 mb-5">{renderUpcomingMovies()}</div>
            {renderPagination(expectPageInfo, 'expect', moviePage)}
          </div>
        )}
      </div>
    </div>
  );
};

export default MovieChartForm;
