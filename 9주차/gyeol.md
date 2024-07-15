# 9회차 정리

# 33장 - 7번째 데이터 타입 Symbol

## 33.1 심벌이란?

- ES6에서 도입된 7번째 데이터 타입
- 변경 불가능한 원시타입의 값
- 다른 값과 중복되지 않는 유니크한 값 → 이름 충돌의 위험이 없는 유일한 프로퍼티 키를 만들기 위해 사용

## 33.2 심벌 값의 생성

### 33.21. Symbol 함수

- 심벌 값은 Symbol 함수를 호출해서 생성
    
    → 이 때 생성된 값은 외부로 노출 ❌
    
    ```jsx
    const mySymbol = Symbol();
    console.log(typeof mySymbol); // symbol
    ```
    
- 다른 원시값(문자열, 숫자, 불리언, undefined, null)은 리터럴 표기법을 통해 값을 생성할 수 있지만 Symbol 값은 아님
- Symbol 함수는 String, Number, Boolean 생성자 함수와 달리 new 연산자와 함께 호출 ❌
    
    ```jsx
    const mySymbol1 = new Symbol(); // TypeError: Symbol is not a constructor
    ```
    

### 33.2.2 Symbol.for/Symbol.keyFor 메서드

- `Symbol.for` 메서드는 인수로 전달받은 문자열을 키로 사용해서 키와 심벌 값의 쌍들이 저장되어 있는 전역 심벌 레지스트리에서 해당 키와 일치하는 심벌 값을 검색
    - 검색 성공시 새로운 심벌 값 생성 ❌검색된 심벌 값 반환
    - 검색 실패시 새로운 심벌 값 생성하여 Symbol.for 메서드의 인수로 전달된 키로 전역 심벌 레지스트리에 저장 후 생성된 심벌 값 반환
- Symbol 함수는 호출 될 때마다 유니크한 심벌 값을 생성 
이 때 JS 엔진이 관리하는 전역 심벌 레지스트리(심벌 값 저장소)에서 심벌 값을 검색할 수 있는 키를 지정할 수 없으므로 전염 심벌 레지스트리에 등록되어 관리되지 않음
- `Symbol.for` 메서드는 심벌 값을 단 하나만 생성하여 전역 심벌 레지스트리를 통해 공유
- `Symbol.keyFor` 메서드를 사용하면 전역 심벌 레지스트리에 저장된 심벌 값 추출 가능

## 33.3 심벌과 상수

- 값보다는 상수 이름 자체에 의미가 있는 경우 상수 값이 변경될 수 있고 다른 변수 값과 중복이 될 수 있는데 이런 경우 변경/중복될 가능성이 있는 무의미한 상수대신 중복될 가능성이 없는 유니크한 심벌 값을 사용할 수 있음

## 33.4 심벌과 프로퍼티 키

- 심벌 값으로 객체 프로퍼티 키를 만들 수 있고 동적으로 생성할 수도 있음
- 심벌 값으로 프로퍼티 키를 동적 생성하여 프로퍼티 만들기
    - 심벌 값을 프로퍼티 키로 사용하려면 프로퍼티 키로 사용할 심벌 값에 **대괄호를 사용**해야함(프로퍼티에 접근할 때도 마찬가지)
    - **심벌 값으로 프로퍼티 키를 만들면 다른 프로퍼티 키와 절대 충돌하지 않음**
    
    ```jsx
    const obj = {
    	//  심벌값으로 프로퍼티 키를 생성
    	[Symbol.for('mySymbol')]: 1
    };
    obj[Symbol.for('mySymbol')]; // -> 1
    ```
    

## 33.5 심벌과 프로퍼티 은닉

- 심벌 값을 프로퍼티 키로 사용하여 생성한 프로퍼티는 for…in 문이나 Object.keys, Object.getOwnPeropertyNames 메서드로 찾기 불가능
    
    → 외부에 노출할 필요가 없는 프로퍼티 은닉 가능
    
- 단, `Object.getOwnPropertySymbols(ES6) 메서드` 를 사용하면 찾을 수 있음

## 33.6 심벌과 표준 빌트인 객체 확장

