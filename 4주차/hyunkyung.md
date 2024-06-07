## 16장. _프로퍼티 어트리뷰트
### 16.1 내부 슬롯과 내부 메서드
- 자바스크립트 엔진의 구현 알고리즘을 설명하기 위해 ECMAScript 사양에서 사용하는 의사 프로퍼티와 의사 메서드
- 내부 슬롯과 내부 메서드는 직접 접근하거나 호출할 수 없고 간접적으로 접근해야 한다.
- 예를 들어 모든 객체가 가진 [[Prototype]]이라는 내부 슬롯은 __proto__ 접근자 프로퍼티로 간접적으로 접근할 수 있다.

### 16.2 프로퍼티 어트리뷰트와 프로퍼티 디스크립터 객체
- 자바스크립트 엔진은 프로퍼티를 생성할 때 프로퍼티의 상태를 나타내는 프로퍼티 어트리뷰트를 기본값으로 자동 정의한다.
    - 프로퍼티 상태: 값(value), 값의 갱신 가능 여부(writable), 열거 가능 여부(enumerable), 재정의 가능 여부(configurable)
- 프로퍼티 어트리뷰트는 자바스크립트 엔진이 관리하는 내부 상태 값(meta-property)인 내부 슬롯 [[value]], [[Writable]], [[Enumerable]], [[Configurable]]을 말한다.

```javascript
const person = {
  name: 'Lee'
};

console.log(Object.getOwnPropertyDescriptor(person, 'name'));
// {value: "Lee", writable: true, enumerable: true, configurable: true}
```

### 16.3 데이터 프로퍼티와 접근자 프로퍼티
- 프로퍼티는 데이터 프로퍼티와 접근자 프로퍼티로 구분할 수 있다.
  - 데이터 프로퍼티: 키와 값으로 구성된 일반적인 프로퍼티
  - 접근자 프로퍼티: 자체적으로는 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 호출되는 접근자 함수(accessor function)로 구성된 프로퍼티
#### 16.3.1 데이터 프로퍼티
1. [[value]]
   - 프로퍼티 키를 통해 프로퍼티 값에 접근하면 반환되는 값
2. [[Writable]]
   - 프로퍼티 값의 갱신 가능 여부
   - false인 경우 해당 프로퍼티의 [[value]]의 값을 변경할 수 없다.
3. [[Enumerable]]
    - 프로퍼티 열거 가능 여부
    - false인 경우 해당 프로퍼티는 for...in 문이나 Object.keys 메서드 등으로 열거할 수 없다.
4. [[Configurable]]
   - 프로퍼티 재정의 가능 여부
   - false인 경우 해당 프로퍼티를 삭제하거나 프로퍼티 어트리뷰트를 재설정할 수 없다.

#### 16.3.2 접근자 프로퍼티
- 자체적으로는 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 호출되는 접근자 함수(accessor function)로 구성된 프로퍼티

| 프로퍼티 어트리뷰트 | 프로퍼티 디스크립터 객체의 프로퍼티 | 설명 |
| --- | --- | --- |
| [[Get]] | get | 접근자 프로퍼티를 읽을 때 호출되는 접근자 함수 |
| [[Set]] | set | 접근자 프로퍼티에 값을 저장할 때 호출되는 접근자 함수 |
| [[Enumerable]] | enumerable | 프로퍼티 열거 가능 여부 |
| [[Configurable]] | configurable | 프로퍼티 재정의 가능 여부 |

### 16.4 프로퍼티 정의
- Object.defineProperty 메서드를 사용하면 프로퍼티 어트리뷰트를 정의할 수 있다.
- Object.defineProperty 메서드는 객체의 프로퍼티를 정의하거나 기존 프로퍼티를 수정할 때 사용한다.

```javascript
const person = {};

Object.defineProperty(person, 'name', {
  value: 'Lee',
  writable: true,
  enumerable: true,
  configurable: true
});

console.log(Object.getOwnPropertyDescriptor(person, 'name'));

// {value: "Lee", writable: true, enumerable: true, configurable: true}
```

### 16.5 객체 변경 방지
- 객체는 변경 가능한 값이므로 재할당 없이 객체 내부의 상태를 변경할 수 있다.
- 객체 변경 방지 메서드

| 구분 | 메서드 | 프로퍼티 추가 | 프로퍼티 삭제 | 프로퍼티 값 읽기 | 프로퍼티 값 쓰기 | 프로퍼티 어트리뷰트 재정의 |
| --- | --- | --- | --- | --- | --- | --- |
| 객체 동결 | Object.freeze | X | X | O | X | X |
| 객체 밀봉 | Object.seal | X | X | O | O | X |
| 객체 확장 금지 | Object.preventExtensions | X | X | O | O | O |

#### 16.5.1 객체 확장 금지
- Object.preventExtensions 메서드는 객체의 확장을 금지한다.
- 즉, 프로퍼티 추가를 금지한다.

