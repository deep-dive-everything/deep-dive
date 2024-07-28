# 40 이벤트

## 1. 이벤트 드리븐 프로그래밍

- 이벤트 : 클릭, 키보드입력, 마우스 이동 등 사용자의 행위.
- 이벤트 핸들러 : 이벤트가 발생했을 때 호출될 함수.
- 이벤트 핸들러 등록 : 이벤트가 발생했을 때 브라우저에게 이벤트 핸들러의 호출을 위임하는 것.
- 이벤트 드리븐 프로그래밍 : 이벤트 중심으로 프로그램의 흐름을 제어하는 프로그래밍 방식

## 2. 이벤트 타입

### 2.1 마우스 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| click | 마우스 버튼을 클릭했을 때 |
| dblclick | 마우스 버튼을 더블 클릭했을 때 |
| mousedown | 마우스 버튼을 눌렀을 때 |
| mouseup | 누르고 있던 마우스 버튼을 놓았을 때 |
| mousemove | 마우스 커서를 움직였을 때 |
| mouseenter | 마우스 커서를 HTML 요소 안으로 이동했을 때(버블링되지 않는다) |
| mouseover | 마우스 커서를 HTML 요소 안으로 이동했을 때(버블링된다) |
| mouseleave | 마우스 커서를 HTML 요소 밖으로 이동했을 때(버블링되지 않는다) |
| mouseout | 마우스 커서를 HTML 요소 밖으로 이동했을 때(버블링된다) |

### 40.2.2 키보드 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| keydown | 모든 키를 눌렀을 때 발생한다.※ control, option, shift, tab, delete, enter, 방향 키와 문자, 숫자, 특수 문자가 키를 눌렀을 때 발생한다. 단, 문자, 숫자, 특수 문자, enter 키를 눌렀을 때는 연속적으로 발생하지만 그 외의 키를 눌렀을 때는 한 번만 발생한다. |
| keypress | 문자 키를 눌렀을 때 연속적으로 발생한다.※ control, option, shift, tab, delete, 방향 키 등을 눌렀을 때는 발생하지 않고 문자, 숫자, 특수 문자, enter키를 눌렀을 때만 발생한다. 하지만, 이 이벤트는 폐지(deprecated)되었으므로 사용하지 않을 것을 권장한다. |
| keyup | 누르고 있던 키를 놓았을 때 한 번만 발생한다.※ keydown 이벤트와 마찬가지로 control, option, shift, tab, delete, enter, 방향 키와 문자, 숫자, 특수 문자 키를 놓았을 때 발생한다. |

### 40.2.3 포커스 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| focus | HTML 요소가 포커스를 받았을 때(버블링되지 않는다) |
| blur | HTML 요소가 포커스를 잃었을 때(버블링되지 않는다) |
| focusin | HTML 요소가 포커스를 받았을 때(버블링된다) |
| focusout | HTML 요소가 포커스를 잃었을 때(버블링된다) |

### 40.2.4 폼 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| submit | 1. form 요소 내의 input(text, checkbox, radio), select 입력 필드(textarea 제외)에서 엔터 키를 눌렀을 때<br>2. form 요소 내의 submit 버튼(<button>, <input type="submit">)을 클릭했을 때※ submit 이벤트는 form 요소에서 발생한다. |

### 40.2.5 값 변경 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| input | input(text, checkbox, radio), select, textarea 요소의 값이 입력되었을 때 |
| change | input(text, checkbox, radio), select, textarea 요소의 값이 변경되었을 때※ change 이벤트는 input 이벤트와는 달리 HTML 요소가 포커스를 잃었을 때 사용자 입력이 종료되었다고 인식하여 발생한다. 즉, 사용자가 입력을 하고 있을 때는 input 이벤트가 발생하고 사용자가 입력이 종료되어 값이 변경되면 change 이벤트가 발생한다. |
| readystatechange | HTML 문서의 로드와 파싱 상태를 나타내는 document.readyState 프로퍼티 값('loading', 'interactive', 'complete')이 변경될 때 |

### 2.7 뷰 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| resize | 브라우저 윈도우(window)의 크기를 리사이즈할 때 연속적으로 발생한다.※ 오직 window 객체에서만 발생한다. |
| scroll | 웹페이지(document) 또는 HTML 요소를 스크롤할 때 연속적으로 발생한다. |

