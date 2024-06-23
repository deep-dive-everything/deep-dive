## 19장 프로토타입

- 자바스크립트는 명령형, 함수형, 프로토타입 기반 객체지향 프로그래밍을 지원하는 **멀티 패러다임 프로그래밍 언어**다.
- 자바스크립트는 객체 기반의 프로그래밍 언어이며 **자바스크립트를 이루고 있는 거의 "모든 것"이 객체**다.

### 19.1 객체지향 프로그래밍

> [!NOTE]
> 객체지향 프로그래밍은 프로그램을 명령어 또는 함수의 목록으로 보는 전통적인 명령형 프로그래밍의 절차지향적 관점에서 벗어나 여러 개의 독립적 단위, 즉 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임을 말한다.

- 객체의 다양한 속성 중에서 프로그램에 필요한 속성만 간추려 내어 표현하는 것을 **추상화**라고 한다.
- 객체는 **상태 데이터와 동작을 하나의 논리적인 단위로 묶은 복합적인 자료구조**라고 할 수 있다.
- 이때 객체의 상태 데이터를 **프로퍼티**, 동작을 **메서드**라 부른다.
- 객체는 자신의 고유한 기능을 수행하면서 다른 객체와 **관계성**을 가질 수 있다.
- **다른 객체와 메시지를 주고받거나 데이터를 처리**할 수 있으며, 다른 객체의 상태 데이터나 동작을 **상속**받아 사용하기도 한다.

### 19.2 상속과 프로토타입

- 상속은 객체지향 프로그래밍의 핵심 개념으로, 어떤 객체의 프로퍼티 또는 메서드를 다른 객체를 상속받아 그대로 사용할 수 있는 것을 말한다.
- 자바스크립트는 프로토타입을 기반으로 상속을 구현하여 불필요한 중복을 제거한다.
- 생성자 함수에서 메서드를 작성한 경우 동일한 동작을 하는 메서드라고 하더라도 메서드를 중복 생성하고 모든 인스턴스가 중복 소유한다.
- 동일한 동작을 하는 메서드라면 하나만 생성하여 모든 인스턴스가 공유해서 사용하는 것이 바람직하다.

```js
function Circle(radius) {
  this.radius = radius
  this.getArea = function () {
    return Math.PI * this.radius ** 2
  }
}

const circle1 = new Circle(1)
const circle2 = new Circle(2)

console.log(circle1.getArea === circle2.getArea) // false

console.log(circle1.getArea()) // 3.141592653589793
console.log(circle2.getArea()) // 12.566370614359172
```

- 동일한 동작을 하는 메서드를 프로토타입에 추가하면 메서드를 공유해서 사용할 수 있다.
- 즉, 동일한 생성자 함수에서 생성하는 모든 인스턴스는 동일한 동작을 하는 하나의 메서드를 공유하게 된다.

```js
function Circle(radius) {
  this.radius = radius
}

Circle.prototype.getArea = function () {
  return Math.PI * this.radius ** 2
}

const circle1 = new Circle(1)
const circle2 = new Circle(2)

console.log(circle1.getArea === circle2.getArea) // true

console.log(circle1.getArea()) // 3.141592653589793
console.log(circle2.getArea()) // 12.566370614359172
```

- 상속은 코드의 재사용이란 관점에서 매우 유용하다.
- 생성자 함수가 생성할 모든 인스턴스는 별도의 구현 없이 상위(부모) 객체인 프로토타입의 자산을 공유하여 사용할 수 있다.

### 19.3 프로토타입 객체

- 프로토타입 객체란 객체지향 프로그래밍의 근간을 이루는 객체 간 상속을 구현하기 위해 사용된다.
- 프로토타입은 어떤 객체의 상위(부모) 객체의 역할을 하는 객체로서 다른 객체에 공유 프로퍼티(메서드 포함)를 제공한다.
- 프로토타입을 상속받은 하위(자식) 객체는 상위 객체의 프로퍼티를 자신의 프로퍼티처럼 자유롭게 사용할 수 있다.
- 모든 객체는 [[Prototype]]이라는 내부 슬롯을 가지며, 이 내부 슬롯의 값은 프로토타입의 참조다.
- 즉, 객체가 생성될 때 객체 생성 방식에 따라 프로토타입이 결정되고 [[Prototype]]에 저장된다.
- 모든 객체는 하나의 프로토타입을 갖는다. 그리고 모든 프로토타입은 생성자 함수와 연결되어 있다.
- \_\_proto\_\_ 접근자 프로토타입을 통해 자신의 프로토타입, 즉 자신의 [[Prototype]] 내부 슬롯이 가리키는 프로토타입에 접근할 수 있다.
- 프로토타입은 자신의 constructor 프로퍼티를 통해 생성자 함수에 접근할 수 있고, 생성자 함수는 자신의 prototype 프로퍼티를 통해 프로토타입에 접근할 수 있다.

#### 19.3.1 \_\_proto\_\_ 접근자 프로퍼티

> [!NOTE] > **모든 객체는 \_\_proto\_\_ 접근자 프로퍼티를 통해 자신의 프로토타입, 즉 [[Prototype]] 내부 슬롯에 간접적으로 접근할 수 있다.**

##### \_\_proto\_\_는 접근자 프로퍼티다.

