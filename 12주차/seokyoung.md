## 42장 비동기 프로그래밍

### 42.1 동기 처리와 비동기 처리

- 함수를 호출하면 함수 코드가 평가되어 함수 실행 컨텍스트 생성
- 생성된 함수 실행 컨텍스트는 실행 컨택스트 스택(콜 스택)에 푸시되고 함수 코드 실행
- 함수 코드의 실행이 종료하면 함수 실행 컨택스트는 실행 컨택스트 스택에서 팝되어 제거

- 실행 컨택스트 스택에 함수 실행 컨택스트가 푸시되는 것은 바로 함수 실행의 시작을 의미
- 함수가 호출한 순서대로 순차적으로 실행되는 이유 호출한 순서대로 함수 실행 컨텍스트가 실행 컨텍스트 스택에 푸시되기 때문이다.
- 함수의 실행 순서는 실행 컨텍스트 스택으로 관리한다.
- 자바스크립트 엔진은 단 하나의 실행 컨텍스트를 갖는다. 이는 동시에 2개 이상의 함수를 동시에 실행할 수 없다는 것을 의미한다.
- 자바스크립트 엔진은 한 번에 하나의 태스크만 실행할 수 있는 싱글 스레드 방식으로 동작한다.
- 한 번에 하나의 태스크만 실행할 수 있기 때문에 처리에 걸리는 태스크를 실행하는 경우 블로킹(작업 중단)이 발생한다.

#### 동기(synchronous) 처리

- 현재 실행 중인 태스크가 종료할 때까지 다음에 실행할 태스크가 대기하는 방식을 동기 처리라고 한다.
- 동기 처리 방식은 태스크를 순서대로 하나씩 처리하므로 실행 순서가 보장된다는 장점이 있지만
- 앞선 태스크가 종료할 때까지 이후 태스크들이 블로킹된다는 단점이 있다.

#### 비동기(asynchronous) 처리

- 현재 실행 중인 태스크가 종료되지 않은 상태라 해도 다음 태스크를 곧바로 실행하는 방식을 비동기 처리라고 한다.
- 비동기 처리 방식은 현재 실행 중인 태스크가 종료되지 않은 상태라 해도 다음 태스크를 곧바로 실행하므로 블로킹이 발생하지 않는다는 장점이 있지만
- 태스크의 실행 순서가 보장되지 않는 단점이 있다.
- 비동기 처리를 수행하는 비동기 함수는 전통적으로 콜백 패턴을 사용한다.
  - 콜백 헬(callback hell)을 발생시켜 가독성이 좋지 않음
  - 비동기 처리 중 발생한 에러의 예외 처리가 곤란
  - 여러 개의 비동기 처리를 한 번에 처리하는 데 한계가 있음
- 타이머 함수인 setTimeout과 setInterval, HTTP 요청, 이벤트 핸들러는 비동기 처리 방식으로 동작한다.
- 비동기 처리는 이벤트 루프와 태스크 큐와 깊은 관계가 있다.

### 42.2 이벤트 루프와 태스크 큐

- 이벤트 루프(event loop)는 브라우저에 내장되어 있는 기능 중 하나로 자바스크립트의 동시성(concurrency)을 지원한다.
- 구글의 V8 자바스크립트 엔진을 비롯한 대부분의 자바스크립트 엔진은 크게 콜 스택과 힙이라는 2개의 영역으로 구분할 수 있다.
- 콜 스택(call stack)
  - 실행 컨텍스트 스택.
  - 자바스크립트는 단 하나의 콜 스택을 사용하기 때문에 최상위 실행 컨텍스트(실행 중인 실행 컨텍스트)가 종료되어 콜 스택에서 제거되기 전까지는 다른 어떤 태스크도 실행되지 않는다.
- 힙(heap)
  - 객체가 저장되는 메모리 공간으로 콜 스택의 요소인 실행 컨텍스트는 힙에 저장된 객체를 참조한다.
  - 객체는 원시 값과는 달리 크기가 정해져 있지 않으므로 할당해야 할 메모리 공간의 크기를 런타임에 결정(동적 할당)해야 한다.
  - 따라서 객체가 저장되는 메모리 공간인 힙은 구조화되어 있지 않다는 특징이 있다.
