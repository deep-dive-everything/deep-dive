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
### 느낀점
모르고 다음 주 내용까지 미리 정리를 해버려서 더 바쁜 한주였지만 이전 내용을 공부한 뒤 바로 prototype까지 훑어볼 수 있어서 이해하는 데 더 도움이 되었던 것 같습니다.
정리한 내용을 많이 잊었었는데 발표자분께서 정리를 너무 잘해주셔서 내용이 훨씬 기억에 잘 남아 좋았습니다.