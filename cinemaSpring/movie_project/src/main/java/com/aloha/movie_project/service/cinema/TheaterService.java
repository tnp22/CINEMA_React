package com.aloha.movie_project.service.cinema;

import java.util.List;

import com.aloha.movie_project.domain.Theater;
import com.aloha.movie_project.domain.UserAuth;
import com.github.pagehelper.PageInfo;

public interface TheaterService {
    
    // 조회
    public Theater select(String id) throws Exception;

    // 생성
    public int insert(Theater theater) throws Exception;

    // 수정
    public int update(Theater theater) throws Exception;

    public List<Theater> list(String search) throws Exception;

    // 검색까지
    public PageInfo<Theater> list(int page, int size,String search) throws Exception;

    public boolean isOwner(String id,List<UserAuth> authList) throws Exception;
}
