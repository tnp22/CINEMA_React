package com.aloha.movieproject.controller;

import java.util.HashMap;
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

import com.aloha.movieproject.domain.Notice;
import com.aloha.movieproject.service.NoticeService;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/notice")
public class NoticeController {

    @Autowired
    NoticeService noticeService;

    @GetMapping("/list")
    public ResponseEntity<?> noticeList(
    @RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "10") Integer size
    ,@RequestParam(name = "option", defaultValue = "0") int option
    ,@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        PageInfo<Notice> noticeList = noticeService.list(page,size,option,keyword);
        Map<String, Object> response = new HashMap<>();
        log.info("=============옵션은 " + option);
        log.info("=============키워드는 " + keyword);
        response.put("noticeList", noticeList);
        response.put("option", option);
        response.put("keyword", keyword);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    @GetMapping("/select")
    public ResponseEntity<?> noticeSelect(Model model, @RequestParam("id") String id) {
        noticeService.addView(id);
        Notice notice = noticeService.select(id);
        Notice before = noticeService.before(id);
        Notice after = noticeService.after(id);
        Map<String, Object> response = new HashMap<>();
        response.put("notice", notice);
        response.put("before", before);
        response.put("after", after);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    
    
}
