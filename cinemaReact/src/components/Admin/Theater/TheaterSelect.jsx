import React, { useEffect, useRef, useState } from 'react';
import styles from './AddMapFrom/AddMapFrom.module.css'
import * as addmap from '../../../apis/addmap'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import ResetCs from '../css/Reset.module.css';
import AdminHeader from '../AdminHeader';
import * as admins from '../../../apis/admins'

const TheaterSelect = () => {

  const [mapData,setMapData] = useState([]);
  const [Id, setId] = useState();
  const [name, setName] = useState();

  const [cinemaIDD, setCinemaIDD] = useState('')
  const navigate = useNavigate();

    // 🎁 게시글 목록 데이터
    const getList = async () => {
      let response = null
      response = await admins.theaterListInsertGet(cinemaIDD)
      const data = await response.data
      console.dir(data)
    }

  useEffect( () => {
    const searchParamss = new URLSearchParams(location.search);
    setCinemaIDD(searchParamss.get("cinemaId"))
    if(cinemaIDD != ''){
      getList()
      .then(() => {
      
      })
      .catch((error) => {
        console.error("Error occurred:", error);
        navigate('/admin/error'); // 예외가 발생하면 에러 페이지로 리디렉션
      });
    }
  }, [cinemaIDD])

  useEffect( () => {
    if(mapData.length > 0){
      console.log("맵정보",mapData);
      var x = mapData[0].length;
      var y = mapData.length;
  
      // 불러오기 실행 맵생성
      readMapAdd(x,y,mapData)
    }
  }, [mapData])

  useEffect( () => {
    console.log("ID : ", Id);
    console.log("Name : ", name);
    
  }, [Id,name])

  const readMap = async () => {
    const searchParams = new URLSearchParams(location.search);
    const theaterId = searchParams.get("id");
    setId(theaterId)
    console.log("theaterId : ",theaterId);
    

    
    var btn = document.getElementById('btn');
    if( btn.innerHTML.trim() !== ""){
        if(confirm("기존 내용을 삭제합니까?")){
            // btn 자식데이터 삭제
            btn.innerHTML = "";
        }
    }
    
    const headers = {
      'Content-Type' : 'application/json'
    }
    const searchParamsss = new URLSearchParams(location.search);
    const response = await addmap.readMap(searchParamsss.get("cinemaId"),theaterId,headers)
    console.error(response);
    
    console.log(response.status);
    const data = response.data
    setMapData(data.readMapData);
    setName(data.name)
  }

  const readMapAdd = (x,y,mapData) =>{
    console.log(mapData);
    console.log(" X : " + x);
    console.log(" Y : " + y);
    // console.log(mapData[2][0]); // (2.0 = 3.1)3.1 좌표에 기본값 C_1 출력

    // backgournd-color 범위 설정 변수
    var passcount = 0;
    var maxcount = 0;

    // A 부터 시작하는 아스키코드
    let ascii = 65; // 정수 = 'A'

    for (var n = 0; n < y; n++) {
        var count = 0;

            // 행 시작 문자를 표시하는 요소 생성
            var mapStart = document.createElement('p');
            mapStart.className = styles.mapStart;    // 행 시작문자 css 요소 클래스에 주입
            mapStart.textContent = String.fromCharCode(ascii)+"열"; // 현재 아스키코드 문자 (A, B, C...)
            btn.appendChild(mapStart); // 버튼 컨테이너에 추가

        for (var i = 0; i < x; i++) {
            count++;
            // 버튼 생성
            var map = document.createElement("div"); // 버튼 요소 생성
            map.className = styles.mapButton1; // CSS 클래스 추가

            // id 값 A1 A2 ..... F숫자ㅑ
            let ascii2 = String.fromCharCode(ascii); // 아스키코드 문자변환
            map.id = ascii2+count;
            var name = ascii2+"_"+count;
            map.setAttribute('name',name);
            // 벨류값 1 ~ x 저장
            //console.log(y," ", x)
            var mapvalue = mapData[n][i].split("_");
            
            // 맵불러올때 통로값 marginRigth 주기
            var value1 = "1";
            for (let value of mapvalue) {
                if((value == '통로')){
                    map.style.marginRight = '85px';
                    value1 = '통로'
                    console.log(name+" : 통로라서 콘솔찍힘 : " + value)
                    if(mapvalue[0] == '통로' || mapvalue[0] == ascii2){
                        mapvalue[0] = '빈공간';
                    }
                }
            }
            if(value1 == '통로' && mapvalue[0] != 'null'){
                map.value = mapvalue[0]+"_"+value1;
                map.textContent = mapvalue[0];
            } else if(mapvalue == 'null'){
                map.value = mapvalue[0];
                map.textContent = '빈공간';
            } else{
                map.value = mapvalue[0];
                map.textContent = mapvalue[0];
            }

            //map.textContent = count;
            // div태그에 btn ID를 가진거 밑으로 map button생성  
            btn.appendChild(map);

            // // X 버튼 생성
            // var closeButton = document.createElement("span");
            // closeButton.className = "closeButton"; // CSS 클래스 추가
            // closeButton.id = "closeButton_" + ascii2 + count; // id 추가
            // closeButton.textContent = "X"; // 닫기 버튼 텍스트

            // // X 버튼 눌렀을때 실행
            // closeButton.onclick = function(){
            //     event.stopPropagation(); // 부모이벤트 전파 중지
            //     var parentMap = this.parentElement; // 부모 요소(버튼)에 접근
            //     // X 버튼 클릭 이벤트
            //     Xclick(this.id, parentMap)
            // }
            // // X 버튼을 map에 추가
            // map.appendChild(closeButton);
            // // plus 통과 버튼 생성
            // addSeat(map)
        }
        // 아스키 코드 값 + 1
        ascii += 1; // 'A' > 'B' > 'C'
        // 줄바꿈 추가
        var lineBreak = document.createElement("br");
        btn.appendChild(lineBreak);

    }
}

  useEffect( () => {
    readMap()
  }, [])


  const automapingRef = useRef(null);

  const create = () =>{
    
    var x = document.getElementsByName('width_length')[0]?.value || null;
    var y = document.getElementsByName('height_length')[0]?.value || null;
    
    var btn = document.getElementById('btn');
    if(btn.innerHTML.trim() !== ""){
      // btn 자식데이터 삭제
      btn.innerHTML = "";
    }
    
    let ascii = 65; // 정수 = 'A'
    
    console.log('생성 작동여부');
    console.log(x);
    console.log(y);
    for(var n = 0; n < y; n++){
      var count = 0;

      // 행 시작 문자를 표시 생성
      var mapStart = document.createElement('p');
      mapStart.className = styles.mapStart;
      mapStart.textContent = String.fromCharCode(ascii)+"열";
      btn.appendChild(mapStart);

      for (var i = 0; i < x; i++){
        count++;
        // 좌석 수정 버튼 생성
        var map = document.createElement("button");
        map.className = styles.mapButton;

        addSeat(map)

        // id 값 A1 A2 ...... F숫자
        let ascii2 = String.fromCharCode(ascii);
        map.id = ascii2 + count;
        var name = ascii2 + "_" + count;
        map.setAttribute('name',name);
        // value 값 1 ~ x 저장
        map.value = ascii2 + count;
        
        // div태그에 btnID 밑으로 map button 생성
        btn.appendChild(map)
        
        // x 버튼 생성
        var closeButton = document.createElement("span");
        closeButton.className = styles.closeButton;
        closeButton.id = "closeButton_" + ascii2 + count;
        closeButton.textContent = "X";

        // X버튼 눌렀을때 실행
        closeButton.addEventListener('click', function(event){
          event.stopPropagation();
          var parentMap = this.parentElement; // 부모 요소(버튼)에 접근
          // x 버튼 클릭 이벤트
          Xclick(this.id, parentMap)
        });

        // X 버튼을 map에 추가
        map.appendChild(closeButton);
      }

      // 아스키 코드 값 + 1
      ascii += 1; // 'A' > 'B' > 'C'

      // 줄바꿈 추가
      var lineBreak = document.createElement("br");
      btn.appendChild(lineBreak);
    }
  }

  const addSeat = (map) =>{
    // 이미 좌석생성 버튼 여부 확인
    if(!map.querySelector(".buttonContainer")){
      // 좌석생성 버튼이 없으면 새로 생성
      var buttonContainer = document.createElement("div");
      buttonContainer.className = styles.buttonContainer;

      // + 버튼 생성
      var seatPlus = document.createElement("button");
      seatPlus.textContent = "+";
      seatPlus.className = `${styles.seatButtonPlus} plus`; // 클래스 추가
      seatPlus.addEventListener('click', function(event) {
          event.stopPropagation(); // 부모이벤트 전파 중지
          Plus(map.id);
      });

      // 통로 버튼 생성
      var seatPass = document.createElement("button");
      seatPass.textContent = "통로";
      seatPass.className = `${styles.seatButton} minus`;
      seatPass.addEventListener('click', function(event){
        event.stopPropagation();
        Pass(map.id);
      });

      // 버튼들을 컨테이너에 추가
      buttonContainer.appendChild(seatPlus);
      buttonContainer.appendChild(seatPass);

      // 버튼 컨테이너를 map에 추가
      map.appendChild(buttonContainer);
    }
  }

  /** 클릭 이벤트 **/
  const Plus = (id) => {
    var map = document.getElementById(id);

    // name 속성 값 가져오기
    var mapValue = map.getAttribute('name');

    // name 속성 값 분활 (예 : A_1 -> ['A', '1'])
    var value = mapValue.split("_");

    // valueId 조합 (A + 1)
    var valueId = value[0] + value[1];
    // console.log("valueId : " + valueId); // A1

    // map의 value 속성에 valueId 설정
    value = document.getElementById(id).value;
    
    var values = value.split("_");
    for (let v of values ){
      if( v == '통로'){
        mapValue = '통로';
      }
    }
    if(mapValue == '통로'){
      map.value = valueId + "_" + mapValue;
    } else {
      map.value = valueId;
    }

    // 기존 텍스트노드 제거 및 텍스트 추가
    removeNode(map, valueId)
    // 모든 자식 요소 순회하여 숨김 처리
    children(map)
  }

  const Pass = (id) =>{
    var map = document.getElementById(id);
    var mapValue = document.getElementById(id).value;
    map.style.marginRight = '85px';
    var value = mapValue.split("_")
    for( let v of value){
      if( v != 'null'){
        if(v == '통로'){
          map.style.marginRight = '5px';
          map.value = id;
        } else {
          map.value = id + "_" + '통로';
        }
      } else {
        map.value = '통로';
      }
    }
    // console.log("테스트 : " + id);
    // 모든 자식 요소 순회하여 숨김 처리
    children(map)
  }

  
  const Xclick = (id, parentMap) => {
    console.log(id)
    console.log(parentMap)
    let btnId = id.split("_")

    var btn = document.getElementById(btnId[1])
    btn.value = null;

    // 모든 자식 요소 순회
    children(btn)

    parentMap.style.marginRight = '5px';
    parentMap.value = 'null';
    removeNode(parentMap, '빈공간')
  }
  const automap = () => {
    
    
    // 자식 요소가 있는지 확인
    if (automapingRef.current && automapingRef.current.children.length > 0) {

      var x = document.getElementsByName('width_length')[0]?.value || null;
      var y = document.getElementsByName('height_length')[0]?.value || null;
    
      let ascii = 65;


      for(var n = 1; n <= y; n++){
        let count = 1;
        let ascii2 = String.fromCharCode(ascii);

        for(var i = 1; i <= x; i++){
          var map = document.getElementById(ascii2 + count);
          var mapValue = document.getElementById(ascii2 + count).value.split("_");

          map.value = ascii2 + count;
          var valueId = ascii2 + count
          
          removeNode(map, valueId);

          // 통로 구분
          if( map != null){
            for(let m of mapValue){
              if( m == '통로'){
                map.value = valueId + "_통로";
              }
            }
          } else {
            // console.log(ascii2 + count + " 아이디가 없습니다");  // 아이디가 없으면 출력
          }
          count++;
        }
        ascii++
      }
    } else {
      // console.log("자식 요소가 없습니다.");
    }
  
  }

  //**************** 참조 기능 ****************//
  // 텍스트 노드 제거
  function removeNode(map, valueId){
      // 기존 텍스트 노드가 있으면 제거
      var existingTextNode = null;
      for (const child of map.childNodes) {
          if (child.nodeType === Node.TEXT_NODE) {
              existingTextNode = child;
              break;
          }
      }
      // 기존 텍스트 노드가 있으면 제거
      if (existingTextNode) {
          map.removeChild(existingTextNode);
      }
      // 새로운 텍스트 노드 생성 후 추가
      var textNode = document.createTextNode(valueId);
      map.appendChild(textNode); // map에 텍스트 노드 추가
  }

  // 모든 자식요소 순환 display = none 처리
  function children(map){
      const children = map.children;
      for (const child of children) {
          child.style.display = 'felx';
      }
  }

  /** 저장하기 */
  const addButton = async () => {

    
    let name = document.getElementById('name').value;
    // let cinemaId = document.getElementById('cinemaId')

    // 주소창에서 갖고오기
    const searchParams = new URLSearchParams(location.search);
    const cinemaId = searchParams.get("cinemId");

    console.log("이름",name);
    console.log("시네마ID",cinemaId);

    var x = document.getElementsByName('width_length')[0]?.value || null;
    var y = document.getElementsByName('height_length')[0]?.value || null;

    let ascii = 65;

    var YMap = [];
    for(var n = 1; n <= y; n++){
      var XMap = [];
      let count = 1;
      let ascii2 = String.fromCharCode(ascii);
      for(var i = 1; i <= x; i++){
        var contentElement = document.getElementById(ascii2+count);
        if(contentElement != null){
          var content = contentElement.value;
          XMap.push(content);
        } else{
          console.log(ascii2 + count + " 아이디가 없습니다");  // 아이디가 없으면 출력
        }
        count++;
      }
      YMap.push(XMap);
      ascii++;
    }

    // console.log(YMap); //나옴
    // console.log(x);
    // console.log(y);
    // console.log(cinemaId); // 테스트때는 임시데이터

    let data = {
      'x' : x,
      'y' : y,
      'mapData' : YMap,
      'name' : name,
      'cinemaId' : cinemaId
    }
    const headers = {
      'Content-Type' : 'multupart/form-data'
    }
    // id(UUID), name(이건 먼지모르겠) 암튼 컨트롤러에서 수정해야함
    let request = new XMLHttpRequest()
    const response = await addmap.addmap(data, headers)
    const d = response.data
    console.log(d);
    alert('맵제작 완료')
    location.href = '/admin/theater/list/'+cinemaId
    
    
    
    
    // PSOT 데이터 controller 수정
    
    
  }

  const [formValues, setFormValues] = useState({
    width_length : 8,
    height_lenght : 4,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues( (pervValues) => ({
      ...pervValues,
      [name]:value, //입력 필드 이름에 따라 상태 업데이트
    }));
  };

  const updatedFrom = () => {
    const searchParams = new URLSearchParams(location.search);
    const cinemaId = searchParams.get("cinemaId");

    location.href = `/admin/theater/update?id=${Id}&cinemaId=${cinemaId}`;
  }
  
  return (
    <div className={`container-fluid ${ResetCs.adminLEE}`} style={{ height: '98vh' }}>
      <br/>
      {/* 관리자 정보? */}
      <AdminHeader/>
      {/* 맵 제작 */}
      <div className="row" style={{ height: '90%' }}>
      <div className="col-md-2">
          <div style={{ marginTop: '100px', fontSize: '26px' }}>
              <ul>
                  <li><Link to={`/admin/theater/list/${cinemaIDD}`} style={{ color: '#583BBF' }}>상영관</Link></li>
                  <li><Link to={`/admin/theaterList/list/${cinemaIDD}`}>상영리스트</Link></li>
              </ul>
          </div>
      </div>

      <div className="col-md-8">
        <br/>
        <h1>상영관 조회</h1>
        <br/>
        <div>
            {/* CSRF TOKEN 부분 및 상영관 이름 작성 theater/insert/ 상영관생성 아래 from 태그 */}
            <table style={{ width: "100%" }}>
              <tbody>
              <tr>
                  <th style={{ padding: "12px 0", width: "20%", textAlign: "center" }}>이름</th>
                  <td>
                      <li><input style={{ width: "90%" }} type="text" name="name" id="name" value={name || ''} required/></li>
                  </td>
              </tr>
              </tbody>
          </table>
        </div>
        <div className={styles.createContainer}>
          {/* <h4>좌석 배치</h4> */}
          {/* <div className={styles.createBtn}>
            <input type="number" name='width_length' value={formValues.width_length} onChange={handleChange}/>
            <input type="number" name='height_length' value={formValues.height_lenght} onChange={handleChange}/>
            <button type='button' onClick={create}>생성</button>
          </div> */}

          <div className={styles.mapBox}>
            <div className={styles.screen}>
              <h1>SCREEN</h1>
          </div>

          <div className={styles.map}>
              <div id='btn' ref={automapingRef} className={styles.btnMap}></div>
            </div>
          </div>
          <button id='readButton' onClick={automap}>일괄 번호생성</button>
        </div>
        <br/>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link to={`/admin/theater/list/${cinemaIDD}`} type="button" className={ResetCs.sub_butten} style={{ marginRight: '20px' }} >취소</Link>
          <button type="submit" onClick={updatedFrom} className={ResetCs.butten} >수정</button>
        </div>
      </div>

      <div className={styles.colMd2}></div>
      {/* ? */}
    </div>
    </div>
  )
}

export default TheaterSelect