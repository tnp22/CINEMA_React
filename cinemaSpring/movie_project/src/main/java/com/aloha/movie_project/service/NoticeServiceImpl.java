package com.aloha.movie_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.Notice;
import com.aloha.movie_project.mapper.NoticeMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@Service
public class NoticeServiceImpl implements NoticeService{

    @Autowired
    NoticeMapper noticeMapper;

    @Override
    public PageInfo<Notice> list(int page, int size, int option, String keyword) {
        // ⭐ PageHelper.startPage(현재 페이지, 페이지당 게시글 수);
        PageHelper.startPage(page, size);
        List<Notice> noticeList = noticeMapper.list(option, keyword);
        
        // ⭐ PageInfo( 리스트, 노출 페이지 개수 )
        PageInfo<Notice> pageInfo = new PageInfo<Notice>(noticeList, 10);
        return pageInfo;
    }

    @Override
    public Notice select(String id) {
        return noticeMapper.select(id);
    }

    @Override
    public int insert(Notice notice) {
        return noticeMapper.insert(notice);
    }

    @Override
    public int update(Notice notice) {
        return noticeMapper.update(notice);
    }

    @Override
    public int delete(String id) {
        return noticeMapper.delete(id);
    }

    @Override
    public List<Notice> mainNotice() {
        return noticeMapper.mainNotice();
    }

    @Override
    public int addView(String id) {
        return noticeMapper.addView(id);
    }

    @Override
    public Notice before(String id) {
        return noticeMapper.before(id);
    }

    @Override
    public Notice after(String id) {
        return noticeMapper.after(id);
    }
    
}
