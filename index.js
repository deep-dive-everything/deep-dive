let value = 1;

function asyncTask() {
    setTimeout(() => {
        console.log(value);
    }, 1000);
}

value = 2;  // 메모리 공간을 덮어쓴다면, 비동기 작업은 '2'를 출력하게 됩니다.
asyncTask();
value = 3;  // 또 다시 덮어쓴다면, 비동기 작업은 '3'을 출력하게 됩니다.