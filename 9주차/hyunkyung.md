## 33장 7번째 데이터 타입 Symbol
### 33.1 심벌이란?
- 심벌은 ES6에서 추가된 7번째 타입으로 변경 불가능한 원시 타입의 값이다.
- 심벌 값은 다른 값에 중복되지 않는 유일무이한 값이다. 따라서 주로 객체의 프로퍼티 키로 사용되는 경우가 많다.

### 33.2 심벌 값의 생성
#### 33.2.1 Symbol 함수
- 심벌은 Symbol 함수를 호출해 생성한다.
```javascript
let sym = Symbol();
console.log(typeof sym); // symbol
```
- 언뜻 보면 생성자 함수로 객체를 생성하는 것처럼 보이지만 Symbol은 new 연산자와 함께 호출하지 않는다.
- new 연산자와 함께 생성자 함수 또는 클래스를 호출하면 객체(인스턴스)가 생성되지만 심벌 값은 변경 불가능한 원시 값이다.
- Symbol 함수에는 선택적으로 문자열을 인수로 전달할 수 있다. 이 문자열은 생성된 심벌 값에 대한 심벌으로 디버깅 용도로만 사용되며, 심벌 값에 영향을 주지 않는다.
- 심벌 값도 문자열, 숫자, 불리언과 같이 객체처럼 접근하면 암묵적으로 래퍼 객체를 생성한다.
- 단 불리언 타입으로는 암묵적으로 타입 변환된다. 이를 통해 if 문 등에서 존재 확인이 가능하다.
```javascript
let sym = Symbol('desc');

console.log(sym.toString()); // Symbol(desc)
console.log(sym.description); // desc

console.log(!!sym); // true
```

#### 32.2.2 Symbol.for / Symbol.keyFor 메서드
- Symbol.for 메서드는 인수로 전달받은 문자열을 키로 사용하여 키와 심벌 값의 쌍이 저장된 전역 심벌 레지스트리(global symbol registry)에서 해당 키와 일치하는 심벌 값을 검색한다.
    - 검색에 성공하면 새로운 심벌 값을 생성하지 않고 검색된 심벌 값을 반환한다.
    - 검색에 실패하면 새로운 심벌 값을 생성하여 전역 심벌 레지스트리에 저장하고 해당 심벌 값을 반환한다.
- Symbol.keyFor 메서드는 전역 심벌 레지스트리에 저장된 심벌 값의 키를 검색한다.
    - 전역 심벌 레지스트리에 저장되지 않은 심벌 값에 대해서는 undefined를 반환한다.
```javascript
let sym = Symbol.for('key');
console.log(sym); // Symbol(key)

let sym2 = Symbol.for('key');
console.log(sym === sym2); // true

let sym3 = Symbol('key');
Symbol.keyFor(sym3); // undefined
```

### 33.3 심벌과 상수
- 예를 들어 4방향 상수를 정의할 때 상수 이름이 중복되지 않도록 심벌을 사용할 수 있다.
```javascript
const Direction = {
    UP: Symbol('up'),
    DOWN: Symbol('down'),
    LEFT: Symbol('left'),
    RIGHT: Symbol('right')
};
```

### 33.5 심벌과 프로퍼티 은닉
- 심벌 값을 프로퍼티 키로 사용하여 생성한 프로퍼티는 for ... in 문이나 Object.keys, Object.getOwnPropertyNames 메서드로 찾을 수 없다.
- 이처럼 심벌 값이 외부에 노출되지 않아서 심벌 값으로 프로퍼티 키를 사용하면 프로퍼티를 숨길 수 있다.
- 하지만 Object.getOwnPropertySymbols 메서드를 사용하면 심벌 값으로 생성한 프로퍼티 키를 찾을 수 있다.

### 33.6 심벌과 표준 빌트인 객체 확장
- 표준 빌트인 객체에 사용자 정의 메서드를 추가할 때 심벌 값을 프로퍼티 키로 사용하면 표준 빌트인 객체가 업그레이드 되어 새로운 메서드가 생긴다하더라도 중복의 위험이 없다.
```javascript
Array.prototype[Symbol.for('shuffle')] = function() {
    return this.slice().sort(() => Math.random() - 0.5);
};
```

### 33.7 Well-known Symbol
- 자바스크립트가 기본 제공하는 빌트인 심벌 값이 있다. 이를 Well-known Symbol이라 한다.
- 예를 들어 Array, String 같이 for ... of 문으로 순회 가능한 빌트인 이터러블은 Well-known Symbol인 Symbol.iterator를 키로 사용한 메서드를 가지고 있다.
- Symbol.iterator 메서드를 호출하면 이터레이터를 반환하도록 구현되어 있다.
- 만약 빌트인 이터러블이 아닌 일반 객체를 이터러블처럼 동작하도록 구현하고 싶다면 이터레이션 프로토콜을 따르면 된다.
```javascript
const iterable = {
    [Symbol.iterator](){
        let cur = 1;
        const max = 5;
      
      return {
        next(){
            return {value: cur++, done: cur > max};
        }
      }
    }
}

for (const num of iterable) {
    console.log(num);
}
```

