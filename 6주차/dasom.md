# Morden JavaScript Deep Dive

Dasom, 2024.06.23



오늘의 빈출 단어: 프로퍼티, 메서드

* 프로퍼티: 객체(Object)의 속성 또는 특성을 의미

* 메서드: 객체의 프로퍼티로 함수를 할당하여 정의

  ```js
  const person = {
    name: "dasom" // 프로퍼티: 키 - 값 쌍으로 이루어짐
    greet: function() { // 메서드: 
      console.log("Hello," + this.name)
    }
  }
  
  // person은 객체이고, . 또는 []로 접근한 name은 "dasom"이란 값을 가지고 있는 프로퍼티
  console.log(person.name) // dasom
  // 메서드 호출 역시 객체의 프로퍼티로서 함수를 호출
  person.greet() // "Hello, dasom"
  ```



## 21장 빌트인 객체 

> 자바스크립트 객체의 분류
>
> * 표준 빌트인 객체
> * 호스트 객체: 호스트 객체는 ECMAScript 사양에 정의되어 있지 않지만 자바스크립트 실행 환경에서 추가로 제공하는 객체
> * 사용자 정의 객체: 사용자가 직접 정의한 객체



### 표준 빌트인 객체 

> 표준 빌트인 객체는 ECMAScript 사양에 정의된 객체

대표적인 표준 빌트인 객체: Object, String, Number, Boolean, Symbol, Date, Math, RegExp, Array, Map/Set, WeakMap, WeakSet, Function, Promise, Reflect, Proxy, JSON, Error 등



* Math, Reflect, JSON을 제외한 표준 빌트인 객체: 생성자 함수 객체
  * 생성자 함수 객체인 표준 빌트인 객체: 프로토타입 메서드와 정적 메서드를 제공
  * 그 외 표준 빌트인 객체: 정적 메서드만 제공

⇨ 즉, 빌트인 객체인 Number를 생성자 함수로서 호출하여 생성한 인스턴스가 있다면 Number.prototype의 빌트인 프로토타입 메서드를 사용할 수 있음.

```js
const numObj = new Number(8.27); // Number {8.27}

// console.log(numObj)를 통해 numObj에서도 Number.prototype의 프로토타입 메서드를 확인할 수 있다.

// Number의 정적 메서드
console.log(numObj.isNan(1.7)) // false

// Number의 프로토타입 메서드 (toFixed: 소수점 자리 반올림)
console.log(numObj.toFixed()) // 8
```



### 원시값과 래퍼 객체

* 래퍼 객체: 문자열, 숫자, 불리언 값에 대해 객체처럼 접근하면 생성되는 임시 객체

```js
const str = "hi";

// 원시 타입인 문자열이 래퍼 객체인 String 인스턴스로 변환됨
console.log(str.length) // 2

// 사용 후에는 다시 원시값으로 돌아옴
console.log(typeof str) //string
```

해당 챕터 서두에 밝힌 문자열이나 숫자, 불리언 등 원시값이 있는데도 객체를 생성하는 String, Number, Boolean 등의 표준 빌트인 생성자 함수가 존재하는 이유는? 

> 책에서는 그래서, 생성자 함수를 new 연산자와 함께 호출할 필요가 없으며 권장하지 않는다고 말한다. 이는 존재하는 이유에 대한 답변으로는 충분하지 않다는 생각이 들었다. 
>
> 그래서 존재하는 이유는 뭔지에 대해 챗GPT에게 물어본 결과 답변은 이러하다.
>
> 1. 원시값의 일시적 래핑
>
>    책에서 설명한 부분과 동일하다. 원시값이 임시로 객체를 생성할 수 있게 한다.
>
> 2. 객체로서의 특성 활용
>
>    1번과 큰 의미에서는 동일하다. 객체의 특성을 활용할 수 있게 한다.
>
> 3. 형 변환
>
>    가장 많이 사용할 수 있는 예시이다.  srt = "123"일 때 Number(str)로 형변환을 할 수 있다.
>
> 4. 유연한 프로그래밍 스타일 지원
>
> 그래서 자체적으로 내린 존재 이유는, 가장 마지막인 유연한 프로그래밍 스타일 지원에 있다고 생각한다. 따라서 new 연산자와 함께 굳이 생성하지 않아도 "알아서" 유연하게 사용할 수 있기 때문에 표준 빌트인 생성자 함수가 존재하는 게 아닐까 싶다.

cf. 심벌은 다른 원시값과는 일부 차이가 있음. 추후 33장에서 살펴볼 예정.

cf. null과 undefined는 래퍼 객체를 생성하지 않는다. 객체처럼 사용할 시 에러가 발생한다.

---

### 전역 객체

> 코드가 실행되기 이전 단계에 자바스크립트 엔진에 의해 어떤 객체보다도 먼저 생성되는 특수한 객체. 

