## 45장 프로미스
- 전통적인 콜백 패턴은 콜백 헬로 인해 가독성이 나쁘고 비동기 처리 중 발생한 에러의 처리가 곤란하며 여러 개의 비동기 처리를 한꺼번에 처리하는 데도 한계가 있다.
- 프로미스는 콜백 패턴의 단점을 보완하며 비동기 처리를 더욱 효율적으로 할 수 있도록 ES6에 도입된 객체이다.

### 45.1 비동기 처리를 위한 콜백 패턴의 단점
#### 45.1.1 콜백 헬
- 비동기 함수를 호출하면 함수 내부의 비동기로 동작하는 코드가 완료되지 않았다 해도 기다리지 않고 즉시 종료된다.
- 따라서 함수 내부의 비동기로 동작하는 코드에서 처리 결과를 외부로 반환하거나 상위 스코프의 변수에 할당하면 기대한대로 동작하지 않는다.
- 따라서 비동기 함수의 처리 결과(서버의 응답 등)에 대한 후속 처리는 비동기 함수 내부에서 수행해야 한다.
```javascript
const get = url => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
        
    
    xhr.onload = () => {
        if (xhr.status === 200) {
            console.log(JSON.parse(xhr.responseText));
            return JSON.parse(xhr.responseText);
        }
        console.error('Error:', xhr.status, xhr.statusText);
    };
    
    const response = get('https://jsonplaceholder.typicode.com/todos/1');
    console.log(response); // undefined
}
```

- 비동기 함수를 범용적으로 사용하기 위해 비동기 함수에 후속 처리를 수행하는 콜백 함수를 전달하는 것이 일반적이다.
```javascript
const get = (url, successCallbak, failureCallback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    
    xhr.onload = () => {
        if (xhr.status === 200) {
            successCallbak(JSON.parse(xhr.responseText));
        } else {
            failureCallback(new Error(xhr.statusText));
        }
    };
    
    xhr.send();
};

get('https://jsonplaceholder.typicode.com/todos/1', 
    response => console.log(response),
    error => console.error(error)
);
```