```javascript
const person = { name: 'Lee' };

// person 객체는 확장이 금지된 객체가 아니다.
console.log(Object.isExtensible(person)); // true

// person 객체의 확장을 금지하여 프로퍼티 추가를 금지한다.
Object.preventExtensions(person)

// person 객체는 확장이 금지된 객체다.
console.log(Object.isExtensible(person)); // false

// 프로퍼티 추가가 금지된다.
person.age = 20; // 무시. strict mode에서는 에러

// 프로퍼티 추가는 금지되지만 삭제는 가능하다.
delete person.name;

// 프로퍼티 정의에 의한 프로퍼티 추가도 금지된다.
Object.defineProperty(person, 'age', { value: 20 });
// TypeError: Cannot define property age, object is not extensible
```

#### 16.5.2 객체 밀봉
- Object.seal 메서드는 객체를 밀봉한다.
- 즉, 프로퍼티 추가 및 삭제를 금지한다.

```javascript
const person = { name: 'Lee' };

// person 객체는 밀봉된 객체가 아니다.
console.log(Object.isSealed(person)); // false

// person 객체를 밀봉하여 프로퍼티 추가 및 삭제를 금지한다.
Object.seal(person);

// person 객체는 밀봉된 객체다.
console.log(Object.isSealed(person)); // true

// 프로퍼티 추가 및 삭제가 금지된다.
person.age = 20; // 무시. strict mode에서는 에러
delete person.name; // 무시. strict mode에서는 에러

// 프로퍼티 값 갱신은 가능하다.
person.name = 'Kim';
console.log(person); // {name: "Kim"}

// 프로퍼티 어트리뷰트 재정의도 가능하다.
Object.defineProperty(person, 'name', { configurable: true });
```

#### 16.5.3 객체 동결
- Object.freeze 메서드는 객체를 동결한다.
- 즉, 프로퍼티 추가 및 삭제, 프로퍼티 값 갱신을 금지한다.

```javascript
const person = { name: 'Lee' };

// person 객체는 동결된 객체가 아니다.
console.log(Object.isFrozen(person)); // false

// person 객체를 동결하여 프로퍼티 추가 및 삭제, 프로퍼티 값 갱신을 금지한다.

Object.freeze(person);

// person 객체는 동결된 객체다.
console.log(Object.isFrozen(person)); // true

// 프로퍼티 추가 및 삭제, 프로퍼티 값 갱신이 금지된다.

person.age = 20; // 무시. strict mode에서는 에러

delete person.name; // 무시. strict mode에서는 에러

person.name = 'Kim'; // 무시. strict mode에서는 에러

// 프로퍼티 어트리뷰트 재정의도 금지된다.
Object.defineProperty(person, 'name', { configurable: true });

// TypeError: Cannot redefine property: name
```

#### 16.5.4 불변 객체
- 지금까지 살펴본 변경 방지 메서드들은 얕은 변경 방지로 중첩 객체까지는 영향을 주지는 못한다.
- 객체의 중첩 객체까지 동결하여 변경이 불가능한 읽기 전용의 불변 객체를 구현하려면 객체를 값으로 갖는 모든 프로퍼티에 대해 재귀적으로 Object.freeze 메서드를 호출해야 한다.

```javascript
const person = {
  name: 'Lee',
  address: { city: 'Seoul' }
};

function deepFreeze(target) {
  // 객체의 프로퍼티 키 배열을 취득
  const keys = Object.keys(target);

  // 프로퍼티 키를 순회
  keys.forEach(key => {
    const value = target[key];

    // 프로퍼티 값이 객체이면 재귀 호출로 객체를 동결
    if (value && typeof value === 'object') {
      deepFreeze(value);
    }
  });

  // 모든 프로퍼티를 동결
  return Object.freeze(target);
}

deepFreeze(person);

console.log(Object.isFrozen(person)); // true
console.log(Object.isFrozen(person.address)); // true

```
## 17장. 생성자 함수에 의한 객체 생성
### 17.1 Object 생성자 함수
- new 연산자와 Object 생성자 함수를 사용하면 빈 객체를 생성할 수 있다.
- 생성자 함수란 new 연산자와 함께 호출하여 객체(인스턴스)를 생성하는 함수를 말한다.

```javascript
const person = new Object();

person.name = 'Lee';
person.sayHello = function() {
  console.log('Hi! My name is ' + this.name);
};

console.log(person) // {name: "Lee", sayHello: ƒ}
```

### 17.2 생성자 함수
#### 17.2.1 객체 리터럴에 의한 객체 생성 방식의 문제점
- 객체 리터럴에 의한 객체 생성 방식은 단 하나의 객체만 생성한다.
- 동일한 프로퍼티를 갖는 객체를 여러 개 생성해야 하는 경우 매번 객체 리터럴을 반복해 작성해야 한다.

#### 17.2.2 생성자 함수에 의한 객체 생성 방식의 장점
- 생성자 함수에 의한 객체 생성 방식은 프로퍼티 구조가 동일한 객체 여러 개를 간편하게 생성할 수 있다.
- 생성자 함수는 그 형식이 정해져 있는 것이 아니라 일반 함수와 동일하다. new 연산자와 함께 호출되면 생성자 함수로 동작한다.

