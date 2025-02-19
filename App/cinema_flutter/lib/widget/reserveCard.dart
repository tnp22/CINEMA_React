import 'package:flutter/material.dart';

class ReserveCard extends StatelessWidget {
  final String imageUrl;
  final String title;
  final String date;  // 예약 일시
  final String seat;  // 좌석 정보
  final String id;    // 예매 아이디 (출력하지 않음)
  final VoidCallback onTap; // 클릭 시 실행할 함수

  const ReserveCard({
    super.key,
    required this.imageUrl,
    required this.title,
    required this.date,
    required this.seat,
    required this.id,    // 예매 아이디는 사용하지만 출력하지 않음
    required this.onTap, // 클릭 시 함수
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onTap, // 카드 클릭 시 onTap 실행
      child: Container(
        width: MediaQuery.of(context).size.width * 0.9, // 가로 90%
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(12), // 둥근 모서리
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.1),
              blurRadius: 5,
              spreadRadius: 2,
              offset: const Offset(0, 3),
            ),
          ],
        ),
        child: Row(
          children: [
            // 왼쪽: 이미지 (20%)
            Container(
              width: MediaQuery.of(context).size.width * 0.18, // 여백 고려해서 18%
              height: 80, // 세로 크기 임시 지정
              decoration: BoxDecoration(
                borderRadius: BorderRadius.circular(8), // 이미지도 둥글게
                image: DecorationImage(
                  image: NetworkImage(imageUrl),
                  fit: BoxFit.cover,
                ),
              ),
            ),
            const SizedBox(width: 12), // 이미지와 텍스트 사이 여백
          
            // 오른쪽: 텍스트 (80%)
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    date,
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    seat,
                    style: const TextStyle(fontSize: 14, color: Colors.grey),
                  ),
                  // 예매 아이디는 출력하지 않음
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
