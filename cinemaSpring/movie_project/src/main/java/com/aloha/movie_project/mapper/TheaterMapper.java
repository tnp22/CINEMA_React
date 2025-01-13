package com.aloha.movie_project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.movie_project.domain.Theater;

@Mapper
public interface TheaterMapper {
    // 조회
    public Theater select(String id) throws Exception;
    // 생성
    public int insert(Theater cinema) throws Exception;
    // 수정
    public int update(Theater cinema) throws Exception;
    // 삭제
    
    // 리스트 검색 조회
    public List<Theater> search(String search) throws Exception;
    
}
