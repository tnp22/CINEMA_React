package com.aloha.movieproject.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.MediaType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;



import com.aloha.movieproject.domain.AuthList;
import com.aloha.movieproject.domain.Banner;
import com.aloha.movieproject.domain.Cast;
import com.aloha.movieproject.domain.Cinema;
import com.aloha.movieproject.domain.FileText;
import com.aloha.movieproject.domain.Files;
import com.aloha.movieproject.domain.Movie;
import com.aloha.movieproject.domain.Notice;
import com.aloha.movieproject.domain.Pagination;
import com.aloha.movieproject.domain.ReviewInfo;
import com.aloha.movieproject.domain.Theater;
import com.aloha.movieproject.domain.TheaterList;
import com.aloha.movieproject.domain.UserAuth;
import com.aloha.movieproject.domain.Users;
import com.aloha.movieproject.service.AuthListService;
import com.aloha.movieproject.service.CastService;
import com.aloha.movieproject.service.FileService;
import com.aloha.movieproject.service.MovieService;
import com.aloha.movieproject.service.NoticeService;
import com.aloha.movieproject.service.ReviewService;
import com.aloha.movieproject.service.UserService;
import com.aloha.movieproject.service.banner.BannerService;
import com.aloha.movieproject.service.cinema.CinemaService;
import com.aloha.movieproject.service.cinema.TheaterListService;
import com.aloha.movieproject.service.cinema.TheaterService;
import com.github.pagehelper.PageInfo;

