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
            console.dir(data.movie)
            console.dir(data.stilList)
        } catch (error) {
            console.error('영화 차트를 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const newId = query.get('id') ?? '';

        setId(newId);

        getMovieInfo(id);
    }, [id]);
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