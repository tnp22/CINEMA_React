package com.aloha.movieproject.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.movieproject.domain.Banner;
import com.aloha.movieproject.domain.CustomUser;
import com.aloha.movieproject.domain.Movie;
import com.aloha.movieproject.domain.Notice;
import com.aloha.movieproject.domain.Users;
import com.aloha.movieproject.service.MovieService;
import com.aloha.movieproject.service.NoticeService;
import com.aloha.movieproject.service.UserService;
import com.aloha.movieproject.service.banner.BannerService;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RestController
public class HomeController {

    
    @Autowired
    private UserService userService;
    @Autowired
    private MovieService movieService;
    @Autowired
    private NoticeService noticeService;
    @Autowired
    private BannerService bannerService;

    /**
     * 메인 화면
     * 🔗 [GET] - / 
     * 📄 index.html
     * @return
     * @throws Exception 
    */
    @GetMapping("/")
    public ResponseEntity<?> home(@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "18") Integer size) throws Exception {
        log.info(":::::::::: 메인 화면 ::::::::::");

        List<Banner> bannerList = bannerService.mainBannerList();

        List<Banner> subBannerList = bannerService.subBannerList();

        PageInfo<Movie> moviePageInfo = movieService.movieList(page, size);
        PageInfo<Movie> expectPageInfo = movieService.expectList(page, size);
        List<Notice> noticeList = noticeService.mainNotice();
        Map<String, Object> response = new HashMap<>();
        response.put("bannerList", bannerList);
        response.put("subBannerList", subBannerList);
        response.put("moviePageInfo", moviePageInfo);
        response.put("expectPageInfo", expectPageInfo);
        response.put("noticeList", noticeList);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 회원 가입 처리
     * 🔗 [POST] - /join
     * ➡   ⭕ /login
     *      ❌ /join?error
     * @param user
     * @return
     * @throws Exception
     */
    @PostMapping("/join")
    public ResponseEntity<?> joinPro(@RequestBody Users user) throws Exception {
        log.info(":::::::::: 회원 가입 처리 ::::::::::");
        log.info("user : " + user);
        // 회원 가입 요청
        int result = userService.join(user);
        
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
        
    }


    /**
     * 아이디 중복 검사
     * @param username
     * @return
     * @throws Exception
     */
    @ResponseBody
    @GetMapping("/check/{username}")
    public ResponseEntity<Boolean> userCheck(@PathVariable("username") String username) throws Exception {
        log.info("아이디 중복 확인 : " + username);
        Users user = userService.select(username);
        // 아이디 중복
        if( user != null ) {
            log.info("중복된 아이디 입니다 - " + username);
            return new ResponseEntity<>(false, HttpStatus.OK);
        }
        // 사용 가능한 아이디입니다.
        log.info("사용 가능한 아이디 입니다." + username);
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

}