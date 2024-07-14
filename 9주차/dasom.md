# Morden JavaScript Deep Dive

Dasom, 2024.07.07

※ 메서드는 자주 사용하거나 특이점이 있는 것 위주로 정리함

## 33장 Symbol

> Symbol이란? 
>
> ES6에서 도입된 자바스크립트 7번째 데이터 타입으로, 다른 값과 중복되지 않는 유일무이한 값이다. 
>
> 이름의 충돌 위험이 없는 유일한 프로퍼티 키를 만들기 위해 사용한다.



### Symbol 값의 생성

```js
const mySymbol = Symbol();
// new 연산자와 함께 호출하지 않음. (new 연산자와 생성하면 객체가 생성되지만 심벌 값은 변경 불가능한 원시값)
console.log(mySymbol); // Symbol() 값이 외부로 노출되지 않아 확인할 수 없음

// 값에 대한 설명이 같더라도 유일무이한 심벌 값을 생성함
const mySymbol1 = Symbol('mySymbol1');
const mySymbol2 = Symbol('mySymbol2');
console.log(mySymbol1 === mySymbol2); // false
```

* 심벌 값도 객체처럼 접근하면 암묵적으로 래퍼 객체를 생성하지만, 암묵적으로 문자열이나 숫자 타입으로 변환되지는 않음
  * 단, 불리언 타입으로는 암묵적으로 변환이 가능함



### Symbol의 사용

* 상수

```js
// 상수의 정의가 필요할 때 심벌을 사용하게 되면, 다른 값과 중복될 수 없다
const Direction = {
  UP: Symbol('up'),
  DOWN: Symbol('down')
}

const myDirection = Direction.UP; // 상수의 값보다는 이름 자체에 의미가 있는 경우 유용
```

* 프로퍼티 키

```js
// 프로퍼티 키를 심벌 값으로 만들면 다른 프로퍼티 키와 절대 충돌하지 않음
const obj = {
  [Symbol.for('mySymbol')]: 1
};

// 단, 이 경우 해당 프로퍼티를 for...in문이나 Object.keys, Object.getOwnPropertyNames 메서드로 찾을 수 없음. 따라서 프로퍼티 은닉에 사용
for (const key in obj) {
  console.log(key) // 아무 것도 출력되지 않음
}
```



> Symbol은 중복되지 않는 상수 값을 생성하는 것은 물론, 기존 작성 코드에 영향을 주지 않고 새로운 프로퍼티를 추가하기 위해 도입되었다.



## 34장 이터러블

> 이터레이션 프로토콜이란?
>
> 순회가능한 자료 구조를 만드기 위해 ECMAScript 사양에 정의하여 미리 약속한 규칙



> 이터러블?
>
> 이터러블 프로토콜을 준수한 객체



### 빌트인 이터러블

* Array
* String
* Map
* Set
* TypedArray
* arguments
* DOM 컬렉션

⇨ for ... of 문으로 순회 가능



### 유사 배열 객체

* 유사 배열 객체는 이터러블이 아닌 일반 객체
  * 따라서, for문으로 순회하는 것은 가능하지만 Symbol.iterator 메서드가 없어 for ... of 문으로 순회 불가
  * Array.from 메서드를 통해 유사 배열 객체를 배열로 변환하여 순회할 수 있음



### 이터레이션 프로토콜의 필요성

* ES6 이전의 이터러블 자료구조는 통일된 규약 없이 for문, for ... in 문, foreach 메서드 등 다양한 방법으로 순회 가능

* ES6 이후 순회 가능 자료 구조를 이터레이션 프로토콜을 준수하는 이터러블로 통일

  *  for ... of 문으로 순회 가능

  * 스프레드 문법

  * 배열 디스트럭처링 할당

    ⇨ 이터러블이 데이터 공급자의 역할을 할 수 있음



## 35장 스프레드 문법

> 스프레드 문법 (전개 문법) ...
>
> 하나로 뭉쳐 있는 여러 값들의 집합을 펼쳐 개별적인 값들의 목록으로 만듦

