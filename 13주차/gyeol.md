# 13회차 정리

# 45장 - 프로미스

- ES6에서는 비동기 처리를 위한 패턴으로 프로미스를 도입
- 프로미스는 전통적인 콜백 패턴이 가진 단점을 보완. 비동기 처리 시점을 명확하게 표현할 수 있음

## 45.1 비동기 처리를 위한 콜백 패턴의 단점

### 45.1.1 콜백 헬

- 비동기함수 → 함수 내부에 비동기로 동작하는 코드를 포함한 함수
- 비동기 함수를 호출하면 함수 내부의 비동기로 동작하는 코드가 완료되지 않았다해도 기다리지 않고 즉시 종료됨
    
    → 비동기 함수 내부의 비동기로 동작하는 코드는 비동기 함수가 종료된 이후에 완료됨
    따라서 비동기 함수 내부의 비동기로 동작하는 코드에서 처리 결과를 외부로 반환하거나 상위 스코프의 변수에 할당하면 기대한대로 동작하지 않음  
    
    e.g. `setTimeout` 
    
    ```jsx
    let g = 0;
    setTimeout(()=>{g=100;},0);
    console.log(g); // 0
    ```
    
    - `setTimeout` 함수는 콜백 함수의 호출이 비동기로 동작하므로 비동기 함수
    비동기 함수인 `setTimeout` 함수의 콜백함수는 `setTimeout` 함수가 종료된 후 호출됨
    → **`setTimeout` 함수  내부의 콜백 함수에서 처리 결과를 외부로 반환하거나 상위 스코프의 변수에 할당하면 기대한 대로 동작하지 않음**
- **비동기함수의 처리결과(서버의 응답 등)에 대한 후속 처리는 비동기 함수 내부에서 수행해야함**
    - **비동기 함수를 범용적으로 사용하기 위해 비동기 함수에 비동기 처리 결과에 대한 후속 처리를 수행하는 콜백 함수를 전달하는 것이 일반적임.**
    - **필요에 따라 비동기 처리가 성공하면 호출될 콜백 함수와 비동기 처리가 실패하면 호출될 콜백함수를 전달할 수 있음**
- 이처럼 콜백 함수를 통해 비동기 처리 결과에 대한 후속 처리를 수행하는 비동기 함수가 비동기 처리 결과를 가지고 또다시 비동기 함수를 호출해야한다면 콜백 함수 호출이 중첩되어 복잡도가 높아지는 현상이 발생 ⇒ **`콜백 헬(callback hell)`**
    
    ```jsx
    get(`/step1`, a => {
    	get(`/step2${a}`, b => {
    		get(`/step3${b}`, c => {
    			get(`/step3${c}`, d => {
    				console.log(d);
    			});
    		});
    	});
    });
    ```
    

### 45.1.2 에러 처리의 한계

- 비동기 처리를 위한 콜백 패턴의 문제점 중 하나는 에러 처리가 곤란하다는 것
    
    ```jsx
    try {
    	setTimeout(()=>{throw new Error('Error!'); }, 1000);
    } catch(e){
    	// 에러를 캐치하지 못함
    	console.error('캐치한 에러 ', e);
    }
    ```
    
    - 비동기 함수인 setTimeout이 호출되면 setTimeout 함수의 실행 컨텍스트가 생성되어 콜스택에 푸시되어 실행됨
    - setTimeout은 비동기 함수 → 콜백 함수가 호출되는 것을 기다리지 않고 즉시 종료되어 콜스택에서 제거됨
    - 이후 타이머 만료시 setTimeout함수의 콜백 함수는 태스크 큐로 푸시되고 콜 스택이 비어졋을 때 이벤트 루프에 의해 콜 스택으로 푸시되어 실행됨
    - setTimeout 함수의 콜백 함수가 실행될 때 setTimeout 함수는 이미 콜 스택에서 제거된 상태
    → 즉 setTimeout 함수의 콜백 함수를 호출한 것이 setTimeout 함수가 아님
    - 만약 setTimeout함수의 콜백 함수의 호출자가 setTimeout 함수라면 콜 스택의 ㅎ녀재 실행 중인 실행 컨텍스트가 콜백 함수의 실행 컨텍스트일 때 현재 실행 중인 실행 컨텍스트의 하위 실행 컨텍스트가 setTimeout 함수여야함
