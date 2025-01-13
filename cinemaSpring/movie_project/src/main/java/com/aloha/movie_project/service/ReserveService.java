package com.aloha.movie_project.service;

import java.util.List;

import com.aloha.movie_project.domain.Reserve;
import com.github.pagehelper.PageInfo;

public interface ReserveService {
    // 예매등록
    public int insertReserve(Reserve reserve);

    // 좌석검색
    public List<Reserve> selectSeat(String theaterListId);

    // 예매 리스트
    public List<Reserve> selectUsername(String userName);

    // 페이징 목록
    public PageInfo<Reserve> selectUsername(int page, int size, String userName) throws Exception;

    // 예매 id 로 조회
    public Reserve searchReserve(String id);
    
    // 예매 수 계산
    public int selectReservationCountByUsername(String username);

    // 예매 id 로 삭제
    public int delectReserve(String id);
  
    public boolean isOwner(String id,String userid) throws Exception;

}