- 내부 슬롯은 프로퍼티가 아니다.
- [[Prototype]] 내부 슬롯은 직접 접근할 수 없으며, \_\_proto\_\_ 접근자 프로퍼티를 통해 간접적으로 [[Prototype]] 내부 슬롯의 값, 즉 프로토타입에 접근할 수 있다.
- Object.prototype의 접근자 프로퍼티인 \_\_proto\_\_는 getter/setter 함수라고 부르는 접근자 함수([[Get]], [[Set]] 프로퍼티 어트리뷰트에 할당된 함수)를 통해 [[Prototype]] 내부 슬롯의 값, 즉 프로토타입을 취득하거나 할당한다.

##### \_\_proto\_\_는 접근자 프로퍼티는 상속을 통해 사용된다.

- \_\_proto\_\_ 접근자 프로퍼티는 객체가 직접 소유하는 프로퍼티가 아니라 Object.prototype의 프로퍼티다.
- 모든 객체는 **상속**을 통해 `Object.prototype.__prototype__` 접근자 프로퍼티를 사용할 수 있다.

##### \_\_proto\_\_ 접근자 프로퍼티를 통해 프로토타입에 접근하는 이유

- 상호 참조에 의해 프로토타입이 체인이 생성되는 것을 방지하기 위해서다.
- 프로토타입 체인은 단방향 링크드 리스트로 구현되어야 한다. 즉, 프로퍼티 검색 방향이 한쪽 방향으로만 흘러가야 한다.
- 하지만 순환 참조하는 프로토타입 체인이 만들어지면 프로토타입 체인 종점이 존재하지 않기 때문에 프로토타입 체인에서 프로퍼티를 검색할 때 무한 루프에 빠진다.
- 따라서 아무런 체크 없이 무조건적으로 프로토타입을 교체할 수 없도록 \_\_proto\_\_ 접근자 프로퍼티를 통해 프로토타입에 접근하고 교체하도록 구현되어 있다.

##### \_\_proto\_\_ 접근자 프로퍼티를 코드 내에서 직접 사용하는 것은 권장하지 않는다.

- 모든 객체가 \_\_proto\_\_ 접근자 프로퍼티를 사용할 수 있는 것은 아니기 때문에 권장하지 않는다.
- 만약 프로토타입의 참조를 취득하고 싶은 경우에는 `Object.getPrototypeOf` 메서드를 사용하고, 프로토타입을 교체하고 싶은 경우에는 `Object.setPrototypeOf` 메서드를 사용할 것을 권장한다.

#### 19.3.2 함수 객체의 prototype 프로퍼티

- 함수 객체만이 소유하는 prototype 프로퍼티는 생성자 함수가 생성할 인스턴스의 프로토타입을 가리킨다.
- 따라서 생성자 함수로서 호출할 수 없는 함수, 즉 non-constructor인 화살표 함수와 ES6 메서드 축약 표현으로 정의한 메서드는 prototype 프로퍼티를 소유하지 않으며 프로토타입도 생성하지 않는다.

```js
const Person = name => {
  this.name = name
}

console.log(Person.hasOwnProperty('prototype')) // false
console.log(Person.prototype) // undefined

const obj = {
  foo() {},
}

console.log(obj.foo.hasOwnProperty('prototype')) // false
console.log(obj.foo.prototype) // undefined
```

- 모든 객체가 가지고 있는(엄밀히 말하면 Object.prototype으로부터 상속받은) \_\_proto\_\_ 접근자 프로퍼티와 함수 객체만이 가지고 있는 prototype 프로퍼티는 결국 동일한 프로토타입을 가리킨다. 하지만 이들 프로퍼티를 사용하는 주체가 다르다.

| 구분                          | 소유        | 값                | 사용 주체   | 사용 목적                                                               |
| ----------------------------- | ----------- | ----------------- | ----------- | ----------------------------------------------------------------------- |
| \_\_proto\_\_ 접근자 프로퍼티 | 모든 객체   | 프로토타입의 참조 | 모든 객체   | 객체가 자신의 프로토타입에 접근 또는 교체하기 위해 사용                 |
| prototype 프로퍼티            | constructor | 프로토타입의 참조 | 생성자 함수 | 생성자 함수가 자신이 생성할 객체(인스턴스)의 프로토타입을 할당하기 위해 |

#### 19.3.3 프로토타입의 constructor 프로퍼티와 생성자 함수

- 모든 프로토타입은 constructor 프로퍼티를 갖는다.
- constructor 프로퍼티는 prototype 프로퍼티로 자신을 참조하고 있는 생성자 함수를 가리킨다.
- 이 연결은 생성자 함수가 생성될 때, 즉 함수 객체가 생성될 때 이뤄진다.

```js
function Person(name) {
  this.name = name
}

const me = new Person('Lee')
console.log(me.constructor === Person) // true
```

- `me` 객체에는 constructor 프로퍼티가 없지만 `me` 객체의 프로토타입인 `Person.prototype`에는 constructor 프로퍼티가 있다.
- 따라서 `me` 객체는 프로토타입인 `Person.prototype`의 constructor 프로퍼티를 상속받아 사용할 수 있다.

### 19.4 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입

- 리터럴 표기법에 의해 생성된 객체도 프로토타입이 존재한다.
- 하지만 리터럴 표기법에 의해 생성된 객체의 경우 constructor 프로퍼티가 가리키는 생성자 함수가 반드시 객체를 생성한 생성자 함수라고 단정할 수는 없다.

