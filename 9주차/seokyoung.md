## 33장 7번째 데이터 타입 Symbol

### 33.1 심벌이란?

- ES6에서 도입된 7번째 데이터 타입으로 변경 불가능한 원시 타입의 값이다.
- 심벌 값은 다른 값과 중복되지 않는 유일무이한 값이다.

### 33.2 심벌 값의 생성

#### 33.2.1 Symbol 함수

- 심벌 값은 Symbol 함수를 호출하여 생성한다.
- 이때 생성된 심벌 값은 외부로 노출되지 않아 확인할 수 없으며, 다른 값과 절대 중복되지 않는 유일무이한 값이다.

```js
const mySymbol = Symbol()

console.log(typeof mySymbol) // symbol
console.log(mySymbol) // Symbol()
```

- String, Number, Boolean 생성자 함수와 달리 new 연산자와 함께 호출하지 않는다.
- new 연산자와 함께 생성자 함수 또는 클래스를 호출하면 객체(인스턴스)가 생성되지만 심벌 값은 변경 불가능한 원시 값이다.

```js
new Symbol() // TypeError: Symbol is not a constructor
```

- Symbol 함수에는 선택적으로 문자열을 인수로 전달할 수 있다. 이 문자열은 생성된 심벌 값에 대한 설명으로 디버깅 용도로만 사용되며, 심벌 값 생성에 어떠한 영향도 주지 않는다.
- 즉, 심벌 값에 대한 설명이 같더라도 생성된 심벌 값은 유일무이한 값이다.

```js
const mySymbol1 = Symbol('mySymbol')
const mySymbol2 = Symbol('mySymbol')

console.log(mySymbol1 === mySymbol2) // false
```

- 심벌 값도 문자열, 숫자, 불리언과 같이 객체처럼 접근하면 암묵적으로 래퍼 객체를 생성한다.

```js
const mySymbol = Symbol('mySymbol')

console.log(mySymbol.description) // mySymbol
console.log(mySymbol.toString()) // Symbol(mySymbol)
```

- 심벌 값은 암묵적으로 문자열이나 숫자 타입으로 변환되지 않는다.
- 단, 불리언 타입으로는 암묵적으로 타입 변환된다. 이를 통해 if 문 등에서 존재 확인이 가능하다.

```js
const mySymbol = Symbol()

console.log(mySymbol + '') // TypeError: Cannot convert a Symbol value to a string
console.log(+mySymbol) // TypeError: Cannot convert a Symbol value to a number
console.log(!!mySymbol) // true

if (mySymbol) console.log('mySymbol is not empty.')
```

#### 33.2.2 Symbol.for / Symbol.keyFor 메서드

##### Symbol.for

- 인수로 전달받은 문자열을 키로 사용하여 키와 심벌 값의 쌍들이 저장되어 있는 **전역 심벌 레지스트리**에서 해당 키와 일치하는 심벌 값을 검색한다.
  - 검색에 성공하면 새로운 심벌 값을 생성하지 않고 검색된 심벌 값을 반환한다.
  - 검색에 실패하면 새로운 심벌 값을 생성하여 Symbol.for 메서드의 인수로 전달된 키로 전역 심벌 레지스트리에 저장한 후, 생성된 심벌 값을 반환한다.
- Symbol.for 메서드를 사용하면 애플리케이션 전역에서 중복되지 않는 유일무이한 상수인 심벌 값을 단 하나만 생성하여 **전역 심벌 레지스트리를 통해 공유할 수 있다.**

```js
const s1 = Symbol.for('mySymbol')
const s2 = Symbol.for('mySymbol')

console.log(s1 === s2) // true
```

##### Symbol.keyFor

- Symbol.keyFor 메서드를 사용하면 전역 심벌 레지스트리에 저장된 심벌 값의 키를 추출할 수 있다.

```js
const s1 = Symbol.for('mySymbol')
Symbol.keyFor(s1) // mySymbol

const s2 = Symbol('foo')
Symbol.keyFor(s2) // undefined
```

### 33.3 심벌과 상수

> [!NOTE]
> 값에는 특별한 의미가 없고 상수 이름 자체에 의미가 있는 경우 변경/중복될 가능성이 있는 무의미한 상수 대신 중복될 가능성이 없는 유일무이한 심벌 값을 사용할 수 있다.

```js
const Direction = {
  UP: Symbol('up'),
  DOWN: Symbol('down'),
  LEFT: Symbol('left'),
  RIGHT: Symbol('right'),
}

const myDirection = Direction.UP

if (myDirection === Direction.UP) {
  console.log('You are going UP.')
}
```

### 33.4 심벌과 프로퍼티 키

