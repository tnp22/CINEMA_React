package com.aloha.movie_project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;

import com.aloha.movie_project.domain.UserAuth;
import com.aloha.movie_project.domain.Users;

@Mapper
public interface UserMapper {

    // 회원 조회
    public Users select(String id) throws Exception;

    // 회원 가입
    public int join(Users user) throws Exception;

    // 회원 수정
    public int update(Users user) throws Exception;

    // 회원 비밀번호 수정
    public int updatePw(Users user) throws Exception;

    // 회원 이메일 수정
    public int updateEmail(Users user) throws Exception;

    // 회원 권한 등록
    public int insertAuth(UserAuth userAuth) throws Exception;

    // 회원 권한 삭제
    public int deleteAuth(int no) throws Exception;

    // 권한 조회
    public List<Users> list() throws Exception;
    // 권한 검색 조회
    public List<Users> search(String search) throws Exception;
}

