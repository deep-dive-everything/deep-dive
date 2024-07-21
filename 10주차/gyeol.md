# 38장 - 브라우저의 렌더링 과정

- 브라우저의 렌더링 과정
    
    ![image](https://github.com/user-attachments/assets/b83aa714-b542-44a0-ba78-3a7dad320bad)
    
    1. 브라우저는 HTML, CSS, JS, 이미지, 폰트 파일 등 렌더링에 필요한 리소스를 요청하고 서버로부터 응답을 받음
    2. 브라우저의 렌더링 엔진은 서버로부터 응답받은 HTML과 CSS를 파싱하여 DOM과 CSSOM을 생성하고 결합하여 렌더트리를 생성함
    3. 브라우저의 JS 엔진은 서버로부터 응답받은 JS를 파싱하여 AST(Absctract Syntax Tree)를 생성하고 바이트코드로 변환하여 실행함
    이 때 JS는 DOM API를 통해 DOM이나 CSSOM을 변경할 수 있음. 변경된 DOM과 CSSOM은 다시 렌더 트리로 결합됨
    4. 렌더 트리를 기반으로 HTML 요소의 레이아웃(위치와 크기)을 계싼하고 브라우저 화면에 HTML 요소를 페인팅

## 38.1 요청과 응답

- 브라우저의 핵심 기능
    - 렌더링에 필요한 리소스는 모두 서버에 존재 → 필요한 리소스를 서버에 요청하고 서버가 응답한 리소스를 파싱하여 렌더링
    - 서버에 요청을 전송하기 위해 브라우저는 주소창을 제공
- 실제로 요청 해보기(https://poiemaweb.com/ 입력 )
    - 브라우저의 주소창에 https://poiemaweb.com/ 를 입력하고 엔터키를 누르면 루트요청과 호스트만으로 구성된 URI이 poiemaweb.com 서버로 전송됨
    루트 요청에는 명확히 리소스를 요청하는 내용은 없지만 보통 서버는 루트 요청에 대해 암묵적으로 index.html을 응답하도록 기본 설정되어있음
    (즉, https://poiemaweb.com/ 는 [https://poiemaweb.com/index.html](https://poiemaweb.com/) 와 같은 요청)
        
        이에 서버는 루트 요청에 대해 서버의 루트 폴더에 존재하는 정적 파일 index.html을 클라이언트쪽으로 응답함. 
        

![image](https://github.com/user-attachments/assets/86dd03bc-ae98-4279-b967-68f63f916869)

✅ 실제로 확인해봤을 때 index.html 뿐만 아니라 CSS, JS, 이미지, 폰트 파일 등이 응답된 걸 확인할 수 있음!
그 이유는, 브라우저의 렌더링 엔진이 HTML을 파싱하는 도중에 외부 리소스를 로드하는 태그(CSS 파일을 로드하는 link 태그, 이미지 파일을 로드하는 img 태그, JS를 로드하는 script 태그 등)를 만나면 HTML 파싱을 일시 중단하고 해당 리소스 파일을 서버로 요청하기 때문임
 
🤔❓❓

내가 참여하고 있는 타사의 유지보수 프로젝트(vue.js와 nuxt 사용)는 어떻게 처리하는지 궁금했음

[Nuxt.js에서 외부 스크립트를 로드하는 방법](https://k1005.github.io/2021/09/03/Nuxt.js에서-외부-스크립트를-로드하는-방법/)

확인해보니 위 블로그에 나온대로 구글 차트 관련된 스크립트를 아래와 같이 defer로 로드되도록 처리되어있음

```jsx
// nuxt.confid.js
...
head:{
...
	script: [{hid:'gchart', src:'https://www.gstatic.com/charts/loader.js', defer:true}],
...
}
...
```

근데..저렇게 한 이유가 뭔지 궁금해서 일단 물어봄 

✅ 답변

Vue.js에서 Google Charts 라이브러리를 사용할 때 `nuxt.config.js`에서 `head` 옵션을 설정하는 이유는 다음과 같습니다

- SSR (Server-Side Rendering) 지원
    - Nuxt.js는 기본적으로 SSR을 지원하는 프레임워크입니다.
    SSR 환경에서는 초기 HTML 페이지를 서버에서 렌더링하므로, 클라이언트에서 필요한 외부 스크립트를 미리 로드해야 합니다
    - `nuxt.config.js`의 `head` 옵션을 사용하여 Google Charts 라이브러리의 스크립트 태그를 추가하면, 서버에서 렌더링된 HTML에 해당 스크립트 태그가 포함됩니다.
- 비동기 로드 (Async Loading)
    - `defer` 속성을 사용하여 스크립트를 비동기로 로드하도록 설정합니다.이렇게 하면 초기 HTML 렌더링을 차단하지 않고, 스크립트가 병렬로 로드됩니다.SSR 환경에서 초기 렌더링 속도가 중요하므로, 비동기 로드 방식을 사용하는 것이 좋습니다.
- 캐싱 및 최적화
    - `hid` 옵션을 사용하여 스크립트 태그에 고유한 ID를 부여합니다. 이렇게 하면 Nuxt.js가 중복된 스크립트 태그를 자동으로 제거할 수 있습니다. 또한 브라우저 캐싱을 통해 스크립트 로드 성능을 향상시킬 수 있습니다.

따라서 Nuxt.js 환경에서 Google Charts 라이브러리를 사용할 때, `nuxt.config.js`의 `head` 옵션을 통해 스크립트 태그를 추가하고 비동기 로드 방식을 설정하는 것은 SSR 지원, 초기 렌더링 속도 향상, 캐싱 및 최적화를 위한 것입니다.


## 38.2 HTTP 1.1과 HTTP 2.0

- HTTP 1.1
    - 커넥션 당 하나의 요청과 응답만 처리(여러 개의 요청 or 응답을 한 번에 전송 불가능)
    - 요청할 리소스 개수에 비례하여 응답시간도 증가한다는 단점 존재
- HTTP 2.0
    - 다중 요청과 응답이 가능
    → HTTP 1.1에 비해 페이지 로드 속도가 약 50% 빠름

## 38.2 HTML 파싱과 DOM 생성

- 서버가 응답한 HTMl 문서는 문자열로 이루어진 순수한 텍스트
- HTML 문서를 부라우저에 시각적인 픽셀로 렌더링하려면 브라우저가 이해할 수 있는 자료구조(객체)로 변환하여 메모리에 저장해야함
- 브라우저 렌더링 엔진은 HTML  문서를 파싱하여 브라우저가 이해할 수 있는 자료구조인 DOM을 생성함
    
    ![image](https://github.com/user-attachments/assets/716b0833-3a8b-414a-9ded-00074d808cee)


HTML 파싱, DOM 생성 과정

1. 서버에 존재하던 HTML 파일이 브라우저 요청에 의해 응답
이 때 서버는 브라우저가 요청한 HTML 파일을 읽어 메모리에 저장 후 다음 메모리에 저장된 바이트(2진수)를 인터넷을 경유하여 응답
2. 브라우저는 서버가 응답한 HTML 문서를 바이트(2진수) 형태로 응답받음
응답된 바이트 형태의 HTML 문서는 meta 태그의 charset 어트리뷰트에 의해 지정된 인코딩 방식(e.g. UTF-8)을 기준으로 문자열로 변환됨
    
    참고) meta 태그의 charset 어트리뷰트에 선언된 인코딩 방식은 content-type:text/html; charset=utf-8과 같이 응답 헤더에 담겨 응답됨. 브라우저는 이를 확인하고 문자열로 변환
    
3. 문자열로 변환된 HTML 문서를 읽어 문법적 의미를 갖는 코드의 최소 단위인 토큰들로 분해
4. 각 토큰들을 객체로 변환하여 노드들 생성. 토큰 내용에 따라 문서 노드, 요소 노드, 어트리뷰트 노드, 텍스트 노드가 생성됨. 노드는 이후 DOM을 구성하는 기본 요소가 됨
5. HTML 문서는 HTML 요소들의 집합으로 이루어지고 HTML 요소는 중첩관계를 가짐
→ HTML 요소의 콘텐츠 영역(시작 태그와 종료태그 사이)에는 텍스트 뿐만 아니라 다른 HTML 요소도 포함될 수 있음. 이 때 HTML 요소 간에는 중첩관계에 의해 부자 관계가 형성됨. 이러한 HTML 요소간의 부자관계를 반영해서 모든 노드들을 트리 자료 구조로 구성. 이 노드들로 구성된 트리 자료구조를 DOM이라 부름)

⇒ 즉 DOM은 HTML 문서를 파싱한 결과물!

## 28.4 CSS 파싱과 CSSOM 생성

- 렌더링 엔진은 HTML을 한줄씩 순차적으로 파싱해서 DOM을 생성
- 렌더링 엔진은 DOM을 생성하다가 CSS를 로드하는 link 태그나 style 태그를 만나면 DOM 생성을 중단한 후 link 태그의 href 어트리뷰트에 지정된 CSS 파일을 서버에 요청하여 로드한 CSS파일이나 style태그 내의 CSS를 HTMl과 동일한 파싱과정(바이트→문자→토큰→노드→CSSOM)을 거치며 해석하여 CSSOM을 생성
- CSS 파싱 완료 후 HTML 파싱이 중단된 지점부터 다시 HTML을 파싱 시작하며 DOM 생성을 재개
    
    ```jsx
    <!DOCTYPE html>
    <html>
     <head>
      <meta charset="UTF-8"> // 여기까지 해석한후, 
      <link rel="stylesheet" href="style.css"> 
      //link 태그를 만나면서 DOM생성을 중지하고 CSS파일을 서버에 요청한 후 응답받아 CSS파싱을 시작한다.
        
        ...
    ```
    
- CSSOM은 CSS의 상속을 반영하여 생성됨
    
   ![image](https://github.com/user-attachments/assets/88146b67-f63e-4b8d-962f-582f3efafc5c)


## 38.5 렌더 트리 생성

- **DOM과 CSSOM은 렌더링을 위해 렌더트리로 결합됨**
- 렌더트리
    - 렌더링을 위한 트리 구조의 자료구조
    - 브라우저 화면에 렌더링되지 않는 노드(e.g. meta태그, script 태그 등)와 CSS에 의해 비표시(e.g display : none)되는 노드들은 미포함
    → 렌더트리는 브라우저 화면에 렌더링 되는 노드만으로 구성됨
- 완성된 렌더트리는 각 HTML 요소의 레이아웃(위치와 크기)을 계산하는 데 사용되며 브라우저 화면에 픽셀을 렌더링하는 페인팅 처리에 입력됨
    ![image](https://github.com/user-attachments/assets/4807cfa0-194e-4403-9451-9ba7bd5f3875)

- 브라우저 렌더링 과정은 아래와 같은 경우 반복돼서 실행될 수 있음
    - 자바스크립트에 의한 노드 추가 or 삭제
    - 브라우저 창의 리사이징에 의한 뷰포트 크기 변경
    - HTML 요소의 레이아웃(위치, 크기)에 변경을 발생시키는 width/height, margin, padding, border, display, position, top/right/bottom/left 등의 스타일 변경
    
    <aside>
    💡 레이아웃 계산과 페인팅을 다시 실행하는 리렌더링은 비용이 많이 듦(성능에 악영향)
    → 가급적 리렌더링이 빈번하게 발생하지 않도록 주의
    
    </aside>
    
    [웹 브라우저의 렌더링](https://leo-xee.github.io/Web/browser-rendering/)
    

## 38.6 자바스크립트 파싱과 실행

- HTML 문서를 파싱한 결과물인 DOM은 HTML 요소와 스타일 등을 변경할 수 있는 프로그래밍 인터페이스로서 DOM API를 제공
→ JS 코드에서 DOM API를 사용하면 이미 생성된 DOM을 동적으로 조작 가능함
- 렌더링 엔진은 HTML을 한줄씩 파싱하며 DOM을 생성하다가 JS 파일을 로드는 script 태그나 JS 코드를 콘텐츠로 담은 script 태그를 만나면 DOM 생성을 일시 중단함 
그리고 script 태그의 src 어트리뷰트에 정의된 JS 파일을 서버에 요청하여 로드한 JS 파일이나 script 태그 내의 JS 코드를 파싱하기 위해 JS 엔진에게 제어권을 넘김
이후 JS 파싱과 실행이 종료되면 렌더링 엔진으로 다시 제어권을 넘겨 다시 HTML 파싱을 시작하여 DOM 생성을 재개함
- JS 엔진
    - 모든 JS 엔진은 ECMAScript 사양을 준수함
    - 구글의 크롬, Node.js의 V8, 파이어폭스의 SpiderMonkey, 사파이의 JavssScriptCore 등
    - JS 파싱과 실행을 처리(JS 코드를 파싱하여 CPU가 이해할 수 있는 저수준 언어로 변환 후 실행하는 역할을 함)
    - **JS 엔진은 JS를 해석하여 AST(Abstract Syntax Tree, 추상적 구문트리)를 생성 후 AST를 기반으로 인터프리터가 실행할 수 있는 중간코드인 바이트 코드를 생성, 실행**
    
    ![image](https://github.com/user-attachments/assets/767cbb45-b52f-4d5e-a6a1-920994b246d5)


`토크나이징(tokenizing)`

- 단순 문자열인 JS 코드를 어휘분석 후 문법적 의미를 갖는 코드의 최소 단위인 토큰으로 분해

`파싱(parsing)`

- 토큰의 집합을 구문 분석 후 AST(추상적 구문트리)를 생성
- AST는 토큰에 문법적 의미와 구조를 반영한 트리구조의 자료구조

`바이트코드 생성과 실행`

- 파싱의 결과물로서 생성된 AST는 인터프리터가 실행할 수 있는 중간 코드인 바이트 코드로 변환되고 인터프리터에 의해 실행

## 38.7 리플로우와 리페인트

- JS 코드에 DOM이나 CSSOM을 변경하는 DOM API가 사용된 경우 DOM이나 CSSOM이 변경됨
    
    이때 변경된 DOM과 CSSOM은 다시 렌더 트리로 결합되고 변경된 렌더트리를 기반으로 레이아웃과 페인트 과정을 거쳐 브라우저의 화면에 재렌더링함
    
    **이를 `리플로우` , `리페인트` 라 함**
    ![image](https://github.com/user-attachments/assets/9ae880ad-5273-44ef-b3c8-5247793552d2)

- 리플로우
    - 레이아웃 계산을 다시하는 것
    - 노드 추가/삭제, 요소의 크기/위치 변경, 윈도우 리사이징 등 레이아웃에 영향을 주는 변경이 발생한 경우 실행됨
- 리페인트
    - 재결합된 렌더트리를 기반으로 다시 페인트 하는 것
- 리플로우와 리페인트가 반드시 순차적으로 동시에 실행되지는 않음. 레이아웃에 영향이 없는 변경은 리페인트만 실행됨
- 예전에 리플로우와 리페인트에 대해 정리했던 자료 추가
    
    [브라우저의 렌더링 과정, 레이아웃과 리페인트](https://hotdogdev.tistory.com/64)
    

## 38.8 자바스크립트 파싱에 의한 HTML 파싱 중단

- 브라우저는 동기적으로, 순차적으로 HTML, CSS, JS 를 파싱하고 실행함 
→ 이 말은 script 태그의 위치에 따라 HTML 파싱이 블로킹되어 DOM 생성이 지연될 수 있다는 것을 의미. 즉, script 태그의 위치는 중요한 의미를 가짐
- JS 코드에서 DOM이나 CSSOM을 변경하는 DOM API 사용시 DOM이나 CSSOM이 이미 생성되어 있어야함. 그렇지 않은 경우 문제가 발생할 수 있음
- 위와 같은 문제를 회피하기 위해 body 요소의 가장 아래에 JS를 위치시키는 방법이 있음

## 38.9 script 태그의 async, defer 어트리뷰트

- JS 파싱에 의한 DOM 생성이 중단되는 문제르 근본적으로 해결하기 위해 HTML5부터 script 태그에 async와 defer 어트리뷰트가 추가됨
- async와 defer 어트리뷰트는 src 어트리뷰트를 통해 외부 JS 파일을 로드하는 경우에 사용할 수 있음(src 어트리뷰트가 없는 인라인 JS에는 사용 불가능)
- async와 defer 어트리뷰트를 사용하면 HTML 파싱과 외부 JS파일의 로드가 비동기적으로 진행되지만 JS 실행 시점에 차이가 있음
    
    ```jsx
    <script async src="extern.js"></script>
    <script defer src="extern.js"></script>
    ```
    

**`async 어트리뷰트`** 

![image](https://github.com/user-attachments/assets/1068ee20-dec4-4431-af08-3771152f1f4b)

- HTML 파싱과 외부 JS 파일의 로드가 비동기적으로 동시에 진행
- **JS의 파싱과 실행은 JS 파일의 로드가 완료된 직후 진행, 이 때 HTML 파싱이 중단됨**
- **여러 개의 script 태그에 async 어트리뷰트를 지정하면 script 태그의 순서와 상관없이 로드가 완료된 JS부터 먼저 실행됨(순서 보장 ❌)**
→ 순서 보장이 필요한 script 태그에는 async 어트리뷰트 지정 ❌❌
- async 어트리뷰트는 IE10 이상에서 지원됨

**`defer 어트리뷰트`**

![image](https://github.com/user-attachments/assets/b58028c8-02a9-4574-80a0-58a3b32e3f76)

- HTML 파싱과 외부 JS 파일의 로드가 비동기적으로 동시에 진행
- **JS의 파싱과 실행은 HTMl 파싱이 완료된 직후 진행. 즉, DOM 생성이 완료된 직후(이 때 DOMContentLoaded 이벤트가 발생함) 진행**
- **DOM 생성이 완료된 후 실행되어야할 JS에 유용**
- defer 어트리뷰트는 IE10 이상에서 지원됨(IE6~9 에서도 지원되지만 비정상적으로 동작할 수 있음)

# 39장 - DOM

- DOM은 HTMl 문서의 계층적 구조와 정보를 표현, 이를 제거할 수 있는 API를 제공하는 트리 자료구조

## 39.1 노드

### 39.1.1 HTML 요소와 노드 객체

![image](https://github.com/user-attachments/assets/ee51a095-376f-460f-99b6-f01127761808)

- HTML 요소는 HTMl 문서를 구성하는 개별적인 요소
- HTML 요소는 렌더링 엔진에 의해 파싱되어 DOM을 구성하는 요소 노드 객체로 변환
    
    이때 HTML 요소의 어트리뷰트는 어트리뷰트 노드로 HTML 요소의 텍스트 콘텐츠는 텍스트 노드로 변환됨
    
- HTML 문서는 HTML 요소들의 집합으로 이뤄지며 HTML 요소는 중첩 관계를 가짐
→ 콘텐츠 영역(시작태그와 종료태그 사이)에는 다른 HTML 요소도 포함 가능
- HTML 요소 간에는 중첩관계에 의해 계층적인 부자 관계가 형성됨. 이 관계를 반영하여 HTMl 요소를 객체화한 모든 노드 객체들을 트리자료구조로 구성

**`트리 자료구조`**

- 노드들의 계층 구조로 이뤄짐
- 부모노드와 자식노드로 구성되어 노드 간 계층적 구조를 표현하는 비선형 자료구조
- **노드 객체들로 구성된 트리자료 구조를 DOM 이라함(DOM 트리라고 부르기도 함)**

### 39.1.2 노드 객체의 타입

```html
<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
		<link rel="stylesheet" href="style.css">
	</head>
	<body>
		<ul>
			<li id="apple">Apple</li>
			<li id="banana">Banana</li>
			<li id="orange">Orange</li>
		</ul>
		<script src="app.js"></script>
	</body>
	</head>
</html>
```

- 위 HTML 문서를 렌더링 엔징이 파싱하면 아래와 같은 DOM을 생성하게됨

![image](https://github.com/user-attachments/assets/86982ea3-d43f-4317-beb2-1e70507d76c9)

- DOM은 노드객체의 계층적인 구조로 구성됨.
- 노드 객체에는 총 12개의 종류가 있고 중요한 노드 타입은 아래 4가지가 존재

**`문서 노드(document node)`** 

- DOM 트리의 최상위에 존재하는 루트노드로 document 객체를 가리킴
- document 객체는 브라우저가 렌더링한 HTML 문서 전체를 가리키는 객체로 전역 객체 window의 document 프로퍼티에 바인딩 되어있음 
→ 문서노드는 window.document or document로 참조 가능

**`요소 노드(element node)`**

- HTML 요소를 가리키는 객체
- 요소 노드는 HTML 요소 간의 중첩에 의해 부자 관계를 가지며 이를 통해 정보를 구조화 함 
→ 문서의 구조를 표현

**`어트리뷰트 노드(attribute node)`**

- HTML 요소의 어트리뷰트를 가리키는 객체
- 어트리뷰트 노드는 어트리뷰트가 지정된 HTML 요소의 요소 노드와 연결되어있음(요소 노드는 부모 노드와 연결되어있지만 어트리뷰트 노드는 요소 노드에만 연결 되어있음. 어트리뷰트 노드는 부모 노드와 연결되어있지 않으므로 요소 노드의 형제 노드는 아님)
    
    → 어트리뷰트 노드에 접근하여 어트리뷰트를 참조하거나 변경하려면 요소 노드에 접근해야함 
    

**`텍스트 노드(text node)`**

- HTML 요소의 텍스트를 가리키는 객체
- 요소 노드의 자식 노드이며 자식 노드를 가질 수 없는 리프노드(DOM 트리의 최종단)
    
    → 텍스트 노드에 접근하려면 요소 노드에 접근해야함
    

### 39.1.3 노드 객체의 상속 구조

- 노드 객체는 DOM API를 통해 자신의 부모, 형제, 자식 탐색이 가능하며 자신의 어트리뷰트와 텍스트 조작도 가능
- DOM 구성 노드 객체는 브라우저 환경에서 추가적으로 제공하는 호스트 객체
- 노드 객체도 JS 객체이므로 프로토타입에 의한 상속 구조를 가짐
- 노드 객체의 상속 구조
    
    ![image](https://github.com/user-attachments/assets/f0292ade-e4d9-46d8-abd7-4c1261e01d1b)

    - 모든 노드 객체는 Object, EventTarget, Node 인터페이스를 상속 받음
    - 거기에 추가로 문서 노드는 Document, HTMLDocument 인터페이스를, 요소 노드는 Element 인터페이스를, 어트리뷰트 노드는 Attr를, 텍스트 노드는 CharacterData 인터페이스를 각각 상속 받음
- **DOM은 HTML 문서의 계층적 구조와 정보를 표현하는 것과 노드 타입에 따라 필요한 기능을 프로퍼티와 메서드의 집합인 DOM API로 제공함 
이 DOM API를 통해 HTML 구조나 내용, 스타일 등을 동적으로 조작할 수 있음
프론트엔드 개발자는 HTML과 DOM을 연관지어 바라볼 수 있워야함**

## 39.2 요소 노드 취득

### 39.2.1 id를 이용한 요소 노드 취득

- **`Document.prototype.getElementById` 메서드 사용**
- 인수로 전달한 id 값을 갖는 하나의 요소 노드를 탐색하여 반환
- HTML 문서 내 중복된 id 값을 갖는 요소가 여러 개 있을 때 첫번째 요소 노드만 반환됨

### 39.2.2 태그 이름을 이용한 요소 노드 취득

- **`Document.prototype/Element.prototype.getElementsByTagName` 메서드 사용**
- 인수로 전달한 태그 이름을 갖는 모든 요소 노드들을 탐색하여 반환
- 여러 개의 요소 노드 객체를 갖는 DOM 컬렉션 객체인 HTMLCollection 객체를 반환(HTMLCollection 객체는 유사 배열 객체이며 이터러블)

### 39.2.3 class를 이용한 요소 노드 취득

- **`Document.prototype/Element.prototype.getElementsByClassName` 메서드 사용**
- 인수로 전달한 class 값을 갖는 모든 요소들을 탐색하여 반환
- 여러 개의 요소 노드 객체를 갖는 DOM 컬렉션 객체인 HTMLCollection 객체를 반환

### 39.24 CSS 선택자를 이용한 요소 노드 취득

- **`Document.prototype/Element.prototype.querySelector` 메서드 사용**
- 인수로 전달한 CSS 선택자를 만족시키는 하나의 요소 노드를 탐색하여 반환
- 모든 요소 노드를 탐색하여 반환하려면?
→ **`Document.prototype/Element.prototype.querySelectorAll` 메서드 사용**

✅ **`querySelector`, `querySelectorAll` 메서드는 `getElementById`, `getElementsBy***` 메서드보다 다소 느리므로 상황에 맞게 잘 사용할 것**

### 39.2.5 특정 요소 노드를 취득할 수 있는지 확인

- **`Document.prototype.matches` 메서드 사용**
- 인수로 전달한 CSS 선택자를 통해 특정 요소 노드를 취득할 수 있는지 확인
- 이벤트 위임을 사용할 때 유용

### 36.2.6 HTMLCollection과 NodeList

- 둘다 유사 배열이며 이터러블
→ `for ... of문` 으로 순회 가능, `스프레드 문법` 을 통해 배열로 변환 가능
- **둘다 노드 객체의 상태 변화를 실시간으로 반영하는 살아있는 객체**

**`HTMLCollection`**

- 실시간으로 노드 객체의 상태 변경을 반영하여 요소를 제거할 수 있으므로 `for문` 으로 순회하며 노드 객체의 상태를 변경해야할 때 주의할 것
    
    **→ `HTMLCollection` 객체를 배열로 변환하여 사용하면 간단하게 해결됨**
    

**`NodeList`**

- 실시간으로 노드 객체의 상태 변경을 반영하지 않는 객체
- **대부분의 경우** 노드 객체의 상태 변경을 실시간으로 반영하지 않고 과거의 정적 상태를 유지하는 **non-live 객체로 동작함**
- **childNodes 프로퍼티가 반환하는 NodeList 객체는 HTMLCollection 객체처럼 실시간으로 노드 객체의 상태 변경을 반영하는 live 객체로 동작하므로 주의할 것**
- **HTMLCollection 객체처럼 배열로 변환하여 사용하는 것을 권장**

## 39.3 노드 탐색

- 요소 노득 취득 후 요소 노드를 기점으로 DOM 트리의 노드를 옮겨 다니며 부모, 형제, 자식 노드를 탐색 해야할 때가 있음 
→ DOM 트리 상의 노드를 탐색할 수 있도록 Node, Element 인터페이스는 트리 탐색 프로퍼티를 제공함
    
    ![image](https://github.com/user-attachments/assets/b6b74447-11b4-4328-9226-7eb96992b99d)


## 39.4 노드 정보 취득

- 노드 객체에 대한 정보를 취득하려면 노드 정보 프로퍼티를 사용
    
    
    | 프로퍼티 | 설명 |
    | --- | --- |
    | Node.prototype.nodeType | 노드 타입을 나타내는 상수 반환 
    |                        |- Node.ELEMENT_NODE : 요소 노드 타입을 나타내는 상수 1 반환
    |                        |- Node.TEXT_NODE : 텍스트 노드 타입을 나타내는 상수 3 반환
   |                        | - Node.DOCUMENT_NODE : 문서 노드 타입을 나타내는 상수 9 반환 |
    | Node.prototype.nodeName | 노드의 이름을 문자열로 반환
   |                        | - 요소 노드 : 대문자 문자열로 태그 이름 반환(”UL”, “LI” 등)
    |                        |- 텍스트 노드 : 문자열 “#text” 를 반환
    |                        |- 문서 노드 : 문자열 “#document”를 반환 |

## 39.6 DOM 조작

- 새로운 노드 생성 후 DOM에 추가하거나 기존 노드를 삭제 or 교체하는 것
- DOM 조작에 의해 DOM에 새로운 노드가 추가 or 삭제 되면 리플로우와 리페인트가 발생
    
    → 복잡한 콘텐츠를 다루는 DOM 조작은 성능 최적화를 위해 주의해야함
    

### 39.6.1 innerHTML

- `Element.prototype.innerHTML` 프로퍼티는 setter과 getter이 모두 존재하는 접근자 프로퍼티 
→ 요소 노드의 HTML 마크업을 취득 or 변경 가능
- HTML 마크업이 포함된 문자열을 그대로 반환
- 장점
    - 구현이 간단하고 직관적임
- 단점
    - 크로스 사이트 스크립팅 공격에 취약
    - 요소 노드의 innerHTML 프로퍼티에 HTML 마크업 문자열을 할당할 경우 요소 노드의 모든 자식 노드를 제거하고 할당한 HTML 마크업 문자열을 파싱하여 DOM을 변경

### 39.6.2 insertAdjacentHTML 메서드

- `Element.prototype.insertAdjacentHTML(posirion, DOMString)` 메서드는 기존 요소를 제거하지 않으면서 위치를 지정해 새로운 요소를 삽입
- innerHTML 프로퍼티보다 효율적이고 빠름
- innerHTML 프로퍼티와 마찬가지로 HTML 마크업 문자열을 파싱하므로 크로스 사이트 스크립팅 공격에 취약

### 39.6.3 노드 생성과 추가

**`요소 노드 생성`**

- **`Document.prototype.createElement(tagName)` 메서드는 요소 노드를 생성하여 반환**
- `createElement` 메서드는 요소 노드를 생성할 뿐 DOM에 추가하지는 않음(추가하는 처리가 별도로 필요)
- `createElement` 메서드로 생성한 요소 노드는 아무런 자식 노드를 가지지 않음

**`텍스트 노드 생성`**

- **`Document.prototype.createTextNode(text)` 메서드는 텍스트 노드를 생성하여 반환**
- `createTextNode` 메서드로 텍스트 노드를 생성할 뿐 DOM에 추가하지는 않음(추가하는 처리가 별도로 필요)
- `createTextNode` 메서드로 생성한 텍스트 노드는 요소의 노드의 자식 노드로 추가 되지 않음

🤫 💭 노드 이동, 복사, 교체, 삭제 등 많은 설명이 있지만 정리는 생략!

## 39.7 어트리뷰트

### 39.7.1 어트리뷰트 노드와 attributes 프로퍼티

- HTML 요소는 여러 개의 어트리뷰트를 가질 수 있음
- HTML 어트리뷰트는 HTML 요소의 시작 태그에 `어트리뷰트 이름=”어트리뷰트 값”` 형식으로 정의
- HTML 문서가 파싱될 때 HTML 요소의 어트리뷰트는 어트리뷰트 노드로 변환되어 요소 노드와 연결됨. 이때 HTML 어트리뷰트당 하나의 어트리뷰트 노드가 생성됨
모든 어트리뷰트 노드의 참조는 유사배열 개체이자 이터러블인 `NameNodeMap` 객체에 담겨서 요소 노드의 attributes 프로퍼티에 저장됨

### 39.7.2 HTML 어트리뷰트 조작

- **`Element.prototype.getAttribute/setAttribute`** 메서드를 사용해 attributes 프로퍼티를 통하지 않고 요소 노드에서 직접 HTML 어트리뷰트 값을 취득 or 변경 가능
- **`Element.prototype.hasAttribute(arrtibuteName)`** 메서드를 통해 특정 HTML 어트리뷰트가 존재하는지 확인 가능
- **`Element.prototype.removeAttribute(arrtibuteName)`** 메서드를 통해 특정 HTML 어트리뷰트 삭제 가능

### 39.7.3 HTML 어트리뷰트 VS DOM 프로퍼티

- 요소 노드 객체에는 HTML 어트리뷰트에 대응하는 프로파티(DOM 프로퍼티)가 존재
- DOM 프로퍼티들은 HTML 어트리뷰트 값을 초기값으로 가짐
- DOM 프로퍼티는 setter와 getter 모두 존재하는 접근자 프로퍼티로 참조와 변경이 가능
- **HTML 어트리뷰트는 DOM에서 중복 관리 되는 것으로 보이지만 그렇지 않음**
    - HTML 어트리뷰트의 역할
        - HTML 요소의 초기 지정하는 것
        → HTML 어트리뷰트 값은 HTML 요소의 초기 상태를 의미. 변하지 않음
    - **요소 노드는 상태를 가지고 있고 초기 상태와 최신 상태를 관리해야함. 
    → 초기 상태는 어트리뷰트 노드가 관리
    → 사용자가 입력한 최신 상태는 HTML 어트리뷰트에 대응하는 요소노드의 DOM 프로퍼티가 관리함.**

## 39.8 스타일

### 39.8.1 인라인 스타일 조작

**`HTMLElement.prototype.style`** 프로퍼티는 setter와 getter 모두존재하는 접근자 프로퍼티로 요소 노드의 **인라인 스타일**을 취득 or 추가 or 변경함

### 39.8.3 요소에 적용되어 있는 CSS 스타일 참조

- 클래스를 적용한 스타일이나 상속을 통해 암묵적으로 적용된 스타일은 style 프로퍼티로 참조 불가능
- **`window.getComputedStyle(element[, pseudo])`** 메서드를 통해 HTMl 요소에 적용되어있는 모든 CSS 스타일 참조 가능
    - 첫번째 인수로 전달한 요소 노드에 적용되어있는 평가된 스타일(최종적으로 적용된 스타일)을 CSSStyleDeclaration 객체에 담아 반환
    - 두번째 인수로 :after, :before와 같은 의사요소를 지정하는 문자열 전달 가능.

## 39.9 DOM 표준

- 2018년 4월부터 구글, 애플, 마이크로소프트, 모질라로 구성된  4개의 주류 브라우저 벤더사가 주도하는 WHATWG이 단일 표준을 내놓음
- DOM 버전
| 레벨 | 표준 문서 URL |
| --- | --- |
| DOM Level 1 | https://www.w3.org/TR/REC-DOM-Level-1 |
| DOM Level 2 | https://www.w3.org/TR/DOM-Level-2-Core/ |
| DOM Level 3 | https://www.w3.org/TR/DOM-Level-3-Core/ |
| DOM Level 4 | https://dom.spec.whatwg.org/ |
