package com.aloha.movie_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.Files;
import com.aloha.movie_project.domain.Movie;
import com.aloha.movie_project.domain.ReviewInfo;
import com.aloha.movie_project.mapper.MovieMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@Service
public class MovieServiceImpl implements MovieService {

    @Autowired
    MovieMapper movieMapper;

    @Override
    public List<Movie> movieList() {
        List<Movie> movieList = movieMapper.movieList();
        return movieList;
    }

    @Override
    public List<Movie> expectList() {
        List<Movie> expectList = movieMapper.expectList();
        return expectList;
    }

    @Override
    public PageInfo<Movie> movieList(int page, int size) {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Movie> movieList = movieMapper.movieList();
        
        // ⭐ PageInfo( 리스트, 노출 페이지 개수 )
        PageInfo<Movie> pageInfo = new PageInfo<Movie>(movieList, 10);
        return pageInfo;
    }

    @Override
    public PageInfo<Movie> expectList(int page, int size) {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Movie> expectList = movieMapper.expectList();
        
        // ⭐ PageInfo( 리스트, 노출 페이지 개수 )
        PageInfo<Movie> pageInfo = new PageInfo<Movie>(expectList, 10);
        return pageInfo;
    }

    @Override
    public int insert(Movie movie) throws Exception {
        int result = movieMapper.insert(movie);
        return result;
    }

    @Override
    public List<Movie> list() throws Exception {
        List<Movie> list = movieMapper.list();
        return list;
    }

    //페이징 없는 검색
    @Override
    public List<Movie> list(String search) throws Exception {
        List<Movie> list = movieMapper.search(search);
        return list;
    }

    @Override
    public PageInfo<Movie> list(int page, int size) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Movie> list = movieMapper.list();
        
        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<Movie> pageInfo = new PageInfo<Movie>(list, 5);
        return pageInfo;
    }

    @Override
    public PageInfo<Movie> list(int page, int size, String search) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Movie> list = movieMapper.search(search);

        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<Movie> pageInfo = new PageInfo<Movie>(list, 5);
        return pageInfo;
    }



    @Override
    public Movie select(String id) throws Exception {
        Movie movie = movieMapper.select(id);
        return movie;
    }

    @Override
    public int update(Movie movie) throws Exception {
        int result = movieMapper.update(movie);
        return result;
    }

    @Override
    public List<Files> stilList(String id) throws Exception {
        List<Files> stilList = movieMapper.stilList(id);
        return stilList;
    }

    @Override
    public Movie movieInfo(String id) throws Exception {
        Movie movie = movieMapper.movieInfo(id);
        return movie;
    }

    

    
    
}