### 2.8 리소스 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| load | DOMContentLoaded 이벤트가 발생한 이후, 모든 리소스(이미지, 폰트 등)의 로딩이 완료되었을 때(주로 window 객체에서 발생) |
| unload | 리소스가 언로드될 때(주로 새로운 웹페이지를 요청할 경우) |
| abort | 리소스 로딩이 중단되었을 때 |
| error | 리소스 로딩이 실패했을 때 |

## 3. 이벤트 핸들러 등록

### 3.1 이벤트 핸들러 어트리뷰트 방식

- html요소의 이벤트 핸들러 어트리뷰트 값으로 함수 호출문을 할당해 이벤트 핸들러를 등록하는 방식.

```jsx

<body>
  <button onclick="sayHi('Lee')">Click me!</button>
  <script>
    function sayHi(name) {
      console.log(`Hi! ${name}.`);
    }
  </script>
</body>
```

- 이벤트 핸들러 어트리뷰트는 암묵적으로 생성될 이벤트 핸들러의 함수 몸체를 의미함

```jsx
function onClick(event) {
	sayHi('Lee');
}
```

- HTML과 자바스크립트는 관심사가 다르므로 분리하는 것이 더 좋음.
- 하지만 CBD(Component Based Development)방식의 Angular/React/Svelte/Vue.js같은 프레임워크/라이브러리에서는 HTML, CSS, JS를 관심사가 다른 개별 요소가 아닌 뷰를 구성하는 구성요소로 보기 때문에 이벤트 핸들러 어트리뷰트 방식으로 이벤트를 처리함.

### 3.2 이벤트 핸들러 프로퍼티 방식

- 이벤트 타깃 : 이벤트를 발생시킬 객체
- 이벤트 타입 : 이벤트의 종류
- 이벤트 핸들러

```jsx
    const $button = document.querySelector('button');
    $button.onclick = function () {
      console.log('button click')
    }
```

- 이벤트 핸들러 어트리뷰트 방식은 여러 개의 문을 할당할 수 있지만 이벤트 핸들러 프로퍼티 방식은 하나의 이벤트 핸들러만 바인딩 할 수 있음.

### 3.3 addEventListener 메서드 방식

```jsx
EventTarget.addEventListener('eventType', functionName [, userCaputre]);
```

- 첫번째 매개변수에는 이벤트 타입을 전달함. 이벤트 핸들러 프로퍼티 방식과 달리 on접두사를 붙이지 않음.
- 두번째 매개변수에는 이벤트 핸들러를 전달
- 세번째 매개변수에는 이벤트를 캐치할 이벤트 전파 단계(캡처링 또는 버블링)를 지정하거나 생략. 생략하거나 false면 버블링 단계, true면 캡처링 단계에서 이벤트를 캐치한다 (6. 이벤트 전파 참고)
- 하나 이상의 이벤트 핸들러를 등록할 수 있음.

## 4. 이벤트 핸들러 제거

- EventTarget.prototype.removeEventListener : addEventListener로 등록한 이벤트 핸들러 제거.
- 이때 addEventListener와 removeEventListener에 전달할 인수가 일치해야함.

```jsx
$button.addEventListener('click', handleClick);

$button.remoeEventListener('click', handleClick, true); // 실패
$button.removeEventListener('click', handleClick); // 성공

```

- 인수로 전달한 이벤트 핸들러가 동일한 함수여야 하기 때문에 무명함수를 이벤트 핸들러로 등록한 경우 제거할 수 없음. 이벤트 핸들러의 참조를 변수나 자료구조에 저장해야함.
- 이벤트 핸들러 프로퍼티 방식으로 등록한 경우 removeEventListener메서드로 제거할 수 없음.
- 이벤트 핸들러 프로퍼티 방식으로 등록한 이벤트를 지우려면 이벤트 핸들러 프로퍼티에 null 할당

```jsx
    const $button = document.querySelector('button');
    $button.onclick = function () {
      console.log('button click')
    }
    
    $button.onclick = null;
```

## 5. 이벤트 객체

- 이벤트가 발생하면 이벤트에 대한 다양한 정보를 담은 이벤트 객체가 동적으로 생성됨.
- 생성된 이벤트 객체는 이벤트 핸들러의 첫 번쨰 인수로 전달됨.
- 따라서 이벤트 객체를 전달받으려면 이벤트 핸들러를 정의할 때 이벤트 객체를 전달받을 매개변수로 선언해야함.

