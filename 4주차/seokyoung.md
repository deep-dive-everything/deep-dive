## 16장 프로퍼티 어트리뷰트

### 16.1 내부 슬롯과 내부 메서드

- 내부 슬롯과 내부 메서드는 자바스크립트 엔진의 구현 알고리즘을 설명하기 위해 ECMAScript에서 사용하는 의사 프로퍼티와 의사 메서드다.
- ECMASciprt 사양에 등장하는 이중 대괄호([[...]])로 감싼 이름들
- 원칙적으로 자바스크립트는 내부 슬롯과 내부 메서드에 직접적으로 접근하거나 호출할 수 있는 방법을 제공하지 않는다.
- 단, 일부 내부 슬롯과 내부 메서드에 한하여 간접적으로 접근할 수 있는 수단을 제공한다.
- 모든 객체는 `[[Prototype]]`이라는 내부 슬롯을 갖는다.
- 내부 슬롯은 자바스크립트 엔진의 내부 로직이므로 원칙적으로 직접 접근할 수 없지만 `[[Prototype]]` 내부 슬롯의 경우, `__proto__`를 통해 간접적으로 접근할 수 있다.

```js
const o = {}

o.[[Prototype]] // -> Uncaught SyntaxError: Unexpected token '['
o.__proto__ // -> Object.prototype (Deprecated)
Object.getPrototypeOf(o) // -> Object.prototype
```

### 16.2 프로퍼티 어트리뷰트와 프로퍼티 디스크립터 객체

- 자바스크립트 엔진은 프로퍼티를 생성할 때 프로퍼티의 상태를 나타내는 프로퍼티 어트리뷰트를 기본값으로 자동 정의한다.
- 프로퍼티 상태
  - 프로퍼티의 값(value)
  - 값의 갱신 가능 여부(writable)
  - 열거 가능 여부(enumerable)
  - 재정의 가능 여부(configurable)
- 프로퍼티 어트리뷰트는 자바스크립트 엔진이 관리하는 내부 상태 값인 내부 슬롯 `[[Value]]`, `[[Writable]]`, `[[Enumerable]]`, `[[Configurable]]`이다.
- 따라서 **프로퍼티 어트리뷰트에 직접 접근할 수 없지만 `Object.getOwnPropertyDiscriptor` 메서드를 사용하여 간접적으로 확인할 수 있다.**

```js
const person = {
  name: 'Lee',
}

person.age = 20

console.log(Object.getOwnPropertyDescriptors(person))
/*
{
  name: {value: "Lee", writable: true, enumerable: true, configurable: true},
  age: {value: 20, writable: true, enumerable: true, configurable: true}
}
*/
```

### 16.3 데이터 프로퍼티와 접근자 프로퍼티

- 프로퍼티는 데이터 프로퍼티와 접근자 프로퍼티로 구분할 수 있다.
  - 데이터 프로퍼티: 키와 값으로 구성된 일반적인 프로퍼티
  - 접근자 프로퍼티: 자체적으로 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 호출되는 접근자 함수로 구성된 프로퍼티

#### 16.3.1 데이터 프로퍼티

> [!NOTE]
> 키와 값으로 구성된 일반적인 프로퍼티

- 데이터 프로퍼티의 프로퍼티 어트리뷰트는 자바스크립트 엔진이 프로퍼티를 생성할 때 기본값으로 자동 정의된다.
- 프로퍼티가 생성될 때 `[[Value]]`의 값은 프로퍼티 값으로 초기화되면 `[[Writable]]`, `[[Enumerable]]`, `[[Configurable]]`의 값은 `true`로 초기화된다. 이것은 프로퍼티를 동적 추가해도 마찬가지다.

| 프로퍼티 어트리뷰트 | 프로퍼티 디스크립터 객체의 프로퍼티 | 설명                                                      |
| ------------------- | ----------------------------------- | --------------------------------------------------------- |
| [[Value]]           | value                               | 프로퍼티 키를 통해 **프로퍼티 값**에 접근하면 반환되는 값 |
| [[Writable]]        | writable                            | 프로퍼티 값의 **변경 가능 여부**를 나타내는 불리언 값     |
| [[Enumerable]]      | enumerable                          | 프로퍼티의 **열거 가능 여부**를 나타내는 불리언 값        |
| [[Configurable]]    | configurable                        | 프로퍼티의 **재정의 가능 여부**를 나타내는 불리언 값      |

