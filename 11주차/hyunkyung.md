## 40장 이벤트
### 40.1 이벤트 드리븐 프로그래밍
- 브라우저는 처리해야 할 특정 사건이 발생하면 이를 감지하여 이벤트를 발생시킨다.
- 만약 애플리케션이 특정 타입의 이벤트에 대해 어떤 일을 하고 싶다면 해당 이벤트가 발생했을 때 호출할 함수를 브라우저에게 알려 호출을 위임한다.
- 이때 이벤트가 발생했을 때 호출될 함수를 이벤트 핸들러라 하고, 이벤트가 발생했을 때 브라우저에게 이벤트 핸들러의 호출을 위임하는 것을 이벤트 핸들러 등록이라 한다.
- 프로그램의 흐름을 이벤트 중심으로 제어하는 프로그래밍 방식을 이벤트 드리븐 프로그래밍이라 한다.

### 40.2 이벤트 타입
- 이벤트 타입은 이벤트의 종류를 나타내는 문자열이다. 이벤트 타입에 대한 상세 목록은 MDN의 Event reference를 참고하자.

### 40.3 이벤트 핸들러 등록
- 이벤트 핸들러는 이벤트가 발생했을 때 브라우저에 의해 호출될 함수다.
- 이벤트 핸들러를 등록하는 방법은 3가지다.

#### 40.3.1 이벤트 핸들러 어트리뷰트 방식
- 이벤트 핸들러 어트리뷰트 방식은 이벤트 핸들러를 HTML 요소의 이벤트 핸들러 어트리뷰트에 등록하는 방식이다.
- 주의할 점은 이벤트 핸들러 어트리뷰트 값으로 함수 참조가 아닌 함수 호출문 등의 문을 할당한다는 것이다.
- 이벤트 핸들러 어트리뷰트 값은 사실 암묵적으로 생성될 이벤트 핸들러의 함수 몸체를 의미한다.
- 즉, onclick="sayHi('Lee')" 어트리뷰트는 파싱되어 다음과 같은 함수를 암묵적으로 생성하고, 이벤트 핸들러 어트리뷰트 이름과 동일한 onclick 이벤트 핸들러 프로퍼티에 할당한다.

```javascript
function onclick(event) {
    sayHi('Lee');
}
```

- 이처럼 동작하는 이유는 이벤트 핸들러에 인수를 전달하기 위해서다. 만약 이벤트 핸들러 어트리뷰트 값으로 함수 참조를 할당해야 한다면 이벤트 핸들러에 인수를 전달하기 곤란하다.

```html
<button onclick="sayHi">Click me!</button>
```

#### 40.3.2 이벤트 핸들러 프로퍼티 방식
- window 객체와 Document, HTMLElement 타입의 DOM 노드 객체는 이벤트에 대응하는 이벤트 핸들러 프로퍼티를 가지고 있다.
- 이벤트 핸들러를 등록하기 위해서는 이벤트를 발생시킬 객체인 이켄트 타깃과 이벤트의 종류를 나타내는 문자열인 이벤트 타입 그리고 이벤트 핸들러를 지정할 필요가 있다.

#### 40.3.3 addEventListener 메서드 방식
- DOM Level 2에서 도입된 EventTarget.prototype.addEventListener 메서드는 이벤트 타깃에 이벤트 핸들러를 등록한다.

### 40.4 이벤트 핸들러 제거
- addEventListener 메서드로 등록한 이벤트 핸들러는 removeEventListener 메서드로 제거한다.
- 단, 두 메서드에 전달한 인수가 일치해야 한다. 따라서 이벤트 핸들러를 등록할 때 사용한 이벤트 타입, 이벤트 핸들러, 캡처링 여부를 동일하게 전달해야 한다.
- 이벤트 핸들러를 등록할 때 사용한 이벤트 핸들러 함수는 반드시 이름이 있어야 한다. 익명 함수는 제거할 수 없다.

### 40.5 이벤트 객체
- 이벤트가 발생하면 이벤트에 관련한 다양한 정보를 담고 있는 이벤트 객체가 동적으로 생성된다.
- 생성된 이벤트 객체는 이벤트 핸들러의 첫번째 인수로 전달된다.

