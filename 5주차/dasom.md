# Morden JavaScript Deep Dive

Dasom, 2024.06.09

## 19장 프로토타입 

>  자바스크립트는 __프로토타입 기반__의 객체지향 프로그래밍 언어이다.

### 객체지향 프로그래밍

* 객체지향 프로그래밍: 객체의 집합으로 프로그램을 표현하려는 프로그래밍 패러다임
  * 추상화: 필요한 속성만 간추려 내어 표현하는 것
  * 객체: 상태 데이터와 동작을 하나의 논리적인 단위로 묶은 복합적인 자료구조
    * 상태 데이터 = 프로퍼티
    * 동작 = 메서드

### 상속과 프로토타입

* 상속: 어떤 객체의 프로퍼티 또는 메서드를 다른 객체가 상속받아 그대로 사용하는 것

  ```js
  // getArea 메서드 상속 비교
  
  // case1. 동일한 메서드가 중복 생성됨
  function Circle(radius){
    this.radius = radius;
    this.getArea = function(){
      return Math.PI * this.radius **2 ;
    };
  }
  const circle1 = new Circle(1);
  const circle2 = new Circle(2);
  
  // case2. 프로토타입을 통해 getArea 메서드를 공유
  functions Circle(radius){
    this.radius = radius;
  }
  Circle.prototype.getArea = function () {
    return Math.PI * this.radius ** 2;
  }
  ```

  

### 프로토타입 객체

* 프로토타입 (객체): 객체 간 상속을 구현하기 위해 사용

  * 모든 프로퍼티는 [[Prototype]]이라는 내부 슬롯을 가지며, 내부 슬롯에 저장되는 프로토타입은 객체 생성 방식에 의해 결정됨

  * `__ptoto__`접근자 프로퍼티를 통해 간접적으로 접근 가능 

    * 내부 슬롯 !== 프로퍼티 -> 직접적으로 접근하거나 호출 불가

    ```js
    // 객체의 프로토타입 교체 가능
    const obj = {};
    const perent = { x: 1 };
    
    // getter (get __proto__)
    obj.__proto__;
    // setter (프로토타입 교체)
    obj.__proto__ = parent;
    ```

    * 체크 없이 프로토타입을 교체하게 되면 순환 참조 오류가 발생할 수 있음 -> 간접적으로 프로토타입에 접근하고 교체하도록 구현
    * 단, 코드 내에서 직접 사용하는 것은 권장하지 않음
      * 프로토타입의 참조를 취득하고 싶은 경우: Object.getProgotypeOf
      * 프로토타입을 교체하고 싶은 경우: Object.setPrototypeOf



### 함수 객체의 prototype 프로퍼티

> 일반 객체는 prototype 프로퍼티를 소유하지 않지만, 함수 객체는 prototype 프로퍼티를 소유한다.

* 모든 객체가 가지고 있는 `__prototype__`접근자 프로퍼티와 함수 객체의 prototype 프로퍼티는 결국 동일한 프로토타입을 가리킴

| 구분      | 소유        | 값                | 사용 주체   | 사용 목적                                                    |
| --------- | ----------- | ----------------- | ----------- | ------------------------------------------------------------ |
| __proto__ | 모든 객체   | 프로토타입의 참조 | 모든 객체   | 객체가 자신의 프로토타입에 접근 또는 교체하기 위해 사용      |
| protytpe  | constructor | 프로토타입의 참조 | 생성자 함수 | 생성자 함수가 자신이 생성할 객체(인스턴스)의 프로토타입을 할당하기 위해 사용 |

* constructor 프로퍼티: prototype 프로퍼티로 자신을 참조하고 있는 생성자 함수를 가리킴 

  ```js
  function Person(name){
    this.name = name;
  }
  const me = new Person('Park');
  console.log(me.constructor === Person); // true
  ```

  

### 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입

* 생성자 함수에 의해 생성된 인스턴스는 프로토타입의 constructor 프로퍼티에 의해 생성자 함수와 연결 됨

