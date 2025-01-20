import React, { useEffect, useState } from 'react'
import InquirySelectForm from '../../components/Inquiry/InquirySelectForm'
import * as inquiryAPI from '../../apis/inquiry'
import { useLocation, useNavigate, useParams } from 'react-router-dom'

const InquirySelect = () => {
    const { id, password } = useParams();
    const [inquiry, setInquiry] = useState([])
    const navigate = useNavigate();


    // 문의 데이터를 가져오는 함수
    const getInquiry = async (id,password) => {
        try {
            let response
            if(password !== null && password == ''){
                response = await inquiryAPI.selectPassword(id,password);
            }else{
                response = await inquiryAPI.select(id);
            }
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
          response = await inquiryAPI.remove(id)
        } catch (error) {
          console.log(error);
          console.error(`문의삭제 중 에러가 발생하였습니다.`);
          return
        }
        
        const status = response.status
    
        if(status == 200){
          console.log('문의삭제 성공!');
          navigate(`/inquiry/list?`);
        }else{
          console.log('문의삭제 실패!');
        }
      }

      // 답변 수정 함수
    const replyUpdate = async ( form ) => {
        console.dir(form);
        let response
        let data
        try {
          response = await inquiryAPI.replyUpdate(JSON.stringify(form))
        } catch (error) {
          console.log(error);
          console.error(`리뷰수정 중 에러가 발생하였습니다.`);
          return
        }
        
        data = response.data
        const status = response.status
        console.log(`data : ${data}`);
        console.log(`status : ${status}`);
    
        if(status == 200){
          console.log('답변수정 성공!');
          getInquiry(id,password)
        }else{
          console.log('답변수정 실패!');
        }
      }

    useEffect(() => {
      getInquiry(id,password)
    }, [])
    
    
  return (
    <>
        <InquirySelectForm inquiry={inquiry} inquiryDelete={inquiryDelete} replyUpdate={replyUpdate}/>
    </>
  )
}

export default InquirySelect