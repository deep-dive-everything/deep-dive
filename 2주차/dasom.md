# Morden JavaScript Deep Dive

Dasom, 2024.05.26

## 8장 제어문

* 제어문: 조건에 따라 코드 블록을 실행하거나 반복 실행 할 때 사용

* 블록문: 0개 이상의 문을 중괄호{}로 묶은 것 (== 코드 블록, 블록)

### 조건문

* 조건문: 주어진 조건식의 평과 결과에 따라 코드 블록의 실행을 결정

  * if ... else 문

  ```js
  if (조건식1){
    // 조건식1이 참이면 실행 
  } else if (조건식2) {
    // 조건식22가 참이면 실행
  } else {
    // 조건식1, 2가 거짓이면 실행
  }
  ```

  * switch 문

    * case: 상황을 의미하는 표현식을 지정

      cf. break;가 없다면 case문을 연이어 수행

    * default문 (optional): switch 표현식과 일치하는 case문이 없다면 실행

  ```js
  switch(표현식){
    case 표현식1:
      // switch문의 표현식과 표현식1이 일치하면 실행
      break; // switch문 탈출
    case 표현식2:
      // switch문의 표현식과 표현식2가 일치하면 실행
      break;
    default:
      // switch문의 표현식과 일치하는 case문이 없을 때 실행
  }
  ```

### 반복문

* 반복문: 조건식이 거짓일 때까지 코드 블록을 실행

  * for 문

    cf. for문에서 사용하는 변수는 반복문의 수행에 따라 값이 재할당 되기 때문에 const의 사용이 불가

  ```js
  for (let i = 0; i < 2; i++){
    // i가 2보다 작을 때까지 수행
  }
  ```

  * while 문

  ```js
  let count = 0;
  while (count < 2){
    count++;
  }
  ```

  * do ... while문: 코드 블록을 먼저 실행하고 조건식을 평가 -> 코드 블록 무조건 한 번 이상 실행

  ```js
  let count = 0;
  do {
    count ++;
  } while (count < 2);
  ```

### break문

* break문: 코드 블록을 탈출

  * 레이블문, 반복문, switch 문의 코드 블록 외에 break를 사용하면 SyntaxError 발생

  cf. 레이블문: 식별자가 붙은 문 / switch의 case문과 default문도 레이블 문

  ```js
  foo: consolr.log('foo');
  ```

### continue문

* continue문: 코드 블록 실행을 중단하고 다시 반복문의 시작으로 이동

  ```js
  for (let i = 0; i < 3; i++){
    if (i !== 2) continue; // i가 2가 아니면 다시 증감식으로 이동
    console.log(i) // 2 (0, 1, 2의 경우는 continue문의 실행으로 인해 실행 X)
  }
  ```



## 9장 타입 변환과 단축 평가

### 타입 변환

* 암묵적 타입 변환 || 타입 강제 변환: 자바스크립트 엔진에 의해 변환

  	* 문자열 외 타입 + '' => 문자열 외 타입을 문자열로 변환

  ```js
  // 예제
  0 + '' // -> '0'
  -0 + '' // -> '0'
  -1 + '' // -> '-1'
  undefined + '' // -> 'undefined'
  (Symbol()) + '' // -> TypeError 발생
  ({}) + '' // -> "[object object]"
  [10, 20] + '' // -> '10, 20'
  ```

  * 숫자열 외 타입에 산술 연산자 사용 => 숫자 타입 암묵적 변환. 불가할 시 표현식의 결과 NaN 반환

  ```js
  // 예제
  +'' // -> 0
  +'0' // -> 0
  +'string' // -> NaN
  +undefined // -> NaN
  ```

  * Falsy 값: false, undefined, null, 0, -0, Nan, ''

    cf. Falsy 값 외의 모든 값은 Truthy값