#### 16.3.2 접근자 프로퍼티

> [!NOTE]
> 자체적으로 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 호출되는 접근자 함수로 구성된 프로퍼티

| 프로퍼티 어트리뷰트 | 프로퍼티 디스크립터 객체의 프로퍼티 | 설명                                                                             |
| ------------------- | ----------------------------------- | -------------------------------------------------------------------------------- |
| [[Get]]             | get                                 | 접근자 프로퍼티를 통해 **데이터 프로퍼티의 값을 읽을 때 호출되는 접근자 함수**   |
| [[Set]]             | set                                 | 접근자 프로퍼티를 통해 **데이터 프로퍼티의 값을 저장할 때 호출되는 접근자 함수** |
| [[Enumerable]]      | enumerable                          | 프로퍼티의 **열거 가능 여부**를 나타내는 불리언 값                               |
| [[Configurable]]    | configurable                        | 프로퍼티의 **재정의 가능 여부**를 나타내는 불리언 값                             |

- 접근자 함수는 getter/setter 함수라고도 부른다.
- 접근자 프로퍼티는 getter와 setter 함수를 모두 정의할 수도 있고 하나만 정의할 수도 있다.

```js
const person = {
  firstName: 'Ungmo',
  lastName: 'Lee',

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  },
  set fullName(name) {
    ;[this.firstName, this.lastName] = name.split(' ')
  },
}

// firstName은 데이터 프로퍼티다.
// 데이터 프로퍼티는 [[Value]], [[Writable]], [[Enumerable]], [[Configurable]] 프로퍼티 어트리뷰트를 갖는다.
let descriptor = Object.getOwnPropertyDescriptor(person, 'firstName')
console.log(descriptor)
// {value: "Ungmo", writable: true, enumerable: true, configurable: true}

// fullName은 접근자 프로퍼티다.
// 접근자 프로퍼티는 [[Get]], [[Set]], [[Enumerable]], [[Configurable]] 프로퍼티 어트리뷰트를 갖는다.
descriptor = Object.getOwnPropertyDescriptor(person, 'fullName')
console.log(descriptor)
// {get: ƒ, set: ƒ, enumerable: true, configurable: true}
```

- 접근자 프로퍼티 `fullName`으로 프로퍼티 값에 접근하면 내부적으로 `[[Get]]` 내부 메서드가 호출되어 다음과 같이 동작한다.
  - 1. 프로퍼티 키가 유효한지 확인한다. 이때 프로퍼티 키는 문자열 또는 심벌이어야 한다. 프로퍼티 키 "fullName"은 문자열이므로 유효한 프로퍼티 키다.
  - 2. 프로토타입 체인에서 프로퍼티를 검색한다. `person` 객체에 `fullName`프로퍼티가 존재한다.
  - 3. 검색된 `fullName` 프로퍼티가 데이터 프로퍼티인지 접근자 프로퍼티인지 확인한다. `fullName` 프로퍼티는 접근자 프로퍼티다.
  - 4. 접근자 프로퍼티 `fullName`의 프로퍼티 어트리뷰트 `[[Get]]`의 값, 즉 getter 함수를 호출하여 그 결과를 반환한다. 프로퍼티 `fullName`의 프로퍼티 어트리뷰트 `[[Get]]`의 값은 `Object.getOwnPropertyDescriptor` 메서드가 반환하는 프로퍼티 디스크립터 객체의 get 프로퍼티 값과 같다.

> [!TIP]
> 프로토타입
>
> - 어떤 객체의 상위(부모) 객체의 역할을 하는 객체
> - 프로토타입은 하위(자식) 객체에게 자신의 프로퍼티와 메서드를 상속한다.
> - 프로토타입 객체의 프로퍼티나 메서드를 상속받은 하위 객체는 자신의 프로퍼티 또는 메서드인 것처럼 자유롭게 사용할 수 있다.
> - 객체의 프로퍼티나 메서드에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티 또는 메서드가 없다면 프로토타입 체인을 따라 프로토타입의 프로퍼티나 메서드를 차례대로 검색한다.

### 16.4 프로퍼티 정의

