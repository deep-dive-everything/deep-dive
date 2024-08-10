# Morden JavaScript Deep Dive

Dasom, 2024.08.04

## 42장 비동기 프로그래밍

> 자바스크립트 엔진은 단 하나의 실행 컨텍스트를 갖는다. (하나의 태스크만 실행할 수 있는 싱글 스레드 방식)
>
> 따라서 처리에 시간이 걸리는 태스크를 실행하면 블로킹(작업중단)이 발생하고, 이렇게 기다린 후 실행하는 것을 "동기 처리"라고 한다.

### 이벤트 루프와 태스크 큐

* 타이머 함수인 setTimeout, setInterval, HTTP요청, 이벤트 핸들러는 비동기처리 방식으로 동작함

실행 컨텍스트가 하나인 자바스크립트가 **비동기적으로 처리할 수 있는 이유**는?

* 자바스크립트 엔진
  * 콜 스택과 힙으로 구성됨
  * 단순히 태스크가 요청되면 콜 스택을 통해 요청된 작업을 순차적으로 실행함
* 브라우저 혹은 Node.js
  * 태스크 큐와 이벤트 루프를 제공
  * 태스크 큐:비동기 함수의 콜백 함수 혹은 이벤트 핸들러가 일시적으로 보관
  * 이벤트 루프: 콜 스택과 태스크 큐를 확인하고, 콜 스택이 비어있고 태스크 큐에 대기 중인 함수ㅏㄱ 있다면 이벤트 루프는 FIFO 방식으로 대기 중인 함수를 콜 스택으로 이동 시킴
* 즉, 자바스크립트 엔진은 싱글 스레드로 동작하지만 브라우저는 멀티 스레드로 동작함 



## 43장 Ajax

> Ajax(Asynchronous JavaScript and XML)란, 자바스크립트를 사용해 서버와 비동기적으로 데이터를 주고받는 프로그래밍 방식이다.
>
> 과거의 웹페이지는 완전한 HTML을 매번 재렌더링 했다면, Ajax의 등장으로 필요한 데이터만 비동기 방식으로 웹페이지를 변경할 수 있게 했다.

### JSON(JavaScript Object Notation)

**JSON이란**

* 클라이언트와 서버 간 HTTP 통신을 위한 텍스트 데이터 포맷
* 언어 독립형 데이터 포맷으로, 대부분의 프로그래밍 언어에서 사용 가능

**JSON 표기 방식**

```js
{
  "key1": "Value",
  "key2": 0,
  "key3": ["keys", "must", "with", "double quotes", "not single"]
}
```

**JSON의 직렬화와 역직렬화**

* `JSON.stringfiy()`
  * 객체를 JSON 포맷의 문자열로 변환
  * 클라이언트가 서버로 객체를 전송하기 위해 사용 (직렬화)
* `JSON.parse()`
  * JSON 포맷의 문자열을 객체로 변환
  * 서버로부터 받은 데이터를 사용하기 위해 객체화하는 것을 역직렬화라고 함



### XMLHttpRequest

>  `XMLHttpRequest`는 자바스크립트에서 Ajax를 구현하기 위한 전통적인 방법으로, 웹 브라우저가 서버와 비동기적으로 데이터를 주고받을 수 있게 해주는 객체

#### 1. XMLHttpRequest 객체 생성

```javascript
const xhr = new XMLHttpRequest();
```

#### 2. 요청 준비

`XMLHttpRequest` 객체의 `open()` 메서드를 사용해 서버에 요청할 방법(HTTP 메서드)과 URL을 설정

이 과정에서는 요청의 방식(GET, POST 등), 요청할 URL, 비동기 여부를 설정 가능

```javascript
xhr.open('GET', 'https://api.example.com/data', true);
```

- `true`: 비동기 요청 여부를 설정

#### 3. 요청 보내기

`send()` 메서드를 사용해 서버로 요청을 보내

```javascript
xhr.send();
```

#### 4. 서버 응답 처리

서버로부터 응답이 도착하면, 이를 처리하기 위해 `onreadystatechange` 이벤트 핸들러를 사용`readyState`와 `status` 속성을 활용해 응답이 성공적으로 도착했는지 확인하고, 응답 데이터를 처리

```javascript
xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
            // 요청이 성공했을 때 실행될 코드
            console.log(xhr.responseText);
        } else {
            // 요청이 실패했을 때 실행될 코드
            console.error('Request failed with status:', xhr.status);
        }
    }
};
```

- ```
  readyState
  ```

  : 요청의 현재 상태를 나타내며, 0에서 4까지의 값을 가짐

  - `0 (UNSENT)`: 객체가 생성되었지만, 아직 `open()` 메서드가 호출되지 않은 상태
  - `1 (OPENED)`: `open()` 메서드가 호출된 상태
  - `2 (HEADERS_RECEIVED)`: 서버가 요청을 수신하고 응답 헤더를 받은 상태
  - `3 (LOADING)`: 서버 응답 중 일부를 받는 중인 상태
  - `4 (DONE)`: 전체 응답이 도착한 상태

- `status`: HTTP 응답 상태 코드를 나타내며, 200은 성공, 404는 리소스를 찾을 수 없음, 500은 서버 오류 등을 의미

- `responseText`: 서버에서 반환된 응답 데이터를 문자열로 반환

#### 5. 요청 헤더 설정

POST 요청을 보낼 때는 데이터의 형식을 서버에 알리기 위해 `setRequestHeader()` 메서드를 사용해 요청 헤더를 설정할 수 있음

```javascript
xhr.setRequestHeader('Content-Type', 'application/json');
```

#### 6. 요청 취소

요청을 취소하고 싶다면 `abort()` 메서드를 사용

```javascript
xhr.abort();
```



## 44장 REST API

> REST(Representational State Transfer)는 웹 서비스 아키텍처의 한 스타일로, 주로 HTTP 프로토콜을 사용해 자원을 주고받는 데 사용된다. REST API는 이러한 REST 원칙을 따르는 API를 의미하며, 기본 원칙을 잘 지킨 서비스 디자인을 RESTful API라고도 부른다.

**REST API의 구성**

* 자원
  * URI(엔드포인트)로 표현
* 행위
  * HTTP 요청 메서드로 표현
* 표현
  * 페이로드로 표현

cf. **RESTful API 설계 원칙**

​	RESTful API를 설계할 때는 자원의 식별, 표현, 상태 전이, 무상태성(statelessness), 캐시 가능성 등의 원칙을 따르는 것이 중요함



## 느낀점

지금까지 다뤄온 주제 중 가장 실무와 맞닿아있고, 자주 실수를 하는 부분이 아닐까 한다. 그래서 읽으면서 다시 한 번 개념을 정리할 수 있어 좋았다.

특히, REST API는 거의 매일 사용을 하면서도, REST API가 뭐냐 라고 하면 답변하기 어려웠는데 이번에야 말로 확실히 외울 수 있을 것 같다.

개인 사정으로 좋은 주제가 나온 스터디에 불참하게 되어 아쉬울 뿐이다.