```javascript
const obj = {}

console.log(obj.constructor === Object) // true
```

- Object 생성자 함수에 인수를 전달하지 않거나 undefined 또는 null을 인수로 전달하면서 호출하면 내부적으로는 추상 연산 OrdinaryObjectCreate를 호출하여 Object.prototype을 프로토타입으로 갖는 빈 객체를 생성한다.
- 객체 리터럴이 평가될 때는 추상 연산 OrdinaryObjectCreate를 호출하여 빈 객체를 생성하고 프로퍼티를 추가하도록 정의되어 있다.
- 객체 리터럴에 의해 생성된 객체는 `new.target`의 확인이나 프로퍼티를 추가하는 처리 등 세부 내용이 다르므로 Object 생성자 함수가 생성한 객체가 아니다.
- 하지만 리터럴 표기법에 의해 생성된 객체도 상속을 위해 프로토타입이 필요하다.
- 따라서 리터럴 표기법에 의해 생성된 객체도 가상적인 생성자 함수를 갖는다. 프로토타입은 생성자 함수와 더불어 생성되며 prototype.constructor 프로퍼티에 의해 연결되어 있기 때문이다.
- 이는 프로토타입과 생성자 함수는 단독으로 존재할 수 없고 언제나 쌍으로 존재한다는 것을 의미한다.
- 리터럴에 의해 생성한 객체나 함수가 생성자 함수에 의해 생성한 객체나 함수와 미묘한 차이는 있지만 결국 객체 혹은 함수로서 동일한 특성을 갖는다.

##### 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입

| 리터럴 표기법      | 생성자 함수 | 프로토타입         |
| ------------------ | ----------- | ------------------ |
| 객체 리터럴        | Object      | Object.prototype   |
| 함수 리터럴        | Function    | Function.prototype |
| 배열 리터럴        | Array       | Array.prototype    |
| 정규 표현식 리터럴 | RegExp      | RegExp.prototype   |

### 19.5 프로토타입의 생성 시점

- **프로토타입은 생성자 함수가 생성될 때 더불어 생성된다.**
- 생성자 함수는 사용자가 직접 정의한 사용자 정의 생성자 함수와 자바스크립트가 기본 제공하는 빌트인 생성자 함수로 구분할 수 있다.

#### 19.5.1 사용자 정의 생성자 함수와 프로토타입 생성 시점

- 생성자 함수로서 호출할 수 있는 함수, 즉 constructor는 함수 정의가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성된다.

```js
console.log(Person.prototype) // {constructor: ƒ}

function Person(name) {
  this.name = name
}
```

- 생성자 함수로서 호출할 수 없는 함수, 즉 non-constructor는 프로토타입이 생성되지 않는다.

```js
const Person = name => {
  this.name = name
}

console.log(Person.prototype) // undefined
```

- 사용자 정의 생성자 함수는 자신이 평가되어 함수 객체로 생성되는 시점에 프로토타입도 더불어 생성되며, 생성된 프로토타입의 프로토타입은 언제나 Object.prototype이다.

#### 19.5.2 빌트인 생성자 함수와 프로토타입 생성 시점

- 빌트인 생성자 함수도 일반 함수와 마찬가지로 생성자 함수가 생성되는 시점에 프로토타입이 생성된다.
- 모든 빌트인 생성자 함수는 전역 객체가 생성되는 시점에 생성된다.
- 생성된 프로토타입은 빌트인 생성자 함수의 prototype 프로토타입에 바인딩된다.

> [!NOTE]
> 이처럼 객체가 생성되기 이전에 생성자 함수와 프로토타입은 이미 객체화되어 존재한다.
> 이후 생성자 함수 또는 리터럴 표기법으로 객체를 생성하면 프로토타입은 생성된 객체의 [[Prototype]] 내부 슬롯에 할당된다.
>
> 이로써 생성된 객체는 프로토타입을 상속받는다.

### 19.6 객체 생성 방식과 프로토타입의 결정

- 객체 생성 방식에는 객체 리터럴, Object 생성자 함수, 생성자 함수, `Object.create` 메서드, 클래스가 있다.
- 이처럼 다양한 방식으로 생성된 모든 객체는 미묘한 차이는 있으나 추상 연산 OrdinaryObjectCreate에 의해 생성된다는 공통점이 있다.
- 프로토타입은 추상 연산 OrdinaryObjectCreate에 전달되는 인수에 의해 결정되며, 이 인수는 객체가 생성되는 시점에 객체 생성 방식에 의해 결정된다.

#### 19.6.1 객체 리터럴에 의해 생성된 객체의 프로토타입

- 자바스트립트 엔진은 객체 리터럴을 평가하여 객체를 생성할 때 추상 연산 OrdinaryObjectCreate를 호출한다.
- 이때 추상 연산 OrdinaryObjectCreate에 전달되는 프로토타입은 Object.prototype이다.
- 즉, 객체 리터럴에 의해 생성되는 객체의 프로토타입은 Object.prototype이다.

```js
const obj = { x: 1 }

// 객체 리터럴에 의해 생성된 obj 객체는 Object.prototype을 상속받는다.
console.log(obj.constructor === Object) // true
console.log(obj.hasOwnProperty('x')) // true
```

#### 19.6.2 Object 생성자 함수에 의해 생성된 객체의 프로토타입

