import React, { useContext, useEffect, useState } from 'react'
import './MovieInfoForm.css'
import { Link } from 'react-router-dom';
import ReviewList from './ReviewList';
import * as review from '../../../apis/movie';
import { LoginContext } from '../../../contexts/LoginContextProvider';

const MovieInfoForm = ({ movie, castList, stilList, history, tab, page, average}) => {
    const [averageRating, setAverageRating] = useState(average);
    const [selectedTab, setSelectedTab] = useState(tab);
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState("");
    const [showAll, setShowAll] = useState(false); // State to track visibility of all stills
    const [selectedIndex, setSelectedIndex] = useState(null); // 선택된 이미지 인덱스
    const [showModal, setShowModal] = useState(false); // 모달 열림 여부
    const {userInfo } = useContext(LoginContext)
    const [username, setUsername] = useState(userInfo?.username)
    const [reviews, setReviews] = useState([]);
    const [myReview, setMyReview] = useState();
    const [movieId, setMovieId] = useState()
    const [count, setCount] = useState();
    const isLogin = sessionStorage.getItem('isLogin')

    // 스틸컷 클릭 시 모달 열기
    const handleImageClick = (index) => {
        setSelectedIndex(index);
        setShowModal(true);
    };

    // 모달 닫기
    const handleCloseModal = () => {
        setShowModal(false);
    };

    // 캐러셀에서 이전/다음 이미지로 이동
    const handleSlide = (direction) => {
        setSelectedIndex((prevIndex) => {
            if (direction === 'next') {
                return (prevIndex + 1) % stilList.length; // 다음 이미지
            } else {
                return (prevIndex - 1 + stilList.length) % stilList.length; // 이전 이미지
            }
        });
    };

    // 모달 외부 클릭 시 모달 닫기
    const handleBackdropClick = (e) => {
        // 모달의 내용 영역이 아닌 부분을 클릭했을 때만 모달을 닫도록 합니다.
        if (e.target.classList.contains('modal') || e.target.classList.contains('custom-close-btn')) {
            setShowModal(false);
        }
    };

    // Function to toggle the "Show More" state
    const handleShowMore = () => {
        setShowAll(true);
    };

    const handleTabChange = (tabName) => {
        setSelectedTab(tabName);
    };


    const handleRatingChange = (value) => {
        setRating(value);
    };


    const getReviewList = async (id, username, page) => {
          try {
              const response = await review.reviewList(id, username, page);
              const data = response.data;
              setMyReview(data.myReview)
              setReviews(data.reviewList);
              setCount(data.count)
              setMovieId(data.movieId)
              console.dir(data.reviewList)
          } catch (error) {
              console.error('리뷰 리스트를 가져오는 중 오류 발생:', error);
          }
      };

    // 페이지네이션을 위한 페이지 변경 핸들러
    const handlePageChange = (pageNum) => {
        getReviewList(movie.id,username, pageNum);
    };
    
    // 리뷰 추가 함수
    const reviewInsert = async ( form ) => {
      console.dir(form);
      
      let response
      let data
      try {
        response = await review.reviewInsert(JSON.stringify(form))
      } catch (error) {
        console.log(error);
        console.error(`리뷰추가 중 에러가 발생하였습니다.`);
        return
      }
      
      data = response.data
      const status = response.status
      console.log(`data : ${data}`);
      console.log(`status : ${status}`);

      if(status == 200){
        console.log('리뷰추가 성공!');
        getReviewList(movie.id,username,1)
      }else{
        console.log('리뷰추가 실패!');
      }
    }

    // 리뷰 수정 함수
    const reviewUpdate = async ( form ) => {
        console.dir(form);
        
        let response
        let data
        try {
          response = await review.reviewUpdate(JSON.stringify(form))
        } catch (error) {
          console.log(error);
          console.error(`리뷰수정 중 에러가 발생하였습니다.`);
          return
        }
        
        data = response.data
        const status = response.status
        console.log(`data : ${data}`);
        console.log(`status : ${status}`);
  
        if(status == 200){
          console.log('리뷰수정 성공!');
          getReviewList(movie.id,username,1)
        }else{
          console.log('리뷰수정 실패!');
        }
      }

      // 리뷰 삭제 함수
    const reviewDelete = async ( id ) => {
        let response
        try {
          response = await review.reviewDelete(id)
        } catch (error) {
          console.log(error);
          console.error(`리뷰삭제 중 에러가 발생하였습니다.`);
          return
        }
        
        const status = response.status
  
        if(status == 200){
          console.log('리뷰삭제 성공!');
          getReviewList(movie.id,username,1)
        }else{
          console.log('리뷰삭제 실패!');
        }
      }

    useEffect(() => {
        if (movie && movie.id) { // movie 객체가 존재하는지 확인
            handleTabChange('content');
            getReviewList(movie.id, username, 1);
        }
    }, [movie])
    

    return (
        <div className="container py-4">
        {movie && movie.title && (
            <div className="movie-header d-flex align-items-start gap-4">
            <img 
                src={`/api/files/img?id=${movie.files.id}`} 
                alt={movie.title} 
                className="img-fluid" 
                style={{ width: '200px', height: '280px', objectFit: 'cover' }} 
            />
            <div style={{ width: '100%' }}>
                <h1>{movie.title}</h1>
                <p>
                개봉일 
                <span style={{ fontSize: 'small', color: 'gray' }}>
                    {new Date(movie.releaseDate).toLocaleDateString('ko-KR')}
                </span>
                </p>
                <hr />
                <p>장르: {movie.type}</p>
                <p>
                감독: {castList.filter(cast => cast.rule === 'director').map(cast => cast.name).join(', ')}
                </p>
                <p>
                배우: {castList.filter(cast => cast.rule === 'actor').map(cast => cast.name).join(', ')}
                </p>
                <div className="d-flex">
                <p>평점:&nbsp;</p>
                <div className="star-ratings">
                    <div 
                        className="star-ratings-fill space-x-2 text-lg" 
                        style={{ width: `${average * 20}%` }}
                    >
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <div className="star-ratings-base space-x-2 text-lg">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                </div>
                <p>({average.toFixed(1)})</p>
                </div>
                {isLogin ? (
                    <Link
                        to={`/Ticket/DateSelection?id=${movie.id}`}
                        className="btn chart-btn-purple reserve-btn"
                    >
                        예매하기
                    </Link>
                ) : (
                    <button
                        className="reserve-btn"
                        onClick={() => alert("로그인 후 이용해 주세요.")}
                    >
                        예매하기
                    </button>
                )}
            </div>
            </div>
        )}

        <ul className="nav movie-tabs">
            <li className="nav-item">
            <button 
                className={`nav-link ${selectedTab === 'content' ? 'active' : ''}`} 
                onClick={() => handleTabChange('content')}
            >
                주요 정보
            </button>
            </li>
            <li className="nav-item">
            <button 
                className={`nav-link ${selectedTab === 'cast' ? 'active' : ''}`} 
                onClick={() => handleTabChange('cast')}
            >
                감독/출연
            </button>
            </li>
            <li className="nav-item">
            <button 
                className={`nav-link ${selectedTab === 'stills' ? 'active' : ''}`} 
                onClick={() => handleTabChange('stills')}
            >
                스틸컷
            </button>
            </li>
            <li className="nav-item">
            <button 
                className={`nav-link ${selectedTab === 'review' ? 'active' : ''}`} 
                onClick={() => handleTabChange('review')}
            >
                평점/리뷰
            </button>
            </li>
        </ul>

        <div className="tab-content py-4">
            {selectedTab === 'content' && movie != null && (
            <div className="tab-pane show active">
                <h3 className="ms-3 mb-4">주요 정보</h3>
                <p style={{ whiteSpace: 'pre-wrap' }}>{movie.content}</p>
            </div>
            )}

            {selectedTab === 'cast' && (
            <div className="tab-pane show active">
            <h3 className="ms-3 mb-4">감독 / 출연</h3>
            <div className="row">
              <h4>감독</h4>
              {castList.filter(cast => cast.rule === 'director').map((cast) => (
                <div className="col-md-3 d-flex" key={cast.id || cast.name}> {/* 유니크한 값을 key로 사용 */}
                  <img src={`/api/files/img?id=${cast.files.id}`} className="thumbnail" alt={cast.name} />
                  <div className="mt-3 ms-3 w-100">
                    <p className="mb-3" style={{ marginBottom: 0 }}>{cast.name}</p>
                    <hr className="mb-3" style={{ borderWidth: '2px 0 0 0', borderStyle: 'dotted', borderColor: 'gray' }} />
                    {history
                      .filter(subHis => subHis[0]?.name === cast.name)
                      .map((subHis, index) => (
                        subHis.map(ssub => (
                          <Link key={ssub.movie.id} to={`/movie/movieInfo?id=${ssub.movie.id}`}>
                            <p style={{ marginBottom: 0, color: 'black', fontSize: '13px' }}>{ssub.movie.title}</p>
                          </Link>
                        ))
                      ))}
                  </div>
                </div>
              ))}
          
              <h4>출연</h4>
              {castList.filter(cast => cast.rule === 'actor').map((cast) => (
                <div className="col-md-3 d-flex" style={{ marginTop: '20px' }} key={cast.id || cast.name}> {/* 유니크한 값을 key로 사용 */}
                  <img src={`/api/files/img?id=${cast.files.id}`} className="thumbnail" alt={cast.name} />
                  <div className="mt-3 ms-3 w-100">
                    <p className="mb-3" style={{ marginBottom: 0 }}>{cast.name}</p>
                    <hr className="mb-3" style={{ borderWidth: '2px 0 0 0', borderStyle: 'dotted', borderColor: 'gray' }} />
                    {history
                      .filter(subHis => subHis[0]?.name === cast.name)
                      .map((subHis) => (
                        subHis.map(ssub => (
                          <Link key={ssub.movie.id} to={`/movie/movieInfo?id=${ssub.movie.id}`}>
                            <p style={{ marginBottom: 0, color: 'black', fontSize: '13px' }}>{ssub.movie.title}</p>
                          </Link>
                        ))
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
            )}

            {selectedTab === 'stills' && stilList != null && (
            <div className="tab-pane show active">
                <h3 className="ms-3 mb-4">스틸컷</h3>
                <div className={showAll ? 'show-all' : ''} id="stilcut-container">
                <div className="row g-3 mb-5">
                    {stilList.map((stil, index) => (
                    <div className="col-md-3 stilcut-item" key={index}>
                        <img 
                        src={`/api/files/img?id=${stil.id}`} 
                        className="img-fluid stilcut" 
                        alt={`stilcut-${index}`} 
                        onClick={() => handleImageClick(index)}
                        />
                    </div>
                    ))}
                </div>
                </div>
                {stilList.length > 8 && !showAll && (
                <button id="showMoreButton" onClick={handleShowMore}>
                    <i className="fa-solid fa-down-long"></i> 더보기
                </button>
                )}
            </div>
            )}

            {/* 모달 */}
            {showModal && (
            <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1" aria-labelledby="imageModalLabel" aria-hidden="true" onClick={handleBackdropClick}>
                <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content custom-modal-content">
                    <div className="modal-body p-0">
                    <div id="carouselExample" className="carousel slide">
                        <div className="carousel-inner">
                        {stilList.map((stil, index) => (
                            <div className={`carousel-item ${selectedIndex === index ? 'active' : ''}`} key={index}>
                            <div className="modal-image-container" style={{ width: '100%', height: '100%' }}>
                                <img
                                    src={`/api/files/img?id=${stil.id}`}
                                    className="d-block w-100"
                                    alt={`stilcut-${index}`}
                                    style={{ objectFit: 'contain', width: '100%', height: 'auto' }}
                                />
                            </div>
                            </div>
                        ))}
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                <button type="button" className="custom-close-btn" onClick={handleCloseModal} aria-label="Close">
                <span>&times;</span>
                </button>

                <button className="carousel-control-prev custom-carousel-btn" type="button" onClick={() => handleSlide('prev')}>
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
                </button>
                <button className="carousel-control-next custom-carousel-btn" type="button" onClick={() => handleSlide('next')}>
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
                </button>
            </div>
            )}

            {selectedTab === 'review' && (
            <div className="tab-pane show active">
                <ReviewList movie={movie}
                            myReview={myReview} 
                            reviews={reviews} 
                            count={count} 
                            movieId={movieId} 
                            username={username} 
                            handlePageChange={handlePageChange}
                            reviewInsert={reviewInsert}
                            reviewUpdate={reviewUpdate}
                            reviewDelete={reviewDelete}/>
            </div>
            )}
        </div>
        </div>

    );
};
export default MovieInfoForm