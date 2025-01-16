import React, { useEffect, useState } from 'react'
import NoticeListForm from '../../components/Notice/NoticeListForm'
import * as notice from '../../apis/notice'
import { useLocation, useNavigate } from 'react-router-dom'

const NoticeList = () => {
    const [noticeList, setNoticeList] = useState([]);
    const [option, setOption] = useState("1");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    
    const location = useLocation();
    const navigate = useNavigate();

    // 공지사항 목록 데이터를 가져오는 함수
    const getNoticeList = async (option, keyword, page) => {
        try {
            const response = await notice.list(option, keyword, page);
            const data = response.data;
            setNoticeList(data.noticeList);
            setOption(data.option);
            setKeyword(data.keyword);
        } catch (error) {
            console.error('목록 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    useEffect(() => {
        const query = new URLSearchParams(location.search);
        const newOption = query.get('option') ?? '';
        const newKeyword = query.get('keyword') ?? '';
        const newPage = query.get('page') ?? 1;

        setOption(newOption);
        setKeyword(newKeyword);
        setPage(Number(newPage));

        // 데이터 로딩을 위한 getNoticeList 호출
        getNoticeList(newOption, newKeyword, newPage);
    }, [location.search]);

    // 상태가 변경될 때마다 getNoticeList를 호출
    useEffect(() => {
        // option, keyword, page가 모두 업데이트 된 후 호출
        getNoticeList(option, keyword, page);
    }, [option, keyword, page]); // option, keyword, page가 변경될 때마다 실행
    
    // 검색 처리 함수
    const handleSearch = (option,keyword) => {
        navigate(`/notice/list?option=${option}&keyword=${keyword}&page=1`);
    };

    return (
        <>
            <NoticeListForm
                noticeList={noticeList}
                option={option}
                keyword={keyword}
                handleSearch={handleSearch}
            />
        </>
    );
};

export default NoticeList;
