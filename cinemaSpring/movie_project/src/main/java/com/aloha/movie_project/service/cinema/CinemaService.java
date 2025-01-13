package com.aloha.movie_project.service.cinema;

import java.util.List;

import com.aloha.movie_project.domain.Cinema;
import com.github.pagehelper.PageInfo;

public interface CinemaService {
    
    // 조회
    public Cinema select(String id) throws Exception;

    // 생성
    public int insert(Cinema user) throws Exception;

    // 수정
    public int update(Cinema user) throws Exception;

    // 페이징 목록
    public PageInfo<Cinema> list(int page, int size) throws Exception;
    // 검색까지
    public PageInfo<Cinema> list(int page, int size,String search) throws Exception;
    // 리스트 조회
    public List<Cinema> list() throws Exception;
}
