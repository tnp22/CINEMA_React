package com.aloha.movie_project.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.movie_project.domain.Cinema;
import com.aloha.movie_project.domain.CustomUser;
import com.aloha.movie_project.domain.FileText;
import com.aloha.movie_project.domain.Movie;
import com.aloha.movie_project.domain.Reserve;
import com.aloha.movie_project.domain.Theater;
import com.aloha.movie_project.domain.TheaterList;
import com.aloha.movie_project.domain.TicketList;
import com.aloha.movie_project.service.MovieService;
import com.aloha.movie_project.service.ReserveService;
import com.aloha.movie_project.service.cinema.TheaterListService;
import com.aloha.movie_project.service.cinema.TheaterService;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/m")
public class ticketController {

    FileText ft = new FileText();

    @Autowired
    private TheaterListService theaterListService;
    @Autowired
    private MovieService movieService;
    @Autowired
    private TheaterService theaterService;
    @Autowired
    private ReserveService reserveService;

    @GetMapping("/t")
    public String ticketMain(@RequestParam("id") String id, Model model) throws Exception {
        // log.info("id : {}", id); // 올바른 SLF4J 방식
        Movie movie_ = movieService.movieInfo(id);
        model.addAttribute("movie", movie_);

        // id = "6e937900-b05b-11ef-b8e4-4ccc6ad7549d"; // 무비 ID
        List<TheaterList> list = theaterListService.timeSearch(id);
        List<TicketList> ticketLists = new ArrayList<>();

        for (TheaterList t : list) {
            // 전체 좌석 - 예약된 좌석
            List<Reserve> reserve = reserveService.selectSeat(t.getId());
            int MaxPerson = 0;
            for (Reserve r : reserve) {
                // System.out.println(r.getSeat());
                String[] re = r.getSeat().split(",");
                MaxPerson += re.length;
            }
            //System.out.println(MaxPerson);
            TicketList ticket = new TicketList();
            Cinema cinema = t.getCinema();
            Movie movie = t.getMovie();
            Theater theater = t.getTheater();

            int SeatNum = theater.getSeat() - MaxPerson;

            ticket.setArea(cinema.getArea()); // 지역
            ticket.setAreaSub(cinema.getAreaSub()); // 극장

            ticket.setTime(t.getTime()); // 상영날짜 + 시간
            ticket.setId(t.getId()); // 상영리스트 ID (상영시간 ID)

            ticket.setTitle(movie.getTitle()); // 영화 제목

            ticket.setTheaterName(theater.getName()); // 상영관이름
            ticket.setMapUrl(theater.getMap()); // 상영관맵경로
            ticket.setSeat(SeatNum); // 좌석 (예메리스트에서 계산해서 넘기기 추가예정)

            ticket.setMovieId(t.getMovieId()); // 무비 ID
            ticket.setTheaterId(t.getTheaterId()); // 시에터 ID
            ticket.setCinemaId(t.getCinemaId()); // 시네마 ID

            ticketLists.add(ticket); // List 업로드

        }

        // log.info("리스트 : " + ticketLists);
        model.addAttribute("ticketList", ticketLists);
        return "/movie/ticket";
    }

    @GetMapping("/s")
    public String seatSelectionmain(@RequestParam("theaterListId") String id, @RequestParam("person") String person,
            Model model, @AuthenticationPrincipal CustomUser authUser)
            throws Exception {
        // log.info("좌석선택");
        // log.info("상영시간ID : " + id);
        // id = "8ecb1cf9-679b-4c74-8443-b04409feb9ee";
        String uuuuid = UUID.randomUUID().toString();
        model.addAttribute("uuuuid", uuuuid);
        model.addAttribute("authUser", authUser);
        String[] data = person.split("_");
        person = data[0];
        String money = data[1];

        TheaterList num = theaterListService.select(id);
        String mapId = num.getTheaterId();
        // log.info("맵정보 : " + mapId);
        // System.out.println(num);
        model.addAttribute("movieName", num.getMovie().getTitle());
        String path = "C:\\upload\\test"; // 파일 저장 경로
        String fileName = mapId + ".txt"; // JSON에서 fileName 추출
        // 파일 읽기
        String result = ft.read(path, fileName);
        // System.out.println(result);

        // String을 List<List<String>>으로 변환
        List<List<String>> mapData = new ArrayList<>();
        String[] rows = result.split("\n");
        for (String row : rows) {
            List<String> rowList = Arrays.asList(row.split(","));
            mapData.add(rowList);
        }
        // System.out.println(mapData);

        // log.info("아이디" + id);
        // log.info("사람수" + person);
        model.addAttribute("theaterId", id);
        model.addAttribute("person", Integer.parseInt(person));
        model.addAttribute("money", money);
        model.addAttribute("mapData", mapData);

        Movie movie_ = movieService.movieInfo(num.getMovieId());
        model.addAttribute("movie", movie_);

        // 예약된 좌석 선별
        List<Reserve> reserve = reserveService.selectSeat(id);
        List<String> seat = new ArrayList<>();
        for (Reserve s : reserve) {
            String[] se = s.getSeat().split(",");
            for (String ss : se) {
                seat.add(ss);
            }
        }
        // log.info("좌석 : " + seat);
        model.addAttribute("reservationSeat", seat);

        return "/movie/seatSelection";
    }

