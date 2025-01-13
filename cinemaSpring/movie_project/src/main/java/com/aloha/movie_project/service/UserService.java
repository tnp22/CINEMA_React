package com.aloha.movie_project.service;

import java.util.List;

import com.aloha.movie_project.domain.UserAuth;
import com.aloha.movie_project.domain.Users;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.http.HttpServletRequest;

public interface UserService {
    
    public boolean login(Users user, HttpServletRequest request) throws Exception;
    // 조회
    public Users select(String username) throws Exception;

    // 회원 가입
    public int join(Users user) throws Exception;

    // 회원 수정
    public int update(Users user) throws Exception;

    // 회원 권한 등록
    public int insertAuth(UserAuth userAuth) throws Exception;

    // 회원 권한 삭제
    public int deleteAuth(int no) throws Exception;

    // 회원 수정
    public int updatePw(Users user) throws Exception;

    // 이메일 수정
    public int updateEmail(Users user) throws Exception;
    
    // 페이징 목록
    public PageInfo<Users> list(int page, int size) throws Exception;
    // 검색까지
    public PageInfo<Users> list(int page, int size,String search) throws Exception;
    // 권한 조회
    public List<Users> list() throws Exception;
}