> [!NOTE]
> 프로퍼티 정의란 새로운 프로퍼티를 추가하면서 프로퍼티 어트리뷰트를 명시적으로 정의하거나, 기존 프로퍼티의 프로퍼티 어트리뷰트를 재정의하는 것을 말한다.
> <br />
> 이를 통해 객체의 프로퍼티가 어떻게 동작해야 하는지를 명확히 정의할 수 있다.

- `Object.defineProperty` 메서드를 사용하면 프로퍼티 어트리뷰트를 정의할 수 있다.

  - 인수로는 객체의 참조와 데이터 프로퍼티의 키인 문자열, 프로퍼티 디스크립터 객체를 전달한다.
  - 프로퍼티 디스크립터 객체의 프로퍼티를 일부 생략할 수 있다. 생략된 어트리뷰트는 기본값이 적용되며, `undefined`, `false`가 기본값이다.
  - 한번에 하나의 프로퍼티만 정의할 수 있다.

| 프로퍼티 디스크립터 객체의 프로퍼티 | 대응하는 프로퍼티 어트리뷰트 | 생략했을 때의 기본값 |
| ----------------------------------- | ---------------------------- | -------------------- |
| value                               | [[Value]]                    | undefined            |
| get                                 | [[Get]]                      | undefined            |
| set                                 | [[Set]]                      | undefined            |
| writable                            | [[Writable]]                 | false                |
| enumerable                          | [[Enumerable]]               | false                |
| configurable                        | [[Configurable]]             | false                |

```js
const person = {}

Object.defineProperty(person, 'firstName', {
  value: 'Ungmo',
  writable: true,
  enumerable: true,
  configurable: true,
})

Object.defineProperty(person, 'lastName', {
  value: 'Lee',
})

Object.defineProperty(person, 'fullName', {
  get() {
    return `${this.firstName} ${this.lastName}`
  },
  set(name) {
    ;[this.firstName, this.lastName] = name.split(' ')
  },
  enumerable: true,
  configurable: true,
})
```

- `Object.defineProperties` 메서드를 사용하면 여러 개의 프로퍼티를 한 번에 정의할 수 있다.

```js
const person = {}

Object.defineProperties(person, {
  firstName: {
    value: 'Ungmo',
    writable: true,
    enumerable: true,
    configurable: true,
  },
  lastName: {
    value: 'Lee',
    writable: true,
    enumerable: true,
    configurable: true,
  },
  fullName: {
    get() {
      return `${this.firstName} ${this.lastName}`
    },
    set(name) {
      ;[this.firstName, this.lastName] = name.split(' ')
    },
    enumerable: true,
    configurable: true,
  },
})
```

### 16.5 객체 변경 방지

| 구분           | 메서드                   | 프로퍼티 추가 | 프로퍼티 삭제 | 프로퍼티 값 읽기 | 프로퍼티 값 쓰기 | 프로퍼티 어트리뷰트 재정의 |
| -------------- | ------------------------ | ------------- | ------------- | ---------------- | ---------------- | -------------------------- |
| 객체 확장 금지 | Object.preventExtensions | X             | O             | O                | O                | O                          |
| 객체 밀봉      | Object.seal              | X             | X             | O                | O                | X                          |
| 객체 동결      | Object.freeze            | X             | X             | O                | X                | X                          |

#### 16.5.1 객체 확장 금지

- `Object.preventExtensions` 메서드는 객체의 확장을 금지한다.
- 객체 확장 금지란 프로퍼티 추가 금지를 의미한다. **즉, 확장이 금지된 객체는 프로퍼티 추가가 금지된다.**
- 프로퍼티 동적 추가와 Object.defineProperty 메서드로 추가하는 두 가지 프로퍼티 추가 방법 모두 금지된다.
- 확장이 가능한 객체인지 여부는 Object.isExtensible 메서드로 확인할 수 있다.

```js
const person = { name: 'Lee' }

console.log(Object.isExtensible(person)) // true
Object.preventExtensions(person)
console.log(Object.isExtensible(person)) // false

person.age = 20 // 무시
console.log(person) // {name: "Lee"}

delete person.name // 프로퍼티 추가는 금지되지만 삭제는 가능
console.log(person) // {}

Object.defineProperty(person, 'age', { value: 20 }) // 프로퍼티 정의에 의한 프로퍼티 추가 금지
// TypeError: Cannot define property age, object is not extensible
```

