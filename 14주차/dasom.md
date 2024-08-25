# Morden JavaScript Deep Dive

Dasom, 2024.08.25

## 48장 모듈

> **모듈의 일반적 의미**
>
> 모듈이란, 어플리케이션을 구성하는 개별적 요소로서 **재사용 가능한** 코드 조각을 말한다.
>
> 일반적으로 **파일 단위로 분리**하며, 모듈은 자신만의 **파일 스코프(모듈 스코프)**를 가지고, 명시적 공개인 **export** 및 공개한 자산의 일부 또는 전체를 불러들이는 **import**가 가능하다.



### 자바스크립트와 모듈

자바스크립트는 script 태그를 사용하여 외부의 자바스크립트 파일을 로드할 수는 있지만, **파일마다 독립적인 파일 스코프를 갖지 않는다.**

즉, **모든 자바스크립트 파일은 하나의 전역을 공유**한다.

이를 해결하기 위해 모듈 시스템으로서 CommonJs와 AMD가 제안되었다.

> Node.js는 CommonJS (100% 동일한 것은 아님) 사양을 따르고 있어, 파일별로 독립적인 파일 스코프를 갖는다.



### ES6 모듈 (ESM)

ES6에서는 클라이언트 사이드 자바스크립트에서도 동작하는 모듈 기능을 추가했다.

* ESM 사용법

  ```js
  // ESM일을 명시하기 위해 파일 확장자는 .mjs를 권장한다.
  <script type="module" src="app.mjs"></script>
  ```

* 일반적 전역 변수

  ```js
  // foo.js
  var x = 'foo';
  
  // bar.js
  var x = 'bar';
  
  // main HTML
  // 전역변수를 공유하기 때문에, foo에서 선언한 전역변수 x가 bar에 의해 덮어 씌워짐
  <!DOCTYPE html>
  <html>
  <body>
    <script src="foo.js"></script>
    <script src="bar.js"></script>
  </body>
  </html>
  ```

* ESM에서의 전역 선언

  ```js
  // foo.mjs
  var x = 'foo';
  console.log(x); //foo
  console.log(window.x); // undefined
  
  // bar.mjs
  var x = 'bar';
  console.log(x); //bar
  console.log(window.x); // undefined
  
  // 각 x는 전역변수가 아니며, window 객체의 프로퍼티도 아니다
  ```

* export

  ```js
  // lib.mjs
  // 변수 공개
  export const name = "Park"
  
  // 함수
  export function suqare(x) {return x * x}
  
  // 클래스
  export class Person {
    constructor(name){
      this.name = name
    }
  }
  
  // 혹은 한 번에
  export { name, square, Person }
  ```

* import

  ```js
  // app.mjs
  // ESM의 경우 확장자 생략가능
  
  // 식별자 이름으로
  import {name, square, Pesron} from './lib.mjs'
  
  // 프로퍼티로 모아서
  import * as lib from './lib.mjs'
  
  // 이름을 변경하여
  import {name as libName} from "./lib.mjs"
  
  ```

* 단일 값의 export

  ```js
  // 하나의 값만 export 한다면 default 키워드 사용 가능 (이름 없이)
  // 이 경우, var, let, const는 사용 불가
  export default x => x * x
  
  // import시 임의의 이름으로 {}없이 import
  import square from './lib.mjs'
  ```

  



## 49장 Babel과 Webpack을 이용한 ES6+/ES.NEXT 개발 환경 구축

> cf. ES.NEXT란?
>
> 현재 정의된 표준(예: ES6, ES7 등) 이후에 등장할 미래의 자바스크립트 기능을 의미

구형 브라우저 등, 다양한 환경에서의 동작을 위해 개발 환경을 구축한다. 이 중 대부분의 프로젝트가 모듈을 사용하기에 모듈 로더가 별도로 필요한데, ESM 대신 별도의 모듈 로더를 사용하는 이유는 다음과 같다.

* IE를 포함한 구형 브라우저는 ESM을 지원하지 않음
* ESM을 사용하더라도 트랜스파일링이나 번들링이 필요한 것은 변함 없음
* ESM이 아직 지원하지 않는 기능이 존재하는 등 몇가지 이슈가 존재



### Babel

>  Babel은 ES6+/ES.NEXT로 구현된 최신 사양의 소스코드를 ES5 사양의 소스코드로 변환할 수 있다.



* Babel 설치

  ```cmd
  # package.json 생성
  $ npm init -y
  # babel-core, babel-cli 설치
  $ npm install --save-dev @babel/core @babel/cli
  ```

  * **`babel-core`**는 Babel의 핵심 라이브러리로, 트랜스파일링 로직을 처리하고 API를 제공하는 역할을 함

  * **`babel-cli`**는 개발자가 명령줄에서 Babel을 사용할 수 있도록 돕는 CLI 도구

    

