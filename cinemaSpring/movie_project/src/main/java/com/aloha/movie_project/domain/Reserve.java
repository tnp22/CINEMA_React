package com.aloha.movie_project.domain;

import java.util.Date;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Reserve {

    private String title; // 영화제목
    private String theater; // 상영관
    private String theaterId; // 상영관 ID
    private String theaterListId; // 상영 영화 ID
    private String areaSub; // 상영 지역
    private String date; // 상영 날짜 or 날짜시간
    private String time; // 상영 시간
    private int money; // 구매가격
    private Date regDate;
    private String seat; // 구매 좌석
    private int person; // 예약 인원

    private String id; // UUID
    private String userName;

    private String file;
}
