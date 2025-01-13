package com.aloha.movie_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.AuthList;
import com.aloha.movie_project.mapper.AuthListMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service("AuthListService")
public class AuthListServiceImpl implements AuthListService  {

    @Autowired
    private AuthListMapper authListMapper;


    @Override
    public int insert(AuthList authList) throws Exception {
        int result = authListMapper.insert(authList);
        return result;
    }

    @Override
    public List<AuthList> list() throws Exception {
        List<AuthList> list = authListMapper.list();
        return list;
    }
    /**
     * 페이징 목록 조회
     */
    @Override
    public PageInfo<AuthList> list(int page, int size) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<AuthList> list = authListMapper.list();
        
        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<AuthList> pageInfo = new PageInfo<AuthList>(list, 5);
        return pageInfo;
    }

    @Override
    public PageInfo<AuthList> list(int page, int size, String search) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<AuthList> list = authListMapper.search(search);

        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<AuthList> pageInfo = new PageInfo<AuthList>(list, 5);
        return pageInfo;
    }

    @Override
    public int delete(int no) throws Exception {
        int result = authListMapper.delete(no);
        return result;
    }



    
}
