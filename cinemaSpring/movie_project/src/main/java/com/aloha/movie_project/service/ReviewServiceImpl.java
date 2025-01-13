package com.aloha.movie_project.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.aloha.movie_project.domain.ReviewInfo;
import com.aloha.movie_project.mapper.ReviewMapper;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    ReviewMapper reviewMapper;

    @Override
    public int insertReview(String id, String movieId, String userId, String content) {
        return reviewMapper.insertReview(id, movieId, userId, content);
    }

    @Override
    public int insertRating(String id, String reviewId, String userId, int ratingValue) {
        return reviewMapper.insertRating(id,reviewId, userId, ratingValue);
    }

    @Override
    public int updateReview(String id, String content) {
        return reviewMapper.updateReview(id, content);
    }

    @Override
    public int updateRating(String id, int ratingValue) {
        return reviewMapper.updateRating(id, ratingValue);
    }

    @Override
    public int deleteReview(String id) {
        return reviewMapper.deleteReview(id);
    }

    @Override
    public int deleteRating(String id) {
        return reviewMapper.deleteRating(id);
    }

    @Override
    public PageInfo<ReviewInfo> reviewList(String id, int page, int size, int count) throws Exception {
        if(count>0){
            int offset = (page == 1) ? 0 : 5 + (page - 2) * 6; // 오프셋 계산
            PageHelper.offsetPage(offset, size);
        }else{
            PageHelper.startPage(page, size);
        }
        List<ReviewInfo> reviewList = reviewMapper.reviewList(id);
        PageInfo<ReviewInfo> pageInfo = new PageInfo<ReviewInfo>(reviewList, 5);
        return pageInfo;
    }

    @Override
    public ReviewInfo select(String id, String username) {
        ReviewInfo reviewInfo = reviewMapper.select(id, username);
        return reviewInfo;
    }
    
    @Override
    public PageInfo<ReviewInfo> adminReviewList(int page, int size) throws Exception {
        PageHelper.startPage(page, size);
        List<ReviewInfo> reviewList = reviewMapper.adminReviewList();
        PageInfo<ReviewInfo> pageInfo = new PageInfo<ReviewInfo>(reviewList, 5);
        return pageInfo;
    }

    @Override
    public PageInfo<ReviewInfo> adminReviewList(String search, int page, int size) throws Exception {
        PageHelper.startPage(page, size);
        List<ReviewInfo> reviewList = reviewMapper.searchAdminReviewList(search);
        PageInfo<ReviewInfo> pageInfo = new PageInfo<ReviewInfo>(reviewList, 5);
        return pageInfo;
    }

    @Override
    public int countUserReviews(String userId) {
        return reviewMapper.countUserReviews(userId);
    }

    
}
