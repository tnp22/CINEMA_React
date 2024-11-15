import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import HomeForm from '../components/Home/HomeForm';
import * as movie from '../apis/movie'

const Home = () => {
  const [moviePageInfo, setMoviePageInfo] = useState([]);
  const [expectPageInfo, setExpectPageInfo] = useState([]);
  const [bannerList, setBannerList] = useState([]);
  const [subBannerList, setSubBannerList] = useState([]);
  const [noticeList, setNoticeList] = useState([]);


  // 게시글 목록 데이터를 가져오는 함수
  const getList = async () => {
    try {     
      const response = await movie.list();
      const data = response.data;
      setMoviePageInfo(data.moviePageInfo);
      setExpectPageInfo(data.expectPageInfo);
      setBannerList(data.bannerList);
      setSubBannerList(data.subBannerList);
      setNoticeList(data.noticeList);
    } catch (error) {
      console.error('목록 데이터를 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    getList();
  }, []);
  
  return (
    <>
        <HomeForm moviePageInfo={moviePageInfo} 
                  expectPageInfo={expectPageInfo} 
                  noticeList={noticeList} 
                  bannerList={bannerList} 
                  subBannerList={subBannerList} />
    </>
  )
}

export default Home