- Object 생성자 함수를 인수 없이 호출하면 빈 객체가 생성되며, Object 생성자 함수를 호출하면 객체 리터럴과 마찬가지로 추상 연산 OrdinaryObjectCreate가 호출된다.
- 이때 추상 연산 OrdinaryObjectCreate에 전달되는 프로토타입은 Object.prototype이다.
- 즉, Object 생성자 함수에 의해 생성되는 객체의 프로토타입은 Object.prototype이다.

```js
const obj = new Object()
obj.x = 1

// Object 생성자 함수에 의해 생성된 obj 객체는 Object.prototype을 상속받는다.
console.log(obj.constructor === Object) // true
console.log(obj.hasOwnProperty('x')) // true
```

- 객체 리터럴과 Object 생성자 함수에 의한 객체 생성 방식의 차이는 프로퍼티를 추가하는 방식에 있다.
- 객체 리터럴 방식은 객체 리터럴 내부에 프로퍼티를 추가하지만 Object 생성자 함수 방식은 일단 빈 객체를 생성한 이후 프로퍼티를 추가해야 한다.

#### 19.6.3 생성자 함수에 의해 생성된 객체의 프로토타입

- new 연산자와 함께 생성자 함수를 호출하여 인스턴스를 생성하면 다른 객체 생성 방식과 마찬가지로 추상 연산 OrdinaryObjectCreate가 호출된다.
- 이때 추상 연산 OrdinaryObjectCreate에 전달되는 프로토타입은 생성자 함수의 prototype 프로퍼티에 바인딩되어 있는 객체다.
- 즉, 생성자 함수에 의해 생성되는 객체의 프로토타입은 생성자 함수의 prototype 프로퍼티에 바인딩되어 있는 객체다.

```js
function Person(name) {
  this.name = name
}

Person.prototype.sayHello = function () {
  console.log(`Hi! My name is ${this.name}`)
}

const me = new Person('Lee')
const you = new Person('Kim')

me.sayHello() // Hi! My name is Lee
you.sayHello() // Hi! My name is Kim
```

- 생성자 함수를 통해 생성된 모든 객체는 프로토타입의 메서드를 상속받아 자신의 메서드처럼 사용할 수 있다.
- 프로토타입에 프로퍼티를 추가하면 해당 프로퍼티를 하위(자식) 객체가 상속받을 수 있다.
- 프로토타입은 객체이므로 일반 객체와 같이 프로퍼티를 추가/삭제할 수 있다. 이렇게 추가/삭제된 프로퍼티를 프로토타입 체인에 즉각 반영된다.

### 19.7 프로토타입 체인

- 자바스크립트는 객체의 프로퍼티(메서드 포함)에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면 [[Prototype]] 내부 슬롯의 참조를 따라 자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색한다. 이를 프로토타입 체인이라 한다.
- 프로토타입 체인은 자바스크립트가 객체지향 프로그래밍의 상속을 구현하는 매커니즘이다.
- 프로토타입 체인의 최상위에 위치하는 객체는 언제나 Object.prototype이다. 따라서 모든 객체는 Object.prototype을 상속받는다.
- **Object.prototype을 프로토타입 체인의 종(end of prototype chain)이라 한다.**
- Ojbect.prototype의 프로토타입, 즉 [[Prototype]] 내부 슬롯의 값은 null이다.
- 프로토타입 체인의 종점인 Ojbect.prototype에서도 프로퍼티를 검색할 수 없는 경우 undefined를 반환한다. 이때 에러는 발생하지 않는다.

```js
function Person(name) {
  this.name = name
}

Person.prototype.sayHello = function () {
  console.log(`Hi! My name is ${this.name}`)
}

const me = new Person('Lee')

console.log(me.hasOwnProperty('name')) // true
console.log(me.foo) // undefined
```

- 프로토타입 체인은 상속과 프로퍼티 검색을 위한 메커니즘이고, 스코프 체인은 식별자 검색을 위한 메커니즘이다.
- 스코프 체인과 프로토타입 체인은 서로 연관없이 별도로 동작하는 것이 아니라 서로 협력하여 식별자와 프로퍼티를 검색하는 데 사용된다.

### 19.8 오버라이딩과 프로퍼티 섀도잉

- 프로토타입이 소유한 프로퍼티(메서드 포함)을 프로토타입 프로퍼티, 인스턴스가 소유한 프로퍼티를 인스턴스 프로퍼티라고 한다.
- 프로토타입 프로퍼티와 같은 이름의 프로퍼티를 인스턴스에 추가하면 프로토타입 체인을 따라 프로토타입 프로퍼티를 검색하여 프로토타입 프로퍼티를 덮어쓰는 것이 아니라 인스턴스 프로퍼티로 추가한다.
- 이처럼 상속 관계에 의해 프로퍼티가 가려지는 현상을 **프로퍼티 섀도잉(property shadowing)**이라 한다.
- 하위 객체를 통해 프로토타입에 get 액세스는 허용되나 set 액세스는 허용되지 않는다.
- 프로토타입 프로퍼티를 변경 또는 삭제하려면 하위 객체를 통해 프로토타입 체인으로 접근하는 것이 아니라 프로토타입에 직접 접근해야 한다.

### 19.9 프로토타입의 교체