#### 16.5.2 객체 밀봉

- Object.seal 메서드는 객체를 밀봉한다.
- 객체 밀봉이란 프로퍼티 추가 및 삭제와 프로퍼치 어트리뷰트 재정의 금지를 말한다. **즉, 밀봉된 객체는 읽기와 쓰기만 가능하다.**
- 밀봉된 객체인지 여부는 Object.isSealed 메서드로 확인할 수 있다.

```js
const person = { name: 'Lee' }

console.log(Object.isSealed(person)) // false
Object.seal(person)
console.log(Object.isSealed(person)) // true

console.log(Object.getOwnPropertyDescriptors(person))
// { name: {value: "Lee", writable: true, enumerable: true, configurable: false} }

person.age = 20 // 무시
console.log(person) // {name: "Lee"}

delete person.name // 무시
console.log(person) // {name: "Lee"}

person.name = 'Kim' // 프로퍼티 값 갱신 가능
console.log(person) // {name: "Kim"}

Object.defineProperty(person, 'name', { configurable: true }) // 프로퍼티 어트리뷰트 재정의 금지
// TypeError: Cannot redefine property: name
```

#### 16.5.3 객체 동결

- Object.freeze 메서드는 객체를 동결한다.
- 객체 동결이란 프로퍼티 추가 및 삭제와 프로퍼티 어트리뷰트 재정의 금지, 프로퍼티 값 갱신 금지를 의미한다. **즉, 동결된 객체는 읽기만 가능하다.**
- 동결된 객체인지 여부는 Object.isFrozen 메서드로 확인할 수 있다.

```js
const person = { name: 'Lee' }

console.log(Object.isFrozen(person)) // false
Object.freeze(person)
console.log(Object.isFrozen(person)) // true

console.log(Object.getOwnPropertyDescriptors(person))
// { name: {value: "Lee", writable: false, enumerable: true, configurable: false} }

person.age = 20 // 무시
console.log(person) // {name: "Lee"}

delete person.name // 무시
console.log(person) // {name: "Lee"}

person.name = 'Kim' // 무시
console.log(person) // {name: "Lee"}

Object.defineProperty(person, 'name', { configurable: true }) // 프로퍼티 어트리뷰트 재정의 금지
// TypeError: Cannot redefine property: name
```

#### 16.5.4 불변 객체

- 지금까지 살펴본 변경 방지 메서드들은 얕은 변경 방지로 직속 프로퍼티만 변경이 방지되고 중첩 객체까지는 영향을 주지는 못한다.
- 객체의 중첩 객체까지 동결하여 변경이 불가능한 읽기 전용의 불변 객체를 구현하려면 객체를 값으로 갖는 모든 프로퍼티에 대해 재귀적으로 Object.freeze 메서드를 호출해야 한다.

```js
function deepFreeze(target) {
  if (target && typeof target === 'object' && !Object.isFrozen(target)) {
    Object.freeze(target)
    Object.keys(target).forEach(key => deepFreeze(target[key]))
  }
  return target
}

const person = {
  name: 'Lee',
  address: { city: 'Seoul' },
}

deepFreeze(person)
console.log(Object.isFrozen(person)) // true
console.log(Object.isFrozen(person.address)) // true

person.address.city = 'Busan'
console.log(person) // {name: "Lee", address: {city: "Seoul"}}
```

## 17장 생성자 함수에 의한 객체 생성

### 17.1 Object 생성자 함수

- `new` 연산자와 함께 Object 생성자 함수를 호출하면 빈 객체를 생성하여 반환한다.
- 빈 객체를 생성한 이후 프로퍼티 또는 메서드를 추가하여 객체를 완성할 수 있다.
- 생성자 함수란 new 연산자와 함께 호출하여 객체(인스턴스)를 생성하는 함수를 말한다.

### 17.2 생성자 함수

#### 17.2.1 객체 리터럴에 의한 객체 생성 방식의 문제점

- 객체 리터럴에 의한 객체 생성 방식은 직관적이고 간편하지만 단 하나의 객체만 생성한다.
- 동일한 프로퍼티를 갖는 객체를 여러 개 생성해야 하는 경우 매번 같은 프로퍼티를 기술해야 하기 때문에 비효율적이다.

