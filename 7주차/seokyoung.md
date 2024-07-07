## 25장 클래스

### 25.1 클래스는 프로토타입의 문법적 설탕인가?

- 자바스크립트는 클래스가 필요 없는 프로토타입 기반 객체지향 언어이지만 ES6부터 클래스를 지원한다.
- 자바스크립트의 클래스를 프로토타입 기반 객체 생성 패턴의 단순한 문법적 설탕이라고 보기보다는 **새로운 객체 생성 메커니즘**으로 보는 것이 좀 더 합당하다.
- 클래스와 생성자 함수의 차이점
  - 클래스를 new 연산자 없이 호출하면 에러가 발생한다. 하지만 생성자 함수를 new 연산자 없이 호출하면 일반 함수로서 호출된다.
  - 클래스는 상속을 지원하는 extends와 super 키워드를 제공한다. 하지만 생성자 함수는 extends와 super 키워드를 지원하지 않는다.
  - 클래스는 호이스팅이 발생하지 않는 것처럼 동작한다. 하지만 함수 선언문으로 정의된 생성자 함수는 함수 호이스팅이 발생한다.
  - 클래스 내의 모든 코드에는 암묵적으로 strict mode가 지정되어 실행되며 strict mode를 해제할 수 없다. 하지만 생성자 함수는 암묵적으로 strict mode가 지정되지 않는다.
  - 클래스의 constructor, 프로토타입 메서드, 정적 메서드는 모두 프로퍼티 어트리뷰트 [[Enumerable]]의 값이 false다. 다시 말해, 열거되지 않는다.

### 25.2 클래스 정의

- 클래스는 class 키워드를 사용하여 정의한다.

```js
class Person {}
```

- 일반적이지는 않지만 함수와 마찬가지로 표현식으로 클래스를 정의할 수도 있다.

```js
class Person {}

const Person = class {} // 익명 클래스 표현식
const Person = class MyClass {} // 기명 클래스 표현식
```

- 클래스를 표현식으로 정의할 수 있다는 것은 클래스가 값으로 사용할 수 있는 **일급 객체**라는 것을 의미한다.
- 클래스는 일급 객체로서 다음과 같은 특징을 갖는다.
  - 무명의 리터럴로 생성할 수 있다. 즉, 런타임에 생성이 가능하다.
  - 변수나 자료구조(객체, 배열)에 저장할 수 있다.
  - 함수의 매개변수에게 전달할 수 있다.
  - 함수의 반환값으로 사용할 수 있다.
- 클래스 몸체에는 0개 이상의 메서드만 정의할 수 있다.
- 클래스 몸체에서 정의할 수 있는 메서드
  - constructor(생성자)
  - 프로토타입 메서드
  - 정적 메서드

```js
class Person {
  constructor(name) {
    this.name = name
  }

  sayHi() {
    console.log(`Hi! My name is ${this.name}`)
  }

  static sayHello() {
    console.log('Hello!')
  }
}

const me = new Person('Lee')

console.log(me.name) // Lee
me.sayHi() // Hi! My name is Lee
Person.sayHello() // Hello!
```

### 25.3 클래스 호이스팅

- 클래스는 함수로 평가된다.

```js
class Person {}

console.log(typeof Person) // function
```

- 클래스 선언문으로 정의한 클래스는 함수 선언문과 같이 소스코드 평가 과정, 즉 런타임 이전에 먼저 평가되어 함수 객체를 생성한다.
- 이때 클래스가 평가되어 생성된 함수 객체는 생성자 함수로서 호출할 수 있는 함수, 즉 constructor다.
- 생성자 함수로서 호출할 수 있는 함수는 함수 정의가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성된다. 프로토타입과 생성자 함수는 단독으로 존재할 수 없고 언제나 쌍으로 존재하기 때문이다.
- 단, 클래스는 클래스 정의 이전에 참조할 수 없다.

```js
console.log(Person)
// ReferenceError: Cannot access 'Person' before initialization

class Person {}
```

- 클래스 선언문도 변수 선언, 함수 정의와 마찬가지로 호이스팅이 발생한다.
- 단, 클래스는 let, const 키워드로 선언한 변수처럼 호이스팅된다.
- 따라서 클래스는 선언문 이전에 일시적 사각지대(Temporal Dead Zone; TDZ)에 빠지기 때문에 호이스팅이 발생하지 않는 것처럼 동작한다.

```js
const Person = ''

{
  // 호이스팅이 발생하지 않는다면 ''이 출력되어야 한다.
  console.log(Person)
  // ReferenceError: Cannot access 'Person' before initialization

  class Person {}
}
```

### 25.4 인스터스 생성

- 클래스는 생성자 함수이며 new 연산자와 함께 호출되어 인스턴스를 생성한다.
- 함수와 다르게 클래스는 인스턴스를 생성하는 것이 유일한 존재 이유이므로 반드시 new 연산자와 함께 호출해야 한다.
- 표현식으로 정의된 클래스의 경우 클래스를 가리키는 식별자를 사용해 인스턴스를 생성하지 않고 기명 클래스 표현식의 클래스 이름을 사용해 인스턴스를 생성하면 에러가 발생한다.

```js
const Person = class MyClass {}

const me = new Person()

// 클래스 몸체 내부에서만 유효한 식별자
console.log(MyClass) // ReferenceError: MyClass is not defined

const you = new MyClass() // ReferenceError: MyClass is not defined
```

### 25.5 메서드

- 클래스 몸체에서 정의할 수 있는 메서드는 constructor(생성자), 프로토타입 메서드, 정적 메서드 세 가지가 있다.

#### 25.5.1 constructor

> [!NOTE]
> 인스턴스를 생성하고 초기화하기 위한 특수한 메서드이며 이름을 변경할 수 없다.

