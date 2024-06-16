# 19장 프로토타입

## 1. 객체지향 프로그래밍

- 독립적인 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임.

```jsx
const person = {
    name: 'Lee',
    address: 'Seoul',
}

console.log(person); // {name: "Lee", address: "Seoul"}
```

- 위 예시에서 프로그래머는 이름과 주소 속성으로 표현된 객체인 person을 다른 객체와 구별하여 인식할 수 있음.
- 객체는 속성을 통해 여러 값을 하나의 단위로 구성한 복합적인 자료구조.
- 프로퍼티 : 상태를 나타내는 데이터
- 메서드 : 상태 데이터를 조작할 수 있는 동작

## 2. 상속과 프로토타입

- 상속은 어떤 객체의 프로퍼티 또는 메서드를 다른 객체가 상속받아 그대로 사용할 수 있는것.
- 상속을 통해 불필요한 중복을 제거할 수 있음.

```jsx
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

```jsx
function Circle(radius) {
	this.radius = radius;
}

//Circle 생성자 함수가 생성한 모든 인스턴스가 getArea를 공유해서 사용할 수 있도록 프로퍼티에 추가
//프로토타입은 Circle 생성자 함수의 prototype프로퍼티에 바인딩되어 있음.
Circle.prototype.getArea = function () {
	return Math.PI * this.radius ** 2;
}

const circle1 = new Circle(1);
const circle2 = new Circle(2);

console.log(circle1.getArea === circle2.getArea); //true
```

- 자바스크립트는 프로토타입을 기반으로 상속을 구현한다. 상태를 나타내는 radius 프로퍼티만 개별적으로 소유하고 내용이 동일한 메서드는 상속을 통해 공유하여 사용.
- 메서드를 프로토타입에 미리 구현하면 생성자 함수가 생성할 모든 인스턴스는 별도의 구현 없이 상위 객체인 프로토타입의 자산을 공유하여 사용할 수 있음.

## 3. 프로토타입 객체

- 프로토타입 객체는 객체간 상속을 구현하기 위해 사용한다. 프로토타입은 어떤 객체의 상위 객체의 역할을 하는 객체로, 다른 객체에 공유 프로퍼티(메서드 포함) 제공.
- 모든 객체는 [[Prototype]]이라는 내부 슬롯을 가짐.

### 3-1. __proto__ 접근자 프로퍼티

- 모든 객체는 `__proto__` 접근자 프로퍼티를 통해 자신의 [[Prototype]] 내부 슬롯이 가리키는 프로토타입에 간접적으로 접근 가능.
1. **`__proto__`는 접근자 프로퍼티다.**
- 접근자 프로퍼티는 자체적으로 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 사용하는 접근자 함수 [[Get]], [[Set]] 프로퍼티 어트리뷰트로 구성된 프로퍼티.
    
    ```jsx
    const obj = {};
    const parent = {x: 1};
    
    //getter 함수인 get__proto__가 호출되어 obj객체의 프로토타입 취득.
    obj.__proto__;
    
    //setter 함수인 set __proto__가 호출되어 obj 객체의 프로토타입 교체.
    obj.__proto__ = parent;
    
    console.log(obj.x); //1
    ```
    
- `__proto__` 접근자 프로퍼티를 통해 프로토타입에 접근하면 내부적으로 `__proto__`접근자 프로퍼티의 getter 함수가 호출됨. `__proto__`접근자 프로퍼티에 새로운 프로토타입을 할당하면 setter 함수가 호출됨.

1. **`__proto__`접근자 프로퍼티는 상속을 통해 사용됨.**

객체가 직접 소유하는 것이 아닌 Object.prototype의 프로퍼티임. 상속을 통해 사용할 수 있음.

1. **`__proto__` 접근자 프로퍼티를 통해 프로토타입에 접근하는 이유**
- 상호 참조에 의해 프로토타입 체인이 생성되는 것을 방지하기 위해.

```jsx
const parent = {};
const child = {};

// child 객체의 프로토타입을 parent 객체로 설정
child.__proto__ = parent;