```js
const circle1 = {
  radius: 5,
  getDiameter() {
    return 2 * this.radius
  },
}

const circle2 = {
  radius: 10,
  getDiameter() {
    return 2 * this.radius
  },
}
```

#### 17.2.2 생성자 함수에 의한 객체 생성 방식의 장점

- 생성자 함수에 의한 객체 생성 방식은 템플릿처럼 생성자 함수를 사용하여 프로퍼티 구조가 동일한 객체 여러 개를 간편하게 생성할 수 있다.
- 일반 함수와 동일한 방법으로 생성자 함수를 정의하고 **new 연산자와 함께 호출하면 생성자 함수로 동작한다.**
- 만약 new 연산자와 함께 함수를 호출하지 않으면 생성자 함수가 아니라 일반 함수로 동작한다.

```js
function Circle(radius) {
  this.radius = radius
  this.getDiameter = function () {
    return 2 * this.radius
  }
}

const circle1 = new Circle(5)
const circle2 = new Circle(10)

const circle3 = Circle(15)
console.log(circle3) // undefined
console.log(radius) // 15
```

> [!TIP]
> this
>
> - this는 객체 자신의 프로퍼티나 메서드를 참조하기 위한 자기 참조 변수
> - this가 가리키는 값, 즉 this 바인딩은 함수 호출 방식에 따라 동적으로 결정된다.
>
> | 함수 호출 방식       | this 바인딩                   |
> | -------------------- | ----------------------------- |
> | 일반 함수로서 호출   | 전역 객체                     |
> | 메서드로서 호출      | 메서드를 호출한 객체          |
> | 생성자 함수로서 호출 | 생성자 함수가 생성할 인스턴스 |

#### 17.2.3 생성자 함수의 인스턴스 생성 과정

- 생성자 함수의 역할은 프로퍼티 구조가 동일한 인스턴스를 생성하는 것과 생성된 인스턴스를 초기화하는 것이다.
- 생성자 함수가 인스턴스를 생성하는 것은 필수이고, 생성된 인스턴스를 초기화하는 것은 옵션이다.

1. 인스터스 생성과 this 바인딩
   - 암묵적으로 빈 객체인 인스턴스를 생성한다.
   - 생성된 인스턴스는 this에 바인딩된다.
   - 생성자 함수 내부의 this가 생성자 함수가 생성할 인스턴스를 가리키는 이유가 바로 이것이다.
   - 이 처리는 함수 몸체의 코드가 한 줄씩 실행되는 런타임 이전에 실행된다.
2. 인스턴스 초기화
   - 생성자 함수에 기술되어 있는 코드가 한 줄씩 실행되어 this에 바인딩되어 있는 인스턴스를 초기화한다.
   - 즉, this에 바인딩되어 있는 인스턴스에 프로퍼티나 메서드를 추가하고 생성자 함수가 인수로 전달받은 초기값을 인스턴스 프로퍼티에 할당하여 초기화하거나 고정값을 할당한다.
   - 이 처리는 개발자가 기술한다.
3. 인스턴스 반환
   - 생성자 함수 내부에서 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this를 암묵적으로 반환한다.
   - 만약 this가 아닌 다른 객체를 명시적으로 반환하면 this가 아닌 return 문에 명시한 객체가 반환된다.
   - 하지만 명시적으로 반환하는 값이 원시 값이라면 원시 값 반환이 무시되고 암묵적으로 this가 반환된다.
   - 생성자 함수 내에서 명시적으로 this가 아닌 다른 값을 반환하는 것은 생성자 함수의 기본 동작을 훼손한다.
   - 따라서 **생성자 함수 내부에서 return 문을 반드시 생략**해야 한다.

```js
function Circle(radius) {
  // 1. 인스턴스 생성과 this 바인딩
  console.log(this) // Circle {}

  // 2. 인스턴스 초기화
  this.radius = radius
  this.getDiameter = function () {
    return 2 * this.radius
  }

  // 3. 인스턴스 반환 (this의 암묵적 반환)
}

const circle1 = new Circle(5)
```

#### 17.2.4 내부 메서드 [[Call]]과 [[Construct]]

