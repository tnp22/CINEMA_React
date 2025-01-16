import React, { useEffect, useState } from 'react'
import './MovieInfoForm.css'

const MovieInfoForm = ({ movie, castList, stilList, history, tab, page, average}) => {
    const [averageRating, setAverageRating] = useState(average);
    const [selectedTab, setSelectedTab] = useState(tab);
    const [rating, setRating] = useState(0);
    const [reviewContent, setReviewContent] = useState("");
    const [showAll, setShowAll] = useState(false); // State to track visibility of all stills
    const [selectedIndex, setSelectedIndex] = useState(null); // 선택된 이미지 인덱스
    const [showModal, setShowModal] = useState(false); // 모달 열림 여부

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

    const handleReviewSubmit = () => {
        // Logic to submit review
    };

    const handleReviewUpdate = () => {
        // Logic to update review
    };

    useEffect(() => {
        handleTabChange('content')
    }, [])
    

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
                        style={{ width: `${average * 20}%` }}>
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                    <div className="star-ratings-base space-x-2 text-lg">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
                    </div>
                </div>
                <p>({average.toFixed(1)})</p>
            </div>
            <button 
                className="btn btn-purple reserve-btn" 
                onClick={() => window.location.href = `/m/t?id=${movie.id}`}
            >
                예매하기
            </button>
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
                            {castList.filter(cast => cast.rule === 'director').map((cast, index) => (
                                <div className="col-md-3 d-flex" key={index}>
                                    <img src={`/api/files/img?id=${cast.files.id}`} className="thumbnail" alt={cast.name} />
                                    <div className="mt-3 ms-3 w-100">
                                        <p className="mb-3" style={{ marginBottom: 0 }}>{cast.name}</p>
                                        <hr className="mb-3" style={{ borderWidth: '2px 0 0 0', borderStyle: 'dotted', borderColor: 'gray' }} />
                                        {history
                                            .filter(subHis => subHis[0]?.name === cast.name)
                                            .map((subHis, index) => (
                                                subHis.map(ssub => (
                                                    <a key={index} href={`/movie/movieInfo?id=${ssub.movie.id}`}>
                                                        <p style={{ marginBottom: 0, color: 'black', fontSize: '13px' }}>{ssub.movie.title}</p>
                                                    </a>
                                                ))
                                            ))}
                                    </div>
                                </div>
                            ))}
                            <h4>출연</h4>
                            {castList.filter(cast => cast.rule === 'actor').map((cast, index) => (
                                <div className="col-md-3 d-flex" style={{ marginTop: '20px' }} key={index}>
                                    <img src={`/api/files/img?id=${cast.files.id}`} className="thumbnail" alt={cast.name} />
                                    <div className="mt-3 ms-3 w-100">
                                        <p className="mb-3" style={{ marginBottom: 0 }}>{cast.name}</p>
                                        <hr className="mb-3" style={{ borderWidth: '2px 0 0 0', borderStyle: 'dotted', borderColor: 'gray' }} />
                                        {history
                                            .filter(subHis => subHis[0]?.name === cast.name)
                                            .map((subHis, index) => (
                                                subHis.map(ssub => (
                                                    <a key={index} href={`/movie/movieInfo?id=${ssub.movie.id}`}>
                                                        <p style={{ marginBottom: 0, color: 'black', fontSize: '13px' }}>{ssub.movie.title}</p>
                                                    </a>
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
                            {/* showAll 상태에 따라 처음 8개 또는 모든 이미지를 렌더링 */}
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
                    {/* 스틸컷이 8개 초과일 때만 '더보기' 버튼을 보이도록 함 */}
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
                                                        style={{ objectFit: 'contain', width: '100%', height: 'auto' }} // object-fit: contain 추가
                                                    />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* 닫기 버튼 */}
                        <button type="button" className="custom-close-btn" onClick={handleCloseModal} aria-label="Close">
                            <span>&times;</span>
                        </button>

                        {/* 캐러셀 컨트롤 */}
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
                        <div className="d-flex justify-content-between align-items-center">
                            <h3 className="ms-3 mb-4">평점 / 리뷰</h3>
                            <button className="btn btn-purple insert-review" id="insertReviewButton">
                                평점작성
                            </button>
                        </div>
                        <div id="review-section"></div>
                        <div className="modal" id="ratingModal" tabIndex="-1" aria-labelledby="ratingModalLabel" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-centered" style={{ width: '600px' }}>
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="ratingModalLabel">평점 작성</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body pe-4 ps-4">
                                        <h3 className="text-center">{movie.title}</h3>
                                        <div className="text-center mb-3">
                                            <div className="star-rating" id="star-rating-1">
                                                {[1, 2, 3, 4, 5].map(value => (
                                                    <span 
                                                        key={value} 
                                                        className={`star ${rating >= value ? 'selected' : ''}`} 
                                                        data-value={value} 
                                                        onClick={() => handleRatingChange(value)}
                                                    >
                                                        &#9733;
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <textarea 
                                                className="form-control" 
                                                id="content" 
                                                maxLength="68" 
                                                value={reviewContent} 
                                                onChange={(e) => setReviewContent(e.target.value)}
                                                rows="3" 
                                                style={{ resize: 'none' }} 
                                                required
                                            ></textarea>
                                        </div>
                                        <div className="modal-footer pe-0 ps-0">
                                            <button 
                                                type="button" 
                                                className="btn btn-purple me-0" 
                                                onClick={handleReviewSubmit} 
                                                data-bs-dismiss="modal"
                                            >
                                                작성완료
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
export default MovieInfoForm