- 심벌 값을 프로퍼티 키로 사용하려면 프로퍼티 키로 사용할 심벌 값에 대괄호를 사용해야 한다.
- 프로퍼티에 접근할 때도 마찬가지로 대괄호를 사용해야 한다.
- 심벌 값은 유일무이한 값이므로 심벌 값으로 프로퍼티 키를 만들면 다른 프로퍼티 키와 절대 충돌하지 않는다.
- 기존 프로퍼티 키와 충돌하지 않는 것은 물론, 미래에 추가될 어떤 프로퍼티 키와도 충돌할 위험이 없다.

```js
const obj = {
  [Symbol.for('mySymbol')]: 1,
}

obj[Symbol.for('mySymbol')] // -> 1
```

### 33.5 심벌과 프로퍼티 은닉

- 심벌 값을 프로퍼티 키로 사용하여 생성한 프로퍼티는 for...in 문이나 Object.keys, Object.getOwnPropertyNames 메서드로 찾을 수 없다.
- ES6에서 도입된 Object.getOwnPropertySymbols 메서드를 사용하면 심벌 값을 프로퍼티 키로 사용하여 생성한 프로퍼티를 찾을 수 있다.

### 33.6 심벌과 표준 빌트인 객체 확장

- 중복될 가능성이 없는 심벌 값으로 프로퍼티 키를 생성하여 표준 빌트인 객체를 확장하면 표준 빌트인 객체의 기존 프로퍼티 키와 충돌하지 않는 것은 물론,
- 표준 사양의 버전이 올라감에 따라 추가될지 모르는 어떤 프로퍼티 키와도 충돌할 위험이 없어 안전하게 표준 빌트인 객체를 확장할 수 있다.

```js
Array.prototype[Symbol.for('sum')] = function () {
  return this.reduce((acc, cur) => acc + cur, 0)
}
;[1, 2][Symbol.for('sum')]() // 3
```

### 33.7 Well-known Symbol

- 자바스크립트가 기본 제공하는 빌트인 심벌 값을 ECMASciprt 사양에서는 Well-Known Symbol이라 부른다.
- Well-Known Symbol는 자바스크립트 엔진의 내부 알고리즘에 사용된다.
- for...of 문으로 순회 가능한 빌트인 이터러블은 Well-known Symbol인 Symbol.iterator를 키로 갖는 메서드를 가지며,
- Symbol.iterator 메서드를 호출하면 이터레이터를 반환하도록 ECMAScript 사양에 규정되어 있다.
- **즉, 빌트인 이터러블은 이터레이션 프로토콜을 준수한다.**
- 만약 빌트인 이터러블이 아닌 일반 객체를 이터러블처럼 동작하도록 구현하고 싶다면 이터레이션 프로토콜을 따르면 된다.
- ECMAScript 사양에 규정되어 있는 대로 Well-known Symbol인 Symbol.iterator를 키로 갖는 메서드를 객체에 추가하고 이터레이터를 반환하도록 구현하면 그 객체는 이터러블이 된다.
- 이때 이터레이션 프로토콜을 준수하기 위해 일반 객체에 추가해야 하는 메서드의 키 Symbol.iterator는 기존 프로퍼티 키 또는 미래에 추가될 프로퍼티 키와 절대로 중복되지 않을 것이다.
- **이처럼 심벌은 중복되지 않는 상수 값을 생성하는 것은 물론 기존에 작성된 코드에 영향을 주지 않고 새로운 프로퍼티를 추가하기 위해, 즉 하위 호환성을 보장하기 위해 도입되었다.**

## 34장 이터러블

### 34.1 이터레이션 프로토콜

- ES6에서 도입된 이터레이션 프로토콜은 순회 가능한 데이터 컬렉션(자료구조)을 만들기 위해 ECMAScript 사양에 정의하여 미리 약속한 규칙이다.
- ES6에서는 순회 가능한 데이터 컬렉션을 이터레이션 프로토콜을 준수하는 이터러블로 통일하여 for...of 문, 스프레드 문법, 배열 디스트럭처링 할당의 대상으로 사용할 수 있도록 일원화했다.
- 이터레이션 프로토콜에는 이터러블 프로토콜과 이터레이터 프로토콜이 있다.

#### 34.1.1 이터러블

> [!NOTE]
> 이터러블 프로토콜을 준수한 객체

- Symbol.iterator를 프로퍼티 키로 사용한 메서드를 직접 구현하거나 프로토타입 체인을 통해 상속받은 객체를 말한다.
- 이터러블은 for...of 문으로 순회할 수 있으며, 스프레드 문법과 배열 디스트럭처링 할당의 대상으로 사용할 수 있다.
- 기본적으로 일반 객체는 이터러블 프로토콜을 준수한 이터러블이 아니다. 하지만 이터러블 프로토콜을 준수하도록 구현하면 이터러블이 된다.

