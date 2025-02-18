package com.aloha.movieproject.controller;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.movieproject.domain.CustomUser;
import com.aloha.movieproject.domain.Files;
import com.aloha.movieproject.domain.Inquiry;
import com.aloha.movieproject.domain.Users;
import com.aloha.movieproject.service.FileService;
import com.aloha.movieproject.service.InquiryService;
import com.aloha.movieproject.service.ReserveService;
import com.aloha.movieproject.service.ReviewService;
import com.aloha.movieproject.service.UserService;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;



@Slf4j
@Controller
@RequestMapping("/usersss")
@CrossOrigin("*")
public class UserController {

    @Autowired
    private UserService userService;
    
    @Autowired
    private FileService fileService;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    InquiryService inquiryService;

    @Autowired
    private ReserveService reserveService;

    @Autowired
    ReviewService reviewService;

    // @GetMapping("/encode")
    // public String encodePassword(@RequestParam String rawPassword) {
    // return passwordEncoder.encode(rawPassword);
    // }

    // @GetMapping("/mypage")
    // public String mypage(@AuthenticationPrincipal CustomUser authUser, Model model) throws Exception {
    //     if (authUser != null) {
    //         String username = authUser.getUsername();
    //         String userId = authUser.getId(); // 사용자 고유 ID (UUID)
    //         Files orifile = fileService.imageUpdate(userId);

    //         model.addAttribute("orifile", orifile);
    //         // 예매 횟수 조회
    //         int movieCount = reserveService.selectReservationCountByUsername(username);

    //         // 리뷰 수 조회
    //         int reviewCount = reviewService.countUserReviews(userId);


    //         // 모델에 데이터 추가
    //         model.addAttribute("username", username);
    //         model.addAttribute("movieCount", movieCount);
    //         model.addAttribute("grade", "일반"); // 임의 데이터
    //         model.addAttribute("reviewCount", reviewCount); // 리뷰 수 추가

    //     } else {
    //         return "redirect:/login";
    //     }

    //     return "user/mypage";

    // }

