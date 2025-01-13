package com.aloha.movie_project.domain;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class Banner {
    
    private int no;
    private String id;
    private String name;
    private String bannerDivi;
    private String movieId;

    private Files files;

    private List<Files> filesList;
    private MultipartFile[] mainFiles;
    private String FileId;

    private Movie movie;

    public Banner(){
        this.id = UUID.randomUUID().toString();
    }
}