```js
const isIterable = v => v !== null && typeof v[Symbol.iterator] === 'function'
```

#### 34.1.2 이터레이터

```js
{
  [Symbol.iterator]() {
    return {
      next() {
        return { value: any, done?: boolean }
      }
    }
  }
}
```

- 이터러블의 Symbol.iterator 메서드는 이터레이터를 반환해야 한다. 이터레이터는 next 메서드를 갖는다.
- next 메서드는 각 요소를 순회하기 위한 포인터의 역할을 한다. 즉, next 메서드를 호출하면 이터러블을 순차적으로 한 단계씩 순회하며 순회 결과를 나타내는 이터레이터 리절트 객체를 반환한다.
- 이터레이터 리절트 객체
  - value: 현재 순회 중인 이터러블의 값
  - done: 이터러블의 순회 완료 여부

```js
const array = [1, 2, 3]
const iterator = array[Symbol.iterator]()

console.log(iterator.next()) // { value: 1, done: false }
console.log(iterator.next()) // { value: 2, done: false }
console.log(iterator.next()) // { value: 3, done: false }
console.log(iterator.next()) // { value: undefined, done: true }
```

### 34.2 빌트인 이터러블

| 빌트인 이터러블 | Symbol.iterator 메서드                                                        |
| --------------- | ----------------------------------------------------------------------------- |
| Array           | Array.prototype[Symbol.iterator]                                              |
| String          | String.prototype[Symbol.iterator]                                             |
| Map             | Map.prototype[Symbol.iterator]                                                |
| Set             | Set.prototype[Symbol.iterator]                                                |
| TypedArray      | TypedArray.prototype[Symbol.iterator]                                         |
| arguments       | arguments[Symbol.iterator]                                                    |
| DOM 컬렉션      | NodeList.prototype[Symbol.iterator] HTMLCollection.prototype[Symbol.iterator] |

### 34.3 for...of 문

- for...of 문은 이터러블을 순회하면서 이터러블의 요소를 변수에 할당한다.
- for...of 문은 내부적으로 이터레이터의 next 메서드를 호출하여 이터러블을 순회하며 next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티 값을 for...of 문의 변수에 할당한다.
- 그리고 이터레이터 리절트 객체의 done 프로퍼티 값이 false이면 이터러블의 순회를 계속하고 true이면 이터러블의 순회를 중단한다.

```js
for (const item of [1, 2, 3]) {
  console.log(item) // 1 2 3
}
```

> [!TIP]
> for...in 문: 객체의 모든 열거 가능한 속성에 대한 반복
> for...of 문: [Symbol.iterator] 속성을 가지는 컬렉션 전용

```js
const iterable = [1, 2, 3]
const iterator = iterable[Symbol.iterator]()

for (;;) {
  const res = iterator.next()

  if (res.done) break

  const item = res.value
  console.log(item) // 1 2 3
}
```

### 34.4 이터러블과 유사 배열 객체

> [!NOTE]
> 유사 배열 객체는 **마치 배열처럼** 인덱스로 프로퍼티 값에 접근할 수 있고 length 프로퍼티를 갖는 객체를 말한다.

```js
const arrayLike = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
}
```

- 유사 배열 객체는 length를 갖기 때문에 for 문으로 순회할 수 있고, 인덱스로 프로퍼티 값에 접근할 수 있다.

```js
const arr = Array.from(arrayLike) // [1, 2, 3]
```

- 유사 배열 객체는 이터러블이 아닌 일반 객체다. 따라서 Symbol.iterator 메서드가 없기 때문에 for...of 문으로 순회할 수 없다.

```js
for (const item of arrayLike) {
  console.log(item) // TypeError: arrayLike is not iterable
}
```

- arguments, NodeList, HTMLCollection은 유사 배열 객체이면서 이터러블이다.
  - ES6에서 이터러블이 도입되면서 Symbol.iterator 메서드를 구현 -> 이터러블
  - 하지만 이터러블이 된 후에도 length 프로퍼티를 가지며, 인덱스로 접근할 수 있으므로 -> 유사 배열 객체
- 하지만 모든 유사 배열 객체가 이터러블인 것은 아니다.
- ES6에서 도입된 Array.from 메서드를 사용하여 유사 배열 객체 또는 이터러블을 배열로 간단히 변환할 수 있다.

```js
const arr = Array.from(arrayLike)
console.log(arr) // [1, 2, 3]

for (const item of arr) {
  console.log(item) // 1, 2, 3
}
```

