import './HomeForm.css'
import React, { useEffect, useRef, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const HomeForm = ({ bannerList, moviePageInfo, expectPageInfo, noticeList, subBannerList, isAuthenticated }) => {
    const scrollToTopBtnRef = useRef(null);

    useEffect(() => {
        const handleScroll = () => {
        // 스크롤 위치가 300px 이상이면 버튼 표시, 그렇지 않으면 숨김
        if (window.scrollY > 300) {
            scrollToTopBtnRef.current.style.display = "block";
        } else {
            scrollToTopBtnRef.current.style.display = "none";
        }
        };

        handleScroll();

        // 스크롤 이벤트 리스너 등록
        window.addEventListener("scroll", handleScroll);

        // 컴포넌트 언마운트 시 이벤트 리스너 제거
        return () => {
        window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    const scrollToTop = () => {
        // 부드럽게 상단으로 이동
        window.scrollTo({
        top: 0,
        behavior: "smooth",
        });
    };
      
    const [currentTab, setCurrentTab] = useState("movie-chart");
    const [sliderStates, setSliderStates] = useState({ "movie-slider": 0, "upcome-slider": 0 });
  
    // Slider navigation logic
    const handleSlide = (sliderId, direction) => {
      const visibleItems = 6;
      const totalItems = sliderId === "movie-slider" ? moviePageInfo.list.length : expectPageInfo.list.length;
      const slideCount = Math.ceil(totalItems / visibleItems);
      const currentSlide = sliderStates[sliderId];
  
      let newSlide = currentSlide;
      if (direction === "next" && currentSlide < slideCount - 1) {
        newSlide++;
      } else if (direction === "prev" && currentSlide > 0) {
        newSlide--;
      }
  
      setSliderStates((prev) => ({ ...prev, [sliderId]: newSlide }));
    };

  return (
    <div>
        <section className="banner">
            <div id="movie-slide" className="carousel slide" data-bs-ride="carousel">
                <div className="carousel-indicators">
                    <button type="button" data-bs-target="#movie-slide" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                    <button type="button" data-bs-target="#movie-slide" data-bs-slide-to="1" aria-label="Slide 2"></button>
                    <button type="button" data-bs-target="#movie-slide" data-bs-slide-to="2" aria-label="Slide 3"></button>
                </div>
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img src="/upload/banner1.png" alt="Banner 1" />
                    </div>
                    <div className="carousel-item">
                        <img src="/upload/banner2.png" alt="Banner 1" />
                    </div>
                    <div className="carousel-item">
                        <img src="/upload/banner3.png" alt="Banner 1" />
                    </div>
                </div>
                {/* <div className="carousel-indicators">
                    {bannerList.map((banner, index) => (
                    <button
                        key={index}
                        type="button"
                        data-bs-target="#movie-slide"
                        data-bs-slide-to={index}
                        className={index === 0 ? "active" : ""}
                        aria-current={index === 0 ? "true" : "false"}
                    ></button>
                    ))}
                </div>
                <div className="carousel-inner">
                    {bannerList.map((banner, index) => (
                    <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
                        <a href={`/movie/movieInfo?id=${banner.movie.id}`}>
                        <img src={`/img?id=${banner.files.id}`} alt={banner.files} />
                        </a>
                    </div>
                    ))}
                </div> */}
            </div>
        </section>
        {/* Tab Section */}
        <section className="container mb-5">
            <div className="nav nav-tabs" style={{ marginBottom: "20px", display: "flex", position: "relative" }}>
                <a
                    className={`nav-link ${currentTab === "movie-chart" ? "active" : ""}`}
                    onClick={() => setCurrentTab("movie-chart")}
                >
                    영화 차트
                </a>
                <h3 style={{ opacity: "50%" }}>│</h3>
                <a
                    className={`nav-link ${currentTab === "upcome-chart" ? "active" : ""}`}
                    onClick={() => setCurrentTab("upcome-chart")}
                >
                    상영 예정작
                </a>
                <a href="/movie/movieChart" className="btn all-button d-flex align-items-center" style={{ position: "absolute", right: 0 }}>
                    <span>전체보기</span>
                    <i className="bi bi-chevron-right"></i>
                </a>
            </div>
            <div className="tab-content">
                {currentTab === "movie-chart" && (
                    <div className="tab-pane show active" id="movie-chart">
                    <button
                        className={`slider-btn prev-btn ${sliderStates["movie-slider"] === 0 ? "hidden" : ""}`}
                        onClick={() => handleSlide("movie-slider", "prev")}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                    </button>
                    <div className="slider-wrapper">
                            <div className="row movie-chart slider" style={{ transform: `translateX(-${sliderStates["movie-slider"] * 100}%)` }}>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_bbo.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                            {/* {moviePageInfo.map((movie, index) => (
                                <div key={index} className="col">
                                <div className="image-container">
                                    <img src={`/img?id=${movie.files.id}`} alt={movie.title} />
                                    <div className="image-overlay">
                                    <a href={`/movie/movieInfo?id=${movie.id}`} className="info-btn">
                                        상세보기
                                    </a>
                                    <br />
                                    <br />
                                    <button
                                        className="reserve-btn"
                                        onClick={() => {
                                        if (isAuthenticated) {
                                            window.location.href = `/m/t?id=${movie.id}`;
                                        } else {
                                            alert("로그인 후 이용해 주세요.");
                                        }
                                        }}
                                    >
                                        예매하기
                                    </button>
                                    </div>
                                </div>
                                <p className="text-center mt-2">{movie.title}</p>
                                </div>
                            ))} */}
                            </div>
                    </div>
                    <button
                        className={`slider-btn next-btn ${sliderStates["movie-slider"] >= Math.ceil(moviePageInfo.list.length / 6) - 1 ? "hidden" : ""}`}
                        onClick={() => handleSlide("movie-slider", "next")}
                    >
                        <FontAwesomeIcon icon={faArrowRight} size="2x" />
                    </button>
                    </div>
                )}
                {/* Upcoming Chart */}
                {currentTab === "upcome-chart" && (
                    <div className="tab-pane show active" id="upcome-chart">
                    <button
                        className={`slider-btn prev-btn ${sliderStates["upcome-slider"] === 0 ? "hidden" : ""}`}
                        onClick={() => handleSlide("upcome-slider", "prev")}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} size="2x" />
                    </button>
                    <div className="slider-wrapper">
                        <div className="row movie-chart slider" style={{ transform: `translateX(-${sliderStates["upcome-slider"] * 100}%)` }}>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_snow.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_snow.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_snow.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_snow.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_snow.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_snow.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_hero.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_hero.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_hero.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_hero.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_hero.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                                <div className="col">
                                    <div className="image-container">
                                        <img src="/upload/movie_hero.png" alt="Banner 1" />
                                        <div className="image-overlay">
                                            <a className="info-btn">상세보기</a>
                                            <br/>
                                            <br/>
                                            <button className="reserve-btn">예매하기</button>
                                        </div>
                                    </div>
                                    <p className="text-center mt-2" th:text="${movie.title}"></p>
                                </div>
                            {/* {expectPageInfo.list.map((movie, index) => (
                                <div key={index} className="col">
                                <div className="image-container">
                                    <img src={`/img?id=${movie.files.id}`} alt={movie.title} />
                                    <div className="image-overlay">
                                    <a href={`/movie/movieInfo?id=${movie.id}`} className="info-btn">
                                        상세보기
                                    </a>
                                    <br />
                                    <br />
                                    <button
                                        className="reserve-btn"
                                        onClick={() => {
                                        if (isAuthenticated) {
                                            window.location.href = `/m/t?id=${movie.id}`;
                                        } else {
                                            alert("로그인 후 이용해 주세요.");
                                        }
                                        }}
                                    >
                                        예매하기
                                    </button>
                                    </div>
                                </div>
                                <p className="text-center mt-2">{movie.title}</p>
                                </div>
                            ))} */}
                        </div>
                    </div>
                    <button
                        className={`slider-btn next-btn ${sliderStates["upcome-slider"] >= Math.ceil(expectPageInfo.list.length / 6) - 1 ? "hidden" : ""}`}
                        onClick={() => handleSlide("upcome-slider", "next")}
                    >
                        <FontAwesomeIcon icon={faArrowRight} size="2x" />
                    </button>
                    </div>
                )}
            </div>
        </section>
        <section className="container mb-5">
            <h2 className="h4 mb-4">무비 스낵</h2>
            <div className="snack-list">
                <div className="snack">
                    <img src="/upload/snack1.png" alt="Banner 1" />
                    <div>
                        <span>보라</span> 팝콘 더블 세트
                        <h6>11,000원</h6>
                    </div>
                </div>
                <div className="snack">
                    <img src="/upload/snack2.png" alt="Banner 1" />
                    <div>
                        <span>보라</span> 칠리치즈 핫도그
                        <h6>5,500원</h6>
                    </div>
                </div>
            </div>
            <div className="snack-list">
                <div className="snack">
                    <img src="/upload/snack3.png" alt="Banner 1" />
                    <div>
                        <span>보라</span> 커플 세트
                        <h6>9,500원</h6>
                    </div>
                </div>
                <div className="snack">
                    <img src="/upload/snack4.png" alt="Banner 1" />
                    <div>
                        <span>보라</span> 플레인 핫도그
                        <h6>5,000원</h6>
                    </div>
                </div>
            </div>
            <div className="snack-list">
                <div className="snack">
                    <img src="/upload/snack5.png" alt="Banner 1" />
                    <div>
                        <span>보라</span> 나쵸칩
                        <h6>4,500원</h6>
                    </div>
                </div>
                <div className="snack">
                    <img src="/upload/snack6.png" alt="Banner 1" />
                    <div>
                        <span>보라</span> 아이스 아메리카노
                        <h6>3,500원</h6>
                    </div>
                </div>
            </div>
        </section>
        <section className="container mb-5">
            <div className="row g-6">
                <div className="col-md-7">
                <div className="box">
                    <div className="d-flex justify-content-between">
                    <h5 className="mb-3">공지사항</h5>
                    <a href="/notice/list">더보기</a>
                    </div>
                    <ul className="list-unstyled">
                    {/* {notices.map((notice) => (
                        <li key={notice.id}>
                        <a href={`/notice/select?id=${notice.id}`}>{notice.title}</a>
                        <span className="date">
                            {new Date(notice.regDate).toLocaleDateString("ko-KR")}
                        </span>
                        </li>
                    ))} */}
                    </ul>
                    <hr />
                    <h5>고객센터</h5>
                    <h6>전화번호 : 010-8753-8710</h6>
                    <h6>
                    고객센터 운영시간 : 평일 (09:00 - 18:00) / 주말 및 공휴일 (09:00 - 14:00)
                    </h6>
                </div>
                </div>
                <div className="col-md-4 image-box">
                    <img src="/upload/ad.png" alt="ad" style={{ width: '525px', height: '266px', overflow: 'hidden' }}/>
                    {/* <img
                    src={`/img?id=${banners[0].id}`}
                    alt={banners[0].alt}
                    style={{ width: "525px", height: "266px", overflow: "hidden" }}
                    /> */}
                </div>
            </div>
        </section>
        <button id="scrollToTopBtn" className="btn-float rounded-circle position-fixed" 
            ref={scrollToTopBtnRef}
            onClick={scrollToTop}
            style={{
                bottom: "50px",
                right: "110px"
            }}
            >
            <FontAwesomeIcon icon={faArrowUp} size="2x" />
        </button>
    </div>
  )
}

export default HomeForm