## 34장 이터러블
### 34.1 이터레이션 프로토콜
- 이터레이션 프로토콜은 순회 가능한 데이터 컬렉션을 만들기 위한 규약이다.

#### 34.1.1 이터러블
- 이터러블 프로토콜을 준수한 객체를 이터러블이라 한다.
- 이터러블은 Symbol.iterator 메서드를 구현하거나 프로토타입 체인을 통해 상속받은 객체를 말한다.
- 예를 들어 배열은 Array.prototype의 Symbol.iterator 메서드를 상속받는 이터러블이다.
- 이터러블은 for ... of 문으로 순회할 수 있으며, 스프레드 문법과 배열 디스트럭처링 할당의 대상이 될 수 있다.

#### 34.1.2 이터레이터
- 이터러블의 Symbol.iterator 메서드는 이터레이터를 반환해야 한다.
- 이터레이터는 next 메서드를 갖는 객체를 말한다.
- next 메서드는 이터러블의 각 요소를 순회하기 위한 포인터의 역할을 한다.
- next 메서드는 value와 done 프로퍼티를 갖는 객체를 반환한다.
    - value는 이터러블의 요소를 반환하고, done은 이터러블의 순회가 완료되었는지 여부를 반환한다.
```javascript
const array = [1, 2, 3];

const iterator = array[Symbol.iterator]();

console.log(iterator.next()); // {value: 1, done: false}
console.log(iterator.next()); // {value: 2, done: false}
console.log(iterator.next()); // {value: 3, done: false}
console.log(iterator.next()); // {value: undefined, done: true}
```

### 34.2 빌트인 이터러블
| 빌트인 이터러블 | Symbol.iterator 메서드              |
|---|----------------------------------|
| Array | Array.prototype[Symbol.iterator] |
| String | String.prototype[Symbol.iterator] |
| Map | Map.prototype[Symbol.iterator] |
| Set | Set.prototype[Symbol.iterator] |
| TypedArray | TypedArray.prototype[Symbol.iterator] |
| arguments | arguments[Symbol.iterator] |
| DOM 컬렉션 | NodeList.prototype[Symbol.iterator] HTMLCollection.prototype[Symbol.iterator] |

### 34.3 for ... of 문
- for ... of 문은 이터러블을 순회하면서 이터러블의 요소를 변수에 할당한다.
- for ... of 문은 내부적으로 이터레이터의 Next 메서드를 호출하여 이터러블을 순회하며 next 메서드가 반환한 이터레이터 리절트 객체의 value 프로퍼티 값을 for...of 문의 변수에 할당한다.
- 그리고 이터레이터 리절트 객체의 done 프로퍼티 값이 false이면 이터러블의 순회를 계속하고, true이면 순회를 중단한다.
```javascript
const array = [1, 2, 3];

for (const item of array) {
    console.log(item);
}
```

### 34.4 이터러블과 유사 배열 객체
- 유사 배열 객체는 마치 배열처럼 인덱스로 프로퍼티 값에 접근할 수 있고 length 프로퍼티를 갖는 객체를 말한다.
- 유사 배열 객체는 이터러블이 아니다. 따라서 for ... of 문으로 순회할 수 없다.
- 단, arguments, NodeList, HTMLCollection과 같은 유사 배열 객체는 Symbol.iterator 메서드를 갖기 때문에 for ... of 문으로 순회할 수 있다.

### 34.5 이터레이션 프로토콜의 필요성
- 이터레이션 프로토콜은 다양한 데이터 공급자가 하나의 순회 방식을 갖도록 규정하여 일관된 방식으로 데이터를 순회할 수 있게 한다.

### 34.6 사용자 정의 이터러블
#### 34.6.1 사용자 정의 이터러블 구현
- 이터레이션 프로토콜을 준수하지 않는 일반 객체도 이터레이션 프로토콜을 준수하도록 구현하면 이터러블이 된다.
```javascript
const fibonacci = {
    [Symbol.iterator](){
        let [pre, cur] = [0, 1];
      
        const max = 10;
      
        return {
            next(){
                [pre, cur] = [cur, pre + cur]
              return {
                value: cur,
                done: cur >= max
              }
            }
        }
    }
}

for (const num of fibonacci) {
    console.log(num);
}

// 스프레드 문법
const arr = [...fibonacci];
console.log(arr);

// 배열 디스트럭처링 할당
const [first, second, ...rest] = fibonacci;
console.log(first, second, rest);
```