- 이러한 콜백 패턴은 콜백 헬이라는 문제를 야기한다.
```javascript
const get = (url, callback) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    
    xhr.onload = () => {
        if (xhr.status === 200) {
            callback(null, JSON.parse(xhr.responseText));
        } else {
            console.error('Error:', xhr.status, xhr.statusText);
        }
    };
    
    xhr.send();
}
get ('https://jsonplaceholder.typicode.com/todos/1', ( {userId } ) => {
   get(`https://jsonplaceholder.typicode.com/users/${userId}`, ( { name } ) => {
       console.log(name);
   }); 
});
```

#### 45.1.2 에러 처리의 한계
- 콜백 패턴은 비동기 처리 중 발생한 에러의 처리가 곤란하다.
```javascript
try {
    setTimeout(() => {
        throw new Error('Error!');
    }, 1000);
} catch (error) {
    // 에러를 캐치하지 못한다.
    console.error(error);
}
```
- setTimeout의 콜백함수가 실행될 때 setTimeout 함수는 이미 콜 스택에서 제거된 상태다.
- 이것은 콜백 함수를 호출한 것이 setTimeout 함수가 아니라는 것을 의미한다.
- 에러는 호출자(caller) 방향으로 전파된다. 즉, 콜 스택의 아래 방향으로 전파된다.
- 따라서 setTimeout 함수는 에러를 캐치할 수 없다.

### 45.2 프로미스의 생성
- 프로미스는 표준 빌트인 객체로 promise 생성자 함수를 New 연산자와 함께 호출하면 프로미스를 생성한다.
- 프로미스 생성자 함수는 비동기 작업을 수행할 콜백 함수를 인수로 전달받는데 이 콜백 함수는 resolve와 reject 함수를 인수로 전달받는다.
- resolve 함수는 비동기 작업이 성공적으로 처리된 경우에 호출하며, reject 함수는 비동기 작업이 실패한 경우에 호출한다.
```javascript
const PromiseGet = url => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        
        xhr.onload = () => {
            if (xhr.status === 200) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error(xhr.statusText));
            }
        };
    })
}
```

프로미스는 다음과 같이 현재 비동기 처리가 어떻게 진행되고 있는지를 나타내는 상태 정보를 갖는다.

| 프로미스의 상태 정보 | 의미 | 상태 변경 조건 |
| --- | --- | --- |
| pending | 비동기 처리가 아직 수행되지 않은 상태 | new Promise()로 프로미스를 생성한 직후 |
| fulfilled | 비동기 처리가 성공적으로 수행된 상태 | resolve 함수가 호출된 상태 |
| rejected | 비동기 처리가 실패한 상태 | reject 함수가 호출된 상태 |

- 비동기 처리 성공: resolve 함수를 호출해 프로미스를 fulfilled 상태로 변경한다.
- 비동기 처리 실패: reject 함수를 호출해 프로미스를 rejected 상태로 변경한다.
- 프로미스는 단 한 번만 상태를 변경할 수 있으며 상태가 변경되면 프로미스의 상태는 불변이다.
- 프로미스는 비동기 처리 상태와 더불어 비동기 처리 결과도 상태로 갖는다.

### 45.3 프로미스의 후속 처리 메서드
- 프로미스의 후속 처리 메서드는 프로미스의 비동기 처리 상태가 변화되었을 때 후속 처리를 수행하는 콜백 함수를 등록하는 메서드다.

#### 45.3.1 Promise.prototype.then
- then 메서드는 두 개의 콜백 함수를 인수로 전달받는다.
  - 첫 번째 콜백 함수: 프로미스가 fulfilled 상태가 되면 호출된다.
  - 두 번째 콜백 함수: 프로미스가 rejected 상태가 되면 호출된다.
```javascript
new Promise(resove => resolve('fulfilled')).then(v => console.log(v), e => console.error(e)); // fulfilled

new Promise((_, reject)=> reject(new Error('rejected'))).then(v=> console.log(v), e=>console.error(e)) // Error: rejected
```
- then 메서드는 언제나 프로미스를 반환한다. 만약 콜백함수가 프로미스가 아닌 값을 반환하면 그 값을 암묵적으로 resolve 또는 reject하여 프로미스를 생성해 반환한다.

#### 45.3.2 Promise.prototype.catch
- catch 메서드는 프로미스가 rejected 상태가 되었을 때 호출될 콜백 함수를 등록한다.
- catch 메서드는 then(undefined, onRejected)와 동일하게 동작한다. 따라서 then 메서드와 마찬가지로 언제나 프로미스를 반환한다.

#### 45.3.3 Promise.prototype.finally
- finally 메서드는 프로미스의 처리 상태와 상관없이 무조건 한 번 호출된다.
- finally 메서드는 공통적으로 수행해야 할 처리 내용이 있을 때 유용하다.

### 45.4 프로미스의 에러 처리
- then 메서드에 두번째 콜백함수를 전달하는 방식과 catch 메서드를 사용하는 것 중 후자가 더 권장된다.
- 가독성 면에서 catch 메서드를 사용하는 것이 더 좋고 catch 메서드를 모든 then 메서드를 호출한 이후에 호출하면 비동기 처리에서 발생한 에러 뿐만 아니라 then 메서드 내부에서 발생한 에러까지 모두 캐치할 수 있다.

### 45.5 프로미스 체이닝
- then, catch, finally 후속 처리 메서드는 언제나 프로미스를 반환하므로 연속적으로 호출할 수 있다. 이를 프로미스 체이닝이라 한다.
- 콜백 패턴은 가독성이 좋지 않다. 이 문제는 ES8에서 도입된 async/await 문법으로 해결할 수 있다.

### 45.6 프로미스의 정적 메서드
#### 45.6.1 Promise.resolve / Promise.reject
- Promise.resolve와 Promise.reject 메서드는 이미 존재하는 값을 래핑하여 프로미스를 생성하기 위해 사용한다.
```javascript
const resolvedPromise = Promise.resolve('fulfilled');
const resolvedPromise2 = new Promise(resolve => resolve('fulfilled'));

