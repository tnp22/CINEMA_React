package com.aloha.movie_project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aloha.movie_project.domain.Notice;
import com.aloha.movie_project.service.NoticeService;
import com.github.pagehelper.PageInfo;

import groovy.util.logging.Slf4j;


@Slf4j
@Controller
@RequestMapping("/notice")
public class NoticeController {

    @Autowired
    NoticeService noticeService;

    @GetMapping("/list")
    public String noticeList(Model model 
    ,@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "10") Integer size
    ,@RequestParam(name = "option", defaultValue = "0") int option
    ,@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        PageInfo<Notice> noticeList = noticeService.list(page,size,option,keyword);
        model.addAttribute("noticeList", noticeList);
        model.addAttribute("option", option);
        return "/notice/list";
    }
    
    @GetMapping("/select")
    public String noticeSelect(Model model, @RequestParam("id") String id) {
        noticeService.addView(id);
        Notice notice = noticeService.select(id);
        Notice before = noticeService.before(id);
        Notice after = noticeService.after(id);
        model.addAttribute("notice", notice);
        model.addAttribute("before", before);
        model.addAttribute("after", after);
        return "/notice/select";
    }
    
    
}