#### 34.6.2 이터러블을 생성하는 함수
- 수열의 최대값을 외부에서 전달할 수 있도록 수정해보자. 수열의 최대값을 인수로 전달받아 이터러블을 반환하는 함수를 만들면 된다.
```javascript
const finonacciFunc = function (max){
  let [pre, cur] = [0, 1];

  [Symbol.iterator]()
    {
        return {
            next() {
                [pre, cur] = [cur, pre + cur]
                return {
                    value: cur,
                    done: cur >= max
                }
            }
        }
    }
}
```

#### 34.6.2 이터러블이면서 이터레이터인 객체를 생성하는 함수
- 이터러블이면서 이터레이터인 객체를 생성하면 Symbol.iterator 메서드를 호출하지 않아도 된다.
```javascript
const finonacciFunc = function (max) {
    let [pre, cur] = [0, 1];

    return {
        [Symbol.iterator]() {
            return this;
        },
        next(){
            [pre, cur] = [cur, pre + cur];
          
            return { value: cur, done: cur >= max}
        }
    }
}

let iter = finonacciFunc(10);

for (const num of iter){
    console.log(num);
}

iter = finonacciFunc(10);

console.log(iter.next()); // {value: 1, done: false}
console.log(iter.next()); // {value: 2, done: false}
```

### 34.6.4 무한 이터러블과 지연 평가
- 무한 이터러블을 생성하는 함수를 정의해보자.
```javascript
const finonacciFunc = function (max) {
    let [pre, cur] = [0, 1];

    return {
        [Symbol.iterator]() {
            return this;
        },
        next(){
            [pre, cur] = [cur, pre + cur];
          
            return { value: cur}
        }
    }
}

for (const num of finonacciFunc(Infinity)){
    if (num > 10000) break;
    console.log(num);
}

const [f1, f2, f3] = finonacciFunc();
console.log(f1, f2, f3); // 1 2 3
```
- 위 예제의 이터러블은 지연 평가를 통해 데이터를 생성한다. 지연 평가는 데이터가 필요한 시점 이전까지는 미리 데이터를 생성하지 않다가 데이터가 필요한 시점에 데이터를 생성하는 것을 말한다.
- 이처럼 지연 평가를 사용하면 불필요한 데이터를 미리 생성하지 않고 필요한 시점에 데이터를 생성할 수 있어 메모리를 효율적으로 사용할 수 있다.

## 35장 스프레드 문법
- ES6에서 도입된 스프레드 문법은 하나로 뭉쳐 있는 여러 값들의 집합을 펼쳐서 개별적인 값들의 목록으로 만든다.
- 스프레드 문법을 사용할 수 있는 대상은 이터러블이다.
- 스프레드 문법의 결과는 값이 아니며 변수에 할당할 수 없다.

### 35.1 함수 호출문의 인수 목록에서 사용하는 경우
- 스프레드 문법은 함수 호출문의 인수 목록에서 사용할 수 있다.
```javascript
var arr = [1,2,3];

// apply 메서드를 사용하여 배열을 인수 목록으로 사용
console.log(Math.max.apply(null, arr)); // 3

// 스프레드 문법을 사용하여 배열을 인수 목록으로 사용
console.log(Math.max(...arr)); // 3
```
- Rest 파라미터와 스프레드 문법은 서로 반대의 개념이다. 
- Rest 파라미터는 함수에 전달된 인수들의 목록을 배열로 전달받기 위해 매개변수 이름 앞에 ...을 붙이는 것이다.
- 스프레드 문법은 여러 개의 값이 하나로 뭉쳐 있는 배열과 같은 이터러블을 펼쳐서 개별적인 값들의 목록으로 만든다.

### 35.2 배열 리터럴 내부에서 사용하는 경우
#### 35.2.1 concat
- concat 메서드는 인수로 전달받은 배열을 기존 배열의 마지막 요소로 추가한 새로운 배열을 반환한다.
```javascript
const arr1 = [1, 2];
const arr2 = [3, 4];

const result = arr1.concat(arr2);
console.log(result); // [1, 2, 3, 4]

// 스프레드 문법을 사용하여 배열을 연결
const result2 = [...arr1, ...arr2];
console.log(result2); // [1, 2, 3, 4]
```

#### 35.2.2 splice
- splice 메서드는 기존 배열의 요소를 제거하거나 교체하거나 새 요소를 추가하여 배열의 내용을 변경한다.
```javascript
const arr = [1, 4]
const arr2 = [2, 3];

arr.splice(1, 0, arr2); // [1, [2, 3], 4]

// 스프레드 문법을 사용하여 배열을 연결
arr.splice(1, 0, ...arr2); // [1, 2, 3, 4]
```

