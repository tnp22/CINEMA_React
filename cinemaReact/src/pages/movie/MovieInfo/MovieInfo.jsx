import React, { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom';
import MovieInfoForm from '../../../components/movie/MovieInfo/MovieInfoForm';
import * as movies from '../../../apis/movie';

const MovieInfo = () => {
    const [id, setId] = useState("")
    const [history, setHistory] = useState([]);
    const [movie, setMovie] = useState()
    const [castList, setCastList] = useState()
    const [stilList, setStilList] = useState()
    const [tab, setTab] = useState()
    const [average, setAverage] = useState()
    const [page, setPage] = useState('');
    const location = useLocation();

    const getMovieInfo = async (id) => {
        try {
            const response = await movies.movieInfo(id);
            const data = response.data;
            setHistory(data.history);
            setMovie(data.movie);
            setCastList(data.castList);
            setStilList(data.stilList);
            setTab(data.tab);
            setAverage(data.average);
            setPage(data.page);
        } catch (error) {
            console.error('영화 차트를 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        // location.search에서 id를 추출
        const query = new URLSearchParams(location.search);
        const newId = query.get('id') ?? '';

        setId(newId); // id를 상태에 설정

    }, [location.search]); // location.search가 변경될 때마다 실행

    useEffect(() => {
        if (id) {
            getMovieInfo(id); // id가 존재하면 API 호출
        }
    }, [id]); // id가 변경될 때마다 API 호출
  return (
    <>
        <MovieInfoForm history={history}
                       movie={movie}
                       castList={castList}
                       stilList={stilList}
                       tab={tab}
                       average={average}
                       page={page}/>
    </>
  )
}

export default MovieInfo