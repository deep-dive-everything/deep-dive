## 8장. 제어문
제어문은 조건에 따라 코드 블록을 실행하거나 반복 실행할 때 사용한다. 제어문은 코드의 실행 순서를 변경할 수 있다.
일반적으로 코드는 위에서 아래로 실행되지만 제어문을 사용하면 코드의 실행 순서를 변경할 수 있다.

### 8.1 블록문
블록문은 0개 이상의 문을 중괄호로 묶은 것이다. 블록문은 단독으로 사용할 수도 있고 다른 제어문이나 함수 정의 내부에서 사용할 수 있다.

```javascript
// 블록문
{
  var foo = 10;
  console.log(foo);
}

// 제어문
var x = 1;
if (x < 10) {
  x++;
}

// 함수 정의
function sum(a, b) {
  return a + b;
}
```

### 8.2 조건문
조건문은 주어진 조건식의 평가 결과에 따라 코드 블록의 실행을 결정한다. 자바스크립트는 3가지 조건문을 제공한다.

#### 8.2.1 if...else 문
if...else 문은 주어진 조건식의 평가 결과가 참인 경우 if 문의 코드 블록을 실행하고 거짓인 경우 else 문의 코드 블록을 실행한다.

```javascript
var num = 2;

if (num > 0) {
  console.log('양수');
} else if (num < 0) {
  console.log('음수');
} else {
  console.log('영');
}
```

#### 8.2.2 switch 문
switch 문은 주어진 표현식을 평가하여 그 값과 일치하는 case 문으로 실행 순서를 이동시킨다. switch 문은 다중 조건을 비교할 때 사용한다.

```javascript
var color = 'blue';

switch (color) {
  case 'red':
    console.log('Red');
    break;
  case 'blue':
    console.log('Blue');
    break;
  case 'green':
    console.log('Green');
    break;
  default:
    console.log('Unknown color');
}
```

#### 8.2.3 삼항 조건 연산자
삼항 조건 연산자는 조건식의 평가 결과에 따라 반환할 값을 결정한다. 삼항 조건 연산자는 if...else 문을 대체하여 사용할 수 있다.

```javascript
var num = 2;

var kind = num % 2 ? '홀수' : '짝수';
console.log(kind); // 짝수
```

### 8.3 반복문
반복문은 조건식의 평가 결과가 참인 경우 코드 블록을 실행한다. 반복문은 코드 블록을 반복 실행할 수 있게 한다. 자바스크립트는 4가지 반복문을 제공한다.

#### 8.3.1 for 문
for 문은 주어진 표현식을 평가하여 그 값이 참이면 코드 블록을 실행하고 거짓이면 실행을 중단한다.

```javascript
for (var i = 0; i < 2; i++) {
  console.log(i);
}
```

#### 8.3.2 while 문
while 문은 주어진 조건식의 평가 결과가 참이면 코드 블록을 실행하고 거짓이면 실행을 중단한다.

```javascript
var count = 0;

while (count < 2) {
  console.log(count);
  count++;
}
```

#### 8.3.3 do...while 문
do...while 문은 코드 블록을 먼저 실행하고 조건식을 평가한다. 조건식의 평가 결과가 참이면 코드 블록을 다시 실행하고 거짓이면 실행을 중단한다.

```javascript
var count = 0;

do {
  console.log(count);
  count++;
} while (count < 2);
```

### 8.4 break 문
break 문은 코드 블록을 탈출할 때 사용한다. 좀 더 정확히 말하자면 코드 블록을 탈출하는 것이 아니라 레이블 문, 반복문, switch 문 등의 제어문을 탈출한다.

```javascript
for (var i = 0; i < 3; i++) {
  console.log(i);
  if (i > 1) break;
}
```

레이블문이란 식별자가 붙은 문을 말한다.

```javascript
foo: {
  console.log(1);
  break foo;
  console.log(2);
}
console.log('Done!');
```

레이블 문은 중첩된 for 문이나 중첩된 switch 문 등에서 전체 코드 블록을 탈출할 때 유용하다.

```javascript
outer: for(var i=0; i<3; i++){
    for (var j=0; j<3; j++){
        if(i+j===3) break outer;
        console.log(`inner`)
    }
}

console.log('Done!');
```

