### 40장. 이벤트

이벤트 드리븐 프로그래밍 : 프로그램 흐름을 이벤트 중심으로 제어하는 프로그래밍 방식

- 브라우저는 특정 사건이 발생하는 것을 감지하여 이벤트를 발생시킴.
- 사용자의 동작이 언제 발생할지, 함수를 언제 호출할 지 알 수 없으므로 브라우저에게 함수 호출을 위임.
- 이벤트가 발생했을 때,
  - 호출될 함수 &rarr; 이벤트 헨들러
  - 브라우저에게 이벤트 헨들러의 호출을 위임 &rarr; 이벤트 헨들러 등록

이벤트 타입 : 마우스, 키보드, 포커스, 폼, 값 변경,  DOM 뮤테이션, 뷰, 리소스 이벤트

이벤트 헨들러 등록

1. 이벤트 핸들러 어트리뷰트 방식
   - 어트리뷰트 값 : 함수 호출문 등의 문을 할당 (함수 참조 X, 이벤트 헨들러에 인수를 전달하기 위해)
2. 이벤트 핸들러 프로퍼티 방식
   - 이벤트 핸들러 프로퍼티에 함수를 바인딩
   - 장점 : 이벤트 핸들러 어트리뷰트 방식의 HTML과 자바스크립트 뒤섞이는 문제 해결
   - 단점 : 하나의 이벤트 핸들러만 바인딩 가능
3. addEventListener 메서드 방식
   - EventTarget.addEventListener('eventType', funtionName,[, useCapture]);
   - 하나 이상의 이벤트 핸들러 등록 가능 (등록된 수서대로 호출)
   - 참조가 동일한 이벤트 핸들러 중복 등록 시, 하나의 이벤트 핸들러만 등록

이벤트 핸들러 제거

- EventTarget.prototype.removeEvent.Listener 메서드 사용 (조건 : 인수가 addEventListener 메서드에 전달한 인수와 일치)

이벤트 객체 : 이벤트 발생 시, 이벤트 객체(이벤트 관련 다양한 정보) 동적으로 생성, 이벤트 핸들러의 첫번째 인수로 전달

- 이벤트 어트리뷰트 방식인 경우 첫 번째 매개변수 이름이 반드시 event여야 함.

이벤트 객체의 공통 프로퍼티

- target : 이벤트를 발생시킨 DOM 요소
- currentTarget : 이벤트 핸들러가 바인딩된 DOM 요소
- defaultPrevented : preventDefault메서드를 호출하여 이벤트를 취소했는지 여부

마우스 정보 취득

- mousedown 이벤트가 발생했을 때(드래그 시작)의 마우스 포인터 좌표와 mousemove이벤트가 발생(드래그 중)할 때마다의 마우스 포인터 좌표를 비교 후 mouseup 이벤트 시(드래그 종료), 이벤트 핸들러 제거하여 이동 멈춤

```js
<!DOCTYPE html>
<html>
<head>
  <style>
    .box {
      width: 100px;
      height: 100px;
      background-color: #fff700;
      border: 5px solid orange;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="box"></div>
  <script>
    // 드래그 대상 요소
    const $box = document.querySelector('.box');

    // 드래그 시작 시점의 마우스 포인터 위치
    const initialMousePos = { x: 0, y: 0 };
    // 오프셋: 이동할 거리
    const offset = { x: 0, y: 0 };

    // mousemove 이벤트 핸들러
    const move = e => {
      // 오프셋 = 현재(드래그하고 있는 시점) 마우스 포인터 위치 - 드래그 시작 시점의 마우스 포인터 위치
      offset.x = e.clientX - initialMousePos.x;
      offset.y = e.clientY - initialMousePos.y;

      // translate3d는 GPU를 사용하므로 absolute의 top, left를 사용하는 것보다 빠르다.
      // top, left는 레이아웃에 영향을 준다.
      $box.style.transform = `translate3d(${offset.x}px, ${offset.y}px, 0)`;
    };

    // mousedown 이벤트가 발생하면 드래그 시작 시점의 마우스 포인터 좌표를 저장한다.
    $box.addEventListener('mousedown', e => {
      // 이동 거리를 계산하기 위해 mousedown 이벤트가 발생(드래그를 시작)하면
      // 드래그 시작 시점의 마우스 포인터 좌표(e.clientX/e.clientY: 뷰포트 상에서 현재
      // 마우스의 포인터 좌표)를 저장해 둔다. 한번 이상 드래그로 이동한 경우 move에서
      // translate3d(${offset.x}px, ${offset.y}px, 0)으로 이동한 상태이므로
      // offset.x와 offset.y를 빼주어야 한다.
      initialMousePos.x = e.clientX - offset.x;
      initialMousePos.y = e.clientY - offset.y;

      // mousedown 이벤트가 발생한 상태에서 mousemove 이벤트가 발생하면
      // box 요소를 이동시킨다.
      document.addEventListener('mousemove', move);
    });

    // mouseup 이벤트가 발생하면 mousemove 이벤트를 제거해 이동을 멈춘다.
    document.addEventListener('mouseup', () => {
      document.removeEventListener('mousemove', move);
    });
  </script>
</body>
</html>
```



이벤트 전파

- 캡쳐링 단계 : 이벤트 상위요소에서 하위요소 방향으로 전파
- 타깃 단계 : 이벤트가 이벤트 타깃에 도달
- 버블링 단계 : 이벤트가 하위요소에서 상위요소 방향으로 전파
- 예시
  1. 이벤트 타깃(이벤트 발생시킨 요소) 클릭 시, 클릭 이벤트 발생하여 이벤트 객체가 생성되고 클릭된 요소 이벤트 타깃이 됨
  2. 클릭 이벤트 객체 window 에서 시작해서 이벤트 타깃 방향으로 전파 (캡쳐링)
  3. 이벤트 객체 이벤트 타깃에 도달 (타깃)
  4. 이벤트 타깃에서 window 방향으로 전파 (버블링)