#### 40.5.1 이벤트 객체의 상속 구조
- 이벤트가 발생하면 이벤트 타입에 따라 다양한 타입의 이벤트 객체가 생성된다.
- Event 인터페이스는 DOM 내에서 발생한 이벤트에 의해 생성되는 이벤트 객체를 나타낸다. 
- Event 인터페이스에는 모든 이벤트 객체의 공통 프로퍼티가 정의되어 있고 하위 인터페이스에는 이벤트 타입에 따라 고유한 프로퍼티가 정의되어 있다.
- 이벤트 객체의 프로퍼티는 발생한 이벤트의 타입에 따라 달라진다.

#### 40.5.2 이벤트 객체의 공통 프로퍼티
- Event 인터페이스의 프로퍼티는 모든 이벤트 객체의 공통 프로퍼티다.
- 이벤트 객체의 공통 프로퍼티는 다음과 같다.

| 프로퍼티 | 설명                               | 타입        |
| --- |----------------------------------|-----------|
| type | 이벤트 타입을 나타내는 문자열                 | string    |
| target | 이벤트 타깃을 나타내는 DOM 요소              | DOM 요소 노드 |
| currentTarget | 이벤트 핸들러가 바인딩된 DOM 요소             | DOM 요소 노드 |
| eventPhase | 이벤트 전파 단계를 나타내는 숫자               | number |
| bubbles | 이벤트가 버블링되는지 여부를 나타내는 불리언         | boolean |
| cancelable | 이벤트의 기본 동작이 취소 가능한지 여부를 나타내는 불리언 | boolean |
| defaultPrevented | 이벤트의 기본 동작이 취소되었는지 여부를 나타내는 불리언 | boolean |
| isTrusted | 사용자 동작에 의해 생성된 이벤트인지 여부를 나타내는 불리언 | boolean |
| timeStamp | 이벤트가 발생한 시각을 나타내는 밀리초 단위의 숫자       | number |

### 40.6 이벤트 전파
- DOM 트리 상에 존재하는 DOM 요소 노드 간에 발생한 이벤트가 전파되는 방식을 이벤트 전파라 한다.
- 이벤트가 발생했을 때 생성된 이벤트 객체는 이벤트를 발생시킨 DOM 요소인 이벤트 타깃을 중심으로 DOM 트리를 통해 전파된다.
- 이벤트 전파는 방향에 따라 다음과 같이 3단계로 구분할 수 있다.
    - 캡처링 단계: 이벤트가 상위 요소에서 하위 요소 방향으로 전파
    - 타깃 단계: 이벤트가 이벤트 타깃에 도달
    - 버블링 단계: 이벤트가 하위 요소에서 상위 요소 방향으로 전파

```html
<!DOCTYPE html>
<html>
<body>
    <ul id="fruits">
        <li id="apple">Apple</li>
        <li id="banana">Banana</li>
        <li id="orange">Orange</li>
    </ul>
</body>
</html>
```
- ul 요소에 이벤트 핸들러를 바인딩하고 ul 요소의 하위 요소인 li 요소를 클릭하여 이벤트를 발생시켜 보자.
- li 요소를 클릭하면 클릭 이벤트가 발생하여 클릭 이벤트 객체가 생성되고 클릭된 li 요소가 이벤트 타깃이 된다. 이때 currentTarget은 ul 요소다.
- 이때 클릭 이벤트 객체는 window에서 시작해서 이벤트 타깃 방향으로 전파된다. (캡처링)
- 이후 이벤트 객체는 이벤트를 발생시킨 이벤트 타깃에 도달한다. (타깃)
- 이후 이벤트 객체는 이벤트 타깃에서 시작해서 window 방향으로 전파된다. (버블링)
- addEventListener 메서드 방식으로 등록한 이벤트 핸들러는 타깃 단계와 버블링 단계뿐만 아니라 캡처링 단계의 이벤트도 선별적으로 캐치할 수 있다.
- 이처럼 이벤트는 이벤트를 발생시킨 이벤트 타깃은 물론 상위 DOM 요소에서도 캐치할 수 있다.
- 대부분의 이벤트는 캡쳐링과 버블링을 통해 전파되지만 다음 이벤트는 버블링을 통해 전파되지 않는다.
    - 포커스 이벤트: focus/blur
    - 마우스 이벤트: mouseenter/mouseleave
    - 리소스 이벤트: load/unload/error/abort
