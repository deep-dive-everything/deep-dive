### 25장. 클래스

- 클래스 등장 배경
  - 생성자 함수와 프로토타입을 통해 객체지향 언어의 상속 구현 가능했지만, 클래스 기반 언어에 익숙한 개발자들에게는 혼란스러움.
  - ES6에서 클래스 도입 (이전의 방식을 폐기하는 것이 아닌 추가)
  - 클래스는 생성자 함수보다 엄격하며 추가으로 제공하는 기능들이 있기에 문법적 설탕보다는 새로운 객체 생성 메커니즘으로 보는 것이 합당
- 클래스 정의
  - class 키워드 사용, 일반적으로 파스칼 케이스 사용 (미사용시, 에러나는 것은 아님)
  - 함수로 평가
  - 표현식으로 정의 가능 &rarr; 일급 객체
    - 무명의 리터럴로 생성 가능 (런타입에 생성 가능)
    - 변수, 자료구조에 저장 가능
    - 함수의 매개변수로 전달 가능
    - 함수 반환값으로 사용 가능
  - 몸체에 정의할 수 있는 메서드 : 생성자, 프로토타입 메서드, 정적 메서드

```js
// 클래스 선언문
class Person {}

console.log(typeof Person); // function

// 익명 클래스 표현식
const Person = class {};

// 기명 클래스 표현식
const Person = class MyClass {};

// 클래스 선언문
class Person {
  // 생성자
  constructor(name) {
    // 인스턴스 생성 및 초기화
    this.name = name; // name 프로퍼티는 public하다.
  }

  // 프로토타입 메서드
  sayHi() {
    console.log(`Hi! My name is ${this.name}`);
  }

  // 정적 메서드
  static sayHello() {
    console.log('Hello!');
  }
}

// 인스턴스 생성
const me = new Person('Lee');

// 인스턴스의 프로퍼티 참조
console.log(me.name); // Lee
// 프로토타입 메서드 호출
me.sayHi(); // Hi! My name is Lee
// 정적 메서드 호출
Person.sayHello(); // Hello!
```

- 클래스 호이스팅

  - 호이스팅 발생 &rarr; let, const 로 선언한 변수와 같이 호이스팅 발생 &rarr; TDZ

  ``` js
  const Person = '';
  
  {
    // 호이스팅이 발생하지 않는다면 ''이 출력되어야 한다.
    console.log(Person);
    // ReferenceError: Cannot access 'Person' before initialization
  
    // 클래스 선언문
    class Person {}
  }
  ```

- 인스턴스 생성 (클래스 존재 이유)

  - new 연산자 필수 사용 

  ```js
  class Person {}
  
  // 인스턴스 생성
  const me = new Person();
  console.log(me); // Person {}
  
  // 클래스를 new 연산자 없이 호출하면 타입 에러가 발생한다.
  const me = Person();
  // TypeError: Class constructor Person cannot be invoked without 'new'
  ```

  - 클래스 표현식(변수에 할당하거나 다른 표현식 내에서 사용할 수 있는 방식으로 클래스를 정의)으로 정의된 클래스의 경우 클래스를 가르키는 식별자를 사용해 인스터스 생성

  ```js
  const Person = class MyClass {};
  
  // 함수 표현식과 마찬가지로 클래스를 가리키는 식별자로 인스턴스를 생성해야 한다.
  const me = new Person();
  
  // 클래스 이름 MyClass는 함수와 동일하게 클래스 몸체 내부에서만 유효한 식별자다.
  console.log(MyClass); // ReferenceError: MyClass is not defined
  
  const you = new MyClass(); // ReferenceError: MyClass is not defined
  ```

