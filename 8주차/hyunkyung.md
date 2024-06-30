## 27장 배열
### 27.2 자바스크립트 배열은 배열이 아니다
- 자료구조에서 말하는 배열은 동일한 크기의 메모리 공간이 빈틈없이 연속적으로 나열된 자료구조를 말한다.
- 즉 배열의 요소는 하나의 데이터 타입으로 통일되어 있으며 서로 연속적으로 인접해 있다. 이러한 배열을 밀집 배열이라 한다.
- 이런 특징 덕분에 데이터 크기와 위치를 계산하여 상수 시간 내에 원하는 요소에 접근할 수 있다.
- 하지만 요소를 삽입하거나 삭제하는 경우 요소를 이동시켜야 하므로 성능이 저하된다.
- 자바스크립트의 배열은 일반적인 배열과는 달리 요소의 데이터 타입이 같지 않아도 되며 요소가 연속적으로 이어져 있지 않아도 된다. 이러한 배열을 희소 배열이라 한다.
- 자바스크립트 배열은 일반적인 배열의 동작을 흉내 낸 특수한 객체다.
- 자바스크립트 배열은 일반 객체와 유사하게 인덱스로 프로퍼티 값에 접근할 수 있고, length 프로퍼티를 갖는다.
- 자바스크립트의 배열은 검색은 느리지만 삽입과 삭제가 빈번한 경우에 유리하다.
- 검색에 대한 단점을 보완하기 위해 모던 자바스크립트 엔진들은 배열을 좀 더 배열처럼 동작하도록 최적화하여 구현했다.

### 27.7 배열 요소의 삭제
- 희소 배열을 만들지 않으면서 배열의 특정 요소를 완전히 삭제하려면 Array.prototype.splice 메서드를 사용한다.

### 27.9 배열 고차 함수
- 고차 함수는 함수를 인수로 전달받거나 함수를 반환하는 함수를 말한다.
- 고차 함수는 외부 상태의 변경이나 가변 데이터를 피하고 불변성을 지향하는 함수형 프로그래밍에 기반을 둔다.
- 자바스크립트의 배열은 고차 함수를 다수 제공한다.

#### 27.9.1 Array.prototype.sort
- sort 메서드의 기본 정렬 순서는 유니코드 코드 포인트를 기준으로 정렬한다.
- 배열의 요소가 숫자 타입이라 할지라도 sort 메서드는 각 요소를 일시적으로 문자열로 변환하여 비교한다.
- 따라서 숫자 타입의 요소를 올바르게 비교하려면 비교 함수를 인수로 전달해야 한다.

```javascript
const numbers = [2, 0, 1, 3, 4];

// 숫자 배열 오름차순 정렬
numbers.sort((a, b) => a - b);
console.log(numbers); // [0, 1, 2, 3, 4]

// 숫자 배열 내림차순 정렬
numbers.sort((a, b) => b - a);
console.log(numbers); // [4, 3, 2, 1, 0]
```

#### 27.9.2 Array.prototype.forEach
- forEach 메서드는 배열을 순회하며 배열의 각 요소에 대하여 인수로 전달받은 콜백 함수를 실행한다.
- forEach 메서드에 전달하는 콜백 함수는 배열의 요소 값, 인덱스, 배열 자체를 인수로 전달받는다.
- 이때 this 사용이 헷갈리지 않으려면 화살표 함수를 사용하는 것이 좋다.

## 28장 Number
### 28.2 Number 프로퍼티 
#### 28.2.1 Number.EPSILON
- ES6에서 도입된 Number.EPSILON은 1과 1보다 큰 수 중에서 가장 작은 수 사이의 차이를 나타낸다.
- 이 값은 부동소수점 연산의 오차로 인해 발생하는 문제를 해결하기 위해 사용된다.
- Number.EPSILON은 2.220446049250313e-16로 근사치로 2^-52이다.
- Number.EPSILON은 1에 더했을 때 1과 구분되는 결과를 만들 수 있는 가장 작은 값이다.
```javascript
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false

function isEqual(a, b){
    return Math.abs(a-b) < Number.EPSILON;
}

isEqual(0.1 + 0.2, 0.3) // true
```

## 30장 Date
### 30.1 Date 생성자 함수
- Date 생성자 함수는 new 연산자와 함께 호출하여 Date 인스턴스를 생성한다.
- Date 생성자 함수는 인수를 전달하지 않으면 현재 시간을 기반으로 Date 인스턴스를 생성한다.
- Date 객체는 내부적으로 날짜와 시간을 나타내는 정수값을 갖는다. 이 값은 1970년 1월 1일 00:00:00(UTC)를 기점으로 경과한 밀리초를 나타낸다.

#### 30.1.1 new Date()
- new Date()는 현재 시간을 기반으로 Date 객체를 생성한다.
- Date 객체는 내부적으로 정수값을 갖지만 콘솔에 출력하면 날짜와 시간 정보를 출력한다.

#### 30.1.2 new Date(milliseconds)
- new Date(milliseconds)는 1970년 1월 1일 00:00:00(UTC)를 기점으로 milliseconds 밀리초 이후의 시간을 나타내는 Date 객체를 생성한다.