- 자바스크립트 엔진은 단순히 태스크가 요청되면 콜 스택을 통해 요청된 작업을 순차적으로 실행할 뿐이다.
- 비동기 처리에서 **소스코드 평가와 실행을 제외한 모든 처리**는 자바스크립트 엔진을 구동하는 환경인 브**라우저와 Node.js가 담당**한다.
  - setTimeout의 콜백 함수의 평가와 실행 -> 자바스크립트 엔진
  - 호출 스케줄링을 위한 타이머 설정과 콜백 함수의 등록 -> 브라우저 또는 Node.js
- 이를 위해 브라우저 환경은 태스크 큐와 이벤트 루프를 제공한다.
- 태스크 큐(task queue/event queue/callback queue)
  - 비동기 함수의 콜백 함수 또는 이벤트 핸들러가 일시적으로 보관되는 영역
  - 태스크 큐와는 별도로 프로미스의 후소 처리 메서드와 콜백 함수가 일시적으로 보관되는 마이크로 태스크 큐도 존재한다.
- 이벤트 루트(event loop)
  - 콜 스택에 현재 실행 중인 실행 컨텍스트가 있는지, 그리고 태스크 큐에 대기 중인 함수가 있는지 반복해서 확인한다.
  - 만약 콜 스택이 비어 있고 태스크 큐에 대기 중인 함수가 있다면 이벤트 루프는 순차적으로(FIFO)으로 태스크 큐에 대기 중인 함수를 콜 스택으로 이동시킨다. 이때 콜 스택으로 이동한 함수는 실행된다.
  - 즉, 태스크 큐에 일시 보관된 함수들은 비동기 처리 방식으로 동작한다.
- 자바스크립트 엔진은 싱글 스레드로 동작하지만 브라우저는 멀티 스레드로 동작한다.
- 브라우저는 자바스크립트 엔진 외에도 렌더링 엔진과 Web API를 제공한다. 이때 브라우저가 제공하는 비동기 함수를 실행하기 위해서는 브라우저와 자바스크립트 엔진의 긴밀한 협력이 필요하다.

## 43장 Ajax

### 43.1 Ajax란?

> [!NOTE]
> Ajax(Asynchronous JavaScript and XML)란 자바스크립트를 사용하여 브라우저가 서버에게 비동기 방식으로 데이터를 요청하고, 서버가 응답한 데이터를 수신하여 웹페이지를 동적으로 갱신하는 프로그래밍 방식을 말한다.

- Ajax는 HTTP 비동기 통신을 위한 메서드와 프로퍼티를 제공하는 XMLHttpRequest 객체를 기반으로 동작한다.
- 전통적인 방식
  - 1. 이전 웹페이지와 차이가 없어서 변경할 필요가 없는 부분까지 포함된 완전한 HTML을 서버로부터 매번 다시 전송받기 때문에 불필요한 데이터 통신이 발생한다.
  - 2. 변경할 필요가 없는 부분까지 **처음부터 다시 렌더링**한다. 이로 인해 화면 전환이 일어나면 **화면이 순간적으로 깜박이는 현상**이 발생한다.
  - 3. 클라이언트와 서버와의 통신이 동기 방식으로 동작하기 떄문에 서버로부터 응답이 있을 때까지 다음 처리는 블로킹된다.
- Ajax 방식
  - 1. 변경할 부분을 갱신하는 데 필요한 데이터만 서버로부터 전송받기 때문에 불필요한 데이터 통신이 발생하지 않는다.
  - 2. 변경할 필요가 없는 부분은 다시 렌더링하지 않는다. 따라서 화면이 순간적으로 깜박이는 현상이 발생하지 않는다.
  - 3. 클라이언트와 서버와의 통신이 비동기 방식으로 동작하기 때문에 서버에게 요청을 보낸 이후 블로킹이 발생하지 않는다.

### 43.2 JSON

> [!NOTE]
> JSON(JavaScript Object Notation)은 클라이언트와 서버 간의 HTTP 통신을 위한 텍스트 데이터 포맷이다.

- 자바스크립트에 종속되지 않는 언어 독립형 데이터 포맷으로, 대부분의 프로그래밍 언어에서 사용할 수 있다.

#### 43.2.1 JSON 표기 방식

- 자바스크립트 객체 리터럴과 유사하게 키와 값으로 구성된 순수한 텍스트
  - 키는 **반드시 큰따옴표(작은따옴표 사용불가)**로 묶은 형태
  - 값은 객체 리터럴과 같은 표기법을 그대로 사용 가능. 단 문자열은 키와 동일하게 반드시 큰따옴표로 묶은 형태로만 사용 가능