const rejectedPromise = Promise.reject(new Error('rejected'));
const rejectedPromise2 = new Promise((_, reject) => reject(new Error('rejected')));
```

#### 45.6.2 Promise.all
- Promise.all 메서드는 여러 개의 비동기 처리를 모두 병렬 처리할 때 사용한다.
```javascript
const requestData1 = () => new Promise(resolve => setTimeout(() => resolve(1), 3000));
const requestData2 = () => new Promise(resolve => setTimeout(() => resolve(2), 2000));
const requestData3 = () => new Promise(resolve => setTimeout(()=> resolve(3), 1000));

const res = [];
requestData1().then(data => {
    res.push(data);
    return requestData2();
}).then(data => {
    res.push(data);
    return requestData3();
}).then(data => {
    res.push(data);
    console.log(res); // [1,2,3] => 약 6초 소요
}).catch(console.error)
```
- 위 예제는 세 개의 비동기 처리가 순차적으로 진행되므로 약 6초가 소요된다. 이를 병렬로 처리하려면 Promise.all 메서드를 사용한다.
```javascript
Promise.all([requestData1(), requestData2(), requestData3()]).then(console.log); // [1,2,3] => 약 3초 소요
```
- Promise.all 메서드는 인수로 전달받은 프로미스가 모두 fulfilled 상태가 되면 이행되는 프로미스를 반환한다. 만약 인수로 전달받은 배열의 프로미스가 하나라도 rejected 상태가 되면 나머지 프로미스가 처리되지 않아도 즉시 종료한다.
- Promise.all 메서드는 인수로 전달받은 이터러블의 요소가 프로미스가 아닌 경우 Promise.resolve 메서드를 통해 프로미스로 래핑한다.
```javascript
Promise.all([1,2,3]).then(console.log); // [1,2,3]
```

#### 45.6.3 Promise.race
- Promise.race 메서드는 Promise.all 메서드와 동일하게 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달받는다.
- Promise.race는 가장 먼저 Fulfilled 상태가 된 프로미스의 처리 결과를 resolve하는 새로운 프로미스를 반환한다.
- 프로미스가 rejected 상태가 되면 Promise.all 메서드와 동일하게 처리된다.
```javascript
Promise.race([
    new Promise(resolve => setTimeout(() => resolve(1), 3000)),
    new Promise(resolve => setTimeout(() => resolve(2), 2000)),
    new Promise(resolve => setTimeout(() => resolve(3), 1000)), 
]).then(console.log) // 3
```

#### 45.6.4 Promise.allSettled
- Promise.allSettled 메서드는 모든 프로미스가 settled 상태가 되면 이행되는 프로미스를 반환한다.
- Promise.allSettled 메서드가 반환한 배열에는 fulfilled 또는 rejected 상태와는 상관 없이 모든 프로미스의 처리 결과가 담겨 있다.
```javascript
Promise.allSettled([
    new Promise(resolve => setTimeout(() => resolve(1), 3000)),
    new Promise((_, reject) => setTimeout(() => reject(new Error('Error')), 2000)),
    new Promise(resolve => setTimeout(() => resolve(3), 1000)),
]).then(console.log);

/*
[
    { status: 'fulfilled', value: 1 },
    { status: 'rejected', reason: Error: Error at <anonymous>:2:47 }
    { status: 'fulfilled', value: 3 }
]
*/
```

### 45.7 마이크로태스크 큐
```javascript
setTimeout(()=> console.log(1), 0);