- 객체의 프로토타입은 임의의 객체로 교체할 수 있다.
- 이것은 부모 객체인 프로토타입을 동적으로 변경할 수 있다는 것을 의미하며, 이러한 특징을 활용하여 객체 간의 상속 관계를 동적으로 변경할 수 있다.
- 프로토타입은 생성자 함수 또는 인스턴스에 의해 교체할 수 있다.

#### 19.9.1 생성자 함수에 의한 프로토타입의 교체

```js
const Person = (function () {
  function Person(name) {
    this.name = name
  }

  // 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
  Person.prototype = {
    sayHello() {
      console.log(`Hi! My name is ${this.name}`)
    },
  }

  return Person
})()

const me = new Person('Lee')

console.log(me.constructor === Person) // false
console.log(me.constructor === Object) // true
```

- 프로토타입으로 교체한 객체 리터럴에는 constructor 프로퍼티가 없다.
- 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수간의 연결이 파괴된다.
- 파괴된 constructor 프로퍼티와 생성자 함수 간의 연결을 되살리려면 프로토타입으로 교체한 객체 리터럴에 constructor 프로퍼티를 추가해야 한다.

```js
const Person = (function () {
  function Person(name) {
    this.name = name
  }

  // 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
  Person.prototype = {
    // constructor 프로퍼티와 생성자 함수 간의 연결을 설정
    constructor: Person,
    sayHello() {
      console.log(`Hi! My name is ${this.name}`)
    },
  }

  return Person
})()

const me = new Person('Lee')

// constructor 프로퍼티가 생성자 함수를 가리킨다.
console.log(me.constructor === Person) // true
console.log(me.constructor === Object) // false
```

#### 19.9.2 인스턴스에 의한 프로토타입의 교체

- 생성자 함수의 prototype 프로퍼티에 다른 임의의 객체를 바인딩하는 것은 미래에 생성할 인스턴스의 프로토타입을 교체하는 것이다.
- \_\_proto\_\_ 접근자 프로퍼티를 통해 프로토타입을 교체하는 것은 이미 생성된 객체의 프로토타입을 교체하는 것이다.

```js
function Person(name) {
  this.name = name
}

const me = new Person('Lee')

const parent = {
  sayHello() {
    console.log(`Hi! My name is ${this.name}`)
  },
}

// me 객체의 프로토타입을 parent 객체로 교체한다.
Object.setPrototypeOf(me, parent)
// me.__proto__ = parent;

me.sayHello() // Hi! My name is Lee

console.log(me.constructor === Person) // false
console.log(me.constructor === Object) // true
```

- 프로토타입으로 교체한 객체에는 constructor 프로퍼티가 없으므로 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴된다.
- 파괴된 constructor 프로퍼티와 생성자 함수 간의 연결을 되살리려면 프로토타입으로 교체한 객체 리터럴에 constructor 프로퍼티를 추가해야 한다.

```js
function Person(name) {
  this.name = name
}

const me = new Person('Lee')

const parent = {
  // constructor 프로퍼티와 생성자 함수 간의 연결을 설정
  constructor: Person,
  sayHello() {
    console.log(`Hi! My name is ${this.name}`)
  },
}

// 생성자 함수의 prototype 프로퍼티와 프로토타입 간의 연결을 설정
Person.prototype = parent
Object.setPrototypeOf(me, parent)

me.sayHello() // Hi! My name is Lee

console.log(me.constructor === Person) // true
console.log(me.constructor === Object) // false
console.log(Person.prototype === Object.getPrototypeOf(me)) // true
```

- 프로토타입 교체를 통해 객체 간의 상속 관계를 동적으로 변경하는 것은 꽤나 번거롭다. 따라서 프로토타입은 직접 교체하지 않는 것이 좋다.
- 상속 관계를 인위적으로 설정하려면 직접 상속이 더 편리하고 안전하다.
- ES6에 도입된 클래스를 사용하면 간편하고 직관적으로 상속 관계를 구현할 수 있다.

### 19.10 instanceof 연산자

- instance 연산자는 이항 연산자로서 좌변에 객체를 가리키는 식별자, 우변에 생성자 함수를 가리키는 식별자를 피연산자로 받는다.
- 만약 우변의 피연산자가 함수가 아닌 경우 TypeError가 발생한다.
- **우변의 생성자 함수의 prototype에 바인딩된 객체가 좌변의 객체의 프로토타입 체인 상에 존재하면 true로 평가되고, 그렇지 않은 경우에는 false로 평가된다.**

```js
객체 instanceof 생성자 함수
```

- instanceof 연산자는 프로토타입의 constructor 프로퍼티가 가리키는 생성자 함수를 찾는 것이 아니라 **생성자 함수의 prototype에 바인딩된 객체가 프로토타입 체인 상에 존재하는지 확인한다.**

```js
function Person(name) {
  this.name = name
}

const me = new Person('Lee')

// 프로토타입의 교체
const parent = {}
Object.setPrototypeOf(me, parent)

// Person 생성자 함수와 parent 객체는 연결되어 있지 않다.
console.log(Person.prototype === parent) // false
console.log(parent.constructor === Person) // false

// parent 객체를 Person 생성자 함수의 prototype 프로퍼티에 바인딩한다.
Person.prototype = parent

// Person.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Person) // true
// Object.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Object) // true
```

- 따라서 생성자 함수에 의해 프로토타입이 교체되어도 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴되어도 생성자 함수의 prototype 프로퍼티와 프로토타입 간의 연결은 파괴되지 않으므로 instanceof는 아무런 영향을 받지 않는다.

