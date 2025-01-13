package com.aloha.movie_project.domain;

import java.util.Date;
import java.util.UUID;

import org.springframework.format.annotation.DateTimeFormat;

import lombok.Data;

@Data
public class TheaterList {
    private int no;
    private String id;
    private String movieId;
    private String theaterId;
    private String cinemaId;
    @DateTimeFormat(pattern = "yyyy-MM-dd'T'HH:mm")
    private Date time;

    private Cinema cinema;

    private Movie movie;

    private Theater theater;

    public TheaterList() {
        this.id = UUID.randomUUID().toString();
    }
}