* Babel 프리셋

  * Babel 프리셋(Preset): Babel에서 제공하는 플러그인의 모음
    * 개별 플러그인들을 하나하나 설정하지 않고도 손쉽게 특정 버전의 자바스크립트로 트랜스파일링할 수 있음
  * Babel이 제공하는 프리셋
    * **`@babel/preset-env`**: 가장 널리 사용되는 Babel 프리셋으로, 지원환경에 맞춰 동적으로 결정해 줌 (프로젝트 지원한경은 .browserslistrc 파일에 설정 가능)
    * **`@babel/preset-flow:`** Flow 타입 주석을 제거하기 위한 Babel 프리셋. Flow를 사용하여 타입 검사를 수행한 후, 실제 배포 및 실행 시에는 타입 주석이 없는 자바스크립트 코드로 변환하여 사용하는 것이 목적. 이를 통해 Flow와 함께 자바스크립트의 동적 특성을 유지하면서도 타입 안정성을 얻을 수 있음.
    * **`@babel/preset-react`**: React 애플리케이션에서 자주 사용되는 JSX 문법과 최신 자바스크립트 기능들을 트랜스파일링하기 위한 프리셋
    * **`@babel/preset-typescript`**: TypeScript 코드를 트랜스파일링하기 위한 프리셋



* 트랜스파일링

  ```js
  // package.json
  {
    "name": "my-project",
    "version": "1.0.0",
    "script": {
      "build": "babel src/js -w -d dist/js"
   # Babel을 사용하여 src/js 디렉토리에 있는 자바스크립트 파일들을 트랜스파일링(변환)하여 dist/js 디렉토리에 출력하라는 의미
    }
    "devDependencies": {
      "@bable/cli": "^7.10.3",
      "@babel/core": "^7.10.3",
      "@babel/preset-env": "^7.10.3"
    }
  }
  ```

  트랜스 파일링 시도 (21년 1월 기준)

  ```js
  // main.js
  
  class Person {
    #private = 10;
    constructor(name) {
      this.name = name;
    }
  
    greet() {
      return `Hello, my name is ${this.name}`;
    }
  }
  ```

  ```cmd
  $ npm run build
  
  SyntaxError: ...
  #private = 10;
  ^
  
  # 21년 1월 기준, pivate 필드 정의 제안에서 에러가 발생. preset-env가 지원하지 않았기 때문에, 해당 부분을 트랜스파일링 하려면 별도의 플러그인 설치가 필요했음
  # 단, 현재 (2024년 8월)기준으로는 해당 기준이 표준으로 채택되었음에 유의.
  ```

  

* Babel 플러그인 

  * `@babel/plugin-proposal-class-properties`: 클래스 필드 문법을 지원. 위 상황의 오류를 해결하기 위해서도 사용되었었음.
  * `@babel/plugin-transform-arrow-functions`:ES6의 화살표 함수를 ES5의 일반 함수 표현식으로 변환
  * `@babel/plugin-transform-async-to-generator`: ES2017의 `async`/`await` 문법을 ES5의 제너레이터(generator)와 `Promise`로 변환



이와 같이 Babel은 자바스크립트의 문법과 기능을 변환하는 데 초점을 맞추고 있어, 웹 애플리케이션을 배포하기 위한 전체적인 빌드 프로세스에는 부족한 점이 있다. 예를 들어, 브라우저는 (21년 1월 기준) require함수를 지원하지 않아 Babel로 트랜스파일링된 결과를 그대로 브라우저에서 실행하면 에러가 발생한다. 



### Webpack

> Webpack은 자바스크립트, CSS, 이미지 등의 리소스들을 하나 또는 여러개의 파일로 번들링하는 모듈 번들러다. Webpack을 사용하면 의존 모듈이 하나의 파일로 번들링되어, 별도의 모듈 로더가 필요 없다.



* Webpack 설치

  ```cmd
  $ npm install --save-dev webpack webpack-cli
  ```

* babel-loader
  * Webpack이 모듈을 번들링할 때 Babel을 사용하여 소스코드를 트랜스파일링하도록 함
* webpack.config.js 설정 파일
  * Webpack이 실행될 때 참조하는 설정 파일로, 프로젝트 루트 폴더에 생성

