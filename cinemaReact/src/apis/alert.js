import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

// 기본 alert
export const alert = (title, text, icon, callback) => {
    MySwal.fire({
        title: title,
        text: text,
        icon: icon
    })
    .then(callback)     // alert 후 실행할 콜백함수
}

// confirm
export const confirm = (title, text, icon, callback) => {
    MySwal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,      // [취소] 버튼 보이기
        cancelButtonColor: '#d33',
        cancelButtonText: '취소',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '확인'
    })
    .then(callback)
}

export const confirm2 = (title, text, icon, callback) => {
    MySwal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,      // [취소] 버튼 보이기
        cancelButtonColor: '#d33',
        cancelButtonText: '취소',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '확인'
    }).then((result) => {
        // 사용자가 확인을 클릭하면 callback 함수 실행
        if (result.isConfirmed) {
          callback(); // 콜백 함수 호출
        }
    });
}