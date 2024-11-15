package com.aloha.movieproject.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.movieproject.domain.Inquiry;

@Mapper
public interface InquiryMapper {
    public List<Inquiry> list(@Param("option")int option
    ,@Param("keyword") String keyword);
    public int insert(Inquiry inquiry);
    public int update(Inquiry inquiry);
    public int delete(String id);
    public Inquiry select(String id);
    public int replyUpdate(Inquiry inquiry);
    public int replyDelete(String id);
    public List<Inquiry> inquiries(@Param("option")int option
    ,@Param("keyword") String keyword,@Param("username") String username );
}