- 함수는 객체이지만 일반 객체와 다르게 호출할 수 있다.
- 따라서 함수 객체는 일반 객체가 가지고 있는 내부 슬롯과 내부 메서드 외에도 함수로서 동작하기 위해 함수 객체만을 위한 내부 슬롯과 내부 메서드를 추가로 가지고 있다.
- 함수가 일반 함수로서 호출되면 함수 객체의 내부 메서드 `[[Call]]`이 호출되고, new 연산자와 함께 생성자 함수로서 호출되면 내부 메서드 `[[Construct]]`가 호출된다.
- 호출할 수 없는 객체는 함수 객체가 아니므로 함수로서 기능하는 객체, 즉 **함수 객체는 반드시 callable**이어야 한다.
- 모든 함수 객체는 내부 메서드 [[Call]]을 갖고 있으므로 호출할 수 있다. 하지만 모든 함수 객체가 [[Construct]]를 갖는 것은 아니다.
- 결론적으로 함수 객체는 **callable이면서 constructor**이거나 **callable이면서 non-constructor**다.
- 즉, 모든 함수 객체는 호출할 수 있지만 모든 함수 객체를 생성자 함수로서 호출할 수 있는 것은 아니다.

```js
function foo() {}

// 일반적인 함수로서 호출: [[Call]]이 호출
foo()

// 생성자 함수로서 호출: [[Construct]]가 호출
new foo()
```

#### 17.2.5 constructor와 non-constructor의 구분

- 자바스크립트 엔진은 함수 정의를 평가하여 함수 객체를 생성할 때 함수 정의 방식에 따라 함수를 constructor와 non-constructor로 구분한다.
- constructor: 함수 선언문, 함수 표현식, 클래스(클래스도 함수다)
- non-constructor: 메서드(ES6 메서드 축약 표현), 화살표 함수

#### 17.2.6 new 연산자

- new 연산자와 함께 생성자 함수를 호출하면 해당 함수는 생성자 함수로 동작한다.
- `[[Call]]`이 호출되는 것이 아니라 `[[Construct]]`가 호출된다.

```js
// 생성자 함수로서 정의하지 않은 일반 함수
function add(x, y) {
  return x + y
}

// 생성자 함수로서 정의하지 않은 일반 함수를 new 연산자와 함께 호출
let inst = new add()

// 함수가 객체를 반환하지 않았으므로 반환문이 무시된다. 따라서 빈 객체가 생성되어 반환된다.
console.log(inst) // {}

// 객체를 반환하는 일반 함수
function createUser(name, role) {
  return { name, role }
}

// 일반 함수를 new 연산자와 함께 호출
inst = new createUser('Lee', 'admin')
// 함수가 생성한 객체를 반환한다.
console.log(inst) // {name: "Lee", role: "admin"}
```

- new 연산자 없이 생성자 함수를 호출하면 일반 함수로 호출된다.
- `[[Construct]]`가 호출되는 것이 아니라 `[[Call]]`이 호출된다.

```js
// 생성자 함수
function Circle(radius) {
  this.radius = radius
  this.getDiameter = function () {
    return 2 * this.radius
  }
}

// new 연산자 없이 생성자 함수 호출하면 일반 함수로서 호출된다.
const circle = Circle(5)
console.log(circle) // undefined

// 일반 함수 내부의 this는 전역 객체 window를 가리킨다.
console.log(radius) // 5
console.log(getDiameter()) // 10

circle.getDiameter()
// TypeError: Cannot read property 'getDiameter' of undefined
```

- 일반 함수와 생성자 함수에 특별한 형식적 차이가 없으므로 생성자 함수는 일반적으로 첫 문자를 대문자로 기술하는 파스칼 케이스로 명명하여 일반 함수와 구별할 수 있도록 해야 한다.

#### 17.2.7 new.target

- 생성자 함수가 `new` 연산자 없이 호출되는 것을 방지하기 위해 ES6에서는 `new.target`을 지원한다.
- 함수 내부에서 `new.target`을 사용하면 `new` 연산자와 함께 생성자 함수로서 호출되었는지 확인할 수 있다.
- `new` 연산자와 함께 생성자 함수로서 호출되면 함수 내부의 `new.target`은 함수 자신을 가리킨다.
- `new` 연산자 없이 일반 함수로서 호출된 함수 내부의 `new.target`은 `undefined`다.