// parent 객체의 프로토타입을 child 객체로 설정
parent.__proto__ = child; // TypeError: Cyclic __proto__ value
```

- 순환참조하는 경우 프로퍼티 검색 시 무한 루프에 빠짐. 이를 방지하기 위해 아무 체크 없이 무조건적으로 프로토타입을 교체할 수 없도록 접근자 프로퍼티를 통해 프로퍼티에 접근하고 교체하도록 구현.

1. **`__proto__` 접근자 프로퍼티를 코드 내에서 직접 사용하는 것은 권장하지 않음.**
- 접근자 프로퍼티 대신 프로토타입의 참조를 취득할떄는 Object.getPrototypeOf, 프로토타입을 교체할떄는 Object.setPrototypeOf메서드를 사용.

### 3-2 함수 객체의 prototype 프로퍼티

- 함수 객체만이 소유하는 prototype 프로퍼티는 생성자 함수가 생성할 객체(인스턴스)의 프로토타입을 가리킴.
- 생성자 함수로 호출할 수 없는 함수,즉 non-constructor인 화살표함수와 축약 표현으로 정의한 메서드는 prototype프로퍼티를 소유하지 않으며 프로토타입도 생성하지 않음.
- `__proto__ 접근자 프로퍼티와 prototype 프로퍼티는 결국 동일한 프로토타입을 가리킴. 하지만 사용하는 주체가 다름

| 구분 | 소유 | 값 | 사용 주체 | 사용 목적 |
| --- | --- | --- | --- | --- |
| `__proto__ 접근자 프로퍼티 | 모든 객체 | 프로토타입의 참조 | 모든 객체 | 객체가 자신의 프로토타입에 접근 또는 교체하기 위해 |
| prototype 프로퍼티 | constructor | 프로토타입의 참조 | 생성자 함수 | 생성자함수가 자신이 생성할객체의 프로토타입을 할당하기 위해 |

```jsx
fucntion Person(name) {
	this.name = name;
}

const me = new Person('Lee');

// Person.prototype과 me.__proto__는 결국 동일한 프로토타입을 가리킴
console.log(Person.prototype === me.__proto__); //true
```

### 3-3 프로토타입의 constructor 프로퍼티와 생성자 함수

- 모든 프로토타입은 constructor 프로퍼티를 갖는다. constructor 프로퍼티는 자신을 참조하고 있는 생성자 함수를 가리킨다.
- 생성자함수로 함수 객체가 생성될때 연결이 이뤄짐.

```jsx
fucntion Person(name) {
	this.name = name;
}

const me = new Person('Lee');

//me 객체의 생성자 함수는 Person
console.log(me.constructor == Person); //true
```

## 4. 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입

- 리터럴 표기법과 같이 생성자 함수를 호출하지 않고 생성된 객체에도 프로토타입이 존재함.
- 리터럴 표기법에 의해 생성된 객체의 경우 프로토타입의 constructor 프로퍼티를 가리키는 생성자 함수가 반드시 객체를 생성한 생성자 함수라고 단정할 수 없다.

```jsx
// obj 객체는 Object 생성자 함수로 생성한 객체가 아니라 객체 리터럴로 생성함
const obj = {};

// 하지만 obj 객체의 생성자 함수는 Object 생성자 함수임.
console.log(obj.constructor === Object); // true
```

- 객체 리터럴이 평가될 때 추상연산 OrdinaryObjectCreate를 호출하여 빈 객체를 생성하고 프로퍼티를 추가하도록 정의되어있음.
- 하지만 객체 리터럴의 경우 Object 생성자 함수가 생성한 객체가 아님.
- 리터럴 표기법에 의해 생성된 객체도 상속을 위해 프로토타입이 필요함. 따라서 가상적인 생성자 함수를 가짐.

## 5. 프로토타입의 생성 시점

- 프로토타입은 생성자 함수가 생성되는 시점에 더불어 생성됨.
- 프로토타입과 생성자 함수는 단독으로 존재할 수 없고 언제나 쌍으로 존재하기 때문.

### 5-1 사용자 정의 생성자 함수와 프로토타입 생성 시점

- 생성자 함수로 호출할 수 있는 함수, 즉 constructor는 함수 정의가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성됨.

```jsx
console.log(Person.prototype); // {constructor: f}