cf. 브라우저: window | self | this | frames / Node.js: global => 통일해서 globalthis로 사용 가능



**전역 객체의 특징**

* 전역 객체는 개발자가 의도적으로 생성할 수 없음
* 전역 객체의 프로퍼티를 참조할 때 window (또는 global) 생략 가능
* 전역 객체는 모든 표준 빌트인 객체를 프로퍼티로 가짐 (_console 출력으로 확인 가능_)
* 자바스크립트 실행환경에 따라 추가적으로 프로퍼티와 메서드를 가짐
  * e.g. 브라우저 환경: DOM, Canvas, XMLHTTPRequest 등
* var키워드로 선언한 전역 변수와, 선언하지 않은 변수에 값을 할당한 암묵적 전역, 그리고 전역 함수는 전역 객체의 프로퍼티가 됨
  * 단, let이나 const는 전역 객체의 프로퍼티가 아님.
* 브라우저 환경의 모든 자바스크립트 코드는 하나의 전역 객체 window를 공유함
  * script 태그를 통해 자바스크립트 코드를 분리해도 하나의 전역 객체만을 공유하는 것에는 변함 없음



**빌트인 전역 프로퍼티**

: 전역 객체의 프로퍼티를 의미함 (window 생략 가능)
예시:  `Infinity`, `NaN`, `undefined`



**빌트인 전역 함수**

: 전역에서 호출할 수 있는 빌트인 함수로서, 전역 객체의 메서드

* `eval()`

  * 자바스크립트 코드를 나타내는 문자열을 인수로 전달 받아, 표현식이라면 런타임에 실행하여 값을 생성 / 표현식이 아니라면 런타임에 실행
    * 전역 범위에서 동작하기 때문에 함수의 기존 스코프를 동적으로 수정할 수 있음.
  * 인수가 여러개의 문으로 이루어져 있다면 마지막 결과값을 반환
  * eval 함수를 통해 실행되는 코드는 자바스크립트 엔진에 의해 최적화가 수행되지 않아 사용을 금지 (eval is evil)

* `isFinite()`

  * 유한수이면 true를 반환, 무한수거나 NaN이라면 false 반환

* `isNan()`

* `parseFloat()`

  * 받은 문자열 인수를 실수로 해석하여 반환

* `parseInt()`

  * 두번째 인수로 진법을 전달 할 수 있음

  ```js
  // 10을 2진수로 해석하고 그 결과를 10진수 정수로 반환
  parseInt("10", 2) // 2
  // 10을 8진수로 해석하고 그 결과를 10진수 정수로 반환
  parseInt("10", 8) // 8
  ```

  *  만약 숫자를 2진수 등 기수를 지정하여 변환하고 싶을 때는 Number.prototype.toString 메서드를 이용 (숫자 -> 2진수 숫자 타입으로 변환하는 메서드는 없다.)

    ```js
    const x = 15;
    console.log(x.toString(2)) // "1111"
    parseInt(x.toString(2), 2) // 15
    ```

  * 16진수 리터럴 0x는 16진수로 해석하지만, 2진수 리터럴과 8진수 리터럴은 해석하지 못함

  * 첫번째 문자가 두번째 인수로 전달한 지수로 반환할 수 없다면 NaN 반환

  * 공백이 있다면 첫번째 문자열만 반환

* `encodeURI`, `decodeURI`

  * 완전한 URI의 인코딩과 디코딩
  * 정보를 어떤 시스템에서도 읽을 수 잇는 아스키 문자 셋으로 변환하는 것

* `encodeURIComponent`, `decodeURIComponent`

  * URI 구성 요소를 인수로 전달 받아 인코딩과 디코딩
  * 인수로 전달된 문자열을 쿼리 스트링의 일부로 간주하여 =,?,&까지 인코딩



**암묵적 전역**

* 선언하지 않은 식별자가 마치 전역 변수처럼 동작함

  ```js
  var x = 10;
  function foo() {
    y = 20;
  }
  foo();
  console.log(x + y); // 30 
  ```

  단, y는 전역 객체의 프로퍼티로 추가된 것 뿐. 따라서 변수가 아니므로 변수 호이스팅이 발생하지 않음.

  cf. 실제 개발 환경에서는 Lint 설정을 통해 암묵적 전역을 막는 것이 안전할 것으로 보입니다.



## 22장 this

### this

객체는 상태를 나타내는 프로퍼티와 동작을 나타내는 메서드를 하나의 논리적인 단위로 묶은 복합적인 자료구조

이 중, 메서드는 자신이 속한 객체의 프로퍼티를 참조하고 변경할 수 있어야 함. -> 이를 위해 자신이 속한 객체를 가리키는 식별자를 참조할 수 있어야 함

