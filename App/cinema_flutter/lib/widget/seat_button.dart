import 'package:flutter/material.dart';

class SeatButton extends StatelessWidget {
  final String seatId;
  final String seatNumber;
  final Function(String) onButtonTap;
  final bool isSelected;

  const SeatButton({
    super.key,
    required this.seatId,
    required this.seatNumber,
    required this.onButtonTap,
    this.isSelected = false,
  });

  @override
  Widget build(BuildContext context) {
    bool isAisle = seatId == ""; // "통로"를 식별하는 조건
    bool isReserved = seatId == "X"; // 예약된 좌석 여부

    return SizedBox(
      width: 40, // 버튼의 가로 크기
      height: 40, // 버튼의 세로 크기
      child: isAisle
          ? Container(
              color: Colors.transparent, // "통로"일 때 빈 공간
            )
          : ElevatedButton(
              onPressed: isReserved ? () {} : () => onButtonTap(seatId), // 예약 좌석은 빈 함수로 대체
              style: ElevatedButton.styleFrom(
                padding: EdgeInsets.zero,
                backgroundColor: isReserved
                    ? Colors.red // 예약된 좌석은 빨간색
                    : (isSelected
                        ? Colors.blue // 선택된 좌석은 파란색
                        : Colors.grey[400]), // 기본 색상
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(4.0),
                ),
                elevation: 4,
              ),
              child: Center(
                child: FittedBox(
                  fit: BoxFit.scaleDown,
                  child: Text(
                    seatNumber,
                    softWrap: false,
                    overflow: TextOverflow.ellipsis,
                    textAlign: TextAlign.center,
                    style: TextStyle(
                      fontSize: 20,
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
