# 40장 - 이벤트

## 40.1 이벤트 드리븐 프로그래밍

- 브라우저는 처리해야할 특정 사건 발생 시 감지하여 이벤를 발생시킴
- 이벤트 핸들러
    - 이벤트 발생 시 호출될 함수
- 이벤트 핸들러 등록
    - 이벤트 발생 시 브라우저에게 이벤트 핸들러의 호출을 위임하는 것
- 이벤트 드리븐 프로그래밍(event-driven programming)
    - 이벤트와 그에 대응하는 함수인 이벤트 핸들러를 통해 사용자와 애플리케이션은 상호작용이 가능
    - 이와 같이 프로그램의 흐름을 이벤트 중심으로 제어하는 프로그래밍 방식을 이벤트 드리븐 프로그래밍이라함

## 40.2 이벤트 타입

- 이벤트의 종류를 나타내는 문자열
- 약 200여 가지가 존재(사용 빈도가 높은 이벤트 위주로 정리)

### 40.2.1 마우스 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| click | 마우스 버튼을 클릭했을 때 |
| dbclick | 마우스 버튼을 더블 클릭했을 때 |
| mousedown | 마우스 버튼을 눌렀을 때 |
| mouseup | 누르고 있던 마우스 버튼을 놓았을 때 |
| mousemove | 마우스 커서를 움직였을 때 |
| mouseenter | 마우스 커서를 HTML 요소 안으로 이동했을 때(버블링 ❌) |
| mouseover | 마우스 커서를 HTML 요소 안으로 이동했을 때(버블링 ⭕)  |
| mouseleave | 마우스 커서를 HTML 요소 밖으로 이동했을 때(버블링 ❌) |
| mouseout | 마우스 커서를 HTML 요소 밖으로 이동했을 때(버블링 ⭕) |

### 40.2.2 키보드 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| keydown | 모든 키를 눌렀을 때 발생 |
| keypress | 문자 키를 눌렀을 때 연속적으로 발생(폐지되었음. 사용 하지 않는 것을 권장) |
| keyup | 누르고 있던 키를 놓았을 때 한 번만 발생 |

### 40.2.3 포커스 이벤트

| 이벤트 타입  | 이벤트 발생 시점 |
| --- | --- |
| focus | HTML 요소가 포커스를 받았을 때(버블링 ❌) |
| blur | HTML 요소가 포커스를 잃었을 때(버블링 ❌) |
| focusin | HTML 요소가 포커스를 받았을 때(버블링 ⭕) |
| focusout | HTML 요소가 포커스를 잃었을 때(버블링 ⭕) |

- focusin, focusout 이벤트 핸들러는 이벤트 핸들러 프로퍼티 방식으로 등록하면 크롬, 사파리에서 정상 동작 하지 않음
    
    → addEventListener 메서드 방식을 사용해 등록 필요
    

### 40.2.4 폼 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| submit | 1. form 요소 내의 input, select 입력 필드(textarea 제외)에서 엔터 키를 눌렀을 때 |
|        | 2. form 요소 내의 submit 버튼을 클릭했을 때 |
| reset | form 요소 내의 rest 버튼을 클릭했을 때(최근에는 사용 ❌) |

### 40.2.5 값 변경 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| input | input, select, textarea 요소의 값이 입력되었을 때 |
| change | input, select, textarea 요소의 값이 변경되었을 때 |
| readystatechange | HTML 문서의 로드와 파싱 상태를 나타내는 document.readyState 프로퍼티 값이 변경될 때 |

### 40.2.6 DOM 뮤테이션 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| DOMContentLoaded | HTML 문서의 로드와 파싱이 완료되어 DOM 생성이 완료되었을 때 |

### 40.2.7 뷰 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| resize | 브라우저 윈도우의 크기를 리사이즈할 때 연속적으로 발생(only window) |
| scroll | 웹페이지 또는 HTML 요소를 스크롤할 때 연속적으로 발생 |

### 40.2.8 리소스 이벤트

| 이벤트 타입 | 이벤트 발생 시점 |
| --- | --- |
| load | DOMContentLoaded 이벤트 발생 후 모든 리소스의 로딩이 완료되었을 때 |
| unload | 리소스가 언로드될 때(주로 새로운 웹페이지를 요청한 경우) |
| abort | 리소스 로딩이 중단되었을 때 |
| error | 리소스 로딩이 실패했을 때 |

## 40.3 이벤트 핸들러 등록

