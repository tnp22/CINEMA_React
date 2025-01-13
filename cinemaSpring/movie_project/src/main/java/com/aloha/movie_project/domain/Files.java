package com.aloha.movie_project.domain;

import java.util.UUID;

import org.springframework.web.multipart.MultipartFile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@AllArgsConstructor
@Builder
public class Files {
    private int no;
    private String id;
    private String fkId;
    private String fkTable;
    private String division;
    private String url;
    private MultipartFile file;
    public Files() {
        this.id = UUID.randomUUID().toString();
    }

}
