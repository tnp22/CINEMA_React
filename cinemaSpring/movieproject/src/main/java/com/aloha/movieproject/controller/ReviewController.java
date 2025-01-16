package com.aloha.movieproject.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.aloha.movieproject.domain.ReviewInfo;
import com.aloha.movieproject.service.ReviewService;
import com.aloha.movieproject.service.UserService;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;




@RestController
@Slf4j
@RequestMapping("/review")
public class ReviewController {

    @Autowired
    UserService userService;
    @Autowired
    ReviewService reviewService;

    @GetMapping("/list")
    public ResponseEntity<?> list(@RequestParam("id") String id ,@RequestParam("username") String username
    ,@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "6") Integer size) throws Exception {
        Map<String, Object> response = new HashMap<>();
        ReviewInfo myReview = reviewService.select(id,username);
        int count = 0;
        if(myReview!=null){
            count = 1;
        }
        if(page == 1 && myReview!=null){
            size = 5;
            response.put("myReview", myReview);
        }
        PageInfo<ReviewInfo> reviewList = reviewService.reviewList(id, page, size, count);
        log.info("리뷰 리스트 생성");

        response.put("reviewList", reviewList);
        response.put("movieId", id);
        response.put("count", count);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    


    @PostMapping("/insert")
    public ResponseEntity<?> insertReview(@RequestBody ReviewInfo reviewInfo) throws Exception {
        String userId = userService.select(reviewInfo.getUsername()).getId();
        int result = reviewService.insertReview(reviewInfo.getId(), reviewInfo.getMovieId(), userId, reviewInfo.getContent());
        reviewService.insertRating(UUID.randomUUID().toString(), reviewInfo.getId(), userId, reviewInfo.getRatingValue());
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateReview(@RequestBody ReviewInfo reviewInfo) {
        log.info("리뷰 업데이트 시도");
        int result = reviewService.updateReview(reviewInfo.getId(), reviewInfo.getContent());
        reviewService.updateRating(reviewInfo.getId(), reviewInfo.getRatingValue());
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }


    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> getMethodName(@PathVariable("id") String id) {
        log.info("리뷰 삭제 시도중");
        int result = reviewService.deleteReview(id);
        reviewService.deleteRating(id);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }
}