```js
// 메서드의 자기 참조 방법
const circle = {
  radius: 5;
  getDiameter() {
    return 2 * circle.radius; // 재귀적으로 접근 가능
  }
}

function Circle(radius) {
  ???.radius; // 이런 경우에는 재귀적으로 접근 불가능
}
```

즉, **this: 자신이 속한 객체 또는 자신이 생성할 인스턴스를 가리키는 자기 참조 변수**



### 함수 호출 방식과 this 바인딩

※ this 바인딩은 함수 호출 방식에 의해 동적으로 결정됨

```js
const foo = function() {
  console.log(this);
}

/**
1. 일반 함수 호출
함수 내부의 this는 전역 객체 window를 가리킴
중첩함수, 콜핵함수도 일반 함수 호출 방식으로 호출되면 전역 객체 바인딩
단, strict mode가 적용되었다면 undefined 바인딩
단, 화살표 함수의 this는 상위 스코프의 this를 가리킴 
*/
foo(); //window

/**
2. 메서드 호출
foo함수를 프로퍼티 값으로 할당하여 호출
메서드를 호출한 객체 obj를 가리킴
*/
const obj = {foo};
obj.foo(); // obj

/**
3. 생성자 함수 호출
생성자 함수가 생성한 인스턴스를 가리킴
*/
new foo(); // foo {}

/**
4. Function.prototype.apply/call/bind 메서드에 의한 간접 호출
인수에 의해 결정됨 (첫번째 인수로 전달한 객체)
*/
const bar = {name: "bar"};
foo.call(bar); // bar
foo.apply(bar); // bar
foo.bind(bar)(); // bar (보면, 따로 ()를 써서 일반 함수 호출을 사용한다)

```

**apply, call**

```js
function getThisBinding() {
  console.log(arguments);
  return this;
}

// this로 사용할 객체
const thisArg = {a: 1};

// apply
// 인수를 배열로 묶어 전달
console.log(getThisBinding.apply(thisArg, [1, 2, 3])) // {a: 1}

// call
// 호출할 함수의 인수를 쉼표로 구분한 리스트 형식으로 전달
console.log(getThisBinding.call(thisArg, 1, 2, 3)) // {a: 1}

```

**bind**

```js
function getThisBinding() {
  console.log(arguments);
  return this;
}

// this로 사용할 객체
const thisArg = {a: 1};

// bind
// getThisBinding 함수를 새롭게 생성해 반환 (즉, 함수가 가리키는 this만 바꿈)
console.log(getThisBinding.bind(thisArg)) // getThisBinding
// 명시적으로 호출이 필요함
console.log(getThisBinding.bind(thisArg)()) // {a: 1}

```



**예제 문제**

```js
const name = "Global";

function showName() {
    console.log(this.name); // 출력 값: ?
}

let obj1 = {
    name: "Object 1",
    showName: showName
};

let obj2 = {
    name: "Object 2",
    showName: showName
};

let obj3 = {
    name: "Object 3",
};

obj1.showName(); // 출력 값: ?

const objShowName = obj1.showName;
objShowName(); // 출력 값: ?

obj1.showName.call(obj2); // 출력 값: ?

obj1.showName.apply(obj3); // 출력 값: ?

let boundFunc = obj1.showName.bind({ name: "Bound Object" });
boundFunc(); // 출력 값: ?

showName(); // 출력 값: ?
```



**정답 (스터디 종료 후 업데이트)**

```js

```



## 23장 실행 컨텍스트

### 소스코드의 타입

* 전역 코드
  * 전역에 존재하는 소스 코드. 전역에 정의된 함수, 클래스 등의 내부 코드는 포함하지 않음

* 함수 코드
  * 함수 내부에 존재하는 소스코드. 함수 내부에 중첩된 함수, 클래스 등의 내부 코드는 포함되지 않음

* eval 코드
  * 빌트인 전역 함수인 eval 함수에 인수로 전달되어 실행되는 소스코드

* 모듈 코드
  * 모듈 내부에 존재하는 소스코드. 모듈 내부의 함수, 클래스 등의 내부 코드는 포함하지 않음.




### 소스코드의 평가와 실행

모든 소스코드는 **"소스코드 평가"**와 **"소스코드 실행"** 과정으로 나누어 처리됨

**"소스코드 평가"**

* 실행 컨텍스트를 생성
* 변수, 함수 등의 선언문만 먼저 실행 -> 생성된 변수나 함수 식별자를 키로 실행 컨텍스트가 관리하는 스코프에 등록



**"소스코드 실행"**

* 선언문을 제외한 소스코드가 순차적으로 실행됨
* 실행에 필요한 정보 (변수나 함수의 참조)는 실행 컨텍스트가 관리하는 스코프에서 검색해 취득함
* 변수 값의 변경 등 실행 결과는 실행 컨텍스트가 관리하는 스코프에 등록