- 심벌 값으로 프로퍼티 키를 생성해서 표준 빌트인 객체를 확장하면 안전하게 표준 빌트인 객체를 확장 가능 
그 이유는…
    - 표준 빌트인 객체의 기존 프로퍼티 키와 충돌 하지않음
    - 표준 사양의 버전이 올라감에 따라 추가될지 모르는 어떤 프로퍼티 키와도 충돌할 위험이 없음
- 일반적으로 표준 빌트인 객체에 사용자 정의 메서드를 직접 추가해서 확장하는 것을 권장하지 않음(표준 빌트인 객체는 읽기전용으로 사용하는 것이 좋음)
→ 개발자가 추가한 메서드와 미래에 표준 사양으로 추가될 메서드의 이름이 중복될 수 있기 때문(이렇게 덮어쓰게되면 문제가 될 수 있으니까)

## 33.7 Well-known Symbol

- JS가 기본 제공하는 빌트인 심벌 값을 ECMAScript 사양에서는 Well-known Symbol 이라 부름
- Well-known Symbol은 JS 엔진의 내부 알고리즘에서 사용됨

# 34장 - 이터러블

## 34.1 이터레이션 프로토콜(ES6)

- 순회가능한 데이터 컬렉션(자료구조)을 만들기 위해 ECMAScript 사양에 정의하여 미리 약속한 규칙
- ES6 이전의 순회 가능한 데이터 컬렉션(배열, 문자열, 유사 배열 객체 등)은 통일된 규약없이 각자 나름의 구조를 가지고 다양한 방법으로 순회가 가능했음
- ES6에서는 순회 가능한 데이터 컬렉션을 이터레이션 프로토콜을 준수하는 이터러블로 통일
→ `for...of문` , `스프레드문법` , `배열 디스트럭처링 할당` 의 대상으로 사용할 수 있도록 일원화함
- 이터레이션 프로로콜에는 이터러블 프로토콜과 이터레이터 프로토콜이 있음
    - 이터러블 프로토콜
        - Well-known Symbol인 `Symbol.iterator` 를 프로퍼티 키로 사용한 메서드를 직접 구현하거나 프로토타입 체인을 통해 상속받은  `Symbol.iterator` 메서드를 호출하면 이터레이터 프로토콜을 준수한 이터레이터를 반환하는데 이러한 규약을 이터러블 프로토콜이라 함
    - 이터레이터 프로토콜
        - 이터레이터는 next 메서드를 소유하며 next 메서드를 호출하면 이터러블을 순회하며 value와 done 프로퍼티를 갖는 이터레이터 result 객체를 반환하는데 이러한 규약을 이터레이터 프로토콜이라함
        - 이터레이터는 이터레이터 프로토콜을 준수한 객체
        이터레이터는 이터러블 요소를 탐색하기 위한 포인터 역할을 함

### 34.1.1 이터러블

- 이터러블은 이터러블 프로토콜을 준수한 객체.
    
    → 이터러블은 Symbol.iterator를 프로퍼티 키로 사용한 메서드를 직접 구현하거나 프로토타입 체인을 통해 상속받은 객체를 뜻함
    
- 이터러블은 for…of 문으로 순회 가능, 스프에드 문법과 배열 디스트럭처링 할당의 대상으로 사용 가능
    
    e.g. 배열은 Array.prototype 의 Symbol.iterator 메서드를 상속받는 이터러블
    

### 34.1.2 이터레이터

- 이터러블의 Symbol.iterator 메서드를 호출하면 이터레이터 프로토콜을 준수한 이터레이터를 반환
    
    **→ 이 이터레이터는 next 메서드를 소유한다**
    
- 이터레이터의 next 메서드는 이터러블의 각 요소를 순회하기 위한 포인터 역할을 함
→ next 메서드를 호출하면 이터러블을 순차적으로 순회하며 순회 결과를 나타내는 **이터레이터 리절트 객체**를 반환
    
    이 리절트 객체의 value 프로퍼티는 현재 순회중인 이터러블의 값을, done 프로퍼티는 이터러블의 순회 완료 여부를 나타냄
    

## 34.2 빌트인 이터러블

