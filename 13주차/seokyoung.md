## 45장 프로미스

- 자바스크립트는 비동기 처리를 위한 하나의 패턴으로 콜백 함수를 사용한다.
- 하지만 전통적인 콜백 패턴은 콜백 헬로 인해 가독성이 나쁘고 비동기 처리 중 발생한 에러의 처리가 곤란하며, 여러 개의 비동기 처리를 한 번에 처리하는 데도 한계가 있다.
- ES6에서는 비동기 처리를 위한 또 다른 패턴으로 프로미스를 도입했다.

### 45.1 비동기 처리를 위한 콜백 패턴의 단점

#### 45.1.1 콜백 헬

- 비동기 함수는 비동기 처리 결과를 외부에 반환할 수 없고, 상위 스코프의 변수에 할당할 수도 없다.
- 따라서 비동기 함수의 처리 결과(서버의 응답 등)에 대한 후속 처리는 비동기 함수 내부에서 수행해야 한다.
- 이때 비동기 함수를 범용적으로 사용하기 위해 비동기 함수에 비동기 처리 결과에 대한 후속 처리를 수행하는 콜백 함수를 전달하는 것이 일반적이다.
- 하지만 콜백 함수를 통해 비동기 처리 결과에 대한 후속 처리를 수행하는 비동기 함수가 비동기 처리 결과를 가지고 또다시 비동기 함수를 호출해야 한다면 콜백 함수 호출이 중첩되어 복잡도가 높아지는 **콜백 헬(callback hell)** 현상이 발생한다.

```js
get('/step1', a => {
  get(`/step2/${a}`, b => {
    get(`/step3/${b}`, c => {
      get(`/step4/${c}`, d => {
        console.log(d)
      })
    })
  })
})
```

#### 45.1.2 에러 처리의 한계

- 에러는 호출자 방향으로 전파되는데 비동기 함수의 콜백 함수가 발생시킨 에러는 catch 블록에서 캐치되지 않아 에러 처리가 어렵다.

```js
try {
  setTimeout(() => {
    throw new Error('Error!')
  }, 1000)
} catch (e) {
  // 에러를 캐치하지 못한다
  console.error('캐치한 에러', e)
}
```

### 45.2 프로미스의 생성

- Promise 생성자 함수를 new 연산자와 함께 호출하면 프로미스(Promise 객체)를 생성한다.
- ES6에서 도입된 Promise는 호스트 객체가 아닌 ECMAScript 사양에 정의된 표준 빌트인 객체다.
- Promise 생성자 함수는 비동기 처리를 수행할 콜백 함수를 인수로 전달받는데 이 콜백 함수는 resolve와 reject 함수를 인수로 전달받는다.

```js
const promise = new Promise((resolve, reject) => {
  if (/* 비동기 처리 성공 */) {
    resolve('result');
  } else { /* 비동기 처리 실패 */
    reject('failure reason');
  }
});
```

| 프로미스의 상태 정보 | 의미                                  | 상태 변경 조건                   |
| -------------------- | ------------------------------------- | -------------------------------- |
| pending              | 비동기 처리가 아직 수행되지 않은 상태 | 프로미스가 생성된 직후 기본 상태 |
| fulfilled            | 비동기 처리가 수행된 상태(성공)       | resolve 함수 호출                |
| reject               | 비동기 처리가 수행된 상태(실패)       | reject 함수 호출                 |

- 생성된 직후의 프로미스는 기본적으로 pending 상태다. 이후 비동기 처리가 수행되면 비동기 처리 결과에 따라 다음과 같이 프로미스의 상태가 변경된다.
  - 비동기 처리 성공: resolve 함수를 호출해 프로미스를 fulfilled 상태로 변경한다.
  - 비동기 처리 실패: reject 함수를 호출해 프로미스를 rejected 상태로 변경한다.

### 45.3 프로미스의 후속 처리 메서드

- 프로미스의 비동기 처리 상태가 변화하면 이에 따른 후속 처리를 해야 한다.
- 예를 들어, 프로미스가 fulfilled 상태가 되면 프로미스의 처리 결과를 가지고 무언가를 해야 하고, 프로미스가 rejected 상태가 되면 프로미스의 처리 결과(에러)를 가지고 에러 처리를 해야 한다.
- 이를 위해 프로미스는 후속 메서드 then, catch, finally를 제공한다.
- 프로미스의 비동기 처리 상태가 변화하면 후속 처리 메서드에 인수로 전달한 콜백 함수가 선택적으로 호출된다.
-

#### 45.3.1 Promise.prototype.then

- then 메서드는 두 개의 콜백 함수(resolve, reject)를 인수로 전달받는다.
  - 첫 번째 콜백 함수는 프로미스가 fulfilled 상태(resolve 함수가 호출된 상태. 즉, 비동기 처리 성공)가 되면 호출된다. 이때 콜백 함수는 프로미스의 비동기 처리 결과를 인수로 전달받는다.
  - 두 번째 콜백 함수는 프로미스가 rejected 상태(reject 함수가 호출된 상태. 즉, 비동기 처리 실패)가 되면 호출된다. 이때 콜백 함수는 프로미스의 에러를 인수로 전달받는다.

```js
// fulfilled
new Promise(resolve => resolve('fulfilled')).then(
  v => console.log(v),
  e => console.error(e),
)

// rejected
new Promise((_, reject) => reject(new Error('rejected'))).then(
  v => console.log(v),
  e => console.error(e),
)
```

