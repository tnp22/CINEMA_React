import React, { useEffect, useState } from 'react';
import MovieChartForm from '../../../components/movie/MovieChart/MovieChartForm';
import * as movie from '../../../apis/movie';
import { useLocation } from 'react-router-dom';

const MovieChart = () => {
    const [moviePageInfo, setMoviePageInfo] = useState([]);
    const [expectPageInfo, setExpectPageInfo] = useState([]);
    const [moviePage, setMoviePage] = useState(1);
    const [expectPage, setExpectPage] = useState(1);
    
    const location = useLocation(); // location 객체 가져오기

    const [type, setType] = useState(''); // 기본값 설정
    const [page, setPage] = useState(1);
    const [otherPage, setOtherPage] = useState(1);

    // URL 쿼리 파라미터 업데이트 함수
    const updatePage = () => {
        const query = new URLSearchParams(location.search);
        const newTab = query.get('tab') ?? 'movie';  // 기본값 설정
        const newPage = query.get('page') ?? 1;
        const newOtherPage = query.get('otherPage') ?? 1;
        
        setType(newTab);
        setPage(Number(newPage));  // 쿼리 파라미터는 문자열이므로 숫자로 변환
        setOtherPage(Number(newOtherPage));  // 쿼리 파라미터는 문자열이므로 숫자로 변환
    };

    // 영화 차트 데이터 가져오기
    const getMovieChart = async (type, page, otherPage) => {
        try {
            const response = await movie.movieChart(type, page, otherPage);
            const data = response.data;
            setMoviePageInfo(data.moviePageInfo);
            setExpectPageInfo(data.expectPageInfo);
            setMoviePage(data.moviePage);
            setExpectPage(data.expectPage);
        } catch (error) {
            console.error('영화 차트를 가져오는 중 오류 발생:', error);
        }
    };

    // URL 쿼리 파라미터가 변경될 때마다 updatePage 호출
    useEffect(() => {
        updatePage();
    }, [location.search]);  // location.search가 변경될 때마다 updatePage 실행

    // 페이지 파라미터가 변경될 때마다 getMovieChart 호출
    useEffect(() => {
        console.log('영화차트 데이터 가져오는 중');
        console.log('type은 ' + type);
        console.log('page는 ' + page);
        console.log('otherPage는 ' + otherPage);
        
        getMovieChart(type, page, otherPage);
    }, [type, page, otherPage]);  // type, page, otherPage가 변경될 때마다 getMovieChart 실행

    return (
        <>
            <MovieChartForm 
                moviePageInfo={moviePageInfo}
                expectPageInfo={expectPageInfo}
                moviePage={moviePage}
                expectPage={expectPage} 
            />
        </>
    );
}

export default MovieChart;