- 에러는 호출자 방향으로 전파됨
    
    → 콜 스택의 아래 방향(실행 중인 실행 컨텍스트가 푸시되기 직전에 푸시된 실행 컨텍스트 방향)으로 전파됨. 그러나 setTimeout 함수의 콜백 함수를 호출한 것은 setTimeout 함수가 아니기 때문에 setTimeout 함수의 콜백 함수가 발생시킨 에러는 catch 블록에서 캐치 ❌
    
- 비동기 처리를 위한 콜백 패턴은 콜백 지옥이나 에러 처리가 곤란하다는 문제가 존재
이를 극복하기 위해 ES6에서 프로미스가 도입됨

## 45.2 프로미스의 생성

- Promise 생성자 함수를 new 연산자와 함께 호출하면 Promise 객체를 생성함
- Promise는 호스트 객체가 아닌 ECMAScript 사양에 정의된 표준 빌트인 객체
- Promise 생성자 함수는 비동기 처리를 수행할 콜백 함수를 인수로 전달받음
→ 이 콜백 함수는 resolve와 reject 함수를 인수로 전달 받음
    
    ```jsx
    // 프로미스 생성
    const promise = new Promise((resolve, reject)=>{
    	// Promise 함수의 콜백 함수 내부에서 비동기 처리를 수행
    	if(조건){ // 비동기 처리 성공
    		resolve('result!');
    	}else{ // 비동기 처리 실패
    		reject('failure reason');
    	}
    });
    ```
    
- Promise 생성자 함수가 인수로 전달받은 콜백 함수 내부에서 비동기 처리를 수행
    
    이때 비동기 처리 성공시 콜백 함수의 인수로 받은 resolve 함수 호출. 실패시 reject 함수를 호출
    
