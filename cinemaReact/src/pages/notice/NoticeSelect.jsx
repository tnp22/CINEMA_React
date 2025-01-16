import React, { useEffect, useState } from 'react';
import * as noticeApi from '../../apis/notice';
import { useLocation } from 'react-router-dom';
import NoticeSelectForm from '../../components/Notice/NoticeSelectForm';

const NoticeSelect = () => {
  const [notice, setNotice] = useState(null);
  const [before, setBefore] = useState(null);
  const [after, setAfter] = useState(null);
  const location = useLocation();

  // 공지사항, 이전 글, 이후 글을 가져오는 함수
  const getNoticeData = async (id) => {
    try {
      const response = await noticeApi.select(id);
      const data = response.data;
      setNotice(data.notice);
      setBefore(data.before);
      setAfter(data.after);
    } catch (error) {
      console.error('공지사항을 가져오는 중 오류 발생:', error);
    }
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const newId = query.get('id') ?? ''; // 쿼리 파라미터에서 id 값을 가져옵니다.

    if (newId) {
      getNoticeData(newId); // id가 있을 때만 API 호출
    }
  }, [location.search]); // location.search가 변경될 때마다 호출

  return (
    <>
      <NoticeSelectForm notice={notice} before={before} after={after} />
    </>
  );
};

export default NoticeSelect;