- 위 이벤트는 버블링되지 않으므로 이벤트 타깃의 상위 요소에서 위 이벤트를 캐치하려면 캡처링 단계의 이벤트를 캐치하거나 대체 이벤트를 사용한다.

### 40.7 이벤트 위임
- 이벤트 위임은 이벤트 버블링을 이용한 이벤트 핸들러의 처리 방식이다.
- 이벤트 위임은 여러 개의 하위 DOM 요소에 각각 이벤트 핸들러를 등록하는 대신 하나의 상위 DOM 요소에 이벤트 핸들러를 등록하는 방법을 말한다.

### 40.8 DOM 요소의 기본 동작 조작
#### 40.8.1 DOM 요소의 기본 동작 중단
- DOM 요소는 저마다 기본 동작이 있다. 이벤트 객체의 preventDefault 메서드는 이러한 DOM 요소의 기본 동작을 중단시킨다.

#### 40.8.2 이벤트 전파 중단
- 이벤트 객체의 stopPropagation 메서드는 이벤트 전파를 중단시킨다.

### 40.9 이벤트 핸들러 내부의 this
- 이벤트 핸들러 내부의 `this`는 이벤트 핸들러가 정의되고 호출되는 방식에 따라 다르게 동작한다.
- JavaScript에서 `this` 키워드는 런타임에 바인딩되며, 함수가 어떻게 호출되었는지에 따라 달라진다.

#### 40.9.1 이벤트 핸들러 어트리뷰트 방식
- HTML에서 이벤트 핸들러를 어트리뷰트 방식으로 지정할 때, 예를 들어 `<button onclick="handleClick()">Click me</button>`와 같이 설정하면 이벤트 핸들러 함수 내부의 `this`는 전역 객체인 `Window`를 참조한다.
- 하지만 이벤트 핸들러를 호출할 때 인수로 `this`를 전달하면 `this`는 이벤트가 바인딩된 DOM 요소를 가리킨다.

```html
<!DOCTYPE html>
<html>
<body>

<button onclick="handleClick()">Click me</button>

<script>
function handleClick() {
  console.log(this); // Window 객체를 참조
}
</script>

</body>
</html>
```

- 위의 예제에서 `handleClick` 함수 내부의 `this`는 전역 객체를 가리킨다. 하지만, 아래와 같이 수정하면 `this`가 이벤트가 발생한 요소를 가리킨다.

```html
<!DOCTYPE html>
<html>
<body>

<button onclick="handleClick(this)">Click me</button>

<script>
function handleClick(element) {
  console.log(element); // <button> 요소를 참조
}
</script>

</body>
</html>
```

- 이 경우, `handleClick` 함수는 `this`를 인수로 받아 이벤트가 발생한 요소를 가리킨다.

#### 40.9.2 이벤트 핸들러 프로퍼티 방식과 addEventListener 메서드 방식
- 이벤트 핸들러 프로퍼티 방식과 `addEventListener` 메서드 방식을 사용하면, 이벤트 핸들러 내부의 `this`는 이벤트가 바인딩된 DOM 요소를 참조한다.

1. **이벤트 핸들러 프로퍼티 방식**:
   ```html
   <!DOCTYPE html>
   <html>
   <body>

   <button id="myButton">Click me</button>

   <script>
   const button = document.getElementById('myButton');
   button.onclick = function() {
     console.log(this); // <button> 요소를 참조
   };
   </script>

   </body>
   </html>
   ```

    - 이 방식에서 `this`는 이벤트가 발생한 요소를 가리킨다.

