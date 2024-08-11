# Morden JavaScript Deep Dive

Dasom, 2024.08.11

## 45장 프로미스

### 비동기 처리를 위한 콜백 패턴의 단점

* 비동기 처리 결과를 외부로 반환하거나, 상위 스코프의 변수에 할당하면 기대한대로 동작하지 않음
* 비동기 처리 결과에 대한 후속처리를 수행하는 비동기 처리 함수를 중첩해서 만들어야하는 콜백 헬 발생

* try ... catch... finally 문으로 에러 처리에 한계가 존재



### 프로미스

**프로미스의 상태**

- **대기(pending)**: 초기 상태, 비동기 작업이 아직 완료되지 않은 상태
- **이행(fulfilled)**: 비동기 작업이 성공적으로 완료된 상태로, 이행된 값을 가짐
- **거부(rejected)**: 비동기 작업이 실패한 상태로, 거부된 이유를 가짐

프로미스는 `pending` 상태에서 시작하여, 작업이 완료되면 `fulfilled` 또는 `rejected` 상태로 바뀜. 상태가 변한 후에는 더 이상 상태가 바뀌지 않음



**프로미스 생성**

* 프로미스는 `new Promise()` 생성자를 통해 생성
* 생성자는 두 개의 함수를 인자로 받음: `resolve,` `reject`. 
* 비동기 작업이 성공하면 `resolve`를 호출해 프로미스를 이행 상태로 만들고, 실패하면 `reject`를 호출해 프로미스를 거부 상태로 만듦

```javascript
const promise = new Promise((resolve, reject) => {
    // 비동기 작업 수행
    const success = true;

    if (success) {
        resolve('작업 성공');
    } else {
        reject('작업 실패');
    }
});
```



**프로미스 처리: `then`, `catch`, `finally`**

- **`then(onFulfilled, onRejected)`**: 프로미스가 이행될 때 호출될 콜백을 설정. 첫 번째 인자로 이행 콜백을, 두 번째 인자로 거부 콜백을 전달할 수 있음

  ```javascript
  promise.then(
      result => console.log(result), // 작업 성공
      error => console.error(error)  // 작업 실패
  );
  ```

- **`catch(onRejected)`**: 프로미스가 거부될 때 호출될 콜백을 설정. `then` 메서드와는 달리 오직 거부 상태만 처리함

  ```javascript
  promise.catch(error => console.error(error));
  ```

- **`finally(callback)`**: 프로미스가 이행되거나 거부된 후 무조건 실행될 코드를 설정. 결과에 상관없이 실행되므로, 정리 작업 등에 사용됨

  ```javascript
  promise.finally(() => console.log('작업 종료'));
  ```



**프로미스 체이닝**

프로미스를 사용하면 `then` 메서드를 체인으로 연결해 비동기 작업을 순차적으로 처리할 수 있음. 이전 `then`에서 반환된 값이 다음 `then`의 인자로 전달

```javascript
new Promise((resolve, reject) => {
    resolve(1);
})
.then(result => {
    console.log(result); // 1
    return result * 2;
})
.then(result => {
    console.log(result); // 2
    return result * 3;
})
.then(result => {
    console.log(result); // 6
});
```



**프로미스 정적 메서드**

* **`Promise.all(promises)`**: 여러 프로미스를 병렬로 처리하고, 모든 프로미스가 이행되면 결과를 배열로 반환. 하나라도 거부되면 전체가 거부됨.

```javascript
Promise.all([promise1, promise2, promise3])
    .then(results => console.log(results))
    .catch(error => console.error(error));
```

* **`Promise.race(promises)`**: 전달된 프로미스 중 가장 먼저 이행되거나 거부된 프로미스의 결과를 반환

```javascript
Promise.race([promise1, promise2, promise3])
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

* **`Promise.allSettled(promises)`**: 모든 프로미스가 완료될 때까지 기다리며, 각 프로미스의 상태(이행 또는 거부)를 포함하는 객체 배열을 반환

```javascript
Promise.allSettled([promise1, promise2, promise3])
    .then(results => console.log(results));
```

* **`Promise.any(promises)`**: 전달된 프로미스 중 하나라도 이행되면 해당 결과를 반환하며, 모든 프로미스가 거부될 경우에만 에러를 반환

```javascript
Promise.any([promise1, promise2, promise3])
    .then(result => console.log(result))
    .catch(error => console.error(error));
```



**마이크로태스크 큐**

>  프로미스의 후속 처리 메서드의 콜백함 수는 마이크로태스크 큐에 일시 저장되며, 이 마이크로태스크 큐는 태스크큐보다 우선순위가 높다.

```js
setTimeout(() => console.log(1), 0);

Promise.resolve()
	.then(() => console.log(2))
	.then(() => console.log(3))