- JS는 이터레이션 프로토콜을 준수한 객체인 빌트인 이터러블을 제공
- 빌트인 이터러블인 표준 빌트인 객체들
    
    
    | 빌트인 이터러블 | Symbol.iterator 메서드                  |
    | --------------- | --------------------------------------- |
    | Array           | Array.prototype[Symbol.iterator]        |
    | String          | String.prototype[Symbol.iterator]       |
    | Map             | Map.prototype[Symbol.iterator]          |
    | Set             | Set.prototype[Symbol.iterator]          |
    | TypedArray      | TypedArray.prototype[Symbol.iterator]   |
    | arguments       | arguments[Symbol.iterator]              |
    | DOM컬렉션        | NodeList.prototype[Symbol.iterator]     |
    | DOM컬렉션        |HTMLCollection.prototype[Symbol.iterator]|

## 34.3 for…of 문

- `for ... of` 문을 이터러블을 순회하면서 이터러블의 요소를 변수에 할당
    
    ```jsx
    for(variable of iterable) { ... }
    // variable -> 반복에 서로 다른 속성값이 variable에 할당됨
    // iterable -> 반복되는 열거가능(enumerable)한 속성이 있는 객체
    ```
    
- `for ... in` 문은 `for ... of` 문과 매우 유사하지만 
객체의 프로토타입 체인 상에 존재하는 모든 프로토타입의 프로퍼티 중 프로퍼티 어트리뷰트 [[Enumerable]]의 값이 true인 프로퍼티를 순회하며 열거함 
이 때 프로퍼티 키가 심벌인 프로퍼티는 열거 ❌
- `for ... of` 문은 내부적으로 이터레이터의 next 메서드를 호출하여 이터러블을 순회하며 next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티 값을 `for ... of` 문의 변수에 할당. 
이터레이터 리절트 객체의 done 로퍼티 값이 false 이면 순회를 계속 하고 true이면 순회를 중단
- `for ... in` 문과 `for ... of` 문의 차이
    
    ```jsx
    Object.prototype.objCustom = function () {};
    Array.prototype.arrCustom = function () {};
    
    let iterable = [3, 5, 7];
    iterable.foo = "hello";
    
    for (let i in iterable) {
      console.log(i); // 0, 1, 2, "foo", "arrCustom", "objCustom"
      // 열거 가능한 속성들을 반복
    }
    
    for (let i of iterable) {
      console.log(i); // 3, 5, 7
      // 컬렉션 전용! 모든 객체보다는, [Symbol.iterator] 속성이 있는 
      // 모든 컬렉션 요소에 대해 이 방식으로 반복
    }
    ```
    

## 34.4 이터러블과 유사 배열 객체

- 유사 배열 객체
    - 배열 처럼 인덱스로 프로퍼티 값에 접근 할 수 있고 length 프로퍼티를 갖는 객체
    - for문 순회 가능, 인덱스로 프로퍼티 값에 접근 가능
    - 이터러블이 아닌 일반 객체이므로 Symbol.iterator 메서드가 없음 → `for … of` 문으로 순회 불가능
- ES6에서 이터러블이 도입되면서 유사 배열 객체인 arguments, NodeList, HTMLCollercion 객체에 Symbol.iterator 메서드를 구현하여 이터러블이 됨
- 모든 유사 배열 객체가 이터러블은 ❌ 
단, `Array.from` 메서드를 사용하면 유사 배열 객체 or 이터러블을 배열로 변환할 수 잇음

## 34.5 이터레이션 프로토콜의 중요성

- 이터레이터 프로토콜은 다양한 데이터 공급자가 하나의 순회 방식을 갖도록 규정. 데이터 소비자가 효율적으로 다양한 데이터 공급자를 사용할 수 있도록 데이터 소비자와 데이터 공급자를 연결하는 인터페이스 역할을 함
    
    ![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/7d5bae4c-3419-4df1-a2d1-d33c9f921884/02b4c8f3-bea7-41ac-9ced-cfa5ab25fc24/Untitled.png)
    

# 35장 - 스프레드 문법(ES6)

- 스프레드 문법은 하나로 뭉쳐 있는 여러 값들의 집합을 펼쳐서 개별적인 값들의 목록으로 만듦
- 스프레드 문법 사용 대상
    - Array, String, Map, Set, DOM 컬렉션(NodeList, HTMLCollection), arguments와 같이 `for ... of` 문으로 순회할 수 있는 **이터러블**