```jsx
function showCoords(e) {
	$msg.textContent = `ClientX : ${e.clientX}`;
}
```

### 5.2 이벤트 객체의 공통 프로퍼티

- Event 인터페이스의 이벤트 관련 프로퍼티는 모든 이벤트 객체가 상속받는 공통 프로퍼티임.

| 공통 프로퍼티 | 설명 | 타입 |
| --- | --- | --- |
| type | 이벤트 타입 | string |
| target | 이벤트를 발생시킨 DOM 요소 | DOM 요소 노드 |
| currentTarget | 이벤트 핸들러가 바인딩된 DOM 요소 | DOM 요소 노드 |
| eventPhase | 이벤트 전파 단계 <br> 0: 이벤트 없음, 1: 캡처링 단계, 2: 타깃 단계, 3: 버블링 단계 | number |
| bubbles | 이벤트를 버블링으로 전파하는지 여부. 다음 이벤트는 bubbles: false로 버블링하지 않는다.<br> - 포커스 이벤트 focus/blur<br> - 리소스 이벤트 load/unload/abort/error<br> - 마우스 이벤트 mouseenter/mouseleave | boolean |
| cancelable | preventDefault 메서드를 호출하여 이벤트의 기본 동작을 취소할 수 있는지 여부. 다음 이벤트는 cancelable: false로 취소할 수 없다.<br> - 포커스 이벤트 focus/blur<br> - 리소스 이벤트 load/unload/abort/error<br> - 마우스 이벤트 dblclick/mouseenter/mouseleave | boolean |
| defaultPrevented | preventDefault 메서드를 호출하여 이벤트를 취소했는지 여부 | boolean |
| isTrusted | 사용자의 행위에 의해 발생한 이벤트인지 여부. 예를 들어, click 메서드 또는 dispatchEvent 메서드를 통해 인위적으로 발생시킨 이벤트인 경우 isTrusted는 false다. | boolean |
| timeStamp | 이벤트가 발생한 시각(1970/01/01/00:00:00부터 경과한 밀리초) |  |

### 5.3 마우스 정보 취득

- 마우스 포인터의 좌표 정보를 나타내는 프로퍼티 : screenX/screentY, clientX/clientY, pageX/pageY, offsetX/offsetY
- mousedown, mouseup, mousemove등의 이벤트가 발생하면 mouseEvent 타입의 객체는 마우스 포인터의 좌표 정보를 나타내는 프로퍼티를 제공함.

### 5.4 키보드 정보 취득

- 버튼 정보를 나타내는 프로퍼티 : altKey, ctrlKey, shiftKey, metaKey, key, keyCode
- keyup 이벤트가 발생하면 keyboardEvent 타입의 이벤트 객체는 입력한 키 값을 문자열로 반환하는 key 프로퍼티를 제공함.

## 6. 이벤트 전파

- 생성된 이벤트 객체는 이벤트를 발생시킨 DOM요소인 이벤트 타깃을 중심으로 DOM트리를 통해 전파됨.
    - 캡처링 단계 : 이벤트가 상위 요소에서 하위 요소 방향으로 전파
    - 타깃 단계 : 이벤트가 타깃에 도달
    - 버블링 단계 : 이벤트가 하위 요소에서 상위 요소 방향으로 전파
- 이벤트는 이벤트를 발생시킨 이벤트 타깃뿐 아니라 상위 DOM요소에서도 캐치할 수 있다.
- 캡처링 단계에서 이벤트를 캐치하기 위해서는 addEventListener의 3번쨰 인수를 true로 전달하면 된다.
- 버블링을 통해 전파되지 않는 이벤트
    - 포커스 이벤트 : focus/blur
    - 리소스 이벤트 : load/unload/abort/error
    - 마우스 이벤트 : mouseenter/mouseleave

## 7. 이벤트 위임

- 여러개의 하위 DOM요소에 각각 이벤트 핸들러를 등록하는 대신 하나의 상위 DOM요소에 이벤트 핸들러를 등록하는 방법.