```js
function Circle(radius) {
  // 이 함수가 new 연산자와 함께 호출되지 않았다면 new.target은 undefined다.
  if (!new.target) {
    // new 연산자와 함께 생성자 함수를 재귀 호출하여 생성된 인스턴스를 반환한다.
    return new Circle(radius)
  }

  this.radius = radius
  this.getDiameter = function () {
    return 2 * this.radius
  }
}

// new 연산자 없이 생성자 함수를 호출하여도 new.target을 통해 생성자 함수로서 호출된다.
const circle = Circle(5)
console.log(circle.getDiameter()) // 10
```

> [!TIP]
> 스코프 세이프 생성자 패턴
>
> - `new.target`을 사용할 수 없는 상황이라면 스코프 세이프 생성자 패턴을 사용한다.
> - `instanceof`를 사용하여 this 바인딩 시 생성자와 연결되었는지 확인한다.

- 대부분의 빌트인 생성자 함수는 `new` 연산자와 함께 호출되었는지 확인한 후 적절한 값을 반환한다.
  - Object와 Function 생성자 함수는 `new` 연산자 없이 호출해도 `new` 연산자와 함께 호출했을 때와 동일하게 동작한다.
  - String, Number, Boolean 생성자 함수는 `new` 연산자와 함께 호출했을 때는 객체를 생성하여 반환하고 `new` 연산자 없이 호출되면 각각 문자열, 숫자, 불리언 값을 반환한다.(데이터 타입 변환)

## 18장 함수와 일급 객체

### 18.1 일급 객체

- 일급 객체의 조건
  - 무명의 리터럴로 생성할 수 있다. 즉, 런타임에 생성이 가능하다.
  - 변수나 자료구조(객체, 배열 등)에 저장할 수 있다.
  - 함수의 매개변수에 전달할 수 있다.
  - 함수의 반환값으로 사용할 수 있다.
- 자바스크립트의 함수는 일급 객체의 조건을 모두 만족하므로 일급 객체다.

### 18.2 함수 객체의 프로퍼티

- 함수는 객체다. 따라서 프로퍼티를 가질 수 있다.
- 함수 객체는 일반 객체에는 없는 함수 객체 고유의 프로퍼티인 `arguments`, `caller`, `length`, `name`, `prototype`을 갖는다.
- `__proto__`는 접근자 프로퍼티이며, 함수 객체 고유의 프로퍼티가 아니다.
- `__proto__`는 `Object.prototype` 객체의 프로퍼티를 상속받은 것을 알 수 있다.
- `Object.prototype` 객체의 `__proto__` 접근자 프로퍼티는 모든 객체가 사용할 수 있다.

```js
function square(number) {
  return number * number
}

console.log(Object.getOwnPropertyDescriptors(square))

// __proto__는 Object.prototype 객체의 접근자 프로퍼티다.
console.log(Object.getOwnPropertyDescriptor(square, '__proto__')) // undefined
console.log(Object.getOwnPropertyDescriptor(Object.prototype, '__proto__'))
// {get: ƒ, set: ƒ, enumerable: false, configurable: true}
```

#### 18.2.1 arguments 프로퍼티

- 함수 객체의 arguments 프로퍼티 값은 arguments 객체다.
- arguments 객체는 함수 호출 시 전달된 인수들의 정보를 담고 있는 순회 가능한 유사 배열 객체이다.
- 함수 내부에서 지역 변수처럼 사용되고 함수 외부에서는 참조할 수 없다.
- 자바스크립트는 함수의 매개변수와 인수의 개수가 일치하는지 확인하지 않는다.
  - 선언된 매개변수의 개수보다 인수를 적게 전달했을 경우 매개변수는 undefined로 초기화된 상태를 유지한다.
  - 초과된 인수는 무시된다. 그냥 버려지는 것은 아니고 arguments 객체의 프로퍼티로 보관된다.

```js
function multiply(x, y) {
  console.log(arguments)
  return x * y
}

console.log(multiply()) // NaN
console.log(multiply(1)) // NaN
console.log(multiply(1, 2)) // 2
console.log(multiply(1, 2, 3)) // 2
```

- arguments 객체는 매개변수 개수를 확정할 수 없는 가변 인자 함수를 구현할 때 유용하다.

