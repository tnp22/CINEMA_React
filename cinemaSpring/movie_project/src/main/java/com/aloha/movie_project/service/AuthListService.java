package com.aloha.movie_project.service;

import java.util.List;

import com.aloha.movie_project.domain.AuthList;
import com.github.pagehelper.PageInfo;

public interface AuthListService {

    // 페이징 목록
    public PageInfo<AuthList> list(int page, int size) throws Exception;
    // 검색까지
    public PageInfo<AuthList> list(int page, int size,String search) throws Exception;
    // 권한 조회
    public List<AuthList> list() throws Exception;
    // 권한 생성
    public int insert(AuthList authList) throws Exception;

    public int delete(int no) throws Exception;  
}
