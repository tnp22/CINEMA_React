package com.aloha.movie_project.service.cinema;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.Cinema;
import com.aloha.movie_project.domain.Theater;
import com.aloha.movie_project.domain.UserAuth;
import com.aloha.movie_project.mapper.CinemaMapper;
import com.aloha.movie_project.mapper.TheaterMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@Service("TheaterService")
public class TheaterServiceImpl implements TheaterService {

    @Autowired
    private TheaterMapper theaterMapper;

    @Autowired
    private CinemaMapper cinemaMapper;

    @Override
    public int insert(Theater theater) throws Exception {
        int result = theaterMapper.insert(theater);
        return result;
    }

    @Override
    public Theater select(String id) throws Exception {
        Theater theater = theaterMapper.select(id);
        return theater;
    }

    @Override
    public int update(Theater theater) throws Exception {
        int result = theaterMapper.update(theater);
        return result;
    }

    @Override
    public List<Theater> list(String search) throws Exception {

        List<Theater> list = theaterMapper.search(search);
        
        return list;
    }

    @Override
    public PageInfo<Theater> list(int page, int size, String search) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Theater> list = theaterMapper.search(search);

        // ⭐ PageInfo<Board>( 리스트, 노출 페이지 개수 )
        PageInfo<Theater> pageInfo = new PageInfo<Theater>(list, 5);
        return pageInfo;
    }

    @Override
    public boolean isOwner(String id,List<UserAuth> authList) throws Exception {
        if (id == null || authList == null) {
            log.info("id null!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            return false;
        }
        Cinema cinema = cinemaMapper.select(id);
        boolean rs = false;
        for (UserAuth userAuth : authList) {
            if(cinema.getAuth().equals(userAuth.getAuth())){
                rs = true;
            }
        }
        return rs;
    }
}