```js
const path = require('path');

module.exports = {
	// entry file
	// https://webpack.js.org.configuration/entry-context/#entry
	entry: './src/js/main.js',
	// 번들링된 js 파일의 이름(filename)과 저장될 경로(path) 지정
	// https://webpack.kr/configuration/output/#outputpath
	// https://webpack.kr/configuration/output/#outputfilename
	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'js/bundle.js'
	},
	// https://webpack.kr/configuration/module/
	module: {
		rules: [
			{
				test: /\.js$/,
				include: [
					path.resolve(__dirname, 'src/js')
				],
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options:{
						presets: ['@babel/preset-ent'],
						plugins: ['@babel/plugin-proposal-class-properties']
					}
				}
			}
		]
	},
	devtool: 'source-map',
	// https://webpack.kr/configuration/mode
	mode: 'development'
}
```

* Webpack 실행 후
  * dist/js 폴더에 bundle.js 생성.
  * `<script src="./dist/js/bundle.js"></script>` 를 통해 브라우저에서 실행 가능



* babel-polyfill
  * 자바스크립트 환경에서 최신 ECMAScript 기능들을 사용할 수 있도록 해주는 도구였음. 
  * 주로 ES6/ES7 이상의 최신 자바스크립트 기능들을 트랜스파일링하는 것만으로는 해결되지 않는, 새로운 전역 객체나 메서드(예: `Promise`, `Array.prototype.includes` 등)를 구형 브라우저에서 사용할 수 있게 해주는 역할을 수행

> Babel 7 이후로, `babel-polyfill`은 더 이상 사용되지 않으며, 대신 `core-js`와 `@babel/plugin-transform-runtime`을 사용하는 방식으로 대체되었다. 

* **`core-js`**:

  - 개별 폴리필을 필요에 따라 선택적으로 가져올 수 있게 해줌. 이를 통해 필요한 폴리필만 포함시켜 번들 크기를 줄일 수 있음.

  - 예를 들어, `Array.prototype.includes`만 폴리필이 필요할 경우, 해당 폴리필만 로드하도록 설정할 수 있음

* **`@babel/plugin-transform-runtime`**:

  - 이 플러그인은 글로벌 네임스페이스를 오염시키지 않고 폴리필을 적용할 수 있게 도와줌. 이를 통해 전역 공간에 영향을 주지 않으면서, 필요한 기능만을 사용할 수 있음
    - 글로벌 네임스페이스 오염:  JavaScript 환경에서 글로벌 객체(예: `window` 객체, `global` 객체 등)에 새로운 변수를 추가하거나, 기존의 내장 객체(예: `Array`, `Object` 등)에 메서드를 추가하거나 덮어쓰는 것

  - 이 플러그인은 또한 `async`/`await`와 같은 기능을 처리하기 위해 필요한 런타임 헬퍼를 자동으로 추가함



## 느낀점

**이번 챕터에 대하여**

궁극적으로 개발한 것이 정말 어떻게 돌아가는가!에 대한 이야기라 좋았다. 특히나 프론트엔드는 번들러가 무겁기로 유명한데, 왜 이럴 수 밖에 없는지 자바스크립트와 브라우저의 발전 과정을 생각해보며 납득할 수 있게 되기도 했다.

물론, 그럼에도 불구하고 이제 IE가 사라져버린 시점에서, 무지성 npm install 보다 다른 방법을 통해 경량화 할 수도 있을 것 같다. (책에서 다루는대로 순차적으로 바벨과 웹팩을 설치하는 과정을 경험해볼 수 있는 것이 특히나 도움이 될 것 같다.)



**스터디 전체 후기**

거의 3개월에 걸친 대장정이 마침내 막을 내렸다! 우먼잇츠에서 공식적으로 진행한 기간을 넘어섰음에도, 한 명도 빠짐없이 끝까지 완독을 해냈다는 사실에 모두에게 큰 박수를 보내고 싶다.

처음의 열정은 시간이 지나면서 옅어져갔고, 스터디 당일에야 허겁지겁 준비하는 내 모습이 부끄럽기도 했지만...! 그럼에도 불구하고 끝까지 완주한 것에 큰 의미를 두고 싶다. "Done is better than perfect"라는 말처럼.

이렇게 끝까지 해낼 수 있었던 건 스터디원들이 있었기 때문이라고 생각한다. 원동력이 되어주었고, 덕분에 최소한의 준비라도 할 수 있었다. 모자란 나를 직간접적으로 이끌어준 스터디원들 모두에게 감사하다.

스터디를 통해 단순히 책을 읽고 토론하는 것에 그치지 않고, 각자의 업무 경험을 공유하는 시간을 가질 수 있어 특히나 좋았다. 회사에 개발팀 인원이 많지 않아, 다른 사람들의 목소리가 참 간절했는데 같은 직무를 가진 소중한 동료들을 가질 수 있게 되어 기쁘다.

정말 고맙고, 모두 수고하셨다!