- constructor는 메서드로 해석되는 것이 아니라 클래스가 평가되어 생성한 함수 객체 코드의 일부가 된다. 다시 말해, 클래스 정의가 평가되면 constructor의 기술된 동작을 하는 함수 객체가 생성된다.
- constructor는 생성자 함수와 유사하지만 몇 가지 차이가 있다.
  - 클래스 내에 최대 한 개만 존재할 수 있다.
  - 생략할 수 있다. constructor를 생략하면 클래스에 빈 constructor가 암묵적으로 정의된다.
  - 하지만 인스턴스를 초기화하려면 constructor를 생략하면 안된다.
  - 암묵적으로 this, 즉 인스턴스를 반환하기 때문에 별도의 반환문을 갖지 않아야 한다.

#### 25.5.2 프로토타입 메서드

```js
class Person {
  constructor(name) {
    this.name = name
  }

  // 프로토타입 메서드
  sayHi() {
    console.log(`Hi! My name is ${this.name}`)
  }
}

const me = new Person('Lee')
me.sayHi() // Hi! My name is Lee

// me 객체의 프로토타입은 Person.prototype이다.
Object.getPrototypeOf(me) === Person.prototype // -> true
me instanceof Person // -> true

// Person.prototype의 프로토타입은 Object.prototype이다.
Object.getPrototypeOf(Person.prototype) === Object.prototype // -> true
me instanceof Object // -> true

// me 객체의 constructor는 Person 클래스다.
me.constructor === Person // -> true
```

- 클래스 몸체에서 정의한 메서드는 클래스의 prototype 프로퍼티에 메서드를 추가하지 않아도 프로토타입 메서드가 된다.
- 클래스가 생성한 인스턴스는 프로토타입 체인의 일원이 된다.
- 클래스 몸체에서 정의한 메서드는 인스턴스의 프로토타입에 존재하는 프로토타입 메서드가 된다. 인스턴스는 프로토타입 메서드를 상속받아 사용할 수 있다.
- 다시 말해 클래스는 생성자 함수와 마찬가지로 프로토타입 기반의 객체 생성 메커니즘이다.

#### 25.5.3 정적 메서드

- 정적 메서드는 인스턴스를 생성하지 않아도 호출할 수 있는 메서드를 말한다.
- 클래스에서는 메서드에 static 키워드를 붙이면 정적 메서드(클래스 메서드)가 된다.

```js
class Person {
  constructor(name) {
    this.name = name
  }

  // 정적 메서드
  static sayHi() {
    console.log('Hi!')
  }
}

Person.sayHi() // Hi!
```

- 정적 메서드는 클래스에 바인딩된 메서드가 된다.
- 클래스는 클래스 정의(클래스 선언문이나 클래스 표현식)가 평가되는 시점에 함수 객체가 되므로 인스턴스와 달리 별다른 생성 과정이 필요 없다.
- 따라서 정적 메서드는 클래스 정의 이후 인스턴스를 생성하지 않아도 호출할 수 있다.
- 인스턴스 프로토타입 체인 상에는 클래스가 존재하지 않기 때문에 인스턴스로 클래스의 메서드인 정적 메서드를 상속받을 수 없다. 상속받을 수 없으니 인스터스로 호출하는 수도 없다.

```js
const me = new Person('Lee')
me.sayHi() // TypeError: me.sayHi is not a function
```

#### 25.5.4 정적 메서드와 프로토타입 메서드의 차이

1. 정적 메서드와 프로토타입 메서드는 **자신이 속해 있는 프로토타입 체인이 다르다.**
2. **정적 메서드는 클래스로 호출**하고 **프로토타입 메서드는 인스턴스로 호출**한다.
3. **정적 메서드는 인스턴스 프로퍼티를 참조할 수 없지만 프로토타입 메서드는 인스턴스 프로퍼티를 참조할 수 있다.**

- 프로토타입 메서드는 인스턴스로 호출해야 하므로 프로토타입 메서드 내부의 this는 프로토타입 메서드를 호출한 인스턴스를 가리킨다.
- 정적 메서드는 클래스로 호출해야 하므로 정적 메서드 내부의 this는 인스턴스가 아닌 클래스를 가리킨다.
- 즉, 프로토타입 메서드와 정적 메서드 내부의 this 바인딩이 다르다.
- 따라서 메서드 내부에서 인스턴스 프로퍼티를 참조할 필요가 있다면 this를 사용해야 하며, 이러한 경우 프로토타입 메서드로 정의해야 한다.
- 정적 메서드는 애플리케이션 전역에서 사용할 유틸리티 함수를 전역 함수로 정의하지 않고 메서드로 구조화할 때 유용하다.

#### 25.5.5 클래스에서 정의한 메서드의 특징

1. function 키워드를 생략한 **메서드 축약 표현**을 사용할 수 있다.
2. 객체 리터럴과는 다르게 클래스 몸체에 메서드를 추가할 때는 **콤마가 필요 없다.**
3. **암묵적으로 strict mode로 실행된다.**
4. for...in 문이나 Object.keys 메서드 등으로 **열거할 수 없다.** 즉, 프로퍼티의 열거 가능 여부를 나타내며, 불리언 값을 갖는 **프로퍼티 어트리뷰트 [[Enumerable]]의 값이 false다.**
5. 내부 메서드 [[Construct]]를 갖지 않는 non-constructor이다. 따라서 **new 연산자와 함께 호출할 수 없다.**

### 25.6 클래스의 인스턴스 생성 과정

#### 1. 인스턴스 생성과 this 바인딩

- new 연산자와 함께 클래스를 호출하면 constructor 내부 코드가 실행되기에 앞서 암묵적으로 빈 객체가 생성된다.
- 이 빈 객체가 바로 클래스가 생성한 인스턴스다.
- 이때 클래스가 생성한 인스턴스의 프로토타입으로 클래스의 prototype 프로퍼티가 가리키는 객체가 설정된다.
- 생성된 인스턴스는 this에 바인딩된다. 따라서 constructor 내부의 this는 클래스가 생성한 인스턴스를 가리킨다.

