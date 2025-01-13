package com.aloha.movie_project.domain;

import java.util.List;
import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class Cinema {
    
    private int no;
    private String id;
    private String auth;
    private String area;
    private String areaSub;
    private Files files;
    

    private List<Files> filesList;
    private MultipartFile[] mainFiles;
    private String FileId;

    public Cinema(){
        this.id = UUID.randomUUID().toString();
    }
}