- then 메서드는 언제나 프로미스를 반환한다.
  - 만약 then 메서드의 콜백 함수가 프로미스를 반환하면 그 프로미스를 그대로 반환
  - 콜백 함수가 프로미스가 아닌 값을 반환하면 그 값을 암묵적으로 resolve 또는 reject하여 프로미스를 생성해 반환

#### 45.3.2 Promise.prototype.catch

- catch 메서드는 한 개의 콜백 함수(rejected)를 인수로 전달 받는다.
- catch 메서드의 콜백 함수는 프로미스가 rejcted 상태인 경우만 호출된다.

```js
// rejected(catch)
new Promise((_, reject) => reject(new Error('rejected'))).catch(e => console.log(e)) // Error: rejected

// rejected(then)
new Promise((_, reject) => reject(new Error('rejected'))).then(undefined, e => console.log(e)) // Error: rejected
```

#### 45.3.3 Promise.prototype.finally

- finally 메서드는 한 개의 콜백 함수를 인수로 전달받는다.
- finally 메서드의 콜백 함수는 프로미스의 성공 여부와 관계없이 무조건 한 번 호출된다.
- 따라서 프로미스의 상태와 상관없이 공통적으로 수행해야 할 처리 내용이 있을 때 유용하다.

```js
new Promise(() => {}).finally(() => console.log('finally')) // finally
```

### 45.4 프로미스의 에러 처리

#### then 메서드의 두 번째 콜백 함수를 이용한 에러 처리

```js
const wrongUrl = 'https://jsonplaceholder.typicode.com/XXX/1'

promiseGet(wrongUrl).then(
  res => console.log(res),
  err => console.error(err),
) // Error: 404
```

#### catch 메서드를 이용한 에러 처리

```js
const wrongUrl = 'https://jsonplaceholder.typicode.com/XXX/1'

promiseGet(wrongUrl)
  .then(res => console.log(res))
  .catch(err => console.error(err)) // Error: 404
```

- catch 메서드를 이용하면 내부적으로 `.then(undefined, onRejected)`을 호출한다.

```js
promiseGet(wrongUrl)
  .then(res => console.log(res))
  .then(undefined, err => console.error(err))
```

- then 메서드의 두 번째 콜백 함수는 첫 번재 콜백 함수에서 발생한 에러를 캐치하지 못하고 코드가 복잡해져서 가독성이 좋지 않다.
- catch 메서드를 모든 then 메서드를 호출한 이후에 호출하면 비동기 처리에서 발생한 에러뿐만 아니라 then 메서드 내부에서 발생한 에러까지 모두 캐치할 수 있다.
- 가독성 및 디버깅 측면에서 에러 처리는 catch 메서드에서 하는 것을 권장한다.

```js
promiseGet('https://jsonplaceholder.typicode.com/todos/1').then(
  res => console.xxx(res),
  err => console.error(err),
) // 두 번째 콜백 함수는 첫 번째 콜백 함수에서 발생한 에러를 캐치 X

promiseGet('https://jsonplaceholder.typicode.com/todos/1')
  .then(res => console.xxx(res))
  .catch(err => console.error(err)) // TypeError: console.xxx is not a function
```

### 45.5 프로미스 체이닝

- then, catch, finally 후속 처리 메서드는 언제나 프로미스를 반환하므로 연속적으로 호출할 수 있는데 이를 **프로미스 체이닝**이라 한다.
- 프로미스 체이닝을 통해 콜백 헬을 해결할 수 있다.
- 후속 처리 메서드의 콜백 함수는 프로미스의 비동기 처리 상태가 변경되면 선택적으로 호출된다.

```js
const url = 'https://jsonplaceholder.typicode.com'

// id가 1인 post의 userId를 취득
promiseGet(`${url}/posts/1`)
  // 취득한 post의 userId로 user 정보를 취득
  .then(({ userId }) => promiseGet(`${url}/users/${userId}`))
  .then(userInfo => console.log(userInfo))
  .catch(err => console.error(err))
```

| 후속 처리 메서드                | 콜백 함수의 인수                                                                       | 후속 처리 메서드의 반환값                             |
| ------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| then                            | promiseGet 함수가 반환한 프로미스가 resolve한 값(id가 1인 post)                        | 콜백 함수가 반환한 프로미스                           |
| then                            | 첫 번째 then 메서드가 반환한 프로미스가 resolve한 값(post의 userId로 취득한 user 정보) | 콜백 함수가 반환한 값(undefined)을 resolve한 프로미스 |
| catch (\*에러 미발생 시 호출 X) | promiseGet 함수 또는 앞선 후속 처리 메서드가 반환한 프로미스가 reject한 값             | 콜백 함수가 반환한 값(undefined)을 resolve한 프로미스 |

- 만약 후속 처리 메서드의 콜백 함수가 프로미스가 아닌 값을 반환하더라도 그 값을 암묵적으로 resolve 또는 reject하여 프로미스를 생성해 반환한다.
- 프로미스는 프로미스체이닝을 통해 비동기 처리 결과를 전달받아 후속 처리를 하므로 비동기 처리를 위한 콜백 패턴에서 발생하면 콜백 헬이 발생하지 않는다.
- 다만 프로미스도 콜백 패턴을 사용하므로 콜백 함수를 사용하지 않는 것은 아니다 -> 콜백 헬이 발생하지 않도록 사용하는 선에서 가독성 증진
- ES8은 콜백 패턴의 가독성 문제를 해결하기 위해 ES8에서 async/await를 도입했다.
- async/await도 프로미스를 기반으로 동작하며, 프로미스의 후속 처리 메서드 없이 마치 동기 처리처럼 프로미스가 처리 결과를 반환하도록 구현할 수 있다.

