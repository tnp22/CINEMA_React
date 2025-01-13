package com.aloha.movie_project.service.banner;

import java.util.List;

import com.aloha.movie_project.domain.Banner;

public interface BannerService {
    
    // 메인 배너 리스트 조회
    public List<Banner> mainBannerList() throws Exception;
    // 서브 배너 리스트 조회
    public List<Banner> subBannerList() throws Exception;
    // 조회
    public Banner select(String id) throws Exception;
    // 생성
    public int insert(Banner banner) throws Exception;
    // 수정
    public int update(Banner banner) throws Exception;
    // 삭제
    public int delete(String id) throws Exception;
    // 리스트 조회
    public List<Banner> list() throws Exception;
}
