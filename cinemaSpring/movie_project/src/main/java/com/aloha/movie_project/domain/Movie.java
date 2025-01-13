package com.aloha.movie_project.domain;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class Movie {
    private int no;
    private String id;
    private String title;
    private String content;
    private String type;

    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private Date releaseDate;
    
    private Date regDate;
    private Date updDate;
    private Files files;
    private List<Files> fileList;

    private List<Files> filesList;

    private MultipartFile[] mainFiles;
    private MultipartFile[] stilcuts;
    private String FileId;

    public Movie(){
        this.id = UUID.randomUUID().toString();
    }
}