- 스프레드 문법의 결과는 값❌ (스프레드 문법 …은 피연산자를 연산하여 값을 생성하는 연산자가 ❌)
→ 스프레드 문법의 결과는 변수에 할당 ❌
    
    ```jsx
    const list = ...[1, 2, 3]; // SystaxError: Unexpected token ...
    ```
    
- 쉼표로 구분한 값의 목록을 사용하는 문맥에서만 사용 가능
    - 함수 호출문의 인수 목록
    - 배열 리터럴의 요소 목록
    - 객체 리터럴의 프로퍼티 목록

## 35.1 함수 호출문의 인수 목록에서 사용하는 경우

- 요소들의 집합인 배열을 펼쳐서 개별적인 값들의 목록으로 만든 후 함수의 인수 목록으로 전달해야하는 경우
    
    ```jsx
    const arr = [1,2,3];
    // 배열 arr의 요소 중 최대값을 구하기 위해 Math.max를 사용
    const max = Math.max(arr); // -> NaN
    // Math.max 메서드에 숫자가 아닌 배열을 인수로 전달하면 
    // 최대값을 구할 수 없으므로 NaN을 반환
    ```
    
    → 위와 같은 문제 해결을 위해 배열을 펼쳐 요소들을 개별적인 값들의 목록으로 만든 후 Math.max 메서드의 인수로 전달해야했음.([1,2,3] → 1,2,3) 
    스프레드 문법이 제공되기 전에는 Function.prototype.apply를 사용했음
    

TIP) 스프레드 문법과 Rest 파라티머는 서로 반대의 개념이니 주의할 것!

```jsx
// Rest 파라미터는 인수들의 목록을 배열로 전달받음
function foo(...rest){
	console.log(rest); // 1,2,3 -> [1,2,3]
}
// 스프레드 문법은 배열과 같은 이터러블을 펼쳐서 개별적인 값들의 목록을 만듦
// [1,2,3] -> 1,2,3
foo(...[1,2,3]);
```

## 35.2 배열 리터럴 내부에서 사용하는 경우

- ES5에서 사용하던 기존의 방식과 비교하기

### 35.2.1 concat

- ES5에서 2개의 배열을 1개의 배열로 결합하고 싶은 경우 배열 리터럴만으로는 해결할 수 없고 concat 메서드를 사용해야함. 
하지만 스프레드 문법을 사용하면 배열 리터럴만 사용해서 처리 가능!
    
    ```jsx
    // ES5
    var arr = [1,2].concat([3,4]);
    console.log(arr); // [1,2,3,4]
    // ES6
    const arr1 = [...[1,2], ...[3,4]];
    console.log(arr1); // [1,2,3,4]
    ```
    

### 35.2.2 splice

- ES5에서 배열의 중간에 다른 배열의 요소를 추가하거나 제거하려면 splice 메서드를 사용해야하는데 세번째 인수로 배열을 전달하면 배열 자체가 추가됨
→ 세번째 인수인 배열을 해체에서 전달해야하므로 Function.prototype.apply 메서드를 사용해서 처리했음
하지만 스프레드 문법을 사용하면 간결하게 처리 가능!
    
    ```jsx
    // ES5
    var arr1 = [1,4];
    var arr2 = [2,3];
    arr1.splice(1,0,arr2);
    console.log(arr1); // [1,[2,3],4]
    Array.prototype.splice.apply(arr1, [1,0].concat(arr2));
    console.log(arr1); // [1,2,3,4]
    
    // ES6
    const arr1 = [1,4];
    const arr2 = [2,3];
    arr.splice(1,0, ...arr2);
    console.log(arr1); // [1,2,3,4]
    ```
    

### 35.2.3 배열복사

- ES5에서 배열복사시 slice 메서드를 사용했음.
하지만 스프레드 문법을 사용하면 더 간결하게 처리 가능!
    
    ```jsx
    // ES5
    var origin = [1,2];
    var copy = origin.slice();
    console.log(copy); // [1,2]
    console.log(copy === origin); // false
    
    // ES6
    const origin = [1,2];
    const copy = [...origin];
    console.log(copy); // [1,2]
    console.log(copy === origin); // false
    // 이 때 원본 배열의 각 요소를 얕은 복사하여 새로운 복사본을 생성(slice도 같음)
    ```
    

### 35.2.4 이터러블을 배열로 변환

