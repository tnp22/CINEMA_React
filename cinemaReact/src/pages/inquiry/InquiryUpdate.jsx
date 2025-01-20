import React, { useEffect, useState } from 'react'
import InquiryUpdateForm from '../../components/Inquiry/InquiryUpdateForm'
import * as inquiryAPI from '../../apis/inquiry'
import { useNavigate, useParams } from 'react-router-dom';

const InquiryUpdate = () => {
    const {id} = useParams();
    const [inquiry, setInquiry] = useState([])
    const navigate = useNavigate();

    // 문의 데이터를 가져오는 함수
    const getInquiry = async (id) => {
        try {
            console.log(`아이디는 : ${id}`);
            
            const response = await inquiryAPI.select(id);
            const data = response.data;
            setInquiry(data.inquiry);
        } catch (error) {
            console.error('목록 데이터를 가져오는 중 오류 발생:', error);
        }
    };

    // 문의 수정 함수
    const inquiryUpdate = async ( form ) => {
        console.dir(form);
        let response
        let data
        try {
          response = await inquiryAPI.update(JSON.stringify(form))
        } catch (error) {
          console.log(error);
          console.error(`문의추가 중 에러가 발생하였습니다.`);
          return
        }
        
        data = response.data
        const status = response.status
        console.log(`data : ${data}`);
        console.log(`status : ${status}`);
    
        if(status == 200){
          console.log('문의추가 성공!');
          navigate(`/inquiry/select/${id}`);
        }else{
          console.log('문의추가 실패!');
        }
    }

    useEffect(() => {
          getInquiry(id)
    }, [])
  return (
    <>
        <InquiryUpdateForm inquiry={inquiry} inquiryUpdate={inquiryUpdate} />
    </>
  )
}

export default InquiryUpdate