- 클래스 몸체 메서드

  - constructor(생성자)
    - constructor 이름 변경 불가능
    - 1 클래스 1 생성자
    - 생략 가능 (생략 시, 빈 생성자 암묵적 정의 / 인스턴스 초기화 하고 싶다면 생략하면 안 됨) 
    - 클래스 외부에서 인스턴스 프로퍼티 초기값 전달하기 위해서는 생성자 매개변수로 가능
    - 별도의 반환문 없어야 함 ( 클래스 기본 동작을 훼손 )

  ```js
  class Person {
    // 생성자
    constructor(name) {
      // 인스턴스 생성 및 초기화
      this.name = name;
    }
  }
  
  class Person {
    constructor() {}
    constructor() {}
  }
  // SyntaxError: A class may only have one constructor
  
  class Person {
    // constructor를 생략하면 다음과 같이 빈 constructor가 암묵적으로 정의된다.
    constructor() {}
  }
  
  // 빈 객체가 생성된다.
  const me = new Person();
  console.log(me); // Person {}
  
  class Person {
    constructor(name, address) {
      // 인수로 인스턴스 초기화
      this.name = name;
      this.address = address;
    }
  }
  
  class Person {
    constructor() {
      // 고정값으로 인스턴스 초기화
      this.name = 'Lee';
      this.address = 'Seoul';
    }
  }
  
  // 인스턴스 프로퍼티가 추가된다.
  const me = new Person();
  console.log(me); // Person {name: "Lee", address: "Seoul"}
  
  // 인수로 초기값을 전달한다. 초기값은 constructor에 전달된다.
  const me = new Person('Lee', 'Seoul');
  console.log(me); // Person {name: "Lee", address: "Seoul"}
  ```

  - 프로토타입 메서드

    - 클래스 몸체에 정의한 메서드는 기본적으로 프로토타입 메서드
    - 클래스가 생성한 인스턴스는 프로토타입 체인의 일원 &rarr; 클래스도 생성자 함수와 마찬가지로 프로토타입 기반의 객체 생성 메커니즘

    ```js
    class Person {
      // 생성자
      constructor(name) {
        // 인스턴스 생성 및 초기화
        this.name = name;
      }
    
      // 프로토타입 메서드
      sayHi() {
        console.log(`Hi! My name is ${this.name}`);
      }
    }
    
    const me = new Person('Lee');
    me.sayHi(); // Hi! My name is Lee
    
    // me 객체의 프로토타입은 Person.prototype이다.
    Object.getPrototypeOf(me) === Person.prototype; // -> true
    me instanceof Person; // -> true
    
    // Person.prototype의 프로토타입은 Object.prototype이다.
    Object.getPrototypeOf(Person.prototype) === Object.prototype; // -> true
    me instanceof Object; // -> true
    
    // me 객체의 constructor는 Person 클래스다.
    me.constructor === Person; // -> true
    ```

  - 정적 메서드

    - static 키워드 사용
    - 인스턴스를 생성하지 않아도 호출 가능한 메서드
    - 생성 시점 : 클래스와 동일 (클래스 정의가 평가되는 시점)
    - 클래스로 호출, 인스턴스로 호출 불가능
    - 표준 빌트인 객체(Math, Number, JSON...)의 유틸리티 함수
      - 충돌 가능성 감소
      - 관련 함수 구조화

    ```js
    class Person {
      // 생성자
      constructor(name) {
        // 인스턴스 생성 및 초기화
        this.name = name;
      }
    
      // 정적 메서드
      static sayHi() {
        console.log('Hi!');
      }
    }
    
    // 정적 메서드는 클래스로 호출한다.
    // 정적 메서드는 인스턴스 없이도 호출할 수 있다.
    Person.sayHi(); // Hi!
    
    // 인스턴스 생성
    const me = new Person('Lee');
    me.sayHi(); // TypeError: me.sayHi is not a function
    ```

  - 정적 메서드 vs 프로토타입 메서드

    - 소속 프로토타입 체인이 다름
    - 호출 방법
      - 정적 메서드 : 클래스로 호출
      - 프로토타입 메서드 : 인스턴스로 호출
    - 인스턴스 프로퍼티 참조 여부
      - 정적 메서드 : 인스턴스 프로퍼티 참조 불가
      - 프로토타입 메서드 : 인스턴스 프로퍼티 참조 가능
    - this 바인딩
      - 정적 메서드 : 클래스
      - 프로토타입 메서드 : 호출 객체

    ```js
    class Square {
      // 정적 메서드
      static area(width, height) {
        return width * height;
      }
    }
    
    console.log(Square.area(10, 10)); // 100
    
    class Square {
      constructor(width, height) {
        this.width = width;
        this.height = height;
      }
    
      // 프로토타입 메서드
      area() {
        return this.width * this.height;
      }
    }
    
    const square = new Square(10, 10);
    console.log(square.area()); // 100
    ```

  - 클래스에서 정의한 메서드의 특징
    - function키워드를 생략한 메서드 축약 표현을 사용한다.
    - 객체 리터럴과는 다르게 클래스에 메서드를 정의할 때는 콤마가 필요 없다.
    - 암묵적으로 strict mode로 실행된다.
    - for…in문이나 Object.keys메서드 등으로 열거할 수 없다.([[Enumerable]]값이 false다.)
    - 내부 메서드 [[Construct]]를 갖지 않는 non-constructor다.(new연산자와 함께 호출할 수 없다.)

- 클래스의 인스턴스 생성 과정
  1. 인스턴스 생성과 this 바인딩
     - new 연산자로 클래스 호출 시, 빈 객체 생성 &rarr; this 바인딩
  2. 인스턴스 초기화
     - 생성자 내부 코드가 실행되며 this에 바인딩된 인스턴스 초기화
  3. 인스턴스 반환
     - 클래스의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this 암묵적으로 반환

