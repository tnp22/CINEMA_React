package com.aloha.movie_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.Inquiry;
import com.aloha.movie_project.mapper.InquiryMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

@Service
public class InquiryServiceImpl implements InquiryService {

    @Autowired
    InquiryMapper inquiryMapper;

    @Override
    public PageInfo<Inquiry> list(int page, int size, int option, String keyword) {
        PageHelper.startPage(page,size);
        List<Inquiry> inquiryList = inquiryMapper.list(option, keyword);
        PageInfo<Inquiry> pageInfo = new PageInfo<Inquiry>(inquiryList, 10);
        return pageInfo;
    }

    @Override
    public int insert(Inquiry inquiry) {
        return inquiryMapper.insert(inquiry);
    }

    @Override
    public int update(Inquiry inquiry) {
        return inquiryMapper.update(inquiry);
    }

    @Override
    public int delete(String id) {
        return inquiryMapper.delete(id);
    }

    @Override
    public Inquiry select(String id) {
        return inquiryMapper.select(id);
    }

    @Override
    public int replyUpdate(Inquiry inquiry) {
        return inquiryMapper.replyUpdate(inquiry);
    }

    @Override
    public int replyDelete(String id) {
        return inquiryMapper.replyDelete(id);
    }

    @Override
    public PageInfo<Inquiry> inquiries(int page, int size, int option, String keyword, String username) {
        PageHelper.startPage(page,size);
        List<Inquiry> inquiryList = inquiryMapper.inquiries(option,keyword,username);
        PageInfo<Inquiry> pageInfo = new PageInfo<Inquiry>(inquiryList, 10);
        return pageInfo;
    }
    
}
