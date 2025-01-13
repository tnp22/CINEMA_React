package com.aloha.movie_project.domain;

import java.util.Date;

import lombok.Data;

@Data
public class TicketList {
    // 구분
    private String area; // 지역 cinema.getArea()
    private String areaSub; // 지역에포함된 극장 cinema.getAreaSub()

    // 예약할떄 넘겨주기
    private Date time; // 날짜 + 시간 .getTime()
    private String id; // 상영리스트 ID .getId()
    private int seat; // 좌석수

    // 일단 넣어
    private String title; // 영화제목 movie.getTitle()

    // 시간과 함께 상영관 정보 기준으로 분류
    private String theaterName; // 상영관 theater.getName()
    private String mapUrl; // 맵경로 theater.getMap()

    // ID 는 쓸때 있을까?
    private String movieId; // 무비 ID .getMovieId()
    private String theaterId; // 시에터 ID .getTheaterId()
    private String cinemaId; // 시네마 ID .getCinemaId()
}