- 이벤트 핸들러를 등록하는 방법에는 3가지가 존재

### 40.3.1 이벤트 핸들러 어트리뷰트 방식

- HTML 요소의 어트리뷰트 중 이벤트에 대응하는 이벤트 핸들러 어트리뷰트가 존재
- 이벤트 핸들러 어트리뷰트의 이름은 on 접두사와 이벤트의 종류를 나타내는 이벤트 타입으로 이루어짐(e.g. onclick)
- 이벤트 핸들러 어트리뷰ㅜ트 값으로 함수 호출문 등의 문을 할당하면 이벤트 핸들러가 등록됨

```html
...
<button onclick="sayHi('gyeol')"> </button>
<script>
	function sayHi(name) {
		console.log(`Hi ${name}`);
	}
</script>
...
```

- HTML 요소의 **이벤트 핸들러 어트리뷰트 값**으로 함수 참조가 아닌 **문자열 형식의 함수 호출문을 할당**하여 이벤트 핸들러를 등록함
- **이벤트 핸들러 어트리뷰트 값은 암묵적으로 생성될 이벤트 핸들러의 함수 몸체를 의미.**
즉, 문자열로 전달된 함수 호출문이 **파싱**되어 아래 함수를 **암묵적으로 생성 후**, **이벤트 핸들러 프로퍼티에 할당됨**

```jsx
function onclick(event){
	sayHi('gyeol');
}
```

- 이렇게 동작하는 이유는 이벤트 핸들러에 **인수를 전달**하기 위함임
- 이벤트 핸들러 어트리뷰트 방식은 HTML과 JS의 관심사가 다르므로 분리하는 것이 더 좋음
- 하지만 CBD(Component Based Development)방식의 Angular,React,Svelt,Vue.js 같은 프레임워크/라이브러리에서는 이벤트 핸들러 어트리뷰트 방식으로 이벤트를 처리
→ CBD에서는 HTML, CSS, JS를 뷰를 구성하기 위한 구성요소로 보기 때문에 관심사가 같다고 생각하기 때문

### 40.3.2 이벤트 핸들러 프로퍼티 방식

- window 객체와 Document HTMLElement 타입의 DOM 노드 객체는 이벤트에 대응하는 이벤트 핸들러 프로퍼티를 가짐
- 이벤트 핸들러 프로퍼티에 함수를 바인딩하면 이벤트 핸들러가 등록됨
    
    ```html
    ...
    <button>Click me!!</button>
    <script>
    	const $button = document.querySelector('button');
    	// 이벤트 핸들러 프로퍼티에 이벤트 핸들러를 바인딩
    	$button.onclick = function(){
    		console.log('button click');
    	};
    </script>
    ...
    ```
    
