import React, { useRef, useState } from 'react';
import styles from'./AddMapFrom.module.css';
import * as addmap from '../../../../apis/addmap'

const AddMapFrom = () => {

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
    const cinemaId = searchParams.get("cinemaId");

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
    alert('맵제작 완료?')
    
    
    
    
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
  
  return (
    <div className='containerFluid'>
      <br/>
      {/* 관리자 정보? */}

      {/* 맵 제작 */}
      <div className="row">
      <div className="colMd2">
        <div>
          <ul>
            <li><a href="">상영관</a></li>
            <li><a href="">상영리스트</a></li>
          </ul>
        </div>
      </div>

      <div className="colMd8">
        <br/>
        <h1>상영관 생성</h1>
        <br/>
        <div>
            {/* CSRF TOKEN 부분 및 상영관 이름 작성 theater/insert/ 상영관생성 아래 from 태그 */}
            <table style={{ width: "100%" }}>
              <tr>
                  <th style={{ padding: "12px 0", width: "20%", textAlign: "center" }}>이름</th>
                  <td>
                      <li><input style={{ width: "90%" }} type="text" name="name" id="name" required/></li>
                  </td>
              </tr>
          </table>
        </div>
        <div className={styles.createContainer}>
          <h4>좌석 배치</h4>
          <div className={styles.createBtn}>
            <input type="number" name='width_length' value={formValues.width_length} onChange={handleChange}/>
            <input type="number" name='height_length' value={formValues.height_lenght} onChange={handleChange}/>
            <button type='button' onClick={create}>생성</button>
          </div>

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
        <div className={styles.ExitCreate}>
          {/* 취소 링크 달아야함 */}
            <a href="">취소</a>
            <button id="addButton" onClick={addButton}>생성</button>
        </div>
      </div>

      <div className={styles.colMd2}></div>
      {/* ? */}
    </div>
    </div>
  )
}

export default AddMapFrom