- ES5에서 티어러블을 배열로 변환하려면 Function.prototype.apply 또는 [Function.prototype.call](http://Function.prototype.call) 메서드를 사용해서 slice 메서드를 호출해야해ㅔㅆ음
    
    하지만 스프레드 문법을 사용하면 더 간결하게 처리 가능
    
    ```jsx
    // ES5
    function sum(){
    	var args = Array.prototype.slice.call(arguments);
    	return args.reduce(function (pre, cur){
    		return pre+cur;
    	},0);
    }
    console.log(sum(1,2,3)); // 6
    
    // 스프레드 문법 사용
    function sum(){
    	return [...arguments].reduce((pre, cur) => pre+cur, 0);
    }
    // Rest 파라미터를 사용하면 더 간결하게 처리 가능
    conmst sum = (...args) => args.reduce((pre, cur) => pre+cur,0);
    console.log(sum(1,2,3)); // 6
    ```
    

## 35.3 객체 리터럴 내부에서 사용하는 경우

- 스프레드 프로퍼티를 사용하면 객체 리터럴의 프로퍼티 목록에서도 스프레드 문법 사용가능
- 스프레드 문법의 대상은 이터러블이어야하지만 스프레드 프로퍼티 제안은 일반 객체를 대상으로도 스프레드 문법의 사용을 허용

# 36장 - 디스트럭처링 할당(구조 분해 할당)

- 구조화된 배열과 같은 이터러블 또는 객체를 비구조화하여 1개 이상의 변수에 개별적으로 할당하는 것
- 배열과 같은 이터러블 또는 객체 리터럴에서 필요한 값만 추출하여 변수에 할당할 때 유용

## 365.1 배열 디스트럭처링 할당

```jsx
// ES5
var arr = [1,2,3];
var one = arr[0];
console.log(one); // 1
// ES6 배열 디스트럭처링 할당
const arr = [1,2,3];
// 변수 one, two, three를 선언하고 배열 arr를 디스트럭처링하여 할당 
// 할당 기준은 배열의 인덱스
const [one, two, three] = arr;
console.log(one); // 1
```

- 배열 디스트럭처링 할당의 대상(할당문의 우변)은 이터러블이어야함. 할당 기준은 배열의 인덱스(순서대로 할당되지만 변수의 개수와 이터러블의 요소 개수가 일치할 필요는 없음)
- 할당 연산자 왼쪽에 값을 할당받을 변수를 선언해야하는데, 배열 리터럴 형태로 선언해야함
- 할당을 위한 변수에 기본값 설정 가능
    
    ```jsx
    // 기본값보다 할당된 값이 우선함
    const [e, f = 10, g = 3] = [1,2];
    console.log(e,f,g); // 1 2 3 
    ```
    
- 할당을 위한 변수에 Rest 파라미터와 유사하게 Rest 요소를 사용 할 수 있음(Rest 파라미터 처럼 반드시 마지막에 위치)
    
    ```jsx
    // Rest 요소
    const [x, ...y] = [1,2,3];
    console.log(x,y); // 1 [2,3]
    ```
    

## 36.2 객체 디스트럭처링 할당

```jsx
// ES5
var user = {firstName: 'gyeol', lastName: 'Park'};
var firstName = user.firstName;
var lastName= user.lastName;

// ES6 디스트럭처링 할당
const user = {firstName: 'gyeol', lastName: 'Park'};
// 이 때 프로퍼티 키를 기준으로 디스트럭처링 할당이 이루어짐. 순서 의미 X
const {lastName, firstName} = user;
console.log(firstName , lastName); // Gyeol Park
```

# 37장 - Set과 Map

## 37.1 Set

- 중복되지 않는 유일한 값들의 집합
- Set은 수학적 집합을 구현하기 위한 자료구조(교집합, 합집합 등을 구현 가능)
- 배열과 유사하지만 차이가 있음
    
    
    | 구분 | 배열 | Set 객체 |
    | --- | --- | --- |
    | 동일한 값을 중복하여 포함 가능 | ⭕ | ❌ |
    | 요소 순서에 의미 | ⭕ | ❌ |
    | 인덱스로 요소에 접근 가능 | ⭕ | ❌ |

### 37.1.1 Set 객체의 생성

- Set 생성자 함수로 생성
- Set생성자 함수에 인수를 전달하지 않으면 빈 Set 객체가 생성됨
- Set 생성자 함수는 이터러블을 인수로 전달받아 Set 객체를 생성함(이 때 이터러블의 중복된 값은 Set 객체에 요소로 저장 ❌)
    
    ```jsx
    const set1 = new Set([1,2,3,3]);
    console.log(set1); // Set(3) {1,2,3}
    ```
    

### 37.1.2 요소 개수 확인

- Set.prototype.size 프로퍼티를 통해 요소 개수 확인 가능
- size프로퍼티는 setter 함수 없이 getter 함수만 존재하는 접근자 프로퍼티 → size 프로퍼티에 숫자를 할당하여 Set 객체의 요소 개수 변경 불가능
    
    ```jsx
    const {size} = new Set([1,2,3,3]);
    console.log(size); // 3
    ```
    

### 37.1.3 요소 추가

- Set.prototype.add 메서드를 통해 요소 추가
- add 메서드는 새로운 요소가 추가된 Set 객체를 반환 
→ add 메서드 호출 후 add 메서드를 연속적으로 호출 가능
- 중복된 요소의 추가 비허용(에러 발생 ❌ 그냥 무시됨)
    
    ```jsx
    const set = new Set();
    set.add(1).add(2);
    console.log(set) // Set(2) {1,2}
    ```
    

### 37.1.4 요소 존재 여부 확인

- Set.prototype.has 메서드를 통해 요소 존재 확인 가능

### 37.1.5 요소 삭제

- Set.prototype.delete 메서드를 통해 요소 삭제(삭제 성공 여부를 나타내는 불리언 값 반환)
- 삭제 하려는 요소 값을 인수로 전달(Set 객체는 순서에 의미가 없음)
    
    ```jsx
    const set = new Set([1,2,3]);
    // 요소 2 삭제
    set.delete(2);
    console.log(set); // SEt(2) {1,3}
    ```
    

### 37.1.6 요소 일괄 삭제

- Set.prototype.clear 메서드를 통해 모든 요소 일괄 삭제(clear 메서드는 언제나 undefined를 반환함)

### 37.1.7 요소 순회

- Set.prototype.forEach를 통해 Set 객체의 요소 순회
- Array.prototype.forEacth 메서드와 유사하지만 Set 객체는 순서에 의미가 없어 배열처럼 인덱스를 갖지 않음
    
     → 첫 번째, 두 번째 인수는 현재 순회 중인 요소 값으로 같은 값임(Array.prototype.forEach 메서드와 인터페이스를 통일하기 위해 저렇게 됨)
    참고) 순서에 의미는 없지만 순회하는 순서는 요소가 추가된 순서를 따름
    
    ```jsx
    const set = new Set([1,2,3]);
    set.forEach((v,v2,set)=>console.log(v,v2,set));
    // 1 1 Set(3) {1,2,3}
    // 2 2 Set(3) {1,2,3}
    // 3 3 Set(3) {1,2,3}
    ```
    
