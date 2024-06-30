## 25장. 클래스
### 25.1 클래스는 프로토타입의 문법적 설탕인가?
- ES5에서는 클래스 없이도 생성자 함수와 프로토타입을 통해 객체지향 언어의 상속을 구현할 수 있다.
- 클래스 기반 언어에 익숙한 프로그래머들이 혼란을 느끼지 않도록 ES6부터 클래스가 추가되었다.
- 클래스는 생성자 함수와 매우 유사하게 동작하지만 몇가지 차이가 있다.
  - 클래스는 new 연산자 없이 호출하면 에러가 발생한다.
  - 클래스는 상속을 지원하는 extends와 super 키워드를 제공한다.
  - 클래스는 호이스팅이 발생하지 않는 것처럼 동작한다.
  - 클래스 내의 모든 코드는 암묵적으로 strict mode로 실행된다.
  - 클래스의 constructor, 프로토타입 메서드, 정적 메서드는 모두 프로퍼티 어트리뷰트 [[Enumerable]]의 값이 false로 설정된다.

### 25.2 클래스 정의
- 클래스는 class 키워드를 사용하여 정의한다.
- 클래스 이름은 생성자 함수와 마찬가지로 파스칼 케이스를 사용하는 것이 일반적이다.
```javascript
class Person {}

// 일반적이지는 않지만 표현식으로 클래스를 정의할 수도 있다.
// 익명 클래스 표현식
const Person = class {};

// 기명 클래스 표현식
const Person = class MyClass {};
```
- 클래스를 표현식으로 정의할 수 있다는 것은 클래스가 값으로 사용될 수 있는 일급 객체라는 것을 의미한다.
    - 클래스는 무명의 리터럴로 생성할 수 있다. 즉, 런타임에 생성이 가능하다.
    - 변수나 자료구조(객체, 배열 등)에 저장할 수 있다.
    - 함수의 매개변수로 전달할 수 있다.
    - 함수의 반환값으로 사용할 수 있다.
- 클래스 몸체에는 0개 이상의 메서드만 정의할 수 있다.
- 클래스 몸체에서 정의할 수 있는 메서드는 constructor, 프로토타입 메서드, 정적 메서드가 있다.
```javascript
// 클래스 선언문
class Person {
    constructor(name){
        //인스턴스 생성 및 초기화
        this.name = name; //name 프로퍼티는 public하다.
    }
    
    //프로토타입 메서드
    sayHi(){
        console.log(`Hi! My name is ${this.name}`);
    }
    
    //정적 메서드
    static sayHello(){
        console.log('Hello');
    }
}

const me = new Person('Lee');

console.log(me.name) // Lee
console.log(me.sayHi());
Person.sayHello()
```

### 25.3 클래스 호이스팅
- 클래스는 함수로 평가된다.
```javascript
console.log(typeof Person); // function
```
- 클래스 선언문으로 정의한 클래스는 함수 선언문과 같이 소스코드 평가 과정, 즉 런타임 이전에 먼저 평가되어 함수 객체를 생성한다.
- 이때 클래스가 평가되어 생성된 함수 객체는 생성자 함수로서 호출할 수 있는 함수, 즉 constructor이다.
- 생성자 함수로서 호출할 수 있는 함수는 함수 정의가 평가되어 함수 객체를 생성하는 시점에 프로토타입도 더불어 생성된다.
- 클래스 선언문은 마치 호이스팅이 발생하지 않는 것처럼 보이나 그렇지 않다. let, const 키워드로 선언한 변수처럼 호이스팅되어 TDZ에 빠지기 때문에 호이스팅이 발생하지 않는 것처럼 동작한다.

### 25.4 인스턴스 생성
- 클래스는 생성자 함수와 마찬가지로 new 연산자와 함께 호출되어 인스턴스를 생성한다.
- 클래스는 new 연산자 없이 호출하면 에러가 발생한다.
```javascript
class Person {}

// new 연산자 없이 호출하면 에러가 발생한다.
// Uncaught TypeError: Class constructor
// Person cannot be invoked without 'new'
Person();

const Person = class MyClass {};

// 함수 표현식과 마찬가지로 클래스를 가리키는 식별자로 인스턴스를 생성해야 한다.
const me = new Person();

// 클래스 이름 MyCLass는 함수와 동일하게 클래스 몸체 내부에서만 유효한 식별자다.
console.log(MyClass); // ReferenceError: MyClass is not defined
```