#### 2. 인스턴스 초기화

- constructor 내부 코드가 실행되어 this에 바인딩되어 있는 인스턴스를 초기화한다.
- 즉, this에 바인딩 되어 있는 인스턴스에 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 프로퍼티를 초기화한다.
- 만약 constructor가 생략되었다면 이 과정도 생략된다.

#### 3. 인스턴스 반환

- 클래스의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.

### 25.7 프로퍼티

#### 25.7.1 인스턴스 프로퍼티

- 인스턴스 프로퍼티는 constructor 내부에서 정의해야 한다.
- constructor 내부에서 this에 추가한 프로퍼티는 언제나 클래스가 생성한 인스턴스의 프로퍼티가 된다.

```js
class Person {
  constructor(name) {
    this.name = name
  }
}

const me = new Person('Lee')
console.log(me) // Person { name: "Lee" }
console.log(me.name) // Lee
```

#### 25.7.2 접근자 프로퍼티

- 접근자 프로퍼티는 자체적으로 값([[Value]] 내부 슬롯)을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는 접근자 함수로 구성된 프로퍼티다.
- 접근자 함수는 getter 함수와 setter 함수로 구성되어 있으며, getter, setter 이름은 인스턴스 프로퍼티처럼 사용된다.
- getter
  - 인스턴스 프로퍼티에 접근할 때마다 값을 조작하거나 별도의 행위가 필요할 때 사용하며, get 키워드를 사용해 정의한다.
  - getter는 호출하는 것이 아니라 프로퍼티처럼 참조하는 형식으로 사용하며, 참조 시에 내부적으로 getter가 호출된다.
- setter
  - 인스턴스 프로퍼티에 값을 할당할 때마다 프로퍼티 값을 조작하거나 별도의 행위가 필요할 때 사용하며, set 키워드를 사용해 정의한다.
  - setter는 호출하는 것이 아니라 프로퍼티처럼 값을 할당하는 형식으로 사용하며, 참조 시에 내부적으로 setter가 호출된다.

```js
class Person {
  constructor(firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }

  // fullName은 접근자 함수로 구성된 접근자 프로퍼티다.
  // getter 함수
  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }

  // setter 함수
  set fullName(name) {
    ;[this.firstName, this.lastName] = name.split(' ')
  }
}

const me = new Person('Ungmo', 'Lee')

me.fullName = 'Heegun Lee'
console.log(me) // {firstName: "Heegun", lastName: "Lee"}
console.log(me.fullName) // Heegun Lee
console.log(Object.getOwnPropertyDescriptor(Person.prototype, 'fullName'))
// {get: ƒ, set: ƒ, enumerable: false, configurable: true}
```

#### 25.7.3 클래스 필드 정의 제안

- 클래스 필드(필드 또는 멤버)는 클래스 기반 객체지향 언어에서 클래스가 생성할 인스턴스의 프로퍼티를 가리키는 용어다.
- 자바의 클래스 필드는 마치 클래스 내부에서 변수처럼 사용된다.

```java
public class Person {
  private String firstName = "";
  private String lastName = "";

  Person(String firstName, String lastName) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  public String getFullName() {
    return firstName + " " + lastName;
  }
}
```

- 자바의 클래스에서는 this를 생략해도 클래스 필드를 참조할 수 있다. 클래스 기반 언어의 this는 언제나 클래스가 생성할 인스턴스를 가리킨다.
- 그렇기 떄문에 this를 명시할 때는 주로 클래스 클래스 필드가 생성자 또는 메서드의 매개변수 이름과 동일할 때 클래스 필드임을 명확히 하기 위해 사용한다.
- 자바스크립트의 클래스 몸체에는 메서드만 선언할 수 있었지만 새로운 표준 사양인 "Class field declarations"가 제안되어 최신 브라우저와 최신 Node.js에서는 클래스 필드를 클래스 몸체에 정의할 수 있다.

```js
class Person {
  name = 'Lee'
}

const me = new Person()
console.log(me) // Person { name: "Lee" }
```

- 클래스 몸체에서 클래스 필드를 정의하는 경우 this에 클래스 필드를 바인딩해서는 안 된다.
- this는 클래스의 constructor 메서드 내에서만 유효하다.

```js
class Person {
  this.name = ''; // SyntaxError: Unexpected token '.'
}
```

- 클래스 필드에 초기값을 할당하지 않으면 undefined를 갖는다.

```js
class Person {
  name
}

const me = new Person()
console.log(me) // Person { name: undefined }
```

- 함수는 일급 객체이므로 함수를 클래스 필드에 할당할 수 있다. 따라서 클래스 필드를 통해 메서드를 정의할 수도 있다.
- 클래스 필드에 함수를 할당하는 경우, 이 함수는 프로토타입 메서드가 아닌 인스턴스 메서드가 된다.
- 모든 클래스 필드는 인스턴스 프로퍼티가 되기 때문이다. 따라서 클래스 필드에 함수를 할당하는 것은 권장하지 않는다.

```js
class Person {
  name = 'Lee'

  getName = function () {
    return this.name
  }
}

const me = new Person()
console.log(me) // Person { name: "Lee", getName: ƒ }
console.log(me.getName()) // Lee
```

- 인스턴스를 정의하는 방식
  - 인스턴스를 생성할 때 외부 초기값으로 클래스 필드를 초기화가 필요한 경우
    - constructor에서 인스턴스 프로퍼티를 정의(기존 방식)하는 방식만 사용 가능
  - 인스턴스를 생성할 때 외부 초기값으로 클래스 필드를 초기화가 필요하지 않은 경우
    - constructor에서 인스턴스 프로퍼티를 정의하는 방식, 클래스 필드 정의 제안 모두 사용 가능