* 스프레드 문법을 사용할 수 있는 대상은 for ... of 문으로 순회할 수 있는 이터러블에 한정됨

```js
console.log(...[1, 2, 3]) // 1 2 3
console.log(...'Hello') // H e l l o
console.log(...new Map([['a', '1'], ['b', '2']])) // ['a', '1'] ['b', '2']
```



### 사용 예제

* 함수 호출문의 인수 목록

```js
const arr = [1, 2, 3];

const max1 = Math.max(arr); // NaN
const max2 = Match.max(...arr)
console.log(max2) // 3
```

* 배열 리터럴 내부

```
// 1. concat 대체
// ES5
var arr = [1, 2].concat([3, 4])
// ES6
const arr = [...[1, 2], ...[3, 4]]

// 2. splice
// ES5
var arr1 = [1, 4];
var arr2 = [2, 3];
arr1.splice(1, 0, arr2); // [1, [2, 3], 4]
Array.prototype.slice.apply(arr1, [1, 0].concat(arr2)) // [1, 2, 3, 4]
// ES6
arr1.splice(1, 0, ...arr2)

// 3. 배열 복사 (얕은 복사)
// ES5
var origin = [1, 2];
var copy = origin.slice();
// ES6
const origin = [1, 2];
const copy = [...origin];
// cf. 얕은 복사다
console.log(origin === copy) // false
```





## 36장 디스트럭처링 할당

> 디스트럭처링 할당 (구조 분해 할당)이란?
>
> 구조화된 배열과 같은 이터러블 또는 객체를 비구조화하여 1개 이상의 변수에 개별적으로 할당하는 것



### 배열 디스트럭처링 할당

```js
// ES5
var arr = [1, 2]
var one = arr[0]
var two = arr[1]

// ES6
const arr = [1, 2]
const [one, two] = arr

// 할당 기준은 배열의 인덱스로, 개수가 반드시 일치할 필요는 없다
const [a, b, c] = arr
console.log(c) // undefined

// 기본 값보다 할당 값이 우선한다
const [d, e = 10] = arr
console.log(e) // 2
```



### 객체 디스트럭처링 할당

```js
// ES5
var user = { firstName: "Dasom", lastName: "Park"}
var firstName = user.firstName
var lastName = user.lastName

// ES6
const user = { firstName: "Dasom", lastName: "Park"}
// 할당 기준은 프로퍼티 키이기 때문에 순서는 상관이 없다
const {lastName, firstName} = user;
console.log(lastName) // Park
```



## 37장 Set과 Map

### Set

> Set 객체는 중복되지 않는 유일한 값들의 집합
>
> 배열과 유사하지만, 요소 순서에 의미가 없으며 따라서 인덱스로 요소에 접근할 수 없다.

* Set 객체 생성

```js
const set = new Set();
console.log(set) // set(0){}
// 중복된 값은 객체 요소로 저장되지 않음
const set1 = new Set("hello");
console.log(set1)// set(4) {"h", "e", "l", "o"}

```

* 요소 개수 확인: size

```js
const set = new Set([1, 2, 3])
console.log(set.size) // 3
```

* 요소 추가

```js
const set = new Set();
set.add(1);
console.log(set) // Set(1) {1}
```

* 요소 존재 여부 확인: has

```js
const set = new Set([1, 2, 3])
console.log(set.has(1)) // true
console.log(set.has(4)) // false
```

* 요소 삭제 delete, clear

```
const set = new Set([1, 2, 3])
console.log(set.delete(1))
console.log(set.delete(4)) // 에러 없이 무시됨
// 전체 삭제
set.clear()
```