### 25.5 메서드
- 클래스 몸체에는 0개 이상의 메서드만 정의할 수 있다.
- 클래스 몸체에서 정의할 수 있는 메서드는 constructor, 프로토타입 메서드, 정적 메서드가 있다.

#### 25.5.1 constructor
- constructor는 인스턴스를 생성하고 초기화하기 위한 특수한 메서드이다.
- Constructor는 이름을 변경할 수 없다.

```javascript
console.log(typeof Person); // function
console.dir(Person)
```

- prototype 프로퍼티가 가리키는 프로토타입 객체의 constructor 프로퍼티는 클래스 자신을 가리키고 있다.
- 이는 클래스가 인스턴스를 생성하는 생성자 함수라는 것을 의미한다.
- 클래스가 평가되어 생성된 함수 객체나 클래스가 생성한 인스턴스에는 constructor 프로퍼티가 없다. 이는 클래스 몸체에 정의한 constructor가 단순한 메서드가 아니라는 것을 의미한다.
- constructor는 메서드로 해석되는 것이 아니라 클래스가 평가되어 생성한 함수 객체코드의 일부가 된다.
- 다시 말해, 클래스 정의가 평가되면 constructor의 기술된 동작을 하는 함수 객체가 생성된다.
- constructor는 생성자 함수와 유사하지만 몇 가지 차이가 있다.
  - constructor는 클래스 내에 한 번만 정의할 수 있다.
  - constructor는 생략할 수 있다.
  - 프로퍼티가 추가되어 초기화된 인스턴스를 생성하려면 constructor 내부에서 this에 프로퍼티를 추가한다.

#### 25.5.2 프로토타입 메서드
- 클래스 몸체에 정의한 메서드는 클래스가 생성한 인스턴스의 프로토타입 객체의 프로퍼티가 된다.
- 프로토타입 메서드는 인스턴스의 프로토타입 객체의 프로퍼티가 된다.

#### 25.5.3 정적 메서드
- 정적 메서드는 인스턴스를 생성하지 않아도 호출할 수 있는 메서드이다.
- 정적 메서드는 클래스의 인스턴스가 아닌 클래스에 바인딩된 메서드이다.

#### 25.5.4 정적 메서드와 프로토타입 메서드의 차이
1. 정적 메서드와 프로토타입 메서드는 자신이 속해 있는 프로토타입 체인이 다르다.
2. 정적 메서드는 클래스로 호출하고 프로토타입 메서드는 인스턴스로 호출한다.
3. 정적 메서드는 인스턴스 프로퍼티를 참조할 수 없지만 프로토타입 메서드는 인스턴스 프로퍼티를 참조할 수 있다.
- 정적 메서드는 클래스의 인스턴스와 관계없는 독립적인 기능을 제공하기 위해 사용한다.
- 클래스 또는 생성자 함수를 하나의 네임스페이스로 사용하여 정적 메서드를 모아 놓으면 이름 충돌 가능성을 줄여주고 클래스의 역할과 책임을 명확하게 분리할 수 있다.

#### 25.5.5 클래스에서 정의한 메서드의 특징
1. function 키워드를 생략한 메서드 축약 표현을 사용할 수 있다.
2. 객체 리터럴과는 다르게 클래스 몸체에 메서드를 추가할 때는 콤마가 필요 없다.
3. 암묵적으로 strict mode로 실행된다.
4. for...in 문이나 Object.keys 메서드 등으로 열거할 수 없다.
5. 내부 메서드 [[Construct]]를 갖지 않는 non-constructor이다. 따라서 new 연산자와 함께 호출할 수 없다.

