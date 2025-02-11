package com.aloha.movieproject.domain;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class Cast {
    private int no;
    private String id;
    private String movieId;
    private String rule;
    private String name;
    private Files files;

    private List<Files> filesList;
    private MultipartFile[] mainFiles;
    private String FileId;
    
    private Movie movie;

    public Cast() {
        this.id = UUID.randomUUID().toString();
    }
}