#### 25.7.4 private 필드 정의 제안

- private 필드의 선두에는 #을 붙여준다. private 필드를 참조할 때도 #을 붙어주어야 한다.
- public 필드는 어디서든 참조할 수 있지만 private 필드는 클래스 내부에서만 참조할 수 있다.

```js
class Person {
  #name = ''

  constructor(name) {
    this.#name = name
  }
}

const me = new Person('Lee')

console.log(me.#name)
// SyntaxError: Private field '#name' must be declared in an enclosing class
```

- 클래스 외부에서 private 필드에 직접 접근할 수 있는 방법은 없다.
- 다만 접근자 프로퍼티를 통해 간접적으로 접근하는 방법은 유효하다.

```js
class Person {
  #name = ''

  constructor(name) {
    this.#name = name
  }

  get name() {
    return this.#name.trim()
  }
}

const me = new Person(' Lee ')
console.log(me.name) // Lee
```

- private 필드는 반드시 클래스 몸체에 정의해야 한다. private 필드를 직접 constructor에 정의하면 에러가 발생한다.

```js
class Person {
  constructor(name) {
    this.#name = name
    // SyntaxError: Private field '#name' must be declared in an enclosing class
  }
}
```

| 접근 가능성                 | public | private |
| --------------------------- | ------ | ------- |
| 클래스 내부                 | O      | O       |
| 자식 클래스 내부            | O      | X       |
| 클래스 인스턴스를 통한 접근 | O      | X       |

#### 25.7.5 static 필드 정의 제안

- static 키워드를 사용하여 정적 메서드를 정의할 수는 있었지만 정적 필드를 정의할 수는 없었다.
- 새로운 표준 사양인 "Static class features"가 제안되어 최신 브라우저와 최신 Node.js에서는 static 키워드를 이용하여 정적 필드를 정의할 수 있다.
- "Static class features" 내용에는 static public 필드, static private 필드, static private 메서드 등이 있다.

```js
class MyMath {
  static PI = 22 / 7 // static public
  static #num = 10 // static private

  static increment() {
    return ++MyMath.#num
  }
}

console.log(MyMath.PI) // 3.142857142857143
console.log(MyMath.increment()) // 11
```

### 25.8 상속에 의한 클래스 확장

#### 25.8.1 클래스 상속과 생성자 함수 상속

- 상속에 의한 클래스 확장은 기존 클래스를 상속받아 새로운 클래스를 확장하여 정의하는 것이다.
- 상속에 의한 클래스 확장은 재사용 관점에서 매우 유용하다.
- 클래스는 상속을 통해 다른 클래스를 확장할 수 있는 문법인 extends 키워드가 기본적으로 제공된다.

```js
class Animal {
  constructor(age, weight) {
    this.age = age
    this.weight = weight
  }

  eat() {
    return 'eat'
  }

  move() {
    return 'move'
  }
}

// 상속을 통해 Animal 클래스를 확장한 Bird 클래스
class Bird extends Animal {
  fly() {
    return 'fly'
  }
}

const bird = new Bird(1, 5)

console.log(bird) // Bird { age: 1, weight: 5 }
console.log(bird instanceof Bird) // true
console.log(bird instanceof Animal) // true

console.log(bird.eat()) // eat
console.log(bird.move()) // move
console.log(bird.fly()) // fly
```

#### 25.8.2 extends 키워드

- 상속을 통해 클래스를 확장하려면 extends 키워드를 사용하여 상속받을 클래스를 정의한다.

```js
class Base {}

class Derived extends Base {}
```

- 서브클래스(subclass)
  - 상속을 통해 확장된 클래스
  - 파생 클래스(derived class), 자식 클래스(child class)
- 수퍼클래스(superclass)
  - 서브클래스에게 상속된 클래스
  - 베이스 클래스(base class), 부모 클래스(parent class)라고 부르기도 한다.
- extends 키워드는 수퍼클래스와 서브클래스 간의 상속 관계를 설정하는 역할을 한다.
- 클래스도 프로토타입을 통해 상속 관계를 구현한다.
- 수퍼클래스와 서브클래스는 인스턴스의 프로토타입 체인뿐 아니라 클래스 간의 프로토타입 체인도 생성한다. 이를 통해 프로토타입 메서드, 정적 메서드 모두 상속이 가능하다.

#### 25.8.3 동적 상속

- extends 키워드는 클래스뿐만 아니라 생성자 함수를 상속받아 클래스를 확장할 수도 있다.
- 단, extends 키워드 앞에는 반드시 클래스가 와야 한다.

```js
function Base(a) {
  this.a = a
}

class Derived extends Base {}

const derived = new Derived(1)
console.log(derived) // Derived { a: 1 }
```

- extends 키워드 다음에는 클래스뿐만 아니라 [[Construct]] 메서드를 갖는 함수 객체로 평가될 수 있는 모든 표현식을 사용할 수 있다.
- 이를 통해 동적으로 상속받을 대상을 결정할 수 있다.

```js
function Base1() {}

class Base2 {}

let condition = true

// 조건에 따라 동적으로 상속 대상을 결정하는 서브클래스
class Derived extends (condition ? Base1 : Base2) {}

const derived = new Derived()
console.log(derived) // Derived {}

console.log(derived instanceof Base1) // true
console.log(derived instanceof Base2) // false
```

#### 25.8.4 서브클래스의 constructor

- 서브클래스에서 constructor를 생략하면 암묵적으로 constructor가 정의된다.
- args는 new 연산자와 함께 클래스를 호출할 때 전달한 인수의 리스트다.
- super()는 수퍼클래스의 constructor(super-constructor)를 호출하여 인스턴스를 생성한다.

