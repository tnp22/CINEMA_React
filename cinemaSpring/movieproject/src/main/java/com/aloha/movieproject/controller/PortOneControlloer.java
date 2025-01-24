package com.aloha.movieproject.controller;

import java.net.http.HttpClient;
import java.net.http.HttpResponse;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.TimeZone;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.RestTemplate;

import com.aloha.movieproject.domain.OrderInfo;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;

@Controller
@Slf4j
@RequestMapping("/portone")
@CrossOrigin("*")
public class PortOneControlloer {

    public static final String IMPORT_TOKEN_URL = "https://api.iamport.kr/users/getToken";
    public static final String IMPORT_PAYMENTINFO_URL = "https://api.iamport.kr/payments/find/";
    public static final String IMPORT_CANCEL_URL = "https://api.iamport.kr/payments/cancel";
    public static final String IMPORT_PREPARE_URL = "https://api.iamport.kr/payments/prepare";

    public static final String KEY = "6430070210645731";
    public static final String SECRET = "qYI8zQpOmZH5Den0eYQjy9gy5DH1zipVu6w5Snxvtfd06QuTJEdslSLlV2NQ8YUbFKrz9wkIe9Q9z1jB";

    private RestTemplate restTemplate = new RestTemplate();

    public String getImportToken() {
        String result = "";

        // 요청 파라미터 준비
        String body = "imp_key=" + KEY + "&imp_secret=" + SECRET;

        // HTTP 요청 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Content-Type", "application/x-www-form-urlencoded");

        HttpEntity<String> entity = new HttpEntity<>(body, headers);

        try {
            // POST 요청 보내기
            ResponseEntity<String> response = restTemplate.exchange(
                    IMPORT_TOKEN_URL,
                    HttpMethod.POST,
                    entity,
                    String.class);

            // JSON 응답 처리
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.getBody());
            JsonNode resNode = rootNode.get("response");

            // 토큰 추출
            result = resNode.get("access_token").asText();
        } catch (Exception e) {
            log.error("Error occurred while fetching the token", e);
        }

        log.info("#################################################### TOKEN : " + result);
        return result;
    }

    // 결제정보

    public OrderInfo getPayInfo(String token, String mId) {
        String buyer_name = "";
        String buyer_phone = "";
        String member_email = "";
        String buyer_addr = "";
        String paid_at = "";
        String buy_product_name = "";
        String buyer_buyid = "";
        String buyer_merid = "";
        String amount = "";
        String buyer_card_num = "";
        String buyer_pay_ok = "";
        long buyer_pay_price = 0L;
        long paid_atLong = 0L;
        long unixTime = 0L;
        Date date = null;

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + token); // Bearer + 토큰
            // HTTP GET 요청을 보내고, 응답을 받아옴
            String url = IMPORT_PAYMENTINFO_URL + mId + "/paid";

            // 요청을 HttpEntity로 감싸서 전송
            HttpEntity<String> entity = new HttpEntity<>(headers);

            // GET 요청 실행
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            // ResponseEntity<String> response = restTemplate.getForEntity(url,
            // String.class);

            // 응답 본문 처리
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.getBody());
            JsonNode resNode = rootNode.get("response");

            // JSON 응답에서 데이터 추출
            buyer_name = resNode.get("buyer_name").asText();
            buyer_phone = resNode.get("buyer_tel").asText();
            member_email = resNode.get("buyer_email").asText();
            String buyer_addrStr = resNode.get("buyer_addr").asText();
            String buyer_postcode = resNode.get("buyer_postcode").asText();
            buyer_addr = buyer_addrStr + " " + buyer_postcode;

            paid_at = resNode.get("paid_at").asText();
            buy_product_name = resNode.get("name").asText();
            buyer_buyid = resNode.get("imp_uid").asText();
            buyer_merid = resNode.get("merchant_uid").asText();
            amount = resNode.get("amount").asText();
            buyer_card_num = resNode.get("apply_num").asText();
            buyer_pay_ok = resNode.get("status").asText();

            // 결제 금액 처리
            buyer_pay_price = Long.parseLong(amount);

            // 카드 결제 시간 처리
            paid_atLong = Long.parseLong(paid_at);
            unixTime = paid_atLong * 1000;
            date = new Date(unixTime);

            // 날짜 형식 변환
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
            sdf.setTimeZone(TimeZone.getTimeZone("GMT+9"));
            String buy_date = sdf.format(date);

            // 로그 출력
            System.out.println("import date: " + buy_date);

            // OrderInfo 객체 생성 후 반환
            return new OrderInfo(1L, buyer_name, buyer_phone, member_email, buyer_addr, buy_date,
                    buy_product_name, buyer_buyid, buyer_merid, buyer_pay_price, buyer_card_num, buyer_pay_ok, 1L);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    public int cancelPay(String token, String mid) {
        // 요청에 필요한 파라미터 설정
        Map<String, String> params = new HashMap<>();
        params.put("merchant_uid", mid);

        // HTTP 헤더 설정
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "Bearer " + token); // Bearer 토큰을 헤더에 추가

        // 요청 본문을 HttpEntity로 감싸기
        HttpEntity<Map<String, String>> entity = new HttpEntity<>(params, headers);

        // RestTemplate을 사용하여 POST 요청 보내기
        try {
            ResponseEntity<String> response = restTemplate.exchange(IMPORT_CANCEL_URL, HttpMethod.POST, entity,
                    String.class);

            // 응답 본문 파싱
            ObjectMapper mapper = new ObjectMapper();
            JsonNode rootNode = mapper.readTree(response.getBody());
            JsonNode responseNode = rootNode.get("response");

            if (responseNode == null || responseNode.asText().equals("null")) {
                System.err.println("환불 실패");
                return -1; // 환불 실패
            } else {
                System.err.println("환불 성공");
                return 1; // 환불 성공
            }
        } catch (Exception e) {
            e.printStackTrace();
            return -1; // 오류 발생 시 환불 실패 처리
        }
    }

    @GetMapping("/cancal")
    public ResponseEntity<?> hanbul(@RequestParam(name = "mId") String mId) throws Exception {
        log.info("엠아이디" + mId);
        String token = getImportToken();

        Map<String, Object> response = new HashMap<String, Object>();
        response.put("token", token);
        // String mId = "IMP55b43590-ae8e-4f1f-8b25-cee57ce9583b";
        OrderInfo orIn = getPayInfo(token, mId);
        response.put("orIn", orIn);

        // 토큰 받아오기 & 환불요청
        int result_delete = cancelPay(token, mId);
        if (result_delete == -1) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        } else {
            // 주문내역 삭제
            return new ResponseEntity<>(response, HttpStatus.OK);
        }
    }
}
