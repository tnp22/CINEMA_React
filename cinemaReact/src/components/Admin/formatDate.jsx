import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

const formatDate = (dateString) => {
  const date = new Date(dateString);

  // 날짜가 유효한지 체크 (NaN은 유효하지 않은 날짜)
  if (isNaN(date)) {
    return '유효하지 않은 날짜'; // 유효하지 않은 날짜일 경우 기본값을 반환
  }

  // 유효한 날짜일 경우, 원하는 형식으로 포맷
  return format(date, 'yyyy-MM-dd (E) HH:mm', { locale: ko });
};

export default formatDate;
