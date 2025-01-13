package com.aloha.movie_project.service.cinema;

import java.util.List;

import com.aloha.movie_project.domain.TheaterList;
import com.github.pagehelper.PageInfo;

public interface TheaterListService {

    // 조회
    public TheaterList select(String id) throws Exception;

    // 생성
    public int insert(TheaterList theater) throws Exception;

    // 수정
    public int update(TheaterList theater) throws Exception;

    public PageInfo<TheaterList> list(int page, int size,String id) throws Exception;

    // 검색까지
    public PageInfo<TheaterList> list(int page, int size,String id,String search) throws Exception;

    // 검색까지
    public List<TheaterList> timeSearch(String search) throws Exception;
    
}