```js
const Person = (function () {
  function Person(name) {
    this.name = name
  }

  // 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
  Person.prototype = {
    sayHello() {
      console.log(`Hi! My name is ${this.name}`)
    },
  }

  return Person
})()

const me = new Person('Lee')

// constructor 프로퍼티와 생성자 함수 간의 연결은 파괴되어도 instanceof는 아무런 영향을 받지 않는다.
console.log(me.constructor === Person) // false

// Person.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Person) // true
// Object.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true로 평가된다.
console.log(me instanceof Object) // true
```

### 19.11 직접 상속

#### 19.11.1 Object.create에 의한 직접 상속

- Object.create 메서드는 명시적으로 프로토타입을 지정하여 새로운 객체를 생성한다.
- 다른 객체 생성 방식과 마찬가지로 추상 연산 OrdinaryObjectCreate를 호출한다.

```js
/**
 * 지정된 프로토타입 및 프로퍼티를 갖는 새로운 객체를 생성하여 반환한다.
 * @param {Object} prototype - 생성할 객체의 프로토타입으로 지정할 객체
 * @param {Object} [propertiesObject] - 생성할 객체의 프로퍼티를 갖는 객체
 * @returns {Object} 지정된 프로토타입 및 프로퍼티를 갖는 새로운 객체
 */
```

- `Object.create` 메서드는 첫 번째 매개변수에 전달한 객체의 프로토타입 체인에 속하는 객체를 생성한다. 즉, 객체를 생성하면서 직접적으로 상속을 구현한다.
- `Ojbect.create` 메서드의 장점
  - new 연산자가 없어도 객체를 생성할 수 있다.
  - 프로토타입을 지정하면서 객체를 생성할 수 있다
  - 객체 리터럴에 의해 생성된 객체도 상속받을 수 있다.

```js
let obj = Object.create(null)
console.log(Object.getPrototypeOf(obj) === null) // true
console.log(obj.toString()) // TypeError: obj.toString is not a function

obj = Object.create(Object.prototype) // obj = {}
console.log(Object.getPrototypeOf(obj) === Object.prototype) // true

obj = Object.create(Object.prototype, {
  x: { value: 1, writable: true, enumerable: true, configurable: true },
})
console.log(obj.x) // 1
console.log(Object.getPrototypeOf(obj) === Object.prototype) // true

const myProto = { x: 10 }
obj = Object.create(myProto)
console.log(obj.x) // 10
console.log(Object.getPrototypeOf(obj) === myProto) // true

function Person(name) {
  this.name = name
}

obj = Object.create(Person.prototype)
obj.name = 'Lee'
console.log(obj.name) // Lee
console.log(Object.getPrototypeOf(obj) === Person.prototype) // true
```

- Object.prototype의 빌트인 메서드는 모든 객체의 프로토타입 체인의 종점, 즉 Obejct.prototype의 메서드이므로 모든 객체가 상속받아 호출할 수 있다.
- ESLint에서는 Object.prototype의 빌트인 메서드를 객체가 직접 호출하는 것을 권장하지 않는다.
- Ojbect.create 메서드를 통해 프로토타입이 null인 객체, 즉 프로토타입 체인의 종점에 위치하는 객체를 생성할 수 있기 때문이다.

```js
const obj = Object.create(null)
obj.a = 1

console.log(Object.getPrototypeOf(obj) === null) // true
console.log(obj.hasOwnProperty('a')) // TypeError: obj.hasOwnProperty is not a function
```

- 따라서 이 같은 에러를 발생시킬 위험을 없애기 위해 Object.prototype의 빌트인 메서드는 간접적으로 호출하는 것이 좋다.

```js
const obj = Object.create(null)
obj.a = 1

console.log(Object.prototype.hasOwnProperty.call(obj, 'a')) // true
```

#### 19.11.2 객체 리터럴 내부에서 \_\_proto\_\_에 의한 직접 상속

- 객체 리터럴 내부에서 **proto** 접근자 프로퍼티를 사용하여 직접 상속을 구현할 수 있다. (ES6)

```js
const myProto = { x: 10 }

const obj = {
  y: 20,
  __proto__: myProto,
}

/* 
const obj = Object.create(myProto, {
  y: { value: 20, writable: true, enumerable: true, configurable: true }
});
*/

console.log(obj.x, obj.y) // 10 20
console.log(Object.getPrototypeOf(obj) === myProto) // true
```

### 19.12 정적 프로퍼티/메서드

> [!NOTE]
> 정적 프로퍼티/메서드는 생성자 함수로 인스턴스를 생성하지 않아도 참조/호출할 수 있는 프로퍼티/메서드를 말한다.

- 정적 프로퍼티/메서드는 생성자 함수가 생성한 인스턴스로 참조/호출할 수 없다.
- 정적 프로퍼티/메서드는 인스턴스의 프로토타입 체인에 속한 객체의 프로퍼티/메서드가 아니므로 인스턴스로 접근할 수 없다.

```js
// Object.create - 정적 메서드
const obj = Object.create({ name: 'Lee' })

// Object.prototype.hasOwnProperty - 프로토타입 메서드
obj.hasOwnProperty('name') // -> false
```