2. **addEventListener 메서드 방식**:
   ```html
   <!DOCTYPE html>
   <html>
   <body>

   <button id="myButton">Click me</button>

   <script>
   const button = document.getElementById('myButton');
   button.addEventListener('click', function() {
     console.log(this); // <button> 요소를 참조
   });
   </script>

   </body>
   </html>
   ```

    - `addEventListener` 메서드로 이벤트 핸들러를 등록할 때도, 핸들러 내부의 `this`는 이벤트가 발생한 요소를 가리킨다.
    - 그러나, 이벤트 핸들러가 화살표 함수로 정의된 경우에는 `this`가 달라진다. 화살표 함수는 자신의 `this` 바인딩을 가지지 않기 때문에, 상위 스코프의 `this`를 그대로 사용한다.

   ```html
   <!DOCTYPE html>
   <html>
   <body>

   <button id="myButton">Click me</button>

   <script>
   const button = document.getElementById('myButton');
   button.addEventListener('click', () => {
     console.log(this); // 상위 스코프의 this를 참조
   });
   </script>

   </body>
   </html>
   ```

    - 위의 예제에서 화살표 함수는 자신의 `this`를 가지지 않으므로, `this`는 상위 스코프인 전역 객체(window)를 가리킨다.

- 따라서, 이벤트 핸들러 내부의 `this`는 이벤트 핸들러가 정의된 방식과 함수의 유형에 따라 다르게 동작하므로, 적절한 컨텍스트에서 `this`를 사용하려면 이러한 차이점을 이해하고 있어야 한다.

### 40.11 커스텀 이벤트
- `CustomEvent` 생성자 함수를 사용하여 커스텀 이벤트를 생성할 수 있다.
- 생성된 커스텀 이벤트 객체의 기본 설정은 버블링 되지 않으며 preventDefault 메서드로 취소할 수도 없게 되어있다.
- 생성된 커스텀 이벤트는 `dispatchEvent` 메서드를 사용하여 명시적으로 디스패치해야 한다.
- dispatchEvent 메서드는 이벤트 핸들러를 동기처리 방식으로 호출한다.

```javascript
// 커스텀 이벤트 생성
const customEvent = new CustomEvent('my-event', {
  detail: { key: 'value' },
  bubbles: true,
  cancelable: true,
});

// 이벤트 디스패치
document.dispatchEvent(customEvent);
```

## 41장 타이머
### 41.1 호출 스케줄링
- 함수를 명시적으로 호출하면 함수가 즉시 실행된다.
- 만약 함수를 명시적으로 호출하지 않고 일정 시간이 경과된 이후에 호출되도록 함수 호출을 예약하려면 타이머 함수를 사용한다. 이를 호출 스케줄링이라 한다.
- 자바스크립트는 타이머를 생성할 수 있는 타이머 함수 setTimeout과 setInterval, 타이머를 제거할 수 있는 타이머 함수 clearTimeout과 clearInterval을 제공한다.
- 타이머 함수는 ECMAScript 사양에 정의된 빌트인 함수가 아니다. 하지만 브라우저 환경과 Node.js 환경에서 모두 전역 객체의 메서드로서 타이머 함수를 제공한다.
- 타이머 함수 setTimeout과 setInterval은 모두 일정 시간이 경과된 이후 콜백 함수가 호출되도록 타이머를 생성한다.
- setTimeout은 일정 시간이 경과된 이후 단 한 번 콜백 함수를 호출하고, setInterval은 일정 시간 간격으로 반복하여 콜백 함수를 호출한다.
- 자바스크립트 엔진은 단 하나의 실행 컨텍스트 스택을 갖기 때문에 두 가지 이상의 코드가 동시에 실행되지 않는다(싱글 스레드). 따라서 타이머 함수는 비동기 처리 방식으로 동작한다.

### 41.2 타이머 함수
#### 41.2.1 setTimeout / clearTimeout
- setTimeout 함수는 일정 시간이 경과한 이후에 콜백 함수를 호출한다.
- setTimeout 함수는 타이머 식별자를 반환한다. 이 식별자는 clearTimeout 함수를 사용하여 타이머를 취소할 때 사용한다.

#### 41.2.2 setInterval / clearInterval
- setInterval 함수는 일정 시간 간격으로 콜백 함수를 반복 호출한다.
- setInterval 함수는 타이머 식별자를 반환한다. 이 식별자는 clearInterval 함수를 사용하여 타이머를 취소할 때 사용한다.

### 41.3 디바운스와 스로틀
- scroll, resize, input, mousemove 같은 이벤트는 짧은 시간 간격으로 연속해서 발생한다. 이러한 이벤트 핸들러가 연속해서 호출되면 브라우저는 과도한 이벤트 핸들러의 호출로 인해 브라우저 성능이 저하될 수 있다.
- 디바운스와 스로틀은 이러한 이벤트 핸들러의 호출을 제한하여 성능을 향상시키는 방법이다.