function Person(name){
	this.name = name;
}
```

- 생성자 함수로 호출할 수 없는 함수, 즉 non-constructor는 프로토타입이 생성되지 않음.

```jsx
//화살표 함수는 non-constructor임.
const Person = name => {
	this.name = name;
}
console.log(Person.prototype); // undefined
```

### 5-2 빌트인 생성자 함수와 프로토타입 생성 시점

- 빌트인 생성자 함수는 전역 객체가 생성되는 시점에 생성되고 이때 프로토타입이 생성됨.
- 객체가 생성되기 이전에 생성자 함수와 프로토타입은 이미 객체화되어 존재함. 이후 생성자 함수 또는 리터럴 표기법으로 객체를 생성하면 프로토타입은 생성된 객체의 [[Prototype]] 내부 슬롯에 할당됨.

## 6. 객체 생성 방식과 프로토타입의 결정

- 다양한 방식으로 생성되는 모든 객체는 OrdinaryObjectCreate에 의해 생성됨.
- OrdinaryObjectCreate는 자신이 생성할 객체의 프로토타입을 인수로 전달받으며 이를 [[Prototype]]내부 슬롯에 할당한 뒤 생성된 객체를 반환함.
- 프로토타입은 OrdinaryObjectCreate에 전달되는 인수에 의해 결정되며, 이 인수는 객체가 생성되는 시점에 객체 생성 방식에 의해 결정됨.

### 6-1 객체 리터럴에 의해 생성된 객체의 프로토타입

- 객체 리터럴을 평가하여 객체 생성시 OrdinaryObjectCreate 호출
- OrdinaryObjectCreate에 전달되는 프로토타입은 Object.prototype
- 따라서 객체 리터럴에 의해 생성되는 객체의 프로토타입은 Object.prototype이며, Object.prototype객체를 상속받았기 때문에 constructor 프로퍼티와 hasOwnProperty메서드를 사용할 수 있음.

```jsx
const obj = { x: 1 };

//객체 리터럴에 의해 생성된 obj 객체는 Object.Prototype을 상속받는다.
console.log(obj.constructor === Object); //true
console.log(obj.hasOwnProperty('x')); //true
```

### 6-2 Object 생성자 함수에 의해 생성된 객체의 프로토타입

- Object 생성자 함수 호출시 OrdinaryObjectCreate 호출
- Object 생성자 함수에 의해 생성되는 객체의 프로토타입은 Object.prototype.
- 객체 리터럴로 생성된 객체와 동일한 구조
- 객체리터럴과의 차이점
    - 객체 리터럴 : 객체 리터럴 내부에 프로퍼티 추가
    - Object 생성자 함수 : 빈 객체를 생성한 이후 프로퍼티 추가

### 6-3 생성자 함수에 의해 생성된 객체의 프로토타입

- OrdinaryObjectCreate 호출
- 생성자 함수에 의해 생성되는 객체의 프로토타입은 생성자 함수의 prototype프로퍼티에 바인딩 되어있는 객체.
- 표준 빌트인 객체인 Object 생성자 함수와 더불어 생성된 프로토타입 Object.prototype은 다양한 빌트인 메서드(hasOwnProperty, propertyEnumerable 등)를 갖고있음. 하지만 사용자 정의 생성자 함수로 생성된 프로토타입의 프로퍼티는 constructor 뿐임.

```jsx
function Person(name) {
	this.name = name;
}

//프로토타입 메서드
Person.prototype.sayHello = function () {
	console.log(`Hi! My name is ${this.name}`);
}

const me = new Person('Lee')
const you = newPerson('Kim')