```javascript
// 생성자 함수
function Circle(radius) {

    this.radius = radius;
    this.getDiameter = function () {
        return 2 * this.radius;
    };

}

// 인스턴스 생성
const circle1 = new Circle(5) 

```

**this**
- this는 객체 자신의 프로퍼티나 메서드를 참조하기 위한 자기 참조 변수(self-referencing variable)이다.
- this가 가리키는 값은 함수 호출 방식에 따라 동적으로 결정된다.
```javascript
function foo() {
  console.log(this);
}

// 일반적인 함수로서 호출
// 전역 객체는 브라우저 환경에서는 window, Node.js 환경에서는 global을 가리킨다.
foo(); // window

const obj = { foo };
obj.foo(); // obj

const inst = new foo(); // inst
```

#### 17.2.3 생성자 함수의 인스턴스 생성 과정
- 생성자 함수의 역할은 프로퍼티 구조가 동일한 인스턴스를 생성하는 것과 생성된 인스턴스를 초기화하는 것이다.
```javascript
// 생성자 함수
function Circle(radius) {
  // 인스턴스 초기화
  this.radius = radius;
  this.getDiameter = function() {
    return 2 * this.radius;
  };
}

// 인스턴스 생성
const circle1 = new Circle(8);
```

1. 인스턴스 생성과 this 바인딩
   - 빈 객체를 생성하고 this에 바인딩한다.
   - 이때 this는 생성자 함수가 생성할 인스턴스를 가리킨다.
   - 이때 this는 암묵적으로 생성된 빈 객체를 가리킨다.
   - 이 처리는 함수 몸체의 코드가 한 줄씩 실행되는 런타임 이전 단계에서 실행된다.
2. 인스턴스 초기화
   - this에 바인딩되어 있는 인스턴스를 초기화한다.
   - 이 처리는 개발자가 기술한다.
3. 인스턴스 반환
    - 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.
    - 만약 this가 아닌 다른 객체를 명시적으로 반환하면 암묵적인 this 반환은 무시된다.
    - 생성자 함수 내에서 명시적으로 this가 아닌 다른 값을 반환하는 것은 생성자 함수의 기본 동작을 훼손한다.

#### 17.2.4 내부 메서드 [[Call]]과 [[Construct]]
- 함수는 객체이지만 일반 객체와는 다르다. 일반 객체는 호출할 수 없지만 함수는 호출할 수 있다.
- 함수 객체는 일반 객체가 가지고 있는 내부 슬롯과 내부 메서드 외에도 함수로서 동작하기 위해 함수 객체만을 위한 [[Environment]], [[FormalParameters]], [[Code]], [[Call]], [[Construct]] 등의 내부 슬롯과 내부 메서드를 추가로 가지고 있다.
- 함수가 일반 함수로서 호출되면 [[Call]]이 호출되고, 생성자 함수로서 호출되면 [[Construct]]가 호출된다.
- 모든 함수 객체는 내부 메서드 [[Call]]을 갖는다. 하지만 모든 함수 객체가 내부 메서드 [[Construct]]를 갖는 것은 아니다.

#### 17.2.5 constructor와 non-constructor의 구분
- constructor: 함수 선언문, 함수 표현식, 클래스(클래스도 함수다)
- non-constructor: 메서드(ES6 메서드 축약 표현), 화살표 함수

#### 17.2.6 new 연산자
- new 연산자와 함께 생성자 함수를 호출하면 해당 함수는 생성자 함수로 동작한다.
- new 연산자와 함께 생성자 함수를 호출하지 않으면 일반 함수로 동작한다.

```javascript
function Circle(radius) {
  this.radius = radius;
  this.getDiameter = function() {
    return 2 * this.radius;
  };
}

// new 연산자 없이 생성자 함수 호출하면 일반 함수로 동작한다.
const circle = Circle(5);

console.log(circle); // undefined

// 일반 함수 내부의 this는 전역 객체를 가리킨다.
console.log(radius); // 5

// 일반 함수 내부의 this는 전역 객체를 가리킨다.
console.log(getDiameter()); // 10
```

#### 17.2.7 new.target
- new.target은 생성자 함수 또는 클래스의 인스턴스화가 new 연산자 없이 호출되는 경우 undefined, new 연산자와 함께 호출되면 생성자 함수 또는 클래스를 가리킨다.

```javascript
function Circle(radius) {
    if(!new.target) {
        return new Circle(radius);
    }
    this.radius = radius;
    this.getDiameter = function() {
        return 2 * this.radius;
    };
    
}

const circle = Circle(5);

```
- 스코프 세이프 생성자 패턴
- new.target을 사용하면 생성자 함수가 new 연산자 없이 호출되는 것을 방지할 수 있다.
- newTarget은 IE에서 지원하지 않는다. new.target을 사용할 수 없는 상황이라면 스코프 세이프 생성자 패턴을 사용한다.