```js
constructor(...args) { super(...args); }
```

#### 25.8.5 super 키워드

- super 키워드는 함수처럼 호출할 수도 있고 this와 같이 식별자처럼 참조할 수 있는 특수한 키워드다.
  - super를 호출하면 수퍼클래스의 constructor(super-constructor)를 호출한다.
  - super를 참조하면 수퍼클래스의 메서드를 호출할 수 있다.

##### super 호출

> [!NOTE]
> super를 호출하면 수퍼클래스의 constructor를 호출한다.

```js
class Base {
  constructor(a, b) {
    this.a = a
    this.b = b
  }
}

class Derived extends Base {
  // 다음과 같이 암묵적으로 constructor가 정의된다.
  // constructor(...args) { super(...args); }
}

const derived = new Derived(1, 2)
console.log(derived) // Derived { a: 1, b: 2 }
```

- super를 호출할 떄 주의 사항
  - 서브클래스에서 constructor를 생략하지 않는 경우 서브클래스의 constructor에서는 반드시 super를 호출해야 한다.
  - 서브클래스의 constructor에서 super를 호출하기 전에는 this를 참조할 수 없다.
  - super는 반드시 서브클래스의 constructor에서만 호출한다.

##### super 참조

> [!NOTE]
> 메서드 내에서 super를 참조하면 수퍼클래스의 메서드를 호출할 수 있다.

1. 서브클래스의 프로토타입 메서드 내에서 super.sayHi는 수퍼클래스의 프로토타입 메서드 sayHi를 가리킨다.

```js
class Base {
  constructor(name) {
    this.name = name
  }

  sayHi() {
    return `Hi! ${this.name}`
  }
}

class Derived extends Base {
  sayHi() {
    return `${super.sayHi()}. how are you doing?`
  }
}

const derived = new Derived('Lee')
console.log(derived.sayHi()) // Hi! Lee. how are you doing?
```

- super 참조를 통해 수퍼클래스의 메서드를 참조하려면 super가 수퍼클래스의 메서드가 바인딩된 객체, 즉 수퍼클래스의 prototype 프로퍼티에 바인딩된 프로토타입을 참조할 수 있어야 한다.

```js
class Derived extends Base {
  sayHi() {
    // __super는 Base.prototype을 가리킨다.
    const __super = Object.getPrototypeOf(Derived.prototype)
    return `${__super.sayHi.call(this)} how are you doing?`
  }
}
```

- super는 자신을 참조하고 있는 메서드가 바인딩되어 있는 객체의 프로토타입을 가리킨다.
- 단, Base.prototype.sayHi를 호출할 때 call 메서드를 사용해 this를 전달해야 한다.
- name 프로퍼티는 인스턴스에 존재하기 때문에 내부의 this는 Base.prototype이 아닌 인스턴스를 가리켜야 한다.
- super 참조가 동작하기 위해서는 super를 참조하고 있는 메서드가 바인딩되어 있는 객체의 프로토타입을 찾을 수 있어야 한다.
- 이를 위해 메서드는 내부 슬롯 [[HomeObject]]를 가지며, 자신을 바인딩하고 있는 객체를 가리킨다.

```js
super = Object.getPrototypeOf([[HomeObject]])
```

- 주의할 것은 ES6의 메서드 축약 표현으로 정의된 함수만이 [[HomeObject]]를 갖는다는 것이다.
- [[HomeObject]]를 가지는 함수만이 super 참조를 할 수 있다.
- 따라서 [[HomeObject]]를 갖는 ES6의 메서드 축약 표현으로 정의된 함수만이 super 참조를 할 수 있다.
- 단, super 참조는 수퍼클래스의 메서드를 참조하기 위해 사용하므로 서브클래스 메서드에서 사용해야 한다.

```js
const obj = {
  foo() {}, // ES6 메서드 축약 표현 -> [[HomeObject]] O
  bar: function () {}, // 일반 함수 -> [[HomeObject]] X
}
```

- super 참조는 클래스의 전유물이 아니다.
- 객체 리터럴에서도 super 참조를 사용할 수 있다. 단, ES6 메서드 축약 표현으로 정의된 함수만 가능하다.

```js
const base = {
  name: 'Lee',
  sayHi() {
    return `Hi! ${this.name}`
  },
}

const derived = {
  __proto__: base,
  sayHi() {
    // ES6 메서드 축약 표현 -> [[HomeObject]] O
    return `${super.sayHi()}. how are you doing?`
  },
}

console.log(derived.sayHi()) // Hi! Lee. how are you doing?
```

2. 서브클래스의 정적 메서드 내에서 super.sayHi는 수퍼클래스의 정적 메서드 sayHi를 가리킨다.

```js
class Base {
  static sayHi() {
    return 'Hi!'
  }
}

class Derived extends Base {
  static sayHi() {
    return `${super.sayHi()} how are you doing?`
  }
}

console.log(Derived.sayHi()) // Hi! how are you doing?
```

#### 25.8.6 상속 클래스의 인스턴스 생성 과정

```js
class Rectangle {
  constuctor(width, height) {
    this.width = width
    this.height = height
  }

  getArea() {
    return this.width * this.height
  }

  toString() {
    return `width = ${this.width}, height = ${this.height}`
  }
}

class ColorRectangle extends Rectangle {
  constuctor(width, height, color) {
    super(width, height)
    this.color = color
  }

  toString() {
    return super.toString() + `, color = ${this.color}`
  }
}

const colorRectangle = new ColorRectangle(2, 4, 'red')
console.log(colorRectangle) // ColorRectangle { width: 2, height: 4, color: "red" }

console.log(colorRectangle.getArea()) // 8
console.log(colorRectangle.toString()) // width = 2, height = 4, color = red
```

