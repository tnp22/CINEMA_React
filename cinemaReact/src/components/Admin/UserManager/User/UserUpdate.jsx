import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link, useNavigate, useParams } from 'react-router-dom';
import formatDate from '../../../Admin/formatDate'
import LeftSideBar1 from '../../LeftSideBar1'
import AdminHeader from '../../AdminHeader';
import * as admins from '../../../../apis/admins'
import * as Swal from '../../../../apis/alert'

const UserUpdate = () => {

  const { id } = useParams() // URL에서 id 파라미터 추출
  const [user, setUser] = useState({})
  const [authList, setAuthList] = useState([])

  const [selectedAuth, setSelectedAuth] = useState(''); // 기본값은 빈 문자열
  // select의 변경 처리 함수
  const handleAuthChange = (event) => {
    setSelectedAuth(event.target.value); // 선택된 값으로 상태 업데이트
  };


    // 🧊 state 선언
  const [username, setUsername] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [enabled, setEnabled] = useState()

  const changeName = (e) => { setName( e.target.value ) }
  const changeEmail = (e) => { setEmail( e.target.value ) }
  const changeEnabled = (e) => { setEnabled( e.target.value )};

  const navigate = useNavigate()

  // 게시글 수정 요청 이벤트 핸들러
  const onUpdate = async (formData, headers) => {
    try {
      // const response = await boards.update(id, title, writer, content)
      const response = await admins.userUpdate(formData, headers)
      const data = await response.data
      const status = response.status
      console.log(data);
      if(status == 200){
        console.log('성공!');
        Swal.alert('SUCCESS', '이동합니다', 'success',
                    () => {navigate(`/admin/user/select/${id}`)}
        )
      }else{
        console.log('실패!');
        //alert('회원가입 실패!')
        Swal.alert('FAIL', '실패했습니다.', 'error')
      }     
    } catch (error) {
      console.log(error);
      
    }
  }  

  const authDelete = async (no) =>{
    console.log(no +","+no)
    const response = await admins.userAuthDelete(id,no)
    const data = await response.data
    console.log(data)
    getList()
  }

  const authPlus = async () => {


    // 파일 업로드
    // application/json ➡ multipart/form-data
    const formData = new FormData()
    // 게시글 정보 세팅
    formData.append('userId', id)
    //<input type="hidden" name="FileId" th:value="${files.id}" />
    formData.append('auth',selectedAuth)

    // 🎫 헤더
    const headers = {
      'Content-Type' : 'multipart/form-data'
    }

    try {
      // const response = await boards.update(id, title, writer, content)
      const response = await admins.userAuthPlus(formData, headers)
      const data = await response.data
      const status = response.status
      console.log(data);
      if(status == 200){
        console.log('성공!');
        getList()
      }else{
        console.log('실패!');
        //alert('회원가입 실패!')
        Swal.alert('FAIL', '실패했습니다.', 'error')
      }     
    } catch (error) {
      console.log(error);
      
    }
  }  

  const onSubmit = () => {

    // 파일 업로드
    // application/json ➡ multipart/form-data
    const formData = new FormData()
    // 게시글 정보 세팅
    formData.append('id',id)
    formData.append('username', username)
    formData.append('name', name)
    formData.append('email', email)
    formData.append('enabled', enabled)
    // 🎫 헤더
    const headers = {
      'Content-Type' : 'multipart/form-data'
    }
    // onUpdate(title, writer, content)   // application/json 
    onUpdate(formData, headers)           // multipart/form-data

  }

    // 🎁 게시글 목록 데이터
    const getList = async () => {
      const response = await admins.userUpdateGet(id)
      const data = await response.data
      const user = data.user
      const nauthList = data.authList
      console.dir(data)
      console.dir(data.user)
  
      setUser( user )
      setAuthList(nauthList)
    }
  
    useEffect( () => {
      getList()
    }, [])

    useEffect( () => {
      if(user){
        setUsername(user.username)
        setName(user.name)
        setEmail(user.email)
        setEnabled(user.enabled)
      }
    }, [user])

  useEffect(() => {
    document.title = "ADMINISTRATOR";
    
    $(".mainLi").on("mouseover",function(){
      //$(this).find(".subLi").stop().slideDown();
      $(this).find(".movieLi").stop().slideDown();
    })
    $(".mainLi").on("mouseout",function(){
        $(this).find(".movieLi").stop().slideUp();
        //$(this).find(".subLi").stop().slideUp();
    })

    return () => {
      // 컴포넌트가 언마운트될 때 이벤트 핸들러 제거
      $(".mainLi").off("mouseover mouseout");
    };
  }, []);

  return (
        <div className={`container-fluid ${ResetCs.adminLEE}`} style={{ height: '98vh' }}>
          <style>
            {`
              .movieLi {
                display: none;
              }
            `}
          </style>
      <br />
      <AdminHeader/>

      <div className="row" style={{ height: '90%' }}>
        <LeftSideBar1/>
        <div className="col-md-8">
          <br />
          <h1>유저 정보 수정</h1>
          <br />
          <div>
            {/* <form action="/admin/userManager/user/update" method="post"> */}
              <table style={{ width: '100%' }}>
                <tbody>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>
                    아이디
                  </th>
                  <td>
                    <li>
                      {username}
                    </li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>이름</th>
                  <td>
                    <li>
                      <input style={{ width: '90%' }} type="text" defaultValue={name} onChange={changeName} />
                    </li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>이메일</th>
                  <td>
                    <li>
                    <input style={{ width: '90%' }} type="text" defaultValue={email} onChange={changeEmail} />
                    </li>
                  </td>
                </tr>
                <tr>
                  <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>활성화 여부</th>
                  <td>
                    <li>
                    <select
                        value={enabled?.toString()} // state 값을 문자열로 전달
                        onChange={changeEnabled} // 상태 업데이트 처리
                      >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                      </select>
                    </li>
                  </td>
                </tr>
                </tbody>
              </table>
              <br />
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link to={`/admin/user/select/${id}`} className={ResetCs.sub_butten} style={{ marginRight: '20px' }}>취소</Link>
                <button type="submit" onClick={onSubmit} className={ResetCs.butten} >수정</button>
              </div>
            {/* </form> */}
            <table style={{ width: '100%' }}>
              <tr>
                <th style={{ padding: '12px 0', width: '20%', textAlign: 'center' }}>권한 목록</th>
                <td>
                  <table>
                    <thead>
                      <tr>
                        <th style={{ padding: '12px 0', width: '150px' }}>권한</th>
                        <th style={{ padding: '12px 0' }}>비고</th>
                      </tr>
                    </thead>
                    <tbody>
                      {user.authList?.map(sub => (
                        <tr key={sub.no}> {/* 각 항목에 고유 key를 추가 */}
                        <th>
                          <li>
                            <span>{sub.auth}</span>
                          </li>
                        </th>
                        <td>
                          <li >
                            <button className={ResetCs.li_butten} onClick={() => authDelete(sub.no)}>제거</button>
                          </li>
                        </td>
                        </tr>
                        ))}
                      <tr>
                        {/* <form action="/admin/userManager/user/authPlus" method="post"> */}
                          {/* <input type="hidden" name="userId" value={user.username} /> */}
                          <th>
                            <li>
                            <select
                                  value={selectedAuth} // 선택된 값을 상태로 설정
                                  onChange={handleAuthChange} // 상태 업데이트
                                >
                                {authList?.map(authL => (
                                  <option key={authL.typeName} value={authL.typeName}>
                                    {authL.typeName}
                                  </option>
                                ))}
                              </select>
                            </li>
                          </th>
                          <td>
                            <li className={ResetCs.li_butten}>
                              <button type="submit" onClick={authPlus} className={ResetCs.li_butten} >추가</button>
                            </li>
                          </td>
                        {/* </form> */}
                      </tr>
                    </tbody>
                  </table>
                </td>
              </tr>
            </table>
          </div>
        </div>
        <div className="col-md-2"></div>
      </div>
    </div>
  );
};

export default UserUpdate;
