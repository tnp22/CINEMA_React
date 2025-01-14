package com.aloha.movieproject.security.filter;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.aloha.movieproject.constants.SecurityConstants;
import com.aloha.movieproject.domain.CustomUser;
import com.aloha.movieproject.domain.Users;
import com.aloha.movieproject.provider.JwtProvider;
import com.fasterxml.jackson.databind.ObjectMapper;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;

@Slf4j
public class JwtAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final JwtProvider jwtProvider;

    public JwtAuthenticationFilter(AuthenticationManager authenticationManager, JwtProvider jwtProvider){
        this.authenticationManager = authenticationManager;
        this.jwtProvider = jwtProvider;
        // 필터 URL 경로 설정 : /login
        setFilterProcessesUrl(SecurityConstants.LOGIN_URL);
    }

    /**
     * 인증 시도 메소드
     * : /login 경로로 (username, password) 요청하면 이 필터에서 로그인 인증을 시도합니다.
     */
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response)
            throws AuthenticationException {
        
        // 요청 메시지에서 아이디, 비밀번호 추출
        String username = request.getParameter("username");
        String password = request.getParameter("password");

        log.info("username : " + username);
        log.info("password : " + password);

        //인증토큰 객체 생성
        Authentication authentication = new UsernamePasswordAuthenticationToken(username, password);

        authentication = authenticationManager.authenticate(authentication);

        log.info("authenticationManger : " + authenticationManager);
        log.info("authentication : " + authentication);
        log.info("인증 여부 isAuthenticated() : " + authentication.isAuthenticated());

        // 인증 실패
        if(!authentication.isAuthenticated()){
            log.info("인증 실패 : 아이디 또는 비밀번호가 일치하지 않습니다.");
            response.setStatus(401);
        }

        //인증 성공
        return authentication;
            
    }

    /**
     * 인증 성공 메소드
     * : attemptAuthentication() 호출 후, 반환된 Authentication 객체가 인증된 것이 확인 되면 호출되는 메소드
     * 
     *  - jwt
     * : 로그인 인증에 성공, jwt 토큰 생성
     *  Authorization 응답헤더에 jwt 토큰을 담아 응답
     *  { Authorization : Bearer + {jwt}}
     */
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain,
            Authentication authentication) throws IOException, ServletException {
       
        log.info("인증 성공!");
        CustomUser customUser = (CustomUser) authentication.getPrincipal();
        Users user = customUser.getUser();
        String id = user.getId();
        String username = user.getUsername();
        List<String> roles = customUser.getAuthorities()
                                    .stream()
                                    .map(GrantedAuthority::getAuthority)
                                    .collect(Collectors.toList())
                                    ;

        String jwt = jwtProvider.createToken(id, username, roles);

        // 응답 헤더 세팅
        response.addHeader("Authorization", SecurityConstants.TOKEN_PREFIX+jwt);
        response.setStatus(200);

        // 사용자 정보 body 세팅
        ObjectMapper ObjectMapper = new ObjectMapper();
        String jsonString = ObjectMapper.writeValueAsString(user);
        
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        // jsonStrin : "{ 'username' : 'aloha', 'name' : '사용자'}"
        PrintWriter printWriter = response.getWriter();
        printWriter.write(jsonString);
        printWriter.flush();

    }
    
}