* 리터럴 표기법에 의해 생성된 객체의 경우, 프로토타입의 constructor 프로퍼티가 가리키는 생성자 함수가 반드시 객체를 생성한 생성자 함수라고 단정지을 수 없음

  ```js
  const obj = {};
  // new Object()로 만든 것이 아니라 객체 리터럴로 생성한 객체이지만,
  // Object 생성자 함수와 연결되어 있음
  console.log(obj.constructor === Object); // true
  ```

* 프로토타입과 생성자 함수는 단독으로 존재할 수 없고 언제나 쌍으로 존재함

* 리터럴 표기법에 의해 생성된 객체의 생성자 함수와 프로토타입

  * 객체 리터럴: Object, Object.prototype
  * 함수 리터럴: Function, Function.prototype
  * 배열 리터럴: Array, Array.prototype
  * 정규 표현식 리터럴: RegExp, RegExp.prototype



### 프로토타입의 생성 시점

* 프로토타입은 생성자 함수가 생성되는 시점에 더불어 생성됨

* 사용자 정의 생성자 함수와 프로토타입 생성 시점

  * 생성자 함수로서 호출할 수 있는 함수 (constructor 함수)는 함수 정의가 평가되어 함수 객체를 생성하는 시점에 프로토타입 생성
  * non-constructor(e.g. 화살표 함수)는 프로토타입이 생성되지 않음

* 빌트인 생성자 함수와 프로토타입 생성 시점

  * 빌트인 생성자 함수(e.g. Object, String, ...)가 생성되는 시점에 프로토타입 생성 
  * 모든 빌트인 생성자 함수는 전역 객체가 생성되는 시점에 생성됨

  > 전역 객체는 코드가 실행되기 이전 단계에 자바스크립트 엔진에 의해 생성되는 특수한 객체 (window or global)



### 객체 생성 방식과 프로토타입의 결정

* 객체 리터럴에 의해 생성된 객체의 프로토타입: Object.prototype
* Object 생성자 함수에 의해 생성된 객체의 프로토타입: Object.prototype
* 생성자 함수에 의해 생성된 객체의 프로토타입: 생성자 함수의 prototype에 바인딩되어 있는 객체



### 프로토타입 체인

* 객체의 프로퍼티에 접근하려고 할 때, 해당 객체에 접근하려는 프로퍼티가 없으면 내부 슬롯의 참조를 따라 부모 역할을 하는 프로토타입의 프로퍼티를 순차적으로 검색

  (cf. 따라서 생성자 함수에 의해 생성된 객체도 Object의 메서드를 사용할 수 있음)

* 프로토타입 체인의 종점인 Object.prototype에서도 프로퍼티를 검색할 수 없다면 undefined 반환

* 프로퍼티가 아닌 식별자는 스코프 체인에서 검색함



### 오버라이딩과 프로퍼티 섀도잉

* 상위 객체의 메서드(프로퍼티 메서드)는 하위 객체에서의 메서드(인스턴스 메서드)로 오버라이딩 = 프로퍼티 섀도잉
* 삭제하는 경우 상위 프로퍼티 메서드는 삭제가 불가 => 즉, get만 가능하며 set 엑세스는 허용되지 않음



### 프로토타입의 교체

* 생성자 함수에 의한 프로토타입의 교체
  * 프로토타입을 교체하면 constructor 프로퍼티와 생성자 함수 간의 연결 파괴
  * 생성자 함수의 prototype 프로퍼티가 교체된 프로토타입을 가리킴
* 인스턴스에 의한 프로토타입의 교체
  * 역시 연결이 파괴됨 
  * 교체시 교체된 프로토타입을 가리키지 않음

* 프토타입 교체를 통해 객체 간의 상속 관계를 동적으로 변경하는 것은 권장되지 않음



### insatnceof 연산자

* `객체 instanceof 생성자함수` : 우변의 생성자 함수의 prototype에 바인딩된 객체가 좌변의 객체의 프로토타입 체인 상에 존재하면 true