```json
{
  "name": "Lee",
  "age": 20,
  "alive": true,
  "hobby": ["traveling", "tennis"]
}
```

#### 43.2.2 JSON.stringify

```js
/**
 * JavaScript 값이나 객체를 JSON 문자열로 변환
 *
 * @param {*} value - JSON 문자열로 변환할 값
 * @param {function(key: string, value: *): *} [replacer] - 문자열화 동작 방식을 변경하는 함수
 * @param {number|string} [space] - 들여쓰기
 * @returns {string} JSON 문자열
 * @throws {TypeError} 순환 참조를 발견할 경우
 */

JSON.stringify(value, replacer, space) {}
```

- JSON.stringify 메서드는 객체를 JSON 포맷의 문자열로 변환한다. **즉, 직렬화한다.**
  - 직렬화(serializing): 클라이언트가 서버로 객체를 전송하기 위해 객체를 문자열화
  - 객체 뿐만 아니라 배열도 JSON 포맷의 문자열로 변환한다.

#### 43.2.3 JSON.parse

```js
/**
 * JSON 문자열을 JavaScript 값 또는 객체로 변환
 *
 * @param {string} text - 변환할 JSON 문자열
 * @param {function(key: string, value: *): *} [reviver] - 변환 결과를 반환하기 전에 이 인수에 전달해 변형함.
 * @returns {*} 주어진 JSON 문자열에 대응하는 JavaScript 값 또는 객체
 * @throws {SyntaxError} 변환할 문자열이 유효한 JSON 형식이 아닌 경우 SyntaxError
 */

JSON.parse(text, reviver) {}
```

- JSON.parse 메서드는 JSON 포맷의 문자열을 객체로 변환한다. **즉, 역직렬화한다.**
  - 역직렬화(deserializing): 서버로부터 클라이언트에게 전송된 JSON 데이터인 문자열을 객체화
  - 배열이 JSON 포맷의 문자열로 변환되어 있는 경우 JSON.parse는 문자열로 배열 객체로 변환한다. 배열의 요소가 객체인 경우 배열의 요소까지 객체로 변환한다.

### 43.3 XMLHttpRequest

- 브라우저는 주소창, form 태그, a 태그를 통해 HTTP 요청 전송 기능을 기본 제공한다.
- 자바스크립트를 사용하여 HTTP 요청을 전송하려면 XMLHttpRequest 객체를 사용한다.

#### 43.3.1 XMLHttpRequest 객체 생성

- XMLHttpRequest 생성자 함수를 호출하여 생성한다.
- XMLHttpRequest 객체는 브라우저 환경에서만 정상적으로 실행된다.

```js
const xhr = new XMLHttpRequest()
```

#### 43.3.2 XMLHttpRequest 객체의 프로퍼티와 메서드

