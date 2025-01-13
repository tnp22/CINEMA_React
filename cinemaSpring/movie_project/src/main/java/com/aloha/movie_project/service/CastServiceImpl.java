package com.aloha.movie_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.Cast;
import com.aloha.movie_project.mapper.CastMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@Service
public class CastServiceImpl implements CastService {

    @Autowired
    private CastMapper castMapper;

    @Override
    public List<Cast> castList(String id) throws Exception {
        List<Cast> castList = castMapper.castList(id);
        return castList;
    }

    @Override
    public int insert(Cast movie) throws Exception {
        int rs = castMapper.insert(movie);
        return rs;
    }

    @Override
    public PageInfo<Cast> list(int page, int size) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Cast> list = castMapper.list();
        
        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<Cast> pageInfo = new PageInfo<Cast>(list, 5);
        return pageInfo;
    }

    @Override
    public PageInfo<Cast> list(int page, int size, String search) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Cast> list = castMapper.search(search);

        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<Cast> pageInfo = new PageInfo<Cast>(list, 5);
        return pageInfo;
    }

    @Override
    public Cast select(String id) throws Exception {
        Cast cast = castMapper.select(id);
        return cast;
    }

    @Override
    public int update(Cast cast) throws Exception {
        int result = castMapper.update(cast);
        return result;
    }

    @Override
    public int delete(String id) throws Exception {
        int result = castMapper.delete(id);
        return result;
    }

    @Override
    public List<Cast> history(String name) throws Exception {
        List<Cast> rs = castMapper.history(name);
        return rs;
    }
    
}
