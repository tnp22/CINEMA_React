package com.aloha.movie_project.domain;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class addMap {

    private int x;
    private int y;

    private String fileName;

    private int mapSize;

    private List<List<String>> mapData;

}
