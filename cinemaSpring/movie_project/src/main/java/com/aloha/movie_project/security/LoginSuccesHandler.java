package com.aloha.movie_project.security;

import java.io.IOException;

import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.SavedRequestAwareAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.aloha.movie_project.domain.CustomUser;
import com.aloha.movie_project.domain.Users;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * 로그인 성공 처리 이벤트 핸들러
 */
@Slf4j
@Component
public class LoginSuccesHandler extends SavedRequestAwareAuthenticationSuccessHandler {@Override
    
    
    /**
     * 로그인 성공 시 호출되는 메소드
     * 아이디 저장 쿠키 생성
     */
    public void onAuthenticationSuccess(HttpServletRequest request
    , HttpServletResponse response
    ,Authentication authentication) throws IOException, ServletException {
        
        log.info("로그인 성공...");

        // 아이디 저장
        String rememberId = request.getParameter("remember-id"); // 아이디 저장 여부
        String username = request.getParameter("username");
        log.info("remeberId"+rememberId);
        log.info("username"+username);

        // 아이디 저장 체크 여부 확인
        if(rememberId != null && rememberId.equals("on")){
            Cookie cookie = new Cookie("remember-id",username);
            cookie.setMaxAge(60*60*24*7);
            cookie.setPath("/");
            response.addCookie(cookie);
        }
        else{
            Cookie cookie = new Cookie("remember-id",username);
            cookie.setMaxAge(0);
            cookie.setPath("/");
            response.addCookie(cookie);
        }


        // 인증된 사용자 정보
        CustomUser customuser = (CustomUser) authentication.getPrincipal();
        Users user = customuser.getUser();

        log.info("아이디 : "+user.getUsername());
        log.info("비밀번호 : "+user.getPassword());
        log.info("권한 : "+user.getAuthList());
        
        super.onAuthenticationSuccess(request, response, authentication);
    }
    
}