### 8.5 continue 문
continue 문은 반복문의 코드 블록 실행을 현 지점에서 중단하고 반복문의 증감식으로 실행 흐름을 이동시킨다.

```javascript
for (var i = 0; i < 3; i++) {
  if (i === 1) continue;
  console.log(i);
}
```

## 9장. 타입 변환과 단축 평가
### 9.1 타입 변환이란?
타입 변환은 두가지로 나눌 수 있다. 첫번째는 명시적 타입 변환이고 두번째는 암묵적 타입 변환이다.
두가지 다 기존 원시값을 다른 수로 바꾸는 것은 아니고 새로운 원시값을 생성하는 것이다.

### 9.2 암묵적 타입 변환
암묵적 타입 변환은 개발자의 의도와 상관없이 자바스크립트 엔진에 의해 암묵적으로 타입이 자동 변환되는 것을 말한다.

```javascript
var x = 10;
var str = x + ''; // 암묵적 타입 변환

console.log(typeof str); // string
```

#### 9.2.1 문자열 타입으로 변환
```javascript
1 + '2' // '12'
```
위 예제의 경우 숫자 1이 문자열로 변환되어 문자열 연결 연산자로 동작한다.
자바스크립트 엔진은 문자열 타입 아닌 값을 문자열 타입으로 암묵적 타입 변환을 수행할 때 다음과 같이 동작한다.
```javascript
//숫자 타입
0 + '' // '0'
-0 + '' // '0'
1 + '' // '1'
-1 + '' // '-1'
NaN + '' // 'NaN'
Infinity + '' // 'Infinity'

//불리언 타입
true + '' // 'true'
false + '' // 'false'

//null 타입
null + '' // 'null'

//undefined 타입
undefined + '' // 'undefined'

//심벌 타입
    (Symbol()) + '' // -> TypeError: Cannot convert a Symbol value to a string

//객체 타입
    ({}) + '' // "[object Object]"
Math+'' // "[object Math]"
[]+'' // "
[10,20] + '' // "10,20"
    (function(){}) + '' // "function(){}"
Array + '' // "function Array() { [native code] }"

```

#### 9.2.2 숫자 타입으로 변환
```javascript
1 - '1' // -0
1 * '10' // 10
1 / 'one' // NaN
```
위 예제의 경우 문자열 '1'이 숫자로 변환되어 산술 연산자로 동작한다. 피연산자를 숫자 타입으로 변환해야 할 문맥은 산술 연산자뿐만이 아니다.
```javascript
'1' > 0 // true
```

자바스크립트 엔진은 숫자 타입이 아닌 값을 숫자 타입으로 암묵적 타입 변환을 수행할 때 다음과 같이 동작한다. 

```javascript
//문자열 타입
+ '0' // 0
+ '1' // 1
+ '-1' // -1
+'string' // NaN

//불리언 타입
+true // 1
+false // 0

//null 타입
+null // 0

//undefined 타입
+undefined // NaN

//심벌 타입
+Symbol() // -> TyperError: Cannot convert a Symbol value to a number

//객체 타입
+{} // NaN
+[] // 0
+[10,20] // NaN
+function(){} // NaN
```

#### 9.2.3 불리언 타입으로 변환
```javascript
if('') console.log('1');
if(true) console.log('2');
if(0) console.log('3');
if('str') console.log('4');
if(null) console.log('5');

// 2 4
```

이 때 자바스크립트 엔진은 불리언 타입이 아닌 값을 Truthy 값 또는 Falsy 값으로 구분한다.
즉, 제어문의 조건식과 같이 불리언 값으로 평가되어야 할 문맥에서 Truthy 값은 True로 Falsy 값은 False로 강제 변환된다.

아래 값들은 falsy 값으로 강제 변환된다.
- false
- undefined
- null
- 0, -0
- NaN
- ''(빈 문자열)

```javascript
// 아래의 조건문은 모두 코드 블록을 실행한다.
if (!false) console.log(false + ' is falsy value');
if (!undefined) console.log(undefined + ' is falsy value');
if (!null) console.log(null + ' is falsy value');
if (!0) console.log(0 + ' is falsy value');
if (!NaN) console.log(NaN + ' is falsy value');
if (!'') console.log('' + ' is falsy value');
```

나머지 값들은 Truthy 값으로 강제 변환된다.

### 9.3 명시적 타입 변환
명시적 타입 변환은 개발자가 의도적으로 값의 타입을 변환하는 것을 말한다.