Promise.resolve().then(() => console.log(2)).then(()=> console.log(3));
// 2 -> 3 -> 1
```
- 프로미스 후속 처리 메서드의 콜백 함수는 태스크 큐가 아니라 마이크로 태스크 큐에 저장되므로 태스크 큐보다 우선순위가 높다.
- 따라서 위 예제 같은 결과가 나오는 것이다.

### 45.8 fetch
- fetch 함수는 XMLHttpRequest 객체와 마찬가지로 HTTP 요청 전송 기능을 제공하는 클라이언트 사이드 Web API다.
- fetch 함수는 XMLHttpRequest 객체보다 사용법이 간단하고 프로미스를 지원하기 때문에 비동기 처리를 위한 콜백 패턴의 단점에서 자유롭다.
- fetch 함수를 사용할 때는 에러 처리에 주의해야 한다.
```javascript
const wrongUrl = 'https://jsonPlaceholder.typicode.com/XXX/1';

// 부적절한 URL이 지정되었기 때문에 404 Not Found 에러가 발생한다.
fetch(wrongUrl)
    .then(()=>console.log('ok'))
    .catch(()=>console.error('error')); // error
```
- fetch 함수가 반환하는 프로미스는 기본적으로 404 Not Found나 500 Internal Server Error와 같은 HTTP 에러가 발생해도 에러를 reject하지 않고 불리언 타입의 Ok 상태를 false로 설정한 Response 객체를 resolve한다.
- 오프라인 등의 네트워크 장애나 CORS 에러에 의해 요청이 완료되지 못한 경우에만 프로미스를 reject 한다.
- axios는 모든 HTTP 에러를 reject하는 프로미스를 반환한다. 따라서 모든 에러를 catch에서 처리할 수 있어 편리하다.

## 46장 제너레이터와 async/await
### 46.1 제너레이터란?
- ES6에서 도입된 제너레이터는 코드 블록의 실행을 일시 중지했다가 필요한 시점에 재개할 수 있는 특수한 함수다.
  1. 제너레이터 함수는 함수 호출자에게 함수 실행의 제어권을 양도할 수 있다.
  2. 제너레이터 함수는 함수 호출자와 함수의 상태를 주고받을 수 있다.
  3. 제너레이터 함수를 호출하면 제너레이터 객체를 반환한다.
### 46.2 제너레이터 함수의 정의
- 제너레이터 함수는 function* 키워드로 선언한다. 그리고 하나 이상의 yield 표현식을 포함한다.
```javascript
function* genFunc() {
    yield 1;
}

const genExpFunc = function* () {
    yield 1;
}

const obj = {
    * genObjMethod() {
        yield 1;
    }
}

class MyClass {
    * genClsMethod() {
        yield 1;
    }
}
```
- 애스터리스크(*)의 위치는 function 키워드와 함수 이름 사이라면 어디든지 상관없다. 하지만 일관성을 유지하기 위해 function 키워드 바로 뒤에 붙이는 것을 권장한다.
- 제너레이터 함수는 화살표 함수로 정의할 수 없다.
```javascript
const genArrowFunc = * () => {
    yield 1;
}
```

- 제너레이터 함수는 new 연산자와 함께 호출할 수 없다.
```javascript
function* genFunc() {
    yield 1;
}

new genFunc(); // TypeError: genFunc is not a constructor
```

### 46.3 제너레이터 객체
- 제너레이터 함수를 호출하면 제너레이터 객체를 반환한다. 제너레이터 함수가 반환한 제너레이터 객체는 이터러블이면서 동시에 이터레이터다.
- 제너레이터 객체는 Next 메서드를 갖는 이터레이터지만 이터레이터에는 없는 Return, throw 메서드를 갖는다.
- 제너레이터 객체의 세개의 메서드를 호출하면 다음과 같이 동작한다.
  - next 메서드를 호출하면 제너레이터 함수의 yield 표현식까지 코드 블록을 실행하고 yield 표현식의 평가 결과를 value 프로퍼티에, false를 done 프로퍼티에 할당한 객체를 반환한다.
  - return 메서드를 호출하면 인수로 전달받은 값을 value 프로퍼티 값으로, true를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체를 반환한다.
  - throw 메서드를 호출하면 인수로 전달받은 에러를 던지고, undefined를 value 프로퍼티 값으로, true를 done 프로퍼티 값으로 갖는 이터레이터 리절트 객체를 반환한다.

### 46.4 제너레이터의 일시 중지와 재개
- yield 키워드는 제너레이터 함수의 실행을 일시 중지시키거나 Yield 키워드 뒤에 오는 표현식의 평가 결과를 제너레이터 함수 호출자에게 반환한다.

```javascript
function* getFunc() {
    yield 1;
    yield 2;
    yield 3;
}