* 명시적 타입 변환 || 타입 캐스팅: 개발자가 의도적으로 값의 타입을 변경

  * 문자열 변환: `String()`, `.toString`, `+''`
  * 숫자열 변환: `Number()`, `.parseInt`, `.parseFloat`, `+`, `*`
  * 불리언 변환: `Boolean()`, `!!`

### 단축 평가

* 논리 연산자를 이용한 평가

  * 논리합(||) 또는 논리곱(&&)

    true || anything = true

    false || anything = anything

    true && anything = anything

    false && anything = false

  * 옵셔널 체이닝 연산자 (?)

    좌항의 피연산자가 null or undefined인 경우 undefined를 반환

    ```js
    const str = '';
    const length = str?.length; 
    // 좌항이 Falsy값이어도 null 또는 undefined가 아니면 참조를 이어감
    console.log(length) // 0
    ```

  * null 병합 연산자 (??)

    ```js
    const str = '' ?? "default string";
    console.log(str) // ''
    ```



## 10장 객체 리터럴

* 객체

  * 자바스크립트에서 원시 값을 제외한 나머지 값은 모두 객체
  * 0개 이상의 프로퍼티로 구성된 집합 / (프로퍼티: 키와 값으로 구성)

* 객체 생성 방법

  * 객체 리터럴 ({})
    * 코드 블록: ;을 붙이지 않음
    * 객체리터럴: ;을 붙임
  * Object()
  * 생성자 함수 
  * Object.create
  * 클래스(ES6)

* 프로퍼티

  ```js
  const person = {
    // 프로퍼티 키: name, 프로퍼티 값: Park
    name: 'Park',
    // 프로퍼티 키: age, 프로퍼티 값: 28
    age: 28
  };
  ```

  * 프로퍼티 키: 식별자 네이밍 규칙을 따를 것을 권장
    * 동적 생성법: obj[key] = 'value' || obj.key = 'value'
    * 삭제: `delete person.age`

* 메서드: 객체에 묶여있는 함수 (프로퍼티 값이 함수일 경우 일반 함수와 구분 하기 위해 메서드라 부름)

* 프로퍼티 접근

  ```js
  const person = {
    name: 'Park'
  };
  
  console.log(person.name)
  console.log(person['name']) // 반드시 따옴표로 감싼 문자열
  ```

  

## 11장 원시 값과 객체의 비교

* 원시 값과 객체의 차이

  * 원시값: 변경 불가능 (Immutable) / 객체: 변경 가능(Mutable)
  * 변수(메모리 공간) 저장 값
    * 원시값: 실제 값
    * 객체: 참조 값

  * 변수를 다른 변수에 할당 (값의 전달)
    * 원시값: 원본의 원시 값이 복사되어 전달 (값에 의한 전달)
    * 객체: 참조 값이 복사되어 전달 (참조에 의한 전달)

### 원시 값

* 원시 값: 변경 불가능한 값 (Immutable)

  cf. 객체 타입의 값은 변경 가능한 값 (Mutable)

* 변경 불가능한 값

  * 원시 타입의 값은 변경 불가능한 값
  * 재할당을 하게 되면 새로운 메모리 공간에 재할당한 원시값을 저장 후 변수는 새롭게 재할당한 원시값을 가리킴 

* 문자열과 불변성

  ```js
  let str = "string";
  str[0] = "S";
  console.log(str) // string (변경 불가능)
  ```

* 값에 의한 전달

  ```js
  let score = 80;
  let copy = score; // score 값 전달
  console.log(score === copy); // true
  
  score = 100;
  
  console.log(score === copy); // false
  console.log(score); // 100
  console.log(copy); // 80
  // 값이 복사되어 전달된 것 뿐, 다른 메모리 공간에 저장된 별개의 값
  ```

### 객체

* 객체는 프로퍼티의 개수가 정해져있지 않기 때문에 확보해야 할 메모리 공간의 크기를 사전에 정해둘 수 없음

​	cf. 따라서 구현 방법은 브라우저 제조사 마다 다를 수 있음

