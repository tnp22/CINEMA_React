package com.aloha.movieproject.domain;

import lombok.Data;

@Data
public class OrderInfo {
    
    private Long id;
    private String buyerName;
    private String buyerPhone;
    private String memberEmail;
    private String buyerAddr;
    private String buyDate;
    private String buyProductName;
    private String buyerBuyid;
    private String buyerMerid;
    private Long buyerPayPrice;
    private String buyerCardNum;
    private String buyerPayOk;
    private Long orderId;

    // 생성자, getter, setter 생략

    public OrderInfo(Long id, String buyerName, String buyerPhone, String memberEmail,
                     String buyerAddr, String buyDate, String buyProductName, String buyerBuyid,
                     String buyerMerid, Long buyerPayPrice, String buyerCardNum, String buyerPayOk,
                     Long orderId) {
        this.id = id;
        this.buyerName = buyerName;
        this.buyerPhone = buyerPhone;
        this.memberEmail = memberEmail;
        this.buyerAddr = buyerAddr;
        this.buyDate = buyDate;
        this.buyProductName = buyProductName;
        this.buyerBuyid = buyerBuyid;
        this.buyerMerid = buyerMerid;
        this.buyerPayPrice = buyerPayPrice;
        this.buyerCardNum = buyerCardNum;
        this.buyerPayOk = buyerPayOk;
        this.orderId = orderId;
    }

    // getter, setter 생략
}

