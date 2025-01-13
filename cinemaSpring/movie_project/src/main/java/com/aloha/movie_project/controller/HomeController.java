package com.aloha.movie_project.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.movie_project.domain.Banner;
import com.aloha.movie_project.domain.CustomUser;
import com.aloha.movie_project.domain.Movie;
import com.aloha.movie_project.domain.Notice;
import com.aloha.movie_project.domain.Users;
import com.aloha.movie_project.service.MovieService;
import com.aloha.movie_project.service.NoticeService;
import com.aloha.movie_project.service.UserService;
import com.aloha.movie_project.service.banner.BannerService;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
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
    // public String home(Principal principal, Model model) throws Exception {
    // public String home(Authentication authentication, Model model) throws Exception {
    // public String home(@AuthenticationPrincipal User authUser, Model model) throws Exception {
    public String home(@AuthenticationPrincipal CustomUser authUser, Model model  ,@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "18") Integer size) throws Exception {
        log.info(":::::::::: 메인 화면 ::::::::::");

        if( authUser != null ) {
            log.info("authUser : " + authUser);
            Users user = authUser.getUser();
            model.addAttribute("user", user);
        }

        List<Banner> bannerList = bannerService.mainBannerList();
        model.addAttribute("bannerList", bannerList);

        List<Banner> suBannerList = bannerService.subBannerList();
        model.addAttribute("subBannerList", suBannerList);

        PageInfo<Movie> moviePageInfo = movieService.movieList(page, size);
        PageInfo<Movie> expectPageInfo = movieService.expectList(page, size);
        model.addAttribute("moviePageInfo", moviePageInfo);
        model.addAttribute("expectPageInfo", expectPageInfo);
        List<Notice> noticeList = noticeService.mainNotice();

        model.addAttribute("noticeList", noticeList);

        return "index";
    }

    /**
     * 회원 가입 화면
     * 🔗 [GET] - /join
     * 📄 join.html
     * @return
     */
    @GetMapping("/join")
    public String join() {
        log.info(":::::::::: 회원 가입 화면 ::::::::::");
        return "join";
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
    public String joinPro(Users user, HttpServletRequest request) throws Exception {
        log.info(":::::::::: 회원 가입 처리 ::::::::::");
        log.info("user : " + user);

        // 암호화 전 비밀번호
        String plainPassword = user.getPassword();
        // 회원 가입 요청
        int result = userService.join(user);
        
        // 회원 가입 성공 시, 바로 로그인
        boolean loginResult = false;
        if( result > 0 ) {
            // 암호화 전 비밀번호 다시 세팅
            // 회원가입 시, 비밀번호 암호화하기 때문에, 
            user.setPassword(plainPassword);
            loginResult = userService.login(user, request);
        }
        if (loginResult) {
            return "redirect:/";        // 메인화면으로 이동
        }
        if( result > 0 ) {
            return "redirect:/login";
        }
        
        return "redirect/join?error";
        
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


    /**
     * 로그인 화면
     * @return
     */
    @GetMapping("/login")
    public String login(@CookieValue(value="remember-id", required = false) Cookie cookie
                       ,Model model ) {
        // @CookieValue(value="쿠키이름", required = 필수여부)
        // - required=true (default)  : 쿠키를 필수로 가져와서 없으면 에러
        // - required=false           : 쿠키 필수 ❌ ➡ 쿠키가 없으면 null, 에러❌
        log.info(":::::::::: 로그인 페이지 ::::::::::");
        //log.info("user : " + user);


        String username = "";
        boolean rememberId = false;
        if( cookie != null ) {
            log.info("CookieName : " + cookie.getName());
            log.info("CookieValue : " + cookie.getValue());
            username = cookie.getValue();
            rememberId = true;
        }
        model.addAttribute("username", username);
        model.addAttribute("rememberId", rememberId);
        return "/login";
    }

}