- **이벤트 핸들러 등록을 위해 이벤트를 발생시킬 객체인 이벤트 타겟과 이벤트의 종류를 나타내는 문자열인 이벤트 타입, 이벤트 핸들러 지정이 필요**
    ![image](https://github.com/user-attachments/assets/d910479b-07a6-4f71-9a7e-b29103d89381)

- 이벤트 핸들러는 이벤트 타겟 또는 전파된 이벤트를 캐치할 DOM 노드 객체에 바인딩
- `이벤트 핸들러 프로퍼티 방식`은  `이벤트 핸들러 어트리뷰트 방식`의 HTML과 JS가 섞이는 문제를 해결할 수 있지만 이벤트 핸들러 프로파티에 하나의 이벤트 핸들러만 바인딩할 수 있다는 단점이 존재

### 40.3.3 addEventListener 메서드 방식

- DOM Level 2에서 도입된 `EventTarget.prototype.addEventListener` 메서드를 통해 이벤트 핸들러 등록 가능
- `이벤트 핸들러 어트리뷰트 방식`과 `이벤트 핸들러 프로퍼티 방식`은 DOM Level 0부터 제공되던 방식
    ![image](https://github.com/user-attachments/assets/33ef97cb-958f-4e4f-8c2c-0b7b6d538d8f)

- 첫 번째 매개변수에는 이벤트의 종류를 나타내는 문자열인 이벤트 타입을 전달(on 접두사를 붙이지 않음)
- 두 번째 매개변수에는 이벤트 핸들러를 전달
- 마지막 매개변수에는 이벤트를 캐치할 이벤트 전파 단계(캡처링 or 버블링)를 지정
    - 생략하거나 false 지정시 버블링 단계에서 이벤트를 캐치
    - true 지정시 캡처링 단계에서 이벤트를 캐치
    
    ```html
    ...
    <button>Click me!</button>
    <script>
    	const $button = document.querySelector('button');
    	
    	// 이벤트 핸들러 프로퍼티 방식
    	// $button.onclick = function (){
    	//	console.log('button click');	
    	// }
    	
    	// addEventListener 메서드 방식
    	$button.addEventListener('click', function (){
    	console.log('button click');	
    	});
    </script>
    ...
    ```
    
- addEventListener 메서드를 통해 참조가 동일한 이벤트 핸들러를 중복 등록하면 하나의 이벤트 핸들러만 등록됨

## 40.4 이벤트 핸들러 제거

- `EventTarget.prototype.removeEventListener` 메서드를 통해 `addEventListener` 메서드로 등록한 이벤트 핸들러 제거 가능
- `removeEventListener` 메서드에 전달할 인수는 `addEventListener` 메서드와 동일
단, `addEventListener`  메서드에 전달한 인수와 `removeEventListener` 메서드에 전달한 인수가 일치하지 않으면 제거 불가능
- 이벤트 핸들러 프로퍼티 방식으로 등록한 이벤트 핸들러는 `removeEventListener` 메서드로 제거 불가능.
제거하려면 이벤트 핸들러 프로퍼티에 null을 할당

## 40.5 이벤트 객체

- 이벤트 발생시 이벤트에 관련한 정보를 담고 있는 이벤트 객체가 동적으로 생성
- 생성된 이벤트 객체는 이벤트 핸들러의 첫 번째 인수로 전달(이름 상관 없음)
- `이벤트 핸들러 어트리뷰트 방식` 으로 등록한 이벤트 핸들러는 `event` 라는 이름으로 이벤트 객체를 전달 받을 수 있음(다른 이름 x)
- event가 아닌 다른 이름으로 매개변수 전달시 전달 받지 못하는 이유
    - `이벤트 핸들러 어트리뷰트 값`은 암묵적으로 생성되는 이벤트 핸들러의 함수 몸체를 의미
    → onclick=”showCoords(event)” 어트리뷰트는 파싱되어 onclick 이벤트 핸들러 프로퍼티에 할당함. 이 때 암묵적으로 생성된 onclick 이벤트 핸들러의 첫번째 매개변수 이름이 event으로 암묵적으로 명명됨

### 30.5.1 이벤트 객체의 상속 구조

- 이벤트 발생시 이벤트 타입에 따라 다양한 타입의 이벤트 객체가 생성됨
- 이벤트 객체는 다음과 같은 상속 구조를 가짐
    ![image](https://github.com/user-attachments/assets/4a4e289c-a381-4164-b8e6-72e057dd11c9)

### 40.5.2 이벤트 객체의 공통 프로퍼티

- Event 인터페이스의 이벤트 관련 프로퍼티는 모든 이벤트 객체가 상속받는 공통 프로퍼티임
- 이벤트 객체의 공통 프로퍼티
    
    
    | 공통 프로퍼티 | 설명 | 타입 |
    | --- | --- | --- |
    | type | 이벤트 타입 | string |
    | target | 이벤트를 발생시킨 DOM 요소 | DOM 요소 노드 |
    | currentTarget | 이벤트 핸들러가 바인딩된 DOM 요소 | DOM 요소 노드 |
    | eventPhase | 이벤트 전파 단계                             |number |
    |             |0 : 이벤트 없음 1 : 캡처링 단계 2 : 타겟 단계 3 : 버블링 단계 |  |
    | bubbles | 이벤트를 버블링으로 전파하는지 여부.             | boolean |
    |        |  다음 이벤트는 bubbles:false로 버블링 하지 않음|     |
    |        |- 포커스 이벤트 : focus / blur                  |        |
    |        |- 리소스 이벤트 : load / unload / abort / error|        |
    |        |- 마우스 이벤트 : mouseenter / mouseleave      |        |
    | cancelable | preventDefault 메서드를 호출하여 이벤트 기본 동작 취소 가능 여부. | boolean |
    |        |다음 이벤트는 cacelable:false 로 취소 불가능 |       |
    |        |- 포커스 이벤트 : focus / blur |       |
    |        |- 리소스 이벤트 : load / unload / abort / error |       |
    |        |- 마우스 이벤트 : dbclick / mouseenter / mouseleave |       |
    | defaultPrevented | preventDefault  메서드를 호출하여 이벤트를 취소 했는지 여부 | boolean |
    | isTrusted | 사용자의 행위에 의해 발생한 이벤트인지 여부 | boolean |
    | timeStamp | 이벤트가 발생한 시각 | number |

### 40.5.3 마우스 정보 취득

- MouseEvent 타입의 이벤트 객체는 다음과 같은 고유의 프로퍼티를 가짐
    - 마우스 포인터 좌표 정보를 나타내는 프로퍼티
    → screenX/screenY, clientX/clientY, pageX/pageY, offsetX/offsetY
    - 버튼정보를 나타내는 프로퍼티 
    → altKey, ctrlKey, shiftKey, button

### 40.5.4 키보드 정보 취득

- KeyboardEvent 타입의 이벤트 객체는 altKey, ctrlKey, shiftKey, metaKey, key, keyCode 같은 고유의 프로퍼티를 가짐

## 40.6 이벤트 전파

- DOM 트리 상에 존재하는 DOM 요소 노드에서 발생한 이벤트는 DOM 트리를 통해 전파됨
    
    ```html
    <!DOCTYPE html>
    <html>
    <body>
      	<ul id="fruits">
        	<li id='apple'>Apple</li>
            <li id='banana'>Banana</li>
            <li id='orange'>Orange</li>
        </ul>
    </body>
    </html>
    ```
    
- ul 요소의 두 번째 자식 요소인 li 요소 클릭시 클릭 이벤트가 발생
이때 생성된 이벤트 객체는 이벤트를 발생시킨 DOM 요소인 이벤트 타겟을 중심으로 DOM 트리를 통해 전파됨
    ![image](https://github.com/user-attachments/assets/182b55fb-8ef7-450e-ab21-f7c0ac779440)

- 이벤트 전파는 이벤트 객체가 전파되는 방향에 따라 다음과 같이 3단계로 구분
    - `캡처링 단계` 
    이벤트가 상위 요소에서 하위 요소 방향으로 전파
    - `타겟 단계`
    이벤트가 이벤트 타깃에 도달
    - `버블링 단계` 
    이벤트가 하위 요소에서 상위 요소 방향으로 전파
- **이벤트는 이벤트를 발생시킨 이벤트 타겟은 물론 상위 DOM 요소에서도 캐치 가능**

## 40.7 이벤트 위임

- 여러 개의 하위 DOM 요소에 각 이벤트 핸들러를 등록하는 대신 하나의 상위 DOM 요소에 이벤트 핸들러를 등록하는 방법
- 이벤트 위임을 통해 상위 DOM 요소에 이벤트 핸들러를 등록하면 여러 개의 하위 DOM 요소에 이벤트 핸들러를 등록할 필요가 없음
- 동적으로 하위 DOM 요소를 추가하더라도 등록해줄 필요 없음

## 40.8 DOM 요소의 기본 동작 조작

### 40.8.1 DOM 요소의 기본 동작 중단

- 이벤트 객체의 `preventDefault 메서드` 를 통해 DOM 요소의 기본 동작을 중단시킬 수 있음

### 40.8.2 이벤트 전파 방지

- 이벤트 객체의 `stopPropagation 메서드` 를 통해 이벤트 전파 중지 가능

## 40.9 이벤트 핸들러 내부의 this

### 40.9.1 이벤트 핸들러 어트리뷰트 방식

```html
	...
	<button onclick="handleClick()">Click me!</button>
	<script>
		function handleClick(){
			console.log(this);
		}
	</script>
...
```

- handleClick 함수 내부의 this는 전역 객체 window를 가리킴
    
    → 일반 함수로서 호출되는 함수 내부의 this는 전역 객체를 가리키기 때문
    
- 단, 이벤트 핸들러 호출시 인수로 전달된 this는 이벤트를 바인딩한 DOM 요소를 가리킴

### 40.9.2 이벤트 핸들러 프로퍼티 방식과 addEventListener 메서드 방식

- 두 방식 모두 이벤트 핸들러 내부의 this는 이벤트를 바인딩한 DOM 요소를 가리킴
→ 이벤트 핸들러 내부의 this는 이벤트 객체의 currentTarget 프로퍼티와 같음
- 화살표 함수로 정의한 이벤트 핸들러 내부의 this는 상위 스코프의 this를 가리킴
→ 화살표 함수는 함수 자체의 this 바인딩을 갖지 않음

# 41장 - 타이머

## 41.1 호출 스케줄링

- 함수를 명시적으로 호출하면 즉시 실행됨
- 함수를 명시적으로 호출하지 않고 일정 시간이 경과된 이후에 호출되도록 하고싶다면?
타이머 함수를 사용하면 됨 → 이를 호출 스케줄링이라 함
- JS는 타이머를 생성할 수 있는 타이머 함수 `setTimeout` 과 `setInterval` 타이머를 제거할 수 있는 타이머 함수 `clearTimeout` 과 `clearInterval` 을 제공함
- 타이머 함수는 ECMAScript 사양에 정의된 빌트인 함수가 아님. 
브라우저환경와 Node.js 환경에서 모두 전역 객체의 메서드로서 타이머 함수를 제공
→ 타이머 함수는 **호스트 객체**
- JS 엔진은 싱글 스레드로 동작
**→ 타이머 함수들은 비동기 처리 방식으로 동작**

## 41.2 타이머 함수

### 41.2.1 setTimeout / clearTimeout

- `setTimeout` 함수는 두 번째 인수로 전달받은 시간으로 단 한번 동작하는 타이머를 생성
이후 타이머가 만료되면 첫 번째 인수로 전달받은 콜백함수가 호출됨
→ setTimeout 함수의 콜백 함수는 두 번째 인수로 전달 받은 시간 이후 단 한번 실행 되도록 호출 스케줄링
    
    ```jsx
    const timeoutId = setTimeout(func|code[, delay, param1, param2, ...]);
    ```
    
- `setTimeout` 함수는 생성된 타이머를 식별할 수 있는 고유한 타이머 id를 반환하는데 이 id는 브라우저 환경인 경우 숫자, Node.js 환경인 경우 객체임

### 41.2.2 setInterval / clearInterval

- `setInterval` 함수는 두 번째 인수로 전달받은 시간으로 반복 동작하는 타이머를 생성
    
    이후 타이머가 만료될 때마다 첫 번째 인수로 전달받은 콜백 함수가 반복 호출됨(타이머가 취소될 때까지 계속됨)
    → setInterval 함수의 콜백함수는 두 번째 인수로 전달받은 시간이 경과할 때마다 반복시랳ㅇ되도록 호출 스케출링
    
    ```jsx
    const timerId = setInterval(func|code[, delay, param1, param2, ...]);
    ```
    
- `setInterval` 함수는 생성된 타이머를 식별할 수 있는 고유한 타이머 id를 반환하는데 이 id는 브라우저 환경인 경우 숫자, Node.js 환경인 경우 객체임

## 41.3 디바운스와 스로틀

- scroll, resize, input, mousemove 같은 이벤트는 짧은 시간 간격으로 연속해서 발생
    
    → 이러한 이벤트에 바인딩한 이벤트 핸들러는 과도하게 호출되어 성능에 문제를 일으킬 수 있음
    
- **디바운스와 스로틀은 짧은 시간 간격으로 연속해서 발생하는 이벤트를 그룹화해서 과도한 이벤트 핸들러의 호출을 방지하는 프로그래밍 기법**
- 디바운스와 스로틀은 이벤트를 처리할 때 매우 유용하며 구현시 타이머 함수가 사용됨

### 41.3.1 디바운스

- 짧은 시간 간격으로 이벤트가 연속해서 발생하면 이벤트 핸들러를 호출하지 않다가 일정 시간이 경과한 이후에 이벤트 핸들러가 한 번만 호출되도록 함
→ 짧은 시간 간격으로 발생하는 이벤트를 그룹화해서 마지막에 한 번만 이벤트 핸들러가 호출되도록 함
- 디바운스는 resize 이벤트 처리나 input 요소에 입력된 값으로 ajax 요청하는 입력필드 자동완성 UI 구현, 버튼 중복 클릭 방지 처리 등에 유용하게 사용됨
- 실무에서는 Underscore의 debounce 함수나 Lodash의 debounce 함수 사용을 권장

### 41.3.2 스로틀

- 짧은 시간 간격으로 이벤트가 연속으로 발생하더라도 일정 시간 간격으로 이벤트 핸들러가 최대 한 번만 호출되도록 함
    
    → 짧은 시간 간격으로 연속해서 발생하는 이벤트를 그룹화해서 일정 시간 단위로 이벤트 핸들러가 호출되도록 호출 주기를 만듦
    
- 스로틀은 scroll 이벤트 처리나 무한 스크롤 UI 구현 등에 유용하게 사용됨
- 실무에서는 Underscore의 throttle 함수나 Loadsh의 throttle 함수 사용을 권장