```js
const url = 'https://jsonplaceholder.typicode.com'

;(async () => {
  const { userId } = await promiseGet(`${url}/posts/1`)
  const userInfo = await promiseGet(`${url}/users/${userId}`)
  console.log(userInfo)
})()
```

### 45.6 프로미스의 정적 메서드

#### Promise.resolve

- 이미 존재하는 값을 래핑하여 프로미스를 생성하기 위해 사용

```js
const resolvedPromise = Promise.resolve([1, 2, 3])
resolvedPomise.then(console.log) // [1, 2, 3]
```

#### Promise.reject

- 인수로 전달받은 값을 reject하는 프로미스를 생성한다.

```js
const rejectedPromise = Promise.reject([1, 2, 3])
rejectedPromise.then(console.log) // [1, 2, 3]

// 에러 객체를 reject하는 프로미스 생성
const rejectedErrorPromise = Promise.reject(new Error('Error!'))
rejectedErrorPromise.catch(console.log) // Error: Error!
```

#### Promise.all

- 여러 개의 비동기 처리를 모두 병렬 처리할 때 사용한다.

```js
const requestData1 = () => new Promise(resolve => setTimeout(() => resolve(1), 3000))
const requestData2 = () => new Promise(resolve => setTimeout(() => resolve(2), 2000))
const requestData3 = () => new Promise(resolve => setTimeout(() => resolve(3), 1000))

const res = []
requestData1()
  .then(data => {
    res.push(data)
    return requestData2()
  })
  .then(data => {
    res.push(data)
    return requestData3()
  })
  .then(data => {
    res.push(data)
    console.log(res) // [1, 2, 3] => 6초 소요
  })
  .catch(console.error)
```

- 세 개의 비동기 처리를 순차적으로 처리한다.
  - 세 개의 비동기 처리는 서로 의존하지 않고 개별적으로 수행된다.
  - 즉, 앞선 비동기 처리 결과를 다음 비동기 처리가 사용하지 않는다. -> 순차적으로 처리할 필요 X

```js
const requestData1 = () => new Promise(resolve => setTimeout(() => resolve(1), 3000))
const requestData2 = () => new Promise(resolve => setTimeout(() => resolve(2), 2000))
const requestData3 = () => new Promise(resolve => setTimeout(() => resolve(3), 1000))

Promise.all([requestData1(), requestData2(), requestData3()])
  .then(console.log) // [1, 2, 3] => 3초 소요
  .catch(consle.error)
```

- Promise.all 메서드는 promiseGet 함수가 반환한 3개의 프로미스로 이루어진 배열을 인수로 전달받고 이 프로미스들이 모두 fulfilled 상태가 되면 처리 결과를 배열에 저장에 새로운 프로미스를 반환한다.
- 이때 Promise.all 메서드가 반환한 프로미스는 세 개의 사용자 객체로 이루어진 배열을 담고 있다. 이 배열은 첫 번째 then 메서드에 인수로 전달한다.

#### Promise.race

- Promise.all 메서드와 동일하게 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달받는다.
- Promise.race 메서드는 가장 먼저 fulfilled 상태가 된 프로미스의 처리 결과를 resolve하는 새로운 프로미스를 반환한다.

```js
Promise.race([
  const requestData1 = () => new Promise(resolve => setTimeout(() => resolve(1), 3000))
  const requestData2 = () => new Promise(resolve => setTimeout(() => resolve(2), 2000))
  const requestData3 = () => new Promise(resolve => setTimeout(() => resolve(3), 1000))
]).then(console.log).catch(console.error)
```

#### Promise.allSettled

- ES11(ECMAScript 2020)에 도입
- 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달받는다. 그리고 전달받은 프로미스가 모두 settled 상태가 되면 처리 결과를 배열로 반환한다.
- fulfilled, rejected 상관없이 Promise.allSettled 메서드가 인수로 전달받은 모든 프로미스들의 처리 결과를 담은 배열을 반환한다.
  - fulfilled: status, value
  - rejected: status, reason

```js
Promise.allSettled([
  new Promise(resolve => setTiomeout(() => resolve(1), 2000))
  new Promise((_, reject) => setTimeout(new Error('Error!'), 1000))
])

// [
//   { status: "fulfilled", value: 1 },
//   { status: "rejected", reason: Error: Error at <anonymous>:3:54 },
// ]
```

### 45.7 마이크로태스크 큐 (microtask queue/job queue)

```js
setTimeout(() => console.log(1), 0)

Promise.resolve()
  .then(() => console.log(2))
  .then(() => console.log(3))
```

- 동작 순서: 2 -> 3 -> 1
- 프로미스의 후속 처리 메서드의 콜백 함수는 태스크 큐가 아니라 별도의 큐인 마이크로태스크 큐에 저장되기 때문이다.
  - 마이크로태스크 큐 -> 프로미스의 후속 처리 메서드의 콜백 함수
  - 태스크 큐 -> 그 외의 비동기 함수의 콜백 함수나 이벤트 핸들러