- [XMLHttpRequest 객체의 프로퍼티](https://developer.mozilla.org/ko/docs/Web/API/XMLHttpRequest#%EC%86%8D%EC%84%B1)
- [XMLHttpRequest 객체의 메서드](https://developer.mozilla.org/ko/docs/Web/API/XMLHttpRequest#%EB%A9%94%EC%84%9C%EB%93%9C)

#### 43.3.3 HTTP 요청 전송

- HTTP 요청을 전송하는 경우 다음 순서를 따른다.
  - 1. XMLHttpRequest.prototype.open 메서드로 HTTP 요청 초기화
  - 2. 필요에 따라 XMLHttpRequest.prototype.setRequestHeader 메서드로 특정 HTTP 요청의 헤더 값 설정
  - 3. XMLHttpRequest.prototype.send 메서드로 HTTP 요청 전송

```js
const xhr = new XMLHttpRequest()

xhr.open('GET', '/users')
xhr.setRequestHeader('content-type', 'application/json')
xhr.send()
```

##### XHLHttpRequest.prototype.open

- open 메서드는 서버에 전송할 HTTP 요청을 초기화한다.

```js
xhr.open(method, url[, async])
```

| 매개변수 | 설명                                                                    |
| -------- | ----------------------------------------------------------------------- |
| method   | HTTP 요청 메서드("GET", "POST", "PUT", "DELETE" 등)                     |
| url      | HTTP 요청을 전송할 URL                                                  |
| async    | 비동기 요청 여부, 옵션으로 기본값은 true이며, 비동기 방식으로 동작한다. |

- HTTP 요청 메서드: 클라이언트가 서버ㅔㅇ게 요청의 종류와 목적(리소스에 대한 행위)을 알리는 방법

| HTTP 요청 메서드 | 종류           | 목적                  | 페이로드 |
| ---------------- | -------------- | --------------------- | -------- |
| GET              | index/retrieve | 모든/특정 리소스 취득 | X        |
| POST             | create         | 리소스 생성           | O        |
| PUT              | replace        | 리소스의 전체 교체    | O        |
| PATCH            | modify         | 리소스의 일부 수정    | O        |
| DELETE           | delete         | 모든/특정 리소스 삭제 | X        |

##### XHLHttpRequest.prototype.send

- send 메서드는 open 메서드로 초기화된 HTTP 요청을 서버에 전송한다.
- 기본적으로 서버로 전송하는 데이터는 GET, POST 요청 메서드에 따라 전송 방식에 차이가 있다.
  - GET -> 데이터를 URL의 일부분인 쿼리 문자열로 서버에 전송
  - POST -> 데이터(페이로드)를 요청 몸체에 담아 전송
- send 메서드에는 요청 몸체에 담아 전송할 데이터(페이로드)를 인수로 전달할 수 있다.
- **페이로드가 객체인 경우 반드시 JSON.stringify 메서드를 사용하여 직렬화**한 다음 전달해야 한다.

```js
xhr.send(JSON.stringify({ id: 1, content: 'HTML', completed: false }))
```

- HTTP 요청 메서드가 GET인 경우 send 메서드에 페이로드로 전달한 인수는 무시되고 요청 몸체는 null로 설정된다.

##### XHLHttpRequest.prototype.setRequestHeader

- setRequestHeader 메서드는 **특정 HTTP 요청의 헤더 값을 설정**한다.
- 반드시 open 메서드를 호출한 이후에 호출해야 한다.
- Content-type: 요청 몸체에 담아 전송할 데이터의 MIME 타입의 정보를 표현

| MIME 타입   | 서브 타입                                          |
| ----------- | -------------------------------------------------- |
| text        | text/plain, text/html, text/css, text/javascript   |
| application | application/json, application/x-www-from-urlencode |
| multipart   | multipart/formed-data                              |

```js
const xhr = new XMLHttpRequest()

xhr.open('POST', '/users')
xhr.setRequestHeader('content-type', 'application/json')
xhr.send(JSON.stringify({ id: 1, content: 'HTML', completed: false }))
```

- HTTP 클라이언트가 서버에 요청할 때 서버가 응답할 데이터의 MIME 타입을 Accept로 지정할 수 있다.
- 만약 Accept 헤더를 설정하지 않으면 send 메서드가 호출될 때 Accept 헤더가 \*/\*로 전송된다.

```js
xhr.setRequestHeader('accept', 'application/json')
```

#### 43.3.4 HTTP 응답 처리

- 서버가 전송한 응답을 처리하려면 XMLHttpRequest 객체가 발생시키는 이벤트를 캐치해야 한다.
- XMLHttpRequest 객체는 onreadystatechange, onload, onerror 같은 이벤트 핸들러를 갖는다.
- HTTP 요청의 현재 상태를 나타내는 readyState 프로퍼티 값이 변경된 경우 발생하는 readystatechange 이벤트를 캐치하여 HTTP 응답 처리하는 방법

```js
const xhr = new XMLHttpRequest() // xhr.readyState: 0 (XMLHttpRequest.UNSENT)

xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1') // xhr.readyState: 1 (XMLHttpRequest.OPENED)
xhr.send() // xhr.readyState: 4 (XMLHttpRequest.DONE)
xhr.onreadystatechange = () => {
  if (xhr.readyState !== XMLHttpRequest.DONE) return

  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.response))
  } else {
    console.error('Error', xhr.status, xhr.statusText)
  }
}
```

- HTTP 요청이 성공적으로 완료된 경우 발생하는 load 이벤트를 캐치하여 HTTP 응답 처리하는 방법
- 요청이 성공한 경우에만 발생하므로 xhr.readyState가 XMLHttpRequest.DONE(4)인지 확인할 필요가 없어 단축 코드로 작성할 수 있다.

```js
const xhr = new XMLHttpRequest() // xhr.readyState: 0 (XMLHttpRequest.UNSENT)

xhr.open('GET', 'https://jsonplaceholder.typicode.com/todos/1') // xhr.readyState: 1 (XMLHttpRequest.OPENED)
xhr.send() // xhr.readyState: 4 (XMLHttpRequest.DONE)
xhr.onload = () => {
  if (xhr.status === 200) {
    console.log(JSON.parse(xhr.response))
  } else {
    console.error('Error', xhr.status, xhr.statusText)
  }
}
```

## 44장 Rest API

> [!NOTE]
> REST는 HTTP를 기반으로 클라이언트가 서버의 리소스에 접근하는 방식을 규정한 아키텍처고,
>
> REST API는 REST를 기반으로 **"RESTful"하게** 서비스 API를 구현한 것을 의미한다.

### 44.1 REST API의 구성

- REST API는 자원, 행위, 표현의 3가지 요소로 구성된다.
- REST는 자체 표현 구조(self-descriptiveness)로 구성되어 REST API만으로 HTTP 요청의 내용을 이해할 수 있다.

| 구성 요소             | 내용                           | 표현 방법        |
| --------------------- | ------------------------------ | ---------------- |
| 자원(resource)        | 자원                           | URI(엔드포인트)  |
| 행위(verb)            | 자원에 대한 행위               | HTTP 요청 메서드 |
| 표현(representations) | 자원에 대한 행위의 구체적 내용 | 페이로드         |

### 44.2 REST API 설계 원칙

> [!NOTE]
> RESTful API는 **URI는 리소스를 표현**하는 데 집중하고 **헹위에 대한 정의는 HTTP 요청 메서드**를 통해 정의하는 것을 중점 규칙으로 삼는다.

#### 1. URI는 리소스를 표현해야 한다.

- 리소스를 식별할 수 있는 이름은 동사보다는 명사를 사용한다.

```
# bad
GET /getTodos/1
GET /todos/show/1

# good
GET /todos/1
```

#### 2. 리소스에 대한 행위는 HTTP 요청 메서드로 표현한다.

- HTTP 요청 메서드는 클라이언트가 서버에게 요청의 종류와 목적을 알리는 방법이다.
- 리소스에 대한 행위는 HTTP 요청 메서드를 통해 명확히 표현하며 URI에 표현하지 않는다.

```
# bad
GET /todos/delete/1

# good
DELETE /todos/1
```

### 44.3 JSON Server를 이용한 REST API 실습

#### 44.3.1 JSON Server 설치

```bash
npm install json-server --save-dev
```

#### 44.3.2 db.json 파일 생성

```json
{
  "todos": [
    {
      "id": 1,
      "content": "HTML",
      "completed": true
    },
    {
      "id": 2,
      "content": "CSS",
      "completed": false
    },
    {
      "id": 3,
      "content": "Javascript",
      "completed": true
    }
  ]
}
```

#### 44.3.3 JSON Server 실행

- db.json 파일의 변경 감지를 위한 watch 옵션 추가 및 5000 포트로 변경

```bash
npx json-server --watch db.json --port 5000
```

#### 44.3.4 GET 요청

- 전체 가져오기

```js
xhr.open('GET', '/todos')
xhr.send()
```

- 부분 가져오기

```js
xhr.open('GET', '/todos/2')
xhr.send()
```

#### 44.3.5 POST 요청

```js
xhr.open('POST', '/todos')
xhr.setRequestHeader('content-type', 'application/json')
xhr.send(
  JSON.stringify({
    id: 4,
    content: 'React',
    completed: false,
  }),
)
```

#### 44.3.6 PUT 요청

```js
xhr.open('PUT', '/todos/4')
xhr.setRequestHeader('content-type', 'application/json')
xhr.send(
  JSON.stringify({
    id: 4,
    content: 'Vue',
    completed: true,
  }),
)
```

#### 44.3.7 PATCH 요청

```js
xhr.open('PATCH', '/todos/4')
xhr.setRequestHeader('content-type', 'application/json')
xhr.send(JSON.stringify({ completed: false }))
```

#### 44.3.8 DELETE 요청

```js
xhr.open('DELETE', '/todos/4')
xhr.send()
```
