import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import * as inquiry from '../../../apis/inquiry'
import MyInquiryListForm from '../../../components/Inquiry/MyInquiry/MyInquiryListForm';
import { LoginContext } from '../../../contexts/LoginContextProvider';

const MyInquiryList = () => {
    const [inquiryList, setInquiryList] = useState([]);
    const [option, setOption] = useState("1");
    const [keyword, setKeyword] = useState("");
    const [page, setPage] = useState(1);
    const { userInfo } = useContext(LoginContext);
    const username = userInfo?.username;
    
    const location = useLocation();
    const navigate = useNavigate();

    // 문의 목록 데이터를 가져오는 함수
    const getInquiryList = async (option, keyword, page, username) => {
        try {
            const response = await inquiry.myList(option, keyword, page, username);
            const data = response.data;
            setInquiryList(data.inquiryList);
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
        getInquiryList(newOption, newKeyword, newPage, username);
    }, [location.search]);

    // 상태가 변경될 때마다 getNoticeList를 호출
    useEffect(() => {
        // option, keyword, page가 모두 업데이트 된 후 호출
        getInquiryList(option, keyword, page, username);
    }, [option, keyword, page]); // option, keyword, page가 변경될 때마다 실행
    
    // 검색 처리 함수
    const handleSearch = (option,keyword) => {
        navigate(`/user/myInquiry/inquiries?option=${option}&keyword=${keyword}&page=1&username=${username}`);
    };
  return (
    <>
        <MyInquiryListForm
            inquiryList={inquiryList}
            option={option}
            keyword={keyword}
            handleSearch={handleSearch}/>
    </>
  )
}

export default MyInquiryList