### 25.6 클래스의 인스턴스 생성 과정
1. 인스턴스 생성과 this 바인딩
- new 연산자와 함께 클래스를 호출하면 암묵적으로 빈 객체가 생성된다.
- 이 빈 객체가 바로 클래스가 생성한 인스턴스다.
- 이때 클래스가 생성한 인스턴스의 프로토타입으로 클래스의 Prototype 프로퍼티가 가리키는 객체가 설정된다.
- 생성된 인스턴스는 this에 바인딩된다. 따라서 constructor 내부의 this는 클래스가 생성한 인스턴스를 가리킨다.
2. 인스턴스 초기화
- constructor 내부 코드가 실행되어 this에 바인딩되어 있는 인스턴스를 초기화한다.
- 즉, this에 바인딩 되어 있는 인스턴스에 프로퍼티를 추가하고 constructor가 인수로 전달받은 초기값으로 프로퍼티를 초기화한다.
3. 인스턴스 반환
- 클래스의 모든 처리가 끝나면 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.

### 25.7 프로퍼티
#### 25.7.1 인스턴스 프로퍼티
- 인스턴스 프로퍼티는 constructor 내부에서 정의해야 한다.
- ES6에서는 public, private, protected 등의 접근 제한자를 지원하지 않는다.

#### 25.7.2 접근자 프로퍼티
- 접근자 프로퍼티는 자체적으로는 값을 갖지 않고 다른 데이터 프로퍼티의 값을 읽거나 저장할 때 사용하는(getter, setter) 접근자 함수로 구성되어 있다.
- 이때 getter와 setter 이름은 인스턴스 프로퍼티처럼 사용된다. 다시 말해 getter는 호출되는 것이 아니라 프로퍼티처럼 참조하는 형식으로 사용하며, 참조 시에 내부적으로 Getter 함수가 호출된다.

```javascript
class Person {
    constructor(name){
        this._name = name;
    }
    
    get name(){
        return this._name;
    }
    
    set name(name){
        this._name = name;
    }
}

const me = new Person('Lee');
// 접근자 프로퍼티 name에 접근하면 getter가 호출된다.
console.log(me.name); // Lee
// 접근자 프로퍼티 name에 값을 할당하면 setter가 호출된다.
me.name = 'Kim';
console.log(me.name); // Kim
```

#### 25.7.3 클래스 필드 정의 제안
- 클래스 필드는 클래스 기반 객체지향 언어에서 클래스가 생성할 인스턴스의 프로퍼티를 가리키는 용어다.
- 자바의 클래스 필드는 마치 클래스 내부에서 변수처럼 사용된다.
```java
public class Person {
    // 클래스 필드
    private String name;
    private int age;
}

Person(String name, int age){
    this.name = name;
    this.age = age;
}

public String getName(){
    return name;
}
```
- 클래스 기반 언어의 this는 언제나 클래스가 생성할 인스턴스를 가리킨다.
- this는 주로 클래스 필드가 생성자 또는 메서드의 매개변수 이름과 동일할 때 클래스 필드와 매개변수를 구분하기 위해 사용된다.
- 자바스크립트의 클래스 몸체에는 메서드만 선언할 수 있다.
```javascript
class Person {
  // 클래스 필드 정의
  name = 'Lee';
}

const me = new Person('Lee');
// 원래는 syntax error가 발생하지만 최신 브라우저와 Node.js 환경에서는 정상 동작한다.

```
- 클래스 몸체에서 클래스 필드를 정의하는 경우 this에 클래스 필드를 바인딩해서는 안 된다.
- this는 클래스의 constructor 메서드 내에서만 유효하다.
```javascript
class Person {
    // this에 클래스 필드를 바인딩해서는 안된다.
    this.name = 'Lee'; // SyntaxError: Unexpected token '.'
}
```
- 클래스 필드에 초기값을 할당하지 않으면 Undefined를 갖는다.
```javascript
class Person {
    name;
}

const me = new Person();
console.log(me.name); // undefined
```
- 함수는 일급 객체이므로 클래스 필드에 함수를 할당할 수 있다.
```javascript
class Person {
    name = 'Lee';
    sayHi = function(){
        console.log(`Hi! My name is ${this.name}`);
    }
}

const me = new Person();
me.sayHi(); // Hi! My name is Lee
```
- 이처럼 클래스 필드에 함수를 할당하는 경우, 이 함수는 프로토타입 메서드가 아닌 인스턴스 메서드가 된다.
- 모든 클래스 필드는 인스턴스 프로퍼티가 되기 때문이다.
- 따라서 클래스 필드에 함수를 할당하는 것은 권장되지 않는다.

