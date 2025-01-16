import React, { useEffect, useState } from 'react';
import $ from 'jquery';
import ResetCs from '../../css/Reset.module.css';  // 상대 경로로 CSS 파일 포함
import '../../css/Admin.css';  // 상대 경로로 CSS 파일 포함
import { Link } from 'react-router-dom';
import LeftSideBar1 from '../../LeftSideBar1'

const AuthInsert = () => {
  const [typeName, setTypeName] = useState("");
  const [description, setDescription] = useState("");

  const handleTypeNameChange = (e) => {
      setTypeName(e.target.value);
  };

  const handleDescriptionChange = (e) => {
      setDescription(e.target.value);
  };

  const handleSubmit = (e) => {
      e.preventDefault();
      // 권한 생성 요청 처리
      // 예시로 콘솔에 로그를 출력
      console.log("권한 이름:", typeName);
      console.log("설명:", description);
  };

  useEffect(() => {
    document.title = "ADMINISTRATOR";

    $(".mainLi").on("mouseover",function(){
      $(this).find(".subLi").stop().slideDown();
      //$(this).find(".movieLi").stop().slideDown();
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
        <div className="container-fluid" style={{ height: "720px" }}>
                        <style>
                
                {`
                  .movieLi {
                    display: none;
                  }
                `}
              </style>
            <br />
            <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "start" }}>
                    <a style={{ marginRight: "30px" }} href="/">
                        <img src="/image(id='C:/upload/vora_purple_black.png')" style={{ width: "105px", height: "40px" }} alt="logo" />
                    </a>
                    <h1>
                        <a href="/admin">
                            ADMINISTRATOR : <span className="adminTitle">{/* sec:authentication="principal.user.name" */}</span>
                        </a>
                    </h1>
                </div>
                <div>
                    <hr className="ms-0" style={{ width: "700px" }} />
                </div>
            </div>

            <div className="row" style={{ height: "90%" }}>
                <LeftSideBar1/>

                <div className="col-md-8">
                    <br />
                    <h1>권한 생성</h1>
                    <br />
                    <div>
                        <form onSubmit={handleSubmit}>
                            {/* CSRF TOKEN은 React에서는 상태나 다른 방법으로 처리해야 하지만, 여기선 그대로 두었습니다. */}
                            <input type="hidden" name="_csrf" value="CSRF_TOKEN_HERE" />
                            <table style={{ width: "100%" }}>
                                <tr>
                                    <th style={{ padding: "12px 0", width: "20%", textAlign: "center" }}>
                                        권한 이름
                                    </th>
                                    <td>
                                        <li><input style={{ width: "90%" }} type="text" name="typeName" value={typeName} onChange={handleTypeNameChange} /></li>
                                    </td>
                                </tr>
                                <tr>
                                    <th style={{ padding: "12px 0", width: "20%", textAlign: "center" }}>설명</th>
                                    <td>
                                        <li><input style={{ width: "90%" }} type="text" name="description" value={description} onChange={handleDescriptionChange} /></li>
                                    </td>
                                </tr>
                            </table>
                            <br />
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <a href="javascript:history.back()" className="sub_butten" style={{ marginRight: "20px" }}>취소</a>
                                <input type="submit" value="생성" className="butten" />
                            </div>
                        </form>
                    </div>
                </div>

                <div className="col-md-2"></div>
            </div>
        </div>

  )
}

export default AuthInsert