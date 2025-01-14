import React from 'react'
import Header from '../components/Layout/Header'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeForm from '../components/Home/HomeForm';
import Footer from '../components/Layout/Footer';

const Home = () => {

  const bannerList = [
    { movie: { id: 1 }, files: { id: "banner1.png" } },
    { movie: { id: 2 }, files: { id: "banner2.png" } },
    { movie: { id: 3 }, files: { id: "banner3.png" } },
  ];

  const moviePageInfo = {
    list: [
      { id: 1, title: "영화 1", files: { id: "movie1.png" } },
      { id: 2, title: "영화 2", files: { id: "movie2.png" } },
      { id: 3, title: "영화 3", files: { id: "movie3.png" } },
      { id: 4, title: "영화 4", files: { id: "movie4.png" } },
      { id: 5, title: "영화 5", files: { id: "movie5.png" } },
      { id: 6, title: "영화 6", files: { id: "movie6.png" } },
      { id: 7, title: "영화 1", files: { id: "movie1.png" } },
      { id: 8, title: "영화 2", files: { id: "movie2.png" } },
      { id: 9, title: "영화 3", files: { id: "movie3.png" } },
      { id: 10, title: "영화 4", files: { id: "movie4.png" } },
      { id: 11, title: "영화 5", files: { id: "movie5.png" } },
      { id: 12, title: "영화 6", files: { id: "movie6.png" } }
    ],
  };

  const expectPageInfo = {
    list: [
      { id: 7, title: "예정작 1", files: { id: "expect1.png" } },
      { id: 8, title: "예정작 2", files: { id: "expect2.png" } },
      { id: 9, title: "예정작 3", files: { id: "expect3.png" } },
      { id: 10, title: "예정작 4", files: { id: "expect4.png" } },
      { id: 11, title: "예정작 5", files: { id: "expect5.png" } },
      { id: 12, title: "예정작 6", files: { id: "expect6.png" } },
      { id: 13, title: "예정작 1", files: { id: "expect1.png" } },
      { id: 14, title: "예정작 2", files: { id: "expect2.png" } },
      { id: 15, title: "예정작 3", files: { id: "expect3.png" } },
      { id: 16, title: "예정작 4", files: { id: "expect4.png" } },
      { id: 17, title: "예정작 5", files: { id: "expect5.png" } },
      { id: 18, title: "예정작 6", files: { id: "expect6.png" } }
    ],
  };

  const noticeList = [
    { id: 1, title: "공지사항 1" },
    { id: 2, title: "공지사항 2" },
  ];

  const subBannerList = [
    { files: { id: "sub-banner1.png" } },
    { files: { id: "sub-banner2.png" } },
  ];

  const isAuthenticated = true; // 예시 로그인 상태
  return (
    <>
        <HomeForm bannerList={bannerList}
        moviePageInfo={moviePageInfo}
        expectPageInfo={expectPageInfo}
        noticeList={noticeList}
        subBannerList={subBannerList}
        isAuthenticated={isAuthenticated}/>
    </>
  )
}

export default Home