#### 25.7.4 private 필드 정의 제안
- 자바스크립트는 접근 제한자를 지원하지 않으므로 인스턴스 프로퍼티는 모두 public하다.
```javascript
class Person {
    // private 필드 정의
    #name = '';

    constructor(name){
        // private 필드 참조
        this.#name = name;
    }

    // private 필드 참조
    sayHi(){
        console.log(`Hi! My name is ${this.#name}`);
    }
}
```
- typescript에서는 접근 제한자를 모두 지원한다.
- private 필드는 반드시 클래스 몸체에 정의해야 한다. private 필드를 직접 constructor에 정의하면 에러가 발생한다.
```javascript
class Person {
    constructor(name){
        this.#name = name; // SyntaxError: Private field '#name' must be declared in an enclosing class
    }
}
```

#### 25.7.5 static 필드 정의 제안
- 새로운 표준 사양인 static class features가 TC39의 stage 3 단계에 제안되어 있다.
- 최신 브라우저와 최신 Node.js 환경에서는 이미 구현되어있다.

### 25.8 상속에 의한 클래스 확장
#### 25.8.1 클래스 상속과 생성자 함수 상속
- 상속에 의한 클래스 확장은 기존 클래스를 상속받아 새로운 클래스를 확장하여 정의하는 것이다.
- 프로토타입 기반 상속은 의사 클래스 상속 패턴을 사용하여 클래스 확장을 흉내내기도 한다.

#### 25.8.2 extends 키워드
- extends 키워드는 클래스의 상속을 위해 사용된다.
- 서브클래스: 상속을 통해 확장된 클래스
- 슈퍼클래스: 서브클래스에게 상속된 클래스
- 수퍼클래스와 서브클래스는 인스턴스의 프로토타입 체인뿐 아니라 클래스 간의 프로토타입 체인도 생성한다.

#### 25.8.3 동적 상속
- extends 키워드는 클래스뿐만 아니라 생성자 함수를 상속받아 클래스를 확장할 수도 있다.
- 단, extends 키워드 앞에는 반드시 클래스가 와야 한다.
```javascript
// 생성자 함수
    
function Base(a){
    this.a = a;
}

// 생성자 함수를 상속받는 서브클래스
class Derived extends Base {}

