package com.aloha.movie_project.security;

import java.io.IOException;

import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
import org.springframework.stereotype.Component;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

/**
 * 로그인 성공 처리 이벤트 핸들러
 * 로그인 실패 횟수 체크, 보안 처리
 * (로그인 실패 5회시 처리)
 */
@Slf4j
@Component
public class LoginFailureHandler implements AuthenticationFailureHandler{@Override
    public void onAuthenticationFailure(HttpServletRequest request, HttpServletResponse response,
            AuthenticationException exception) throws IOException, ServletException {
        log.info("로그인 처리 실패...");

        //로그인 페이지로 에러 포함 전달
        response.sendRedirect("/login?error");
        
    }

}