const gen = getFunc();

console.log(gen.next()); // { value: 1, done: false }
console.log(gen.next()); // { value: 2, done: false }

```
- 제너레잍터 객체의 Next 메서드를 호출하면 Yield 표현식까지 실행되고 일시 중지된다. 이때 함수의 제어권이 호출자로 양도된다.
- 이때 제너레이터 객체의 Next 메서드는 value, done 프로퍼티를 갖는 이터레이터 리절트 객체를 반환한다.
- 제너레이터 객체의 next 메서드에 전달한 인수는 제너레이터 함수의 yield 표현식을 할당받는 변수에 할당된다.
```javascript
function* genFunc() {
    const x = yield 1;
    const y = yield x + 10;
    return x + y;
}

const gen = genFunc();

// 처음 호출하는 next 메서드에는 인수를 전달할 수 없다.
console.log(gen.next()); // { value: 1, done: false }

// 두 번째 next 메서드 호출에서는 yield 표현식을 평가한 결과를 인수로 전달할 수 있다.
console.log(gen.next(10)); // { value: 20, done: false }
```

### 46.5 제너레이터의 활용
#### 46.5.1 이터러블의 구현
- 제너레이터 함수를 사용하면 이터러블을 간단하게 구현할 수 있다.
```javascript
const infinitefibonacci = function () {
    let [pre, cur] = [0, 1];
    
    return {
      [Symbol.iterator]() { return this; },
        next() {
            [pre, cur] = [cur, pre + cur];
            return { value: cur };
        }
    }
}

for(const num of infinitefibonacci) {
  if(num > 10000) break;
  console.log(num); // 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181 6765
}
```
- 제너레이터 함수를 사용하면 이터러블을 간단하게 구현할 수 있다.
```javascript
const infiniteFibonacci = function* () {
    let [pre, cur] = [0, 1];
    
    while(true) {
        [pre, cur] = [cur, pre + cur];
        yield cur;
    }
}

for(const num of infiniteFibonacci()) {
    if(num > 10000) break;
    console.log(num); // 1 2 3 5 8 13 21 34 55 89 144 233 377 610 987 1597 2584 4181 6765
}
```

#### 46.5.2 비동기 처리
- 제너레이터 함수는 비동기 처리를 위한 콜백 패턴의 단점을 보완하며 비동기 처리를 동기 처리처럼 구현할 수 있다.
```javascript
const fetch = require('node-fetch');

const async = generatorFunc => {
    const generator = generatorFunc();
  
    const onResolved = arg => {
        const result = generator.next(arg);
      
      return result.done ? result.value : result.value.then(res => onResolved(res));
    }
  
  return onResolved;
}

