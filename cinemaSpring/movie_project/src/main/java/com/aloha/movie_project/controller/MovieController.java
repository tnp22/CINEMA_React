package com.aloha.movie_project.controller;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aloha.movie_project.domain.Cast;
import com.aloha.movie_project.domain.Files;
import com.aloha.movie_project.domain.Movie;
import com.aloha.movie_project.domain.ReviewInfo;
import com.aloha.movie_project.service.CastService;
import com.aloha.movie_project.service.MovieService;
import com.aloha.movie_project.service.ReviewService;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;



@Slf4j
@Controller
@RequestMapping("/movie")
public class MovieController {
    @Autowired
    private MovieService movieService;
    
    @Autowired
    private CastService castService;

    @Autowired
    private ReviewService reviewService; 

    @GetMapping("/movieChart")
    public String movieChart(Model model
    ,@RequestParam(name = "moviePage", required = false, defaultValue = "1") Integer moviePage
    ,@RequestParam(name = "expectPage", required = false, defaultValue = "1") Integer expectPage
    ,@RequestParam(name = "size", required = false, defaultValue = "8") Integer size
    ,@RequestParam(name = "tab", required = false, defaultValue = "movie") String tab) {

        PageInfo<Movie> moviePageInfo = movieService.movieList(moviePage, size);
        PageInfo<Movie> expectPageInfo = movieService.expectList(expectPage, size);
        model.addAttribute("moviePageInfo", moviePageInfo);
        model.addAttribute("expectPageInfo", expectPageInfo);
        model.addAttribute("tab", tab);
        model.addAttribute("moviePage", moviePage);
        model.addAttribute("expectPage", expectPage);

        return "/movie/movieChart";
    }
    
    @GetMapping("/search")
    public String search(Model model
    ,@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "8") Integer size
    ,@RequestParam(name = "search", required = false) String search) throws Exception {

        PageInfo<Movie> moviePageInfo = movieService.list(page, size, search);
        model.addAttribute("moviePageInfo", moviePageInfo);
        model.addAttribute("search", search);
        return "/movie/search";
    }

    @GetMapping("/movieInfo")
    public String movieInfo(Model model,@RequestParam("id") String id
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
        model.addAttribute("history", history);

        List<Files> stilList = movieService.stilList(id);
        PageInfo<ReviewInfo> reviewList = reviewService.reviewList(id, page, size,0);
        List<ReviewInfo> list = reviewList.getList();
        double result = 0;
        for (ReviewInfo review : list) {
            result += review.getRatingValue();
        }
        result = result / list.size();
        double average = (Math.round(result*10)/10.0);
        model.addAttribute("movie", movie);
        model.addAttribute("castList", castList);
        model.addAttribute("stilList", stilList);
        model.addAttribute("tab", tab);
        model.addAttribute("average", average);
        model.addAttribute("page", page);
        return "/movie/movieInfo";
    }
    
}