#### 9.3.1 문자열 타입으로 변환
1. String 생성자 함수를 new 연산자 없이 호출하는 방법
2. Object.prototype.toString 메서드를 사용하는 방법
3. 문자열 연결 연산자를 이용하는 방법
```javascript
//1. String 생성자 함수를 new 연산자 없이 호출하는 방법
String(1); // '1'

//2. Object.prototype.toString 메서드를 사용하는 방법
(1).toString(); // '1'

//3. 문자열 연결 연산자를 이용하는 방법
1 + ''; // '1'
```

#### 9.3.2 숫자 타입으로 변환
1. Number 생성자 함수를 new 연산자 없이 호출하는 방법
2. parseInt, parseFloat 함수를 사용하는 방법
3. 단항 산술 연산자를 이용하는 방법
4. * 산술 연산자를 이용하는 방법
```javascript
//1. Number 생성자 함수를 new 연산자 없이 호출하는 방법
Number('1'); // 1

//2. parseInt, parseFloat 함수를 사용하는 방법
parseInt('1', 10); // 1

//3. 단항 산술 연산자를 이용하는 방법
+'1'; // 1

//4. * 산술 연산자를 이용하는 방법
1 * '1'; // 1
```

#### 9.3.3 불리언 타입으로 변환
1. Boolean 생성자 함수를 new 연산자 없이 호출하는 방법
2. ! 부정 논리 연산자를 두번 사용하는 방법
```javascript
//1. Boolean 생성자 함수를 new 연산자 없이 호출하는 방법
Boolean(1); // true

//2. ! 부정 논리 연산자를 두번 사용하는 방법
!!1; // true
```

### 9.4 단축 평가
#### 9.4.1 논리 연산자를 사용한 단축 평가
논리합(||) 또는 논리곱(&&) 연산자 표현식의 평가 결과는 불리언 값이 아닐 수도 있다. 논리합 또는 논리곱 연산자 표현식은 언제나 2개의 피연산자 중 어느 한쪽으로 평가된다.

```javascript
'Cat' && 'Dog' // 'Dog'
```

논리곱 연산자는 두 개의 피연산자가 모두 true로 평가될 때 true를 반환한다. 논리곱 연산자는 좌항에서 우항으로 평가가 진행된다.
첫번째 피연산자 'Cat'은 Truthy 값이므로 true로 평가된다. 논리곱 연산자는 두 번째 피연산자 'Dog'를 평가하지 않고 바로 반환한다.

논리합 연산자도 논리곱 연산자와 동일하게 동작한다.
```javascript
'Cat' || 'Dog' // 'Cat'
```

논리합 연산자는 두 개의 피연산자 중 하나만 true로 평가되어도 true를 반환한다. 논리합 연산자는 좌항에서 우항으로 평가가 진행된다.
첫번째 피연산자 'Cat'은 Truthy 값이므로 true로 평가된다. 이때 논리합 연산자는 논리 연산자의 결과를 결정한 시점에서 평가를 멈추고 첫번째 피연산자 'Cat'을 반환한다.

이처럼 논리 연산의 결과를 결정하는 피연산자를 타입 변환하지 않고 그대로 반환하는 것을 단축 평가라 한다. 단축 평가는 표현식을 평가하는 도중에 평가 결과가 확정된 경우 나머지 평가 과정을 생략하는 것을 말한다.

| 단축 평가 표현식 | 평가 결과 |
|---|---|
| true \|\| anything | true |
| false \|\| anything | anything |
| true && anything | anything |
| false && anything | false |

**단축 평가가 유용하게 사용되는 곳**
1. 객체를 가리키기를 기대하는 변수가 null 또는 undefined가 아닌지 확인하고 프로퍼티를 참조할 때   
```javascript
var elem = null;

var value = elem.value; // TypeError: Cannot read property 'value' of null

var value = elem && elem.value; //null
```
2. 함수 매개변수에 기본값을 설정할 때
```javascript
function getStringLength(str) {
  str = str || '';
  return str.length;
}

getStringLength(); // 0
getStringLength('hi'); // 2
```

#### 9.4.2 옵셔널 체이닝 연산자
옵셔널 체이닝 연산자 ?.는 좌항의 피연산자가 null 또는 undefined인 경우 undefined를 반환하고, 그렇지 않으면 우항의 프로퍼티 참조를 이어간다.