import java.text.SimpleDateFormat;
import java.util.Date;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@Secured("ROLE_ADMIN")
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private AuthListService authListService;

    @Autowired
    private MovieService movieService;

    @Autowired
    private FileService fileService;

    @Autowired
    private UserService userService;

    @Autowired
    private CinemaService cinemaService;

    @Autowired
    private TheaterService theaterService;

    @Autowired
    private TheaterListService theaterListService;

    @Autowired
    private BannerService bannerService;

    @Autowired
    private CastService castService;

    @Autowired
    private NoticeService noticeService;

    @Autowired
    private ReviewService reviewService;

    /*
     * ------------------------------------- 영화관 관
     * 련-------------------------------------
     */

    /**
     * 관리자 메인
     * 
     * @param page
     * @param size
     * @param search
     * @return
     * @throws Exception
     */
    @GetMapping({ "", "/", "/cinema/list", "/cinema", "/cinema/" })
    public ResponseEntity<?> index(
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "6") Integer size,
            @RequestParam(name = "search", required = false) String search) throws Exception {
        try {
            // 데이터 요청
            PageInfo<Cinema> pageInfo = null;
            if (search == null || search.equals("")) {
                pageInfo = cinemaService.list(page, size);
            } else {
                pageInfo = cinemaService.list(page, size, search);
            }
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("pageInfo", pageInfo.getList());
            response.put("pagination", pagination);
            response.put("search", search);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 권한 목록 조회
     * 
     * @param model
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/cinema/insert")
    public ResponseEntity<?> authListList() throws Exception {
        try {
            // 데이터 요청
            List<AuthList> authList = authListService.list();

            Map<String, Object> response = new HashMap<String, Object>();
            response.put("authList", authList);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 시네마 생성
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping(value = "/cinema/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> cinemaInsert(
    @ModelAttribute Cinema cinema,
    @RequestParam("mainFiles") MultipartFile[] mainFiles) throws Exception {
        log.info("시네마 생성 요청");
        int result = cinemaService.insert(cinema);

        if (result > 0) {
            log.info("시네마 생성 성공!");
            for (MultipartFile files : cinema.getMainFiles()) {
                Files file = new Files();
                file.setFile(files);
                file.setDivision("main");
                file.setFkTable("cinema");
                file.setFkId(cinema.getId());
                fileService.upload(file);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } else {
            log.info("시네마 생성 실패!");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 관리자 페이지
     * 
     * @return
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/cinema/updateList")
    public ResponseEntity<?> cinemaUpdateList(
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "6") Integer size,
            @RequestParam(name = "search", required = false) String search) throws Exception {
        log.info("cinema/updateList 요청");
        try {
            // 데이터 요청
            PageInfo<Cinema> pageInfo = null;
            if (search == null || search.equals("")) {
                pageInfo = cinemaService.list(page, size);
            } else {
                pageInfo = cinemaService.list(page, size, search);
            }
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("pageInfo", pageInfo.getList());
            response.put("pagination", pagination);
            response.put("search", search);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 영화관 선택
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/cinema/select/{id}")
    public ResponseEntity<?> cinemaSelect(@PathVariable("id") String id) throws Exception {
        try {
            Cinema cinema = cinemaService.select(id);
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("cinema", cinema);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 업데이트 화면 진입
     * 
     * @param model
     * @param movie
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/cinema/update/{id}")
    public ResponseEntity<?> cinemaUpdate(@PathVariable("id") String id) throws Exception {
        try {
            // 데이터 요청
            List<AuthList> authList = authListService.list();
            Cinema cinema = cinemaService.select(id);
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("authList", authList);
            response.put("cinema", cinema);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 업데이트 post
     * 
     * @param model
     * @param movie
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping(value = "/cinema/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> cinemaUpdate(@ModelAttribute Cinema cinema) throws Exception {
        int result = cinemaService.update(cinema);
        // if(result>0){
        // return "redirect:/admin/cinema/select?id="+cinema.getId();
        // }
        // return "redirect:/admin/cinema/update?id="+cinema.getId()+"&error";
        if (result > 0) {
            log.info("시네마 업뎃 성공!");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } else {
            log.info("시네마 업뎃 실패!");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 풍경 삭제
     * 
     * @param model
     * @param username
     * @param no
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/cinema/mainDelete")
    public ResponseEntity<?> cinemaMainDelete(@RequestParam("mainId") String mainId, @RequestParam("id") String id)
            throws Exception {
        // log.info(stilcutId+" 넘버!!!!!!!!!!!!!!!!!!!");
        int result = fileService.delete(mainId);
        if (result > 0) {
            log.info("풍경 삭제 성공!");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } else {
            log.info("풍경 삭제 실패!");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
        // if(result>0){
        // return "redirect:/admin/cinema/update?id="+id;
        // }
        // return "redirect:/admin/cinema/update?id="+id+"&error";
    }

    /**
     * 메인이미지 변경
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping(value = "/cinema/mainPlus", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> mainPlus(@ModelAttribute Cinema cinema,
    @RequestParam("mainFiles") MultipartFile[] mainFiles) throws Exception {
        // log.info(cinema.toString());
        int result = fileService.delete(cinema.getFileId());

        if (result > 0) {
            for (MultipartFile files : cinema.getMainFiles()) {
                Files file = new Files();
                file.setFile(files);
                file.setDivision("main");
                file.setFkTable("cinema");
                file.setFkId(cinema.getId());
                fileService.upload(file);
            }
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } else {
            log.info("시네마 생성 실패!");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
        // return "redirect:/admin/cinema/update?id="+cinema.getId();
    }

    /*
     * ------------------------------------- 영화관
     * 끝-------------------------------------
     */

    /*
     * ------------------------------------- 시어터
     * 시작-------------------------------------
     */

    /**
     * 개별 영화관 진입
     * 
     * @return
     */
    // 해당 아이디 권한 추가 요망
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    @GetMapping("/cinema/enter")
    public ResponseEntity<?> cinemaEnter(@RequestParam("id") String id,
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "10") Integer size) throws Exception {
        try {
            // 데이터 요청
            PageInfo<Theater> pageInfo = null;
            pageInfo = theaterService.list(page, size, id);
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("pageInfo", pageInfo.getList());
            // response.put("pageInfo", pageInfo);
            response.put("pagination", pagination);
            response.put("cinema", cinemaService.select(id));
            response.put("search", id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/theater/list";
    }

    /**
     * 상영관 생성 진입
     * 
     * @param model
     * @return
     * @throws Exception
     */
    // @PreAuthorize("(hasRole('SUPER')) or ( #p1 != null and @TheaterService.isOwner(#p1,authentication.principal.user.authList))")
    // @GetMapping("/theater/insert")
    // public ResponseEntity<?> theaterInsert(@RequestParam("id") String id,
    //         @RequestParam(name = "fileName", required = false) String fileName) throws Exception {
    //     try {
    //         Map<String, Object> response = new HashMap<String, Object>();
    //         response.put("cinema", cinemaService.select(id));
    //         response.put("fileName", fileName);
    //         return new ResponseEntity<>(response, HttpStatus.OK);
    //     } catch (Exception e) {
    //         return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
    //     }
    //     // return "/admin/theater/insert";
    // }

    FileText ft = new FileText();

    /**
     * 시네마 생성
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    // @ResponseBody
    @PostMapping("/theater/insert")
    public ResponseEntity<?> theaterInsert(@RequestParam("id") String id,
            @RequestBody Theater theater) throws Exception {
        String uuid = UUID.randomUUID().toString();
        theater.setId(uuid);
        theater.setMap(theater.getId());
        theater.setMapSize(theater.getX() * theater.getY());

        log.info("*******맵 : " + theater);

        // 맵 위치 확인 로직 예시
        List<List<String>> mapData = theater.getMapData();
        // log.info("맵 위치 3.0 : " + mapData.get(3).get(0)); //출력결과 기본값 D_1 (4번째줄 첫번째값)

        // 2차원 리스트를 문자열로 변환
        StringBuilder sb = new StringBuilder();
        for (List<String> row : mapData) {
            if (sb.length() > 0) {
                sb.append("\n"); // 행 구분자 추가
            }
            sb.append(String.join(",", row)); // 내부 리스트를 문자열로 변환
        }
        String result = sb.toString();

        int count = 0;
        for (List<String> row : mapData) {
            for (String row1 : row) {
                if (row1.equals("null") || row1.equals("통로")) {
                    count++;
                }
            }
        }

        int seat = theater.getMapSize() - count;
        theater.setSeat(seat);

        int rs = theaterService.insert(theater);

        /***** ----------------------------------------------- */

        String path = "C:\\upload\\test"; // 파일 저장 경로
        String fileName = theater.getId();
        String fileName_1 = fileName + ".txt"; // 파일 이름

        // text 파일로 저장
        ft.write(path, fileName_1, result);

        /***** ----------------------------------------------- */

        // if(rs>0){
        // return "SUCCESS";
        // }
        // return "FAIL";

        if (rs > 0) {
            log.info("상영관 생성 성공!");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } else {
            log.info("상영관 생성 실패!");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    /**
     * 상영관 선택
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    @GetMapping("/theater/select")
    public ResponseEntity<?> theaterSelect(@RequestParam("id") String id, @RequestParam("theaterId") String theaterId)
            throws Exception {

        try {
            // 데이터 요청
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("cinema", cinemaService.select(id));
            response.put("theater", theaterService.select(theaterId));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/theater/select";
    }

    /**
     * 상영관 수정
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    @GetMapping("/theater/update")
    public ResponseEntity<?> theaterUpdate(@RequestParam("id") String id, @RequestParam("theaterId") String theaterId)
            throws Exception {

        try {
            // 데이터 요청
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("cinema", cinemaService.select(id));
            response.put("theater", theaterService.select(theaterId));
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // return "/admin/theater/update";
    }

    /**
     * 시네마 업데이트
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    // @ResponseBody
    @PostMapping("/theater/update")
    public ResponseEntity<?> theaterUpate(@RequestParam("id") String id,
            @RequestBody Theater theater) throws Exception {
        theater.setMap(theater.getId());
        theater.setMapSize(theater.getX() * theater.getY());

        log.info("*******맵 : " + theater);

        // 맵 위치 확인 로직 예시
        List<List<String>> mapData = theater.getMapData();
        // log.info("맵 위치 3.0 : " + mapData.get(3).get(0)); //출력결과 기본값 D_1 (4번째줄 첫번째값)

        // 2차원 리스트를 문자열로 변환
        StringBuilder sb = new StringBuilder();
        for (List<String> row : mapData) {
            if (sb.length() > 0) {
                sb.append("\n"); // 행 구분자 추가
            }
            sb.append(String.join(",", row)); // 내부 리스트를 문자열로 변환
        }
        String result = sb.toString();

        int count = 0;
        for (List<String> row : mapData) {
            for (String row1 : row) {
                if (row1.equals("null") || row1.equals("통로")) {
                    count++;
                }
            }
        }

        int seat = theater.getMapSize() - count;
        theater.setSeat(seat);

        int rs = theaterService.update(theater);

        /***** ----------------------------------------------- */

        String path = "C:\\upload\\test"; // 파일 저장 경로
        String fileName = theater.getId();
        String fileName_1 = fileName + ".txt"; // 파일 이름

        // text 파일로 저장
        ft.write(path, fileName_1, result);

        /***** ----------------------------------------------- */

        if (rs > 0) {
            log.info("상영관 업데이트 성공!");
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        } else {
            log.info("상영관 업데이트 실패!");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
        // if(rs>0){
        // return "SUCCESS";
        // }
        // return "FAIL";
    }

    /*
     * ------------------------------------- 시어터
     * 끝-------------------------------------
     */

    /*
     * --------------------------------------상영 리스트 --------------------------------
     */

    /**
     * 상영 리스트 진입
     * 
     * @return
     */
    // 해당 아이디 권한 추가 요망
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    @GetMapping("/theaterList/list")
    public ResponseEntity<?> theaterListList(@RequestParam("id") String id,
            @RequestParam(name = "search", required = false) String search,
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "10") Integer size) throws Exception {

        try {
            // 데이터 요청
            PageInfo<TheaterList> pageInfo = null;
            Map<String, Object> response = new HashMap<String, Object>();
            if (search == null || search.equals("")) {
                pageInfo = theaterListService.list(page, size, id);
            } else {
                pageInfo = theaterListService.list(page, size, id, search);
                response.put("search", search);
            }
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());
            response.put("pageInfo", pageInfo.getList());
            response.put("pagination", pagination);
            response.put("cinema", cinemaService.select(id));
            response.put("id", id);
            // model.addAttribute("pageInfo", pageInfo);
            // model.addAttribute("cinema", cinemaService.select(id));
            // model.addAttribute("id", id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/theaterList/list";
    }

    /**
     * 상영 리스트 생성 진입
     * 
     * @return
     */
    // 해당 아이디 권한 추가 요망
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    @GetMapping("/theaterList/insert")
    public ResponseEntity<?> theaterListInsert(@RequestParam("id") String id,
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 데이터 요청
            List<Theater> theaterLists = theaterService.list(id);
            List<Movie> movieList = null;
            Map<String, Object> response = new HashMap<String, Object>();
            if (search == null || search.isEmpty()) {
                movieList = movieService.list();
            } else {
                movieList = movieService.list(search);
                response.put("search", search);
            }
            response.put("theaterLists", theaterLists);
            response.put("pageInfo", movieList);
            response.put("cinema", cinemaService.select(id));
            response.put("id", id);
            // model.addAttribute("theaterLists", theaterLists);
            // model.addAttribute("pageInfo", movieList);
            // model.addAttribute("cinema", cinemaService.select(id));
            // model.addAttribute("id", id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/theaterList/insert";
    }

    /**
     * 상영 리스트 생성
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    @PostMapping(value = "/theaterList/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> theaterListInsert(
        @ModelAttribute TheaterList theaterList) throws Exception {
        try {
            // 데이터 요청
            int result = theaterListService.insert(theaterList);
            Map<String, Object> response = new HashMap<String, Object>();
            // model.addAttribute("cinema", );
            // model.addAttribute("id", id);
            if (result > 0) {
                log.info("상영리스트 생성 성공!");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("상영리스트 생성 실패!");
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // if(result>0){
        // return "redirect:/admin/theaterList/list?id="+id;
        // }
        // return "redirect:/admin/theaterList/list?id=id&error";
    }

    /**
     * 상영 리스트 조회
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    @GetMapping("/theaterList/select")
    public ResponseEntity<?> theaterListSelect(@RequestParam("id") String id,
            @RequestParam("theaterListId") String theaterListId) throws Exception {
        try {
            // 데이터 요청
            TheaterList theaterList = theaterListService.select(theaterListId);

            Map<String, Object> response = new HashMap<String, Object>();
            response.put("theaterList", theaterList);
            response.put("cinema", cinemaService.select(id));
            response.put("id", id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/theaterList/select";
    }

    /**
     * 상영 리스트 업데이트 진입
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    @GetMapping("/theaterList/update")
    public ResponseEntity<?> theaterListUpdate(@RequestParam("id") String id,
            @RequestParam("theaterListId") String theaterListId,
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 해당 검색을 위한거
            TheaterList theaterList = theaterListService.select(theaterListId);
            // 1관,2관,3관...
            List<Theater> theaterLists = theaterService.list(id);

            Map<String, Object> response = new HashMap<String, Object>();
            List<Movie> movieList = null;
            if (search == null || search.isEmpty()) {
                movieList = movieService.list();
            } else {
                movieList = movieService.list(search);
                response.put("search", search);
            }

            response.put("pageInfo", movieList);
            response.put("theaterLists", theaterLists);
            log.info(theaterList.toString());
            response.put("theaterList", theaterList);
            response.put("cinema", cinemaService.select(id));
            response.put("id", id);
            // 모델 등록
            // model.addAttribute("theaterLists", theaterLists);
            // model.addAttribute("pageInfo", movieList);
            // model.addAttribute("theaterList", theaterList);
            // model.addAttribute("cinema", cinemaService.select(id));
            // model.addAttribute("id", id);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // return "/admin/theaterList/Update";
    }

    /**
     * 업데이트 post
     * 
     * @param model
     * @param movie
     * @return
     * @throws Exception
     */
    @PreAuthorize("(hasRole('SUPER')) or ( #p0 != null and @TheaterService.isOwner(#p0,authentication.principal.user.authList))")
    @PostMapping(value = "/theaterList/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> theaterListUpdate(@RequestParam("cinemaId") String id,
            @ModelAttribute TheaterList theaterList) throws Exception {

        try {
            // 데이터 요청
            int result = theaterListService.update(theaterList);
            Map<String, Object> response = new HashMap<String, Object>();
            //response.put("cinema", cinemaService.select(id));
            //response.put("id", id);
            log.info(theaterList.toString());
            // model.addAttribute("cinema", cinemaService.select(id));
            // model.addAttribute("id", id);
            if (result > 0) {
                log.info("상영리스트 업뎃 성공!");
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("상영리스트 업뎃 실패!");
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // if(result>0){
        // log.info("성공!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        // return
        // "redirect:/admin/theaterList/select?id="+id+"&theaterListId="+theaterList.getId();
        // }
        // log.info("실패!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
        // return
        // "redirect:/admin/theaterList/select?id="+id+"&theaterListId="+theaterList.getId()+"&error";
    }

    /*
     * --------------------------------------상영 리스트 끝
     * --------------------------------
     */

    /*
     * --------------------------------------- 배너 관리
     * ------------------------------------
     */

    @Secured("ROLE_SUPER")
    @GetMapping("/banner/list")
    public ResponseEntity<?> bannerList() throws Exception {
        try {
            // 데이터 요청
            List<Banner> bannerList = bannerService.list();
            List<Banner> subBannerList = bannerService.subBannerList();

            Map<String, Object> response = new HashMap<String, Object>();
            response.put("bannerList", bannerList);
            response.put("subBannerList", subBannerList);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/banner/list";
    }

    /**
     * 선택
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/banner/select")
    public ResponseEntity<?> bannerSelect(@RequestParam("id") String id) throws Exception {
        try {
            // 데이터 요청
            Banner banner = bannerService.select(id);
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("banner", banner);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

        // return "/admin/banner/select";
    }

    /**
     * 추가
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/banner/insert")
    public ResponseEntity<?> bannerInsert(
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 데이터 요청
            List<Movie> movieList = null;
            Map<String, Object> response = new HashMap<String, Object>();
            if (search == null || search.isEmpty()) {
                movieList = movieService.list();
            } else {
                movieList = movieService.list(search);
                response.put("search", search);
            }
            response.put("pageInfo", movieList);
            // model.addAttribute("pageInfo", movieList);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/banner/insert";
    }

    /**
     * 배너 생성
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping(value = "/banner/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> bannerInsert(@ModelAttribute Banner banner
    ,@RequestParam("mainFiles") MultipartFile[] mainFiles) throws Exception {

        try {
            // 데이터 요청
            int result = bannerService.insert(banner);
            Map<String, Object> response = new HashMap<String, Object>();
            if (result > 0) {
                for (MultipartFile files : banner.getMainFiles()) {
                    Files file = new Files();
                    file.setFile(files);
                    file.setDivision("main");
                    file.setFkTable("banner");
                    file.setFkId(banner.getId());

                    fileService.upload(file);
                }
                // return "redirect:/admin/banner/list";
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            // return "redirect:/admin/banner/list&error";
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 추가
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/banner/update")
    public ResponseEntity<?> bannerUpdate(@RequestParam("id") String id,
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 데이터 요청
            Banner banner = bannerService.select(id);
            Map<String, Object> response = new HashMap<String, Object>();
            // model.addAttribute("banner", banner);
            response.put("banner", banner);
            List<Movie> movieList = null;
            if (search == null || search.isEmpty()) {
                movieList = movieService.list();
            } else {
                movieList = movieService.list(search);
                response.put("search", search);
            }
            // model.addAttribute("pageInfo", movieList);
            response.put("pageInfo", movieList);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/banner/update";
    }

    /**
     * 배너 수정
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping(value = "/banner/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> bannerUpdate(@ModelAttribute Banner banner,
    @RequestParam(name ="mainFiles", required = false) MultipartFile[] mainFiles) throws Exception {

        try {
            // 데이터 요청
            Banner pastBanner = bannerService.select(banner.getId());
            int result = bannerService.update(banner);
            log.info(pastBanner.toString());
            Map<String, Object> response = new HashMap<String, Object>();
            if (result > 0 ) {
                if(mainFiles != null){
                    for (MultipartFile files : banner.getMainFiles()) {
                        Files file = new Files();
                        file.setFile(files);
                        file.setDivision("main");
                        file.setFkTable("banner");
                        file.setFkId(banner.getId());
    
                        fileService.update(file, pastBanner.getFiles().getId());
                    }
                }
                response.put("id", banner.getId());
                // return "redirect:/admin/banner/select?id="+banner.getId();
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            // return "redirect:/admin/banner/update?id="+banner.getId()+"&error";
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 삭제
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/banner/delete")
    public ResponseEntity<?> bannerDelete(@RequestParam("id") String id) throws Exception {

        try {
            // 데이터 요청
            Banner banner = bannerService.select(id);

            Map<String, Object> response = new HashMap<String, Object>();
            response.put("id", id);

            int rs = fileService.delete(banner.getFiles().getId());
            int rss = 0;
            if (rs > 0) {
                rss = bannerService.delete(id);
            } else {
                response.put("error", "fileDeleteFail");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
                // return "redirect:/admin/banner/update?id="+id+"&error=fileDeleteFail";
            }
            if (rss > 0) {
                // return "redirect:/admin/banner/list";
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            // return "redirect:/admin/banner/update?id="+id+"&error=bannerDeleteFail";
            response.put("error", "bannerDeleteFail");
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
     * --------------------------------------- 배너 관리 끝
     * ------------------------------------
     */

    /*
     * ------------------------------------- 영화
     * 관련-------------------------------------
     */

    /**
     * 영화 리스트
     * 
     * @param model
     * @param page
     * @param size
     * @param search
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/movie/list")
    public ResponseEntity<?> movieList(@RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "6") Integer size,
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 데이터 요청
            PageInfo<Movie> pageInfo = null;
            Map<String, Object> response = new HashMap<String, Object>();
            if (search == null || search.equals("")) {
                pageInfo = movieService.list(page, size);
            } else {
                pageInfo = movieService.list(page, size, search);
            }
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());

            response.put("pageInfo", pageInfo.getList());
            response.put("pagination", pagination);
            response.put("search", search);

            // 모델 등록
            // model.addAttribute("pageInfo", pageInfo);
            // model.addAttribute("pagination", pagination);
            // model.addAttribute("search", search);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // 뷰 페이지 지정
        // return "/admin/movie/list";
    }

    /**
     * 영화 선택
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/movie/select")
    public ResponseEntity<?> movieSelect(@RequestParam("id") String id) throws Exception {
        try {
            // 데이터 요청
            Movie movie = movieService.select(id);

            Map<String, Object> response = new HashMap<String, Object>();
            response.put("movie", movie);
            // log.info(movie.toString());
            // model.addAttribute("movie", movie);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/movie/select";
    }

    /**
     * 영화 생성
     * 
     * @param model
     * @return
     * @throws Exception
     */
    // @Secured("ROLE_SUPER")
    // @GetMapping("/movie/insert")
    // public String movieInsert(Model model) throws Exception {

    // return "/admin/movie/insert";
    // }

    /**
     * 영화 생성
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping(value = "/movie/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> movieInsert(@ModelAttribute Movie movie,
    @RequestParam("mainFiles") MultipartFile[] mainFiles,
    @RequestParam(name ="stilcuts" ,required = false) MultipartFile[] stilcuts) throws Exception {

        try {
            // 데이터 요청
            int result = movieService.insert(movie);

            if (result > 0) {
                for (MultipartFile files : movie.getMainFiles()) {
                    Files file = new Files();
                    file.setFile(files);
                    file.setDivision("main");
                    file.setFkTable("movie");
                    file.setFkId(movie.getId());
    
                    fileService.upload(file);
                }
                if(stilcuts != null){
                    for (MultipartFile stilcut : movie.getStilcuts()) {
                        Files stilfile = new Files();
                        stilfile.setFile(stilcut);
                        stilfile.setDivision("stilcut");
                        stilfile.setFkTable("movie");
                        stilfile.setFkId(movie.getId());
                        fileService.upload(stilfile);
                    }
                }
                log.info("영화 생성 성공!");
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
                // return "redirect:/admin/movie/list";
            } else {
                log.info("영화 생성 실패!");
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
                // return "redirect:/admin/movie/list&error";
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    

    /**
     * 업데이트 post
     * 
     * @param model
     * @param movie
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping(value ="/movie/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> movieUpdate(@ModelAttribute Movie movie) throws Exception {

        try {
            // 데이터 요청
            int result = movieService.update(movie);
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("id", movie.getId());
            if (result > 0) {
                log.info("상영리스트 생성 성공!");
                // return "redirect:/admin/movie/select?id="+movie.getId();
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("상영리스트 생성 실패!");
                // return "redirect:/admin/movie/update?id="+movie.getId()+"&error";
                response.put("error", "error");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 스틸컷 삭제
     * 
     * @param model
     * @param username
     * @param no
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/movie/stilcutDelete")
    public ResponseEntity<?> stilcutDelete(@RequestParam("stilcutId") String stilcutId, @RequestParam("id") String id)
            throws Exception {

        try {
            // log.info(stilcutId+" 넘버!!!!!!!!!!!!!!!!!!!");
            int result = fileService.delete(stilcutId);
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("id", id);
            if (result > 0) {
                log.info("스틸컷 삭제 성공!");
                // return "redirect:/admin/movie/update?id="+id;
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("스틸컷 삭제 실패!");
                response.put("error", "error");
                // return "redirect:/admin/movie/update?id="+id+"&error";
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 스틸컷 추가
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping("/movie/stilcutPlus")
    public ResponseEntity<?> stilcutPlus(@ModelAttribute Movie movie,
    @RequestParam("stilcuts") MultipartFile[] stilcuts
        ) throws Exception {

        try {
            Map<String, Object> response = new HashMap<String, Object>();
            log.info(movie.toString());
            for (MultipartFile stilcut : movie.getStilcuts()) {
                Files stilfile = new Files();
                stilfile.setFile(stilcut);
                stilfile.setDivision("stilcut");
                stilfile.setFkTable("movie");
                stilfile.setFkId(movie.getId());
                fileService.upload(stilfile);
            }
            response.put("id", movie.getId());
            // return "redirect:/admin/movie/update?id="+movie.getId();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 메인이미지 변경
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping("/movie/mainPlus")
    public ResponseEntity<?> mainPlus(@ModelAttribute Movie movie,
    @RequestParam("mainFiles") MultipartFile[] mainFiles
    ) throws Exception {
        try {
            log.info(movie.toString());
            int result = fileService.delete(movie.getFileId());
            if (result > 0) {
                for (MultipartFile files : movie.getMainFiles()) {
                    Files file = new Files();
                    file.setFile(files);
                    file.setDivision("main");
                    file.setFkTable("movie");
                    file.setFkId(movie.getId());
                    fileService.upload(file);
                }
            }
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("id", movie.getId());
            // return "redirect:/admin/movie/update?id="+movie.getId();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
     * ------------------------------------- 영화
     * 끝-------------------------------------
     */

    /*-------------------------------------- 출연진 --------------------------------------------- */

    /**
     * 출연진 리스트
     * 
     * @param model
     * @param page
     * @param size
     * @param search
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/cast/list")
    public ResponseEntity<?> castList(
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "10") Integer size,
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 데이터 요청
            PageInfo<Cast> pageInfo = null;
            Map<String, Object> response = new HashMap<String, Object>();
            if (search == null || search.equals("")) {
                pageInfo = castService.list(page, size);
            } else {
                pageInfo = castService.list(page, size, search);
            }
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());

            // 모델 등록
            // model.addAttribute("pageInfo", pageInfo);
            // model.addAttribute("pagination", pagination);
            // model.addAttribute("search", search);
            response.put("pageInfo", pageInfo.getList());
            response.put("pagination", pagination);
            response.put("search", search);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // 뷰 페이지 지정
        // return "/admin/cast/list";
    }

    /**
     * 선택
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/cast/select/{id}")
    public ResponseEntity<?> castSelect(@PathVariable("id") String id) throws Exception {

        try {
            // 데이터 요청
            Cast cast = castService.select(id);
            Map<String, Object> response = new HashMap<String, Object>();
            // model.addAttribute("cast", cast);
            response.put("cast", cast);
            // return "/admin/cast/select";
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 추가
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/cast/insert")
    public ResponseEntity<?> castInsert(
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 데이터 요청
            List<Movie> movieList = null;
            Map<String, Object> response = new HashMap<String, Object>();
            if (search == null || search.isEmpty()) {
                movieList = movieService.list();
            } else {
                movieList = movieService.list(search);
                // model.addAttribute("search", search);
                response.put("search", search);
            }

            // model.addAttribute("pageInfo", movieList);
            response.put("pageInfo", movieList);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/cast/insert";
    }

    /**
     * 캐스터 생성
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping("/cast/insert")
    public ResponseEntity<?> castInsert(@RequestBody Cast cast) throws Exception {

        try {
            // 데이터 요청
            int result = castService.insert(cast);
            Map<String, Object> response = new HashMap<String, Object>();
            if (result > 0) {
                for (MultipartFile files : cast.getMainFiles()) {
                    Files file = new Files();
                    file.setFile(files);
                    file.setDivision("main");
                    file.setFkTable("cast");
                    file.setFkId(cast.getId());

                    fileService.upload(file);
                }
                // return "redirect:/admin/cast/list";
                log.info("캐스터 생성 성공!");
                return new ResponseEntity<>(response, HttpStatus.OK);
            }
            // return "redirect:/admin/cast/list&error";
            log.info("캐스터 생성 실패!");
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 추가
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/cast/update")
    public ResponseEntity<?> castUpdate(@RequestParam("id") String id,
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 데이터 요청
            Map<String, Object> response = new HashMap<String, Object>();
            Cast cast = castService.select(id);
            // model.addAttribute("cast", cast);
            response.put("cast", cast);
            List<Movie> movieList = null;
            if (search == null || search.isEmpty()) {
                movieList = movieService.list();
            } else {
                movieList = movieService.list(search);
                response.put("search", search);
            }
            // model.addAttribute("pageInfo", movieList);
            response.put("pageInfo", movieList);
            // return "/admin/cast/update";
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 배너 수정
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping("/cast/update")
    public ResponseEntity<?> bannerUpdate(@RequestBody Cast cast) throws Exception {

        try {
            // 데이터 요청
            Cast pastCast = castService.select(cast.getId());
            int result = castService.update(cast);
            // log.info(pastCast.toString());

            Map<String, Object> response = new HashMap<String, Object>();

            response.put("id", cast.getId());
            if (result > 0) {
                for (MultipartFile files : cast.getMainFiles()) {
                    Files file = new Files();
                    file.setFile(files);
                    file.setDivision("main");
                    file.setFkTable("cast");
                    file.setFkId(cast.getId());

                    fileService.update(file, pastCast.getFiles().getId());
                }
                // return "redirect:/admin/cast/select?id="+cast.getId();
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                response.put("errpr", "error");
                // return "redirect:/admin/cast/update?id="+cast.getId()+"&error";
                log.info("상영리스트 생성 실패!");
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * 삭제
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/cast/delete")
    public ResponseEntity<?> castDelete(@RequestParam("id") String id) throws Exception {

        try {
            // 데이터 요청
            Cast cast = castService.select(id);
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("id", id);

            int rs = fileService.delete(cast.getFiles().getId());
            int rss = 0;
            if (rs > 0) {
                rss = castService.delete(id);
            } else {
                // return "redirect:/admin/cast/update?id="+id+"&error=castDeleteFail";
                return new ResponseEntity<>("castDeleteFail", HttpStatus.BAD_REQUEST);
            }

            if (rss > 0) {
                return new ResponseEntity<>(response, HttpStatus.OK);
                // return "redirect:/admin/cast/list";
            }
            // return "redirect:/admin/cast/update?id="+id+"&error=castDeleteFail";
            return new ResponseEntity<>("castDeleteFail", HttpStatus.BAD_REQUEST);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*-------------------------------------- 출연진 끝 --------------------------------------------- */

    /*-------------------------------------- 공지사항 --------------------------------------------- */

    /**
     * 출연진 리스트
     * 
     * @param model
     * @param page
     * @param size
     * @param search
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/notice/list")
    public ResponseEntity<?> noticeList(
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "10") Integer size,
            @RequestParam(name = "option", defaultValue = "1") int option,
            @RequestParam(name = "search", defaultValue = "") String search) throws Exception {
        // 데이터 요청

        try {
            // 데이터 요청
            PageInfo<Notice> pageInfo = noticeService.list(page, size, option, search);
            Map<String, Object> response = new HashMap<String, Object>();
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());

            response.put("pageInfo", pageInfo.getList());
            response.put("pagination", pagination);
            response.put("search", search);

            // 모델 등록
            // model.addAttribute("pageInfo", pageInfo);
            // model.addAttribute("search", search);
            // 뷰 페이지 지정
            // return "/admin/notice/list";
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 선택
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/notice/select")
    public ResponseEntity<?> noticeSelect(@RequestParam("id") String id) throws Exception {

        try {
            // 데이터 요청
            Notice notice = noticeService.select(id);

            Map<String, Object> response = new HashMap<String, Object>();
            // model.addAttribute("notice", notice);
            response.put("notice", notice);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // return "/admin/notice/select";
    }

    /**
     * 추가
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    // @Secured("ROLE_SUPER")
    // @GetMapping("/notice/insert")
    // public String noticeInsert(Model model) throws Exception {

    // return "/admin/notice/insert";
    // }

    /**
     * 배너 생성
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping("/notice/insert")
    public ResponseEntity<?> noticeInsert(
            @RequestBody Notice notice) throws Exception {

        try {
            // 데이터 요청
            int result = noticeService.insert(notice);

            if (result > 0) {
                log.info("공지사항 생성 성공!");
                // return "redirect:/admin/notice/list";
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            } else {
                log.info("공지사항 생성 실패!");
                // return "redirect:/admin/notice/list&error";
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * 추가
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/notice/update")
    public ResponseEntity<?> castUpdate(@RequestParam("id") String id) throws Exception {

        try {
            // 데이터 요청
            Notice notice = noticeService.select(id);

            Map<String, Object> response = new HashMap<String, Object>();
            // model.addAttribute("notice", notice);
            response.put("notice", notice);
            // return "/admin/notice/update";
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 배너 수정
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping("/notice/update")
    public ResponseEntity<?> noticeUpdate(
            @RequestBody Notice notice) throws Exception {
        try {
            // 데이터 요청
            int result = noticeService.update(notice);
            Map<String, Object> response = new HashMap<String, Object>();

            response.put("id", notice.getId());
            if (result > 0) {
                log.info("공지 업뎃 성공!");
                // return "redirect:/admin/notice/select?id="+notice.getId();
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("공지 업뎃 실패!");
                // return "redirect:/admin/notice/update?id="+notice.getId()+"&error";
                response.put("error", "error");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 삭제
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/notice/delete")
    public ResponseEntity<?> noticeDelete(@RequestParam("id") String id) throws Exception {

        try {
            // 데이터 요청
            int rs = noticeService.delete(id);
            Map<String, Object> response = new HashMap<String, Object>();

            response.put("id", id);
            if (rs > 0) {
                log.info("공지 식제 성공!");
                // return "redirect:/admin/notice/list";
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("공지 삭제 실패!");
                // return "redirect:/admin/notice/update?id="+id+"&error=noticeDeleteFail";
                response.put("error", "noticeDeleteFail");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*-------------------------------------- 공지사항 끝 --------------------------------------------- */

    /*
     * ------------------------------------- 유저 리스트 관
     * 련-------------------------------------
     */

    /**
     * 유저 리스트
     * 
     * @param model
     * @param page
     * @param size
     * @param search
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/userManager/user/list")
    public ResponseEntity<?> userList(
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "16") Integer size,
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 데이터 요청
            PageInfo<Users> pageInfo = null;
            Map<String, Object> response = new HashMap<String, Object>();
            if (search == null || search.equals("")) {
                pageInfo = userService.list(page, size);
            } else {
                pageInfo = userService.list(page, size, search);
            }
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());
            // 모델 등록
            response.put("pageInfo", pageInfo.getList());
            response.put("pagination", pagination);
            response.put("search", search);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
        // 뷰 페이지 지정
        // return "/admin/userManager/user/list";
    }

    /**
     * 유저 선택
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/userManager/user/select")
    public ResponseEntity<?> userSelect(@RequestParam("username") String username) throws Exception {

        try {
            // 데이터 요청
            Users user = userService.select(username);

            Map<String, Object> response = new HashMap<String, Object>();
            // model.addAttribute("user", user);
            response.put("user", user);
            // return "/admin/userManager/user/select";
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 업데이트 화면 진입
     * 
     * @param model
     * @param username
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/userManager/user/update")
    public ResponseEntity<?> userUpdate(@RequestParam("username") String username) throws Exception {
        try {
            // 데이터 요청
            Users user = userService.select(username);
            List<AuthList> authList = authListService.list();

            Map<String, Object> response = new HashMap<String, Object>();
            // model.addAttribute("user", user);
            // model.addAttribute("authList", authList);
            response.put("user", user);
            response.put("authList", authList);
            // return "/admin/userManager/user/update";
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 업데이트 post
     * 
     * @param model
     * @param user
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping(value = "/userManager/user/update", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> userUpdate(@ModelAttribute Users user) throws Exception {

        try {
            // 데이터 요청
            int result = userService.update(user);
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("username", user.getUsername());
            if (result > 0) {
                log.info("유저 정보 업뎃 성공!");
                // return
                // "redirect:/admin/userManager/user/select?username="+user.getUsername();
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("유저 정보 업뎃 실패!");
                // return
                // "redirect:/admin/userManager/user/update?username="+user.getUsername()+"&error";
                response.put("error", "error");
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 유저 권한 삭제
     * 
     * @param model
     * @param username
     * @param no
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/userManager/user/authDelete")
    public ResponseEntity<?> userAuthDelete(@RequestParam("username") String username, @RequestParam("no") int no)
            throws Exception {

        try {
            // 데이터 요청
            int result = userService.deleteAuth(no);
            Map<String, Object> response = new HashMap<String, Object>();
            response.put("username", username);
            if (result > 0) {
                log.info("유저 권한 삭제 성공!");
                // return "redirect:/admin/userManager/user/update?username="+username;
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("유저 권한 삭제 실패!");
                response.put("error", "error");
                // return "redirect:/admin/userManager/user/update?username="+username+"&error";
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * 유저 권한 추가
     * 
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping(value = "/userManager/user/authPlus", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> userAuthPlus(@ModelAttribute UserAuth userAuth) throws Exception {

        try {
            // 데이터 요청
            int result = userService.insertAuth(userAuth);
            Map<String, Object> response = new HashMap<String, Object>();

            response.put("username", userAuth.getUserId());
            if (result > 0) {
                log.info("유저 권한 추가 성공!");
                // return
                // "redirect:/admin/userManager/user/update?username="+userAuth.getUserId();
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("유저 권한 추가 실패!");
                // return
                // "redirect:/admin/userManager/user/update?username="+userAuth.getUserId()+"&error";
                response.put("error", "error");
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /**
     * 유저 휴먼 전환
     * 
     * @param id
     * @return
     * @throws Exception
     */
    //@Secured("ROLE_SUPER")
    @GetMapping("/userManager/user/sleep")
    public ResponseEntity<?> userSleep(@RequestParam("username") String username) throws Exception {

        try {
            // 데이터 요청
            Users user = userService.select(username);
            if (user.isEnabled()) {
                user.setEnabled(false);
            } else {
                user.setEnabled(true);
            }
            int result = userService.update(user);
            Map<String, Object> response = new HashMap<String, Object>();
            if (result > 0) {
                log.info("유저 휴먼 전환 성공!");
                // return "redirect:/admin/userManager/user/list";
                return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
            } else {
                log.info("유저 휴먼 전환 실패!");
                response.put("error", "error");
                // return "redirect:/admin/userManager/user/list?error";
                return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
     * ------------------------------------- 유저 리스트
     * 끝-------------------------------------
     */

    // @Secured("ROLE_ADMIN")
    // @GetMapping("/userManager/auth/list")
    // public String authList(Model model) throws Exception {
    // List<AuthList> authList = null;
    // authList = authListService.list();
    // model.addAttribute("AuthList", authList);
    // return "/admin/userManager/auth/list";
    // }

    /*
     * ------------------------------------- 권 한 관
     * 련-------------------------------------
     */

    /**
     * 권한 목록 조회 화면
     * 
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/userManager/auth/list")
    public ResponseEntity<?> authList(
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "10") Integer size,
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 데이터 요청
            PageInfo<AuthList> pageInfo = null;
            Map<String, Object> response = new HashMap<String, Object>();
            if (search == null || search.equals("")) {
                pageInfo = authListService.list(page, size);
            } else {
                pageInfo = authListService.list(page, size, search);
            }
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());

            // 모델 등록
            // model.addAttribute("pageInfo", pageInfo);
            // model.addAttribute("pagination", pagination);
            // model.addAttribute("search", search);
            // 뷰 페이지 지정
            // return "/admin/userManager/auth/list";

            response.put("pageInfo", pageInfo.getList());
            response.put("pagination", pagination);
            response.put("search", search);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 권한 생성 진입
     * 
     * @return
     */
    // @Secured("ROLE_SUPER")
    // @GetMapping("/userManager/auth/insert")
    // public String authInsert() {

    // return "/admin/userManager/auth/insert";
    // }

    /**
     * 권한 생성
     * 
     * @param authList
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @PostMapping(value = "/userManager/auth/insert", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> postMethodName(@ModelAttribute AuthList authList) throws Exception {

        log.info("authList : " + authList);

        try {
            // 데이터 요청
            int result = authListService.insert(authList);
            Map<String, Object> response = new HashMap<String, Object>();
            if (result > 0) {
                log.info("상영리스트 생성 성공!");
                // return "redirect:/admin/userManager/auth/list";
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("상영리스트 생성 실패!");
                response.put("error", "error");
                // return "redirect:/admin/userManager/auth/list?error";
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 권한 삭제
     * 
     * @param no
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/userManager/auth/delete")
    public ResponseEntity<?> authDelete(@RequestParam("no") int no) throws Exception {

        try {
            // 데이터 요청
            int result = authListService.delete(no);
            Map<String, Object> response = new HashMap<String, Object>();
            if (result > 0) {
                log.info("권한 삭제 성공!");
                // return "redirect:/admin/userManager/auth/list";
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("권한 삭제 실패!");
                response.put("error", "error");
                // return "redirect:/admin/userManager/auth/list?error";
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /*
     * ------------------------------------- 권 한 리스트
     * 끝-------------------------------------
     */

    /*
     * ----------------------------- 리뷰 관련
     * -----------------------------------------------------
     */

    /**
     * 리뷰 목록 조회 화면
     * 
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/reviewManager/list")
    public ResponseEntity<?> reviewList(
            @RequestParam(name = "page", required = false, defaultValue = "1") Integer page,
            @RequestParam(name = "size", required = false, defaultValue = "10") Integer size,
            @RequestParam(name = "search", required = false) String search) throws Exception {

        try {
            // 데이터 요청
            PageInfo<ReviewInfo> pageInfo = null;
            Map<String, Object> response = new HashMap<String, Object>();
            if (search != null && !search.equals("")) {
                pageInfo = reviewService.adminReviewList(search, page, size);
                response.put("search", search);
            } else {
                pageInfo = reviewService.adminReviewList(page, size);
            }
            Pagination pagination = new Pagination();
            pagination.setPage(page);
            pagination.setSize(size);
            pagination.setTotal(pageInfo.getTotal());

            response.put("pageInfo", pageInfo.getList());
            response.put("pagination", pagination);

            // 모델 등록
            // model.addAttribute("pageInfo", pageInfo);

            // 뷰 페이지 지정
            // return "/admin/reviewManager/list";

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * 리뷰 삭제
     * 
     * @param no
     * @return
     * @throws Exception
     */
    @Secured("ROLE_SUPER")
    @GetMapping("/reviewManager/delete")
    public ResponseEntity<?> reviewManagerDelete(@RequestParam("id") String id) throws Exception {

        try {
            // 데이터 요청
            int result = reviewService.deleteReview(id);
            reviewService.deleteRating(id);
            Map<String, Object> response = new HashMap<String, Object>();
            if (result > 0) {
                log.info("상영리스트 생성 성공!");
                // return "redirect:/admin/reviewManager/list";
                return new ResponseEntity<>(response, HttpStatus.OK);
            } else {
                log.info("상영리스트 생성 실패!");
                response.put("error", "error");
                // return "redirect:/admin/reviewManager/list?error";
                return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
            }
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    /*
     * ----------------------------- 리뷰 관련 끝
     * -----------------------------------------------------
     */

}
