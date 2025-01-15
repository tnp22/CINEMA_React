package com.aloha.movieproject.controller;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.MimeTypeUtils;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.aloha.movieproject.domain.Files;
import com.aloha.movieproject.service.FileService;
import com.aloha.movieproject.util.MediaUtil;

import jakarta.servlet.ServletOutputStream;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;


@Slf4j
@RestController
@RequestMapping("/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired ResourceLoader resourceLoader;

    /**
     * 썸네일 이미지
     * @param id
     * @throws IOException 
     */
    @GetMapping("/img/{id}")
    public void thumbnailImg(
        @PathVariable("id") String id,
        HttpServletResponse response
    ) throws Exception {
        Files file = fileService.select(id);
        String filePath = file != null ? file.getUrl() : null;

        File imgFile;
        // 파일 경로가 null 또는 파일이 존재하지 않는 경우
        Resource resource = resourceLoader.getResource("classpath:static/img/no-image.png");
        if( filePath == null || !(imgFile = new File(filePath)).exists() ) {
            // no-image.png 적용
            imgFile = resource.getFile();
            filePath = imgFile.getPath();
        }

        // 확장자
        String ext = filePath.substring(filePath.lastIndexOf(".") + 1);
        String mimeType = MimeTypeUtils.parseMimeType("image/" + ext).toString();
        MediaType mType = MediaType.valueOf(mimeType);

        if( mType == null ) {
            // 이미지 타입이 아닌 경우
            response.setContentType(MediaType.IMAGE_PNG_VALUE);
            imgFile = resource.getFile();
        } else {
            // 이미지 타입인 경우
            response.setContentType(mType.toString());
        }
        FileInputStream fis = new FileInputStream(imgFile);
        ServletOutputStream sos = response.getOutputStream();
        FileCopyUtils.copy(fis, sos);
    }
    
    /**
     * 이미지 썸네일
     * @param id (파일ID)
     * @return
     * @throws Exception
     */
    @GetMapping("/img")
    public ResponseEntity<byte[]> thumbnail(@RequestParam("id") String id) throws Exception {
        Files file = fileService.select(id);
        
        String filePath = file.getUrl();
        // 파일 객체 생성
        File f = new File(filePath);

        // 파일 데이터
        byte[] fileData = FileCopyUtils.copyToByteArray(f);

        // 컨텐츠 타입 지정 
        // 확장자로 컨텐츠 타입 지정
        // - 확장자 : .jpg, .png ...
        String ext = filePath.substring( filePath.lastIndexOf(".") + 1); // 확장자
        MediaType mediaType = MediaUtil.getMediaType(ext);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        
        return new ResponseEntity<>( fileData, headers, HttpStatus.OK);
    }

    @GetMapping("/image")
    public ResponseEntity<byte[]> image(@RequestParam("id") String id) throws Exception {
        String filePath = id;
        // 파일 객체 생성
        File f = new File(filePath);

        // 파일 데이터
        byte[] fileData = FileCopyUtils.copyToByteArray(f);

        // 컨텐츠 타입 지정 
        // 확장자로 컨텐츠 타입 지정
        // - 확장자 : .jpg, .png ...
        String ext = filePath.substring( filePath.lastIndexOf(".") + 1); // 확장자
        MediaType mediaType = MediaUtil.getMediaType(ext);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(mediaType);
        
        return new ResponseEntity<>( fileData, headers, HttpStatus.OK);
    }
    

    /**
     * 다운로드
     * @param id
     * @return
     * @throws Exception 
    */
    @GetMapping("/file/{id}")
    public ResponseEntity<byte[]> download(@PathVariable("id") String id) throws Exception {
        Files file = fileService.select(id);
        String filePath = file.getUrl();
        String fileName = filePath.substring(filePath.lastIndexOf("/")+1); // 확장자
        fileName = URLEncoder.encode(filePath, "UTF-8");
        // 파일 객체 생성
        File f = new File(filePath);
        // 파일 데이터
        byte[] fileData = FileCopyUtils.copyToByteArray(f);
        // 파일 응답을 위한 헤더 설정
        // - ContentType            : application/octect-stream
        // - Content-Disposition    : attachment; filename="파일명.확장자"
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
        headers.setContentDispositionFormData("attachment", fileName);

        return new ResponseEntity<>(fileData, headers, HttpStatus.OK);
    }
    
    /**
     * 파일 삭제
     * @param id
     * @return
     * @throws Exception 
    */
    @ResponseBody
    @DeleteMapping("/file/{id}")
    public String deleteFile(@PathVariable("id") String id) throws Exception {
        int result = fileService.delete(id);
     
        // 파일 삭제 성공
        if( result > 0 ) {
            return "SUCCESS";
        }
        // 파일 삭제 실패
        return "FAIL";
    }

    /**
     * 파일 목록
     * @param param - parentTable, parentNo
     * @return 뷰(html)
     * @throws Exception 
    */
    @GetMapping("/file")
    public String fileList(Model model, Files file) throws Exception {
        List<Files> fileList = fileService.listByParent(file);
        model.addAttribute("fileList", fileList);
        return "/file/list";
    }
    
}