### 34.5 이터레이션 프로토콜의 필요성

> [!NOTE]
> 이터레이션 프로토콜은 다양한 데이터 공급자가 하나의 순회 방식을 갖도록 규정하여 데이터 소비자가 효율적으로 다양한 데이터 공급자를 사용할 수 있도록
> **데이터 소비자와 데이터 공급자를 연결하는 인터페이스 역할을 한다.**

### 34.6 사용자 정의 이터러블

#### 34.6.1 사용자 정의 이터러블 구현

- 이터레이션 프로토콜을 준수하지 않는 일반 객체도 이터레이션 프로토콜을 준수하도록 구현하면 이터러블이 된다.

#### 이터러블이면서 이터레이터인 객체를 생성하는 함수

```js
const fibonacciFunc = function (max) {
  let [pre, cur] = [0, 1]

  return {
    [Symbol.iterator]() {
      return this
    },
    next() {
      ;[pre, cur] = [cur, pre + cur]
      return { value: cur, done: cur >= max }
    },
  }
}

let iter = fibonacciFunc(10)
for (const num of iter) {
  console.log(num) // 1 2 3 5 8
}
```

#### 무한 이터러블과 지연 평가

```js
const fibonacciFunc = function () {
  let [pre, cur] = [0, 1]

  return {
    [Symbol.iterator]() {
      return this
    },
    next() {
      ;[pre, cur] = [cur, pre + cur]
      return { value: cur } // done 생략
    },
  }
}

for (const num of fibonacciFunc()) {
  if (num > 10000) break
  console.log(num)
}

const [f1, f2, f3] = fibonacciFunc()
console.log(f1, f2, f3) // 1 2 3
```

- 지연 평가는 데이터가 필요한 시점 이전까지는 미리 데이터를 생성하지 않다가 데이터가 필요한 시점이 되면 그때야 비로소 데이터를 생성하는 기법이다.
- 즉, 평가 결과가 필요할 때까지 평가를 늦추는 기법이다.
- 무한 이터러블은 데이터를 공급하는 메커니즘을 구현한 것으로 실행되기 이전까지 데이터를 생성하지는 않는다. next 메서드가 호출되기 이전까지는 데이터를 생성하지 않는다.
- 즉, 데이터가 필요할 때까지 데이터 생성을 지연하다가 데이터가 필요한 순간 데이터를 생성한다.
- 필요한 데이터를 필요한 순간에 생성하는 지연 평가의 장점
  - 빠른 실행 속도를 기대 가능
  - 불필요한 메모리를 소비 x
  - 무한도 표현 가능

## 35장 스프레드 문법

- ES6에서 도입된 스프레드 문법은 하나로 뭉쳐 있는 여러 개의 값들의 집합을 펼쳐서 개별적인 값들의 목록으로 만든다.
- for...of 문으로 순회할 수 있는 이터러블만 스프레드 문법을 사용할 수 있다.
  - Array
  - String
  - Map/Set
  - DOM 컬렉션(NodeList, HTMLCollection)
  - arguments
- 스프레드 문법의 결과는 값이 아니므로 변수에 할당할 수 없다.
- 스프레드 문법의 결과물은 값으로 사용할 수 없고, 쉼표로 값의 목록을 사용하는 문맥에서만 사용할 수 있다.

### 35.1 함수 호출문의 인수 목록에서 사용하는 경우

```js
const arr = [1, 2, 3]

const maxToArr = Math.max(arr) // -> NaN
const maxToSpreadArr = Math.max(...arr) // -> 3
```

- 스프레드 문법이 제공되기 이전에는 배열을 펼쳐서 요소들의 목록을 함수의 인수로 전달하고 싶은 경우 Function.prototype.apply를 사용했다.

```js
const maxToApplyArr = Math.max.apply(null, arr)
```

> [!CAUTION]
> Rest 파라미터와 스프레드 문법은 서로 반대의 개념이다.
>
> - Rest 파라미터: 함수에 전달된 인수들의 목록을 **배열로 전달받기 위해** 매개변수 이름 앞에 ...을 붙이는 것
> - 스프레드 문법: 여러 개의 값이 하나로 뭉쳥 있는 배열과 같은 이터러블을 **펼쳐서** 개별적인 값들의 목록을 만드는 것

### 35.2 배열 리터럴 내부에서 사용하는 경우

#### 35.2.1 concat

- 2개의 배열을 1개의 배열로 결합하고 싶은 경우 concat 메서드를 사용한다.

```js
// ES5
var arr = [1, 2].concat([3, 4]) // [1, 2, 3, 4]

// ES6
const arr2 = [...[1, 2], ...[3, 4]] // [1, 2, 3, 4]
```

