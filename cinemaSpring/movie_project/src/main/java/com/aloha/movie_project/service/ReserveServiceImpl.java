package com.aloha.movie_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.Reserve;
import com.aloha.movie_project.mapper.ReserveMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;



@Slf4j
@Service
public class ReserveServiceImpl implements ReserveService {

    @Autowired
    ReserveMapper reserveMapper;

    @Override
    public int insertReserve(Reserve reserve) {
        int reuslt = reserveMapper.insertReserve(reserve);
        return reuslt;
    }

    @Override
    public List<Reserve> selectSeat(String theaterListId) {
        return reserveMapper.selectSeat(theaterListId);
    }

    @Override
    public List<Reserve> selectUsername(String userName) {
        return reserveMapper.selectUsername(userName);
    }

    @Override
    public PageInfo<Reserve> selectUsername(int page, int size, String userName) throws Exception {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Reserve> movieList = reserveMapper.selectUsername(userName);

        // ⭐ PageInfo( 리스트, 노출 페이지 개수 )
        PageInfo<Reserve> pageInfo = new PageInfo<Reserve>(movieList, 10);
        return pageInfo;
    }

    @Override
    public Reserve searchReserve(String id) {
        return reserveMapper.searchReserve(id);
    }

    @Override
    public int selectReservationCountByUsername(String username) {
        try {
            return reserveMapper.selectReservationCountByUsername(username);
        } catch (Exception e) {
            // 예외 로깅 또는 사용자 친화적인 메시지 처리
            e.printStackTrace();
            throw new RuntimeException("Error retrieving reservation count", e);
        }
    }
    public int delectReserve(String id) {
        return reserveMapper.delectReserve(id);

    }

    @Override
    public boolean isOwner(String id, String userid) throws Exception {
        if (id == null || userid == null) {
            log.info("id null!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
            return false;
        }
        Reserve reserve = reserveMapper.searchReserve(id);
        boolean rs = false;
        if(reserve.getUserName().equals(userid)){
            rs=true;
        }
        return rs;
    }

}
