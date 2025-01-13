package com.aloha.movie_project.controller;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.aloha.movie_project.domain.CustomUser;

import com.aloha.movie_project.domain.Reserve;
import com.aloha.movie_project.service.ReserveService;
import com.aloha.movie_project.service.ReviewService;

import com.aloha.movie_project.domain.Inquiry;
import com.aloha.movie_project.domain.Users;
import com.aloha.movie_project.service.InquiryService;
import com.aloha.movie_project.domain.Files;
import com.aloha.movie_project.domain.Users;
import com.aloha.movie_project.service.FileService;

import com.aloha.movie_project.service.UserService;
import com.github.pagehelper.PageInfo;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Controller
@RequestMapping("/user")
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

    @GetMapping("/mypage")
    public String mypage(@AuthenticationPrincipal CustomUser authUser, Model model) throws Exception {
        if (authUser != null) {
            String username = authUser.getUsername();
            String userId = authUser.getId(); // 사용자 고유 ID (UUID)
            Files orifile = fileService.imageUpdate(userId);

            model.addAttribute("orifile", orifile);
            // 예매 횟수 조회
            int movieCount = reserveService.selectReservationCountByUsername(username);

            // 리뷰 수 조회
            int reviewCount = reviewService.countUserReviews(userId);


            // 모델에 데이터 추가
            model.addAttribute("username", username);
            model.addAttribute("movieCount", movieCount);
            model.addAttribute("grade", "일반"); // 임의 데이터
            model.addAttribute("reviewCount", reviewCount); // 리뷰 수 추가

        } else {
            return "redirect:/login";
        }

        return "user/mypage";

    }

    @PostMapping("/mypage")
    public String myPage(@RequestParam("password") String password, HttpServletRequest request) {
        // 현재 로그인된 사용자의 정보를 가져오기
        String username = request.getUserPrincipal().getName();

        try {
            // DB에서 사용자 정보 가져오기
            Users user = userService.select(username);
            log.info("DB에서 가져온 사용자 비밀번호: " + user.getPassword());

            // user가 null이 아닌지 체크
            if (user != null) {
                // DB에서 가져온 암호화된 비밀번호와 입력된 비밀번호 비교
                if (passwordEncoder.matches(password, user.getPassword())) {
                    // 비밀번호가 맞으면 회원 수정 페이지로 이동
                    return "redirect:/user/mypageUpdate";
                } else {
                    // 비밀번호가 틀리면 다시 마이 페이지로
                    return "redirect:/user/mypage?error=invalidPassword";
                }
            } else {
                // 사용자 정보가 없으면 에러 처리
                return "redirect:/user/mypage?error=userNotFound";
            }
        } catch (Exception e) {
            // 예외 발생 시 에러 처리
            e.printStackTrace();
            return "redirect:/user/mypage?error=serverError";
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
    public String movieInsert(Model model,
                              Users users) throws Exception {


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

            return "redirect:/user/mypageUpdate";
        }
        return "redirect:/user/mypageUpdate?error";
    }


    @PostMapping("/mypageUpdate")
    public String mypageUpdate(@AuthenticationPrincipal CustomUser authUser,
            @RequestParam(value = "file", required = false) MultipartFile file,
            Users updatedUser,
            Model model) throws Exception {
        log.info(":::::::::: 마이페이지 정보 수정 처리 ::::::::::");

        if (authUser != null) {
            String currentUsername = authUser.getUsername();
            log.info("현재 로그인 사용자: " + currentUsername);

            // 비밀번호 업데이트 로직
            String newPassword = updatedUser.getPassword();

            if (newPassword != null && !newPassword.trim().isEmpty()) {
                String encodedPassword = passwordEncoder.encode(newPassword);
                updatedUser.setUsername(currentUsername);
                updatedUser.setPassword(encodedPassword);
                int updateResult = userService.updatePw(updatedUser);

                if (updateResult > 0) {
                    log.info("비밀번호 변경 성공!");
                    model.addAttribute("successMessage", "비밀번호가 성공적으로 변경되었습니다.");
                } else {
                    log.error("비밀번호 변경 실패!");
                    model.addAttribute("errorMessage", "비밀번호 변경에 실패했습니다.");
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
                    int emailUpdateResult = userService.updateEmail(updatedUser);

                    if (emailUpdateResult > 0) {
                        log.info("이메일 변경 성공!");
                        model.addAttribute("successMessage", "이메일이 성공적으로 변경되었습니다.");
                    } else {
                        log.error("이메일 변경 실패!");
                        model.addAttribute("errorMessage", "이메일 변경에 실패했습니다.");
                    }
                } else {
                    log.warn("유효하지 않은 이메일 형식: " + newEmail);
                    model.addAttribute("errorMessage", "유효한 이메일 주소를 입력해주세요.");
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
                    model.addAttribute("errorMessage", "이미지 파일만 업로드 가능합니다. (PNG, JPG, JPEG)");
                    return "user/mypageUpdate";
                }

                String contentType = file.getContentType();
                if (!contentType.startsWith("image/")) {
                    model.addAttribute("errorMessage", "유효한 이미지 파일만 업로드 가능합니다.");
                    return "user/mypageUpdate";
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
                    model.addAttribute("profileImage", "/profiles/" + fileName);
                } catch (IOException e) {
                    log.error("프로필 이미지 저장 실패", e);
                    model.addAttribute("errorMessage", "이미지 업로드 중 문제가 발생했습니다.");
                    return "user/mypageUpdate";
                }
            }
        } else {
            return "redirect:/login";
        }

        return "redirect:/user/mypageUpdate";
    }

    @GetMapping("/myInquiry/inquiries")
    public String list(Model model    
    ,@AuthenticationPrincipal UserDetails userDetails
    ,@RequestParam(name = "page", required = false, defaultValue = "1") Integer page
    ,@RequestParam(name = "size", required = false, defaultValue = "10") Integer size
    ,@RequestParam(name = "option", defaultValue = "0") int option
    ,@RequestParam(name = "keyword", defaultValue = "") String keyword) {
        String username = userDetails.getUsername();
        PageInfo<Inquiry> inquiryList = inquiryService.inquiries(page, size, option, keyword,username);
        model.addAttribute("inquiryList", inquiryList);
        model.addAttribute("option", option);
        
        return "/user/myInquiry/inquiries";
    }

    @GetMapping("/myInquiry/select/{id}")
    public String select(Model model, @PathVariable("id") String id) {
        Inquiry inquiry = inquiryService.select(id);
        model.addAttribute("inquiry", inquiry);
        return "/user/myInquiry/select";
    }


    @GetMapping("/myInquiry/insert")
    public String insert() {
        return "/user/myInquiry/insert";
    }
    
    @PostMapping("/myInquiry/insert")
    public String insert(Inquiry inquiry) {
        int result = inquiryService.insert(inquiry);
        if(result > 0)
            return "redirect:/user/myInquiry/inquiries";
        else
            return "redirect:/user/myInquiry/insert?error";
    }

    @GetMapping("/myInquiry/update")
    public String update(Model model, @RequestParam("id") String id) {
        Inquiry inquiry = inquiryService.select(id);
        model.addAttribute("inquiry", inquiry);
        return "/user/myInquiry/update";
    }

    @PostMapping("/myInquiry/update")
    public String update(Inquiry inquiry) {
        int result = inquiryService.update(inquiry);
        if(result > 0)
            return "redirect:/user/myInquiry/select/"+inquiry.getId();
        else
            return "redirect:/user/myInquiry/update?error";
    }

    @GetMapping("/myInquiry/delete")
    public String delete(@RequestParam("id") String id) {
        int result = inquiryService.delete(id);
        if(result > 0)
            return "redirect:/user/myInquiry/inquiries";
        else
            return "redirect:/user/myInquiry/update?id="+id;
    }
}