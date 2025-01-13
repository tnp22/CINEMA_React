package com.aloha.movie_project.domain;

import java.util.Date;
import java.util.UUID;

import lombok.Data;

@Data
public class Inquiry {
    
    private int no;
    private String id;
    private int type;
    private String title;
    private String password;
    private String content;
    private String username;
    private Date regDate;
    private Date updDate;
    private String reply;
    private int status;

    public Inquiry(){
        this.id = UUID.randomUUID().toString();
    }
}