#### 35.2.2 splice

- 배열의 중간에 다른 배열의 요소들을 추가하거나 제거하고 싶은 경우 splice 메서드를 사용한다.

```js
// ES5
var arr1 = [1, 4]
var arr2 = [2, 3]

arr1.splice(1, 0, arr2) // [1, [2, 3], 4]
```

- splice에 세 번째 인수로 배열을 전달하면 배열 자체가 추가된다. -> 원하는 결과를 얻으려면 펼쳐서 전달해야 함
- 따라서 이러한 경우 ES6 이전에는 Function.prototype.apply 메서드를 사용하여 splice 메서드를 호출해야 했다.

```js
// ES5
var arr1 = [1, 4]
var arr2 = [2, 3]

Array.prototype.splice.apply(arr1, [1, 0].concat(arr2)) // [1, 2, 3, 4]
```

- ES6의 스프레드 문법을 사용하면 더욱 간결하고 가독성 좋게 표현할 수 있다.

```js
const arr1 = [1, 4]
const arr2 = [2, 3]

arr1.splice(1, 0, ...arr2) // [1, 2, 3, 4]
```

#### 35.2.3 배열 복사

- ES6 이전에 배열을 복사하려면 slice 메서드를 사용했다.

```js
// ES5
var origin = [1, 2]
var copy = origin.slice() // [1, 2]

console.log(copy === origin) // false
```

- ES6 스프레드 문법을 사용하면 더욱 간결하고 가독성 좋게 표현할 수 있다.

```js
// ES6
const origin = [1, 2]
const copy = [...origin] // [1, 2]

console.log(copy === origin) // false
```

- 이때 원본 배열의 각 요소를 얕은 복사하여 새로운 복사본을 생성한다.

#### 35.2.4 이터러블을 배열로 변환

- ES5에서 이터러블을 배열로 변환하려면 Function.prototype.apply 또는 Function.prototype.call 메서드를 사용하여 slice 메서드를 호출해야 했다.
- 이터러블뿐만 아니라 이터러블이 아닌 유사 배열 객체도 배열로 변환할 수 있다.

```js
// ES5
function sum() {
  var args = Array.prototype.slice.call(arguments)

  return args.reduce(function (pre, cur) {
    return pre + cur
  }, 0)
}

console.log(sum(1, 2, 3)) // 6
```

- 스프레드 문법을 사용하면 좀 더 간편하게 이터러블을 배열로 변환할 수 있다.

```js
// ES6
function sum() {
  return [...arguments].reduce((pre, cur) => pre + cur, 0)
}

console.log(sum(1, 2, 3)) // 6
```

- 단, 이터러블이 아닌 유사 배열 객체는 스프레드 문법의 대상이 될 수 없다.
- 이터러블이 아닌 유사 배열 객체를 배열로 변경하려면 Array.from 메서드를 사용한다.

```js
const arrayLike = {
  0: 1,
  1: 2,
  2: 3,
  length: 3,
}

const arrByCall = Array.prototype.slice.call(arrayLike) // [1, 2, 3]
console.log(Array.isArray(arrByCall)) // true

const arrBySpread = [...arrayLike]
// TypeError: object is not iterable (cannot read property Symbol(Symbol.iterator))

const arrByFrom = Array.from(arrayLike) // [1, 2, 3]
console.log(Array.isArray(arrByFrom)) // true
```

- Rest 파라미터를 사용하면 더 간편하게 배열로 변환할 수 있다.

```js
const sum = (...args) => args.reduce((pre, cur) => pre + cur, 0)

console.log(sum(1, 2, 3)) // 6
```

### 35.3 객체 리터럴 내부에서 사용하는 경우

```js
const obj = { x: 1, y: 2 }
const copy = { ...obj }
console.log(copy) // { x: 1, y: 2 }
console.log(obj === copy) // false

const merged = { ...obj, ...{ y: 10, z: 3 } }
const changed = { ...obj, y: 100 }
const added = { ...obj, z: 0 }
```

## 36장 디스트럭처링 할당

> [!NOTE]
>
> - 디스트럭처링 할당은 구조화된 배열 또는 객체를 destructuring(비구조화, 파괴)하여 1개 이상의 변수에 개별적으로 할당하는 것을 말한다.
> - 배열과 같은 이터러블 또는 객체 리터럴에서 필요한 값만 추출하여 변수에 할당할 때 유용하다.

### 36.1 배열 디스트럭처링 할당

- ES6의 배열 디스트럭처링 할당은 배열의 각 요소를 배열로부터 1개 이상의 변수에 할당한다.
- 이때 배열 디스트럭처링 할당의 대상은 이터러블이어야 하며, 할당 기준은 배열의 인덱스다. 즉, 순서대로 할당된다.