- 프로미스의 상태 정보
    
    
    | 프로미스의 상태 정보 | 의미 | 상태 변경 조건 |
    | --- | --- | --- |
    | pending | 비동기 처리가 아직 수행되지 않은 상태 | 프로미스가 생성된 직후 기본 상태 |
    | fulfilled | 비동기 처리가 수행된 상태(성공) | resolve 함수 호출 |
    | rejected | 비동기 처리가 수행된 상태(실패) | reject 함수 호출 |
    - 생성된 직후의 프로미스는 기본적으로 `pending` 상태.
    이후 비동기 처리가 수행되면 처리 결과에 따라 프로미스의 상태가 변경됨
        - 비동기 처리 성공 : resolve 함수를 호출해 프로미스를 fulfilled 상태로 변경
        - 비동기 처리 실패 : reject 함수를 호출해 프로미스는 rejected 상태로 변경
    - **프로미스의 상태는 resolve 또는 reject 함수를 호출하는 것으로 결정됨**
    ![image](https://github.com/user-attachments/assets/0b20f404-4f32-4805-9ad7-0995eab71770)

    ![image](https://github.com/user-attachments/assets/4180c25a-904d-4200-a73f-e112e5cfeb48)
    
- settled 상태
    - fulfilled or rejected 상태를 뜻함
    - fulfilled 또는 rejected 상태와 상관없이 pending이 아닌 상태로 비동기 처리가 수행된 상태
    - 프로미스는 pending 상태에서 settled 상태로 변화할 수 있음
        
        하지만 일단 settled 상태가 되면 다른 상태로 변화할 수 없음
        
- 프로미스는 비동기 처리상태와 비동기 처리 결과도 상태로 가짐
    - 비동기 처리 성공시 pending → fulfilled 상태로 변하며 비동기 처리 결과를 값으로 가짐
    - 비동기 처리 실패시 pending → rejected 상태로 변하며 비동기 처리 결과인 Error 객체를 값으로 가짐
        
        → **`프로미스는 비동기 처리 상태와 처리 결과를 관리하는 객체`**
        

## 45.3 프로미스의 후속 처리 메서드

- 프로미스는 후속 처리를 위한 메서드인 **`then, catch, finally`** 를 제공
- **프로미스의 비동기 처리 상태가 변화하면 후속 처리 메서드에 인수로 전달한 콜백 함수가 선택적으로 호출되며** 후속 처리 메서드의 콜백 함수에 프로미스 의 처리 결과가 인수로 전달됨
- 모든 후속 처리 메서드는 프로미스를 반환. 비동기로 동작함

### 45.3.1 `Promise.prototype.then`

- then 메서드는 인수로 두 개의 콜백 함수를 전달 받음
    - 첫 번째 콜백 함수
        - 프로미스가 fulfilled 상태가 되면 호출됨. 이 때 콜백 함수는 프로미스의 비동기 처리결과를 인수로 전달받음
    - 두 번째 콜백 함수
        - 프로미스가 rejected상태가 되면 호출됨. 이 때 콜백 함수는 프로미스의 에러를 인수로 전달받음
    
    ```jsx
    // fultilled
    new Promise(resolve => resovle('fultilled'))
    	.then(v => console.log(v), e => console.error(e)); // fultilled
    // rejected
    new Promise((_, reject) => reject(new Error('rejected')))
    	.then(v => console.log(v), e => console.error(e)); // Error: rejected
    ```
    
    - then 메서드는 항상 프로미스를 반환
    - 만약 then 메서드의 콜백 함수가 프로미스를 반환하면 그 프로미스를 그대로 반환
    - 콜백함수가 프로미스가 아닌 값을 반환하면 그 값을 암묵적으로 resolve 또는 reject하여 프로미스를 생성해 반환

### 45.3.2 `Promise.prototype.catch`

- catch 메서드는 한 개의 콜백 함수를 인수로 전달받음
- catch 메서드의 콜백함수는 프로미스가 rejected 상태인 경우만 호출됨
    
    ```jsx
    // rejected
    new Promise((_, reject) => reject(new Error('rejected')))
    	.catch(e => console.log(e)); // Error: rejected
    ```
    
    → catch 메서드는 then과 동일하게 동작 
    ⇒ then 메서드와 마찬가지로 언제나 프로미스를 반환
    

### 45.3.3 `Promise.prototype.finally`

- finally 메서드는 한 개의 콜백 함수를 인수로 전달받음
- finally 메서드의 콜백함수는 프로미스의 성공, 실패와 상관없이 무조건 한 번 호출
    
    → 프로미스 상태와 상관없이 공통으로 처리해야할 게 있을 때 유용
    
    ```jsx
    new Promise(() => {})
    	.finally(() => console.log('finally')); // finally
    ```
    
    → then/catch 메서드와 마찬가지로 언제나 프로미스를 반환
    

## 45.4 프로미스의 에러 처리

- 비동기 처리에서 발생한 에러를 처리하는 방법
    - then 메서드의 두 번째 콜백 함수로 처리
    - catch를 사용해 처리
- then 메서드를 사용했을 때 문제
    - then 메서드의 두 번째 콜백 함수는 첫 번재 콜백 함수에서 발생한 에러를 캐치하지 못하고 코드가 복잡해져서 가독성이 좋지않음
- catch 메서드를 모든 then 메서드를  호출한 후에 호출하면 비동기 처리에서 발생한 에러(rejected 상태) 뿐 아니라 then 메서드 내부에서 발생한 에러까지 모두 캐치 가능
- 결론
    - **에러처리는 then 메서드에서 처리 하지 않고 catch 메서드에서 처리하는 것을 권장**

## 45.5 프로미스 체이닝

- then, catch, finally 후속 처리 메서드는 콜백 함수가 반환한 프로미스를 반환하므로 연속적으로 호출이 가능 → 이를 `프로미스 체이닝` 이라함
- 만약 후속 처리 메서드의 콜백 함수가 프로미스가 아닌 값을 반환하더라도 그 값을 암묵적으로 resolve, reject하여 프로미스를 생성 후 반환
- 프로미스는 프로미스 체이닝을 통해 비동기 처리 결과를 전달 받아 후속 처리 하므로 콜백 헬이 발생하지 않음
다만, 콜백 패턴을 사용하므로 콜백 함수를 사용하긴 함
- 콜백 패턴은 가독성이 좋지 않음
→ 이 문제는 async/await(ES8+)를 통해 해결 가능. async/await를 사용하면 프로미스의 후속 처리 메서드 없이 동기 처리처럼 프로미스가 처리 결과를 반환하도록 구현 할 수 있음

## 45.6 프로미스의 정적 메서드

### 45.6.1 Promise.resolve/Prmoise.reject

- 이미 존재하는 값을 래핑하여 프로미스를 생성하기 위해 사용
- Promise.resolve 메서드는 인수로 전달받은 값을 resolve하는 프로미스를 생성
- Promise.reject 메서드는 인수로 전달받은 값을 reject하는 프프로미스를 생성

### 45.6.2 Promise.all

- Promise.all 메서드는 여러 개의 비동기 처리를 모두 병렬 처리할 때 사용
    
    ```jsx
    // 예시
    const requestData1 = () => 
    	new Promise(resolve => setTimeout(() => resolve(1), 3000));
    const requestData2 = () => 
    	new Promise(resolve => setTimeout(() => resolve(2), 2000));
    const requestData3 = () => 
    	new Promise(resolve => setTimeout(() => resolve(3), 1000));
    	
    // 위 예시의 세개의 비동기 처리는 서로 의존하지 않고 개별적으로 수행되므로
    // 세개의 비동기 처리를 순차적으로 처리할 필요 X
    
    // 세 개의 비동기 처리를 병렬로 처리
    Promise.all([requestData1(), requestData2(), requestData3()])
    	.then(console.log); // [1,2,3] => 약 3초 소요
    	.catch(console.error);
    ```
    
- Promise.all 메서드는 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달 받음
- 전달받은 모든 프로미스가 모두 fulfilled 사앹가 되면 모든 처리 결과를 배열에 저장해 새로운 프로미스를 반환
- Promise.all 메서드가 종료하는 데 걸리는 시간은 가장 늦게 fulfilled 상태가 되는 프로미스의 처리 시간보다 조금 더 길음
- 인수로 전달 받은 배열의 프로미스 중 하나라도 rejected 상태가 되면 나머지 프로미스가 fulfilled 상태가 되는 것을 기다리지 않고 즉시 종료

### 45.6.3 Promise.race

- Promise.race 메서드는 Promise.all 메서드와 동일하게 프로미스를 요소로 갖는 배열 등의 이터러블을 인수로 전달받음
- Promise.race 메서드는 모든 프로미스가 fulfilled 상태가 되는 것을 기다리는 것이 아니라 가장 먼저 fulfilled 상태가 된 프로미스의 처리 결과를 resolve하는 새로운 프로미스를 반환
- Promise.race 메서드에 전달된 프로미스가 하나라도 rejected 상태가 되면 에러를 reject 하는 새로운 프로미스를 즉시 반환(Promise.all 과 비슷)

### 45.6.4 Promise.allSettled(ES11)

- Promise.allSettled 메서드는 프로미스르 요소로 갖는 배열 등의 이터러블을 인수로 전달받음
- 전달 받은 프로미스가 모두 settled 상태(비동기 처리가 수행된 상태, fulfilled or rejected 상태)가 되면 처리 결과를 배열로 반환
- Promise.allSettled 메서드가 반환한 배열에는 fulfilled or rejected 상태와는 상관없이 Promise.allSettled 메서드가 인수로 전달받은 모든 프로미스들의 처리 결과가 담겨있음

## 45.6 마이크로태스크 큐

```jsx
setTimeout(()=> console.log(1), 0);

Promise.resolve()
	.then(() => console.log(2))
	.then(() => console.log(3));
```

- 프로미스의 후속 처리 메서드도 비동기로 동작함
    
    즉, 출력은 2 → 3 → 1의 순으로 이뤄짐
    
    → 프로미스의 후속 처리 메서드의 콜백 함수는 태스크 큐가 아니라 마이크로태스크 큐에 저장되기 때문
    
- 마이크로태스크 큐
    - 태스크 큐와는 별도의 큐
    - 프로미스의 후속 처리 메서드의 콜백 함수가 일시 저장됨
        
        (그 외 비동기 함수의 콜백 함수나 이벤트 핸들러는 태스크 큐에 일시 저장됨)
        
    - 콜백 함수나 이벤트 핸들러를 일시 저장한다는 점에서 태스크 큐와 동일하지만 
    **태스크 큐보다 우선순위가 높음**
        
        → 이벤트 루프는 콜스택이 비면 먼저 마이크로태스크 큐에서 대기하고 있는 함수를 가져와 실행
        
- 참고
    
    [이벤트 루프와 태스크 큐 (마이크로 태스크, 매크로 태스크)](https://whales.tistory.com/130)
    

## 45.8 fetch

- XMLHttpRequest 객체와 마찬가지로 HTTP 요청 전송 기능을 제공하는 클라이언트 사이드 Web API
- XMLHttpRequest 객체보다 사용법이 간단하고 프로미스를 지원하기 때문에 비동기 처리에 유용
- 비교적 최근에 추가된 Web API로서 인터넷 익스플로어를 제외한 대부분의 브라우저에서 제공됨
- fetch 함수에는 HTTP 요청을 전송할 URL과 HTTP 요청 메서드, HTTP 요청 헤더, 페이로드 등을 설정한 객체를 전달
    
    ```jsx
    const promise = fetch(url, [, options])
    
    // 예시
    fetch('https://jsonplaceholder.typicode.com/todos/1')
        .then(response => console.log(response)); 
        // Promise 후속 처리 메서드인 then 메서드를 통해 처리
    ```
    
- fetch함수는 HTTP 응답을 나타내는 Response 객체를 래핑한 Promise 객체를 반환함 
→ 후속 처리 메서드 then을 사용해서 프로미스가 resolve한 Response 객체를 전달받을 수 있음
- Response 객체는 HTTP 응답을 나타내는 다양한 프로퍼티를 제공
    
    [Response - Web API | MDN](https://developer.mozilla.org/ko/docs/Web/API/Response)
    
- fetch 함수 사용시 에러 처리에 주의해야함
    - **fetch 함수가 반환하는 프로미스는 기본적으로 `404 Not Found` 나 `500 Internal Server Error` 와 같은 HTTP 에러가 발생해도 에러를 reject 하지 않고 불리언 타입의 ok 상태를 false로 설정한 Response 객체를 resolve함**
    - **오프라인 등의 네트워크 장애나 CORS 에러에 의해 요청이 완료되지 못한 경우에만 프로미스를 reject함**
    - 즉, fetch 함수 사용시 반환된 프로미스가 resolve한 불리언타입의 ok 상태를 확인해 명시적으로 에러처리를 해줘야함
        
        ```jsx
        const wrongUrl = 'https://jsonplaceholder.typicode.com/XXX/1';
        // 잘못된 url이기 때문에 404 에러 발생
        fetch(wrongUrl)
          .then(response => {
        	  // response 는 HTTP 응답을 나타내는 Response 객체임
            if(!response.ok) throw new Error(response.statusText);
              return response.json();
            })
        	.then(todo => console.log(todo))
        	.catch(err => console.error(err));
        ```
        
- 참고로 axios는 모든 HTTP 에러를 reject하는 프로미스를 반환함
→ 모든 에러를 catch에서 처리 가능

# 46장 - 제너레이터와 async/await

## 46.1 제너레이터란?

- 제너레이터와 일반 함수의 차이
    - 제너레이터는 함수 호출자에게 함수 실행의 제어권 양도 가능
        
        → 함수의 제어권을 함수가 독점하는 것이 아니라 함수 호출자에게 양도할 수 있음 
        
    - 제너레이터는 함수 호출자와 함수의 상태를 주고 받을 수 있음
    - 제너레이터 함수를 호출하면 제너레이터 객체 반환 가능
    → 제너레이터 함수 호출시 함수 코드를 실행하는 것이 아니라 이터러블이면서 이터레이터인 제너레이터 객체를 반환

## 46.2 제너레이터 함수의 정의

```jsx
// 제너레이터 함수 선언문
function* getDecFunc() {
	yield 1;
}
// 제너레이터 함수 표현식
const getExpFunc = function* () {
	yield 1;
};
// 제너레이터 메서드
const obj = {
	* getObjMethod() {
		yield 1;
	}
};
// 제너레이터 클래스 메서드
class MyClass {
	* getClsMethod() {
		yield 1;
	}
}
```

- `function*` 키워드로 선언
- 하나 이상의 yield 표현식 포함
- 애스터리스크(*)의 위치는 function 키워드와 함수 이름 사이라면 어디든지 상관없음
→ 일관성 유지를 위해 function 키워드 바로 뒤에 붙이는 것을 권장
- 제너레이터 함수는 화살표 함수로 정의할 수 없음
- 제너레이터 함수는 new 연산자와 함께 생성자 함수로 호출할 수 없음

## 46.3 제너레이터 객체

- **제너레이터 함수를 호출하면 일반 함수처럼 함수 코드 블록을 실행하는 것이 아니라 제너레이터 객체를 생성해 반환함**
- **제너레이터 함수가 반환한 제너레이터 객체는 이터러블 이면서 이터레이터임**

## 46.4 제너레이터의 일시 중지와 재개

- 제너레이터는 yield 키워드와 next 메서드를 통해 실행을 일시 중지했다가 필요한 시점에 다시 재개할 수 있음
- **yield 키워드는 제너레이터 함수의 실행을 일시 중지시키거나 yield 키워드 뒤에 오는 표현식의 평가 결과를 제너레이터 함수 호출자에게 반환함**
- **제너레이터 객체의 next 메서드를 호출하면 yield 표현식까지 실행되고 일시중지되는데 이 때 함수의 제어권이 호출자로 양도됨**
- 이후 필요한 시점에 호출자가 또다시 next 메서들르 호출하면 일시중지된 코드부터 실행을 재개 후 다음 yield 표현식까지 실행되고 일시 중지됨
- **이때 제너레이터 객체의 next 메서드는 value, done 프로퍼티를 갖는 이털테이터 리절트 객체를 반환. next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티는 yield 표현식에서 yield 된 값이 할당되고 done 프로퍼티에는 제너레이터 함수가 끝까지 실행되었는지를 나타내는 불리언 값이 할당됨**
- 제너레이터의 특성을 활용하면 비동기처리를 동기처리처럼 구현할 수 있음

## 46.5 제너레이터의 활용

### 46.5.1 이터러블의 구현

- 제너레이터 함수를 사용하면 이터레이터 프로토콜을 준수해 이터러블을 생성하는 것보다 간단하게 구현할 수 잇음
    
    ```jsx
    // 무한 이터러블을 생성하는 제너레이터 함수
    const infiniteFibonacci = (function* (){
    	let [pre, cur] = [0, 1];
    	while(ture){
    		[pre, cur] = [cur, pre + cur];
    		yield cur;
    	}
    }());
    // infiniteFibonacci는 무한 이터러블임
    for(const num of infiniteFibonacci){
    	if(num > 10000) break;
    	console.log(num); // 1 2 3 5 8 .. 6765
    }
    ```
    

### 46.5.2 비동기 처리

- 제너레이터 함수는 next 메서드와 yield 표현식을 통해 함수 호출자와 함수의 상태를 공유할 수 있음
→ 이러한 특성을 활용하면 프로미스의 후속 처리 메서드(then, catch, finally)없이 비동기 처리 결과를 반환하도록 구현 가능

## 46.6 async/await

- ES8에서는 제너레이터보다 간단하고 가독성 좋게 비동기 처리를 동기 처리 처럼 동작하도록 구현할 수 있는 async/await가 도입되었음
- async/await는 프로미스를 기반으로 동작함
- async/await를 사용하면 프로미스의 후속 처리 메서드 없이 동기 처리처럼 프로미스가 처리 결과를 반환하도록 구현 가능

### 46.6.1 async 함수

- **await 키워드는 반드시 async 함수 내부에서 사용해야함**
- async 함수는 async 키워드르 사용해 정의하며 언제나 프로미스를 반환함
- async 함수가 명시적으로 프로미스를 반환하지 않더라도 암묵적으로 반환값을 resolve하는 프로미스를 반환함
    
    ```jsx
    // async 함수 선언문 
    async function foo(n) {return n;}
    foo(1).then(v => console.log(v)); // 1
    // async 함수 표현식
    const bar = async function(n){return n;};
    bar(2).then(v => console.log(v)); // 2
    // async 화살표 함수
    const baz = async n => n;
    baz(3).then(v => console.log(v)); //3
    // async 메서드
    const obj = {
    	async foo(n) {return n;}
    };
    obj.foo(4).then(v => console.log(v)); // 4
    // async 클래스 메서드
    class MyClass {
    	async bar(n){ return n; }
    }
    const myClass = new MyCalss();
    myClass.bar(5).then(v => console.log(v)); //5
    class MyClass1 {
    	async constructor(){ }
    	// SyntaxError: Class constructor may not be an async method
    }
    ```
    
- 클래스의 constructor 메서드는 async 메서드가 될 수 없음
    
    → 클래스의 constructor 메서드는 인스턴스를 반환해야하지만 async 함수는 언제나 프로미스를 반환해야함
    

### 46.6.2 await 키워드

- await 키워드는 프로미스가 settled 상태가 될 때까지 대기하다가 settled 상태가 되면 프로미스가 resolve한 처리 결과를 반환함
- await 키워드는 반드시 프로미스 앞에서 사용해야함
- 모든 프로미스에 await 키워드를 사용하는 것은 주의해야함
- 아래 예시의 프로미스들은 서로 연관이 없는 비동기 처리지만 순차적으로 처리가 되어 6초가 걸린다는 문제가 있음
→ 이 경우 Promise.all을 사용해서 병렬적으로 수행되도록 처리하는 게 좋음.
    
    ```jsx
    async function foo() {
    	const a = await new Promise(resolve => setTimeout(() => resolve(1), 3000));
    	const b = await new Promise(resolve => setTimeout(() => resolve(2), 2000));
    	const c = await new Promise(resolve => setTimeout(() => resolve(3), 1000));
    	console.log([a,b,c]); // [1,2,3]
    }
    foo(); // 약 6초 소요
    ```
    

### 46.6.3 에러처리

- 에러는 호출자 방향으로 전파됨
    
    → 콜스택의 아래 방향(실행 중인 실행 컨텍스트가 푸시되기 직전에 푸시된 실행 컨텍스트 방향)으로 전파됨
    
- 하지만 비동기 함수의 콜백 함수를 호출한 것은 비동기 함수가 아니기 때문에 `try … catch` 문을 사용해 에러를 캐치할 수 없음
- **async/await 에서 에러처리는 try … catch 문을 사용 할 수 있음 
콜백 함수를 인수로 전달받는 비동기 함수와 달리 프로미스를 반환하는 비동기 함수는 명시적으로 호출할 수 있기 때문에 호출자가 명확함**
    
    ```jsx
    const fetch = require('noew-fetch');
    const foo = async () => {
    	try {
    		const wrongUrl = 'https://wrong.url';
    		const response = await fetch(wrongUrl);
    		const data = await responsee.json();
    		console.log(data);
    	} catch(err) {
    		console.error(err); // TypeError: Failed to fetch
    	}
    };
    foo();
    // foo 함수의 catch문은 HTTP 통신에서 발생한 네트워크 에러 뿐만 아니라 
    // try 코드 블록 내의 문에서 발생한 에러를 모두 캐치할 수 있음
    ```
    
- **async 함수 내에서 catch 문을 사용해 에러처리를 하지 않으면 async 함수는 발생한 에러를 reject 하는 프로미스를 반환함**
→ async 함수를 호출하고 Promise.prototype.catch 후속 처리 메서드를 사용해 에러 캐치 가능

# 47장 - 에러처리

## 47.1 에러처리의 필요성

- 우리가 작성한 코드에서는 언제나 에러나 예외적인 상황이 발생할 수 있음
→ 이를 대응하는 코드를 작성하는 것이 중요

## 47.2 try … catch … finally 문

```jsx
try {
	// 실행할 코드(에러가 발생할 가능성이 있는 코드)
} catch(err){
	// try 코드 블록에서 에러가 발생하면 이 코드 블록의 코드가 실행됨
	// err 에는 try 코드 블록에서 발생한 Error 객체가 전달됨
} finally {
	// 에러 발생과 관계없이 반드시 한 번 실행
}
```

## 47.3 Error 객체

- Error 생성자 함수는 에러 객체를 생성
- Error 생성자 함수에는 에러를 상세히 설명하는 에러 메세지를 인수로 전달 가능
    
    ```jsx
    const error = new Error('invalid');
    ```
    
- Error 생성자 함수가 생성한 에러 객체는 message 프로퍼티와 stack 프로퍼티를 가짐
    - message 프로퍼티의 값
        - Error 생성자 함수에 인수로 전달한 에러메세지
    - stack 프로퍼티의 값
        - 에러를 발생시킨 콜스택의 호출 정보를 나타내는 문자열. 디버깅 목적으로 사용
- Error 생성자 함수
    
    
    | 생성자함수 | 인스턴스 |
    | --- | --- |
    | Error | 일반적인 에러 객체 |
    | SyntaxError | 자바스크립트 문법에 맞지 않는 문을 해석할 때 발생하는 에러 객체 |
    | ReferenceError | 참조할 수 없는 식별자를 참조했을 때 발생하는 에러 객체 |
    | TypeError | 피연산자 또는 인수의 데이터 타입이 유효하지 않을 때 발생하는 에러 객체 |
    | RangeError | 숫자값의 허용 범위를 벗어났을 때 발생하는 에러 객체 |
    | URIError | encodeURI 또는 decodeURI 함수에 부적절한 인수를 전달했을 때 발생하는 에러객체 |
    | EvalError | eval 함수에서 발생하는 에러 객체 |

## 47.4 throw 문

- Error 생성자 함수로 에러 객체를 생성한다고 해서 에러가 발생하진 않음.
→ 에러 객체 생성과 에러 발생은 의미가 다름
- 에러를 발생시키려면 try 코드 블록에서 throw 문으로 에러 객체를 던져야함
    
    ```jsx
    throw 표현식;
    ```
    
- throw문의 표현식은 일반적으로 에러 객체를 지정함
에러를 던지면 catch 문의 에러 변수가 생성되고 던져진 에러 객체가 할당되며 catch 코드 블록이 실행되기 시작함

## 47.5 에러의 전파

- 에러는 호출자 방향으로 전파
→ 콜스택의 아래 방향(실행중인 실행 컨텍스트가 푸시되기 직전에 푸시된 실행컨텍스트 방향)으로 전파됨
    
    ```jsx
    const foo = () => {
    	throw Error('foo에서 발생한 에러'); // 4
    };
    const bar = () => {
    	foo(); // 3
    };
    const baz = () => {
    	bar(); // 2
    };
    try {
    	baz(); // 1
    } catch(err) {
    	console.error(err);
    }
    ```
    
- 1에서 baz 함수를 호출하면 2에서 bar 함수가 호출되고 3에서 foo 함수가 호출되고 foo 함수는 4에서 에러를 throw함
- 이때 foo함수가 throw한 에러는 호출자에게 전파되어 전역에서 캐치됨
  
    ![image](https://github.com/user-attachments/assets/2ba0c8c0-ca1c-470a-b336-5698717770ff)

    
- 주의)
비동기 함수인 setTimeout 이나 프로미스 후속 처리 메서드의 콜백 함수는 호출자가 없음
→ 
해당 콜백 함수들은 태스크 큐나 마이크로태스크 큐에 일시 저장되었다가 콜스택이 비면 이벤트 루프에 의해 콜스택으로 푸시되어 실행됨
이 때 콜스택에 푸시된 콜백 함수의 실행 컨텍스트는 콜스택의 가장 하부에 존재하므로 에러를 전파할 호출자가 존재하지 않음
