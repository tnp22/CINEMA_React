package com.aloha.movie_project.service.banner;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.Banner;
import com.aloha.movie_project.mapper.BannerMapper;

@Service
public class BannerServiceImpl implements BannerService {

    @Autowired
    private BannerMapper bannerMapper;

    @Override
    public int insert(Banner banner) throws Exception {
        int result = bannerMapper.insert(banner);
        return result;
    }

    @Override
    public List<Banner> list() throws Exception {
        List<Banner> bannerList = bannerMapper.list();
        return bannerList;
    }

    @Override
    public List<Banner> mainBannerList() throws Exception {
        List<Banner> bannerList = bannerMapper.mainBannerList();
        return bannerList;
    }

    @Override
    public Banner select(String id) throws Exception {
        Banner banner = bannerMapper.select(id);
        return banner;
    }

    @Override
    public List<Banner> subBannerList() throws Exception {
        List<Banner> bannerList = bannerMapper.subBannerList();
        return bannerList;
    }

    @Override
    public int update(Banner banner) throws Exception {
        int result = bannerMapper.update(banner);
        return result;
    }

    @Override
    public int delete(String id) throws Exception {
        int result = bannerMapper.delete(id);
        return result;
    }
    
}
