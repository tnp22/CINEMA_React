import React from 'react'
import InquiryInsertForm from '../../components/Inquiry/InquiryInsertForm'
import * as inquiryAPI from '../../apis/inquiry'
import { useNavigate } from 'react-router-dom';
const InquiryInsert = () => {

    const navigate = useNavigate();

    // 문의 추가 함수
    const inquiryInsert = async ( form ) => {
        console.dir(form);
        let response
        let data
        try {
          response = await inquiryAPI.insert(JSON.stringify(form))
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
          navigate(`/inquiry/list?`);
        }else{
          console.log('문의추가 실패!');
        }
    }

  return (
    <>
        <InquiryInsertForm inquiryInsert={inquiryInsert}/>
    </>
  )
}

export default InquiryInsert