```javascript
function Circle(radius) {
    if(!(this instanceof Circle)) {
        return new Circle(radius);
    }
    this.radius = radius;
    this.getDiameter = function() {
        return 2 * this.radius;
    };
    
}

const circle = Circle(5);
```
- 대부분의 빌트인 생성자 함수(Object, String, Number 등)은 new 연산자 없이 호출되어도 적절한 값을 반환한다.
- 하지만 String, Number, Boolean 생성자 함수는 New 연산자 없이 호출되면 데이터 타입을 변환할 수도 있다.

## 18장. 함수와 일급 객체
### 18.1 함수 객체
- 다음과 같은 조건을 만족하는 객체를 일급 객체라 한다.
  - 무명의 리터럴로 생성할 수 있다. 즉, 런타임에 생성이 가능하다.
  - 변수나 자료구조(객체, 배열 등)에 저장할 수 있다.
  - 함수의 매개변수에 전달할 수 있다.
  - 함수의 반환값으로 사용할 수 있다.
- 자바스크립트의 함수는 일급 객체다.

### 18.2 함수 객체의 프로퍼티
- 함수는 객체이므로 프로퍼티를 가질 수 있다.
- 함수 객체는 arguments, caller, length, name, prototype 프로퍼티를 갖는다.

#### 18.2.1 arguments 프로퍼티
- arguments 객체는 함수 호출 시 전달된 인수(argument)들의 정보를 담고 있는 순회 가능한 유사 배열 객체(array-like object)이다.
- arguments 객체는 함수 내부에서 지역 변수처럼 사용된다.
- arguments 객체의 symbol 프로퍼티는 arguments 객체를 순회 가능한 이터러블로 만들기 위한 프로퍼티다.

```javascript
function multiply(x, y) {
  
    const iterator = arguments[Symbol.iterator]();
    console.log(iterator.next()); // {value: 2, done: false}
    console.log(iterator.next()); // {value: 3, done: false}
    console.log(iterator.next()); // {value: undefined, done: true}
    
    return x * y;
}

console.log(multiply(2, 3)); // 6
```
- arguments 객체는 매개변수 개수를 확정할 수 없는 가변 인자 함수를 구현할 때 유용하다.
- arguments 객체는 배열 형태로 인자 정보를 담고 있지만 실제 배열이 아닌 유사 배열 객체다.
    - 유사 배열 객체란 length 프로퍼티를 가진 객체로 for문으로 순회할 수 있는 개체를 말한다.
```javascript
function sum(){
    let res = 0;
    
    for(let i = 0; i < arguments.length; i++){
        res += arguments[i];
    }
    
    return res;
}

console.log(sum()) //0
console.log(sum(1,2))//3
console.log(sum(1,2,3))//6
```
- 유사 배열 객체는 배열이 아니므로 배열 메서드를 사용할 경우 에러가 발생한다.
- 따라서 배열 메서드를 사용하려면 Function.prototype.call 메서드를 사용하여 간접 호출해야한다. 
```javascript
function sum(){
    const array = Array.prototype.slice.call(arguments);
    return array.reduce((pre, cur) => pre + cur, 0);
}

console.log(sum(1,2,3)) //6
```
- 이러한 번거로움을 해결하기 위해 ES6에서는 Rest 파라미터를 도입했다.
```javascript
function sum(...args){
    return args.reduce((pre, cur) => pre + cur, 0);
}

console.log(sum(1,2,3)) //6
```

#### 18.2.2 caller 프로퍼티
- caller 프로퍼티는 함수 자신을 호출한 함수를 가리킨다.

```javascript
function foo() {
  console.log('foo is called');
}

function bar() {
  console.log('bar is called');
  foo();
}


console.log(foo(bar)); // foo is called
bar(); // caller: null
```

#### 18.2.3 length 프로퍼티
- length 프로퍼티는 함수를 정의할 때 선언한 매개변수의 개수를 가리킨다.

```javascript
function foo(x, y, z) {
  return x + y + z;
}

console.log(foo.length); // 3
```

#### 18.2.4 name 프로퍼티
- name 프로퍼티는 함수의 이름을 나타낸다.
- 익명 함수 표현식의 경우 name 프로퍼티는 빈 문자열을 갖는다. 하지만 ES6에서는 함수 객체를 가리키는 식별자를 값으로 갖는다.

```javascript
const bar = function() {};

console.log(bar.name); // bar

const baz = function bazFunc() {};

console.log(baz.name); // bazFunc
```

#### 18.2.5 __proto__ 접근자 프로퍼티
- __proto__ 접근자 프로퍼티는 [[Prototype]] 내부 슬롯이 가리키는 프로토타입 객체에 접근하기 위해 사용한다.
- __proto__ 접근자 프로퍼티는 객체가 직접 소유하지 않고 Object.prototype의 프로퍼티다.

```javascript
const obj = {};

console.log(obj.__proto__ === Object.prototype); // true
```

