package com.aloha.movieproject.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.movieproject.domain.CustomUser;
import com.aloha.movieproject.domain.Inquiry;
import com.aloha.movieproject.props.JwtProps;
import com.aloha.movieproject.service.InquiryService;
import com.github.pagehelper.PageInfo;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;



@RestController
@Slf4j
@RequestMapping("/inquiry")
public class InquiryController {

    @Autowired
    InquiryService inquiryService;

    @Autowired private JwtProps jwtProps;  // secretKey 

    @GetMapping("/list")
    public ResponseEntity<?> list(@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "6") Integer size
    ,@RequestParam(name = "option", defaultValue = "0") int option
    ,@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        PageInfo<Inquiry> inquiryList = inquiryService.list(page, size, option, keyword);
        Map<String, Object> response = new HashMap<>();
        response.put("inquiryList", inquiryList);
        response.put("option", option);
        response.put("keyword", keyword);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/select/{id}/{password}")
    public ResponseEntity<?> select(@PathVariable("id") String id, @PathVariable("password") String password) {
        Inquiry inquiry = inquiryService.select(id);
        log.info("패스워드 로 들러옴"+password);
        if(password.equals(inquiry.getPassword())){
            Map<String, Object> response = new HashMap<>();
            response.put("inquiry", inquiry);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/select/{id}")
    public ResponseEntity<?> select(Model model, @PathVariable("id") String id
        ,@AuthenticationPrincipal CustomUser customUser) {
        Inquiry inquiry = inquiryService.select(id);

        if(inquiry.getType() == 0){
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
        else{
            Map<String, Object> response = new HashMap<>();
            response.put("inquiry", inquiry);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }

    @GetMapping("/mySelect/{id}")
    public ResponseEntity<?> select(Model model, @PathVariable("id") String id
        ,@RequestHeader(name = "Authorization") String authorization) {
        //log.info("Authrization : " + authorization);

        // Authrization : "Bearer " + 💍(jwt)
        String jwt = authorization.substring(7);
        //log.info("jwt : " + jwt);

        String secretKey = jwtProps.getSecretKey();
        byte[] signingKey = secretKey.getBytes();

        Inquiry inquiry = inquiryService.select(id);
        Jws<Claims> parsedToken = Jwts.parser()
                                .verifyWith(Keys.hmacShaKeyFor(signingKey))
                                .build()
                                .parseSignedClaims(jwt);

        String username = parsedToken.getPayload().get("username").toString();

        if(inquiry.getUsername().equals(username) ){
            Map<String, Object> response = new HashMap<>();
            response.put("inquiry", inquiry);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
        else if(inquiry.getType() == 0){
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
        else{
            Map<String, Object> response = new HashMap<>();
            response.put("inquiry", inquiry);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }
    
    @PostMapping("/insert")
    public ResponseEntity<?> insert(@RequestBody Inquiry inquiry) {
        int result = inquiryService.insert(inquiry);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(@RequestBody Inquiry inquiry) {
        int result = inquiryService.update(inquiry);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/replyUpdate")
    public ResponseEntity<?> replyUpdate(@RequestBody Inquiry inquiry) {
        int result = inquiryService.replyUpdate(inquiry);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/replyDelete")
    public ResponseEntity<?> getMethodName(@RequestParam("id") String id) {
        int result = inquiryService.replyDelete(id);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }
    

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam("id") String id) {
        int result = inquiryService.delete(id);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }
}