#### 35.2.3 배열 복사
- 스프레드 문법을 사용하면 배열을 쉽게 복사할 수 있다.
```javascript
const origin = [1,2];
var copy = origin.slice();
var copy2 = [...origin];
```

#### 35.2.4 이터러블을 배열로 변환
- ES5에서 이터러블을 배열로 변환하려면 Function.prototype.apply 또는 Function.prototype.call을 사용해야 했다.
```javascript
// ES5
function sum (){
    var args = Array.prototype.slice.call(arguments);
    return args.reduce(function (pre, cur){
        return pre + cur;
    }, 0);
}
```
- 스프레드 문법을 사용하면 이터러블을 배열로 쉽게 변환할 수 있다.
```javascript
function sum(...args){
    return args.reduce((pre, cur) => pre + cur, 0);
}
```

### 35.3 객체 리터럴 내부에서 사용하는 경우
- 스프레드 프로퍼티를 사용하면 객체 리터럴의 프로퍼티 목록에서도 스프레드 문법을 사용할 수 있다.
- 스프레드 문법의 대상은 이터러블이어야 하지만 스프레드 프로퍼티 제안은 일반 객체를 대상으로도 사용할 수 있다.
```javascript
const obj = { x: 1, y: 2 };
const copy = {...obj}

console.log(copy); // {x: 1, y: 2}
const merged = {...obj, z: 3};

console.log(merged); // {x: 1, y: 2, z: 3}
```

## 36장. 디스트럭처링 할당
- 디스트럭처링 할당은 구조화된 배열 또는 객체를 Destructuring(비구조화, 파괴)하여 개별적인 변수에 할당할 수 있게 하는 표현식이다.
- 디스트럭처링 할당은 배열 또는 객체에서 필요한 값만 추출하여 변수에 할당하고 싶을 때 유용하다.

### 36.1 배열 디스트럭처링 할당
- ES6의 배열 디스트럭처링 할당은 배열로부터 요소를 추출하여 변수에 할당한다.
- 배열 디스트럭처링 할당의 대상은 이터러블이어야 하며, 할당 기준은 배열의 인덱스다
```javascript
const arr = [1, 2, 3];

const [a, b, c] = arr;

console.log(a, b, c); // 1 2 3
```

### 36.2 객체 디스트럭처링 할당
- 객체 디스트럭처링 할당은 객체로부터 프로퍼티를 추출하여 변수에 할당한다.
- 객체 디스트럭처링 할당은 객체의 프로퍼티 키를 기준으로 할당한다.
```javascript
const obj = { x: 1, y: 2 };

const { x, y } = obj;

console.log(x, y); // 1 2
```

## 37장 Set과 Map
### 37.1 Set
- Set 객체는 중복되지 않는 유일한 값들의 집합이다.
- Set 객체는 배열과 유사하지만 아래와 같은 차이가 있다.

| 구분 | 배열 | Set 객체 |
|---|---|---|
| 동일한 값을 중복하여 포함할 수 있다 | O | X |
| 요소 순서에 의미가 있다 | O | X |
| 인덱스로 요소에 접근할 수 있다 | O | X |

#### 37.1.1 Set 객체의 생성
- Set 객체는 Set 생성자 함수를 사용하여 생성한다.
- Set 생성자 함수는 이터러블을 인수로 전달받아 Set 객체를 생성한다. 이때 이터러블의 중복된 값은 Set 객체에 추가되지 않는다.
```javascript
const set = new Set([1, 2, 3, 4, 5, 5, 5, 5]);

console.log(set); // Set {1, 2, 3, 4, 5}
```

#### 37.1.8 집합 연산
- Set 객체는 합집합, 교집합, 차집합을 구하는 메서드를 제공한다.
```javascript
const setA = new Set([1, 2, 3]);
const setB = new Set([4, 3, 2]);

// 합집합
const union = new Set([...setA, ...setB]);

// 교집합
const intersection = new Set([...setA].filter((v) => setB.has(v)));

// 차집합
const difference = new Set([...setA].filter((v) => !setB.has(v)));
```

### 37.2 Map
- Map 객체는 키와 값의 쌍으로 이루어진 컬렉션이다.
- Map 객체는 객체와 유사하지만 아래와 같은 차이가 있다.

| 구분 | 객체 | Map 객체 |
|---|---|---|
| 키로 사용할 수 있는 값 | 문자열 또는 심벌 | 모든 값 |
| 이터러블 | X | O |
| 요소 개수 확인 | Object.keys(obj).length | map.size |

#### 37.2.1 Map 객체의 생성
- Map 생성자 함수는 이터러블을 인수로 전달받아 Map 객체를 생성한다. 이때 인수로 전달되는 이터러블은 키와 값의 쌍으로 이루어진 요소로 구성되어야 한다.
```javascript
const map = new Map([['key1', 'value1'], ['key2', 'value2']]);
```