- 인스턴스 프로퍼티 
  - constructor 내부에서 정의
  - 언제나 public
  - 생성자 내부에서 정의(외부 초기값으로 초기화 필요) 방식과 클래스 필드 정의 방식
- 접근자 프로퍼티
  - 값을 읽거나 저장할 때 사용하는 접근자 함수로 구성
- 클래스 필드
  - 클래스 필드 : 클래스 기반 객체 지향 언어에서 클래스가 생성할 인스턴스 프로퍼티
  - 클래스 기반 객체 지향 언어의 this는 언제나 클래스가 생성할 인스턴스를 가리킴 &rarr; 클래스 필드임을 명확하게 드러내길 위해
  - 자바스크립트 클래스 몸체에는 메서드만 선언 가능했었음 &rarr; 현재는 가능
  - this에 클래스 필드 바인딩은 불가
    - this는 생성자와 메서드 내에서만 유효
  - 참조하는 경우는 this 반드시 사용
  - 초기화는 constructor 에서 해야 함
  - 함수를 할당하는 것은 비권장 (인스턴스 메서드가 되기 때문)

```js
class Person {
  // 클래스 필드 정의
  name = 'Lee';
}

const me = new Person('Lee');

class Person {
  // this에 클래스 필드를 바인딩해서는 안된다.
  this.name = ''; // SyntaxError: Unexpected token '.'
}

class Person {
  // 클래스 필드
  name = 'Lee';

  constructor() {
    console.log(name); // ReferenceError: name is not defined
  }
}

new Person();
```

- private 필드 정의 제안

  - 필드 앞 # 사용
  - 직접 접근 불가능
  - 클래스 내부에서만 참조
  - 접근자 프로퍼티를 통해 간접적으로 접근 가능

- 상속에 의한 클래스 확장

  - 기본 클래스를 상속 받아 새로운 클래스를 확장하여 정의
  - extends 키워드 사용 
    - 서브/파생/자식 클래스 extends 수퍼/베이스/부모 클래스
    - 인스턴스 프로토타입 체인, 프로토타입 메서드, 정적 메서드 상속 가능
    - 생성자 함수 상속 받아 클래스 확장 가능
      - extends 키워드 앞에는 무조건 클래스
      - 화살표 함수는 불가능

  ```js
  class Animal {
    constructor(age, weight) {
      this.age = age;
      this.weight = weight;
    }
  
    eat() { return 'eat'; }
  
    move() { return 'move'; }
  }
  
  // 상속을 통해 Animal 클래스를 확장한 Bird 클래스
  class Bird extends Animal {
    fly() { return 'fly'; }
  }
  
  const bird = new Bird(1, 5);
  
  console.log(bird); // Bird {age: 1, weight: 5}
  console.log(bird instanceof Bird); // true
  console.log(bird instanceof Animal); // true
  
  console.log(bird.eat());  // eat
  console.log(bird.move()); // move
  console.log(bird.fly());  // fly
  ```

  - super 키워드

    - 수퍼클래스의 constructor를 호출
    - super 참조 시, 수퍼 클래스 호출 가능

    ```js
    // 수퍼클래스
    class Base {
      constructor(a, b) {
        this.a = a;
        this.b = b;
      }
    }
    
    // 서브클래스
    class Derived extends Base {
      // 다음과 같이 암묵적으로 constructor가 정의된다.
      // constructor(...args) { super(...args); }
    }
    
    const derived = new Derived(1, 2);
    console.log(derived); // Derived {a: 1, b: 2}
    ```

    - 서브클래스에서 생성자 생략하지 않은 경우, 반드시 super 호출
    - 서브클래스에 생성자에서 super 호출 후 this 참조 가능
    - super는 반드시 서브클래스 생성자에서만 호출

    ```js
    class Base {}
    
    class Derived extends Base {
      constructor() {
        // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
        console.log('constructor call');
      }
    }
    
    const derived = new Derived();
    
    class Base {}
    
    class Derived extends Base {
      constructor() {
        // ReferenceError: Must call super constructor in derived class before accessing 'this' or returning from derived constructor
        this.a = 1;
        super();
      }
    }
    
    const derived = new Derived(1);
    
    class Base {
      constructor() {
        super(); // SyntaxError: 'super' keyword unexpected here
      }
    }
    
    function Foo() {
      super(); // SyntaxError: 'super' keyword unexpected here
    }
    ```

  - super 참조

    - 수퍼클래스 메서드 호출 가능

    ```js
    // 수퍼클래스
    class Base {
      static sayHi() {
        return 'Hi!';
      }
    }
    
    // 서브클래스
    class Derived extends Base {
      static sayHi() {
        // super.sayHi는 수퍼클래스의 정적 메서드를 가리킨다.
        return `${super.sayHi()} how are you doing?`;
      }
    }
    
    console.log(Derived.sayHi()); // Hi! how are you doing?
    ```

  - 상속 클래스의 인스턴스 생성 과정
    1. 서브 클래스 super 호출
       - 수퍼클래스에게 인스턴스 생성을 위임
    2. 수퍼클래스의 인스턴스 생성
    3. 수퍼클래스의 constructor 실행, this 바인딩 된 인스턴스 초기화
    4. super 호출 종료, 서브 클래스 constructor로 복귀
    5. super가 반환한 인스턴스와 this 바인딩
    6. 인스턴스 반환

