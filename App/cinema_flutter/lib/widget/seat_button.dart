import 'package:flutter/material.dart';

class SeatButton extends StatelessWidget {
  final String seatId;
  final String seatNumber;
  final Function(String) onButtonTap;

  const SeatButton({
    super.key,
    required this.seatId,
    required this.seatNumber,
    required this.onButtonTap,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: 40, // 버튼의 가로 크기
      height: 40, // 버튼의 세로 크기
      child: ElevatedButton(
        onPressed: () => onButtonTap(seatId),
        style: ElevatedButton.styleFrom(
          padding: EdgeInsets.zero, // 패딩 제거
          backgroundColor: Colors.grey[400], // 버튼 색상
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(8), // 버튼 모서리 둥글게
          ),
          elevation: 4, // 그림자 효과
        ),
        child: Center(
          child: FittedBox(
            fit: BoxFit.scaleDown,
            child: Text(
              seatNumber,
              softWrap: false,
              overflow: TextOverflow.ellipsis,
              textAlign: TextAlign.center, // 텍스트 중앙 정렬
              style: TextStyle(
                fontSize: 20, // 텍스트 크기 조정
                fontWeight: FontWeight.bold,
                color: Colors.black87,
              ),
            ),
          ),
        ),
      ),
    );
  }
}