- **Set 객체는 이터러블 → `for … of` 문으로 순회 가능. 스프레스 문법, 구조 분해 할당 문법 사용 가능**

## 37.2 Map

- Map 객체는 키와 값의 쌍으로 이뤄진 컬렉션
- 객체와 유사하지만 차이가 있음
    
    
    | 구분 | 객체 | Map 객체 |
    | --- | --- | --- |
    | 키로 사용할 수 있는 값 | 문자열 또는 심벌 값 | 객체를 포함한 모든 값 |
    | 이터러블 | ❌ | ⭕ |
    | 요소 개수 확인 | Object.keys(obj).length | map.size |

### 37.2.1 Map 객체의 생성

- Map 생성자 함수로 생성
- Map 생성자 함수에 인수를 전달하지 않으면 빈 Map 객체 생성
- Map 생성자 함수는 이터러블을 인수로 전달받아 Map 객체 생성
(이때 인수로 전달되는 이터러블은 키와 값의 쌍으로 이뤄진 요소로 구성되어야함)
- Map 객체는 중복된 키를 갖는 요소가 존재할 수 없음(중복된 키를 갖는 요소가 존재하면 덮어쓰기됨)
    
    ```jsx
    // 이터러블 인수로 전달해서 Map 객체 생성
    const map1 = new Map([['key1', 'value1'],['key2', 'value2']]);
    console.log(map1); // Map(2) {"key1" => "value1", "key2" => "value2"}
    ```
    

