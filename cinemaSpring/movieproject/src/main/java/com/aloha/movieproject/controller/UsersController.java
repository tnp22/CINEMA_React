package com.aloha.movieproject.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.aloha.movieproject.domain.CustomUser;
import com.aloha.movieproject.domain.Users;
import com.aloha.movieproject.service.UserService;

import lombok.extern.slf4j.Slf4j;



@Slf4j
@Controller
@RequestMapping("/users")
public class UsersController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    /**
     * 사용자 정보 조회
     * @param customUser
     * @return
     */
    @GetMapping("/info")
    public ResponseEntity<?> userInfo(
        @AuthenticationPrincipal CustomUser customUser) {
        log.info("::::: 사용자 정보 조회 :::::");
        log.info("customUser : " + customUser);

        if(customUser == null){
            return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
        }

        Users user = customUser.getUser();
        log.info("user : " + user);
        
        // 인증된 사용자 정보
        if( user != null){
            return new ResponseEntity<>(user,HttpStatus.OK);
        }
        // 인증 되지 않은 경우
        return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);

    }
    
    @PostMapping("")
    public ResponseEntity<?> join(@RequestBody Users user) throws Exception {
        log.info("회원 가입 요청");
        int result = userService.join(user);

        if( result > 0 ){
            log.info("회원가입 성공!");
            return new ResponseEntity<>("SUCCESS",HttpStatus.OK);
        }
        else{
            log.info("회원가입 실패!");
            return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
        }
    }

    // @PreAuthorize("hasRole('ROLE_USER')")
    // @PreAuthorize("hasAnyRole('ADMIN','USER')")
    @PreAuthorize("hasRole('ADMIN') or #p0.username == authentication.name")
    @PutMapping()
    public ResponseEntity<?> update(@RequestBody Users user) throws Exception {
        Users existingUser = userService.select(user.getUsername());
        if (existingUser == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        // 기존 enabled 상태를 유지
        user.setEnabled(existingUser.isEnabled());

        // 비밀번호가 제공된 경우 암호화하여 설정
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(user.getPassword());
            user.setPassword(encodedPassword);
        } else {
            // 비밀번호가 제공되지 않은 경우 기존 비밀번호 유지
            user.setPassword(existingUser.getPassword());
        }

        int result = userService.update(user);
        if(result > 0){
            log.info("회원 수정 성공");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }
        else{
            log.info("회원 수정 실패");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }
    
    // @PreAuthorize("hasRole('ADMIN') or #p0 == authentication.name")
    // @DeleteMapping("/{id}")
    // public ResponseEntity<?> destroy(@PathVariable("id") String username) throws Exception {
    //     int result = userService.delete(username);
    //     if(result > 0){
    //         log.info("회원 삭제 성공");
    //         return new ResponseEntity<>("SUCCESS",HttpStatus.OK);
    //     }
    //     else{
    //         log.info("회원 삭제 실패");
    //         return new ResponseEntity<>("FAIL",HttpStatus.BAD_REQUEST);
    //     }
    // }
    

}