```js
const arr = [1, 2, 3]
const [a, b, c] = arr

console.log(a, b, c) // 1 2 3
```

- 변수의 개수와 이터러블의 요소 개수가 반드시 일치할 필요는 없다.

```js
const [a, b] = [1, 2]
console.log(a, b) // 1 2

const [c, d] = [1]
console.log(c, d) // 1 undefined

const [e, f] = [1, 2, 3]
console.log(e, f) // 1 2

const [g, , h] = [1, 2, 3]
console.log(g, h) // 1 3
```

- 배열 디스트럭처링 할당을 위한 변수에 기본값을 설정할 수 있다. 이때 할당된 값이 기본값보다 우선한다.

```js
const [a, b = 10, c = 3] = [1, 2]
console.log(a, b, c) // 1 2 3
```

- 배열 디스트럭처링 할당을 위해 변수에 Rest 파라미터와 유사하게 Rest 요소(Rest element)를 사용할 수 있다.

```js
const [x, ...y] = [1, 2, 3]
console.log(x, y) // 1 [ 2, 3 ]
```

### 36.2 객체 디스트럭처링 할당

- ES6의 객체 디스트럭처링 할당은 객체의 각 프로퍼티를 추출하여 1개 이상의 변수에 할당한다.
- 객체 디스트럭처링 할당의 대상은 객체이어야 하며, 할당 기준은 프로퍼티 키다.
- 즉, 배열 디스트럭처링 할당과 다르게 순서는 의미가 없으며 선언된 변수 이름과 프로퍼티 키가 일치하면 할당된다.

```js
const user = { firstName: 'Ungmo', lastName: 'Lee' }
const { lastName, firstName } = user

console.log(firstName, lastName) // Ungmo Lee
```

- 객체의 프로퍼티 키와 다른 변수 이름으로 프로퍼티 값을 할당받으려면 프로퍼티 축약 표현을 사용하지 않고 변수를 선언해야 한다.

```js
const user = { firstName: 'Ungmo', lastName: 'Lee' }
const { lastName: ln, firstName: fn } = user
console.log(fn, ln) // Ungmo Lee
```

- 객체 디스트럭처링 할당을 위한 변수에 기본값을 설정할 수 있다.

```js
const { firstName = 'Ungmo', lastName } = { lastName: 'Lee' }
console.log(firstName, lastName) // Ungmo Lee
```

- 객체 디스트럭처링 할당은 객체에서 프로퍼티 키로 필요한 프로퍼티 값만 추출하여 변수에 할당하고 싶을 때 유용하다.

```js
const todo = { id: 1, content: 'HTML', completed: true }
const { id } = todo
console.log(id) // 1
```

- 중첩 객체

```js
const user = {
  name: 'Lee',
  address: {
    zipCode: '03068',
    city: 'Seoul',
  },
}

const {
  address: { city },
} = user
```

- 객체 디스트럭처링 할당을 위한 변수에 Rest 프로퍼티를 사용할 수 있다.

```js
const { x, ...rest } = { x: 1, y: 2, z: 3 }
console.log(x, rest) // 1 { y: 2, z: 3 }
```

## 37장 Set과 Map

### 37.1 Set

- Set 객체는 중복되지 않는 유일한 값들의 집합이다. Set 객체는 배열과 유사하지만 차이점이 존재한다.
- 수학적 집합을 구현하기 위한 자료구조다. 따라서 Set을 통해 교집합, 합집합, 차집합, 여집합 등을 구현할 수 있다.

| 구분                                 | 배열 | Set 객체 |
| ------------------------------------ | ---- | -------- |
| 동일한 값을 중복하여 포함할 수 있다. | O    | X        |
| 요소 순서에 의미가 있다.             | O    | X        |
| 인덱스로 요소에 접근할 수 있다.      | O    | X        |

#### 37.1.1 Set 객체의 생성

- Set 생성자 함수는 이터러블을 인수로 전달받아 Set 객체를 생성한다. 이때 이터러블의 중복된 값은 Set 객체에 추가되지 않는다.

```js
const set1 = new Set() // Set(0) {}
const set2 = new Set([1, 2, 3, 4]) // Set(3) { 1, 2, 3, 4 }
const set3 = new Set('Hello') // Set(4) { "h", "e", "l", "o" }
```

#### 37.1.2 요소 개수 확인

- Set.prototype.size 프로퍼티를 사용하여 Set 객체의 요소 개수를 확인한다.
- size 프로퍼티는 setter 함수 없이 getter 함수만 존재하는 접근자 프로퍼티 -> 변경 x