    @GetMapping("/payment")
    public String showPaymentPage(HttpSession session, Model model,
            @RequestParam(name = "id", required = false) String id) throws Exception {
        Reserve reserve = new Reserve();
        TheaterList num = new TheaterList();
        if (id == null) {
            reserve = (Reserve) session.getAttribute("reserve");
            num = theaterListService.select(reserve.getTheaterListId());
        } else {
            reserve = reserveService.searchReserve(id);
            num = theaterListService.select(reserve.getTheaterListId());

            // 시간 형식 변경
            Date date = num.getTime();

            // 원하는 패턴 설정
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
            String formatDate = dateFormat.format(date);
            String formatTime = timeFormat.format(date);

            reserve.setTitle(num.getMovie().getTitle());
            reserve.setTheater(num.getTheater().getName());
            reserve.setTheaterId(num.getTheaterId());
            reserve.setAreaSub(num.getCinema().getAreaSub());
            reserve.setDate(formatDate);
            reserve.setTime(formatTime);
        }
        //System.out.println("Reserve : " + reserve);
        // System.out.println("넘 있나?" + num);
        // 영화사진
        Movie movie_ = movieService.movieInfo(num.getMovieId());

        model.addAttribute("movie", movie_);
        model.addAttribute("reserve", reserve);
        // 세션에서 데이터 읽기
        // String seat = (String) session.getAttribute("seat");
        // String person = (String) session.getAttribute("person");
        // String theaterListId = (String) session.getAttribute("theaterId");
        // String userName = (String) session.getAttribute("userName");

        // 뷰 반환
        return "/movie/payment";
    }

    /**
     * 결제 처리
     * 
     * @return
     */
    @PostMapping("/p")
    public String handlePayment(@RequestBody Map<String, String> data, HttpSession session) throws Exception {
        String seat = data.get("seat");
        String person = data.get("person");
        String id = data.get("id");
        String userName = data.get("userName");
        int money = Integer.parseInt(data.get("money"));

        // 세션에 데이터 저장
        session.setAttribute("seat", seat);
        session.setAttribute("person", person);
        session.setAttribute("theaterId", id);
        session.setAttribute("userName", userName);

        // 로그 확인
        System.out.println("세션 저장 데이터 확인 - seat: " + seat + ", person: " + person);

        TheaterList num = theaterListService.select(id);

        Reserve reserve = new Reserve();
        reserve.setRegDate(new Date());
        // 시간 형식 변경
        Date date = num.getTime();

        // 원하는 패턴 설정
        SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
        SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
        String formatDate = dateFormat.format(date);
        String formatTime = timeFormat.format(date);

        reserve.setTitle(num.getMovie().getTitle());
        reserve.setTheater(num.getTheater().getName());
        reserve.setAreaSub(num.getCinema().getAreaSub());
        reserve.setDate(formatDate);
        reserve.setTime(formatTime);
        reserve.setId(UUID.randomUUID().toString()); // 값 넣어야함
        reserve.setMoney(money); // 값 계산해야함 아직안했어
        reserve.setSeat(seat);
        reserve.setPerson(Integer.parseInt(person));
        reserve.setTheaterId(num.getTheaterId());
        reserve.setTheaterListId(num.getId());
        reserve.setUserName(userName);
        //System.out.println(reserve);

        session.setAttribute("reserve", reserve);

        //System.out.println("시트 : " + seat);
        //System.out.println(seat == null);
        if (seat == null) {
            return "/m/s?theaterListId=0c701709-0c0d-49dd-b96f-8c30961eee2d&person=1_10000&error";
        }

        // DB 저장
        int result = reserveService.insertReserve(reserve);
        // System.out.println("리졸트 : " + result);
        return "redirect:/m/payment";
    }

    @GetMapping("/rsList")
    public String reservationList(@AuthenticationPrincipal CustomUser authUser, Model model,
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "8") Integer size) throws Exception {
        String username = authUser.getUsername();
        // log.info("테스트, " + username);
        // List<Reserve> reservationList = reserveService.selectUsername(username);
        PageInfo<Reserve> reservationList = reserveService.selectUsername(page, size, username);
        // System.out.println(reservationList);

        for (Reserve reserve : reservationList.getList()) {
            TheaterList detail = theaterListService.select(reserve.getTheaterListId());

            // 시간 형식 변경
            Date date = detail.getTime();

            // 원하는 패턴 설정
            SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy-MM-dd");
            SimpleDateFormat timeFormat = new SimpleDateFormat("HH:mm");
            String formatDate = dateFormat.format(date);
            String formatTime = timeFormat.format(date);

            // 각각 영화 사진
            Movie movie = movieService.movieInfo(detail.getMovieId());
            reserve.setFile(movie.getFiles().getId());

            reserve.setTitle(detail.getMovie().getTitle()); // 영화 제목
            reserve.setDate(formatDate); // 상영 날짜 년,월.일
            reserve.setTime(formatTime); // 상영 시간
            reserve.setTheater(detail.getTheater().getName());
        }

        // model.addAttribute("movie", movie_);
        model.addAttribute("reservationList", reservationList);
        return "/user/reservationList";
    }

    @ResponseBody
    @DeleteMapping("/delete")
    public String deleteReserv( @AuthenticationPrincipal CustomUser authUser,
                @RequestBody Map<String, String> data) throws Exception{
        String id = data.get("id");

        if(reserveService.isOwner(id,authUser.getUser().getId())){
            return "Fail";
        }
        int result = reserveService.delectReserve(id);

        if (result > 0)
            return "SUCCESS";
        return "Fail";
    }

}