#### 18.2.6 prototype 프로퍼티
- prototype 프로퍼티는 생성자 함수로 호출할 수 있는 함수 객체, 즉 constructor만이 소유하는 프로퍼티다.

```javascript
function Person(name) {
  this.name = name;
}

const me = new Person('Lee');

console.log(Person.prototype); // {constructor: ƒ}

({}).hasOwnProperty('prototype'); // false
```

## 19장. 프로토타입
### 19.1 객체지향 프로그래밍
- 객체지향 프로그래밍은 객체를 사용하여 데이터와 기능을 하나로 묶어서 쉽게 관리할 수 있는 프로그래밍 패러다임이다.
```javascript
const person = {
    name: 'Lee',
    address: 'Seoul',
}

console.log(person); // {name: "Lee", address: "Seoul"}
```
- 프로그래머는 이름과 주소 속성으로 표현된 객체인 person을 다른 객체와 구별하여 인식할 수 있다.
- 이처럼 속성을 통해 여러 개의 값을 하나의 단위로 구성한 복합적인 자료구조를 객체라 한다.
- 객체는 상태(state)와 동작(behavior)을 가지는 복합적인 자료구조로서 객체지향 프로그래밍의 기본적인 요소이다.

### 19.2 상속과 프로토타입
- 상속은 객체지향 프로그래밍의 핵심 개념 중 하나로 기존 객체를 재사용하여 새로운 객체를 생성하는 것을 말한다.
```javascript
function Circle(radius) {
  this.radius = radius;
  this.getArea = function() {
    return Math.PI * this.radius ** 2;
  };
}

const circle1 = new Circle(1);
const circle2 = new Circle(2);

//Circle 생성자 함수는 인스턴스를 생성할 떄마다 동일한 동작을 하는
//getArea 메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.
//getArea 메서드는 하나만 생성하여 모든 인스턴스가 공유하는 것이 바람직하다.
console.log(circle1.getArea === circle2.getArea); // false
```
- 상속을 통해 불필요한 중복을 제거해 보자. 자바스크립트는 프로토타입을 기반으로 상속을 구현한다.
```javascript
function Circle(radius) {
  this.radius = radius;
}

Circle.prototype.getArea = function() {
  return Math.PI * this.radius ** 2;
};

const circle1 = new Circle(1);
const circle2 = new Circle(2);

console.log(circle1.getArea === circle2.getArea) // true
```
- Circle 생성자 함수가 생성한 모든 인스턴스는 자신의 프로토타입, 즉 상위 객체 역할을 하는 Circle prototype의 모든 프로퍼티와 메서드를 상속받는다.

### 19.3 프로토타입 객체
- 프로토타입 객체는 다른 객체에 공유 프로퍼티를 제공하기 위해 사용되며, 모든 객체는 [[Prototype]]이라는 내부 슬롯을 가지며 이 내부 슬롯의 값은 프로토타입 객체를 가리킨다.
- 모든 객체는 자신의 프로토타입 객체를 가리키는 [[Prototype]]이라는 내부 슬롯을 가진다.

#### 19.3.1 __proto__ 접근자 프로퍼티
- __proto__ 접근자 프로퍼티는 [[Prototype]] 내부 슬롯이 가리키는 프로토타입 객체에 접근하기 위해 사용한다.
- 접근자 프로퍼티는 자체적으로는 값([[Value]]) 프로퍼티 어트리뷰트를 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는 접근자 함수, 즉 getter와 setter 함수로 구성된 프로퍼티다.
```javascript
const obj = {};
const parent = { x: 1};

// getter 함수인 get __proto__가 호출되어 obj 객체의 프로토타입을 취득한다.
obj.__proto__;

// setter 함수인 set __proto__가 호출되어 obj 객체의 프로토타입을 교체한다.
obj.__proto__ = parent;
```
- __proto__ 접근자 프로퍼티는 객체가 직접 소유하지 않고 Object.prototype의 프로퍼티다.
- __proto__ 접근자 프로퍼티를 통해 프로토타입에 접근하는 이유는 상호 참조에 의해 프로토타입 체인이 생성되는 것을 방지하기 위해서다.
```javascript
const parent = {};
const child = {};

// child 객체의 프로토타입을 parent 객체로 설정
child.__proto__ = parent;

// parent 객체의 프로토타입을 child 객체로 설정
parent.__proto__ = child; // TypeError: Cyclic __proto__ value
```

- __proto__ 접근자 프로퍼티를 코드에서 직접 사용하는 것은 권장되지 않는다. 대신 Object.getPrototypeOf, Object.setPrototypeOf 메서드를 사용한다.

#### 19.3.2 함수 객체의 prototype 프로퍼티
- 함수 객체만이 소유하는 prototype 프로퍼티는 생성자 함수가 생성할 객체(인스턴스)의 프로토타입을 가리킨다.

```javascript
(function () {}).hasOwnProperty('prototype'); // true
({}).hasOwnProperty('prototype'); // false
```