- 우선순위: 마이크로태스큐 큐 > 태스크 큐
- 이벤트 루프는 콜 스택이 비면 먼저 마이크로태스크 큐에서 대기하고 있는 함수를 가져와 실행한다.
- 이후 마이크로태스크 큐가 비면 태스크 큐에서 대기하고 있는 함수를 가져와 실행한다.

### 45.8 fetch

- XMLHttpRequest 같이 HTTP 요청 전송 기능을 제공하는 클라이언트 사이드 Web API
- 사용법이 간단하고 프로미스를 지원하기 때문에 비동기 처리를 위한 콜백 패턴의 단점에서 자유롭다.
- fetch 함수에는 **HTTP 요청을 전송할 URL, HTTP 요청 메서드, HTTP 요청 처리, 페이로드 등을 설정한 객체**를 전달한다.

```js
const promise = fetch(url [, options])
```

- fetch 함수는 HTTP 응답을 나타내는 Response 객체를 래핑한 Promise 객체를 반환한다.
- HTTP 응답을 나타내는 Response 객체를 래핑한 프로미스를 반환하므로 후속 처리 메서드 then을 통해 프로미스가 resolve한 Response 객체를 전달받을 수 있다.
- Response.prototype에는 Response 객체에 포함되어 있는 HTTP 응답 몸체를 위한 다양한 메서드를 제공한다.

```js
fetch('https://jsonplaceholder.typicode.com/todos/1').then(response => console.log(response))
```

- fetch 함수가 반환하는 프로미스는 기본적으로 에러를 reject하지 않고 불리언 타입의 ok 상태를 false로 설정한 Response 객체를 resolve한다.
  - reject 하지 못한다? -> catch 메서드의 내용이 잡히지 않음!
- 오프라인 등의 네트워크 장애나 CORS 에러에 의해 요청이 완료되지 못한 경우에만 프로미스를 reject한다.

```js
const wrongUrl = 'https://jsonplaceholder.typicode.com/XXX/1'

// 부적절한 URL -> 404 Not Found 에러가 발생하지만 reject되지 않고 Response 객체 resolve
fetch(wrongUrl)
  .then(() => console.log('ok'))
  .catch(() => console.log('error'))
```

- 따라서 fetch 함수를 사용할 떄는 반환한 프로미스가 resolve한 Response 객체의 프로퍼티 중 불리언 타입인 ok 상태를 확인해 명시적으로 에러를 처리할 필요가 있다.

```js
const wrongUrl = 'https://jsonplaceholder.typicode.com/XXX/1'

fetch(wrongUrl)
  .then(response => {
    if (!response.ok) throw new Error(response.statusText)
    return response.json()
  })
  .then(todo => console.log(todo))
  .catch(err => console.error(err))
```

- axios는 모든 HTTP 에러를 reject하는 프로미스 반환
  - 따라서 모든 에러를 catch에서 처리할 수 있음
  - 인터셉터, 요청 설정 등 다양한 기능 지원

```js
const request = {
  get(url) {
    return fetch(url)
  },
  post(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  },
  patch(url, payload) {
    return fetch(url, {
      method: 'PATCH',
      headers: { 'content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
  },
  delete(url) {
    return fetch(url, {
      method: 'DELETE',
    })
  },
}
```

#### GET

```js
request
  .get('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => {
    if (!response.ok) throw new Error(response.statusText)
    return response.json()
  })
  .then(todos => console.log(todos))
  .catch(err => console.error(err))
```

#### POST

```js
request
  .post('https://jsonplaceholder.typicode.com/todos/', {
    userId: 1,
    title: 'Deep Dive to JavaScript',
    completed: false,
  })
  .then(response => {
    if (!reponse.ok) throw new Error(response.statusText)
    return response.json()
  })
  .then(todos => console.log(todos))
  .catch(err => console.error(err))
```

#### PATCH

```js
request
  .patch('https://jsonplaceholder.typicode.com/todos/1', {
    complete: true,
  })
  .then(response => {
    if (!response.ok) throw new Error(response.statusText)
    return response.json()
  })
  .then(todos => console.log(todos))
  .catch(err => console.error(err))
```

#### DELETE

```js
request
  .delete('https://jsonplaceholder.typicode.com/todos/1')
  .then(response => {
    if (!response.ok) throw new Error(response.statusText)
    return response.json()
  })
  .then(todos => console.log(todos))
  .catch(err => console.error(err))
```

## 46장 제너레이터와 async/await

### 46.1 제너레이터란?

> [!NOTE]
> ES6에서 도입된 제너레이터는 코드 블록의 실행을 일시 중지했다가 필요한 시점에 재개할 수 있는 특수한 함수다.

1. 제너레이터 함수는 **함수 호출자에게 함수 실행의 제어권을 양도할 수 있다.**

- 일반 함수를 호출하면 제어권이 함수에게 넘어가고 함수 코드를 일괄 실행
- 즉, 함수 호출자(caller)는 함수를 호출한 이후 함수 실행을 제어 X
- 제너레이터 함수는 함수 실행을 함수 호출자가 제어 가능.
- 다시 말해, 함수 호출자가 함수 실행을 일시 중지시키거나 재개 가능
- **함수의 제어권을 함수가 독점하는 것이 아니라 함수 호출자에게 양도(yield)할 수 있다**는 것을 의미