```js
const { size } = new Set([1, 2, 3, 3])
console.log(size) // 3
```

#### 37.1.3 요소 추가

- Set.prototype.add 메서드를 사용하여 Set 객체에 요소를 추가한다.
- add 메서드는 새로운 요소가 추가된 Set 객체를 반환한다. 따라서 연속적으로 호출할 수 있다.
- Set 객체에 중복된 요소의 추가는 허용되지 않고 무시된다.

```js
const set = new Set()
set.add(1).add(2).add(2) // Set(2) {1, 2}
```

#### 37.1.4 요소 존재 여부 확인

- Set.prototype.has 메서드를 사용하여 Set 객체에 특정 요소가 존재하는지 확인한다.
- has 메서는 특정 요소의 존재 여부를 나타내는 불리언 값을 반환한다.

```js
const set = new Set([1, 2, 3])

set.has(2) // true
set.has(4) // false
```

#### 37.1.5 요소 삭제

- Set.prototype.delete 메서드를 사용하여 Set 객체에 특정 요소가 존재하는지 확인한다.
- delete 메서드에는 인덱스가 아니라 **삭제하려는 요소값**을 인수로 전달해야 한다. -> 배열과 다르게 순서에 의미가 없다.

```js
const set = new Set([1, 2, 3])

set.delete(2) // Set(2) {1, 3}
set.delete(1) // Set(1) {3}
```

- 만약 존재하지 않는 Set 객체의 요소를 삭제하려 하면 에러 없이 무시된다.

```js
const set = new Set([1, 2, 3])

set.delete(0) // Set(3) {1, 2, 3}
```

- delete 메서드는 삭제 성공 여부를 나타내는 불리언 값을 반환한다.
- 새로운 Set 객체를 생성하는 게 아니므로 add 메서드와 달리 연속적으로 호출할 수 없다.

```js
const set = new Set([1, 2, 3])

set.delete(1).delete(2) // TypeError: set.delete(...).delete is not a function
```

#### 37.1.6 요소 일괄 삭제

- Set.prototype.clear 메서드를 사용하여 Set 객체의 모든 요소를 일괄 삭제한다.
- clear 메서드는 언제나 undefined를 반환한다.

```js
const set = new Set([1, 2, 3])

set.clear() // Set(0) {}
```

#### 37.1.7 요소 순회

- Set.prototype.forEach 메서드를 사용하여 Set 객체의 요소를 순회한다.
- forEach 메서드는 3개의 인수를 전달받는다.
  - 1. 현재 순회 중인 요소값
  - 2. 현재 순회 중인 요소값
  - 3. 현재 순회 중인 Set 객체 자체
- 첫 번째 인수와 두 번째 인수가 같은 값인 이유는 Array.prototype.forEach 메서드와 인터페이스를 통일하기 위함이며 다른 의미는 없다.

```js
const set = new Set([1, 2, 3])

set.forEach((v, v2, set) => console.log(v, v2, set))
```

- Set 객체는 이터러블이다. for...of 문 순회가 가능하고, 스프레드 문법, 디스트럭처링 할당도 사용 가능하다.
- Set 객체는 요소의 순서에 의미를 갖지 않지만 Set 객체를 순회하는 순서는 요소가 추가된 순서를 따른다.
  - ECMAScript 사양에 규정된 것은 아니고 다른 이터러블의 순회와 호환성 유지가 목적

#### 37.1.8 집합 연산

##### 교집합

```js
Set.prototype.intersection = function (set) {
  const result = new Set()

  for (const value of set) {
    if (result.has(value)) result.add(value)
  }

  return result
}

// filter
Set.prototype.intersection = function (set) {
  return new Set([...this].filter(v => set.has(v)))
}
```

##### 합집합

```js
Set.prototype.union = function (set) {
  const result = new Set(this)

  for (const value of set) {
    result.add(value)
  }
  return result
}

// 스프레드 문법
Set.prototype.union = function (set) {
  return new Set([...this, ...set])
}
```

##### 차집합

```js
Set.prototype.difference = function (set) {
  const result = new Set(this)

  for (const value of set) {
    result.delete(value)
  }

  return result
}

Set.prototype.difference = function (set) {
  return new Set([...this].filter(v => !set.has(v)))
}
```

##### 부분 집합과 상위 집합

```js
Set.prototype.isSuperset = function (subset) {
  for (const value of subset) {
    if (!this.has(value)) return false
  }

  return true
}

Set.prototype.isSuperset = function (subset) {
  const superArr = [...this]
  return [...subset].every(v => superArr.includes(v))
}
```

### 37.2 Map