* 변경 가능한 값

  * 객체를 할당한 변수: "변수는 객체를 참조하고 있다" 또는 "변수는 객체를 가리키고 있다"라고 표현
  * 객체를 변경할 때마다 원시 값 처럼 복사하여 재할당을 진행했다면 메모리의 효율적 소비가 어려울 수 있음 (크기가 일정하지 않기 때문에)

* **얕은 복사와 깉은 복사**

  * 얕은 복사: 한 단계까지만 복사
  * 깊은 복사: 객체에 중첩되어있는 객체까지 모두 복사

  ```js
  const obj = {
    smallObj: {
    	small: 1
  	}
  };
  
  const obj1 = {...obj}; // 얕은 복사
  console.log(obj === obj1); // false
  console.log(obj.smallObj === obj1.smallObj); // true
  
  // lodash 설치 가정
  const obj2 = _.cloneDeep(obj);
  console.log(obj === obj2); // false
  console.log(obj.smallObj === obj2.smallObj); // false
  // 모두 복사해서 원시 값처럼 완전한 복사본을 만들었기 때문에 false
  ```

  cf. 원시 값을 복사하는 (=)는 깊은 복사이다.

  ※ 추가 예시

  ```js
  const obj3 = obj;
  /* 깊은 복사도 아니고 얕은 복사도 아님
  이는 단순히 obj를 obj3에 참조로 할당한 것 */
  
  console.log(obj3 === obj) // true
  console.log(obj3.smallObj === obj.smallObj) // true
  
  // 따라서 값을 업데이트 한다면 원본 값도 바뀜
  obj3.smallObj =  2
  console.log(obj, obj3) // { smallObj: 2 } { smallObj: 2 }
  ```

* 참조에 의한 전달

  위의 추가 예시처럼 **참조 값**이 복사되어 전달되기 때문에 **두 개의 식별자가 하나의 객체를 공유**함

  cf. 포인터가 존재하지 않기 때문에 다른 프로그래밍 언어의 참조에 의한 전달과 차이가 있음. 실질적으로 참조 "값"을 전달하는 것이기에 값에 의한 전달만 존재한다고도 볼 수 있음.



## 느낀점

*  객체의 생성 방법이 쉽고 또 다양한 곳에서 일어날 수 있어 더더욱 실제 업무에선 유의해야할 것 같다. 그리고 이런 부분이 결국 사람들이 TypeScript를 사용하는 하나의 이유인가 싶다.
*  원시 값은 변경 불가능한 값인데 재할당이 가능한 개념을 이해하기 어려웠다. 명확히 설명하기 위해 쉬운 언어로 정리할 필요가 있겠다.



**오늘의 간단 요약**

원시 값이란? 변경 불가능한 값이다

그렇다면 let이나 var의 재할당은? 새로운 값을 새롭게 할당하는 것이다.

-> 즉, 값이 바뀌는 것이 아니라 값은 새롭게 생성되고 변수의 참조 주소가 바뀌는 것


** 공유하고 싶은 내용**

조건문을 작성하다보면 if() 안에 많은 내용을 담게 되는 경우가 있다.

예를 들어, 

```js

const is_true = true; // type: true | false
const obj = {
  code: "human", // type: "human" | "animal" | "others"
  age: 20, // type: number
  name: "Kim" // type: string
}

if( obj.age < 20 || obj.code !== "human" || is_true){
  console.log("hello")
}
```

이러한 조건식을 세울 때,

빠르게 판별할 수 있는 조건을 앞쪽에 배치하는 것이 좋다.

위의 예시에서는 is_true가 boolean이기 때문에, obj.code나 obj.age보다 적은 경우의 수를 가진다.

이런 것들을 조건의 앞쪽에 배치함으로써 약간의 성능 향상을 꾀해볼 수 있겠다.

실제로 기능 추가가 되면서 조건이 늘어날 때, 자주 놓치게 되는 부분인데 염두해두면 좋을 것 같다!







