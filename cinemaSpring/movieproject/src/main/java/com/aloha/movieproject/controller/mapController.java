package com.aloha.movieproject.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.movieproject.domain.FileText;
import com.aloha.movieproject.domain.addMap;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/admin")
@CrossOrigin("*")
public class mapController {

    FileText ft = new FileText();

    // 불러오기
    @GetMapping("/addMap")
    public ResponseEntity<?> readMap(@RequestParam("id") String id) {
        log.info("맵불러오기 진입" + id);
        String path = "C:\\upload\\test"; // 파일 저장 경로
        String fileName = id + ".txt"; // JSON에서 fileName 추출
        // 파일 읽기
        String result = ft.read(path, fileName);
        System.out.println(result);

        // String을 List<List<String>>으로 변환
        List<List<String>> mapData = new ArrayList<>();
        String[] rows = result.split("\n");
        for (String row : rows) {
            List<String> rowList = Arrays.asList(row.split(","));
            mapData.add(rowList);
        }

        // 응답 데이터 구성
        Map<String, Object> response = new HashMap<>();
        response.put("readMapData", mapData);

        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