const derived = new Derived(1);
console.log(derived) // Derived {a:1}
```
- extends 키워드 다음에는 클래스뿐만 아니라 [[Construct]] 메서드를 갖는 함수 객체도 올 수 있다.

#### 25.8.4 서브클래스의 constructor
- 서브클래스에서 constructor를 생략하면 암묵적으로 constructor(...args) { super(...args); }가 추가된다.
- super()는 슈퍼클래스의 constructor를 호출하여 인스턴스를 생성한다.

#### 25.8.5 super 키워드
- super 키워드는 함수처럼 호출할 수도 있고 this와 같이 식별자처럼 참조할 수 있는 특수한 키워드다.
  - super를 호출하면 슈퍼클래스의 constructor를 호출하여 인스턴스를 생성한다.
  - super를 참조하면 슈퍼클래스의 메서드를 호출할 수 있다.
- super 호출
  - super를 호출하면 슈퍼클래스의 constructor를 호출하여 인스턴스를 생성한다.
  - super를 호출할 떄 주의할 사항
    - 서브클래스에서 constructor를 생략하지 않는 경우 서브클래스의 constructor에서는 반드시 super를 호출해야 한다.
    - super를 호출하기 전에는 this를 참조할 수 없다.
    - super는 반드시 서브클래스의 constructor에서만 호출할 수 있다.
    ```javascript
        class Base {
            constructor(a){
            this.a = a;
            }
        }

        class Derived extends Base {
        constructor(a, b){
            //Reference Error : this is not allowed before super()
            this.b = b;
            }
    }
    
    function Foo () {
       super(); // SyntaxError: 'super' keyword unexpected here
    }
    ```
  - super 참조
    - 메서드 내에서 super를 참조하면 슈퍼클래스의 메서드를 호출할 수 있다.
      - 서브클래스의 프로토타입 메서드 내에서 super.sayHi는 수퍼클래스의 프로토타입 메서드 sayHi를 가리킨다.
        ```javascript
        class Base {
            constructor(name){
                this.name = name;
            }
            sayHi(){
                return `Hi! ${this.name}`;
            }
        }
        
        class Derived extends Base {
            sayHi(){
                // super.sayHi()는 수퍼클래스 Base의 sayHi를 가리킨다.
                return `${super.sayHi()}. How are you doing?`;
            }
        }
        ```
      - super 참조를 통해 수퍼클래스의 메서드를 참조하려면 super가 수퍼클래스의 메서드가 바인딩된 객체, 즉 수퍼클래스의 prototype 프로퍼티에 바인딩된 프로토타입을 참조할 수 있어야 한다.
      ```javascript
        class Base {
            constructor(name){
                this.name = name;
            }
            sayHi(){
                return `Hi! ${this.name}`;
            }
        }
      
      class Derived extends Base {
        sayHi(){
            // __super는 Base.prototype을 가리킨다.
            const __super = Object.getPrototypeOf(Derived.prototype);
            return `${__super.sayHi.call(this)}. How are you doing?`;
      } 
      }
      ```
      - 이처럼 super 참조가 동작하기 위해서는 super를 참조하고 있는 메서드가 바인딩되어 있는 객체(위 예제의 경우 Derived.prototype)의 프로토타입(위 예제의 경우 Base.prototype)을 찾을 수 있어야 한다.
      - 이를 위해 메서드는 내부 슬롯 [[HomeObject]]를 갖는다. [[HomeObject]]는 메서드가 바인딩되어 있는 객체를 가리킨다.
      - 주의할 것은 ES6의 메서드 축약 표현으로 정의된 함수만이 [[HomeObject]]를 갖는다는 것이다.
      ```javascript
        const obj = {
          foo() {},
          // 메서드 축약 표현으로 정의된 위 함수만이 [[HomeObject]]를 갖는다.
          bar: function() {}
      }
      ```
      - 서브클래스의 정적 메서드 내에서 super.sayHi는 수퍼클래스의 정적 메서드 sayHi를 가리킨다.
      ```javascript
        class Base {
            static sayHi(){
                return 'Hi!';
            }
        }
        
        class Derived extends Base {
            static sayHi(){
                // super.sayHi()는 수퍼클래스 Base의 sayHi를 가리킨다.
                return `${super.sayHi()} How are you doing?`;
            }
        }
      ```
      
#### 25.8.6 상속 클래스의 인스턴스 생성 과정
```javascript
// 수퍼클래스
class Rectangle {
    constructor(width,height){
        this.width = width;
        this.height = height;
    }
  
    getArea(){
        return this.width * this.height;
    }
  
    toString(){
        return `width=${this.width} height=${this.height}`
    }
}

// 서브클래스
class ColorRectangle extends Rectangle {
    constructor(width, height, color){
        super(width, height);
        this.color = color;
    }
  
    // 메서드 오버라이딩
    toString(){
        return super.toString() + ` color=${this.color}`;
    }
}

const colorRectangle = new ColorRectangle(2,4,'red');