### 37.2.2 요소 개수 확인

- Map.prototype.size 프로퍼티를 통해 Map 객체의 요소 개수 확인
- size 프로퍼티는 setter 함수 없이 getter 함수만 존재하는 접근자 프로퍼티 
→ Map 객체의 요소 개수 변경 불가능

### 37.2.3 요소 추가

- Map.prototype.set 메서드를 통해 요소 추가
- set 메서드는 새로운 요소가 추가된 Map객체를 반환 
→ set 메서드 호출 후 set 메서드를 연속적으로 호출 가능
- 중복된 요소의 추가 비허용(에러 발생 ❌ 그냥 무시됨)
- **객체는 문자열 또는 심벌 값만 키로 사용할 수 있지만 Map 객체는 키 타입에 제한 없음**
    
    **→ 객체를 포함한 모든 값을 키로 사용할 수 있음**
    

### 37.2.4 요소 취득

- Map.prototype.get 메서드를 통해 특정 요소 취득
- get 메서드 인수로 키를 전달하면 Map 객체에서 인수로 전달한 키를 값는 값을 반환. 찾지 못하면 undefined를 반환

### 37.2.5 요소 존재 여부 확인

- Map.prototype.has 메서드를 통해 특정 요소의 존재 여부 확인

### 37.2.6 요소 삭제

- Map.prototype.delete 메서드를 통해 요소 삭제
- **delete 메서드는 삭제 성공 여부를 나타내는 불리언 값을 반환. set 메서드와 달리 연속적으로 호출 불가능**

### 37.2.7 요소 일괄 삭제

- Map.prototype.clear 메서드를 통해 요소 일괄 삭제(언제나 undefined 반환)

### 37.2.8 요소 순회

- Map.prototype.forEach를 통해 Map 객체의 요소 순회
- Array.prototype.forEach 와 유사하게 콜백 함수와 forEach 메서드의 콜백 함수 내부에서 this로 사용될 객체(옵션)를 인수로 전달. 이 때 콜백 함수는 3개의 인수를 전달받음
    - 첫 번째 인수 : 현재 순회 중인 요소 값
    - 두 번째 인수 : 현재 순회 중인 요소 키
    - 새 번째 인수 : 현재 순회 중인 Map 객체 자체
- **Map 객체는 이터러블 → `for … of` 문으로 순회 가능. 스프레스 문법, 구조 분해 할당 문법 사용 가능**
- **Map 객체는 이터러블이면서 동시에 이터레이터인 객체를 반환하는 메서드를 제공**
    
    
    | Map 메서드 | 설명 |
    | --- | --- |
    | Map.prototype.keys | Map 객체에서 요소키를 값으로 갖는 이터러블 이면서 동시에 이터레이터인 객체를 반환 |
    | Map.prototype.values | Map 객체에서 요소값을 값으로 갖는 이터러블 이면서 동시에 이터레이터인 객체를 반환 |
    | Map.prototype.entries | Map 객체에서 요소키와 요소값을 값으로 갖는 이터러블 이면서 동시에 이터레이터인 객체를 반환 |
- Map 객체는 요소의 순서에 의미는 없지만 순회하는 순서는 요소가 추가된 순서를 따름

# 💭 느낀점

- 이번 챕터는 자주 사용하지만 제대로 알지 못하는 부분들을 다뤄서 좋았다.
- 특히 Map과 Set, 스프레드 문법, 구조분해 할당은 실무에서 자주 사용했지만 대충 알고 사용했기 때문에 에러와 마주한 경험이 꽤 있었다 😵 에러가 발생해서 찾아보면 대부분 잘못된 방법으로 사용한 것이 문제였고 그럴 때마다 머쓱해하며 수정했던 기억이 난다(ㅋㅋㅋ)
아예 모르는 것보다 대충 알고 코드를 짜는 게 더 위험한 것 같다 🥲
- `for … of 문` 과 `for ... in문` 의 차이에 대해 대충은 알고 있었지만 이터러블과 관련이 있다는 건 이번에 처음 알았다. 공부를 하면 할 수록 자바스크립트는 정말 논리적이구나 라고 느끼게되는듯..모든 것은 이유가 있고 그냥 만들어지는 법이 없다!