- addEventListener 메서드 방식으로 등록한 이벤트 핸들러는 3단계 모두 선별적으로 캐치 가능 (3번째 인수로 전달하여 캐치 가능)

- 버블링을 통해 전파되지 않는 이벤트의 경우 대체 이벤트 존재
  - focus/blur &rarr; focusin/focusout
  - mouseenter/mouseleave &rarr; mouseover/mouseout

이벤트 위임 : 여러개의 하위 DOM 요소에 각각 이벤트 헨들러를 등록하는 대신 하나의 상위 DOM 요소에 이벤트 핸들러는 등록하는 방법 (버블링 활용)

DOM 요소의 기본 동작 중단 : preventDefault 메서드

이벤트 전파 방지 : stopPropagation 메서드

이벤트 핸들러 내부의 this

1. 이벤트 핸들러 어트리뷰트 방식 
   - window객체 가르킴
   - 이벤트 핸들러 호출 시, 인수로 전달한 this는 이벤트를 바인딩한 DOM 요소를 가르킴
2. 이벤트 핸들러 프로퍼티 방식 / addEventListener 메서드 방식
   - 이벤트를 바인딩한 DOM 요소 (= 이벤트 객체의 currentTarget 프로퍼티와 동일)



### 41장. 타이머

호출 스케쥴링 : 함수 호출을 예약하기 위해 타이머 함수를 사용하는 것

setTimeout : 함수가 생성한 타이머가 한 번 동작

setInterval : 타이머가 반복 동작

자바스크립트 엔진은 싱글 스레드이기 때문에 타이머 함수는 비동기 처리 방식으로 동작한다.



디바운스/스로틀 : 짧은 시간 간격으로 연속해서 발생하는 이벤트를 그룹화하여 과도한 이벤트 핸들러의 호출을 방지하는 프로그래밍 기법

- 디바운스 : 일정 시간이 경과한 이후에 이벤트 핸들러가 한 번만 호출되도록 함.

  - 사용자의 입력값을 처리하는 경우 입력 필드에 값을 입력할 때마다 이벤트가 연속해서 발생하는데 이때마다 요청을 보내는 것이 아니라 디바운스를 활용하여 일정 시간 동안 값이 입력되지 않을 때 입력이 완료된 것으로 간주하여 요청 보냄.

  ```js
  <!DOCTYPE html>
  <html>
  <body>
    <input type="text">
    <div class="msg"></div>
    <script>
      const $input = document.querySelector('input');
      const $msg = document.querySelector('.msg');
  
      const debounce = (callback, delay) => {
        let timerId;
        // debounce 함수는 timerId를 기억하는 클로저를 반환한다.
        return (...args) => {
          // delay가 경과하기 이전에 이벤트가 발생하면 이전 타이머를 취소하고
          // 새로운 타이머를 재설정한다.
          // 따라서 delay보다 짧은 간격으로 이벤트가 발생하면 callback은 호출되지 않는다.
          if (timerId) clearTimeout(timerId);
          timerId = setTimeout(callback, delay, ...args);
        };
      };
  
      // debounce 함수가 반환하는 클로저가 이벤트 핸들러로 등록된다.
      // 300ms보다 짧은 간격으로 input 이벤트가 발생하면 debounce 함수의 콜백 함수는
      // 호출되지 않다가 300ms 동안 input 이벤트가 더 이상 발생하면 한 번만 호출된다.
      $input.oninput = debounce(e => {
        $msg.textContent = e.target.value;
      }, 300);
    </script>
  </body>
  </html>
  ```

  

- 스로틀 : 일정 시간 간격으로 이벤트 핸들러가 최대 한 번만 호출되로록 함.

  - scroll 이벤트 처리, 무한 스크롤 UI 구현에 유용하게 사용

  ```js
  <!DOCTYPE html>
  <html>
  <head>
    <style>
      .container {
        width: 300px;
        height: 300px;
        background-color: rebeccapurple;
        overflow: scroll;
      }
  
      .content {
        width: 300px;
        height: 1000vh;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="content"></div>
    </div>
    <div>
      일반 이벤트 핸들러가 scroll 이벤트를 처리한 횟수:
      <span class="normal-count">0</span>
    </div>
    <div>
      스로틀 이벤트 핸들러가 scroll 이벤트를 처리한 횟수:
      <span class="throttle-count">0</span>
    </div>
  
    <script>
      const $container = document.querySelector('.container');
      const $normalCount = document.querySelector('.normal-count');
      const $throttleCount = document.querySelector('.throttle-count');
  
      const throttle = (callback, delay) => {
        let timerId;
        // throttle 함수는 timerId를 기억하는 클로저를 반환한다.
        return (...args) => {
          // delay가 경과하기 이전에 이벤트가 발생하면 아무것도 하지 않다가
          // delay가 경과했을 때 이벤트가 발생하면 새로운 타이머를 재설정한다.
          // 따라서 delay 간격으로 callback이 호출된다.
          if (timerId) return;
          timerId = setTimeout(() => {
            callback(...args);
            timerId = null;
          }, delay);
        };
      };
  
      let normalCount = 0;
      $container.addEventListener('scroll', () => {
        $normalCount.textContent = ++normalCount;
      });
  
      let throttleCount = 0;
      // throttle 함수가 반환하는 클로저가 이벤트 핸들러로 등록된다.
      $container.addEventListener('scroll', throttle(() => {
        $throttleCount.textContent = ++throttleCount;
      }, 100));
    </script>
  </body>
  </html>
  ```

  
