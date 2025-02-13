
class UserAuth {
  int? no;
  String? userId;
  String? auth;

  UserAuth({
    this.no, 
    this.userId,
    this.auth
  });

  // Auth ✨ ➡ Map 🎁
  Map<String, dynamic> toMap() {
    return {
      'no': no,
      'userId' : userId,
      'auth' : auth
    };
  }
  // Map 🎁 ➡ Auth ✨
  factory UserAuth.fromMap(Map<String, dynamic> map) {
    return UserAuth(
      no: map['no'],
      userId: map['userId'],
      auth: map['auth']
    );
  }
} 