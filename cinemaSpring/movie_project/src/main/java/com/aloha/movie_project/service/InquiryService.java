package com.aloha.movie_project.service;

import java.util.List;

import org.apache.ibatis.annotations.Param;

import com.aloha.movie_project.domain.Inquiry;
import com.github.pagehelper.PageInfo;

public interface InquiryService {
    public PageInfo<Inquiry> list(int page, int size, int option, String keyword);
    public int insert(Inquiry inquiry);
    public int update(Inquiry inquiry);
    public int delete(String id);
    public Inquiry select(String id);
    public int replyUpdate(Inquiry inquiry);
    public int replyDelete(String id);
    public PageInfo<Inquiry> inquiries(int page, int size, int option, String keyword, String username );
}
