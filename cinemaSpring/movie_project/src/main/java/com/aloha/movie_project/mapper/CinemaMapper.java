package com.aloha.movie_project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.movie_project.domain.Cinema;

@Mapper
public interface CinemaMapper {

    // 조회
    public Cinema select(String id) throws Exception;
    // 생성
    public int insert(Cinema cinema) throws Exception;
    // 수정
    public int update(Cinema cinema) throws Exception;
    // 삭제

    // 리스트 조회
    public List<Cinema> list() throws Exception;

    // 리스트 검색 조회
    public List<Cinema> search(String search) throws Exception;
}