#### 30.1.3 new Date(dateString)
- new Date(dateString)은 인수로 전달된 dateString을 해석하여 날짜와 시간 정보를 나타내는 Date 객체를 생성한다.
- dateString은 Date.parse 메서드에 의해 해석 가능한 형식이어야 한다.

#### 30.1.4 new Date(year, month[, day, hour, minute, second, millisecond])
- new Date(year, month[, day, hour, minute, second, millisecond])는 지정된 날짜와 시간을 나타내는 Date 객체를 생성한다.

## 31장 RegExp
### 31.1 정규 표현식이란
- 정규 표현식은 문자열의 패턴을 찾거나 대체, 추출하는 데 사용하는 문자열이다.
- 정규 표현식은 RegExp 객체의 생성자 함수인 RegExp를 사용하여 생성한다.
- 정규 표현식은 문자열이나 숫자, 특수문자 등의 문자 조합으로 구성된 패턴을 사용하여 문자열을 검색하거나 대체, 추출하는 작업을 수행한다.

### 31.2 정규 표현식 생성
- 정규 표현식은 리터럴과 생성자 함수 두 가지 방법으로 생성할 수 있다.
- 정규 표현식 리터럴은 슬래시(/)로 감싸는 형태이다.

### 31.3 RegExp 메서드
#### 31.3.1 RegExp.prototype.exec
- exec 메서드는 정규 표현식과 일치하는 문자열을 검색하여 배열로 반환한다.
- exec 메서드는 문자열 내의 모든 패턴을 검색하는 g 플래그를 지정해도 첫 번째 패턴만 반환한다.

#### 31.3.2 RegExp.prototype.test
- test 메서드는 정규 표현식과 일치하는 문자열이 있는지 검사하여 불리언 값을 반환한다.

#### 31.3.3 String.prototype.match
- match 메서드는 String 표준 빌트인 객체가 제공한다.
- match 메서드는 문자열이 정규 표현식과 일치하는 부분을 검색하여 배열로 반환한다.
- match 메서드는 g 플래그를 지정하면 모든 매칭 결과를 배열로 반환한다.

### 31.4 플래그
| 플래그 | 의미 | 설명                                                 |
| --- | --- |----------------------------------------------------|
| i | ignore case | 대소문자를 구별하지 않고 검색한다.                                |
| g | global | 대상 문자열 내에서 패턴과 일치하는 모든 문자열을 전역 검색한다. |
| m | multiline | 문자열의 행이 바뀌더라도 검색을 계속한다.                        |

### 31.5 패턴
#### 31.5.2 임의의 문자열 검색
- .은 임의의 문자 하나를 의미한다.
- .을 사용하면 임의의 문자 하나와 일치하는 패턴을 검색할 수 있다.
```javascript
const target = 'Is this all there is?';

// 임의의 3자리 문자열을 검색
let regExp = /.../g;

console.log(target.match(regExp)); // ['Is ', 'thi', 's a', 'll ', 'the', 're ', 'is?']
```

#### 31.5.3 반복 검색
- {m,n}은 m번 이상 n번 이하 반복되는 문자열을 검색한다.

```javascript
const target = 'A AA B BB Aa Bb AAA';

// A 또는 B가 2회 이상 3회 이하 반복되는 문자열을 검색
let regExp = /[AB]{2,3}/g;

console.log(target.match(regExp)); // ['AA', 'BB', 'AAA']
```

#### 31.5.4 OR 검색
- |는 OR 연산자로 사용되어 패턴을 선택하는 역할을 한다.
```javascript
const target = 'A AA B BB Aa Bb AAA';

// A 또는 B를 전역 검색한다.
let regExp = /A|B/g;

// 분해되지 않은 단어 레벨로 검색하기 위해서는 +를 함께 사용한다.
let regExp2 = /A+|B+/g;

console.log(target.match(regExp)); // ['A', 'A', 'B', 'B', 'A', 'B', 'A', 'A']
console.log(target.match(regExp2)); // ['A', 'AA', 'B', 'BB', 'A', 'B', 'AAA']
```

#### 31.5.5 NOT 검색
- ^는 NOT 연산자로 사용되어 패턴을 제외하는 역할을 한다.
```javascript
const target = 'A AA B BB Aa 12 Bb AAA';

// 숫자를 제외한 문자열을 전역 검색한다.
let regExp = /[^0-9]/g;

console.log(target.match(regExp)); // ['A', ' ', 'A', 'A', ' ', 'B', ' ', 'B', ' ', 'A', 'a', ' ', ' ', 'B', 'b', ' ', 'A', 'A', 'A']
```

#### 31.5.6 시작 위치로 검색
- ^는 시작 위치를 의미한다.
```javascript
const target = 'A AA B BB Aa 12 Bb AAA';

// 문자열의 시작이 A인 문자열을 전역 검색한다.
let regExp = /^A/g;

console.log(target.match(regExp)); // ['A']
```

#### 31.5.7 끝 위치로 검색
- $는 끝 위치를 의미한다.
```javascript
const target = 'A AA B BB Aa 12 Bb AAA';

// 문자열의 끝이 A인 문자열을 전역 검색한다.
let regExp = /A$/g;

console.log(target.match(regExp)); // ['A']
```
