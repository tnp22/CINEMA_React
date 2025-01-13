package com.aloha.movie_project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.movie_project.domain.Cast;

@Mapper
public interface CastMapper {
    public List<Cast> castList(String id) throws Exception;


    // 조회
    public Cast select(String id) throws Exception;
    // 생성
    public int insert(Cast movie) throws Exception;
    // 수정
    public int update(Cast movie) throws Exception;
    // 삭제
    public int delete(String id) throws Exception;

    // 리스트 조회
    public List<Cast> list() throws Exception;

    // 출연작 조회
    public List<Cast> history(String name) throws Exception;

    // 리스트 검색 조회
    public List<Cast> search(String search) throws Exception;

}
