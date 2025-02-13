import 'package:flutter/material.dart';

class TicketButtom extends StatelessWidget {
  final String text;
  // final VoidCallback onPressed;
  final String id;
  final int index;
  final Function(String,String,int) onButtonTap; // id를 넘겨 받는 함수

  const TicketButtom({
    super.key,
    required this.text,
    // required this.onPressed,
    required this.id,
    required this.index,
    required this.onButtonTap,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      child: ElevatedButton(
        onPressed : () => onButtonTap(text,id,index),
        child: Text(text),
      ),
    );
  }
}