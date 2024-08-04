# 42장 - 비동기 프로그래밍

## 42.1 동기 처리와 비동기 처리

- 함수가 실행되려면 `함수 코드 평가 과정`에서 생성된 함수 실행 컨텍스트가 실행 컨텍스트 스택에 푸시되어야함
- 즉, 실행 컨텍스트 스택에 함수 실행 컨텍스트가 푸시되는 것은 바로 함수 실행의 시작을 의미
- 함수가 호출된 순서대로 순차적으로 실행되는 이유
→ 함수가 호출된 순서대로 함수 실행 컨텍스트가 실행 컨텍스트 스택에 푸시되기 때문
- 함수의 실행 순서는 실행 컨텍스트 스택으로 관리함
- JS 엔진은 단 하나의 실행 컨텍스트 스택을 가짐
    
    → 동시에 2개 이상의 함수를 실행할 수 없다는 것을 의미
    
- JS 엔진은 한 번에 하나의 태스크만 실행할 수 있는 싱글 스레드 방식으로 동작
- 싱글 스레드 방식
    - 한 번에 하나의 태스크만 실행할 수 있기 때문에 처리에 시간이 걸리는 태스크를 실행하는 경우 `블로킹(작업 중단)` 이 발생
    
    ```jsx
    // sleep 함수는 일정 시간(delay) 경과 후 콜백 함수(func)를 호출
    function sleep(func, delay){
    	const delayUntil = Date.now() + delay;
    	 // 현재 시간(Date.now())에 delay를 더한 delayUntil이 현재 시간보다 작으면
    	 // 계속 반복
    	 while(Date.now() < delayUntil);
    	 // 일정 시간(delay) 경과 후 콜백 함수(func)를 호출
    	 func();
    }
    
    function foo(){
    	console.log('foo');
    }
    
    function bar(){
    	console.log('bar');
    }
    
    // sleep 함수는 3초 이상 실행됨
    sleep(foo, 3*1000);
    // bar 함수는 sleep 함수의 실행이 종료된 후에 호출됨 -> 3초 이상 블로킹됨
    bar();
    
    // (3초 경과 후) foo 호출 -> bar 호출
    ```
    
- bar 함수는 sleep 함수의 실행이 종료된 후 호출되므로 3초 이상(foo 함수의 실행 시간 + 3초) 호출되지 못하고 블로킹됨
- 이렇게 현재 실행 중인 태스크가 종료될 때까지 다음에 실행될 태스크가 대기하는 방식이 **`동기처리`**
- 동기처리
    - 장점 : 태스크를 순서대로 하나씩 처리하므로 실행순서가 보장됨
    - 단점 : 앞의 태스크가 종료될 때까지 이후 태스크들이 블로킹됨

**✅ setTimeout 사용해서 비동기 처리**

```jsx
function foo(){
	console.log('foo');
}

function bar(){
	console.log('bar');
}

// 타이머 함수 setTimeout은 일정 시간이 경과한 이후 콜백함수 foo를 호출
// setTimeout은 bar 함수를 블로킹하지 않음 
```

- **`setTimeout`** 함수는 **`sleep`** 함수와 유사하게 일정 시간이 경과한 이후 콜백함수를 호출하지만 **`setTimeout` 함수 이후 태스크를 블로킹하지 않고 곧바로 실행함**
- 이처럼 현재 실행 중인 태스크가 종료되지 않은 상태여도 다음 태스크를 곧바로 실행하는 방식이 **`비동기처리`**
- 비동기처리
    - 장점 : 블로킹이 발생하지 않음
    - 단점 : 태스크의 실행 순서가 보장되지 않음
- **타이머 함수인 `setTimeout`과 `setInterval`, `HTTP 요청`, `이벤트 핸들러`는 비동기 처리 방식으로 동작**

## 42.2 이벤트 루프와 태스크 큐