// 상속을 통해 getArea 메서드 호출
console.log(colorRectangle.getArea()); // 8
```
- 서브클래스 ColorRectangle이 New 연산자와 함께 호출되면 다음과 같은 과정을 거친다.
1. 서브클래스의 super 호출
- 자바스크립트 엔진은 수퍼클래스와 서브클래스를 구분하기 위해 내부 슬롯 [[ConstructorKind]]를 사용한다.
  - 다른 클래스를 상속받지 않는 클래스는 constructorKind가 base이다.
  - 다른 클래스를 상속받는 클래스는 constructorKind가 derived이다.
- 서브클래스는 자신이 직접 인스턴스를 생성하지 않고 수퍼클래스에게 인스턴스 생성을 위임한다. 이것이 바로 서브클래스의 constructor에서 super를 호출하는 이유다.
2. 수퍼클래스의 인스턴스 생성과 this 바인딩
- 수퍼클래스의 constructor 내부의 코드가 실행되기 이전에 암묵적으로 빈 객체를 생성한다.
- 그리고 암묵적으로 생성된 빈 객체, 즉 인스턴스는 this에 바인딩된다.
```javascript
class Rectangle {
    constructor(width, height){
       console.log(this); // ColorRectangle {width: 2, height: 4, color: 'red'}
      //new 연산자와 함께 호출된 함수, 즉 new.target은 ColorRectangle이다.
        console.log(new.target); // [class: ColorRectangle]
    }
}
```
- new.target은 서브클래스를 가리킨다. 따라서 인스턴스는 new.target이 가리키는 서브클래스가 생성한 것으로 처리된다.
- 따라서 생성된 인스턴스의 프로토타입은 서브클래스의 prototype 프로퍼티가 가리키는 객체 ColorRectangle.prototype이다.
3. 수퍼클래스 인스턴스 초기화
- 수퍼클래스의 constructor 내부의 코드가 실행되어 수퍼클래스의 인스턴스가 초기화된다.
4. 서브클래스 constructor로의 복귀와 this 바인딩
- super의 호출이 종료되고 제어 흐름이 서브클래스 constructor로 돌아온다.
- 이때 super가 반환한 인스턴스가 this에 바인딩된다.
- 서브클래스는 별도의 인스턴스를 생성하지 않고 수퍼클래스의 인스턴스를 상속받아 사용한다.
- 이처럼 super가 호출되지 않으면 인스턴스가 생성되지 않으며, this 바인딩도 할 수 없다.
- 서브클래스의 constructor에서 super를 호출하지 않으면 ReferenceError가 발생하는 이유가 바로 이 때문이다.
5. 서브클래스 인스턴스 초기화
- 서브클래스의 constructor 내부의 코드가 실행되어 서브클래스의 인스턴스가 초기화된다.
6. 인스턴스 반환
- 서브클래스의 constructor 내부의 코드가 실행된 후 완성된 인스턴스가 바인딩된 this가 암묵적으로 반환된다.

#### 25.8.7 표준 빌트인 생성자 함수 확장
- 표준 빌트인 생성자 함수도 extends 키워드를 사용하여 확장할 수 있다.
```javascript
class MyArray extends Array {
    // 모든 메서드가 Array 타입의 인스턴스를 반환하도록 한다.
    static get [Symbol.species](){
        return Array;
    }
  
    // 배열의 총합을 구하는 메서드
    sum(){
        return this.reduce((pre, cur) => pre + cur, 0);
    }
  
