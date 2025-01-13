package com.aloha.movie_project.service;

import java.util.List;

import com.aloha.movie_project.domain.Cast;
import com.github.pagehelper.PageInfo;

public interface CastService {
    public List<Cast> castList(String id) throws Exception;


    // 조회
    public Cast select(String id) throws Exception;
    // 생성
    public int insert(Cast movie) throws Exception;
    // 수정
    public int update(Cast movie) throws Exception;
    // 삭제
    public int delete(String id) throws Exception;

    // 출연작 조회
    public List<Cast> history(String name) throws Exception;

    //페이징 목록
    public PageInfo<Cast> list(int page, int size) throws Exception;
    // 검색까지
    public PageInfo<Cast> list(int page, int size,String search) throws Exception;
}
