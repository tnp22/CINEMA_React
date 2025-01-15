package com.aloha.movieproject.controller;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.movieproject.domain.Cast;
import com.aloha.movieproject.domain.Files;
import com.aloha.movieproject.domain.Movie;
import com.aloha.movieproject.domain.ReviewInfo;
import com.aloha.movieproject.service.CastService;
import com.aloha.movieproject.service.MovieService;
import com.aloha.movieproject.service.ReviewService;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;



@Slf4j
@RestController
@RequestMapping("/movie")
public class MovieController {
    @Autowired
    private MovieService movieService;
    
    @Autowired
    private CastService castService;

    @Autowired
    private ReviewService reviewService; 

    @GetMapping("/movieChart")
    public ResponseEntity<?> movieChart(
     @RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "otherPage", required = false, defaultValue = "1") Integer otherPage
    ,@RequestParam(name = "size", required = false, defaultValue = "8") Integer size
    ,@RequestParam(name = "type", required = false, defaultValue = "movie") String type) {
        PageInfo<Movie> moviePageInfo;
        PageInfo<Movie> expectPageInfo;
        int moviePage = 1;
        int expectPage = 1;
        if(type.equals("movie")){
            moviePageInfo = movieService.movieList(page, size);
            expectPageInfo = movieService.expectList(otherPage, size);
            moviePage=page;
            expectPage=otherPage;
        }else{
            moviePageInfo = movieService.movieList(otherPage, size);
            expectPageInfo = movieService.expectList(page, size);
            moviePage=otherPage;
            expectPage=page;
        }

        Map<String, Object> response = new HashMap<>();
        response.put("moviePageInfo", moviePageInfo);
        response.put("expectPageInfo", expectPageInfo);
        response.put("type", type);
        response.put("moviePage", moviePage);
        response.put("expectPage", expectPage);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @GetMapping("/search")
    public ResponseEntity<?> search(
    @RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "8") Integer size
    ,@RequestParam(name = "search", required = false) String search) throws Exception {

        PageInfo<Movie> moviePageInfo = movieService.list(page, size, search);
        Map<String, Object> response = new HashMap<>();
        response.put("moviePageInfo", moviePageInfo);
        response.put("search", search);

        
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/movieInfo")
    public ResponseEntity<?> movieInfo(@RequestParam("id") String id
    ,@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "8") Integer size
    ,@RequestParam(name = "tab", required = false, defaultValue = "content") String tab) throws Exception {
        
        
        
        Movie movie = movieService.movieInfo(id);
        List<Cast> castList = castService.castList(id);

        List<List<Cast>> history = new ArrayList<List<Cast>>();
        List<Cast> subHistory = null;
       
        for (Cast cast : castList) {
            int SU=0;
            List<Cast> newsubHistory = new ArrayList<>();
            subHistory = castService.history(cast.getName());
            
            for (Cast cast2 : subHistory) {
                if(SU>4){
                    break;
                }
                log.info(cast2.toString());
                newsubHistory.add(cast2);
                SU++;
            }
            history.add(newsubHistory);
        }

        List<Files> stilList = movieService.stilList(id);
        PageInfo<ReviewInfo> reviewList = reviewService.reviewList(id, page, size,0);
        List<ReviewInfo> list = reviewList.getList();
        double result = 0;
        for (ReviewInfo review : list) {
            result += review.getRatingValue();
        }
        result = result / list.size();
        double average = (Math.round(result*10)/10.0);

        Map<String, Object> response = new HashMap<>();
        response.put("history", history);
        response.put("movie", movie);
        response.put("castList", castList);
        response.put("stilList", stilList);
        response.put("tab", tab);
        response.put("average", average);
        response.put("page", page);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
}