이외 부분 블로그 정리 대체: https://velog.io/@somda/FE-%ED%81%B4%EB%A1%9C%EC%A0%80Closures%EB%9E%80-1



## 24장 클로저

이외 부분 블로그 정리 대체: https://velog.io/@somda/FE-%ED%81%B4%EB%A1%9C%EC%A0%80Closures%EB%9E%80-2



### 캡슐화와 정보 은닉

캡슐화

* 객체의 상태를 나타내는 프로퍼티와 프로퍼티를 참조하고 조작할 수 있는 동작인 메서드를 하나로 묶는 것 
* 객체의 특정 프로퍼티나 메서드를 감출 목적으로 사용하기도 해 **정보 은닉**이라고도 함



>대부분의 객체지향 프로그래밍 언어는 클래스를 정의하고, 프로퍼티와 메서드에 대해 public, private, protected와 같은 접근 제한자를 선언해 공개 범위를 한정할 수 있음
>
>하지만, 자바스크립트는 접근 제한자를 제공하지 않음



```js
// case1 (메서드 중복 생성문제)
function Person(name, age) {
  this.name = name; //public
  let _age = age; // private (블록 스코프)
  
  // 인스턴스 메서드(객체 생성마다 중복생성)
    this.sayHi = function() { 
    console.log(`Hi, ${this.name}(${_age})`)
  };
}

// 중복 생성을 막기 위한 프로토타입 메서드
Person.prototype.sayHello = function() {
  // 생성자 함수의 지역변수인 age를 참조할 수 없다
    console.log(`Hi, ${this.name}(${_age})`) 
  };

const me = new Person("Park", 30);
me.sayHi() // Hi, Park(30)
console.log(me.name) // Park : public이라 접근 가능
console.log(me.age); // undefiend : 생성자 함수의 지역변수이기 때문에 외부에서 참조 불가

// case2 (지역변수 값이 변경되는 문제)
const Person = (function(){
  let _age = 0; //private
  
  // 생성자 함수
  function Person(name, age){
      this.name = name; //public
  		_age = age;
  }
  
  Person.prototype.sayHello = function() {
  // age를 참조할 수 있다
    console.log(`Hi, ${this.name}(${_age})`) 
  };
  
  // 생성자 함수를 반환한다
  return Person;
}());

const me = new Person("Park", 30);
me.sayHello() // Hi, Park(30)
console.log(me.name) // Park
console.log(me.age); // undefiend

const you = new Person("Kim", 20);
you.sayHello() // Hi, Kim(20)

// _age 변수 값이 바뀌었다
me.sayHello() // Hi, Park(20)

```

case2 문제가 발생하는 이유

* Person.prototype.sayHello 메서드가 한 번 생성되는 클로저이기 때문.

  > 즉시 실행 함수가 호출될 때 메서드 생성 = 상위 스코프인 실행 컨텍스트의 렉시컬 환경의 참조를 [[Environment]]에 저장 
  >
  > -> 따라서 Person 생성자 함수의 모든 인스턴스가 상속을 통해 호출할 수 있는 메서드의 상위 스코프는 어떤 인스턴스로 호출하더라고 **동일한 상위 스코프를 사용하게 됨**

즉, 자바스크립트는 정보 은닉을 완전하게 지원하지 않음

(cf. ES2019부터 클래스에 private field가 추가되었음)



### 자주 발생하는 실수

_해당 부분은 잘 이해가 되지 않아 결과 코드를 돌려보았다. 그럼에도 `funcs[j]()`로 호출하는 부분이 이해되지 않는다. 배열을 어떻게 호출한 걸까?_



![image-20240622160855655](/Users/ai/Library/Application Support/typora-user-images/image-20240622160855655.png)

![image-20240622161144326](/Users/ai/Library/Application Support/typora-user-images/image-20240622161144326.png)



## 느낀점

저번 어떠한 사정으로 인해 현경님과 발표 순서를 바꾸게 되었는데... 조삼모사라는 과거의 내가 내린 형벌을 받는 기분이었다. 그때 현경님이 말렸을 때 말을 들을 걸.

하지만 그럼에도 과거의 내가 이 부분이 이해가 안 돼 정리했던 블로그가 있었기에 큰 도움을 받았고... 과거의 나는 결국 +1점 -1점으로 도합 0점이 되었다.







아마 발표가 끝나고 느낀점을 발표할 때 쯤엔 21장 내용이 다들 머리에서 사라져있지 않을까 싶다. 그래서 한 번 더 남기는 21장 요약!

> 원시값(e.g. string)이 있음에도 원시값 생성자 함수(String)가(이) 존재하는 이유는 원시값도 객체처럼 유연하게 사용할 수 있게하기 위함이다.