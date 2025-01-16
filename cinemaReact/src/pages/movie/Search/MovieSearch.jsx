import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import MovieSearchForm from '../../../components/movie/Search/MovieSearchForm';
import * as movie from '../../../apis/movie';

const MovieSearch = () => {
    const [moviePageInfo, setMoviePageInfo] = useState({ list: [] });
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const location = useLocation();

    const getMovieChart = async (page = 1, search = '') => {
        try {
            const response = await movie.movieSearch(page, search);
            const data = response.data;
            setMoviePageInfo(data.moviePageInfo);
        } catch (error) {
            console.error('영화 차트를 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const newPage = query.get('page') ?? 1;
        const newSearch = query.get('search') ?? '';

        setPage(Number(newPage));
        setSearch(newSearch);

        getMovieChart(Number(newPage), newSearch);
    }, [location.search]);

    return (
        <>
            <MovieSearchForm moviePageInfo={moviePageInfo} search={search} />
        </>
    );
};

export default MovieSearch;
