package com.aloha.movie_project.domain;

import java.util.List;

import lombok.Data;

@Data
public class Theater {
    private int no;
    private String id;
    private String name;
    private String cinemaId;
    private String map;
    private int seat;


    //애드맵

    private int x;
    private int y;

    private int mapSize;

    private List<List<String>> mapData;
}
