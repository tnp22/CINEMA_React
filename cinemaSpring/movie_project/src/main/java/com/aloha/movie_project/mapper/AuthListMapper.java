package com.aloha.movie_project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.movie_project.domain.AuthList;

@Mapper
public interface AuthListMapper {
    
    // 권한 조회
    public List<AuthList> list() throws Exception;
    // 권한 검색 조회
    public List<AuthList> search(String search) throws Exception;

    // 권한 생성
    public int insert(AuthList authList) throws Exception;

    public int delete(int no) throws Exception;    
}
