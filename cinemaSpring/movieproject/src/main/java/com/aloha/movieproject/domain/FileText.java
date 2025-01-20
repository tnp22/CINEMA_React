package com.aloha.movieproject.domain;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;

public class FileText {

    public String read(String path, String fileName) {
        File file = new File(path, fileName);
        StringBuilder retStr = new StringBuilder(); // StringBuilder 사용

        // try-with-resources 구문 사용
        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "UTF-8"))) {
            String line;
            while ((line = br.readLine()) != null) {
                retStr.append(line).append("\n"); // 문자열 추가
            }
        } catch (FileNotFoundException e) {
            System.err.println("파일을 찾을 수 없습니다: " + e.getMessage());
        } catch (IOException e) {
            System.err.println("파일 읽기 중 오류 발생: " + e.getMessage());
        }

        return retStr.toString();
    }

    public void write(String path, String fileName, String content) {
        File file = new File(path, fileName);

        try (BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(new FileOutputStream(file), "UTF-8"))) {
            writer.write(content);
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

}