- 싱글 스레드 방식은 한 번에 하나의 태스크만 처리할 수 있지만 브라우저가 동작하는 걸 보면 많은 태스크가 동시에 처리되는 것 처럼 느껴짐
- HTML 요소가 애니메이션 효과를 통해 움직이면서 이벤트를 처리하는 것처럼 JS의 동시성을 지원하는 것이 **이벤트 루프**

    ![image](https://github.com/user-attachments/assets/51a5b556-1f41-4281-9381-6b98110572e4)
    
- 이벤트 루프는 브라우저에 내장되어있는 기능
- 대부분의 JS 엔진은 크게 두개의 영역으로 구분(콜스택과 힙)
    - 콜 스택(call stack)
        - 소스코드 평가과정에서 생성된 실행 컨텍스트가 추가되고 제거되는 스택 자료구조인 실행 컨텍스트 스택
        - 함수를 호출하면 함수 실행 컨텍스트가 순차적으로 콜 스택에 푸시되어 순차적으로 실행됨
    - 힙(heap)
        - 객체가 저장되는 메모리 공간
        - 콜 스택의 요소인 실행 컨텍스트는 힙에 저장된 객체를 참조함
        - 메모리에 값을 저장하려면 먼저 값을 저장할 메모리 공간의 크기를 결정해야함 
        객체는 크기가 정해져있지않으므로 할당해야할 메모리 공간의 크기를 런타임에 결정(동적 할당)해야함
        → 힙은 구조화되어있지 않음
- 콜스택과 힙으로 구성되어있는 JS 엔진은 단순히 태스크가 요청되면 콜스택을 통해 요청된 작업을 순차적으로 실행
- 비동기 처리에서 소스코드의 평가와 실행을 제외한 모든 처리는 JS 엔진을 구동하는 환경인 브라우저 또는 Node.js가 담당
    
    → 이를 위해 브라우저는 태스크 큐와 이벤트 루프를 제공
    

**`태스크 큐(task queue/event queue/callback queue)`**

- setTimeout이나 setInterval과 같은 비동기 함수의 콜백 함수 또는 이벤트 핸들러가 일시적으로 보관되는 영역

**`이벤트 루프(event loop)`**

- 콜 스택에 현재 실행중인 실행 컨텍스트가 있는지, 태스크 큐에 대기중인 함수(콜백함수, 이벤트 핸들러 등)가 있는지 반복해서 확인
- 만약 **콜스택이 비어있고 태스크 큐에 대기 중인 함수가 있다면 이벤트 루프는 순차적으로 태스크 큐에 대기 중인 함수를 콜 스택으로 이동시키는데 이 때 콜스택으로 이동한 함수는 실행됨**
→ 태스크 큐에 일시 보관된 함수들은 비동기 처리방식으로 동작
- 비동기 함수인 setTimeout의 콜백함수는 태스크 큐에 푸시되어 대기하다가 콜 스택이 비게되면(전역 코드 및 명시적으로 호출된 함수가 모두 종료하면) 콜스택에 푸시되어 실행됨
- **JS는 싱글 스레드 방식으로 동작
싱글 스레드방식으로 동작하는 것은 브라우저가 아니라 브라우저에 내장된 JS 엔진임!(브라우저 ❌)
만약 모든 JS 코드가 JS 엔진에서 싱글스레드방식으로 동작한다면 JS는 비동기로 동작할 수 없음
→ `JS 엔진은 싱글스레드로 동작하지만 브라우저는 멀티 스레드로 동작`**

 ****

# 43장 - Ajax(Asynchroonous JavaScript and XML)

## 43.1 Ajax란?

- JS를 사용하여 브라우저가 서버에게 비동기 방식으로 데이터를 요청, 서버가 응답한 데이터를 수신하여 웹페이지를 동적으로 갱신하는 프로그래밍 방식
- 브라우저에서 제공하는 Web API인 XMLHttpRequest 객체를 기반으로 동작
- XMLHttpRequest는 HTTP 비동기 통신을 위한 메서드와 프로퍼티를 제공
- Ajax 등장 전 웹페이지는 html 태그로 시작해서 html 태그로 끝나는 완전한 HTML을 서버로부터 전송받아 웹페이지 전체를 처음부터 다시 랜더링하는 방식으로 동작

![image](https://github.com/user-attachments/assets/3d0f53e1-567c-4844-87b5-fcb6e6fa68a6)

- 전통적인 방식의 단점
    - 변경할 필요가 없는 부분까지 포함된 완전한 HTML을 서버로부터 매번 재전송받기 때문에 불필요한 데이터 통신이 발생
    - 변경할 필요가 없는 부분까지 처음부터 다시 렌더링하기 때문에 화면 전환이 일어나면 화면이 순간적으로 깜빡이는 현상 발생
    - 클라이언트와 서버와의 통신이 동기 방식으로 동작하기 때문에 서버로부터 응답이 있을 때까지 다음 처리가 블로킹됨

![image](https://github.com/user-attachments/assets/645d3816-16e8-4f9e-b70b-9cca6d00d202)

- Ajax의 장점
    - 변경할 부분을 갱싱하는데 필요한 데이터만 서버로부터 전송받기 때문에 불필요한 데이터 통신이 발생하지 않음
    - 변경할 필요가 없는 부분은 재렌더링 ❌ 
    → 화면이 순간적으로 깜빡이는 현상 발생 ❌
    - 클라이언트와 서버와의 통신이 비동기방식으로 동작하기 때문에 서버에게 요청 보낸 후 블로킹 발생 ❌

## 43.2 JSON

- 클라이언트와 서버 간의 HTTP 통신을 위한 텍스트 데이터포맷
- JS에 종속되지 않는 언어 독립형 데이터 포맷으로 대부분이 프로그래밍 언어에서 사용 가능

### 43.2.1. JSON 표기 방식

```jsx
// JSON 예시
{
	"name":"Park",
	"alive":true,
	"age":30,
	"hobby":["traveling","tennis"]
}
```

- JS의 객체 리터럴과 유사하게 키와 값으로 구성된 순수한 텍스트
- JSON의 키는 큰따옴표로 묶어야함(작은 따옴표 사용❌)
- 값은 객체 리터럴과 같은 표기법이 사용 가능하지만 문자열은 반드시 큰따옴표로 묶어야함

### 43.2.2 JSON.stringify

- `JSON.stringify` 메서드는 객체를 JSON 포맷의 문자열로 변환함
- 클라이언트가 서버로 객체를 전송하려면 객체를 문자열화 해야하는데 이게 바로 직렬화(serializing)
- `JSON.stringify` 메서드는 배열도 JSON 포맷의 문자열로 변환함

### 43.2.3 JSON.parse

- `JSON.parse` 메서드는 JSON 포맷의 문자열을 객체로 변환함
- 서버로부터 클라이언트에게 전송된 JSON데이터는 문자열
→ 이 문자열을 객체로서 사용하려면 JSON 포맷의 문자열을 객체화해야하는데 이게 바로 역직렬화(deserializing)
- 배열이 JSON 포맷의 문자열로 변환되어 있는 경우 `JSON.parse`는 문자열을 배열 객체로 변환함
(배열요소가 객체인 경우 배열의 요소까지 객체로 변환)

## 43.3 XMLHttpRequest

- 브라우저는 주소창이나 HTML의 form 태그 or a 태그를 통해 HTTP 요청 전송 기능을 기본 제공함
- JS를 사용해서 HTTP 요청을 전송하려면 XMLHttpRequest 객체를 사용함
- Web API인 XMLHttpRequest 객체는 HTTP 요청 전송과 HTTP 응답 수신을 위한 다양한 메서드와 프로퍼티를 제공

### 43.3.1 XMLHttpRequest 객체생성

```jsx
// XMLHttpRequest 객체 생성예시
const xhr = new XMLHttpRequest();
```

- XMLHttpRequest객체는 XMLHttpRequest 생성자 함수를 호출하여 생성
- XMLHttpRequest 객체는 브라우저에서 제공하는 Web API → 브라우저 환경에만 정상적으로 실행됨

### 43.3.2 XMLHttpRequest 객체의 프로퍼티와  메서드

`XMLHttpRequest 객체의 프로토타임 프로퍼티`

| 프로포타입 프로퍼티 | 설명 |
| --- | --- |
| XMLHttpRequest  | HTTP 요청의 현재 상태를 나타내는 정수.|
|                 | - UNSENT : 0|
|                 |- OPENED : 1|
|                 |- HEADERS_RECEIVED : 2|
|                 |- LOADING : 3|
|                 |- DONE : 4 |
| XMLHttpRequest  | HTTP 요청에 대한 응답상태(HTTP 상태코드)를 나타내는 정수 e.g. 200 |
| statusText | HTTP 요청에 대한 응답 메세지를 나타내는 문자열 e.g. “OK” |
| responseType | HTTP 응답타입 |
| response | HTTP 요청에 대한 응답 몸체. responseType에 따라 타입이다르다 |
| responseText | 서버가 전송한 HTTP 요청에 대한 응답 문자열 |

**`XMLHttpRequest 객체의 이벤트 핸들러 프로퍼티`**

| 이벤트 핸들러 프로퍼티 | 설명 |
| --- | --- |
| onreadystatechange | readyState 프로퍼티 값이 변경된 경우 |
| onloadstart | HTTP 요청에 대한 응답을 받기 시작한 경우 |
| onprogress | HTTP 요청에 대한 응답을 받는 도중 주기적으로 발생 |
| onabort | abort 메서드에 의해 HTTP 요청이 중단된 경우 |
| onerror | HTTP 요청에 에러가 발생한 경우 |
| onload | HTTP 요청이 성공적으로 완료한 경우 |
| ontimeout | HTTP 요청 시간이  초과한 경우 |
| onloadend | HTTP 요청이 완료한 경우. HTTP 요청이 성공 or 실패하면 발생 |

**`XMLHttpRequest 객체의 메서드`**

| 메서드 | 설명 |
| --- | --- |
| open | HTTP 요청 초기화 |
| send | HTTP 요청 전송 |
| abort | 이미 전송된 HTTP 요청 중단 |
| setRequestHeader | 특정 HTTP 요청 헤더의 값을 설정  |
| getResponseHeader | 특정 HTTP 요청 헤더의 값을 문자열로 변환 |

**`XMLHttpRequest 객체의 정적프로퍼티`** 

| 정적 프로퍼티 | 값 | 설명 |
| --- | --- | --- |
| UNSENT | 1 | open 메서드 호출 이전 |
| OPENED  | 2 | open 메서드 호출 이후 |
| HEADERS_RECEIVED  | 3 | send 메서드 호출 이후 |
| LOADING  | 4 | 서버 응답 중(응답 데이터 미완성 상태) |
| DONE  | 5 | 서버 응답 완료 |

### 43.3.3 HTTP 요청 전송

- HTTP 요청을 전송하는 경우 순서
    1. XMLHttpRequest.prototype.open 메서드로 HTTP 요청을 초기화
    2. 필요에 따라 XMLHttpRequest.prototype.setRequestHeader 메서드로 특정 HTTP 요청의 헤더 값을설정
    3. XMLHttpRequest.prototype.send 메서드로 HTTP 요청을 전송
        - HTTP 요청 메서드가 GET 인 경우 send 메서드에 페이로드로 전달한 인수는 무시되고 요청 몸체는 null로 설정됨
    
    ```jsx
    // 예시
    // XMLHttpRequest 객체생성
    const xhr = new XMLHttpRequest();
    // HTTP 요청 초기화
    xhr.open('GET', '/users');
    // HTTP 요청 헤더 설정
    // 클라이언트가 서버로 전송할 데이터의 MIME 타입지정 : json
    xhr.setRequestHeader('content-type', 'appllication/json');
    // HTTP 요청 전송
    xhr.send();
    ```
    

## 43.3.4 HTTP 응답처리

- 서버가 전송한 응답을 처리하면 XMLHttpRequest 객체가 발생시키는 이벤트를 캐치해야함
- XMLHttpRequest가 가진 이벤트 핸들러 프로퍼티 중 HTTP 요청의 현재 상태를 나타내는 readyState 프로퍼티 값이 변경된 경우 발생하는 **`readystatechange`** 이벤트를 캐치하여 HTTP 응답 처리 가능
    
    ```jsx
    // readystatechanage로 응답 처리하는 예시
    // XMLHttpRequest 객체 생성
    const xhr = new XMLHttpRequest();
    // HTTP 요청 초기화
    xhr.open('GET', 'https://jsonplaceholer.typicode.com/todos/1');
    // HTTP 요청 전송 
    xhr.send();
    // readystatechanage이벤트는 HTTP 요청의 현재상태를 나타내는 
    // readyState 프로퍼티가 변경될 때마다 실행
    xhr.onreadystatechange = () => {
    	// readyState 프로퍼티는 HTTP 요청의 현재 상태를 나타냄
    	// readyState 프로퍼티는 값이 4가 아니면 서버 응답이 완료되지 않은 상태
    	// 만약 서버 응답이 완료되지 않았다면아무런 처리를 하지 않음
    	if(xhr.readyState !== XMLHttpRequest.DONE) return;
    	// status 프로퍼티는 응답 상태 코드를 나타냄
    	// 200이면 정상 200이 아니면 에러가 발생한 상태
    	// 정상적으로 응답된 상태라면 response 프로퍼티에 서버의 응답 결과가 담겨있음
    	if(xhr.status === 200){
    		console.log(JSON.parse(xhr.response));
    		// {userId:1, id:1, title:"delectus aut autem", completed:false}
    	} else{
    		console.error('Error', xhr.status, xhr.statusText);
    	}
    }
    ```
    

# 44장 - REST API

- REST(REpresentational State Transfer)
    - 아파치 HTTP 서버 프로젝트의 공동 설립자인 로이 필딩의 2000년 논문에서 처음 소개됨
    - HTTP를 기반으로 클라이언트가 서버의 리소스에 접근하는 방식을 규정한 아키텍처
    - REST API는 REST를기반으로 서비스 API를 구현한 것을 뜻함.
    - REST의 기본 원칙을 성실히 지킨 서비스 디자인을 RESTful이라고 표현

## 44.1 REST API의 구성

- REST API는 자원, 행위, 표현 3가지 요로소 구성됨
- REST는 자체 표현 구조로 구성되어 REST API만으로 HTTP 요청의 내용 이해 가능
    
    
    | 구성요소 | 내용 | 표현방법 |
    | --- | --- | --- |
    | 자원 | 자원 | URI(엔드포인트) |
    | 행위 | 자원에 대한 행위 | HTTP 요청메서드 |
    | 표현 | 자원에 대한 행위의 구체적 내용 | 페이로드 |

## 44.2 REST API의 설계 원칙

- REST에서 가장 중요한 설계 원칙 두 가지
    - **URI는 리소스를 표현**하는데 집중하고,
    - **행위에 대한 정의는 HTTP 요청 메서드**를 통해 하는것
- URI는 리소스를 표현해야한다.
    - URI는 리소스를 표현하는 데 중점을 두어야함
    - 리소스를 시별할 수 있는이름은 동사보다는 명사를 사용한다.
        
        → 이름에 get 같은 행위에 대한 표현이 들어가서는 안됨 
        
- 리소스에 대한 행위는 HTTP 요청 메서드로 표현
    - HTTP 요청 메서드는 클라이언트가 서버에게 요청의 종류와 목적(리소스에 대한 행위)을 알리는 방법
    - 리소스에 대한 행위는 URI에 표현하지 않음
    - 주로 5가지 요청 메서드를사용하여 CRUD를 구현함
    
    | HTTP 요청메서드 | 종류 | 목적 | 페이로드 |
    | --- | --- | --- | --- |
    | GET | index/retrieve | 모든/특정 리소스 취득 | ❌ |
    | POST | create | 리소스 생성 | ⭕ |
    | PUT | replace | 리소스의 전체 교체 | ⭕ |
    | PATCH | modify | 리소스의 일부 수정 | ⭕ |
    | DELETE | delete | 모든/특정 리소스삭제 | ❌ |