#### 19.3.3 프로토타입의 constructor 프로퍼티와 생성자 함수
- 모든 프로토타입은 constructor 프로퍼티를 갖는다.
- constructor 프로퍼티는 prototype 프로퍼티로 자신을 참조하고 있는 생성자 함수를 가리킨다.

```javascript
function Person(name) {
  this.name = name;
}

const me = new Person('Lee');
console.log(me.constructor === Person) //true
```

### 19.4 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입
- 리터럴 표기법에 의해 생성된 객체도 프로토타입이 존재한다.
- 하지만 리터럴 표기법에 의해 생성된 객체의 경우 constructor 프로퍼티가 가리키는 생성자 함수가 반드시 객체를 생성한 생성자 함수라고 단정할 수는 없다.
```javascript
const obj = {};

console.log(obj.constructor === Object); // true
```
- 위 예제의 Obj 객체는 객체 리터럴에 의해 생성된 객체이지만 Object 생성자 함수와 constructor 프로퍼티로 연결되어있다.
- Object 생성자 함수에 인수를 전달하지 않거나 undefined 또는 null을 전달하면서 호출하면 내부적으로는 추상 연산 OrdinaryObjectCreate를 호출한다.
- OrdinaryObjectCreate는 Object.prototype을 프로토타입으로 갖는 객체를 생성한다.
- 객체 리터럴이 평가될 때는 추상 연산 OrdinaryObjectCreate를 호출하여 빈 객체를 생성하고 프로퍼티를 추가하도록 정의되어 있다.
- 객체 리터럴의 경우 Object 생성자 함수가 생성한 객체가 아니고 함수 리터럴을 생성한 것 또한 Function 생성자 함수가 아니다.
- 하지만 프로토타입으로 생성자 함수를 갖는다.
- 리터럴 표기법에 의해 생성된 객체도 상속을 위해 프로토타입이 필요하다. 따라서 가상적인 생성자 함수를 갖게된다.

### 19.5 프로토타입의 생성 시점
- 프로토타입은 생성자 함수가 생성될 때 더불어 생성된다.

#### 19.5.1 사용자 정의 생성자 함수와 프로토타입 생성 시점
- 생성자 함수로서 호출할 수 있는 함수, 즉 constructor는 함수 정의가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성된다.
- 프로토타입은 생성자 함수가 생성될 때 더불어 생성되며 constructor 프로퍼티는 프로토타입 객체가 생성될 때 더불어 생성된다.

#### 19.5.2 빌트인 생성자 함수와 프로토타입 생성 시점
- 빌트인 생성자 함수는 전역 객체가 생성되는 시점에 생성되고 프로토타입도 더불어 생성된다.
- 이후 생성자 함수 또는 리터럴 표기법으로 객체를 생성하면 프로토타입은 생성된 객체의 [[Prototype]] 내부 슬롯에 할당된다.

### 19.6 객체 생성 방식과 프로토타입의 결정
- 객체 생성 방식에는 리터럴 표기법, Object 생성자 함수, 생성자 함수, Object.create 메서드, 클래스가 있다.
- 이처럼 다양한 방식으로 생성된 모든 객체는 추상 연산 OrdinaryObjectCreate에 의해 생성된다.
- OrdinaryObjectCreate는 프로토타입을 생성하고 생성된 객체의 [[Prototype]] 내부 슬롯에 할당한다.

#### 19.6.1 객체 리터럴에 의해 생성된 객체의 프로토타입
- 객체 리터럴에 의해 생성된 객체는 Object.prototype을 프로토타입으로 갖는다. 이로써 Object.prototype을 상속받는다.
- obj 객체는 constructor 프로퍼티와 HasOwnProperty 메서드 등을 소유하지 않지만 자신의 프로토타입인 Object.prototype의 프로퍼티와 메서드를 상속받아 사용할 수 있다.

```javascript
const obj = {};

console.log(obj.hasOwnProperty('x')); // false
```

#### 19.6.2 Object 생성자 함수에 의해 생성된 객체의 프로토타입
- Object 생성자 함수에 의해 생성된 객체는 Object.prototype을 프로토타입으로 갖는다.
- 객체 리터럴과 Object 생성자 함수에 의한 객체 생성 방식의 차이는 프로퍼티를 추가하는 방식에 있다.
- 객체 리터럴 방식은 객체 리터럴 내부에 프로퍼티를 추가하지만 Object 생성자 함수 방식은 일단 빈 객체를 생성한 후 프로퍼티를 추가한다.

#### 19.6.3 생성자 함수에 의해 생성된 객체의 프로토타입
- 표준 빌트인 객체인 Object 생성자 함수와 더불어 생성된 프로토타입 Object.prototype은 다양한 빌트인 메서드(hasOwnProperty, propertyIsEnumerable 등)을 갖고있다.
- 하지만 사용자 정의 생성자 함수로 생성된 객체는 constructor만을 갖는다.