me.sayHello(); //Hi! My name is Lee
you.sayHello(); //Hi! My name is Kim
```

- Person 생성자 함수를 통해 생성된 모든 객체는 프로토타입에 추가된 sayHello 메서드를 상속받아 자신의 메서드처럼 사용할 수 있음.

## 7. 프로토타입 체인

- 자바스크립트는 객체의 프로퍼티에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면 [[Prototype]] 내부 슬롯의 참조를 따라 자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색한다.
- 프로토타입 체인의 최상위에 위치하는 객체는 Object.prototype이며 이를 프로토타입의 체인의 종점이라고 함.
- 프로토타입 체인은 상속과 프로퍼티 검색을 위한 매커니즘

## 8. 오버라이딩과 프로퍼티 섀도잉

- 프로퍼티 섀도잉 : 상속관계에 의해 프로퍼티가 가려지는 현상
- 프로토타입 프로퍼티와 같은 이름의 프로퍼티를 인스턴스에 추가하면 프로토타입 프로퍼티를 덮어쓰는 것이 아니라 인스턴스 프로퍼티로 추가함. 이때 프로토타입 체인 상에서 가장 먼저 검색된 프로퍼티가 검색되므로 프로토타입의 프로퍼티가 가려짐.
- 하위 객체를 통해 프로토타입의 프로퍼티를 변경 또는 삭제하는 것은 불가능함.

## 9. 프로토타입 교체

- 프로토타입은 임의의 다른 객체로 변경할 수 있음.

### 9.1 생성자 함수에 의한 프로토타입 교체

```jsx
const Person = (function() {
	function Person(name) {
		this.name = name;
}
        
// 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
Person.prototype = {
	sayHello() {
		console.log(`Hi! My name is ${this.name}`)
	}
}
        
	return Person;
}());

const me = new Person('Lee');
```

- 예시에서 Person.prototype에 객체 리터럴을 할당함.
- 객체 리터럴에는 constructor 프로퍼티가 없다 따라서 me 객체의 생성자 함수를 검색하면 Person이 아닌 Object가 나옴.

```jsx
//프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴됨.
console.log(me.constructor === Person);//false
// 프로토타입 체인을 따라 Object.prototype의 프로퍼티가 검색됨.
console.log(me.constructor === Object);//true
```

```jsx
const Person = (function() {
	function Person(name) {
		this.name = name;
}
        
// 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
Person.prototype = {
//constructor 프로퍼티와 생성자 함수 간의 연결을 설정
  constructor: Person,
	sayHello() {
		console.log(`Hi! My name is ${this.name}`)
	}
}
        
	return Person;
}());

const me = new Person('Lee');

console.log(me.constructor === Person);//true
console.log(me.constructor === Object);//false
```

### 9.2 인스턴스에 의한 프로토타입의 교체

- 인스턴스의 __proto 접근자 또는 Object.getPrototypeOf메서드를 통해 프로토타입을 교체

```jsx
function Person(name){
  this.name = name;
}

const me = new Person('Lee');

const parent = {
  sayHello() {
    console.log(`Hi! My name is ${this.name}`);
  }
});

Object.setPrototypeOf(me, Parent);

me.sayHello(); // Hi! My name is Lee
```

- 교체한 객체에는 constructor 프로퍼티가 없으므로 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
- 프로토타입을 직접 교체하지 않는것이 좋으며 직접 상속이 더 편리하고 안전함.

## 10. instanceof 연산자

```jsx
객체 instanceof 생성자 함수
```

- 우변의 생성자 함수의 prototype에 바인딩 된 객체가 좌변의 객체의 프로토타입 체인 상에 존재하면 true, 그렇지 않으면 false.

```jsx
fucntion Person(name) {
	this.name = name;
}

const me = new Person('Lee');

//Person.prototype이 me객체의 프로토타입 체인 상에 존재함
console.log(me instanceof Person); //true

//Object.prototype이 me 객체의 프로토타입 체인 상에 존재함
console.log(me instanceof Object); //true
```

- 생성자 함수의 prototype에 바인딩된 객체가 프로토타입 체인 상에 존재하는지 확인.
- 생성자 함수에 의해 프로토타입이 교체되어 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴되어도 생성자함수의 prototype 프로퍼티와 프로토타입 간의 연결은 파괴되지 않으므로 instanceof는 영향을 받지 않는다.

## 11. 직접 상속

### 11.1 Object.Create에 의한 직접 상속

- Object.Create는 명시적으로 프로토타입을 지정하여 새로운 객체를 생성.
- 첫번째 매개변수에는 생성할 객체의 프로퍼티 키와 프로퍼티 디스크럽터로 이뤄진 객체를 전달.

```jsx
//프로토타입이 null인 객체를 생성.
let obj = Object.create(null);
console.log(Object.getPrototypeOf(obj) === null); // true
// Object.prototype을 상속받지 못한다.
console.log(obj.toString()); // TypeError: obj.toString is not a function

