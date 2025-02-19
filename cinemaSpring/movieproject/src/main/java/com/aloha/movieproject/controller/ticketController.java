package com.aloha.movieproject.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.movieproject.domain.Cinema;
import com.aloha.movieproject.domain.CustomUser;
import com.aloha.movieproject.domain.FileText;
import com.aloha.movieproject.domain.Movie;
import com.aloha.movieproject.domain.Reserve;
import com.aloha.movieproject.domain.Theater;
import com.aloha.movieproject.domain.TheaterList;
import com.aloha.movieproject.domain.TicketList;
import com.aloha.movieproject.service.MovieService;
import com.aloha.movieproject.service.ReserveService;
import com.aloha.movieproject.service.cinema.TheaterListService;
import com.aloha.movieproject.service.cinema.TheaterService;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.http.HttpSession;
import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/movie")
@CrossOrigin("*")
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

    /**
     * 극장 날짜 선택
     * 
     * @param movieId
     * @param model
     * @return
     * @throws Exception
     */
    @GetMapping("/dateSelection")
    public ResponseEntity<?> ticketMain(@RequestParam("id") String movieId) throws Exception {
        // log.info("id : {}", id); // 올바른 SLF4J 방식
        log.info("dateSelection 진입");
        log.info("무비 아이디 : " + movieId);

        try {
            Map<String, Object> response = new HashMap<String, Object>();
            Movie movie_ = movieService.movieInfo(movieId);
            // model.addAttribute("movie", movie_); // ? 썸넬인가?

            // id = "6e937900-b05b-11ef-b8e4-4ccc6ad7549d"; // 무비 ID
            List<TheaterList> list = theaterListService.timeSearch(movieId);
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
                // System.out.println(MaxPerson);
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
            // log.info("리스트?" + ticketLists);
            log.info("무비ID" + movie_.getFiles().getId());
            response.put("ticketList", ticketLists);
            response.put("movieId", movie_.getFiles().getId());
            response.put("movieTitle", movie_.getTitle());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        // log.info("리스트 : " + ticketLists);
        // model.addAttribute("ticketList", ticketLists);

    }

    @GetMapping("/seatSelection")
    public ResponseEntity<?> seatSelectionmain(@RequestParam("theaterListId") String id,
            @RequestParam("person") String person,
            Model model, @AuthenticationPrincipal CustomUser authUser)
            throws Exception {
        // log.info("좌석선택");
        // log.info("상영시간ID : " + id);
        // id = "8ecb1cf9-679b-4c74-8443-b04409feb9ee";
        Map<String, Object> response = new HashMap<String, Object>();
        // log.info(id);
        log.info(person + "명");

        try {

            String uuuuid = UUID.randomUUID().toString();
            String[] data = person.split("_");
            person = data[0];
            String money = data[1]; //
            TheaterList num = theaterListService.select(id);
            String mapId = num.getTheaterId();
            // log.info("맵정보 : " + mapId);
            // System.out.println(num);

            String path = "C:\\upload\\test"; // 파일 저장 경로
            String fileName = mapId + ".txt"; // JSON에서 fileName 추출
            // 파일 읽기
            String result = ft.read(path, fileName);
            log.info(fileName);
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

            Movie movie_ = movieService.movieInfo(num.getMovieId());

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
            // response.put("movie", movie_); // 필요한가?
            response.put("movieId", movie_.getFiles().getId());
            response.put("movieTitle", movie_.getTitle());
            response.put("uuuuid", uuuuid);
            response.put("mapData", mapData);

            response.put("reserve", reserve);
            response.put("reservationSeat", seat);
            if (authUser != null) {

                response.put("authUserName", authUser.getUsername());
                response.put("authUserEmail", authUser.getEmail());
            } else {
                log.info("유저 정보 없음");
            }
            response.put("theaterId", id);
            response.put("money", money);
            response.put("person", Integer.parseInt(person));

            // log.info("맵데이터" + mapData);

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            log.info("여기왔나?");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/payment")
    public ResponseEntity<?> showPaymentPage(HttpSession session,
            @RequestParam(name = "id", required = false) String id)
            throws Exception {
        Reserve reserve = new Reserve();
        TheaterList num = new TheaterList();
        log.info("들어왔을까?" + id);
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

        // System.out.println("Reserve : " + reserve);
        // System.out.println("넘 있나?" + num);
        // 영화사진
        Movie movie_ = movieService.movieInfo(num.getMovieId());

        Map<String, Object> response = new HashMap<String, Object>();

        response.put("movie", movie_);
        response.put("reserve", reserve);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    /**
     * 결제 처리
     * 
     * @return
     */
    @PostMapping("/payment")
    public ResponseEntity<?> handlePayment(@RequestBody Map<String, String> data, HttpSession session)
            throws Exception {
        log.info("결제 진입?");
        try {
            String seat = data.get("seat");
            String person = data.get("person");
            String id = data.get("id");
            String orderId = data.get("orderId");
            String userName = data.get("userName");
            int money = Integer.parseInt(data.get("money"));

            // 세션에 데이터 저장
            session.setAttribute("seat", seat);
            session.setAttribute("person", person);
            session.setAttribute("theaterId", id);
            session.setAttribute("userName", userName);
            log.info("7");

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
            reserve.setId(orderId); // 값 넣어야함
            reserve.setMoney(money); // 값 계산해야함 아직안했어
            reserve.setSeat(seat);
            reserve.setPerson(Integer.parseInt(person));
            reserve.setTheaterId(num.getTheaterId());
            reserve.setTheaterListId(num.getId());
            reserve.setUserName(userName);
            // System.out.println(reserve);

            session.setAttribute("reserve", reserve);

            // System.out.println("시트 : " + seat);
            // System.out.println(seat == null);
            if (seat == null) {
            }

            // DB 저장
            int result = reserveService.insertReserve(reserve);
            // System.out.println("리졸트 : " + result);
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("reserveId", reserve.getId());
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/rsList")
    public ResponseEntity<?> reservationList(@RequestParam("usesname") String username,
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "8") Integer size) throws Exception {
        // String username = data.get("username");
        log.info("테스트, " + username);
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
        log.info("예매 내역" + reservationList);
        Map<String, Object> response = new HashMap<String, Object>();
        response.put("reservationList", reservationList);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @ResponseBody
    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteReserv(@RequestParam("id") String id) throws Exception {
        log.info("아이디 : " + id);

        int result = reserveService.delectReserve(id);

        if (result > 0) {
            return new ResponseEntity<>(HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
    }

}