2. 제너레이터 함수는 **함수 호출자와 함수의 상태를 주고받을 수 있다.**

- 일반 함수를 호출하면 매개변수를 통해 함수 외부에서 값을 주입받고 함수 코드를 일괄 실행하여 결과값을 함수 외부로 반환
- 즉, 함수가 실행되고 있는 동안 -> 함수 외부에서 함수 내부로 값을 전달하여 함수 상태 변경 X
- 제너레이터 함수는 함수 호출자와 **양방향**으로 함수의 상태를 주고받을 수 있다.
- 다시 말해 **제너레이터 함수는 함수 호출자에게 상태를 전달할 수 있고 함수 호출자로부터 상태를 전달받을 수도 있다.**

1. 제너레이터 함수를 호출하면 **제너레이터 객체를 반환한다.**

- 일반 함수를 호출하면 함수 코드를 일괄 실행하고 값을 반환한다.
- 제너레이터 함수를 호출하면 함수 코드를 실행하는 것이 아니라 **이터러블이면서 동시에 이터레이터인 제너레이터 객체를 반환**한다.

### 46.2 제너레이터 함수의 정의

- `function*` 키워드로 선언하고 하나 이상의 yield 표현식을 포함한다.
- 애스터리스크(\*)의 위치는 funcion 키워드와 함수 이름 사이라면 어디든지 상관없지만 일관성 유지를 위해 funcion 키워드 바로 뒤에 붙이는 것을 권장한다.

```js
// 제너레이터 함수 선언문
function* getDecFunc() {
  yield 1
}

// 제너레이터 함수 표현식
const getExpFunc = function* () {
  yield 1
}

// 제너레이터 메서드
const obj = {
  *getObjMethod() {
    yield 1
  },
}

// 제너레이터 클래스 메서드
class MyClass {
  *getClassMethod() {
    yield 1
  }
}
```

- 제너레이터 함수는 화살표 함수로 정의할 수 없다.
- 제너레이터 함수는 new 연산자와 함께 생성자 함수로 호출할 수 없다.

```js
const getArrowFunc = * () => {
  yield 1;
} // SyntaxError: Unexpected token '*'

function* getFunc() {
  yield 1;
}

new getFunc() // TypeError: getFunc is not a constructor
```

### 46.3 제너레이터 객체

> [!NOTE]
> 제너레이터 함수가 반환한 제너레이터 객체는 이터러블이면서 동시에 이터레이터다.

- Symbol.iterator 메서드를 상속받는 이터러블이면서 value, done 프로퍼티를 갖는 이터레이트 리절트 객체를 반환하는 next 메서드를 소유하는 이터레이터
- 이미 next 메서드를 가진 이터레이터이므로 별도로 이터레이터를 생성할 필요 X

```js
function* getFunc() {
  yield 1
  yield 2
  yield 3
}

const generator = getFunc()
console.log(Symbol.iterator in generator) // true
console.log('next' in generator) // true
```

- 제너레이터 객체는 이터레이터에는 없는 return, throw 메서드를 갖는다.
  - next(): 호출 시 제너레이터 함수의 yield 표현식까지 코드를 실행하고 yield 값을 value 프로퍼티 값으로, false를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체 반환
  - return(): 호출 시 인수로 전달받은 값을 value 프로퍼티의 값으로, true를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체 반환
  - throw(): 호출 시 인수로 전달받은 에러를 발생시키고 undefined를 value 프로퍼티 값으로, true를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체 반환

```js
function* getFunc() {
  try {
    yield 1
    yield 2
    yield 3
  } catch (e) {
    console.error(e)
  }
}

const generator = getFunc()
console.log(generator.next()) // { value: 1, done: false }
console.log(generator.return('End!')) // { value: "End!", done: true }
console.log(generator.throw('Error!')) // { value: undefined, done: true }
```

### 46.4 제너레이터 일시 중지와 재개

- 제너레이터는 yield 키워드와 next 메서드를 통해 실행을 일시 중지했다가 필요한 시점에 다시 재개할 수 있다.
  - 제너레이터는 일반 함수와 다르게 함수 호출자에게 제어권을 양도하기 때문에 함수 실행 재개가 가능
- 한 번에 코드 블록의 모든 코드 일괄 실행 X
- yield 표현식까지만 실행
- **yield 키워드는 제너레이터 함수의 실행을 일시 중지시키거나 yield 키워드 뒤에 오는 표현식의 평가 결과를 제너레이터 함수 호출자에게 반환한다.**

```js
function* getFunc() {
  yield 1
  yield 2
  yield 3
}

const generator = getFunc()
console.log(generator.next()) // { value: 1, done: false }
consoel.log(generator.next()) // { value: 2, done: false }
consoel.log(generator.next()) // { value: 3, done: false }
consoel.log(generator.next()) // { value: undefined, done: true }
```

- 1. next 메서드를 호출 -> yield 표현식 실행 -> 일시 중지 (제어권이 호출자로 양도)
- 2. 필요한 시점에 다시 next 메서드 호출 -> 다음 yield 표현식 실행 -> 일시 중지
- 3. 1, 2를 반복하다 끝까지 실행되면 done 프로퍼티가 true 할당

```
generator.next() -> yield -> generator.next() -> yield -> ... -> geanerator.next() -> return
```