- Map 객체는 키와 값의 쌍으로 이루어진 컬렉션이다. Map 객체는 객체와 유사하지만 차이점이 존재한다.

| 구분                   | 객체                    | Map 객체              |
| ---------------------- | ----------------------- | --------------------- |
| 키로 사용할 수 있는 값 | 문자열 또는 심벌 값     | 객체를 포함한 모든 값 |
| 이터러블               | X                       | O                     |
| 요소 개수 확인         | Object.keys(obj).length | map.size              |

#### 37.2.1 Map 객체의 생성

- Map 생성자 함수는 이터러블을 인수로 전달받아 Map 객체를 생성한다. 이떄 인수로 전달되는 이터러블은 키와 값의 쌍으로 이루어진 요소로 구성되어야 한다.
- Map 생성자 함수의 인수로 전달한 이터러블에 중복된 키를 갖는 요소가 존재하면 값이 덮어써진다.

```js
const map = new Map()
const map1 = new Map([
  ['key1', 'value1'],
  ['key1', 'value2'],
]) // Map(1) {"key1" => "value2"}
```

#### 37.2.2 요소 개수 확인

- Map.prototype.size 프로퍼티로 Map 객체의 요소 개수를 확인한다.

```js
const { size } = new Map([
  ['key1', 'value1'],
  ['key2', 'value2'],
]) // 2
```

#### 37.2.3 요소 추가

- Map.prototype.set 메서드로 Map 객체의 요소를 추가한다.
- set 메서드는 새로운 요소가 추가된 Map 객체를 반환한다. 따라서 set 메서드를 연속적으로 호출할 수 있다.

```js
const map = new Map()

map.set('key1', 'value1').set('key2', 'value2')
// Map(2) {"key1" => "value1", "key2" => "value2"}
```

#### 37.2.4 요소 취득

- Map.prototype.get 메서드로 Map 객체에서 특정 요소를 취득한다.
- get 메서드의 인수로 키를 전달하면 Map 객체에서 인수로 전달한 키를 갖는 값을 반환한다.
- Map 객체에서 인수로 전달한 키를 갖는 요소가 존재하지 않으면 undefined를 반환한다.

#### 37.2.5 요소 존재 여부 확인

- Map.prototype.has 메서드로 Map 객체에서 특정 요소가 존재하는지 확인한다.
- has 메서드는 특정 요소의 존재 여부를 나타내는 불리언 값을 반환한다.

#### 37.2.6 요소 삭제

- Map.prototype.delete 메서드로 Map 객체의 요소를 삭제한다.
- 만약 존재하지 않는 키로 Map 객체의 요소를 삭제하려 하면 에러 없이 무시된다.
- delete 메서드는 삭제 성공 여부를 나타내는 불리언 값을 반환한다. set 메서드와 달리 연속적으로 호출할 수 없다.

#### 37.2.7 요소 일괄 삭제

- Map.prototype.clear 메서드로 Map 객체의 요소를 일괄 삭제한다.
- clear 메서드는 언제나 undefined를 반환한다.

#### 37.2.8 요소 순회

- Map.prototype.forEach 메서드로 Map 객체의 요소를 순회한다.
- Map 객체는 이터러블이다. 따라서 for...of 문 순회가 가능하고, 스프레드 문법, 디스트럭처링 할당도 사용 가능하다.
- Map 객체는 이터러블이면서 동시에 이터레이터인 객체를 반환하는 메서드를 제공한다.

| Map 메서드            | 설명                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| Map.prototype.keys    | Map 객체에서 요소키를 값으로 갖는 이터러블이면서 동시에 이터레이터인 객체를 반환한다.          |
| Map.prototype.values  | Map 객체에서 요소값을 값으로 갖는 이터러블이면서 동시에 이터레이터인 객체를 반환한다.          |
| Map.prototype.entries | Map 객체에서 요소키와 요소값을 값으로 갖는 이터러블이면서 동시에 이터레이터인 객체를 반환한다. |

- Map 객체는 요소의 순서에 의미를 갖지 않지만 Map 객체를 순회하는 순서는 요소가 추가된 순서를 따른다.
  - ECMAScript 사양에 규정된 것은 아니고 다른 이터러블의 순회와 호환성 유지가 목적

### 공유

#### Symbol

- [Chrome for Developers - Symbol](https://www.youtube.com/watch?v=qIU151UPOSY)
- [react/packages/shared/ReactSymbols.js](https://github.com/facebook/react/blob/main/packages/shared/ReactSymbols.js)
- [https://medium.com/@fengyu214/learning-react-source-code-ecfee15f875f](https://medium.com/@fengyu214/learning-react-source-code-ecfee15f875f)