```js
function sum() {
  let res = 0

  for (let i = 0; i < arguments.length; i++) {
    res += arguments[i]
  }

  return res
}

console.log(sum()) // 0
console.log(sum(1, 2)) // 3
console.log(sum(1, 2, 3)) // 6
```

- arguments 객체는 배열 형태로 인자 정보를 담고 있지만 실제 배열이 아닌 유사 배열 객체다.
- 유사 배열 객체는 배열이 아니므로 배열 메서드를 사용할 경우 에러가 발생한다.
- 따라서 배열 메서드를 사용하려면 `Function.prototype.call`, `Function.prototype.apply`를 사용하여 간접 호출해야 하는 번거로움이 있다.

```js
function sum() {
  const array = Array.prototype.slice.call(arguments)
  return array.reduce((pre, cur) => pre + cur, 0)
}

console.log(sum(1, 2)) // 3
console.log(sum(1, 2, 3, 4, 5)) // 15
```

> [!TIP]
> 이터러블의 개념이 없었던 ES5에서 arguments 객체는 유사 배열 객체로 구분되었다.
> <br />
> 하지만 이터러블이 도입된 ES6부터 arguments 객체는 유사 배열 객체이면서 동시에 이터러블이다.

- 이러한 번거로움을 해결하기 위해 ES6에서는 Rest 파라미터를 도입했다.

```js
function sum(...args) {
  return args.reduce((pre, cur) => pre + cur, 0)
}

console.log(sum(1, 2)) // 3
console.log(sum(1, 2, 3, 4, 5)) // 15
```

#### 18.2.2 caller 프로퍼티

- caller 프로퍼티는 ECMAScript 사양에 포함되지 않은 비표준 프로퍼티다.
- 함수 객체의 caller 프로퍼티는 함수 자신을 호출한 함수를 가리킨다.

#### 18.2.3 length 프로퍼티

- 함수 객체의 length 프로퍼티는 함수를 정의할 때 선언한 매개변수의 개수를 가리킨다.
- arguments 객체의 length 프로퍼티와 함수 객체의 length 프로퍼티의 값은 다를 수 있으므로 주의해야 한다.
  - arguments 객체의 length 프로퍼티: 인자(argument)의 개수
  - 함수 객체의 length 프로퍼티: 매개 변수(parameter)의 개수

#### 18.2.4 name 프로퍼티

- 함수 객체의 name 프로퍼티는 함수 이름을 나타낸다. ES6에서 정식 표준이 되었다.
- 익명 함수 표현식의 경우 ES5에서 name 프로퍼티는 빈 문자열을 갖는다. 하지만 ES6에서는 함수 객체를 가리키는 식별자를 값으로 갖는다.

```js
const anonymousFunc = function () {}

console.log(anonymousFunc.name)
// ES5: 빈 문자열("")
// ES6: anonymousFunc
```

#### 18.2.5 \_\_proto\_\_ 접근자 프로퍼티

- 모든 객체는 `[[Prototype]]` 이라는 내부 슬롯을 갖는다.
- `__proto__` 접근자 프로퍼티는 `[[Prototype]]` 내부 슬롯이 가리키는 프로토타입 객체에 접근하기 위해 사용한다.
- `__proto__` 접근자 프로퍼티를 통해 간접적으로 프로토타입 객체에 접근할 수 있다.

#### 18.2.6 prototype 프로퍼티

- prototype 프로퍼티는 생성자 함수로 호출할 수 있는 함수 객체, 즉 constructor만이 소유하는 프로퍼티다.
- prototype 프로퍼티는 함수가 객체를 생성하는 생성자 함수로 호출될 때 생성자 함수가 생성할 인스턴스의 프로토타입 객체를 가리킨다.

### 느낀점

이번 시간은 다음 시간에 있을 프로토타입을 위해 기반을 다지는 시간이었다고 생각합니다!
특히 저번 현경님 시간에 같이 화면 보면서 확인했던 `__proto__`와 `[[Prototype]]`을 자세히 알아가는 시간이었습니다.
객체 변경 방지 방법 중 `Object.freeze`는 사용해봤던 적이 있는데 다른 방법도 있는지는 몰랐습니다. 책에서 표로 잘 정리되어 있어서 비교해가면서 보기 좋았어요.

다음 시간은 대망의...프로토타입이 기다리고 있네요...😂
