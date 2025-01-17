import React, { useEffect, useState } from 'react'
import * as inquiryAPI from '../../../apis/inquiry'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import MyInquirySelectForm from '../../../components/Inquiry/MyInquiry/MyInquirySelectForm'

const MyInquirySelect = () => {
    const { id } = useParams();
    const [inquiry, setInquiry] = useState([])
    const navigate = useNavigate();


    // 문의 데이터를 가져오는 함수
    const getInquiry = async (id) => {
        try {
            const response = await inquiryAPI.mySelect(id);
            const data = response.data;
            setInquiry(data.inquiry);
        } catch (error) {
            console.error('목록 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    // 리뷰 삭제 함수
    const inquiryDelete = async ( id ) => {
        let response
        try {
          response = await inquiryAPI.myRemove(id)
        } catch (error) {
          console.log(error);
          console.error(`문의삭제 중 에러가 발생하였습니다.`);
          return
        }
        
        const status = response.status
    
        if(status == 200){
          console.log('문의삭제 성공!');
          navigate(`/user/myInquiry/inquiries`);
        }else{
          console.log('문의삭제 실패!');
        }
      }

    useEffect(() => {
      getInquiry(id)
    }, [])
    
    
  return (
    <>
        <MyInquirySelectForm inquiry={inquiry} inquiryDelete={inquiryDelete}/>
    </>
  )
}

export default MyInquirySelect