    // 배열의 평균을 구하는 메서드
    avg(){
        return this.reduce((pre, cur) => pre + cur, 0) / this.length;
    }
}
```

## 26장. ES6 함수의 추가 기능
### 26.1 함수의 구분
- ES6 이전의 함수는 일반 함수로서 호출할 수 있는 것은 물론 생성자 함수로서 호출할 수 있다.
- 이는 성능 면에서 문제를 일으킬 수 있다.
- 객체에 바인딩된 함수가 constructor라는 것은 객체에 바인딩된 함수가 prototype 프로퍼티를 가지며, 프로토타입 객체도 생성한다는 것을 의미하기 때문이다.
- ES6에서는 함수를 정의하는 방식에 따라 일반 함수와 생성자 함수를 구분할 수 있다.

| ES6 함수의 구분 | constructor | prototype | super | arguments |
|-----------------|-------------|-----------|-------|-----------|
| 일반 함수 | O | O | X | O |
| 메서드 | X | X | O | O |
| 화살표 함수 | X | X | X | X |

### 26.2 메서드
- ES6 사양에서 메서드는 메서드 축약 표현으로 정의된 함수만을 의미한다.
```javascript
const obj = {
    // 메서드 축약 표현으로 정의한 메서드
    foo(){
        return 'foo';
    }
};
```
- ES6 사양에서 정의한 메서드는 인스턴스를 생성할 수 없는 Non-constructor이다.
- ES6 메서드는 인스턴스를 생성할 수 없으므로 prototype 프로퍼티가 없고 프로토타입도 생성하지 않는다.
- ES6 메서드는 자신을 바인딩한 객체를 가리키는 내부 슬롯 [[HomeObject]]를 갖는다. 따라서 super 키워드를 사용할 수 있다.
- ES6 메서드가 아닌 함수는 super 키워드를 사용할 수 없다.

### 26.3 화살표 함수
#### 26.3.1 화살표 함수 정의
```javascript
const multiply = (x, y) => x * y;
```
#### 26.3.2 화살표 함수와 일반 함수의 차이
1. 화살표 함수는 인스턴스를 생성할 수 없는 Non-constructor다.
```javascript
const foo = () => {};
new foo(); // TypeError: foo is not a constructor
// 화살표 함수는 prototype 프로퍼티가 없다.
Foo.hasOwnProperty('prototype'); // false
```
2. 중복된 매개변수 이름을 선언할 수 없다.
```javascript
const foo = (x, x) => x + x; // SyntaxError: Duplicate parameter name not allowed in this context
```
3. 화살표 함수는 함수 자체의 This, arguments, super, new.target 바인딩을 갖지 않는다.
- 따라서 화살표 함수 내부에서 this, arguments, super, new.target을 참조하면 상위 스코프에서 값을 참조한다.

#### 26.3.3 this
- this 바인딩은 함수 호출 방식에 의해 동적으로 결정된다.
- 따라서 만약 this와 관련된 로직을 가진 어떤 일반 함수가 호출이 되면 this가 전역 객체를 가리키게 되고 원하지 않은 결과를 가져올 수 있다.
- 화살표 함수는 함수 자체의 this 바인딩을 갖지 않는다. 따라서 화살표 함수 내부에서 this를 참조하면 상위 스코프에서 this를 참조한다. 이를 lexical this라고 한다.
- 화살표 함수는 Function.prototype의 메서드인 call, apply, bind를 사용하여 this를 변경할 수 없다.
- 화살표 함수로 메서드를 정의하는 것은 바람직하지 않다. 화살표 함수로 메서드를 정의하면 메서드 내부의 this는 상위 스코프의 this를 가리키게 된다.

#### 26.3.4 super
- 화살표 함수는 함수 자체의 super 바인딩을 갖지 않는다. 따라서 화살표 함수 내부에서 super를 참조하면 상위 스코프에서 super를 참조한다.

#### 26.3.5 arguments
- 화살표 함수는 함수 자체의 arguments 바인딩을 갖지 않는다. 따라서 화살표 함수 내부에서 arguments를 참조하면 상위 스코프에서 arguments를 참조한다.

### 26.4 Rest 파라미터
#### 26.4.1 기본 문법
- Rest 파라미터는 매개변수 이름 앞에 ...을 붙인다.
- Rest 파라미터는 함수에 전달된 인수들의 목록을 배열로 전달받는다.
```javascript
function foo(...rest){
    console.log(rest);
}

foo(1,2,3,4,5); // [1,2,3,4,5]
```

- Rest 파라미터는 이름 그대로 먼저 선언된 매개 변수에 할당된 인수를 제외한 나머지 인수들을 모아 배열로 전달받는다.
- Rest 파라미터는 반드시 마지막 파라미터이어야 한다.
```javascript
function foo(...rest, last){
    console.log(rest);
}

foo(1,2,3,4,5); // SyntaxError: Rest parameter must be last formal parameter
```
- Rest 파라미터는 단 하나만 선언할 수 있다.
```javascript
function foo(...rest, ...rest){
    console.log(rest);
}

foo(1,2,3,4,5); // SyntaxError: Rest parameter must be last formal parameter
```

#### 26.4.2 Rest 파라미터와 arguments 객체
- ES6에서는 rest 파라미터를 사용하여 가변 인자 함수의 인수 목록을 배열로 직접 전달받을 수 있다.
- 이를 통해 유사 배열 객체인 arguments 객체를 배열로 변환하는 번거로움을 피할 수 있다.
```javascript
function sum(){
    // arguments 객체를 배열로 변환
    const array = Array.prototype.slice.call(arguments);
    return array.reduce((pre, cur) => pre + cur, 0);
}

console.log(sum(1,2,3,4,5)); // 15
```

## 느낀 점
클래스를 많이 경험해본적이 없어서 항상 궁금했는데 이번 기회로 자세히 알게되어 좋았습니다. 
생각보다 외워야 할 것도 주의해야 할 것도 많은 것 같아 매주 다짐하지만 복습을 꼭 해줘야겠다고 생각했습니다.  