#### 41.3.1 디바운스
- 디바운스는 짧은 시간 간격으로 발생하는 이벤트를 그룹화하여 마지막 이벤트가 발생한 후 일정 시간이 경과한 이후에 이벤트 핸들러를 호출한다.
- 예를 들어 input 이벤트는 사용자가 키보드로 입력할 때마다 발생한다. 사용자가 키보드로 입력할 때마다 Ajax 요청과 같은 무거운 처리를 수행한다면 브라우저 성능이 저하될 수 있다. 
- 이때 디바운스를 사용하여 사용자가 키보드로 입력을 마친 후 일정 시간이 경과한 이후에 이벤트 핸들러를 호출하면 브라우저 성능을 향상시킬 수 있다.
- 디바운스는 resize 이벤트 처리나 input 요소에 입력된 값으로 ajax 요청하는 입력 필드 자동완성 UI 구현, 버튼 중복 클릭 방지 처리 등에 유용하게 사용된다.

#### 41.3.2 스로틀
- 스로틀은 짧은 시간 간격으로 이벤트가 연속해서 발생하더라도 일정 시간 간격으로 이벤트 핸들러가 최대 한 번만 호출되도록 한다.
- 예를 들어 scroll 이벤트는 스크롤이 발생할 때마다 발생한다. 스크롤 이벤트가 발생할 때마다 이벤트 핸들러가 호출되면 브라우저 성능이 저하될 수 있다.
- 이때 스로틀을 사용하여 일정 시간 간격으로 이벤트 핸들러가 최대 한 번만 호출되도록 하면 브라우저 성능을 향상시킬 수 있다.
- 스로틀은 scroll 이벤트 처리나 무한 스크롤 구현 등에 유용하게 사용된다.

### 느낀 점 및 공유할 내용
늘 캡처링과 버블링, debounce와 throttle 두가지를 거꾸로 알기도하고 헷갈렸는데 이번 기회에 정리할 수 있어서 좋았습니다. 
여행 이후 오랜만에 책을 다시 읽다보니 더 힘드네요 ㅎㅎ 

1. 이벤트 캡처링 용례

이벤트 캡처링 단계를 언제 활용하면 좋을지 몰라서 찾아봤습니다. 두 경우 모두 잘 쓰일 것 같진 않지만 캡처링 단계에 대해 더 감을 잡을 수 있는 것 같아 공유드립니다!

[출처 event bubbling vs capturing which on should you use](https://medium.com/@manalikhattar1/event-bubbling-vs-capturing-which-one-should-you-use-a06a1a359aa4)

**기본 동작 방지**

예를 들어, 링크 클릭 시 새 탭이 열리는 기본 동작을 막고 싶을 때 이벤트 캡처링 단계를 활용할 수 있습니다.
```javascript
document.addEventListener('click', function(event) {
    if (event.target.tagName === 'A') {
        event.preventDefault();
    }
}, true);
```
**이벤트 필터링**

특정 사용자가 트리거한 이벤트만 처리하고 싶을 때, 캡처링 단계에서 필터링할 수 있습니다.
```javascript
document.addEventListener('click', function(event) {
    if (event.target.dataset.userId !== 'specificUser') {
        event.stopPropagation();
    }
}, true);
```

2. 스크롤 이벤트와 throttle

요즘에는 책에서 언급된 scroll 이벤트 처리로 intersectionObserver를 많이 사용하고 있는 것 같은데요. (특정 요소가 다른 요소와 겹치는지를 추적해서 처리하는 API)
깊이 있게 읽어본 적이 없었던 것 같아 검색해보다 실무에서 intersectionObserver를 사용했던 사례와 어떤 점에서는 스크롤 이벤트 핸들러가 더 유리한지 정리해놓은 [블로그](https://velog.io/@elrion018/%EC%8B%A4%EB%AC%B4%EC%97%90%EC%84%9C-%EB%8A%90%EB%82%80-%EC%A0%90%EC%9D%84-%EA%B3%81%EB%93%A4%EC%9D%B8-Intersection-Observer-API-%EC%A0%95%EB%A6%AC)를 봐서 공유드립니다!