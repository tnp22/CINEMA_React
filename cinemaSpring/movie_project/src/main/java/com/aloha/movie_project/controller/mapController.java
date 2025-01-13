package com.aloha.movie_project.controller;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.aloha.movie_project.domain.FileText;
import com.aloha.movie_project.domain.addMap;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/admin")
public class mapController {

    FileText ft = new FileText();

    /**
     * addMap 맵 이동
     * 
     * @return
     */
    @GetMapping("/addMap")
    public String addMap() {
        return "/admin/addMap";
    }

    // 불러오기
    @PutMapping("/addMap")
    public ResponseEntity<Map<String, Object>> readMap(@RequestBody Map<String, String> requestData) {
        String path = "C:\\upload\\test"; // 파일 저장 경로
        String fileName = requestData.get("fileName")+".txt"; // JSON에서 fileName 추출
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

        return ResponseEntity.ok(response); // JSON 데이터 반환
    }

}