### 직접 상속

* Object.create에 의한 직접 상속
  * 객체를 생성하면서 직접적으로 상속 구현
    * new 연산자 없이 객체 생성 가능
    * 프로토타입을 지정하면서 객체 생성 가능
    * 객체 리터럴에 의해 생성된 객체도 상속 가능
* 객체 리터럴 내부에서 `__proto__`에 의한 직접 상속
  * Object.create메서드에서는 두 번째 인자로 프로퍼티를 정의하는 것이 번거로움
  * ES6에서부터 가능



### 정적 프로퍼티/메서드

* 생성자 함수로 인스턴스를 생성하지 않아도 참조/호출 할 수 있는 프로퍼티/메서드
* 생성자 함수가 생성한 인스턴스로 참조/호출할 수 없음
* 동적 프로퍼티/메서드와 달리 MDN 문서에서 .prototype.이 없음



### 프로퍼티 존재 확인

* in 연산자: `key in object`
* Object.prototype.hasOwnProperty 메서드: 예시 ~ `person.hasOwnProperty('name')`



### 프로퍼티 열거

* for ... in

  ```js
  // 프로퍼티 어트리뷰트 중 열거 가능 여부 [[Enumerable]]이 true인 것만 열거
  
  const person = {
    name: 'Park',
    address: 'Seoul',
    __proto__: {age: 20},
    [Sym]: 10
  }
  
  console.log('toString' in Person) // true이지만 열거 불가능
  
  for (const key in person){
    console.log(key + ": " + person[key])
  }
  
  // name: Park
  // address: Seould
  // age: 20
  ```

  cf. 배열에서는 for...in문 대신 for...of문이나 Array.prototype.forEach 사용 권장

* Object.keys/values/entries 메서드

  * for...in문은 상속받은 프로퍼티도 열거함 -> 따라서 객체 자신의 고유 프로퍼티만 열거하기 위해서는 다른 메서드 사용 권장
  * Object.keys: 객체 자신의 열거 가능한 프로퍼티 키를 배열로 반환
  * Object.vlaues: 객체 자신의 열거 가능한 프로퍼티 값을 배열로 반환
  * Object.entries: 객체 자신의 열거 가능한 프로퍼티 키와 값의 쌍을 배열로 반환



## 20장 Strict Mode

* strict mode 적용
  * 전역의 선두 또는 함수 몸체의 선우네 'use stritct'; 추가
  * 전역에 적용한 strict mode는 스크립트 단위로 적용됨
* 주의 사항
  * 전역에 적용시 non-strict mode가 적용된 라이브러리의 오류 야기 가능
  * 함수 단위로 적용 시 함수별 일관성이 떨어짐
  * 따라서 실행 함수로 감싼 스크립트 단위로 적용하는 것을 권장함

* strict mode가 발생시키는 에러
  * 암묵적 전역: 선언하지 않은 변수 참조 시 ReferenceError
  * 변수, 함수, 매개변수의 삭제: delete 연산자로 삭제 시 SyntaxError
  * 매개변수 이름의 중복: SyntaxError
  * with문의 사용: 전달된 객체를 스코프 체인에 추가하는 문. 성능과 가독성이 악화됨. SyntaxError 발생

* strict mode 적용에 의한 변화
  * 일반 함수의 this: undefined가 바인딩 됨. 생성자 함수가 아닌 일반 함수 내부에서는 this를 사용할 필요가 없기 때문
  * arguments 객체: 매개변수에 전달된 인수를 재할당해 변경해도 arguments 객체에 반영되지 않음



## 느낀점

* 업무에서 실제로 활용하는 부분이 아니다보니 예제 코드를 봐도 와닿지 않는 부분이 많았다. 
* 그래서 쉽게 정리한 블로그를 찾아보다 괜찮게 정리한 블로그를 찾았다!
* https://xionwcfm.tistory.com/187#google_vignette