```jsx
//사용자 클릭에 의해 선택된 네비게이션 아이템(li요소)에 active 클래스를 추가하고
//그 외 모든 네비게이션 아이템의 active 클래스를 제거
function activate({target}) {
	if(!target.matches '#fruits > li') return;

	[...$fruits.children].forEach($fruit => {
	$fruit.classList.toggle('active', $fruit === target);
	})
}

//이벤트 위임 : 상위요소(ul#fruit)는 하위 요소의 이벤트를 캐치할 수 있음.
$fruits.onclick = activate
```

- 상위 요소에 바인딩된 이벤트 핸들러는 자기 자신은 물론 하위 요소중에서 클릭 이벤트를 발생시킨 모든 DOM요소에 반응한다. 따라서 이벤트에 반응이 필요한 DOM요소에 한정하여 이벤트 핸들러가 실행되도록 이벤트 타깃을 검사해야함.

## 8. DOM요소의 기본 동작

### 8.1 DOM요소의 기본 동작 중단

- e.preventDefault : DOM 요소의 기본 동작을 중단시킴.
- a요소를 클릭하면 href어트리뷰트에 저장된 링크로 이동, checkbox radio 요소 클릭시 체크 또는 해제되는것 등을 중단할 수 있음.

### 8.2 이벤트 전파 방지

- stopPropagation
- 상위 DOM요소에서 이벤트를 위임하고 있는 경우, 자신이 발생시킨 이벤트가 전파되는 것을 중단하여 상위 요소에서 이벤트를 캐치할 수 없도록 하여 자신에게 바인딩 된 이벤트 핸들러만 실행되도록 함.

## 9. 이벤트 핸들러 내부의 this

### 9.1 이벤트 핸들러 어트리뷰트 방식

```jsx
<body>
  <button onclick="handleClick(this)">Click me!</button>
  <script>
    function handleClick(button) {
      console.log(this); //window
      console.log(button) // 이벤트를 바인딩한 button요소
    }
  </script>
</body>
```

- 이벤트 핸들러 내부의 this는 전역 객체 window를 가리킴
- handleClick함수는 이벤트 핸들러에 의해 일반함수로 호출됨. 일반함수 내부의 this는 전역객체이므로 전역 객체window를 가리킴.
- 이벤트 핸들러를 호출할 때 인수로 전달한 this는 이벤트를 바인딩한 DOM요소

### 9.2 이벤트 핸들러 프로퍼티 방식과 addEventListener 메서드 방식

- 두 방식 모두 이벤트 핸들러 내부의 this는 이벤트를 바인딩 한 DOM요소를 가리킴.
- 이벤트핸들러 내부의 this는 이벤트 객체의 currentTarget프로퍼티와 같음.
- 화살표 함수로 정의한 이벤트 핸들러 내부의 this는 상위 스코프의 this를 가리킴.

## 10. 이벤트 핸들러에 인수 전달

- 이벤트 핸들러 프로퍼티 방식과 addEventListener 메서드 방식은 이벤트 핸들러를 브라우저가 호출하기 떄문에 함수 호출문이 아닌 함수 자체를 등록해야하므로 인수를 전달할 수 없음.
- 이떄 이벤트 핸들러 내부에서 함수를 호출하면서 인수를 전달할 수 있음.

```jsx
input.onblur = () => {
	checkUserNameLength(MIN_User_Name_LENGTH);
}
```

## 11. 커스텀 이벤트

### 11.1 커스텀 이벤트 생성

- Event, UIEvent, MouseEvent와 같은 이벤트 생성자 함수를 호출하여 명시적으로 생성한 이벤트 객체는 임의의 이벤트 타입을 지정할 수 있음.
- 첫번쨰 인수로 이벤트 타입을 나타내는 문자열을 전달받음. 이떄 기존 이벤트 타입을 사용할 수 있고, 기존 이벤트 타입이 아닌 임의의 문자열을 사용할 수도 있음.

```jsx
const keyboardEvent = new keyboardEvent('keyup');
console.log(keyboardEvent.type)// keyup
```

- 생성된 커스텀 이벤트 객체는 버블링되지 않으며 preventDerault메서드로 취소할 수 없음.
- 커스텀이벤트 객체의 bubbles 또는 calcelable프로퍼티를 true로 설정려면 이벤트 생성자 함수의 두번째 인수로 bubbles또는 cancelable 프로퍼티를 갖는 객체를 전달함.
- 이벤트 타입 고유의 프로퍼티값을 지정할 수 있음. 두번쨰 인수로 프로퍼티를 전달하면 됨.