// obj = {};
obj = Object.create(Object.prototype);
console.log(Object.getPrototypeOf(obj) === Object.prototype); //true

// obj = {x:1};
obj = Object.create(Object.prototype, {
    x: {value: 1, writable: true, enumerable: true, configurable: true}
});
console.log(obj.x); //1
console.log(Object.getPrototypeOf(obj) === Object.prototype); //true

const myProto = { x: 10 };
//임의의 객체를 직접 상속받는다
obj = Object.create(myProto);
console.log(obj.x); //10
console.log(Object.getPrototypeOf(obj) === myProto); //true

//생성자 함수
function Person(name){
    this.name = name;
}

obj = Object.create(Person.prototype);
obj.name = 'Lee';
console.log(obj.name); //Lee
console.log(Object.getPrototypeOf(obj) === Person.prototype); //true
```

- new 연산자가 없어도 객체를 생성할 수 있다.
- 프로토타입을 지정하면서 객체를 생성할 수 있다.
- 객체 리터럴에 의해 생성된 객체도 상속받을 수 있다.
- Object.prototype의 빌트인 메서드인 Object.prototype.hasOwnProperty 등은 모든 객체가 상속받아 호출할 수 있다.
- 하지만  Object.create 메서드를 통해 프로토타입 체인의 종점에 위치하는 객체를 생성할 수 있기 때문에 Object.prototype의 빌트인 메서드를 객체가 직접 호출하는 것을 권장하지 않는다.

### 11.2 **객체 리터럴 내부에서 __proto__에 의한 직접 상속**

- 객체 리터럴 내부에서 __proto__접근자 프로퍼티를 사용하여 직접 상속을 구현할 수 있음.

```jsx
const myProto = {x: 10};

//객체 리터럴에 의해 객체를 생성하면서 프로토타입을 지정하여 직접 상속받을 수 있다.
const obj = {
    y: 20,
    __proto__: myProto
};

// 위 코드는 아래와 동일하다
// const obj = Object.create(myProto, {
//     y: {value: 20, writable: true, enumerable: true, configurable: true}
// });

console.log(obj.x, obj.y); // 10 20
console.log(Object.getPropertyOf(obj) === myProto); // true

```

## 12. 정적 프로퍼티 / 메서드

- 정적 프로퍼티/메서드는 생성자 함수로 인스턴스를 생성하지 않아도 참조/호출할 수 있는 프로퍼티/메서드.

```jsx
// 생성자 함수
function Person(name){
    this.name = name;
}

//프로토타입 메서드
Person.prototype.sayHello = function () {
	console.log(`Hi! My name is ${this.name}`);
}

//정적 프로퍼티
Person.staticProp = 'static prop';

//정적 메서드
Person.staticMethod = function(){
    console.log('staticMethod');
}

const me = new Person('Lee');

//생성자 함수에 추가한 정적 프로퍼티/메서드는 생성자 함수로 참조/호출함
Person.staticMethod(); // staticMethod

//정적 프로퍼티/메서드는 생성자 함수가 생성한 인스턴스로 참조/출 할 수 없다.
me.staticMethod(); // TypeError: me.staticMethod is not a function
```

- 정적 프로퍼티/메서드는 생성자 함수가 생성한 인스턴스로 참조/출 할 수 없다.
- 정적 프로퍼티/메서드는 인스턴스의 프로토타입 체인에 속한 객체의 프로퍼티/메서드가 아니므로 인스턴스로 접근할 수 없음.

## 13. 프로퍼티 존재 확인

### 13.1 in 연산자

- in 연산자는 객체 내에 특정 프로퍼티가 존재하는지 여부를 확인함.

```jsx
key in object
```

```jsx
const person = {
	name: 'Lee',
	address: 'Seoul'
};

console.log('name' in person);//true
console.log('age' in person);//false
```

- in 연산자는 대상 객체 뿐 아니라 대상 객체가 상속받은 모든 프로토타입의 프로퍼티를 확인함.

```jsx
console.log('toString' in person);//true : Object.prototype의 메서드임.
```

- in 연산자 대신 Reflect.has메서드를 사용할 수 있음.

### 13.2 **Object.prototype.hasOwnProperty 메서드**

- 객체 고유의 프로퍼티 키인 경우에만 true를 반환하고 상속받은 프로토타입의 프로퍼티 키인 경우 false를 반환함.

## 14. 프로퍼티 열거

### 14.1 for…in 문

- 객체의 모든 프로퍼티를 순회하며 열거함.

```jsx
for (변수선언문 in 객체) {...}
```

```jsx
const person = {
	name: 'Lee',
	address: 'Seoul'
};