##### 1. 서브클래스의 super 호출

- 자바스크립트 엔진은 클래스를 평가할 때 수퍼클래스와 서브클래스를 구분하기 위해 "base" 또는 "derived"를 값으로 갖는 내부 슬롯 [[ConstructorKind]]를 갖는다.
  - "base": 다른 클래스를 상속받지 않는 클래스(그리고 생성자 함수)
  - "derived": 다른 클래스를 상속 받는 서브클래스
- 서브클래스는 자신이 직접 인스턴스를 생성하지 않고 수퍼클래스에게 인스턴스 생성을 위임한다. 이것이 바로 서브클래스의 constructor에서 반드시 super를 호출해야 하는 이유다.
- 만약 서브클래스 constructor 내부에 super 호출이 없으면 에러가 발생한다.

##### 2. 수퍼클래스의 인스턴스 생성과 this 바인딩

- 수퍼클래스의 constructor 내부의 코드가 실행되기 이전에 암묵적으로 빈 객체를 생성한다. 그리고 암묵적으로 생성된 빈 객체, 즉 인스턴스는 this에 바인딩된다.
- 따라서 수퍼클래스의 constructor 내부의 this는 생성된 인스턴스를 가리킨다.

```js
class Rectangle {
  constructor(width, height) {
    console.log(this) // ColorRectangle {}
    console.log(new.target) // ColorRectangle
  }
}
```

- 이때 인스턴스는 수퍼클래스가 생성한 것이다. 하지만 new 연산자와 함께 호출된 클래스는 서브클래스라는 것이 중요하다.
- new.target은 서브클래스를 가리킨다. 따라서 인스턴스는 new.target이 가리키는 서브클래스가 생성한 것으로 처리된다.

##### 3. 수퍼클래스의 인스턴스 초기화

- 수퍼클래스의 constructor가 실행되어 this에 바인딩되어 있는 인스턴스를 초기화된다.
- 즉, this에 바인딩되어 있는 인스턴스에 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 인스턴스의 프로퍼티를 초기화한다.

##### 4. 서브클래스 constructor로의 복귀와 this 바인딩

- super 호출이 종료되고 제어 흐름이 서브클래스 constructor로 돌아온다.
- 이때 super가 반환한 인스턴스가 this에 바인딩된다.
- 서브클래스는 별도의 인스턴스를 생성하지 않고 super가 반환한 인스턴스를 this에 바인딩하여 그대로 사용한다.
- 이처럼 super가 호출되지 않으면 인스턴스가 생성되지 않으며, this 바인딩도 할 수 없다.
- 서브클래스의 constructor에서 super를 호출하지 않으면 ReferenceError가 발생하는 이유가 바로 이 때문이다.

##### 5. 서브클래스 인스턴스 초기화

- super 호출 이후, 서브클래스의 constructor에 기술되어 있는 인스턴스 초기화가 실행된다.
- 즉, this에 바인딩된 인스턴스에 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 인스턴스 프로퍼티를 초기화한다.

##### 6. 인스턴스 반환

- 클래스의 모든 처리기 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.

#### 25.8.7 표준 빌트인 생성자 함수 확장

- extends 키워드 다음에는 클래스뿐 아니라 [[Construct]] 내부 메서드를 갖는 함수 객체로 평가될 수 있는 모든 표현식을 사용할 수 있다.
- 표준 빌트인 객체도 [[Consturct]] 내부 메서드를 갖는 생성자 함수이므로 extends 키워드를 사용하여 확장할 수 있다.

```js
class MyArray extends Array {
  uniq() {
    return this.filter((v, i, self) => self.indexOf(v) === i)
  }

  average() {
    return this.reduce((pre, cur) => pre + cur, 0) / this.length
  }
}

const myArray = new MyArray(1, 1, 2, 3)
console.log(myArray) // MyArray(4) [1, 1, 2, 3]
console.log(myArray.uniq()) // MyArray(3) [1, 2, 3]
console.log(myArray.average()) // 1.75
```

- Array.prototype 메서드 중에서 map, filter와 같이 새로운 배열을 반환하는 메서드가 MyArray 클래스의 인스턴스를 반환한다는 것이다.

```js
console.log(myArray.filter(v => v % 2) instanceof MyArray) // true
```

- 만약 새로운 배열을 반환하는 메서드가 MyArray 클래스의 인스턴스를 반환하지 않고 Array의 인스턴스를 반환하면 MyArray 클래스의 메서드와 메서드 체이닝이 불가능하다.

```js
// [1, 1, 2, 3] => [ 1, 1, 3 ] => [ 1, 3 ] => 2
console.log(
  myArray
    .filter(v => v % 2)
    .uniq()
    .average(),
) // 2
```

- 만약 MyArray 클래스의 uniq 메서드가 Array가 생성한 인스턴스를 반환하게 하려면 Symbol.species를 사용해 정적 접근자 프로퍼티를 추가한다.

```js
class MyArray extends Array {
  // 모든 메서드가 Array 타입의 인스턴스를 반환하도록 한다.
  static get [Symbol.species]() {
    return Array
  }

  uniq() {
    return this.filter((v, i, self) => self.indexOf(v) === i)
  }

  average() {
    return this.reduce((pre, cur) => pre + cur, 0) / this.length
  }
}

const myArray = new MyArray(1, 1, 2, 3)

console.log(myArray.uniq() instanceof MyArray) // false
console.log(myArray.uniq() instanceof Array) // true
console.log(myArray.uniq().average())
// TypeError: myArray.uniq(...).average is not a function
```

## 26장 ES6 함수의 추가 기능

### 26.1 함수의 구분

- ES6 이전의 모든 함수는 일반 함수로 호출할 수 있는 것은 물론 생성자 함수로도 호출할 수 있다. 다시 말해, ES6 이전의 모든 함수는 callable하면서 constructor다.

