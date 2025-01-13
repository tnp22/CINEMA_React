package com.aloha.movie_project.service.cinema;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.Cinema;
import com.aloha.movie_project.mapper.CinemaMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@Service
public class CinemaServiceImpl implements CinemaService {

    @Autowired
    private CinemaMapper cinemaMapper;

    @Override
    public int insert(Cinema cinema) throws Exception {
        int result = cinemaMapper.insert(cinema);
        return result;
    }

    @Override
    public Cinema select(String id) throws Exception {
        Cinema cinema = cinemaMapper.select(id);
        return cinema;
    }

    @Override
    public int update(Cinema cinema) throws Exception {
        int result = cinemaMapper.update(cinema);
        return result;
    }

    @Override
    public List<Cinema> list() throws Exception {
        List<Cinema> list = cinemaMapper.list();
        return list;
    }

    @Override
    public PageInfo<Cinema> list(int page, int size) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Cinema> list = cinemaMapper.list();
        
        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<Cinema> pageInfo = new PageInfo<Cinema>(list, 5);
        return pageInfo;
    }

    @Override
    public PageInfo<Cinema> list(int page, int size, String search) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Cinema> list = cinemaMapper.search(search);

        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<Cinema> pageInfo = new PageInfo<Cinema>(list, 5);
        return pageInfo;
    }



}
