package com.aloha.movie_project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.movie_project.domain.Notice;

@Mapper
public interface NoticeMapper {
    public List<Notice> list(@Param("option")int option
    ,@Param("keyword") String keyword);
    public List<Notice> mainNotice();
    public Notice select(String id);
    public int insert(Notice notice);
    public int update(Notice notice);
    public int delete(String id);
    public int addView(String id);
    public Notice before(String id);
    public Notice after(String id);
}
