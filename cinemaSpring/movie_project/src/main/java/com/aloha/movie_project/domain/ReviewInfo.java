package com.aloha.movie_project.domain;

import java.util.UUID;

import lombok.Data;

@Data
public class ReviewInfo {
    private String username;
    private String id;
    private String title;
    private String movieId;
    private String content;
    private int ratingValue;
    private String fileId;
    private int count;
    public ReviewInfo(){
        this.id = UUID.randomUUID().toString();
    }
}
