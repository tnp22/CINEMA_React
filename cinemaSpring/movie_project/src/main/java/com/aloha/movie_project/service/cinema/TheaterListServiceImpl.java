package com.aloha.movie_project.service.cinema;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.TheaterList;
import com.aloha.movie_project.mapper.TheaterListMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@Service
public class TheaterListServiceImpl implements TheaterListService {

    @Autowired
    private TheaterListMapper theaterListMapper;

    @Override
    public int insert(TheaterList theater) throws Exception {
        int result = theaterListMapper.insert(theater);
        return result;
    }

    @Override
    public TheaterList select(String id) throws Exception {
        TheaterList theaterList = theaterListMapper.select(id);
        return theaterList;
    }

    @Override
    public int update(TheaterList theater) throws Exception {
        int result = theaterListMapper.update(theater);
        return result;
    }

    @Override
    public PageInfo<TheaterList> list(int page, int size, String id, String search) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);

        Map<String, String> parameters = new HashMap<>();
        parameters.put("keyword1", id);
        parameters.put("keyword2", search);

        List<TheaterList> list = theaterListMapper.search(parameters);

        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<TheaterList> pageInfo = new PageInfo<TheaterList>(list, 5);
        return pageInfo;
    }

    @Override
    public PageInfo<TheaterList> list(int page, int size, String id) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);

        List<TheaterList> list = theaterListMapper.list(id);

        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<TheaterList> pageInfo = new PageInfo<TheaterList>(list, 5);
        return pageInfo;
    }

    @Override
    public List<TheaterList> timeSearch(String id) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);


        List<TheaterList> list = theaterListMapper.timeSearch(id);

        return list;
    }
}