    @GetMapping("/mypage")
    public ResponseEntity<?> mypage(@AuthenticationPrincipal CustomUser authUser) throws Exception {
        log.info("::::: 마이페이지 조회 :::::");
        log.info("authUser : " + authUser);

        if (authUser == null) {
            return new ResponseEntity<>("UNAUTHORIZED", HttpStatus.UNAUTHORIZED);
        }

        String username = authUser.getUsername();
        String userId = authUser.getId(); // 사용자 고유 ID (UUID)
        Files orifile = fileService.imageUpdate(userId);

        Map<String, Object> response = new HashMap<>();
        response.put("orifile", orifile);
        // 예매 횟수 조회
        int movieCount = reserveService.selectReservationCountByUsername(username);

        // 리뷰 수 조회
        int reviewCount = reviewService.countUserReviews(userId);

        // 데이터 추가
        response.put("username", username);
        response.put("movieCount", movieCount);
        response.put("grade", "일반"); // 임의 데이터
        response.put("reviewCount", reviewCount); // 리뷰 수 추가

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
    

    // @PostMapping("/mypage")
    // public String myPage(@RequestParam("password") String password, HttpServletRequest request) {
    //     // 현재 로그인된 사용자의 정보를 가져오기
    //     String username = request.getUserPrincipal().getName();

    //     try {
    //         // DB에서 사용자 정보 가져오기
    //         Users user = userService.select(username);
    //         log.info("DB에서 가져온 사용자 비밀번호: " + user.getPassword());

    //         // user가 null이 아닌지 체크
    //         if (user != null) {
    //             // DB에서 가져온 암호화된 비밀번호와 입력된 비밀번호 비교
    //             if (passwordEncoder.matches(password, user.getPassword())) {
    //                 // 비밀번호가 맞으면 회원 수정 페이지로 이동
    //                 return "redirect:/user/mypageUpdate";
    //             } else {
    //                 // 비밀번호가 틀리면 다시 마이 페이지로
    //                 return "redirect:/user/mypage?error=invalidPassword";
    //             }
    //         } else {
    //             // 사용자 정보가 없으면 에러 처리
    //             return "redirect:/user/mypage?error=userNotFound";
    //         }
    //     } catch (Exception e) {
    //         // 예외 발생 시 에러 처리
    //         e.printStackTrace();
    //         return "redirect:/user/mypage?error=serverError";
    //     }
    // }

    @GetMapping("/checkMypage")
    public ResponseEntity<Map<String, String>> myPage(@RequestParam("password") String password, HttpServletRequest request) {
        // 현재 로그인된 사용자의 정보를 가져오기
        String username = request.getUserPrincipal().getName();
        Map<String, String> response = new HashMap<>();

        try {
            // DB에서 사용자 정보 가져오기
            Users user = userService.select(username);
            log.info("DB에서 가져온 사용자 비밀번호: " + user.getPassword());

            // user가 null이 아닌지 체크
            if (user != null) {
                // DB에서 가져온 암호화된 비밀번호와 입력된 비밀번호 비교
                if (passwordEncoder.matches(password, user.getPassword())) {
                    // 비밀번호가 맞으면 성공 응답 반환 및 리다이렉트 경로 설정
                    response.put("message", "비밀번호가 일치합니다.");
                    response.put("redirect", "/mypageedit");
                    return ResponseEntity.ok().body(response);
                } else {
                    // 비밀번호가 틀리면 에러 응답 반환
                    response.put("message", "비밀번호가 일치하지 않습니다.");
                    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
                }
            } else {
                // 사용자 정보가 없으면 에러 응답 반환
                response.put("message", "사용자를 찾을 수 없습니다.");
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
            }
        } catch (Exception e) {
            // 예외 발생 시 에러 응답 반환
            e.printStackTrace();
            response.put("message", "서버 오류가 발생했습니다.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    @GetMapping("/mypageUpdate")
    public String mypageUpdate(@AuthenticationPrincipal CustomUser authUser, Model model) throws Exception {
        if (authUser != null) {
            String username = authUser.getUsername();
            String profileUploadPath = "C:/upload/profiles/";
            // 여기까지 기존
            
            Users oriUser = userService.select(username);
            Files orifile = fileService.imageUpdate(oriUser.getId());

            model.addAttribute("orifile", orifile);


            // 프로필 이미지 파일 이름 생성
            String[] possibleExtensions = { "png", "jpg", "jpeg" };
            String profileImagePath = null;

            for (String ext : possibleExtensions) {
                File profileFile = new File(profileUploadPath + username + "." + ext);
                if (profileFile.exists()) {
                    profileImagePath = "/profiles/" + username + "." + ext;
                    break;
                }
            }

            // 기본 이미지 경로 설정
            if (profileImagePath == null) {
                profileImagePath = "/profiles/default.png";
            }

            model.addAttribute("username", username);
            model.addAttribute("encryptedPassword", authUser.getPassword());
            model.addAttribute("profileImage", profileImagePath);
        } else {
            return "redirect:/login";
        }

        return "user/mypageUpdate";
    }


    /**
     * 이미지 생성
     * @param model
     * @param userAuth
     * @return
     * @throws Exception
     */
    @Secured("ROLE_USER")
    @PostMapping("/mypageImageUpdate")
    public ResponseEntity<?> movieInsert(@ModelAttribute Users users) throws Exception {


        Users oriUser = userService.select(users.getUsername());
        Files orifile = fileService.imageUpdate(oriUser.getId());
        Files file = new Files();
        file.setFile(users.getFile());
        file.setDivision("profile");
        file.setFkTable("user");
        file.setFkId(oriUser.getId());
        boolean result = false;
        
        if(orifile != null){
           result = fileService.update(file,orifile.getId());
        }
        else{
            result = fileService.upload(file);
        }

        if(result){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    // 스프링부트 원본
    // @PostMapping("/mypageUpdate")
    // public String mypageUpdate(@AuthenticationPrincipal CustomUser authUser,
    //         @RequestParam(value = "file", required = false) MultipartFile file,
    //         Users updatedUser,
    //         Model model) throws Exception {
    //     log.info(":::::::::: 마이페이지 정보 수정 처리 ::::::::::");

    //     if (authUser != null) {
    //         String currentUsername = authUser.getUsername();
    //         log.info("현재 로그인 사용자: " + currentUsername);

    //         // 비밀번호 업데이트 로직
    //         String newPassword = updatedUser.getPassword();

    //         if (newPassword != null && !newPassword.trim().isEmpty()) {
    //             String encodedPassword = passwordEncoder.encode(newPassword);
    //             updatedUser.setUsername(currentUsername);
    //             updatedUser.setPassword(encodedPassword);
    //             int updateResult = userService.updatePw(updatedUser);

    //             if (updateResult > 0) {
    //                 log.info("비밀번호 변경 성공!");
    //                 model.addAttribute("successMessage", "비밀번호가 성공적으로 변경되었습니다.");
    //             } else {
    //                 log.error("비밀번호 변경 실패!");
    //                 model.addAttribute("errorMessage", "비밀번호 변경에 실패했습니다.");
    //             }
    //         } else {
    //             log.warn("새로운 비밀번호가 입력되지 않았습니다.");
    //         }

    //         // 이메일 업데이트 로직
    //         String newEmail = updatedUser.getEmail();

    //         if (newEmail != null && !newEmail.trim().isEmpty()) {
    //             // 이메일 형식 유효성 검사 (간단한 예시)
    //             if (newEmail.matches("^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$")) {
    //                 updatedUser.setUsername(currentUsername);
    //                 updatedUser.setEmail(newEmail);
    //                 int emailUpdateResult = userService.updateEmail(updatedUser);

    //                 if (emailUpdateResult > 0) {
    //                     log.info("이메일 변경 성공!");
    //                     model.addAttribute("successMessage", "이메일이 성공적으로 변경되었습니다.");
    //                 } else {
    //                     log.error("이메일 변경 실패!");
    //                     model.addAttribute("errorMessage", "이메일 변경에 실패했습니다.");
    //                 }
    //             } else {
    //                 log.warn("유효하지 않은 이메일 형식: " + newEmail);
    //                 model.addAttribute("errorMessage", "유효한 이메일 주소를 입력해주세요.");
    //             }
    //         } else {
    //             log.warn("새로운 이메일이 입력되지 않았습니다.");
    //         }

    //         // 프로필 이미지 변경 처리
    //         if (file != null && !file.isEmpty()) {
    //             String profileUploadPath = "C:/upload/profiles/";
    //             String originalFilename = file.getOriginalFilename();
    //             String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();

    //             List<String> validExtensions = Arrays.asList("png", "jpg", "jpeg");
    //             if (!validExtensions.contains(fileExtension)) {
    //                 model.addAttribute("errorMessage", "이미지 파일만 업로드 가능합니다. (PNG, JPG, JPEG)");
    //                 return "user/mypageUpdate";
    //             }

    //             String contentType = file.getContentType();
    //             if (!contentType.startsWith("image/")) {
    //                 model.addAttribute("errorMessage", "유효한 이미지 파일만 업로드 가능합니다.");
    //                 return "user/mypageUpdate";
    //             }

    //             String fileNameWithoutExtension = currentUsername;
    //             File existingFilePng = new File(profileUploadPath + fileNameWithoutExtension + ".png");
    //             File existingFileJpg = new File(profileUploadPath + fileNameWithoutExtension + ".jpg");

    //             if (existingFilePng.exists() && !existingFilePng.delete()) {
    //                 log.error("기존 PNG 파일 삭제 실패");
    //             }
    //             if (existingFileJpg.exists() && !existingFileJpg.delete()) {
    //                 log.error("기존 JPG 파일 삭제 실패");
    //             }

    //             String fileName = fileNameWithoutExtension + "." + fileExtension;
    //             File uploadFile = new File(profileUploadPath + fileName);
    //             try {
    //                 file.transferTo(uploadFile);
    //                 log.info("프로필 이미지 저장 성공: " + uploadFile.getAbsolutePath());
    //                 model.addAttribute("profileImage", "/profiles/" + fileName);
    //             } catch (IOException e) {
    //                 log.error("프로필 이미지 저장 실패", e);
    //                 model.addAttribute("errorMessage", "이미지 업로드 중 문제가 발생했습니다.");
    //                 return "user/mypageUpdate";
    //             }
    //         }
    //     } else {
    //         return "redirect:/login";
    //     }

    //     return "redirect:/user/mypageUpdate";
    // }

    // 리액트에서 사용
    @PostMapping("/mypageUpdate")
    public ResponseEntity<?> mypageUpdate(@AuthenticationPrincipal CustomUser authUser,
                                      @RequestParam(value = "file", required = false) MultipartFile file,
                                      Users updatedUser) {
    log.info(":::::::::: 마이페이지 정보 수정 처리 ::::::::::");

    if (authUser != null) {
        String currentUsername = authUser.getUsername();
        log.info("현재 로그인 사용자: " + currentUsername);

        Map<String, String> response = new HashMap<>();

        // 비밀번호 업데이트 로직
        String newPassword = updatedUser.getPassword();

        if (newPassword != null && !newPassword.trim().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(newPassword);
            updatedUser.setUsername(currentUsername);
            updatedUser.setPassword(encodedPassword);
            try {
                int updateResult = userService.updatePw(updatedUser);
                if (updateResult > 0) {
                    log.info("비밀번호 변경 성공!");
                    response.put("successMessage", "비밀번호가 성공적으로 변경되었습니다.");
                } else {
                    log.error("비밀번호 변경 실패!");
                    response.put("errorMessage", "비밀번호 변경에 실패했습니다.");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            } catch (Exception e) {
                log.error("비밀번호 변경 중 오류 발생", e);
                response.put("errorMessage", "비밀번호 변경 중 오류가 발생했습니다.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        } else {
            log.warn("새로운 비밀번호가 입력되지 않았습니다.");
        }

        // 이메일 업데이트 로직
        String newEmail = updatedUser.getEmail();

        if (newEmail != null && !newEmail.trim().isEmpty()) {
            // 이메일 형식 유효성 검사 (간단한 예시)
            if (newEmail.matches("^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$")) {
                updatedUser.setUsername(currentUsername);
                updatedUser.setEmail(newEmail);
                try {
                    int emailUpdateResult = userService.updateEmail(updatedUser);
                    if (emailUpdateResult > 0) {
                        log.info("이메일 변경 성공!");
                        response.put("successMessage", "이메일이 성공적으로 변경되었습니다.");
                    } else {
                        log.error("이메일 변경 실패!");
                        response.put("errorMessage", "이메일 변경에 실패했습니다.");
                        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                    }
                } catch (Exception e) {
                    log.error("이메일 변경 중 오류 발생", e);
                    response.put("errorMessage", "이메일 변경 중 오류가 발생했습니다.");
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
                }
            } else {
                log.warn("유효하지 않은 이메일 형식: " + newEmail);
                response.put("errorMessage", "유효한 이메일 주소를 입력해주세요.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }
        } else {
            log.warn("새로운 이메일이 입력되지 않았습니다.");
        }

        // 프로필 이미지 변경 처리
        if (file != null && !file.isEmpty()) {
            String profileUploadPath = "C:/upload/profiles/";
            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename.substring(originalFilename.lastIndexOf(".") + 1).toLowerCase();

            List<String> validExtensions = Arrays.asList("png", "jpg", "jpeg");
            if (!validExtensions.contains(fileExtension)) {
                response.put("errorMessage", "이미지 파일만 업로드 가능합니다. (PNG, JPG, JPEG)");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            String contentType = file.getContentType();
            if (!contentType.startsWith("image/")) {
                response.put("errorMessage", "유효한 이미지 파일만 업로드 가능합니다.");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
            }

            String fileNameWithoutExtension = currentUsername;
            File existingFilePng = new File(profileUploadPath + fileNameWithoutExtension + ".png");
            File existingFileJpg = new File(profileUploadPath + fileNameWithoutExtension + ".jpg");

            if (existingFilePng.exists() && !existingFilePng.delete()) {
                log.error("기존 PNG 파일 삭제 실패");
            }
            if (existingFileJpg.exists() && !existingFileJpg.delete()) {
                log.error("기존 JPG 파일 삭제 실패");
            }

            String fileName = fileNameWithoutExtension + "." + fileExtension;
            File uploadFile = new File(profileUploadPath + fileName);
            try {
                file.transferTo(uploadFile);
                log.info("프로필 이미지 저장 성공: " + uploadFile.getAbsolutePath());
                response.put("profileImage", "/profiles/" + fileName);
            } catch (IOException e) {
                log.error("프로필 이미지 저장 실패", e);
                response.put("errorMessage", "이미지 업로드 중 문제가 발생했습니다.");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
            }
        }

        return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
        }
    }

    // 플러터에서 사용
    @PostMapping("/mypageUpdateF")
    public ResponseEntity<?> mypageUpdate(
    @AuthenticationPrincipal CustomUser authUser,
    @RequestBody Users updatedUser
) {
    log.info(":::::::::: 마이페이지 정보 수정 처리 ::::::::::");

    if (authUser != null) {
        String currentUsername = authUser.getUsername();
        log.info("현재 로그인 사용자: " + currentUsername);

        updatedUser.setUsername(currentUsername);

        // 비밀번호 업데이트 로직
        if (updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty()) {
            updatedUser.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
            try {
                userService.updatePw(updatedUser);
            } catch (Exception e) {
                log.error("Error updating password", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("errorMessage", "비밀번호 업데이트 중 오류가 발생했습니다."));
            }
        }

        // 이메일 업데이트 로직
        if (updatedUser.getEmail() != null && !updatedUser.getEmail().trim().isEmpty()) {
            try {
                userService.updateEmail(updatedUser);
            } catch (Exception e) {
                log.error("Error updating email", e);
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("errorMessage", "이메일 업데이트 중 오류가 발생했습니다."));
            }
        }

        return ResponseEntity.ok().body(Map.of("successMessage", "사용자 정보가 업데이트되었습니다."));
    }
    return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("errorMessage", "로그인이 필요합니다."));
}


    @GetMapping("/myInquiry/inquiries")
    public ResponseEntity<?> list(   
    @AuthenticationPrincipal UserDetails userDetails
    ,@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "10") Integer size
    ,@RequestParam(name = "option", defaultValue = "0") int option
    ,@RequestParam(name = "keyword", defaultValue = "") String keyword
    ,@RequestParam(name = "username", defaultValue = "") String username) {
        PageInfo<Inquiry> inquiryList = inquiryService.inquiries(page, size, option, keyword,username);
        Map<String, Object> response = new HashMap<>();
        response.put("inquiryList", inquiryList);
        response.put("option", option);
        response.put("keyword", keyword);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping("/myInquiry/select/{id}")
    public ResponseEntity<?> select(@PathVariable("id") String id) {
        Inquiry inquiry = inquiryService.select(id);
        Map<String, Object> response = new HashMap<>();
        response.put("inquiry", inquiry);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @PostMapping("/myInquiry/insert")
    public ResponseEntity<?> insert(@RequestBody Inquiry inquiry) {
        int result = inquiryService.insert(inquiry);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    @PutMapping("/myInquiry/update")
    public ResponseEntity<?> update(@RequestBody Inquiry inquiry) {
        int result = inquiryService.update(inquiry);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    @DeleteMapping("/myInquiry/delete")
    public ResponseEntity<?> delete(@RequestParam("id") String id) {
        int result = inquiryService.delete(id);
        if(result>0){
            return new ResponseEntity<>("SUCCESS", HttpStatus.OK);
        }else{
            return new ResponseEntity<>("FAIL", HttpStatus.BAD_REQUEST);
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> profile(@RequestParam("id") String id) throws Exception {
        Files orifile = fileService.imageUpdate(id);

        Map<String, Object> response = new HashMap<>();
        response.put("orifile", orifile);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}