* Set의 특징

  * forEach메서드로 순회가 가능
    * 첫번째 인수: 현재 순회 중 요소의 값
    * 두번째 인수 === 첫번째 인수 // Array.prototype.forEach와 인터페이스를 통일하기 위함
    * 세번째 인수: 현재 순회 중인 Set 객체 자체
  * 이터러블
    * for ... of문으로 순회 가능
    * 스프레드 문법 사용 가능
    * 배열 디스트럭처링의 대상이 됨
  * **수학적 집합을 구현하기 위한 자료 구조** 

  ```js
  // 교집합을 프로토타입 메서드로 구현
  Set.prototype.intersection = function (set) {
    const res = new Set();
    for (const value of set) {
      // 2개의 set 요소가 공통되는 요소이면 교집합의 대상
      if (this.has(value)) result.add(value)
    }
    return res
  }
  
  const setA = new Set([1, 2, 3, 4]);
  const setB = new Set([2, 4]);
  
  console.log(setA.intersction(setB)) // Set(2){2, 4}
  ```

  



### Map

> Map 객체는 키와 값의 쌍으로 이루어진 컬렉션
>
> 단, 일반 객체는 이터러블이 아니지만 Map 객체는 이터러블이다.

* Map 객체 생성

```js
const map = new Map();
console.log(set) // Map(0){}
// 키와 값의 쌍으로 이루어진 이터러블을 인수로 전달받아 Map 객체를 생성
const map1 = new Map([['key1', 'val1'], ['key2', 'val2']])
console.log(map1)// Map(2){"key1" => "val1", "key2" => "val2"}

```

* 요소 개수 확인: size

```js
const map = new Map([['key1', 'val1'], ['key2', 'val2']])
console.log(map.size) // 2
```

* 요소 추가: set

```js
const map = new Map();
map
  .set('key1', 'val1')
	.set('key2', 'val2') // 연속 호출 가능
```

* 요소 취득: get

```js
const map = new Map();
map
  .set('key1', 'val1')
	.set('key2', 'val2')

console.log(map.get('key1')) // val1

```

* 요소 존재 여부 확인: has

```js
const map = new Map([['key1', 'val1'], ['key2', 'val2']])
console.log(map.has('key1')) // true
console.log(map.has('name')) // false
```

* 요소 삭제 delete, clear

```
const map = new Map([['key1', 'val1'], ['key2', 'val2']])
console.log(map.delete('key1')) 
console.log(map.delete('name')) // key가 없으면 무시됨
// 전체 삭제
map.clear()
```

* Map의 특징

  * forEach메서드로 순회가 가능
    * 첫번째 인수: 현재 순회 중 요소의 값
    * 두번째 인수 === 첫번째 인수 // Array.prototype.forEach와 인터페이스를 통일하기 위함
    * 세번째 인수: 현재 순회 중인 Map 객체 자체

  * 이터러블
    * for ... of문으로 순회 가능
    * 스프레드 문법 사용 가능
    * 배열 디스트럭처링의 대상이 됨



## 느낀점

이터러블이라고 하면 무작정 그냥 반복문 돌릴 수 있는 것이다 라는 정도만 이해하고 넘어왔었는데, 조금 더 자세히 알 수 있는 챕터로 구성되어 있어 좋았다.

그리고 새삼스럽지만 ES6 이후에 자바스크립트를 배워서 다행이다. ES6 이전부터 자바스크립트로 개발을 하다가, ES6 이후 문법을 새로 익힌 사람들은 아예 새로운 언어를 배운 기분이지 않았을까.



**공유할 내용**

이터러블을 순회하는 for ... of에는 주의해야할 점이 있다.

map이나 foreach는 처음 순회할 때 배열의 갯수에 따라 순회할 순서가 정해지는 반면, for of는  매 반복마다 배열의 상태가 업데이트 된다.

(이러한 이유로 for of는 break continue를 사용할 수 있다)

```js
// for ... of
const arr = ['a', 'b', 'c']

for (let item of arr) {
  console.log(item);
  if (item === 'b'){
    arr.push('d')
  }
}
// a
// b
// c
// d -> 중간에 추가한 요소도 함께 출력된다.
```

```js
// forEach
const arr = ['a', 'b', 'c']

arr.forEach( item => {
  console.log(item);
  if (item === 'b'){
    arr.push('d')
  }
})
// a
// b
// c
console.log(arr); // ['a', 'b', 'c', 'd']
```







