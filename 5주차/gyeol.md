![image](https://github.com/deep-dive-to-javascript/deep-dive/assets/66353188/af4811d2-45d3-43fc-8457-bc6f73d2c3cc)# 19 - 프로토타입

- 자바스크립트는 명령형, 함수형, 프로토타입 기반 객체 지향 프로그래밍을 지원하는 멀티 패러다임 프로그래밍 언어
- 자바스크립트는 객체 기반의 프로그래밍 언어이며 **자바스크립트를 이루고 있는 거의 모든 것이 객체**
원시 타입의 값을 제외한 나머지 값들(함수, 배열, 정규표현식 등)은 모두 객체

## 19.1 객체 지향 프로그래밍

- 객체 지향 프로그래밍은 여러 개의 독립적 단위, 즉 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임
- 속성을 통해 여러 개의 값을 하나의 단위로 구성한 복합적인 자료구조를 객체라고 함
- 객체는 상태 데이터와 동작을 하나의 논리적인 단위로 묶은 복합적인 자료 구조
    - 객체의 상태 데이터 → 프로퍼티
    - 동작 → 메서드

## 19.2 상속과 프로토타입

- 자바스크립트는 프로토타입을 기반으로 상속을 구현하여 불필요한 중복을 제거함
    
    중복을 제거하는 방법 → 기존의 코드를 적극적으로 재사용
    

## 19.3 프로토타입 객체

- 프로토타입 객체란 객체 간 상속을 구현하기 위해 사용
- 프로토타입은 어떤 객체의 상위(부모) 객체의 역할을 하는 객체로서 다른 객체에 공유 프로퍼티(메서드 포함)을 제공
- 프로토타입을 상속받은 하위(자식) 객체는 상위 객체의 프로퍼티를 자신의 프로퍼티처럼 자유롭게 사용할 수 있음
- 모든 객체는 [[Prototype]] 이라는 내부 슬롯을 가지며 내부 슬롯의 값은 프로토타입의 참조임
- [[Prototype]]에 저장되는 프로토타입은 객체 생성 방식에 의해 결정
    
    → 객체가 생성될 때 객체 생성 방식에 따라 프로토타입이 결정되고 [[Prototype]]에 저장
    
- 모든 객체는 하나의 프로토타입을 가지며, 모든 프로토타입은 생성자 함수와 연결되어있음
    
    ![image](https://github.com/deep-dive-to-javascript/deep-dive/assets/66353188/52d3a416-d325-45ed-986e-98a1dd084d48)


### 19.3.1 __**proto**__ 접근자 프로퍼티

- **모든 객체는 __proto__ 접근자 프로퍼티를 통해 자신의 프로토타입인 [[Prototype]] 내부 슬롯에 간접적으로 접근 가능**

### **__proto__ 접근자 프로퍼티다.**

- 내부 슬롯은 프로퍼티 ❌
    
    → 자바스크립트는 원칙적으로 내부 슬롯과 내부 메서드에 직접적으로 접근하거나 호출할 수 있는 방법을 제공하지 않음. **__proto__ 접근자 프로퍼티를 통해 간접적으로 프로토타입에 접근할 수 있음**
    

### **__proto__ 접근자 프로퍼티는 상속을 통해 사용된다.**

- __proto__ 접근자 프로퍼티는 객체가 직접 소유하는 프로퍼티가 아니라 Object.prototype의 프로퍼티
- 모든 객체는 상속을 통해  Object.prototype.__proto__ 접근자 프로퍼티를 사용 가능

### **__proto__ 접근자 프로퍼티를 통해 프로토타입에 접근하는 이유**

- 상호 참조에 의해 프로토타입 체인이 생성되는 것을 방지하기 위해
- 프로토타입 체인은 단방향 linked list로 구현되어야 함(프로퍼티 검색 방향이 한쪽 방향으로만 흘러가야함)

### **__proto__ 접근자 프로퍼티를 코드 내에서 직접 사용하는 것은 권장하지 않음**

- 모든 객체가 __proto__ 접근자 프로퍼티를 사용할 수 있는 것은 아니기 때문에 권장하지 않음
- __proto__ 접근자 프로퍼티 대신 프로토타입의 참조를 취득하고 싶은 경우 Object.getPrototypeOf 메서드를 사용을 권장
- 프로토타입을 교체하고 싶은 경우 Object.setPrototypeOf 메서드 사용을 권장

> [!TIP]
> Object.getPrototypeOf 메서드와 Object.setPrototypeOf 메서드는 get Object.prototype.__proto__ 와 set Object.prototype.__proto__ 의 처리 내용과 일치함
> Object.getPrototypeOf 메서드는 ES5에서도입되었고 IE9 이상에서 지원
> Object.setPrototypeOf 메서드는 ES6에서 도입되었고  IE11 이상에서 지원

### 19.3.2 함수 객체의 prototype 프로퍼티

- 함수 객체만이 소유하는 prototype 프로퍼티는 생성자 함수가 생성할 인스턴스의 프로토타입을 가리킴
- prototype 프로퍼티는 생성자 함수가 생성할 객체(인스턴스)의 프로토타입을 가리킴
    
    → 생성자 함수로서 호출할 수 없는 함수, 즉 non-constructor인 화살표 함수와 ES6 메서드 축약 표현으로 정의한 메서드는 prototype 프로퍼티를 소유하지 않으며 프로토타이도 생성하지 않음
    
- 모든 객체가 가지고 있는(Object.prototype으로부터 상속받은) __proto__ 접근자 프로퍼티와 함수 객체만이 가지고 있는 prototype 프로퍼티는 결국 동일한 프로토타입을 가리킴
    
    
    | 구분                       | 소유        | 값              | 사용 주체      | 사용목적                                                     |
    | -------------------------- | ----------- | --------------- | ------------- | ------------------------------------------------------------ |
    | __proto__ 접근자 프로퍼티   | 모든 객체    | 프로토타입의 참조 | 모든 객체     | 객체가 자신의 프로토타입에 접근 도는 교체하기 위해 사용           |
    | prototype 프로퍼티          | constructor | 프로토타입의 참조 | 생성자 함수   | 생성자 함수가 자신이 생성할 객체의 프로토타입을 할당하기 위해 사용 |

## 19.4 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입

- 생성자 함수에 의해 생성된 인스턴스는 프로토타입의 constructor 프로퍼티에 의해 생성자 함수와 연결됨. 이때constructor 프로퍼티가 가리키는 생성자 함수는 인스턴스를 생성한 생성자 함수
- 리터럴 표기법에 의해 생성된 객체도 상속을 위해 프로토타입이 필요함
    
    → 리터럴 표기법에 의해 생성된 객체도 가상적인 생성자함수를 가짐. 프로토타입은 생성자함수와 더불어 생성되며 prototype, constructor 프로퍼리에 의해 연결되어있기 때문. 즉 **프로토타입과 생성자 함수는 단독으로 존재할 수 없고 언제나 쌍으로 존재**
    
- 프로토타입의 constructor  프로퍼티를 통해 연결되어있는 생성자 함수를 리터럴 표기법으로 생성한 객체를 생성한 생성자 함수로 생각해도 괜찮다.(생성 과정에서 미묘한 차이는 있지만 특성이같음)

## 19.5 프로토타입의 생성시점

- **프로토타입은 생성자함수가 생성되는 시점에 더불어 생성**

### 19.5.1 사용자 정의 생성자 함수와 프로토타입 생성 시점

- **생성자 함수로서 호출할 수 있는 함수, 즉 constructor는 함수 정의가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성 됨**
- 생성자 함수로서 호출할 수 없는 함수,  즉 non-constructor는 프로토타입이 생성되지 않는다
    
    ```jsx
    // 함수 정의(constructor)가 평가 되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성 됨
    console.log(Person.prototype); // {constructor: f}
    // 생성자 함수
    function Person(name) {
    	this.name = name;
    }
    // 화살표 함수는 non-constructor다.
    const Person = name => {
    	this.name = name;
    };
    // non-constructor는 프로토타입이 생성되지 않는다
    console.log(Person.prototype); // undefind
    ```
    

### 19.5.2 빌트인 생성자 함수와 프로토타입 생성 시점

- Object, String, Number, Function, Array, RegExp, Data, Promise 등과 같은 빌트인 생성자 함수도 일반 함수와 마찬가지로 빌트인 생성자 함수가 생성되는 시점에 프로토타입이 생성됨
- 모든 빌트인 생성자 함수는 전역 객체가 생성되는 시점에 생성되며 생성된 프로토타입은 빌트인 생성자 함수의 prototype 프로퍼티에 바인딩
- 객체가 생성되기 이전에 생성자 함수와 프로토타입은 이미 객체화되어 존재
- **이후 생성자 함수 또는 리터럴 표기법으로 객체를 생성하면 프로토타입은 생성된 객체의  [[Prototype]]  내부 스롯에 할당**

## 19.6 객체 생성 방식과 프로토타입의 결정

- 객체는 다양한 방법을 통해 생성이 가능하며 모든 객체는 각 방식마다 세부적인 객체 생성 방식의 차이는 있으나 추상 연산 OrdinaryObjectCreate에 의해 생성된다는 공통점을 가짐
- 프로토타입은 추상 연산 OrdinaryObjectCreate에 전달되는 인수에 의해 결정되며 인수는 객체가 객체가 생성되는 시점에 객체 생성 방식에 의해 결정됨

### 19.6.1 객체 리터럴에 의해 생성된 객체의 프로토타입

- 자바스크립트 엔진은 객체 리터럴을 평가하여 객체를 생성할 때 추상 연산 OrdinaryObjectCreate를 호출
- 이 때 추상 연산  OrdinaryObjectCreate에 전달되는 프로토타입은 Object.prototype
→ 객체 리터럴에 의해 생성되는 객체의 프로토타입은 Object.prototype

### 19.6.2 Object 생성자 함수에 의해 생성된 객체의 프로토타입

- Object 생성자 함수를 인수 없이 호출하면 빈 객체가 생성
- Object 생성자 함수를 호출하면 객체 리터럴과 같이 추상 연산 OrdinaryObjectCreate가 호출
- 이 때 추상 연산 OrdinaryObjectCreate에 전달되는 프로토 타입은 Object.prototype
    
    → Object 생성자 함수에 의해 생성되는 객체의 프로토타입은 Object.prototype
    

### 19.6.3 생성자 함수에 의해 생성된 객체의 프로토타입

- new 연산자와 함께 생성자 함수를 호출하여 인스턴스를 생성하면 추상 연산 OrdinaryObjectCreate가 호출
- 이 때 추상 연산 OrdinaryObjectCreate에 전달되는 프로토 타입은 생성자 함수의 prototype 프로퍼티에 바인딩되어있는 객체
- → 생성자 함수에 의해 생성되는 객체의 프로토타입은 생성자 함수의 prototype 프로퍼티에 바인딩되어있는 객체

## 19.7 프로토타입 체인

![image](https://github.com/deep-dive-to-javascript/deep-dive/assets/66353188/37870d18-a5c4-40a6-b31b-54f3a2a13e8b)

- 자바스크립트는 객체의 프로퍼티(메서드 포함)에 접근하려고 할 때 해당 객체에 접근하려는 프로퍼티가 없다면  **[[Prototype]]  내부 슬롯의 참조를 따라 자신의 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색하는데, 이를 `프로토타입 체인` 이라고 함**
- 프로토타입 체인은 자바스크립트가 객체지향 프로그래밍의 상속을 구현하는 메커니즘
- 프로토타입 체인의 최상위에 위치하는 객체는 언제나 Object.prototype
    
    → 모든 객체는 Object.prototype을 상속받음
    
- **Object.prototype을 프로토타입 체인의 종점(end of prototype chain)이라하며, Object.prototype의 프로토타입인 [[Prototype]]  내부 슬롯의 값은 null**

> [!TIP]
> 프로퍼티가 아닌 식별자는 스코프 체인에서 검색하는데 스코프 체인은 식별자 검색을 위한 메커니즘이라고 할 수 있음
> **스코프 체인과 프로토타입 체인은 서로 연관 없이 별도로 동작하는 것이 아니라 서로 협력하여 식별자와 프로퍼티를 검색하는데 사용**

## 19.8 오버라이딩과 프로퍼티 섀도잉

- 프로토타입 프로퍼티와 같은 이름의 프로퍼티를 인스턴스에 추가하면 프로토타입 체인을 따라 프로토타입 프로퍼티를 검색하여 프로토타입 프로퍼티를 덮어쓰는 것이 아니라 인스턴스 프로퍼티로 추가함
- 상속 관계에 의해 프로퍼티가 가려지는 현상을 프로파티 섀도잉 이라고함
- 프로토타입 프로퍼티를 변경 또는 삭제 하기위해선 하위 객체를 통해 프로토타입 체인으로 접근하는 것이 아니라 프로토타입에 직접 접근해야함

## 19.9 프로토타입의 교체

- 프로토타입은 임의의 다른 객체로 변경이 가능함
    
    → 부모 객체인 프로토타입을 동적으로 변경할 수 있음
    
- 이러한 특징을 활용하여 객체 간의 상속 관계를 동적으로 변경할 수 있는데, 프로토타입은 생성자 함수 또는 인스턴스에 의해 교체가 가능

### 19.9.1 생성자 함수에 의한 프로토타입 교체

```jsx
const Person = (function(){
	function Person(name){
		this.name = name;
	}
	// ① 생성자 함수의 prototype 프로퍼티를 통해 프로토타입을 교체
	Person.prototype = {
		sayHello(){
			console.log(`hi my name is ${this.name}`);
		}
	};
	return Person;
}());
const me = new Person('Park');

// 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴됨
console.log(me.constructor  === Person); // false
// 프로토타입 체인을 따라 Object.prototype의 constructor 프로퍼티가 검색됨
console.log(me.constructor  === Object); // true
```

- ①에서 Person.prototype에 객체 리터럴을 할당 → Person 생성자 함수가 생성할 객체의 프로토타입을 객체 리터럴로 교체
- 프로토타입으로 교체한 객체 리터럴에는 constructor 프로퍼티가 없음(constructor 프로퍼티는 자바스크립트 엔진이 프로토타입을 생성할 때 암묵적으로 추가한 프로퍼티)
→ me 객체의 생성자 함수를 검색하면 Person이 아닌 Object가 나온다.

### 19.9.2 인스턴스에  의한 프로토타입 교체

```jsx
function Person(name){
	this.name = name;
}
const me = new Person('Park');
const parent = {
	sayHello(){
		console.log(`hi my name is ${this.name}`);
	}
};
// ① me 객체의 프로토타입을 parent 객체로 교체
Object.setPrototypeOf(me, parent);
// 위코드는 아래의 코드와 동일하게 동작
// me.__proto__ = parent;
me.sayHello(); // hi! my name is Park

// 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴됨
console.log(me.constructor  === Person); // false
// 프로토타입 체인을 따라 Object.prototype의 constructor 프로퍼티가 검색됨
console.log(me.constructor  === Object); // true
```

- 인스턴스의  __proto__ 접근자 프로퍼티(또는 Object.setPrototypeOf 메서드)를 통해 프로토타입을 교체할 수 있음
- __proto__ 접근자 프로퍼티를 통해 프로토타입을 교체하는 것은 이미 생성된 객체의 프로토타입을 교체하는 것
- 프로토타입으로 교체한 객체에는 constructor 프로퍼티가 없으므로 constructor 프로퍼티와 생성자 함수 간의 연결이 파괴됨
    
    → 프로토타입의 constructor  프로퍼티로 me 객체의 생성자 함수를 검색하면 Person이 아닌 Object가 나옴
    
- 프로토타입 교체 방식에 의해 발생하는 차이
    ![image](https://github.com/deep-dive-to-javascript/deep-dive/assets/66353188/90f44a00-d474-4f19-96f1-9b7a7c404122)
  
## 19.10 instanceof 연산자

```jsx
// 생성자 함수
function Person(name){
	this.name = name;
}
const me = new Person('Park');

// Person.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true
console.log(me instanceof Person); // true
// Object.prototype이 me 객체의 프로토타입 체인 상에 존재하므로 true
console.log(me instanceof Object); // true
```

- instanceof 연산자는 이항 연산자로 좌변에 객체를 가리키는 식별자, 우변에 생성자 함수를 가리키는 식별자를 피연산자로 받음
- 만약 우변의 피연산자 함수가 아닌 경우 TypeError가 발생
- 우변에 생성자 함수의 prototyp에 바이닝된 객체가 좌변의 객체의 프로토타입 체인 상에 존재하면 true, 아니면 false로 평가

## 19.11 직접 상속

### 19.11.1 Object.create에 의한 직접 상속

- Object.create 메서드는 명시적으로 프로토타입을 지정하여 새로운 객체를 생성
- Object.create 메서드도 추상 연산 OrdinaryObjectCreate를 호출함
    
    ```jsx
    /**
     * 지정된 프로토타입 및 프로퍼티를 갖는 새로운 객체를 생성하여 반환
     * @param {Object} prototype - 생성할 객체의 프로토타입으로 지정할 객체 
     * @param {Object} [propertiesObject] - 생성할 객체의 프로퍼티를 갖는 객체
     * @return {Object} 지정된 프로토타입 및 프로퍼티를 갖는 새로운 객체
     */
     Object.create(prototype[, propertiesObject])
    ```
    
- Object.create 메서드는 첫 번째 매개변수에 전달한 객체의 프로토타입 체인에 속하는 객체를 생성 → 객체를 생성하면서 직접적으로 상속을 구현
    - 장점
        - new 연산자 없이도 객체 생성 가능
        - 프로토타입을 지정하면서 객체 생성 가능
        - 객체 리터럴에 의해 생성된 객체도 상속 가능

### 19.11.2 객체 리터럴 내부에서 __proto__에 의한 직접 상속

- ES6에서는 객체 리터럴 내부에서 __proto__ 접근자 프로퍼티를 통해 직접 상속 구현 가능

## 19.12 정적 프로퍼티/메서드

- 생성자 함수로 인스턴스를 생성하지 않아도 참조/호출 할 수 있는 프로퍼티/메서드

## 19.13 프로퍼티 존재 확인

### 19.13.1 in 연산자

```jsx
/**
 * key : 프로퍼티 키를 나타내는 문자열
 * object : 객체로 평가되느 ㄴ표현식
 */
 ket in object
```

```jsx
const person = {
	name : 'Park',
	address: 'Seoul'
}
// person 객체에 name 프로퍼티가 존재
console.log('name' in person); // true
```

- 객체 내 특정 프로퍼티가 존재하는지 여부 확인
- 확인 대상 객체의 프로퍼티 뿐 아니라 확인 대상 객체가 상속받은 모든 프로토타입의 프로퍼티를 확인하므로 주의 필요
- in 연산자 대신 Reflect.has(ES6) 메서드도 사용 가능

### 19.13.2 Object.prototype.hasOwnProperty 메서드

```jsx
console.log(person.hasOwnProperty('name')) //true
console.log(person.hasOwnProperty('ag')) // flase
```

- 인수로 전달받은 프로퍼티 키가 객체 고유의 프로퍼티인 경우에만 true 반환.
- 상속받은 프로토타입의 프로퍼티 키인 경우 false 반환

## 19.14 프로퍼티 열거

### 19.14.1 for…in 문

- 객체의 모든 프로퍼티를 순회하며 열거 가능

> [!TIP]
> for(변수 선언문 in 객체){...}

```jsx
const person = {
	name : 'Park',
	address: 'Seoul'
}
// for ... in 문의 변수 prop에 person 객체의 프로퍼티 키가 할당
for(const ket in person){
	console.log(key + ': ' + person[key];
}
// name: Park
// address: Seoul
```

- 객체의 프로퍼티 개수 만큼 순회하며 for … in 문의 변수 선언문에서 선언한 변수에 프로퍼티 키를 할당
- in 연산자 처럼 순회대상 객체의 프로퍼티 뿐만 아니라 상속받은 프로토타입의 프로퍼티까지 열거
- **객체의 프로토타입 체인 상에 존재하는 모든 프로토타입의 프로퍼티 중에서 프로퍼티 어트리뷰트 [[Enumrable]]의 값이 true인 프로퍼티를 순회하며 열거**
- 배열에는 for … in 문을 사용하지 않고 일반적인 for문이나 for …of 문 또는 Array.prototype.forEach 메서드를 권장

### 19.14.2 Object.keys/values/entries 메서드

- for … in 문은 객체 자신의 고유 프로퍼티뿐 아니라 상속받은 프로퍼티도 열거함 
→ Object.prototype.hasOwnProperty 메서드를 사용하여 객체 자신의 프로퍼티인지 확인 필요
- 객체 자신의 고유 프로퍼티만 열거하기 위해서는 Object.keys/values/entries 메서드 사용을 권장
- Object.keys
    - 객체 자신의 열거 가능한 프로퍼티 키를 배열로 반환
- Object.values(ES8)
    - 객체 자신의 열거 가능한 프로퍼티 값을 배열로 반환
- Object.entries(ES8)
    - 객체 자신의 열거 가능한 프로퍼티 키와 값의 쌍의 배열을 배열에 담아 반환

# 20 - strict mode

## 20.1 strict mode란

- ES5에 추가
- 자바스크립트 언어의 문법을 좀 더 엄격히 적용하여 오류를 발생시킬 가능성이 높거나 자바스크립트 엔진의 최적화 작업에 문제를 일으킬 수 있는 코드에 대해 명시적인 에러를 발생시킴

## 20.2 strict mode의 적용

- 전역의 선두 또는 함수 몸체의 선두에 `use strict` 를 추가
- 전역의 선두에 추가하면 스크립트 전체에 strict mode가 적용됨
- 함수 몸체의 선두에 추가하면 해당 함수와 중첩 함수에 strict mode가 적용됨
- 코드의 선두에 위치시키지 않으면 strict mode가 제대로 동작하지 않음

## 20.3 전역에 strict mode를 적용하는 것은 피하자

- 전역에 적용한 strict mode는 스크립트 단위로 적용됨
- 스크립트 단위로 적용된 strict mode는 해당 스크립트에 한정되어 적용되는데, strict mode 스크립트와 non-strict mode 스크립트를 혼용하는 것은 오류를 발생 시킬 수 있음
- 특히 외부 서드파티 라이브러리를 사용하는 경우 라이브러리가 non-strict mode인 경우도 있기때문에 전역에 적용하는 것을 피하는 것이 나음

## 20.4 함수 단위로 strict mode를 적용하는 것도 피하자

- 어떤 함수는 strict mode를 적용하고 어떤 함수는 strict mode를 적용하지 않는 것은 바람직하지 않음.
- 모든 함수에 일일이 strict mode를 적용하는 것도 번거로운일
    
    **→ strict mode는 즉시 실행 함수로 감싼 스크립트 단위로 적용하는 것이 바람직**
    

## 20.5 strict mode가 발생시키는 에러

### 20.5.1 암묵적 전역

- 선언하지 않은 변수를 참조하면 ReferenceError가 발생

### 20.5.2 변수, 함수, 매개변수의 삭제

- delete 연산자로 변수, 함수, 매개변수를 삭제하면 SyntaxError가 발생

### 20.5.3 매개변수 이름의 중복

- 중복된 매개변수 이름을 사용하면 SyntaxError가 발생

### 20.5.4 with 문의 사용

- with문을 사용하면 SyntaxError가 발생
- with문을 사용하지 않는 것이 좋은 이유
    - with문은 전달된 객체를 스코프 체인에 추가하는데 동일한 객체의 프로퍼티를 반복해서 사용할 때 객체 이름을 생략할 수 있어 코드가 간단해지는 효과가 있지만 성능과 가독성이 나빠지는 문제가 있음

## 20.6 strict mode 적용에 의한 변화

### 20.6.1 일반 함수의 this

- strict mode에서 함수를 일반 함수로서 호출하면 this에 undefined가 바인딩됨
- 생성자 함수가 아닌 일반 함수 내부에서는 this를 사용할 필요가 없기 때문

### 20.6.2 arguments 객체

- strict mode에서는 매개변수에 전달된 인수를 재할당하여 변경해도 arguments 객체에 반영되지 않음

# 💭 느낀점

- 프로토타입 프로퍼티..를 계속 보니 게슈탈트 붕괴 현상이…🤪
- 프로토타입 내용은 확실히 다른 부분에 비해 이해하기 어려운 개념인 것 같다.
- 책에서 계속 객체 생성 방식에 따라 비교를 하는데 많이 헷갈렸다..! 공부를 더 해야겠다고 느꼈음.