```js
var foo = function () {
  return 1
}

foo() // 1
new foo() // foo {}
var obj = { foo: foo }
obj.foo() // 1
```

- 주의할 것은 ES6 이전에 일반적으로 메서드라고 부르던 객체에 바인딩된 함수도 callable이며 constructor라는 것이다.
- 따라서, 객체에 바인딩된 함수도 일반 함수로서 호출할 수 있는 것은 물론 생성자 함수로서 호출할 수도 있다.
- 객체에 바인딩된 함수를 생성자 함수로 호출할 경우 발생하는 문제점
  - 문법상 가능하다. 의도치 않은 실수를 유발할 가능성이 있다.
  - 성능 면에서도 문제가 있다. 객체에 바인딩된 함수가 constructor라는 것은 객체에 바인딩된 함수가 prototype 프로퍼티를 가지며, **프로토타입 객체도 생성**한다는 것을 의미하기 떄문이다.

```js
var obj = {
  x: 10,
  f: function () {
    return this.x
  },
}

console.log(obj.f()) // 10

var bar = obj.f
console.log(bar()) // undefined

console.log(new obj.f()) // f {}
```

- 마찬가지로 콜백 함수도 constructor이기 때문에 불필요한 프로토타입 객체를 생성한다.

```js
;[1, 2, 3].map(function (item) {
  return item * 2
}) // [ 2, 4, 6 ]
```

> [!TIP]
> 호출할 수 있는 함수 객체를 callable이라 하며, 인스턴스를 생성할 수 있는 함수 객체를 constructor, 인스턴스를 생성할 수 없는 함수 객체를 non-constructor라고 부른다.

- ES6에서는 함수를 사용 목적에 따라 세 가지 종류로 명확히 구분했다.
  | ES6 함수의 구분 | constructor | prototype | super | arguments |
  | --------------- | ----------- | --------- | ----- | --------- |
  | 일반 함수 | O | O | X | O |
  | 메서드 | X | X | O | O |
  | 화살표 함수 | X | X | X | X |
-

### 26.2 메서드

> [!NOTE]
> ES6 사양에서 메서드는 **메서드 축약 표현으로 정의된 함수만**을 의미한다.

```js
const obj = {
	x: 1,
	foo() { return this.x }; // ES6 메서드
	bar: function() { // 일반 함수
		return this.x;
	}
}
```

- ES6 메서드는 인스턴스를 생성할 수 없는 non-constructor다. 따라서 생성자 함수로서 호출할 수 없다.

```js
new obj.foo() // TypeError: obj.foo is not a constructor
new obj.bar() // bar {}
```

- ES6 메서드는 인스턴스를 생성할 수 없으므로 prototype 프로퍼티가 없고 프로토타입도 생성하지 않는다.

```js
obj.foo.hasOwnProperty('prototype') // false
obj.bar.hasOwnProperty('prototype') // true
```

- 표준 빌트인 객체가 제공하는 프로토타입 메서드와 정적 메서드는 모두 non-constructor다.

```js
String.prototype.toUpperCase.prototype // undefined
String.fromCharCode.prototype // undefined
Number.prototype.toFixed.prototype // undefined
Number.isFinite.prototype // undefined
Array.prototype.map.prototype // undefined
Array.from.prototype // undefined
```

- ES6 메서드는 자신을 바인딩한 객체를 가리키는 내부 슬롯 [[HomeObject]]를 갖는다.
- super 참조는 내부 슬롯 [[HomeObject]]를 사용하여 수퍼클래스의 메서드를 참조하므로 내부 슬롯 [[HomeObject]]를 갖는 ES6 메서드는 super 키워드를 사용할 수 있다.

```js
const base = {
  name: 'Lee',
  sayHi() {
    return `Hi! ${this.name}`
  },
}

const derived = {
  __proto__: base,
  sayHi() {
    return `${super.sayHi()}. how are you doing?`
  },
}

console.log(derived.sayHi()) // Hi! Lee. how are you doing?
```

- ES6 메서드가 아닌 함수는 super 키워드를 사용할 수 없다.

```js
const derived = {
  __proto__: base,
  sayHi: function () {
    // SyntaxError: 'super' keyword unexpected here
    return `${super.sayHi()}. how are you doing?`
  },
}
```

- ES6 메서드는 본연의 기능(super)를 추가하고 의미적으로 맞지 않는 기능(constructor)은 제거했다.

### 26.3 화살표 함수

- 화살표 함수는 function 키워드 대신 화살표(=>, fat arrow)를 사용하여 기존의 함수 정의 방식보다 간략하게 정의할 수 있다.
- 표현만 간략한 것이 아니라 내부 동작도 기존의 함수보다 간략하다.
- 특히 화살표 함수는 콜백 함수 내부에서 this가 전역 객체를 가리키는 문제를 해결하기 위한 대안으로 유용하다.

#### 26.3.1 화살표 함수 정의

```js
const multiply = (x, y) => x * y
```

#### 26.3.2 화살표 함수와 일반 함수의 차이

##### 1. 화살표 함수는 인스턴스를 생성할 수 없는 non-constructor이다.

- 인스턴스를 생성할 수 없으므로 prototype 프로퍼티가 없고 프로토타입도 생성하지 않는다.

```js
const Foo = () => {}

new Foo() // TypeError: Foo is not a constructor
Foo.hasOwnProperty('prototype') // false
```

##### 2. 중복된 매개변수 이름을 선언할 수 없다.

```js
const arrow = (a, a) => a + a
// SyntaxError: Duplicate parameter name not allowed in this context
```

#### 3. 화살표 함수는 함수 자체의 this, arguments, super, new target 바인딩을 갖지 않는다.