- 이터레이터의 next 메서드와 달리 제너레이터 객체의 next 메서드에는 인수를 전달할 수 있다.
- 제너레이터 객체의 next 메서드에 전달한 인수는 제너레이터 함수의 yield 표현식을 할당받는 변수에 할당된다.
- yield 표현식을 할당받는 변수에 yield 표현식의 평가 결과가 할당되지 않는 것에 주의

```js
function getFunc() {
  const x = yield 1
  const y = yield (x + 10)
  return x + y
}

const generator = getFunc(0)

// 처음 호출하는 next()에는 인수 전달 X (인수 전달 시 무시됨)
// value 프로퍼티에는 첫 번째 yield된 값인 1 할당
let res = generator.next()
console.log(res) // { value: 1, done: false }

// 인수로 전달한 10은 x 변수에 할당
// value 프로퍼티에는 두 번째 yield된 값 20 할당
res = generator.next(10)
console.log(res) // { value: 20, done: false }

// 인수로 전달한 20은 y 변수에 할당
// value 프로퍼티에는 반환값 30 할당
res = generator.next(20)
console.log(res) // { value: 30, done: true }
```

- 제너레이터 함수는 next 메서드와 yield 표현식을 통해 함수 호출자와 함수 상태를 주고받을 수 있다.
- 함수 호출자가 제어권을 양도받아
  - next 메서드로 yield 표현식 실행 -> 제너레이터 객체가 관리하는 상태(yield된 값) 꺼내오기
  - next 메서드에 인수 전달 -> 제너레이터 객체에 상태(yield 표현식을 할당받는 변수) 밀어넣기

### 46.5 제너레이터의 활용

#### 이터러블의 구현

```js
const infiniteFibonacci = (function* () {
  let [pre, cur] = [0, 1]
  while (true) {
    ;[pre, cur] = [cur, pre + cur]
    yield cur
  }
})()

for (const num of infiniteFibonacci) {
  if (num > 10000) break
  console.log(num)
}
```

#### 비동기 처리

- next 메서드와 yield 표현식을 통해 함수 호출자와 함수 상태를 주고받을 수 있는 제너레티어 함수의 특성 활용
- 프로미스의 후속 처리 메서드 then/catch/finally 없이 비동기 처리 결과를 반환하도록 구현 가능

```js
const async = generatorFunc => {
  const generator = generatorFunc() // 2

  const onResolved = arg => {
    const result = generator.next(arg)

    return result.done ? return.value : return.value.then(res => onResolved(res))
  }

  return onResolved
}

(async(function* fetchTodo() { // 1
  const url = ''

  const response = yield fetch(url)
  const todo = yield response.json()
  console.log(todo)
})())
```

- 직접 구현하는 것보다 async/await(ES8), co 라이브러리를 사용을 권장

### 46.6 async/await

- ES8(ECMAScript 2017)에서 도입
- 비동기 처리를 동기 처리처럼 동작하도록 구현할 수 있음

```js
async function fetchTodo() {
  const url = 'https://jsonplaceholder.typicode.com/todos/1'

  const response = await fetch(url)
  const todo = response.json()
  console.log(todo)
}

fetchTodo()
```

#### async 함수

- async 함수는 async 키워드를 사용해 정의하며 언제나 프로미스를 반환한다.
- 명시적으로 프로미스를 반환하지 않는 경우에도 async 함수는 암묵적으로 반환값을 resolve하는 프로미스를 반환한다.

```js
// async 함수 선언문
async function foo(n) {
  return n
}
foo(1).then(v => console.log(v)) // 1

// async 함수 표현식
const bar = async function (n) {
  return n
}
bar(2).then(v => console.log(v)) // 2

// async 화살표 함수
const baz = async n => n
baz(3).then(v => console.log(v)) // 3

// async 메서드
const obj = {
  async foo(n) {
    return n
  },
}
obj.foo(4).then(v => console.log(v)) // 4

// async 클래스 메서드
class MyClass {
  async bar(n) {
    return n
  }
}
const myClass = new MyClass()
myClass.bar(5).then(v => console.log(v)) // 5
```

- 클래스의 constructor 메서드는 async 메서드가 될 수 없음
  - **클래스의 constructor 메서드는 인스턴스를 반환해야 하지마 async 함수는 프로미스를 반환하기 때문**

```js
class MyClass {
  async constructor() {}
  // SyntaxError: Class constructor may not be an async method
}

const myClass = new MyClass()
```

#### await 키워드

- 프로미스가 settled 상태(비동기 처리가 수행된 상태)가 될 때까지 대기하다가 settled 상태가 되면 프로미스가 resolve한 처리 결과를 반환한다.
- await 키워드는 반드시 프로미스 앞에서 사용해야 한다.

```js
const getGithubUserName = async id => {
  const res = await fetch(`https://api.github.com/users/${id}`)
  cosnt {name} = await res.json()
  console.log(name)
}

getGithubUserName('samseburn')
```

- 1. fetch 함수가 수행한 HTTP 요청에 대한 서버의 응답이 도착해서 fetch 함수가 반환한 프로미스가 settled 상태가 될 때까지 대기한다.
- 2. 이후 프로미스가 settled 상태가 되면 프로미스가 resolve한 처리 결과가 res 변수에 할당된다.

```js
async function foo() {
  const a = await new Promise(resolve => setTimeout(() => resolve(1), 3000))
  const b = await new Promise(resolve => setTimeout(() => resolve(1), 2000))
  const a = await new Promise(resolve => setTimeout(() => resolve(1), 1000))

  console.log([a, b, c]) // [1, 2, 3]
}

