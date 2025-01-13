package com.aloha.movie_project.service;

import java.util.List;

import com.aloha.movie_project.domain.Notice;
import com.github.pagehelper.PageInfo;

public interface NoticeService {
    public PageInfo<Notice> list(int page, int size, int option, String keyword);
    public List<Notice> mainNotice();
    public Notice select(String id);
    public int insert(Notice notice);
    public int update(Notice notice);
    public int delete(String id);
    public int addView(String id);
    public Notice before(String id);
    public Notice after(String id);
}