```javascript
var elem = null;

var value = elem?.value; // undefined
```

옵셔널 체이닝 연산자가 도입되기 이전에는 논리 연산자 &&을 이용한 단축 평가를 통해 변수가 Null 또는 Undefined인지 확인했다.

```javascript
var elem = null;

var value = elem && elem.value; // null
```

논리 연산자 &&는 좌항 연산자가 false로 평가되는 Falsy 값이면 좌항 연산자를 그대로 반환한다. 
```javascript
var str = '';

var length = str && str.length; // ''
```

하지만 옵셔널 체이닝 연산자는 좌항 피연산자가 false로 평가되는 Falsy 값이라도 null 또는 undefined가 아니면 우항의 프로퍼티 참조를 이어간다.

```javascript
var str = '';

var length = str?.length; // 0
```

#### 9.4.3 null 병합 연산자
null 병합 연산자 ??는 좌항의 피연산자가 null 또는 undefined인 경우 우항의 피연산자를 반환하고, 그렇지 않으면 좌항의 피연산자를 반환한다.
null 병합 연산자는 변수에 기본값을 설정할 때 유용하다.

```javascript
var foo = null ?? 'default string';

console.log(foo); // default string
```

null 병합 연산자가 도입되기 이전에는 논리 연산자 ||를 사용하여 변수에 기본값을 설정했다. 만일 논리연산자를 사용한다면 좌항의 피연산자가 falsy한 값인 경우 우항의 피연산자를 반환한다.
**''나 0과 같은 값이 유효하다면 예기치않은 동작이 발생할 수 있다.**   
```javascript
var foo1 = '' || 'default string';
var foo2 = '' ?? 'default string';

console.log(foo1); // default string
console.log(foo2); // ''
```

## 10장. 객체 리터럴
### 10.1 객체란?
자바스크립트는 객체 기반의 프로그래밍 언어이며, 원시 값을 제외한 나머지 값(함수, 배열, 정규표현식 등)은 모두 객체다.
객체는 0개 이상의 프로퍼티로 구성된 집합이며, 프로퍼티는 키와 값으로 구성된다.

자바스크립트에서 사용할 수 있는 모든 값은 프로퍼티 값이 될 수 있다. 프로퍼티 값이 함수인 경우, 일반 함수와 구분하기 위해 메서드라 부른다.

### 10.2 객체 리터럴에 의한 객체 생성
자바스크립트는 프로토타입 기반 객체지향 언어로서 클래스 기반 객체지향 언어와는 달리 다양한 객체 생성 방법을 지원한다.
- 객체 리터럴
- Object 생성자 함수
- 생성자 함수
- Object.create 메서드
- 클래스(ES6)

객체 리터럴은 중괄호({})를 이용해 객체를 생성하는 방식이다. 객체 리터럴은 중괄호 내에 0개 이상의 프로퍼티를 정의한다.

```javascript
var person = {
  name: 'Lee',
  sayHello: function() {
    console.log('Hi! My name is ' + this.name);
  }
};

console.log(typeof person); // object
console.log(person); // { name: 'Lee', sayHello: [Function: sayHello] }
```

이외 방식은 함수를 알아본 이후에 살펴보기로 한다.

### 10.3 프로퍼티
객체는 프로퍼티의 집합이며, 프로퍼티는 키(key)와 값(value)으로 구성된다. 프로퍼티 키는 프로퍼티 값에 접근할 수 있는 이름이다.

프로퍼티 키는 프로퍼티 값에 접근할 수 있는 이름이다. 프로퍼티 키는 문자열 또는 심벌 값이다.

```javascript

var obj = {};

// 문자열이나 문자열로 타입 변환 가능한 값이라면 프로퍼티 키로 사용할 수 있다.
obj[true] = 'true';
obj[10] = 10;
obj['ten'] = 10;

console.log(obj); // {true: "true", 10: 10, ten: 10}
```

### 10.4 메서드
객체에는 프로퍼티 값이 함수일 경우 일반 함수와 구분하기 위해 메서드라 부른다. 메서드는 객체에 제한되어 있는 함수를 의미한다.

### 10.5 프로퍼티 접근
프로퍼티에 접근하는 방법은 두 가지가 있다.
1. 마침표 프로퍼티 접근 연산자(.)
2. 대괄호 프로퍼티 접근 연산자([])

