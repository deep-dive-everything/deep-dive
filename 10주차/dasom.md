# Morden JavaScript Deep Dive

Dasom, 2024.07.21

## 38장 브라우저의 렌더링 과정

> 브라우저의 렌더링 수행 과정
>
> 1. HTML, CSS, JavaScript, 이미지, 폰트 파일 등 렌더링에 필요한 리소스를 요청 및 서버로부터 응답
> 2. HTML, CSS 파싱하여 DOM과 CSSOM 생성 / 둘을 결합하여 렌더링 트리 생성
> 3. JavaScript를 파싱하여 AST(Abstract Syntax Tree)생성 및 실행
> 4. 렌더 트리를 기반으로 HTML 요소의 레이아웃을 계산 및 페인팅



### 요청과 응답

* 브라우저 주소창에 URL 입력
* URL의 호스트이름이 DNS를 통해 IP주소로 변환
* IP주소를 갖는 서버에 요청 전송

> 루트 요청에 대해서는 기본적으로 서버의 루트 폴더에 존재하는 정적 파일인 index.html을 반환함
>
> 단, 브라우저의 주소창을 통해서만 서버에 파일을 요청할 수 있는 것은 아님. 자바스크립트를 통해서도 동적으로 서버에 정적/동적 데이터를 요청할 수 있음



### HTML 파싱과 DOM 생성

* 서버로부터 응답 받은 HTML 문서 (e.g. index.html)를  한 줄씩 파싱하여 브라우저가 이해할 수 있는 자료구조인 DOM(DocumentObject Model)으로 생성
  * 상세 파싱 과정 (바이트 -> 문자 -> 토큰 -> 노드 -> DOM)

>  HTML요소는 중첩 관계를 가짐(태그 사이에 다른 html 요소가 포함될 수 있음)
>
> 이러한 중첩 관계에 따라 부자 관계가 형성되고, 이 관계를 반영하여 모든 노드를 트리 자료구조로 구성함. 이 노드들로 구성된 자료구조가 DOM

* 생성 중 link태그나 style 태그를 만나면 DOM 생성을 일시 중단함



### CSS 파싱과 CSSOM생성 

* DOM 파싱 중 CSS를 로드하는 태그를 만날 때 파싱시 시작됨
* HTML과 동일한 과정 (바이트 -> 문자 -> 토큰 -> 노드 -> CSSOM)
* 파싱이 완료되면 HTML 파싱이 중단된 지점부터 다시 HTML 파싱을 시작함



### 렌더 트리 생성

* DOM과 CSSOM이 렌더링을 위해 렌더 트리로 결합됨
  * 렌더링을 위한 자료구조이기 때문에 렌더링 되지 않는 노드(e.g. meta, script 태그 등)는(은) 포함되지 않음
* 렌더트리는 각 HTML 요소의 레이아웃을 계산하는 데 사용되며, 브라우저 화면에 픽셀을 렌더링 하는 페인팅 처리에 입력됨

> 레이아웃 계산과 페인팅을 다시 실행하는 리렌더링은 비용이 많이 드는 작업이기 때문에 주의가 필요함



### 자바스크립트 파싱과 실행

> 생성된 DOM은 HTML 문서의 구조와 정보, 요소와 스타일 등을 변경할 수 있는 프로그래밍 인터페이스로서 DOM API를 제공함
>
> 자바스크립트는 DOM API를 활용해 생성된 DOM을 동적으로 조작할 수 있음

* HTML 문서를 파싱하며 DOM을 생성해 나가다 자바스크립트를 로드하거나 콘텐츠를 포함한 script 태그를 만나면 자바스크립트 파싱을 시작함

  * 즉, DOM이 다 그려지고 나서 자바스크립트를 파싱하는 것이 아님에 유의

  * DOM이 완성되지 않은 상태에서 완성되지 않은 DOM을 변경하는 DOM API를 사용하는 경우 문제가 발생할 수 있음

  * 따라서 script태그 위치에 유의해야 함

    > 단, HTML5부터는 해당 문제의 해결을 위해 script 태그에 async와 defer 어트리뷰트가 추가됨
    >
    > * async
    >
    >   HTML파싱과 외부 자바스크립트 파일의 로드가 비동기적으로 진행됨
    >
    >   자바스크립트가 로드된 직후 진행됨
    >
    >   순서를 보장하지 않음
    >
    > * defer
    >
    >   HTML파싱이 완료된 직후(=DOM생성이 완료된 직후) 진행됨
    >
    > (src 어트리뷰트를 통해 외부 자바스크립트 파일을 로드하는 경우에만 사용할 수 있음)

* 자바스크립트의 파싱과 실행은 브라우저 렌더링 엔진이 아닌 자바스크립트 엔진이 처리함

  * V8, 파이어폭스의 SpiderMonkey, 사파리의 JavaScriptCore 등

* 자바스크립트 엔진은 자바스크립트를 해석하여 AST(Abstract Syntax Tree, 추상적 구문 트리)를 생성함

  * 토크나이저가 소스코드를 토크나이징 -> 토큰을 파서가 파싱 -> AST 생성 -> 바이트코드 생성기가 AST를 기반으로 인터프리터가 이해할 수 있는 바이트코드 생성 -> 실행 (인터프리터)



### 리플로우와 리페인트

* 자바스크립트 코드에 DOM이나 CSSOM을 변경하는 DOM API가 사용된 경우 변경됨
* 이 때 변경된 DOM과 CSSOM은 다시 렌더 트리로 결합되고 레이아웃과 페인트 과정을 거쳐 리렌더링되는데 이를 리플로우와 리페인트라고 함



