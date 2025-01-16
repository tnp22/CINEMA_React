package com.aloha.movieproject.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.movieproject.domain.Inquiry;
import com.aloha.movieproject.service.InquiryService;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;



@RestController
@Slf4j
@RequestMapping("/inquiry")
public class InquiryController {

    @Autowired
    InquiryService inquiryService;

    @GetMapping("/list")
    public ResponseEntity<?> list(@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "6") Integer size
    ,@RequestParam(name = "option", defaultValue = "0") int option
    ,@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        PageInfo<Inquiry> inquiryList = inquiryService.list(page, size, option, keyword);
        Map<String, Object> response = new HashMap<>();
        response.put("inquiryList", inquiryList);
        response.put("option", option);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/select/{id}/{password}")
    public ResponseEntity<?> select(@PathVariable("id") String id, @PathVariable("password") String password) {
        Inquiry inquiry = inquiryService.select(id);
        if(password.equals(inquiry.getPassword())){
            Map<String, Object> response = new HashMap<>();
            response.put("inquiry", inquiry);
            return new ResponseEntity<>(response, HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/select/{id}")
    public ResponseEntity<?> select(Model model, @PathVariable("id") String id) {
        Inquiry inquiry = inquiryService.select(id);
        Map<String, Object> response = new HashMap<>();
        response.put("inquiry", inquiry);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @PostMapping("/insert")
    public ResponseEntity<?> insert(Inquiry inquiry) {
        int result = inquiryService.insert(inquiry);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/update")
    public ResponseEntity<?> update( @RequestParam("id") String id) {
        Inquiry inquiry = inquiryService.select(id);
        Map<String, Object> response = new HashMap<>();
        response.put("inquiry", inquiry);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PutMapping("/update")
    public ResponseEntity<?> update(Inquiry inquiry) {
        int result = inquiryService.update(inquiry);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/replyUpdate")
    public ResponseEntity<?> replyUpdate(Inquiry inquiry) {
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