### 19.7 프로토타입 체인
- 자바스크립트는 객체의 프로퍼티에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면 [[Prototype]] 내부 슬롯이 가리키는 프로토타입 객체의 프로퍼티를 순차적으로 검색한다.
- 이러한 프로퍼티 검색 과정을 프로토타입 체인이라 한다.
- 프로토타입 체인의 최상위에 위치하는 객체는 Object.prototype이다. Object.prototype을 프로토타입 체인의 종점이라 한다.
- 프로토타입 체인은 상속과 프로퍼티 검색을 위한 메커니즘이다.

### 19.8 오버라이딩과 프로퍼티 섀도잉
- 프로토타입 체인 상에서 객체의 프로퍼티를 검색할 때 프로토타입 체인 상에 여러 객체에 같은 이름의 프로퍼티가 있다면 프로토타입 체인 상에서 가장 먼저 검색된 프로퍼티가 검색되고 그 프로퍼티가 가려진다.
- 하위 객체가 프로토타입의 프로퍼티를 변경 또는 삭제하는 것은 불가능하다.

### 19.9 프로토타입의 교체
- 객체의 프로토타입은 임의의 객체로 교체할 수 있다.
#### 19.9.1 생성자 함수에 의한 프로토타입의 교체
```javascript
const Person = (function() {
        function Person(name) {
            this.name = name;
        }
        
        // 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
        Person.prototype = {
            sayHello() {
                console.log()
            }
        }
        
        return Person;
    }
)

const me = new Person('Lee');
```
- 프로토타입으로 교체한 객체 리터럴에는 constructor 프로퍼티가 없다.
- 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수간의 연결이 파괴된다.
- 프로토타입을 교체하면 constructor 프로퍼티를 다시 설정해야한다.

```javascript
const Person = (function() {
        function Person(name) {
            this.name = name;
        }
        
        // 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
        Person.prototype = {
            constructor: Person,
            sayHello() {
                console.log()
            }
        }
        
        return Person;
    }
)

const me = new Person('Lee');
```

#### 19.9.2 인스턴스에 의한 프로토타입의 교체
```javascript
function Person(name){
    this.name = name;
}

const me = new Person('Lee');

// me 객체의 프로토타입을 교체

Object.setPrototypeOf(me, {
    sayHello(){
        console.log(`Hi! My name is ${this.name}`);
    }
});

me.sayHello(); // Hi! My name is Lee
```
- 이번에도 constructor 프로퍼티가 없으므로 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
- 프로토타입 교체를 통해 객체 간의 상속 관계를 동적으로 변경하는 것은 꽤나 번거롭다. 따라서 프로토타입 교체는 지양해야한다.

### 19.10 instanceof 연산자
- 우변의 생성자 함수의 prototype에 바인딩된 객체가 좌변의 객체의 프로토타입 체인 상에 존재하면 true를 반환한다.

```javascript
function Person(name){
    this.name = name;
}

const me = new Person('Lee');

// 프로토타입으로 교체할 객체
const parent = {};

// me 객체의 프로토타입을 교체
Object.setPrototypeOf(me, parent);

console.log(me instanceof Person); // false
console.log(me instanceof Object); // true

// parent 객체를 Person 생성자 함수의 prototype 프로퍼티에 반영
Person.prototype = parent;

console.log(me instanceof Person); // true
console.log(me instanceof Object); // true
```
- instanceof 연산자는 프로토타입의 constructor 프로퍼티가 가리키는 생성자 함수를 찾는 것이 아니라 
- 생성자 함수의 Prototype에 바인딩된 객체가 프로토타입 체인 상에 존재하는지 확인한다.
- 따라서 프로토타입 교체로 인해 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴되어도 instanceof 연산자는 영향을 받지 않는다.

### 19..11 직접 상속
#### 19.11.1 Object.create에 의한 직접 상속
- Object.create 메서드는 명시적으로 프로토타입을 지정하여 객체를 생성한다.
- Object.create 메서드는 첫 번째 인수로 전달받은 객체를 [[Prototype]]이라는 내부 슬롯에 할당하여 객체를 생성한다.

```javascript
let obj = Object.create(null);
console.log(Object.getPrototypeOf(obj) === null); // true

// Object.prototype을 상속받지 못한다.
console.log(obj.toString()); // TypeError: obj.toString is not a function

// obj = {}와 동일
obj = Object.create(Object.prototype);

// obj = {x:1}과 동일
obj = Object.create(Object.prototype, {
    x: {value: 1, writable: true, enumerable: true, configurable: true}
});

//임의의 객체를 직접 상속받는다
const parent = {x: 1};
obj = Object.create(parent);

//생성자 함수
function Person(name){
    this.name = name;
}

obj = Object.create(Person.prototype);

```
- 이 메서드의 장점
  - new 연산자가 없어도 객체를 생성할 수 있다.
  - 프로토타입을 지정하면서 객체를 생성할 수 있다
  - 객체 리터럴에 의해 생성된 객체도 상속받을 수 있다.