```javascript
var person = {
  name: 'Lee'
};

console.log(person.name); // Lee
console.log(person['name']); // Lee
```

객체에 존재하지 않는 프로퍼티에 접근하면 undefined를 반환한다. 이때 ReferenceError가 발생하지 않는다.

## 11장. 원시 값과 객체의 비교
자바스크립트의 데이터 타입은 크게 원시타입과 객체 타입 두가지로 나눌 수 있다. 그리고 그 둘은 세가지 측면에서 다르다.
1. 원시 값은 변경 불가능한 값이며, 객체는 변경 가능한 값이다.
2. 원시 값을 변수에 할당하면 변수에는 실제 값이 저장된다. 객체를 변수에 할당하면 변수에는 참조 값이 저장된다.
3. 원시 값을 갖는 변수를 다른 변수에 할당하면 원시 값이 복사되어 전달된다. 객체를 가리키는 변수를 다른 변수에 할당하면 참조 값이 복사되어 전달된다.

### 11.1 원시 값
원시 값은 변경 불가능한 값이다. 값을 변경할 수 없다는 것이 구체적으로 무엇을 말하는 것일까?
먼저 변수와 값을 나누어 생각해야 한다. 변수는 하나의 값을 저장하기 위해 확보한 메모리 공간 자체를 의미한다. 값은 변수에 저장된 데이터로서 표현식이 평가되어 생성된 결과를 말한다.

변경 불가능한 것은 변수가 아닌 값이다. 변수는 언제든지 재할당을 통해 변수 값을 변경할 수 있다.
변수의 상대 개념인 상수 또한 재할당이 금지된 변수일 뿐이다.

원시 값은 변경 불가능한 값, 즉 읽기 전용 값이다. 이러한 특성은 데이터의 신뢰성을 보장한다. 원시 값을 할당한 변수에 새로운 원시 값을 재할당하면 메모리 공간에 저장된 값을 변경하는 것이 아니라 새로운 메모리 공간을 확보하고 그곳에 새로운 원시 값을 저장한다.
그 후 변수는 새롭게 재할당한 원시 값을 가리킨다. 이때 변수가 참조하던 메모리 공간의 주소가 바뀐다. 값의 이러한 특성을 불변성이라 한다.
불변성을 갖는 원시 값을 할당한 변수는 재할당 이외에는 변수 값을 변경할 수 있는 방법이 없다.

#### 11.1.2 문자열과 불변성
원시 값을 저장하려면 먼저 메모리에 얼마만큼의 공간을 확보할 지 결정해야 한다.

원시 값인 문자열은 0개 이상의 문자로 이뤄진 집합을 말하며, 1개의 문자는 2바이트의 메모리 공간에 저장된다. 따라서 문자열은 몇 개의 문자로 이뤄졌나에 따라 공간의 크기가 결정된다.

문자열은 유사 배열 객체이면서 이터러블이다. 따라서 배열과 유사하게 인덱스로 각 문자에 접근할 수 있다.
```javascript
var str = 'Hello';

console.log(str[0]); // H
console.log(str.length); // 5
console.log(str.toUpperCase()); // HELLO

str[0] = 'c'

console.log(str); // Hello
```
str[0]에 'c'를 할당하려 했지만 문자열은 읽기 전용 값이므로 에러가 발생하지 않고 무시된다.

#### 11.1.3 값에 의한 전달
원시 값을 갖는 변수를 다른 변수에 할당하면 원시 값이 복사되어 전달된다. 이를 값에 의한 전달이라 한다.

```javascript
var score = 80;
var copy = score;

console.log(score, copy); // 80 80
console.log(score === copy); // true

score = 100;

console.log(score) // 100
console.log(copy) // 80
```
score와 copy의 값들은 별개의 메모리에 저장된 값이므로 서로 독립적이다. 따라서 score에 새로운 값을 할당해도 copy에는 영향을 주지 않는다.