for(const key in person){
	console.log(key+ ':' + person[key]);
}
//name : Lee
//address : seoul
```

- for…in문은 객체의 프로토타입 체인 상에 존재하는 모든 프로토타입의 프로퍼티 중에서 프로퍼티 어트리뷰트[[Enumerable]]의 값이 true인 프로퍼티를 순회하며 열거한다.

```jsx
const person = {
	name: 'Lee',
	address: 'Seoul',
	__proto__: {age : 20}
};

for(const key in person){
	console.log(key+ ':' + person[key]);
}
//name : Lee
//address : seoul
//age : 20
```

- for…in 문은 프로퍼티를 열거할 때 순서를 보장하지 않는다. 하지만 대부분의 모던 브라우저는 순서를 보장하고 숫자인 프로퍼티 키에 대해서는 정렬을 실시함.

### 14.2 **Object.keys/values/entries 메서드**

- 객체 자신의 고유 프로퍼티만 열거하기 위해 사용

# 20. strict mode

## 1. strict mode란?

- 자바스크립트 언어의 문법을 좀 더 엄격히 적용하여 오류를 발생시킬 가능성이 높거나 자바스크립트 엔진의 최적화 작업에 문제를 일으킬 수 있는 코드에 대해 명시적인 에러를 발생시킴.
- ESLint와 같은 린트 도구를 사용하여 유사한 효과를 얻을 수 있음.

## 2.strict mode의 적용

- 전역의 선두에 ‘use strict’;를 추가하면 스크립트 전체에 strict mode가 적용됨
- 함수 몸체의 선두에 추가하면 해당 함수와 중첩 함수에 strict mode가 적용됨
- 코드의 선두에  ‘use strict’;를 위치시키지 않으면 strict mode가 제대로 동작하지 않음.

## 3. 전역에 strict mode를 적용하는 것은 피하자

- strict mode 스크립트와 non-strict mode스크립트를 혼용하는 것은 오류를 발생시킬 수 있다.
- 실행함수로 스크립트 전체를 감싸서 스코프를 구분하고 즉시 실행 함수의 선두에 stirct mode적용.

## 4. 함수 단위로 strict mode를 적용하는 것도 피하자

- 어떤 함수에만 strict mode를 적용하는 것은 바람직하지 않고 일일히 srtict mode를 추가하는 것은 비효율적이므로 즉시 실행함수로 감싼 스크립트 단위로 적용해야함.

## 5. strict mode가 발생시키는 에러

### 5.1 암묵적 전역

- 선언하지 않은 변수를 참조하면 ReferenceError 발생

### 5.2 변수, 함수, 매개변수의 삭제

- delete 연산자로 변수, 함수,매개변수를 삭제하면 SyntaxError발생

### 5.3 매개변수 이름의 중복

- 중복된 매개변수 이름을 사용하면 SyntaxError 발생

### 5.4 with 문의 사용

- with 문을 사용하면 SyntaxError발생

## 6. strict mode 적용에 의한 변화

### 6.1 일반 함수의 this

- stirct mode에서 함수를 일반 함수로서 호출하면 this에 undefined가 바인딩 됨.

### 6.2 arguments 객체

- strict mode에서는 매개변수에 전달된 인수를 재할당해 변경해도 arguments객체에 반영되지 않음.

# 느낀점

업무에서 실제로 사용해본적이 없어 와닿지 않고 어렵게 느껴졌습니다. 그리고 특정 단어들이 계속 반복되는데 이게 섞이고 헷갈려서 읽는데 좀 힘들었습니다. 어렵게 느껴져서 유튜브에서 강의를 찾아봤는데 코딩애플씨의 영상이 핵심을 짧게 정리해줘서 갈피를 잡는데 도움이 된 것 같습니다.
https://youtu.be/wUgmzvExL_E?si=YRIudbhMxuZg_aJb