### 11.2 커스텀 이벤트 디스패치

- 생성된 커스텀 이벤트는 dispatchEvent매서드로 디스패치(이벤트를 발생시키는 행위) 할 수 있음.
- dispatchEvent메서드는 이벤트 핸들러를 동기적으로 호출하므로 메서드를 사용하기 이전에 커스텀 이벤트를 처리할 이벤트 핸들러를 등록해야함.

# 41 타이머

## 1. 호출 스케줄링

- 호출 스케줄링 : 함수를 일정시간이 경과된 후 호출되도록 함수 호출을 예약하기 위해 타이머함수를 사용하는것.
- 타이머 생성 : setTimeout, setInterval
- 타이머 제거 : clearTimeout, clearInterval
- 자바스크립트 엔진은 두가지 이상의 태스크를 동시에 실행할 수 없는 싱글 스레드 방식으로 동작하기 떄문에 setTimeout과 setInterval은 비동기 처리 방식으로 동작함.

## 2. 타이머 함수

### 2.1 setTimeout / clearTimeout

- setTimeout은 두번째 인수로 전달받은 시간으로 단 한번 동작하는 타이머를 생성함.
- 타이머가 만료되면 첫번째 인수로 전달받은 콜백함수 호출
- setTimeout은 생성된 타이머를 식별할 수 있는 고유한 타이머 id를 반환한다.
- clearTimeout은 타이머id를 인수로 전달받아 타이머를 취소할 수 있다.

```jsx
const timeoutId = setTimeout(func|code[, delay, param1, param2, ...]);

clearTimeout(timeoutId)
```

### 2.2 setInterval / clearInterval

- setInterval은 두번쨰 인수로 전달받은 지간으로 반복 동작하는 타이머를 생성한다.
- 타이머가 만료될 때 마다 첫번째 인수로 전달받은 콜백 함수가 반복 호출됨.
- clearInterval로 함수 스케줄링을 취소할 수 있음.

```jsx
const timerId = setInterval(func|code[, delay, param1, param2, ...]);
```

## 3. 디바운스와 스로틀

- 짧은 시간 간격으로 연속해서 발생하는 이벤트를 그룹화해서 과도한 이벤트 핸들러의 호출을 방지하는 프로그래밍 기법.

### 3.1 디바운스

- 짧은 시간 간격으로 이벤트가 연속해서 발생하면 이벤트 핸들러를 호출하지 않다가 일정 시간이 경과한 이후에 이벤트 핸들러가 한번만 호출하도록함.
- 이벤트를 그룹화하여 마지막에 한 번만 이벤트 핸들러가 호출되도록 함.

```jsx
const debounce = (callback, delay) => {
	let timerId;
	return event => {
	//delay가 경과하기 이전에 이벤트가 발생하면 이전 타이머를 취소하고 새로운 타이머를 재설정함
	//delay보다 짧은 간격으로 이벤트가 발생하면 callback은 호출되지 않음.
		if (timeerId) clearTimeout(timerId);
		timerId = setTimeout(callback, delay, event);
	}
}

//300ms보다 짧은 간격으로 input이벤트가 발생하면 debounce의 콜백함수는 호출되지 않다가 
//300ms동안 input이벤트가 발생하지 않으면 한번만 호출됨
$input.oninput = debounce(e => {
		$msg.textContent = e.target.value;
	}, 300);
```

- input요소에 입력된 값으로 ajax를 요청하는 필드 자동완성 UI, 버튼 중복클릭 방지 등에 사용
- 실무에서는 Underscore의 debounce함수나 Lodash의 debounce함수를 사용하는 것을 권장

### 3.2 스로틀

- 짧은 시간 간격으로 이벤트가 연속해서 발생하더라도 일정 시간 간격으로 이벤트 핸들러가 최대 한번만 호출되도록함.
- 일정 시간 단위로 이벤트 핸들러가 호출되도록 호출 주기를 만듬.
- scroll이벤트 등 짧은 시간 간격으로 발생하는 이벤트를 그룹화해서 일정 시간 단위로 이벤트 핸들러가 호출되도록 호출 주기를 만듬.
- scroll이벤트 처리나 무한스크롤 UI구현에 사용됨.
- 실무에서는 Underscore의 throttle함수나 Lodash의 throttle함수를 사용하는 것을 권장