// 출력 결과 2 3 1
```



### fetch

> XMLHttpRequest 객체보다 사용법이 간단하고 프로미스를 지원하기 때문에 최근에는 HTTP 요청 전송 기능을 구현하기 위해 fetch를 주로 사용한다.



**fetch 에러 처리 시 주의점**

>fetch함수가 반환하는 프로미스는 HTTP에러가 발생해도 에러를 reject하지 않고 불리언 타입의 ok상태를 false로 설정한 Response 객체를 resolve함
>
>오프라인 등 네트워크 장애나 CORS 에러에 의해 요청이 완료되지 못한 경우에만 프로미스를 reject함

```js
const wrongUrl = "https://wrong.com/xxx/1"

// 404 error
fetch(wrongUrl)
	.then(() => console.log("ok"))
	.catch(() => console.log("error"))

// 출력결과: ok

// 에러를 올바르게 처리하는 방법
fetch(wrongUrl)
	.then(respnse => {
  if (!response.ok) throw new Error(response.statusText);
  console.log("ok")
})
	.catch(() => console.log("error"))
```



## 46장 제너레이터와 async/await

### 제너레이터

> **제너레이터(Generator)**는 자바스크립트에서 코드의 실행을 중간에 멈추고, 필요할 때 다시 실행을 재개할 수 있는 특별한 함수이다. 제너레이터는 `function*` 키워드로 정의되며, `yield` 키워드를 사용해 함수의 실행을 일시 중지할 수 있다.

**제너레이터 함수의 정의**

```js
function* generatorFunction() {
    yield 1;
    yield 2;
    yield 3;
}

// *의 위치는 function키워드와 함수 이름 사이라면 어디든지 상관 없다.
function * generatorFunction() {...}
function *generatorFunction() {...}
function*generatorFunction() {...}
```

* 제너레이터 함수는 화살표 함수로 정의할 수 없다
* 제너레이터 함수는 new 연산자와 함께 생성자 함수로 호출할 수 없다



**제너레이터 객체**

```js
const iterator = generatorFunction();

console.log(iterator.next()); // { value: 1, done: false }
console.log(iterator.next()); // { value: 2, done: false }
console.log(iterator.next()); // { value: 3, done: false }
console.log(iterator.return('End!')); // { value: 'End!', done: true }
```

* 일반 함수처럼 코드 블록을 실행하는 것이 아니라 제너레이터 객체를 생성해 반환함
* 제너레이터가 반환한 제너레이터 객체는 이터러블이면서 동시에 이터레이터다

* next 메서드를 호출하면 제너레이터 함수의 yield 표현식까지 코드블록을 실행하고, yied로 된 값을 value 프로퍼티 값으로, false를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체를 반환
* return 메서드를 호출하면 인수로 전달받은 값을 value로, true를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체를 반환



**제너레이터의 일시 중지와 재개**

제너레이터의 핵심 기능 중 하나는 코드의 실행을 **일시 중지**하고, 필요할 때 **재개**할 수 있다는 것이다.

* 일시 중지 (`yield`)
  * `yield` 키워드는 제너레이터 함수 내에서 사용되며, 함수의 실행을 일시 중지하고 `yield`된 값을 호출자에게 반환
  * 제너레이터는 `yield`에서 멈춘 상태로 대기하며, `next()` 메서드가 호출되면 그 지점에서부터 다시 실행을 시작

```javascript
function* countUp() {
    console.log('Start');
    yield 1;
    console.log('Continue');
    yield 2;
    console.log('End');
    return 3;
}

const counter = countUp();

console.log(counter.next()); // Start
                             // { value: 1, done: false }
console.log(counter.next()); // Continue
                             // { value: 2, done: false }
console.log(counter.next()); // End
                             // { value: 3, done: true }
```

* 재개 (`next()`)
  * `next()` 메서드는 제너레이터의 실행을 재개
  * `yield` 키워드가 있는 위치에서 실행이 멈추고, 이후의 코드가 실행 됨. 또한, `next()` 메서드에 값을 전달하면, 그 값이 마지막 `yield` 표현식의 결과로 사용됨

```javascript
function* greet() {
    const name = yield 'What is your name?';
    yield `Hello, ${name}!`;
}

const greeter = greet();

console.log(greeter.next());        // { value: 'What is your name?', done: false }
console.log(greeter.next('Alice')); // { value: 'Hello, Alice!', done: false }
console.log(greeter.next());        // { value: undefined, done: true }
```



**제너레이터의 활용**

* 이터러블 구현

```js
function* arrayIterator(array) {
    for (let item of array) {
        yield item;
    }
}

const it = arrayIterator([1, 2, 3]);

console.log(it.next()); // { value: 1, done: false }
console.log(it.next()); // { value: 2, done: false }
console.log(it.next()); // { value: 3, done: false }
console.log(it.next()); // { value: undefined, done: true }


// 무한 이터러블인 피보나치 구현
function* infiniteSequence() {
    let i = 0;
    while (true) {
        yield i++;
    }
}

const seq = infiniteSequence();