foo() // 약 6초 소요
```

- 만약 서로 연관이 없이 개별적으로 수행되는 비동기 처리라면 앞선 비동기 처리가 완료될 때까지 대기해서 순차적으로 처리할 필요가 없다.

```js
async function foo() {
  const res = await Promise.all([
    new Promise(resolve => setTimeout(() => resolve(1), 3000))
    new Promise(resolve => setTimeout(() => resolve(2), 2000))
    new Promise(resolve => setTimeout(() => resolve(3), 1000))
  ])

  console.lolg(res) // [1, 2, 3]
}

foo() // 약 3초 소요
```

- 비동기 처리의 처리 순서가 보장되어야 한다면 모든 프로미스에 await 키워드를 써서 순차적으로 처리해야 한다.

```js
async function bar() {
  const a = await new Promise(resolve => setTimeout(() => resolve(n), 3000))
  const b = await new Promise(resolve => setTimeout(() => resolve(a + 1), 2000))
  const c = await new Promise(resolve => setTimeout(() => resolve(b + 1), 1000))

  console.log([a, b, c]) // [1, 2, 3]
}

bar(1) // 약 6초 소요
```

#### 에러 처리

- 비동기 처리를 위한 콜백 패턴 -> 에러 처리가 어려움
- 에러는 호출자 방향으로 전파된다.
- 즉, 콜 스택 아래 방향(실행 중인 실행 컨텍스트가 푸시되기 직전에 푸시된 실행 컨텍스트 방향)으로 전파된다.
- 하지만 비동기 함수의 콜백 함수를 호출한 것은 비동기 함수가 아니기 때문에 try...catch 문을 사용해 에러를 캐치할 수 없다.

```js
try {
  setTimeout(() => {
    throw new Error('Error!')
  }, 1000)
} catch (err) {
  // 에러를 캐치하지 못함
  console.error('캐치한 에러', err)
}
```

- async/await에서 에러 처리는 try...catch 문을 사용할 수 있다.
  - catch 문을 통해 HTTP 통신에서 발생한 네트워크 에러뿐 아니라 try 코드 블록 내의 모든 문에서 발생한 일반적인 에러까지 모두 캐치 가능
  - 만약 async 함수 내에서 catch 문을 사용해서 에러 처리를 하지 않으면 async 함수는 발생한 에러를 reject하는 프로미스를 반환
- 프로미스를 반환하는 비동기 함수는 명시적으로 호출할 수 있기 때문에 호출자가 명확하다.

#### try...catch 구문으로 에러 처리

```js
const foo = async () => {
  try {
    const wrongUrl = 'https://wrong.url'

    const response = await fetch(wrongUrl)
    const data = response.json()
    console.log(data)
  } catch (err) {
    console.error(err) // TypeError: Failed to fetch
  }
}
```

#### catch 후속 처리 메서드로 에러 처리

```js
const foo = async () => {
  const wrongUrl = 'https://wrong.url'

  const response = await fetch(wrongUrl)
  const data = response.json()
  return data
}

foo().then(console.log).catch(console.error) // TypeError: Failed to fetch
```

## 47장 에러 처리

### 47.1 에러 처리의 필요성

> [!NOTE]
> 에러는 언제나 발생할 수 있다.
> 언제나 에러나 예외적인 상황이 발생할 수 있다는 것을 전제하고 이에 대응하는 코드를 작성하는 것이 중요하다.

- 발생한 에러에 대해 대처하지 않고 방치하면 프로그램은 강제 종료된다.

#### 에러 처리가 필요한 경우 1

```js
console.log('[Start]')

// 발생한 에러를 방치하면 프로그램이 강제 종료됨
foo() // ReferenceError: foo is not defined

// 에러에 의해 프로그램이 강제 종료되어 아래 코드는 실행되지 않음
console.log()
```

#### 에러 처리가 필요한 경우 2: querySelector 메서드

- 직접적으로 에러를 발생하지 않는 예외적인 상황이 발생할 수도 있음
  - DOM에 요소가 존재하지 않으면 querySelector 메서드는 에러를 발생시키지 않고 null 반환

```js
const $button = docuement.querySelector('button') // null

$button.classList.add('disabled')
// TypeError: Cannot read property 'classList' of null
```

- CSS 선택자 문법에 맞지 않는 경우 에러 발생

```js
const $elem = document.querySelector('#1')
// DOMException: Failed to execute 'querySelector' on 'Document': '#1' is not a valid selector.
```

- 인수로 전달한 CSS 선택자 문자열로 DOM에서 요소 노드를 찾을 수 없는 경우 에러를 발생시키지 않고 null 반환
  - if 문으로 반환값을 확인 / 단축 평가 또는 옵셔널 체이닝(`?.`) 사용하지 않으면 -> 다음 처리에서 에러 발생

```js
const $button = document.querySelector('button') // null
$button?.classList.add('disabled')
```

- 예외적인 상황이 발생하면 반환하는 값(null 또는 -1)을 확인해서 처리하는 방법
  - if 문이나 단축 평가 또는 옵셔널 체이닝 연산자
- 에러 처리 코드를 미리 등록해 두고 에러가 발생하면 에러 처리 코드로 점프하도록 하는 방법
  - try...catch...finally: 보통의 에러 처리(error handling)

### 47.2 try...catch...finally 문

- 보통의 에러 처리 방법으로 catch, finally 문은 생략 가능하다.
- 하지만 catch 문이 없는 try 문은 의미가 없으므로 catch 문은 생략하지 않는다.

```js
try {
  // 실행할 코드(에러가 발생할 가능성이 있는 코드)
} catch (err) {
  // try 코드 블록에서 에러가 발생하면 이 코드 블럭의 코드 실행
  // err에는 try 코드 블록에서 발생한 Error 객체 전달
} finally {
  // 에러 발생과 상관없이 반드시 한 번 실행
}
```

#### try...catch...finally 문 동작 과정

> [!NOTE]
> try...catch...finally 문으로 에러를 처리하면 프로그램이 강제 종료되지 않는다.

- try 코드 블록 실행 -> try 코드 블록에서 발생한 에러는 catch 문의 err 변수에 전달
- catch 코드 블록 실행 -> catch 문의 err 변수는 try 코드 블록에 포함된 문 중에서 발생되는 에러이며 catch 코드 블록에서만 유효
- fianlly 코드 블록 실행 -> 에러 발생 상관없이 반드시 한 번 실행

```js
console.log('[Start]')

