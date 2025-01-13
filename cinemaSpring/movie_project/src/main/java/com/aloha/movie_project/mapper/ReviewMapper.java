package com.aloha.movie_project.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha.movie_project.domain.ReviewInfo;

@Mapper
public interface ReviewMapper {
    public int insertReview(@Param("id") String id
                            , @Param("movieId") String movieId
                            , @Param("userId") String userId
                            , @Param("content") String content);
    public int insertRating(@Param("id") String id
                            , @Param("reviewId") String reviewId
                            , @Param("userId") String userId
                            , @Param("ratingValue") int ratingValue);
    public int updateReview(@Param("id") String id, @Param("content") String content);
    public int updateRating(@Param("id") String id, @Param("ratingValue") int ratingValue);
    public int deleteReview(@Param("id") String id);
    public int deleteRating(@Param("id") String id);
    public ReviewInfo select(@Param("id") String id, @Param("username") String username);
    // 영화 상세정보 리뷰
    public List<ReviewInfo> reviewList(String id) throws Exception;

    // 어드민 영화 상세정보 리뷰
    public List<ReviewInfo> adminReviewList() throws Exception;

    // 어드민 영화 상세정보 리뷰
    public List<ReviewInfo> searchAdminReviewList(String search) throws Exception;


    public int countUserReviews(@Param("userId") String userId);


}