- 만약 인스턴스/프로토타입 메서드 내에서 this를 사용하지 않는다면 그 메서드는 정적 메서드로 변경할 수 있다.
- 프로퍼티 메서드를 호출하려면 인스턴스를 생성해야 하지만 정적 메서드는 인스턴스를 생성하지 않아도 호출할 수 있다.

```js
function Foo() {}

Foo.prototype.x = function () {
  console.log('x')
}

const foo = new Foo()
foo.x() // x

Foo.x = function () {
  console.log('x')
}

Foo.x() // x
```

- MDN 문서에서는 정적 프로퍼티/메서드와 프로토타입 프로퍼티/메서드를 구분하여 소개하고 있다.
- 따라서 표기법만으로도 정적 프로퍼티/메서드와 프로토타입 프로퍼티/메서드를 구별할 수 있어야 한다.
- 참고로 프로토타입 프로퍼티/메서드를 표기할 때 prototype을 #으로 표기하는 경우도 있다.
  - `Object.prototype.isPrototypeOf` -> `Object#isPrototypeOf`

### 19.13 프로퍼티 존재 확인

#### 19.13.1 in 연산자

- in 연산자는 객체 내에 특정 프로퍼티가 존재하는 여부를 확인한다.

```js
const person = {
  name: 'Lee',
  address: 'Seoul',
}

console.log('name' in person) // true
console.log('address' in person) // true
console.log('age' in person) // false
```

- in 연산자는 확인 대상 객체의 프로퍼티뿐만 아니라 확인 대상 객체가 상속받은 모든 프로토타입의 프로퍼티를 확인하므로 주의가 필요하다.
- 이는 in 연산자가 확인 대상 객체가 속한 프로토타입 체인 상에 존재하는 모든 프로토타입에서 해당 프로퍼티를 검색했기 때문이다.

```js
console.log('toString' in person) // true
```

- in 연산자 대신 ES6에서 도입된 Reflect.has 메서드를 사용할 수도 있다.

```js
const person = { name: 'Lee' }

console.log(Reflect.has(person, 'name')) // true
console.log(Reflect.has(person, 'toString')) // true
```

#### 19.13.2 Object.prototype.hasOwnProperty 메서드

- `Object.prototype.hasOwnProperty` 메서드는 인수로 전달받은 프로퍼티 키가 객체 고유의 프로퍼티 키인 경우에만 true를 반환하고 상속받은 프로토타입의 프로퍼티 키인 경우 false를 반환한다.

```js
console.log(person.hasOwnProperty('name')) // true
console.log(person.hasOwnProperty('age')) // false
console.log(person.hasOwnProperty('toString')) // false
```

### 19.14 프로퍼티 열거

#### 19.14.1 for...in 문

- 객체의 모든 프로퍼티를 순회하며 *열거*하려면 for...in 문을 사용한다.

```js
for (변수선언문 in 객체) { ... }
```

- for...in 문은 객체의 프로퍼티 개수만큼 순회하며 for...in 문의 변수 선언문에서 선언한 변수에 프로퍼티 키를 할당한다.

```js
const person = {
  name: 'Lee',
  address: 'Seoul',
}

// for...in 문의 변수 key에 person 객체의 프로퍼티 키가 할당된다.
for (const key in person) {
  console.log(key + ': ' + person[key])
}
// name: Lee
// address: Seoul
```

- for...in 문은 in 연산자처럼 순회 대상 객체의 프로퍼티뿐만 아니라 상속받은 프로토타입의 프로퍼티까지 열거한다.
- for...in 문은 객체의 프로토타입 체인 상에 존재하는 모든 프로토타입의 프로퍼티 중에서 프로퍼티 어트리뷰트 [[Enumerable]]의 값이 true인 프로퍼티를 순회하며 열거한다.

```js
const person = {
  name: 'Lee',
  address: 'Seoul',
  __proto__: { age: 20 },
}

console.log('toString' in person) // true

for (const key in person) {
  console.log(key + ': ' + person[key])
}
// name: Lee
// address: Seoul
// age: 20
```

- for...in 문은 프로퍼티 키가 심벌인 프로퍼티는 열거하지 않는다.

```js
const sym = Symbol()
const obj = {
  a: 1,
  [sym]: 10,
}

for (const key in obj) {
  console.log(key + ': ' + obj[key])
}
// a: 1
```

- 상속받은 프로퍼티는 제외하고 객체 자신의 프로퍼티만 열거하려면 Object.prototype.hasOwnProperty 메서드를 사용하여 객체 자신의 프로퍼티인지 확인해야 한다.
- for...in 문은 프로퍼티를 열거할 때 순서를 보장하지 않는다. 하지만 대부분의 모던 브라우저는 순서를 보장하고 숫자(사실은 문자열)인 프로퍼티 키에 대해서는 정렬을 실시한다.
- 배열에는 for...in 문을 사용하지 말고 일반적인 for 문이나 for...of 문 또는 `Array.prototype.forEach` 메서드를 사용하기를 권장한다.
- 사실은 배열도 객체이므로 프로퍼티와 상속받은 프로퍼티가 포함될 수 있다.

```js
const arr = [1, 2, 3]
arr.x = 10 // 배열도 객체이므로 프로퍼티를 가질 수 있다.

for (const i in arr) {
  console.log(arr[i]) // 1 2 3 10
}

for (let i = 0; i < arr.length; i++) {
  console.log(arr[i]) // 1 2 3
}

arr.forEach(v => console.log(v)) // 1 2 3

// for...of는 변수 선언문에서 선언한 변수에 키가 아닌 값을 할당한다.
for (const value of arr) {
  console.log(value) // 1 2 3
}
```