try {
  foo()
} catch (err) {
  // err에 try 코드 블록에서 발생한 Error 객체 전달
  console.error(err) // ReferenceError: foo is not defined
} finally {
  console.log('finally')
}

console.log('[End]')
```

### 47.3 Error 객체

> [!NOTE]
> Error 생성자 함수는 에러 객체를 생성한다. Error 생성자 함수에는 에러를 상세히 설명하는 에러 메세지를 인수로 전달할 수 있다.

```js
const error = new Error('invalid')
```

- Error 생성자 함수가 생성한 에러 객체
  - message 프로퍼티: Error 생성자 함수에 인수로 전달한 에러 메시지
  - stack 프로퍼티: 에러를 발생시킨 콜스택의 호출 정보를 나타내는 문자열이며 디버깅 목적으로 사용

#### 에러 객체의 종류

- 모두 Error.prototype을 상속받는다.

| 생성자 함수    | 인스턴스                                                                       |
| -------------- | ------------------------------------------------------------------------------ |
| Error          | 일반적 에러 객체                                                               |
| SyntaxError    | 자바스크립트 문법에 맞지 않는 문을 해석할 때 발생하는 에러 객체                |
| ReferenceError | 참조할 수 없는 식별자를 참조했을 때 발생하는 에러 객체                         |
| TypeError      | 피연산자 또는 인수의 데이터 타입이 유효하지 않을 때 발생하는 에러 객체         |
| RangeError     | 숫자값의 허용 범위를 벗어났을 때 발생하는 에러 객체                            |
| URIError       | encodeURI 또는 decodeURI 함수에 부적절한 인수를 전달했을 때 발생하는 에러 객체 |
| EvalError      | eval 함수에서 발생하는 에러 객체                                               |

### 47.4 throw 문

- 에러 객체 생성과 에러 발생은 의미가 다르다.
- 에러를 발생시키려면 try 코드 블록에서 throw 문으로 에러 객체를 던져야 한다.

```js
throw 표현식
```

- throw 문의 표현식은 어떤 값이라도 상관없지만 일반적으로 에러 객체를 지정한다.
- 에러를 던지면 catch 문의 에러 변수가 생성되고 던져진 에러 객체가 할당된다. 그리고 catch 코드 블록이 실행되기 시작한다.

```js
try {
  throw new Error('something wrong')
} catch (error) {
  console.log(error)
}
```

```js
const repeat = (n, f) => {
  if (typeof f !== 'function') throw new TypeError('f must be a function')

  for (var i = 0; i < n; i++) {
    f(i)
  }
}

try {
  repeat(2, 1)
} catch (err) {
  // 두 번째 인수가 함수가 아니므로 TypeError가 발생(throw)한다.
  console.error(err) // TypeError: f must be a function
}
```

### 47.5 에러의 전파

- 에러는 호출자 방향으로 전파된다.
- 즉, 콜 스택의 아래 방향(실행 중인 실행 컨텍스트가 푸시되기 직전에 푸시된 실행 컨텍스트 방향)으로 전파된다.

```js
const foo = () => {
  throw Error('foo에서 발생한 에러') // (4)
}

const bar = () => {
  foo() // (3)
}

const baz = () => {
  bar() // (2)
}

try {
  baz() // (1)
} catch (err) {
  console.error(err)
}
```

- `baz()` -> `bar()` -> `foo()` -> `throw Error` 순으로 에러가 전파되어 전역에서 캐치된다.
- throw된 에러를 캐치하지 않으면 호출자 방향으로 전파되기 때문에 throw된 에러를 캐치하여 적절히 대응하는 것이 중요하다!
- 주의할 것은 비동기 함수인 setTimeout이나 프로미스 후속 처리 메서드의 콜백 함수는 호출자가 없다는 것이다.
- setTimeout이나 프로미스 후속 처리 메서드의 콜백 함수는 태스크 큐나 마이크로태스크 큐에 일시 저장되었다가 콜 스택이 비면 이벤트 루프에 의해 콜 스택으로 푸시되어 실행된다.
- 이때 콜 스택에 푸시된 콜백 함수의 실행 컨텍스트는 콜 스택의 가장 하부에 존재하기 때문에 에러를 전파할 호출자가 존재하지 않는다.