console.log(seq.next().value); // 0
console.log(seq.next().value); // 1
console.log(seq.next().value); // 2
// 계속해서 값을 생성할 수 있음
```

* 비동기처리

```js
function* fetchData() {
    const data1 = yield fetch('https://api.example.com/data1').then(res => res.json());
    console.log(data1);

    const data2 = yield fetch('https://api.example.com/data2').then(res => res.json());
    console.log(data2);
}

const gen = fetchData();

gen.next().value.then(data1 => {
    gen.next(data1).value.then(data2 => {
        gen.next(data2);
    });
});

```



### async/await

> 제너레이터를 사용해 비동기 처리를 동기 처리처럼 구현하는 경우 코드가 장황해지고 가독성이 나빠짐. 이에 대한 해결책으로 ES8에서는 제너레이터보다 간단하고 가독성 좋게 구현할 수 있는 async/await이 도입됨

**async 함수**

`async` 키워드는 함수 앞에 붙여 그 함수가 프로미스를 반환하도록 만듦. -> `async` 함수 내에서 반환된 값은 자동으로 프로미스 형태로 감싸져 반환됨

```javascript
async function asyncFunction() {
    return 'Hello, World!';
}

asyncFunction().then(value => console.log(value)); // Hello, World!
```



**Await 키워드**

`await` 키워드는 `async` 함수 내에서만 사용할 수 있으며, 프로미스가 이행될 때까지 함수 실행을 일시 중지함. `await`는 프로미스를 기다린 후, 프로미스가 이행되면 그 결과 값을 반환.

```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchData();
```



**에러처리**

`async/await`에서는 일반적인 `try...catch` 블록을 사용해 에러를 처리할 수 있음. `await` 키워드로 기다린 프로미스가 거부될 경우, `catch` 블록에서 이를 처리할 수 있음.

```javascript
async function fetchData() {
    try {
        const response = await fetch('https://api.example.com/data');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        console.log(data);
    } catch (error) {
        console.error('Fetch error:', error);
    } finally {
        console.log('Fetch operation complete');
    }
}

fetchData();
```

* async 함수 내에서 catch를 통해 에러처리를 하지 않으면, async함수는 발생한 에러를 reject하는 프로미스를 반환함. 따라서 async 함수를 호출하고, Promise.prototype.catch 후속 처리를 통해 에러를 처리할 수 있음



## 47장 에러 처리



**try...catch...finally문**

기본적인 에러처리 방식

* 반환하는 값을 if문이나 단축평가 옵션 또는 옵셔널 체이닝 연산자를 통해 처리하는 방법
* try...catch...finally문과 같이 에러 처리 코드를 미리 등록해두고 에러가 발생하면 에러 처리 코드로 점프하는 경우 (보통 이 것을 에러처리라고 함)



**Error 객체**

에러 생성자 함수

* Error
* SyntaxError
* ReferenceError
* TypeError
* RangeError
* URIError: encodeURI or decodeURI 함수에 부적절한 인수를 전달했을 때 발생하는 에러
* EvalError: Eval 함수에서 발생하는 에러



**throw문**

에러를 발생시키려면 try 코드 블록에서 throw 문으로 에러 객체를 던져야함

```js
try{
  throw new Error("Wrong!")
} catch (error) {
  console.log(error)
}
```



**에러의 전파**

throw된 에러를 캐치하지 않으면 호출자 방향으로 전파됨

```js
const foo = () => {
  throw Error("foo error")
}

const bar = () => foo()
const baz = () => bar()

try{
  baz();
} cath(err) {
  console.log(err) // foo error
}
```



## 느낀점

async/await도 사실 처음 접했을 때는 굉장히 이해하기 어려웠는데, 제너레이터라는 개념을 보면서 async/await의 시대에 살고 있음에 감사하게 되었다. 결국은 더 사용하기 쉬운 방향으로 나아가고 있다는 것이 확실히 와닿았고, 최신 동향에 둔감해지면 내가 더 쉽게 갈 수 있는 길을 포기하는 것이겠구나 싶었다. 이 스터디가 끝나면 최근 업데이트를 살펴보는 기회를 가져야겠다.

이렇게 나아감과 별개로, async/await이 어려웠던 시절에는 Promise를 주로 사용했던 기억이 있다. 다른 사람들은 비동기 처리를 위해 어떤 것을 가장 많이 사용하는지, 이것은 단순 기호에 의해 사용되는 것일지 궁금하다. 

Plus로, 에러 처리 관련해서, 출력을 수행하는 함수가 있었을 때, 해당 함수에서 catch 블록이 동작하고 있어서, 그 함수를 가져다 사용하는 컴포넌트에서 에러가 처리되지 않아 당황한 경험이 있다. 하단에서 처리하기 위해 별도로 다시 error를 throw해야 하긴 했지만, 이런 식으로 각 함수들마다 에러를 처리하는 곳이 달라 난처했던 경험이 있다. 다들 협업을 할 때 에러를 처리하는 위치가 사전에 합의되어 있는지 궁금해졌다. 
