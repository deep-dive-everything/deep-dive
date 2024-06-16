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

## 20장. strict mode
### 20.1 strict mode란
```javascript
function foo(){
    x = 10;
}
foo();
console.log(x); // 10
```
- 위 코드에서 선언하지 않은 x 변수에 10을 할당했을 때 에러가 나야할 것 같지만 자바스크립트 엔진이 암묵적으로 전역 객체에 x 프로퍼티를 동적 생성하게 된다.
- 이를 암묵적 전역이라고 한다. var,let,const 키워드를 사용하면 이를 방지할 수 있다.
- 이렇게 잠재적인 오류를 발생시킬 수 있는 코드를 실행할 때 에러를 발생시키는 것이 strict mode이다.
- ESLint 같은 정적 코드 분석 도구를 사용하면 strict mode를 사용하지 않은 코드를 찾아내기 쉽다.

### 20.2 strict mode의 적용
- 전역의 선두 또는 함수 몸체의 선두에 'use strict'를 추가하면 strict mode가 적용된다.
- 코드의 선두에 'use strict'를 위치시키지 않으면 strict mode가 제대로 동작하지 않는다.

### 20.3 전역에 strict mode를 적용하는 것은 피하자
- 전역에 적용한 scrit mode는 스크립트 단위로 적용된다. 스크립트 단위로 적용된 strict mode는 다른 스크립트에 영향을 주지 않고 해당 스크립트에 한정되어 적용된다.
- strict mode 스크립트와 non-strcit mode 스크립트를 혼용하는 것은 오류를 발생시킬 수 있다. 따라서 전역에 strict mode를 적용하는 것은 피해야한다.
- 이러한 경우 즉시 실행 함수로 스크립트 전체를 감싸서 스코프를 구분하고 즉시 실행 함수의 선두에 strict mode를 적용하는 것이 좋다.

### 20.4 함수 단위로 strict mode를 적용하는 것도 피하자
- 어떤 함수는 strict mode를 적용하고 어떤 함수는 적용하지 않는 것은 바람직하지 않다.
- 따라서 strict mode는 즉시 실행함수로 감싼 스크립트 단위로 적용하는 것이 바람직하다.

### 20.5 strict mode가 발생시키는 에러
1. 암묵적 전역
   - 선언하지 않은 변수에 값을 할당하면 ReferenceError가 발생한다.
2. 변수, 함수, 매개변수의 삭제
   - delete 연산자로 변수, 함수, 매개변수를 삭제하면 SyntaxError가 발생한다.
3. 매개변수 이름의 중복
   - 중복된 매개변수 이름을 사용하면 SyntaxError가 발생한다.
4. with 문의 사용
   - with 문을 사용하면 SyntaxError가 발생한다.
   - with 문은 가독성을 해치고 성능을 저하시키며 혼란을 줄 수 있기 때문에 사용하지 않는 것이 좋다.

### 20.6 strict mode 적용에 의한 변화
1. 일반 함수의 this
   - strict mode에서 함수를 일반 함수로서 호출하면 this에 undefined가 바인딩된다.
   - 생성자 함수가 아닌 일반 함수 내부에서는 this를 사용할 필요가 없기 때문이다.
2. arguments 객체
    - strict mode에서는 매개변수에 전달된 인수를 재할당하여 변경해도 arguments 객체에 반영되지 않는다.

### 느낀점
프로토타입 기반의 언어인 자바스크립트를 사용하면서도 프로토타입에 대해 잘 모르고 있었습니다. 이번 기회로 심도있게 공부할 수 있어 좋았습니다.
for...in 문을 몇번 사용했던 기억이 있는데 순서를 보장할 수 없다는 것과 상속받은 프로퍼티가 포함될 수 있다는 걸 몰랐습니다.
아무리 기본으로 제공되는 것이라도 잘 알아보고 사용해야겠습니다.

### 공유할 점
깨알 공유입니다. :) __proto__ 접근자 프로퍼티를 언더바 언더바 프로토라고 읽고 있었는데 dunder(double underscore) proto라고 읽는다고 합니다.