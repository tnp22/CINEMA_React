package com.aloha.movie_project.domain;

import java.util.Date;
import java.util.UUID;

import lombok.Data;

@Data
public class Notice {
    int no;
    String id;
    String title;
    String content;
    Date regDate;
    Date updDate;
    int view;

    public Notice(){
        this.id = UUID.randomUUID().toString();
    }
}