(async(function* fetchTodo(){
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    
    const response = yield fetch(url);
    const todo = yield response.json();
    console.log(todo);
}))
```
위 예제는 다음과 같이 동작한다.
1. async 함수가 호출되면 인수로 전달받은 제너레이터 함수 fetchTodo를 호출하여 제너레이터 객체를 생성하고 onResolved 함수를 반환한다. onResolved 함수는 상위 스코프의 generator 변수를 기억하는 클로저다. async 함수가 반환한 onResolved 함수를 즉시 호출하여 제너레이터 객체의 next 메서드를 처음 호출한다.
2. next 메서드가 처음 호출되면 제너레이터 함수 fetchTodo의 첫번째 yield문까지 실행된다. 이때 제너레이터 함수가 끝까지 실행되지 않았다면 첫번째 yield 된 fetch 함수가 반환한 프로미스가 Resolve한 response객체를 onResolved 함수에 인수로 전달하면서 재귀호출한다.
3. onResolved 함수에 인수로 전달된 response 객체를 Next 메서드에 인수로 전달하면서 next 메서드를 두번째로 호출한다. 이때 next 메서드에 인수로 전달한 Response 객체는 제너레이터 함수 fetchTodo의 response 변수에 할당되고 제너레이터 함수 fetchTodo의 두번째 yield 문까지 실행된다.
4. next 메서드가 반환한 이터레이터 리절트 객체의 done 프로퍼티 값이 false, 즉 아직 제너레이터 함수 fetchTodo가 끝까지 실행되지 않았다면 두번째 yield 된 response.json() 메서드가 반환한 프로미스가 Resolve한 todo 객체를 onResolved 함수에 인수로 전달하면서 재귀호출한다.
5. onResolved 함수에 인수로 전달된 todo 객체를 next 메서드에 인수로 전달하면서 next 메서드를 세번째로 호출한다. 이때 next 메서드에 인수로 전달한 todo 객체는 제너레이터 함수 fetchTodo의 todo 변수에 할당되고 제너레이터 함수 fetchTodo의 세번째 yield 문까지 실행된다.
6. next 메서드가 반환한 이터레이터 리절트 객체의 done 프로퍼티 값이 true, 즉 제너레이터 함수 fetchTodo가 끝까지 실행되었다면 next 메서드가 반환한 value 프로퍼티 값인 todo 객체가 콘솔에 출력된다.

### 46.6 async/await
- async/await는 ES8에서 도입된 비동기 프로그래밍 패턴으로서, 프로미스를 기반으로 동작한다.
```javascript
const fetch = require('node-fetch');

const fetchTodo = async () => {
    const url = 'https://jsonplaceholder.typicode.com/todos/1';
    
    const response = await fetch(url);
    const todo = await response.json();
    console.log(todo);
}
```

#### 46.6.1 async 함수
- async 함수는 function 키워드 앞에 async 키워드를 붙인다. async 함수는 언제나 프로미스를 반환한다.
```javascript
const foo = async () => {
    return 1;
}
```

#### 46.6.2 await 키워드
- await 키워드는 프로미스가 settled 상태가 될 때까지 대기하다가 프로미스가 Resolve한 처리 결과를 반환한다. await 키워드는 반드시 프로미스 앞에서 사용해야 한다.
- 서로 독립적으로 수행되는 비동기 처리는 Promse.all을 사용하는 게 더 좋다.

#### 46.6.3 에러 처리
- async/await은 명시적으로 호출할 수 있기 때문에 호출자가 명확하다.
```javascript
const fetch = require('node-fetch');

const foo = async () => {
    try {
        const response = await fetch('https://json.placeholder.typicode.com/todos/1');
        const todo = await response.json();
        console.log(todo);
    } catch (error) {
        console.error(error);
    }
}

foo();
```

- async 함수 내에서 catch 문을 사용해서 에러 처리를 하지 않으면 async 함수는 발생한 에러를 Reject 하는 프로미스를 반환한다.
- 따라서 Async 함수를 호출하고 promise.prototype.catch 후속 처리 메서드를 사용해 에러를 캐치할 수도 있다.
```javascript
const fetch = require('node-fetch');

const foo = async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const todo = await response.json();
    console.log(todo);
}

