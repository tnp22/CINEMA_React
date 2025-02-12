import 'package:flutter/material.dart';

class Pagination extends StatelessWidget {
  final int currentPage;
  final int totalPages;
  final Function(int) onPageChanged;

  const Pagination({
    Key? key,
    required this.currentPage,
    required this.totalPages,
    required this.onPageChanged,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        // 첫 번째 페이지 버튼 (비활성화 처리)
        currentPage > 1
            ? IconButton(
                icon: Icon(Icons.first_page),
                onPressed: () => onPageChanged(1),
              )
            : IconButton(
                icon: Icon(Icons.first_page, color: Colors.grey),
                onPressed: null,
              ),

        // 이전 페이지 버튼 (비활성화 처리)
        currentPage > 1
            ? IconButton(
                icon: Icon(Icons.arrow_back),
                onPressed: () => onPageChanged(currentPage - 1),
              )
            : IconButton(
                icon: Icon(Icons.arrow_back, color: Colors.grey),
                onPressed: null,
              ),

        // 페이지 번호 표시
        Text('$currentPage / $totalPages'),

        // 다음 페이지 버튼 (비활성화 처리)
        currentPage < totalPages
            ? IconButton(
                icon: Icon(Icons.arrow_forward),
                onPressed: () => onPageChanged(currentPage + 1),
              )
            : IconButton(
                icon: Icon(Icons.arrow_forward, color: Colors.grey),
                onPressed: null,
              ),

        // 마지막 페이지 버튼 (비활성화 처리)
        currentPage < totalPages
            ? IconButton(
                icon: Icon(Icons.last_page),
                onPressed: () => onPageChanged(totalPages),
              )
            : IconButton(
                icon: Icon(Icons.last_page, color: Colors.grey),
                onPressed: null,
              ),
      ],
    );
  }
}
