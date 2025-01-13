package com.aloha.movie_project.domain;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class Users {
    private int no;
    private String id;
    private String username;
    private String password;
    private String name;
    private String email;
    private boolean enabled;
    private Date regDate;
    private Date updDate;
    private MultipartFile file;
    private List<UserAuth> authList;

    public Users(){
        this.id = UUID.randomUUID().toString();
    } 
}