- Object.prototype의 빌트인 메서드인 Object.prototype.hasOwnProperty 등은 모든 객체가 상속받아 호출할 수 있다.
- 그런데 ESLint에서는 Object.prototype의 빌트인 메서드를 객체가 직접 호출하는 것을 권장하지 않는다.
- 이는 Object.create 메서드를 통해 프로토타입 체인의 종점에 위치하는 객체를 생성할 수 있기 때문이다.
```javascript
const obj = Object.create(null);
obj.a = 1;

console.log(obj.hasOwnProperty('a')); // TypeError: obj.hasOwnProperty is not a function

// 간접적으로 호출하는 것 권장
console.log(Object.prototype.hasOwnProperty.call(obj, 'a')); // true
```

#### 19.11.2 객체 리터럴 내부에서 __proto__에 의한 직접 상속
- 객체 리터럴 내부에서 __proto__를 사용하면 프로토타입을 지정하여 객체를 생성할 수 있다.

```javascript
const myProto = {x: 10};

const obj = {
    __proto__: myProto,
    y: 20
};

// 위 코드는 아래와 동일하다
// const obj = Object.create(myProto, {
//     y: {value: 20, writable: true, enumerable: true, configurable: true}
// });

console.log(obj.x); // 10
```

### 19.12 정적 프로퍼티/메서드
- 정적 프로퍼티/메서드는 생성자 함수로 인스턴스를 생성하지 않아도 참조/호출할 수 있다.
```javascript
function Person(name){
    this.name = name;
}

//정적 프로퍼티
Person.staticProp = 'static prop';

//정적 메서드
Person.staticMethod = function(){
    return this.staticProp;
}

console.log(Person.staticProp); // static prop
console.log(Person.staticMethod()); // static prop
```

- 정적 프로퍼티 또는 메서드는 생성자 함수가 생성한 인스턴스로 참조/호출할 수 없다.
```javascript
// Object.create는 정적 메서드다
const obj = Object.create({name: 'Lee'});

// Object.prototype.hasOwnProperty는 정적 메서드가 아니라 프로토타입 메서드다
obj.hasOwnProperty('name')

// 정적 메서드는 인스턴스로 호출할 수 없다
obj.staticMethod(); // TypeError: obj.staticMethod is not a function
```

### 19.13 프로퍼티 존재 확인
#### 19.13.1 in 연산자
- in 연산자는 객체가 특정 프로퍼티를 소유하고 있는지 확인한다.
- in 연산자 대신 ES6에서 도입된 Reflect.has 메서드를 사용할 수 있다.

```javascript
const person = {name: 'Lee', address: 'Seoul'};

console.log('name' in person); // true
console.log('age' in person); // false
```

#### 19.13.2 Object.prototype.hasOwnProperty 메서드
- hasOwnProperty 메서드는 객체 자신이 소유하고 있는 프로퍼티인지 확인한다.
- hasOwnProperty 메서드는 객체 자신의 프로퍼티인 경우에만 true를 반환한다.
- 상속받은 프로퍼티는 false를 반환한다.

```javascript
const person = {name: 'Lee', address: 'Seoul'};

console.log(person.hasOwnProperty('name')); // true
console.log(person.hasOwnProperty('age')); // false
```

### 19.14 프로퍼티 열거
#### 19.14.1 for...in 문
- for...in 문은 객체(배열 포함)에 포함된 모든 프로퍼티에 대해 반복하며 열거한다.
- for ... in 문은 순회 대상 객체의 프로퍼티 뿐만 아니라 상속받은 프로퍼티도 열거한다.
- 하지만 열거할 수 없도록 정의되어 있는 프로퍼티는 열거할 수 었다. [[Enumerable]]이 false인 프로퍼티는 열거되지 않는다.
- for...in 문은 프로퍼티를 열거할 때 순서를 보장하지 않는다.

```javascript
const sym = Symbol();
const person = {
    name: 'Lee',
    address: 'Seoul',
    __proto__: {age: 20},
    [sym]: 19
};

console.log('toString' in person); // true

// toString은 열거되지 않는다. 
// property 키가 symbol인 프로퍼티는 열거하지 않는다.
for(const key in person){
    console.log(key + ': ' + person[key]); 
}

// name: Lee
// address: Seoul
// age: 20
```

#### 19.14.2 Object.keys/values/entries 메서드
- Object.keys 메서드는 객체 자신의 열거 가능한 프로퍼티 키를 배열로 반환한다.
- Object.values 메서드는 객체 자신의 열거 가능한 프로퍼티 값을 배열로 반환한다.
- Object.entries 메서드는 객체 자신의 열거 가능한 프로퍼티 키와 값의 쌍의 배열을 배열에 담아 반환한다.


### 느낀점
지난 주에 공부했던 함수 객체와 prototype에 관한 내용이 나와서 반가웠습니다. for...in 문을 몇번 사용했던 기억이 있는데 순서를 보장할 수 없다는 것과 상속받은 프로퍼티가 포함될 수 있다는 걸 몰랐습니다.
아무리 자바스크립트에서 제공해주는 것이라도 잘 알아보고 사용해야겠습니다.