## 39장 DOM



### 노드

**노드 객체 타입**

* 문서 노드
  * DOM트리 최상위 루트 노드, document객체를 가리킴
* 요소 노드
  * HTML 요소
* 어트리뷰트(속성) 노드
* 텍스트 노드



**노드 객체의 특징**

* 노드 객체는 표준 빌트인 객체가 아닌 호스트 객체이지만, 자바스크립트 객체이므로 프로토타입에 의한 상속구조를 가짐
* 노드 객체의 종류에 상관 없이 가지는 공통적 기능과 노드 타입에 따른 고유한 기능이 존재함
  * e.g. addEventListnersms EventTarget 인터페이스가 제공해 모든 노드 객체에 이벤트 등록 가능 / input 노드에는 value가 필요하지만 div는 필요하지 않음 



### 노드 조작

**요소 노드 취득**

* id
* 태그 이름
* class
* css 선택자
* HTMLCollecion, NodeList (여러개 취득)
  * HTMLCollection은 실시간으로 노드 객체의 상태 변경을 반영해 주의가 필요함 (getElementsByClassName)
  * 위의 문제를 해결하기 위해 querySelectAll 메서드를 사용할 수 있음 (NodeList를 반환)



**노드 탐색**

* pranetNode, previousSibling, firstChild, ChildNodes (Node.prototype 제공)
* previousElementSibling, nextElementSibling, children (Element.prototype 제공)



**노드 정보 취득**

* Node.prototype.nodeType: 노드 객체의 종류를 나타내는 상수 반환
* Node.prototype.nodeName: 노드의 이름을 묹자열로 반환 



### DOM 조작

**주의점**

* DOM의 변경에 따라 리플로우와 리페인트가 발생하여 성능에 영향을 줄 수 있음
* 사용자에게 입력받은 데이터를 innerHTML의 프로퍼티에 할당시 XSS(크로르 사이트 스크립팅 공격)에 취약함



**노드의 생성과 추가**

* 요소 노드 생성: Document.prototype.createElement(tagName)
* 텍스트 노드 생성: Document.prototype.createTextNode(text)
  * 텍스트 노드를 요소 노드의 자식 노드로 추가: `$li.appendChile(textNode)`
  * 요소를 DOM에 추가: `$fruits.appendChild($li)`
* 마지막 노드로 추가: Node.prototype.appendChild
* 지정한 위치에 노드 삽입: Node.prototype.insertBefore(newNode, childNode)



**그 외 노드 조작**

* 노드 복사: Node.prototype.cloneNode([deep:true|false])
* 노드 교체: Node.prototype.replaceChild(newChild, oldChild)
* 노드 삭제: Node.prototype.removeChild(child)



### 어트리뷰트

> 요소 노드는 초기화를 위한 초기 상태와 최신 상태의 관리가 필요하다.
>
> 요소 노드의 초기 상태는 어트리뷰트 노드가 관리하며, 요소 노드의 최신 상태는 DOM 프로퍼티가 관리한다.

예를 들어, input에서 초기 value는 tomato였고 사용자가 apple을 입력했다면, tomato는 어트리뷰트 노드에 관리되어 새로고침시 다시 해당 value가 나올 수 있고 / apple은 DOM 프로퍼티가 관리해 해당 값으로 특정 이벤트들을 처리할 수 있음

**HTML 어트리뷰트와 DOM프로퍼티의 대응관계**

대부분의 HTML 어트리뷰트는 DOM 프로퍼티와 1:1로 대응하지만 항상 그런 것은 아님

* td 요소의 colspan 어트리뷰트는 대응 프로퍼티가 존재하지 않음
* textContetn 프로퍼티는 대응 어트리뷰트가 존재하지 않음
* 어트리뷰트 이름은 대소문자를 구별하지 않지만 대응하는 프로퍼티 키는 카멜 케이스를 따름



**data 어트리뷰트와 dataset 프로퍼티**

data 어트리뷰트와 dataset 프로퍼티를 사용해 HTML 요소에 정의한 사용자 정의 어트리뷰트와 자바스크립트 간에 데이터 교환 가능

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Data Attribute Example</title>
</head>
<body>
    <div id="user" data-user-id="12345" data-user-name="dasom" data-user-role="admin">
        User Information
    </div>
    
    <script src="script.js"></script>
</body>
</html>

```

```js
// script.js

// HTML 요소 선택
const userDiv = document.getElementById('user');

// data 어트리뷰트 값 접근
const userId = userDiv.dataset.userId;
const userName = userDiv.dataset.userName;
const userRole = userDiv.dataset.userRole;

console.log(`User ID: ${userId}`);       // User ID: 12345
console.log(`User Name: ${userName}`);   // User Name: dasom
console.log(`User Role: ${userRole}`);   // User Role: admin

// data 어트리뷰트 값 변경
userDiv.dataset.userName = 'Park';
userDiv.dataset.userRole = 'editor';

console.log(`Updated User Name: ${userDiv.dataset.userName}`);  // Updated User Name: Park
console.log(`Updated User Role: ${userDiv.dataset.userRole}`);  // Updated User Role: editor

```





## 느낀점

이번 스터디 주제가 하이라이트이자 자바스크립트의 하이라이트라고 생각하는데 조금 더 깊게 파보지 못한 것 같아 아쉬움이 남는다. 스터디 때 함께 얘기하면서 이 아쉬움을 채워나갈 것..!