foo().then(console.log).catch(console.error);
```

## 47장 에러처리
### 47.1 에러 처리의 필요성
- 에러는 예기치 못한 상황을 의미하며, 에러가 발생하면 프로그램의 실행이 중단된다.
- try catch 문을 사용해 발생한 에러에 적절하게 대응하면 프로그램이 강제 종료되지 않고 계속해서 코드를 실행시킬 수 있다.

### 47.2 try...catch...finally문
- try...catch...finally 문은 예외가 발생할 수 있는 코드를 try 블록에 기술하고, 예외가 발생했을 때의 처리 방법을 catch 블록에 기술한다.
- finally 블록은 예외 발생 여부와 상관없이 반드시 실행되는 코드를 기술한다.
```javascript
try {
    // 예외가 발생할 수 있는 코드
} catch (error) {
    // 예외가 발생했을 때 처리 코드
} finally {
    // 예외 발생 여부와 상관없이 반드시 실행되는 코드
}
```

### 47.3 Error 객체
- Error 생성자 함수는 에러 객체를 생성한다. Error 생성자 함수에는 에러를 상세히 설명하는 에러 메세지를 인수로 전달할 수 있다.
```javascript
const error = new Error('Error message');
```
- Error 생성자 함수가 생성한 에러 객체는 message 프로퍼티와 stack 프로퍼티를 갖는다.
- message 프로퍼티는 에러 객체의 에러 메세지를 나타내며, stack 프로퍼티는 에러를 발생시킨 콜스택의 호출 정보를 나타내는 문자열이며 디버깅 목적으로 사용한다.
- 자바스크립트는 Error 생성자 함수를 포함해 7가지의 에러 객체를 생성할 수 있는 Error 생성자 함수를 제공한다.

| 생성자 함수 | 인스턴스                                                |
| --- |-----------------------------------------------------|
| Error | 일반적 에러 객체                                           |
| SyntaxError | 자바스크립트 문법에 맞지 않는 문을 해석할 때 발생하는 에러 객체                |
| ReferenceError | 존재하지 않는 변수를 참조하려고 시도할 때 발생하는 에러 객체                  |
| TypeError | 변수나 매개변수의 타입이 유효하지 않을 때 발생하는 에러 객체                  |
| RangeError | 숫자값의 허용 범위를 벗어날 때 발생하는 에러 객체                        |
| URIError | encodeURI, decodeURI 함수에 부적절한 인수를 전달했을 때 발생하는 에러 객체 |
| EvalError | eval 함수에서 발생하는 에러 객체                                |

### 47.4 throw 문
- Error 생성자 함수로 에러 객체를 생성한다고 에러가 발생하는 것은 아니다.
```javascript
try {
  new Error('Error message');
}catch (error){
    console.error(error);
}
```

- 에러를 발생시키려면 try 코드 블록에서 throw문으로 에러 객체를 던져야한다.
- 에러를 던지면 catch문의 에러 변수가 생성되고 던져진 에러 객체가 할당된다. 그리고 catch 코드 블록이 실행되기 시작한다.
```javascript
try {
    throw new Error('Error message');
} catch (error) {
    console.error(error); // Error: Error message
}
```

### 47.5 에러의 전파
- 에러는 호출자 방향으로 전파된다. 즉 콜스택의 아래 방향으로 전파된다.
```javascript
const foo = () => {
    throw new Error('Error message');
}

const bar = () => {
    foo();
}

const baz = () => {
    bar();
}

try {
    baz();
} catch (error) {
    console.error(error); // Error: Error message
}
```
- throw된 에러를 어디에서도 캐치하지 않으면 프로그램은 강제종료된다.
- 비동기 함수인 setTimeout이나 프로미스 후속 처리 메서드의 콜백 함수는 호출자가 없다. 따라서 에러를 전파할 호출자가 존재하지 않는다.

## 느낀 점
이번 장은 가장 궁금했던 내용중하나라 아주 유익했습니다. 콜백 패턴의 단점을 통해 프로미스가 왜 필요한지를 공부하고 또 그 프로미스의 단점을 async/await로 어떻게 보완하는지를 알게되며 비동기 처리에 대한 이해도를 높일 수 있었습니다. 
제너레이터가 익숙하지 않아 좀 어렵긴했지만 몰랐던 내용을 알게되어 좋았습니다.