- 따라서 화살표 함수 내부에서 this, arguments, super, new.target을 참조하면 스코프 체인을 통해 상위 스코프의 this, arguments, super, new.target을 참조한다.
- 만약 화살표 함수와 화살표 함수가 중첩되어 있다면?
  - 스코프 체인 상에서 가장 가까운 상위 함수 중에서 화살표 함수가 아닌 함수의 this, arguments, super, new.target을 참조한다.

#### 26.3.3 this

> [!NOTE]
> this 바인딩은 함수의 호출 방식, 즉 함수가 어떻게 호출되었는지에 따라 동적으로 결정한다.
>
> 화살표 함수의 this는 일반 함수의 this와 다르게 동작한다.

- 콜백 함수 내부의 this가 외부 함수의 this와 다르기 때문에 발생하는 문제를 "콜백 함수 내부의 this 문제"라 한다.
- ES6 이전에는 "콜백 함수 내부의 this 문제"를 다음과 같은 방식으로 해결했다.
  - this를 일단 회피시킨 후에 콜백 함수 내부에서 사용한다.
  - Array.prototype.map의 두 번째 인수로 this를 전달한다.
  - Function.prototype.bind 메서드를 사용하여 this를 바인딩한다.
- ES6에서는 화살표 함수를 사용하여 "콜백 함수 내부의 this 문제"를 해결할 수 있다.

- 화살표 함수는 함수 자체의 this 바인딩을 가지지 않는다. 그래서 **화살표 함수 내부에서 this를 참조하면 상위 스코프의 this를 그대로 참조한다.** 이것을 **lexical this**라고 한다.
- 화살표 함수는 함수 자체의 this 바인딩을 갖지 않는다.
  - 그래서 스코프 체인 상에서 가장 가까운 상위 함수 중에서 화살표 함수가 아닌 함수의 this를 참조한다.
  - bind, call, apply 메서드를 사용해도 화살표 함수 내부의 this를 교체할 수 없다. (-> 호출은 되지만 this를 교체할 수 없음)
- 메서드를 화살표 함수로 정의하는 것은 피해야 한다. (-> ES6 메서드 권장)
  - 메서드를 호출한 객체를 가리키지 않고 상위 스코프인 this를 가리키는 등의 의도치 않는 결과가 나오기 때문이다.

#### 26.3.4 super

- 화살표 함수는 함수 자체의 super 바인딩을 갖지 않는다. 따라서 화살표 함수 내부에서 super를 참조하면 this와 마찬가지로 상위 스코프의 super를 참조한다.

#### 26.3.5 arguments

- 화살표 함수는 함수 자체의 arguments 바인딩을 갖지 않는다. 따라서 화살표 함수 내부에서 arguments를 참조하면 this와 마찬가지로 상위 스코프의 arguments를 참조한다.
- 만약 화살표 함수에서 가변 인수 함수를 구현해야 할 때는 반드시 Rest 파라미터를 사용해야 한다.

### 26.4 Rest 파라미터

#### 26.4.1 기본 문법

> [!NOTE]
> Rest 파라미터는 함수에 전달된 인수들의 목록을 배열로 전달받는다.

- Rest 파라미터(나머지 매개변수)는 매개변수 이름 앞에 ...을 붙여서 정의한다.

```js
function foo(...rest) {
  console.log(rest)
}

foo(1, 2, 3, 4, 5) // [ 1, 2, 3, 4, 5 ]
```

- 일반 매개변수와 Rest 파라미터는 함께 사용할 수 있다.
- 이때 함수에 전달된 인수들은 매개변수와 Rest 파라미터에 **순차적으로 할당**되기 때문에 **Rest 파라미터는 반드시 마지막 파라미터**이어야 한다.

```js
function foo(...rest, param1, param2) { }

foo(1, 2, 3, 4, 5)
// SyntaxError: Rest parameter must be last formal parameter
```

- Rest 파라미터는 단 하나만 선언할 수 있다.

```js
function foo(...rest1, ...rest2) { }

foo(1, 2, 3, 4, 5);
// SyntaxError: Rest parameter must be last formal parameter
```

#### 26.4.2 Rest 파라미터와 arguments 객체

- ES5에서는 arguments 객체를 활용하여 인수를 전달받았다.
- 하지만 arguments 객체는 배열이 아닌 유사 배열 객체이므로 배열 메서드를 사용하려면 call, apply 메서드를 사용해 arguments 객체를 배열로 변환해야 하는 번거로움이 있었다.

```js
function sum() {
  var array = Array.prototype.slice.call(arguments)

  return array.reduce(function (pre, cur) {
    return pre + cur
  }, 0)
}

console.log(sum(1, 2, 3, 4, 5)) // 15
```

- ES6에서는 rest 파라미터를 사용하여 가변 인자 함수의 인수 목록을 배열로 직접 전달받을 수 있다.
- 이를 통해 유사 배열 객체인 arguments 객체를 배열로 변환하는 번거로움을 피할 수 있다.

```js
function sum(...args) {
  return args.reduce((pre, cur) => pre + cur, 0)
}
console.log(sum(1, 2, 3, 4, 5)) // 15
```

- 화살표 함수에서 가변 인자 함수를 구현해야 할 때는 반드시 Rest 파리미터를 사용해야 한다.

### 26.5 매개변수 기본값

> [!NOTE]
> ES6에서 도입된 매개변수 기본갑을 사용하면 함수 내에서 수행하던 인수 체크 및 초기화를 간소화할 수 있다.

```js
function sum(x = 0, y = 0) {
  return x + y
}

console.log(sum(1, 2)) // 3
console.log(sum(1)) // 1
```

- 매개변수 기본값은 매개변수에 인수를 전달하지 않은 경우와 undefined를 전달한 경우에만 유효하다.
- Rest 파라미터애는 기본값을 지정할 수 없다.