#### 19.14.2 Object.keys/values/entries 메서드

```js
const person = {
  name: 'Lee',
  address: 'Seoul',
  __proto__: { age: 20 },
}
```

- `Object.keys` 메서드는 객체 자신의 열거 가능한 프로퍼티 키를 배열로 반환한다.

```js
console.log(Object.keys(person)) // ["name", "address"]
```

- `Object.values` 메서드는 객체 자신의 열거 가능한 프로퍼티 값을 배열로 반환한다.

```js
console.log(Object.values(person)) // ["Lee", "Seoul"]
```

- `Object.entries` 메서드는 객체 자신의 열거 가능한 프로퍼티 키와 값의 쌍의 배열을 배열에 담아 반환한다.

```js
console.log(Object.entries(person)) // [["name", "Lee"], ["address", "Seoul"]]
```

## 20장 strict mode

### 20.1 strict mode란?

```js
function foo() {
  x = 10
}
foo()

console.log(x) // 10
```

- 전역 스코프에도 `x` 변순의 선언이 존재하지 않기 때문에 `ReferenceError`를 발생시킬 것 같지만 자바스크립 엔진은 암묵적으로 전역 객체에 `x` 프로퍼티를 동적 생성한다.
- 이때 전역 객체의 `x` 프로퍼티는 마치 전역 변수처럼 사용할 수 있다. 이러한 현상을 **암묵적 전역**이라 한다.
- 개발자의 의도와는 상관없이 발생한 암묵적 전역은 오류를 발생시키는 원인이 될 가능성이 크다.
- ES5부터 추가된 strict mode는 자바스크립트 언어의 문법을 좀 더 엄격히 적용하여 오류를 발생시킬 가능성이 높거나 자바스크립트 엔진의 최적화 작업에 문제를 일으킬 수 있는 코드에 대해 명시적인 에러를 발생시킨다.
- ESLint 같은 도구는 strict mode가 제한하는 오류는 물론 코딩 컨벤션을 설정 파일 형태로 정의하고 강제할 수 있기 때문에 더욱 강력한 효과를 얻을 수 있다.
- ES6에서 도입된 클래스와 모듈은 기본적으로 strict mode가 적용된다.

### 20.2 strict mode의 적용

- strict mode를 적용하려면 전역의 선두 또는 함수 몸체의 선두에 'use strict'를 추가한다.
- 전역의 선두에 추가하면 스크립트 전체에 strict mode가 적용된다.
- 함수 몸체의 선두에 추가하면 해당 함수와 중첩 함수에 strict mode가 적용된다.
- 코드의 선두에 'use strict'를 위치시키지 않으면 strict mode가 제대로 동작하지 않는다.

### 20.3 전역에 strict mode를 적용하는 것은 피하자

- 전역에 적용한 strict mode는 스크립트 단위로 적용된다.
- 스크립트 단위로 적용된 strict mode는 다른 스크립트에 영향을 주지 않고 해당 스크립트에 한정되어 적용된다.
- 하지만 strict mode 스크립트와 non-strict mode 스크립트를 혼용하는 것은 오류를 발생시킬 수 있다.
- 이러한 경우 즉시 실행 함수로 스크립트 전체를 감싸서 스코프를 구분하고 즉시 실행 함수의 선두에 strict mode를 적용한다.

### 20.4 함수 단위로 strict mode를 적용하는 것도 피하자

- 어떤 함수는 strict mode를 적용하고 어떤 함수는 strict mode를 적용하지 않는 것은 바람직하지 않다.
- 또한 strict mode가 적용된 함수가 참조할 함수 외부의 컨텍스트에 strict mode를 적용하지 않는다면 이 또한 문제가 발생할 수 있다.
- 따라서 strict mode는 즉시 실행 함수로 감싼 스크립트 단위로 적용하는 것이 바람직하다.

### 20.5 strict mode가 발생시키는 에러

#### 1. 암묵적 전역

- 선언하지 않은 변수를 참조하면 `ReferenceError`가 발생한다.

#### 2. 변수, 함수, 매개변수의 삭제

- delete 연산자로 변수, 함수, 매개변수를 삭제하면 `SyntaxError`가 발생한다.

#### 3. 매개변수 이름의 중복

- 중복된 매개변수 이름을 사용하면 `SyntaxError`가 발생한다.

#### 4. with 문의 사용

- with 문을 사용하면 `SyntaxError`가 발생한다.
- with 문은 전달된 객체를 스코프 체인에 추가한다. 이로 인해 코드가 간단해지는 효과가 있지만 성능과 가독성이 나빠지는 문제가 있어 사용하지 않는 것이 좋다.

### 20.6 strict mode 적용에 의한 변화

#### 1. 일반 함수의 this

- strict mode에서 함수를 일반 함수로서 호출하면 this에 undefined가 바인딩된다.
- 생성자 함수가 아닌 일반 함수 내부에서는 thi를 사용할 필요가 없기 때문이다.
- 이때 에러는 발생하지 않는다.

#### 2. arguments 객체

- strict mode에서는 매개변수에 전달된 인수를 재할당하여 변경해도 arguments 객체에 반영되지 않는다.