- 표준 빌트인 생성자 함수 확장

  ```js
  // Array 생성자 함수를 상속받아 확장한 MyArray
  class MyArray extends Array {
    // 모든 메서드가 Array 타입의 인스턴스를 반환하도록 한다.
    static get [Symbol.species]() { return Array; }
  
    // 중복된 배열 요소를 제거하고 반환한다: [1, 1, 2, 3] => [1, 2, 3]
    uniq() {
      return this.filter((v, i, self) => self.indexOf(v) === i);
    }
  
    // 모든 배열 요소의 평균을 구한다: [1, 2, 3] => 2
    average() {
      return this.reduce((pre, cur) => pre + cur, 0) / this.length;
    }
  }
  
  const myArray = new MyArray(1, 1, 2, 3);
  
  console.log(myArray.uniq() instanceof MyArray); // false
  console.log(myArray.uniq() instanceof Array); // true
  
  // 메서드 체이닝
  // uniq 메서드는 Array 인스턴스를 반환하므로 average 메서드를 호출할 수 없다.
  console.log(myArray.uniq().average());
  // TypeError: myArray.uniq(...).average is not a function
  ```



### 26장. ES6 함수의 추가 기능

- ES6 이전의 모든 함수는 일반 함수 및 생성자 함수로서 호출이 가능 &rarr; 문법적으로 성능적으로 문제 (생성자 함수로 호출하지 않아도 프로토타입 객체 생성)

- 화살표 함수

  - function 키워드 대신 화살표를 사용하고 기존 함수보다 간단하게 동작하는 함수
  - 콜백 함수 내부에서 this가 전역 객체를 가리키는 문제의 대안으로 유용
  - 즉시 실행 함수로 활용 가능
  - 고차함수 인수로 전달하면 표현이 간결하고 가독성이 좋음.
  - vs 일반 함수
    - 화살표 함수는 인스턴스를 생성할 수 없는 non-constructor다.
    - 중복된 매개변수 이름을 선언 불가능
    - 화살표 함수는 함수 자체의 this, arguments, super, new.target 바인딩을 갖지 않는다.
      - this : 화살표 함수 내부에서 this를 참조하면 상위스코프의 this를 그대로 참조한다. &rarr; lexical this라 한다. 렉시컬 스코프와 같이 화살표 함수의 this가 함수가 정의된 위치에 의해 결정된다는 것을 의미한다.
      - super : 상위 스코프 super
      - arguments : 상위 스코프 arguments &rarr; 가변 인자 함수를 구현할 때는 Rest 파라미터 사용

- Rest 파라미터

  - 나머지 매개변수는 매개변수 이름 앞에 세개의 점 ...을 붙여서 정의한 매개변수를 의미
  - 함수에 전달된 인수들의 목록을 배열로 전달받음
  - 일반 매개변수와 Rest 파라미터는 함께 사용 가능
  - 반드시 마지막 파라미터여야 함
  - Rest 파라미터는 단 하나만 선언
  -  Rest 파라미터는 함수 정의 시 선언한 매개변수 개수를 나타내는 함수 객체의 length 프로퍼티에 영향을 주지 않음
  - ES6에서는 rest 파라미터를 사용하여 가변 인자 함수의 인수 목록을 배열로 직접 전달받기 가능
  - 기본값 지정 불가능

- 매개변수 기본값

  - 함수 호출 시, 매개변수 개수만큼 인수가 전달되는 것이 베스트 &rarr; 그렇지 않은 경우에 에러가 발생하지는 않음.
  - 인수가 전달되지 않은 매개변수 값은 undefined &rarr; 방어 코드 필요 &rarr; 기본값 할당

  ```js
  function sum(x, y) {
    // 인수가 전달되지 않아 매개변수의 값이 undefined인 경우 기본값을 할당한다.
    x = x || 0;
    y = y || 0;
  
    return x + y;
  }
  
  console.log(sum(1, 2)); // 3
  console.log(sum(1));    // 1
  ```



### 느낀점

----

클래스가 나온 배경을 학습함으로 클래스를 용도에 맞게 사용해야하는 이유와 필요성에 대해 공감할 수 있었습니다. 생성자 함수와 차이점을 중심으로 클래스에 대해 자세하게 알아볼 수 있어서 좋았습니다.
