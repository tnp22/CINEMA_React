package com.aloha.movie_project.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.aloha.movie_project.domain.Inquiry;
import com.aloha.movie_project.service.InquiryService;
import com.github.pagehelper.PageInfo;

import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;



@Controller
@Slf4j
@RequestMapping("/inquiry")
public class InquiryController {

    @Autowired
    InquiryService inquiryService;

    @GetMapping("/list")
    public String list(Model model    
    ,@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "6") Integer size
    ,@RequestParam(name = "option", defaultValue = "0") int option
    ,@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        PageInfo<Inquiry> inquiryList = inquiryService.list(page, size, option, keyword);
        model.addAttribute("inquiryList", inquiryList);
        model.addAttribute("option", option);
        
        return "/inquiry/list";
    }

    @GetMapping("/select/{id}/{password}")
    public String select(Model model, @PathVariable("id") String id, @PathVariable("password") String password) {
        Inquiry inquiry = inquiryService.select(id);
        if(password.equals(inquiry.getPassword())){
            model.addAttribute("inquiry", inquiry);
            return "/inquiry/select";
        }else{
            return "redirect:/inquiry/list";
        }
    }

    @GetMapping("/select/{id}")
    public String select(Model model, @PathVariable("id") String id) {
        Inquiry inquiry = inquiryService.select(id);
        model.addAttribute("inquiry", inquiry);
        return "/inquiry/select";
    }


    @GetMapping("/insert")
    public String insert() {
        return "/inquiry/insert";
    }
    
    @PostMapping("/insert")
    public String insert(Inquiry inquiry) {
        int result = inquiryService.insert(inquiry);
        if(result > 0)
            return "redirect:/inquiry/list";
        else
            return "redirect:/inquiry/insert?error";
    }

    @GetMapping("/update")
    public String update(Model model, @RequestParam("id") String id) {
        Inquiry inquiry = inquiryService.select(id);
        model.addAttribute("inquiry", inquiry);
        return "/inquiry/update";
    }

    @PostMapping("/update")
    public String update(Inquiry inquiry) {
        int result = inquiryService.update(inquiry);
        if(result > 0)
            return "redirect:/inquiry/select/"+inquiry.getId();
        else
            return "redirect:/inquiry/update?error";
    }

    @PostMapping("/replyUpdate")
    public String replyUpdate(Inquiry inquiry) {
        int result = inquiryService.replyUpdate(inquiry);
        if(result > 0)
            return "redirect:/inquiry/select/"+inquiry.getId();
        else
            return "redirect:/inquiry/update?error";
    }

    @GetMapping("/replyDelete")
    public String getMethodName(@RequestParam("id") String id) {
        int result = inquiryService.replyDelete(id);
        if(result > 0)
            return "redirect:/inquiry/select/"+id;
        else
            return "redirect:/inquiry/update?error";
    }
    

    @GetMapping("/delete")
    public String delete(@RequestParam("id") String id) {
        int result = inquiryService.delete(id);
        if(result > 0)
            return "redirect:/inquiry/list";
        else
            return "redirect:/inquiry/update?id="+id;
    }
}
