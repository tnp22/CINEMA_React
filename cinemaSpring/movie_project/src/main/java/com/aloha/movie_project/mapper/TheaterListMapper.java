package com.aloha.movie_project.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.movie_project.domain.TheaterList;

@Mapper
public interface TheaterListMapper {

    // 회원 조회
    public TheaterList select(String id) throws Exception;

    // 회원 가입
    public int insert(TheaterList theaterList) throws Exception;

    // 회원 수정
    public int update(TheaterList theaterList) throws Exception;

    // 권한 검색 조회
    public List<TheaterList> search(Map<String,String> map) throws Exception;
    public List<TheaterList> list(String keyword) throws Exception;

    public List<TheaterList> timeSearch(String keyword) throws Exception;
}