### 11.2 객체
자바스크립트의 객체는 프로퍼티의 개수가 정해져있지 않으며 동적으로 추가되거나 삭제될 수 있다. 따라서 객체는 원시 값과 같이 확보해야 할 메모리 공간의 크기를 사전에 정해 둘 수 없다.
클래스 기반 객체지향 프로그래밍 언어와 다르게 객체의 프로퍼티나 메서드를 자유롭게 추가할 수 있다는 장점이 있지만 이러한 유연성은 비용이 더 많이 드는 비효율적인 방식이라고 한다.
따라서 v8 자바스크립트 엔진에서는 프로퍼티에 접근하기 위해 동적 탐색 대신 히든 클래스라는 방식을 사용해 성능을 보장한다.

#### 11.2.1 변경 가능한 값
원시 값을 할당한 변수를 참조하면 메모리에 저장되어 있는 원시 값에 접근한다. 하지만 객체를 할당한 변수를 참조하면 메모리에 저장되어 있는 참조 값을 통해 실제 객체에 접근한다.
원시 값은 변경 불가능한 값이므로 원시 값을 갖는 변수의 값을 변경하려면 재할당 외에는 방법이 없다. 하지만 객체는 변경 가능한 값이다. 따라서 객체를 할당한 변수는 재할당 없이 객체를 직접 변경할 수 있다. 

객체를 생성하고 관리하는 방식은 매우 복잡하며 비용이 많이 드는 일이다. 객체를 변경할 때마다 원시 값처럼 이전 값을 복사해서 새롭게 생성한다면 명확하고 신뢰성이 확보되겠지만
객체는 크기가 매우 클 수도 있고 복사해서 생성하는 비용이 많이든다. 따라서 메모리를 효율적으로 사용하기 위해 객체는 변경 가능한 값으로 설계되어 있다.

객체는 이러한 구조적 단점에 따른 부작용이 있다. 그것은 원시 값과는 다르게 여러 개의 식별자가 하나의 객체를 공유할 수 있다는 것이다.

#### 11.2.2 참조에 의한 전달
객체를 할당한 변수를 다른 변수에 할당하면 원본 객체를 가리키는 참조 값이 복사되어 전달된다. 이를 참조에 의한 전달이라 한다.

```javascript
var person = {
  name: 'Lee'
};

var copy = person;

console.log(person === copy); // true

copy.name = 'Kim';

console.log(person); // { name: 'Kim' }
console.log(copy); // { name: 'Kim' }

copy = null;

console.log(person); // { name: 'Kim' }
console.log(copy); // null
```


## 느낀 점 및 공유할 내용

오늘은 실무에서 미리 알았더라면 실수를 방지했었을 부분들에 대해 많이 배워서 더욱 유용했던 시간이었습니다. 
특히 단축평가 부분에서 ??랑 || 연산자를 언제 사용해야할지 헷갈렸던 것이 해소되었고 각 연산자들이 어떻게 동작하는지 알게되어 앞으로 실수를 줄일 수 있을 것 같습니다.
다음부터 다뤄볼 부분들도 기대가 됩니다 :)


**공유**
9장에서 다뤘던 단축 평가를 몰랐기 때문에 제가 했었던 실수를 가져와봤습니다. 서버로부터 받아온 data는 길이를 알 수 없기 때문에 조건문을 추가하여 구현하는 경우가 많습니다.

```javascript
export default Page = () => {
    const data = fetch('/test')

    return <>{
        data.length && <List list={data}/>
    }</>
}
```

예전에 위와 같이 코드를 적었더니 <List /> 컴포넌트 대신 0이라는 숫자만 딸랑 나왔던 적이 있습니다. 
data가 빈 배열일 경우 좌항이 falsy한 값인 0이 되므로 그대로 좌항의 0을 리턴해준겁니다. 논리곱 연산자가 어떻게 동작하는줄 알았다면 이렇게 작성하지 않았을텐데요ㅎㅎ

그래서 이런 실수를 방지하기 위해 아래처럼 작성해주면 앞의 표현식이 false이기 때문에 불리언값 false를 반환하게 되고 0과 달리 렌더링 되지 않게 됩니다.

```javascript
    data.length > 0 && <List list={data}/>
    
    // 혹은

    !!data.length && <List list={data}/>
```

+ [얕은 복사와 깊은 복사 방법](https://velog.io/@y_jem/%EC%9E%90%EB%B0%94%EC%8A%A4%ED%81%AC%EB%A6%BD%ED%8A%B8-%EC%96%95%EC%9D%80-%EB%B3%B5%EC%82%AC%EC%99%80-%EA%B9%8A%EC%9D%80-%EB%B3%B5%EC%82%AC)