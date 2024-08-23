# 48장 - 모듈

## 48.1 모듈의 일반적 의미

- 모듈
    - 애플리케이션을 구성하는 개별적 요소로서 재사용 가능한 코드 조각
    - 일반적으로 기능을 기준으로 파일 단위로 분리
    → 이때 모듈이 성립하려면 모듈은 자신만의 파일 스코프(모듈 스코프)를 가질 수 있어야함
    - 자신만의 파일 스코프를 가지는 모듈은 기본적으로 비공개 상태
    → 개별적 존재로서 애플리케이션과 분리되어 존재함
    - 모듈은 애플리케이션이나 다른 모듈에 의해 재사용되어야 유의미함
        
        **→ 공개가 필요한 자산에 한정하여 명시적으로 선택적 공개가 가능. 이게 `export`**
        
    - **모듈 사용자는 모듈이 공개한 자산 중 일부 또는 전체를 선택해 자신의 스코프 내로 불려들여 재사용 가능함. 이게 `import`**
        
        cf) 모듈 사용자 → 공개된 모듈의 자산을 사용하는 모듈
        
    - 모듈은 코드의 단위를 명확히 분리하여 애플리케이션을 구성할 수 있고, 재사용성이 좋아서 개발 효율성과 유지보수성을 높일 수 있음

## 48.2 자바스크립트와 모듈

- 대부분의 프로그래밍 언어는 모듈 기능을 가지고 있음
- 하지만 클라이언트 사이드 자바스크립트는 script 태그를 사용하여 외부의 자바스크립트 파일 로드는 가능하지만 파일마다 독립적인 파일 스코프는 갖지 않음
- 모든 자바스크립트 파일은 하나의 전역을 공유함(JS파일을 여러 개의 파일로 분리해서 script 태그로 로드해도 분리된 파일들은 하나의 JS파일 내에 있는 것처럼 동작)
    
    → 전역변수가 중복되는 등의 문제가 발생할 수 있음
    
- JS의 클아이언트 사이드(브라우저 환경)에 국한하지 않고 범용적으로 사용하려는 움직임이 생기면서 제안된 것이 바로 `CommonJS`와 `AMD(Asyncronous Module Definition)`
- JS 런타임 환경인 Node.js는 모듈 시스템의 사실상 표준인 CommonJS를 채택 
→  독자적인 진화를 거쳐 현재는 CommonJS 사양과 100% 동일하진 않지만 기본적으로 CommonJS 사양을 따르고 있음
    
    ⇒ Node.js는 ECMAScript 표준 사양은 아니지만 모듈 시스템을 지원 → Node.js 환경에서는 파일 별로 독립적인 파일 스코프(모듈스코프)를 가짐
    

## 48.3 ES6모듈(ESM)

- ES6에서는 클라이언트 사이드 JS에서도 동작하는 모듈 기능을 추가했음
    
    (IE를 제외한 대부분의 브라우저에서 ES6 모듈 사용가능)
    
- ESM(ES6모듈) 사용법
    
    ```jsx
    <script type="module" src="app.mjs"></script>
    ```
    
    - **script 태그에 type=”module” 어트리뷰트 추**가하면 로드된 JS파일은 모듈로서 동작함
    - 일반적인 JS파일이 아닌 ESM임을 명확히 하기 위해 ESM 확장자는 **mjs** 사용 권장

### 48.3.1 모듈 스코프

- ESM은 독자적인 모듈 스코프를 가짐
- ESM이 아닌 일반 JS 파일은 script 태그로 분리해서 로드해도 독자적인 모듈 스코프를 갖지 않음
- 모듈 내에서 선언한 식별자는 모듈 외부에서 참조할 수 없음 → 모듈 스코프기 다르기 때문
    
    ```jsx
    // foo.mjs
    const x = 'foo';
    console.log(x); // foo
    // bar.mjs
    console.log(x); // ReferenceError: x is not defined
    // 사용
    <!DOCTYPE html>
    <html>
    <body>
    	<script type="module" src="foo.mjs"></script>
    	<script type="module" src="bar.mjs"></script>
    </body>
    </html>
    ```
    

### 48.3.2 export 키워드

- 모듈 내부에서 선언한 모든 식별자는 기본적으로 해당 모듈 내부에서만 참조 가능
- 모듈 내부에서 선언한 식별자를 외부에 공개하여 다른 모듈들이 재사용할 수 있게 하려면 `export` 키워드 사용
- `export` 키워드를 선언문 앞에 사용
- 변수, 함수, 클래스 등 모든 식별자는 `export` 가능
    
    ```jsx
    // lib.mjs
    // 변수 공개
    export const pi = Math.PI;
    // 함수 공개
    export function square(x) {
    	return x * x;
    }
    // 클래스의 공개
    export class Person {
    	constructor(name) {
    		this.name = name;
    	}
    }
    ```
    
- export할 대상을 하나의 객체로 구성 후 한번에 export 가능
    
    ```jsx
    export { pi, square, Person };
    ```
    

### 48.3.3 import 키워드

- 다른 모듈에서 공개한 식별자를 자신의 모듈 스코프 내부로 로드하려면 `import` 키워드 사용
- 다른 모듈이 export한 식별자 이름으로 import해야함
- ESM의 경우 파일 확장자 생략 불가능
- 모듈이 export한 식별자의 이름을 일일이 지정하지 않고, 하나의 이름으로 한 번에 import 가능
    
    import 되는 식별자는 as 뒤에 지정한 이름의 객체에 프로퍼티로 할당됨
    
    ```jsx
    // app.mjs
    // lib.mjs 모듈이 export한 모든 식별자를 lib 객체의 프로퍼티로 모아 import함
    import * as lib from './lib.mjs';
    ```
    
- 모듈이 export한 식별자 이름을 변경하여 import 가능
    
    ```jsx
    // app.mjs
    // lib.mjs 모듈이 export한 식별자 이름을 변경하여 import
    import { pi as PI, square as sq, Person as P } from './lib.mjs'
    ```
    
- 모듈에서 하나의 값만 export 한다면 default 키워드 사용가능
→ default 키워드 사용시 기본적으로 이름 없이 하나의 값을 export
    
    ```jsx
    // lib.mjs
    export default x => x * x;
    ```
    
- default 키워드 사용시 var, let, const 키워드 사용 불가능
    
    ```jsx
    // lib.mjs
    export default const foo = () => {};
    // => SyntaxError: Unexpected token 'const'
    // export default () => {};
    ```
    
- default 키워드와 함께 export한 모듈은 {} 없이 임의의 이름으로 import
    
    ```jsx
    // app.mjs
    import square from './lib.mjs';
    console.log(square(3)); // 9
    
    ```
    

# 49장 - Babel과 Webpack을 이용한 ES6+/ES.NEXT 개발 환경 구축

- ES6+와 ES.NEXT의 최신 ECMAScript 사양을 사용하여 프로젝트를 진행하려면 최신 사양으로 작성된 코드를 경우에 따라 구형 브라우저(e.g. IE)에서 문제 없이 동작시키기 위한 개발 환경을 구축하는 것이 필요함
- 대부분의 프로젝트가 모듈을 사용하므로 모듈 로더도 필요
- ES6모듈(ESM)은 대부분의 모던 브라우저에서 사용가능
→ 하지만 아직까지는 ESM보다는 별도의 모듈 로더를 사용하는 것이 일반적임
- **ESM보다 별도의 모듈 로더를 사용하는 이유**
    - IE를 포함한 구형 브라우저는 ESM 지원 ❌
    - ESM을 사용하더라도 트랜스파일링이나 번들링이 필요한 것은 변함 없음
    - ESM이 아직 지원하지 않는 기능(bare import 등)이 있고 점차 해결되고는 있지만 아직 몇 가지 이슈 존재
- 트랜스파일러인 Babel과 모듈 번들러인 WebPack을 이용하여 ES6+/ES.NEXT 개발환경 구축
+ WebPack을 통해 Babel을 로드하여 ES6+/ES.NEXT 사양의 소스 코드를 IE 같은 구형 브라우저에서도 동작 가능하도록 ES5 사양의 소스코드로 트랜스파일링하는 방법 알아보기
    
    버전 체크
    
    - Node.js : 14.3.0
    - npm : 6.14.5
    - Babel
        - @babel/cli : 7.10.3
        - @babel/core : 7.10.3
    - Babel 프리셋
        - @babel/preset-env : 7.10.3
        - @babel/plugin-proposal-class-properties : 7.10.1
        - @babel/polyfill : 7.10.1
    - Webpack
        - webpack : 4.43.0
        - webpack-cli : 3.3.12
    - Webpack 플러그인
        - babel-loader : 8.1.0

## 49.1 Bable

- IE 와 같은 구형브라우저에서는 ES6의 화살표 함수와 ES7의 지수 연산자를 지원 하지 않을 수 있음
    
    → Babel을 사용하면 ES5 사양으로 변환 가능
    
    ```jsx
    // 변환 전
    [1, 2, 3].map(n => n ** n);
    ```
    
    ```jsx
    // 변환 후
    "user strict";
    [1, 2 ,3].map(function(n) {
    	return Math.pow(n, n);
    });
    ```
    
- 이처럼 Babel은 ES6+/ES.NEXT로 구현된 최신 사양의 소스코드를 구형 브라우저에서도 동작하는 ES5 사양의 소스코드로 변환(트랜스파일링) 가능

### 49.1.1 Babel 설치

```bash
# 프로젝트 폴더 생성
$ mkdir esnext-project && cd esnext-project 
# package.json 생성
$ npm init -y
# babel-core, babel-cli 설치
$ npm install --save-dev @babel/core @babel/cli
```

- 설치 후 package.json 파일
    
    ```jsx
    {
    	"name": "esnext-project",
    	"version": "1.0.0",
    	"devDependencies": {
    		"@babel/cli": "^7.10.3",
    		"@babel/core":"^7.10.3",
    	}
    }
    ```
    

### 49.1.2 Babel 프리셋 설치와 babel.config.json 설정 파일 작성

- Babel을 사용하려면 @babel/preset-env 설치 필요
- @babel/preset-env
    - 함께 사용되어야 하는 Babel 플러그인을 모아둔 것으로 Babel 프리셋이라고 부름
- Babel이 제공하는 공식 Babel 프리셋
    - @babel/preset-env
    - @babel/preset-flow
    - @babel/preset-react
    - @babel/preset-typescript
- @babel/preset-env
    - 필요한 플러그인들을 프로젝트 지원 환경에 맞춰 동적으로 결정
    - 프로젝트 지원 호나경은 Browserslist 형식으로 .browserslistrc 파일에 설정 가능
        
        설정 생략시 기본값으로 세팅됨
        
- 기본 설정은 모든 ES6+ES.NEXT 사양의 소스코드를 변환함
    
    ```jsx
    # @babel/preset-env 설치
    $npm install --save-dev @babel/preset-env
    ```
    
- 설치 후 package.json 파일
    
    ```jsx
    {
    	"name": "esnext-project",
    	"version": "1.0.0",
    	"devDependencies": {
    		"@babel/cli": "^7.10.3",
    		"@babel/core":"^7.10.3",
    		"@babel/preset-env":"^7.10.3",
    	}
    }
    ```
    
- 설치 후 프로젝트 루트 폴더에 babel.config.json 설정 파일 생성 후 아래와 같이 작성
    
    ```jsx
    //  babel.config.json
    // 아래와 같이 작성하면 지금설치한 @babel/preset-env을 사용하겠다는 의미임 
    {
    	"presets": ["@babel/preset-env"]
    }
    ```
    

### 49.1.3 트랜스파일링

- Babel을 사용하여 ES6+/ES.NEXT 사양의 소스코드를 ES5 사양의 소스코드로 트랜스 파일링하기
    
    → Babel CLI 명령어 사용하지 않고 npm scrips에 Babel CLI 명령어를 등록해서 사용
    
- package.json 파일에 scripts를 추가
    
    ```json
    // package.json
    {
    	"name" : "esnext-project",
    	"version" : "1.0.0",
    	"script" : {
    		"build": "babel src/js -w -d dist/js"
    	},
    	"devDependencies" : {
    		"@babel/cli":"^7.10.3",
    		"@babel/core":"^7.10.3",
    		"@babel/preset-env":"^7.10.3",
    	}
    }
    ```
    
    - npm script의 bulid는 src/js 폴더(타겟 폴더)에 있는 모든 JS 파일들을 트랜스파일링 → 결과물을 dist/js 폴더에 저장
    - 옵션
        - -w : 타겟 폴더에 있는 모든 JS 파일들의 변경을 감지. 자동으로 트랜스파일함(—watch 옵션의 축약형)
        - -d: 트랜스파일링된 결과물이 저장될 폴더를 지정. 만약 지정된 폴더가 존재하지 않으면 자동 생성(—out-dir 옵션의 축약형)
- 트랜스파일링 테스트를 위해 ES6+/ES.NEXT 사양의 JS 파일 작성하기
    
    ```jsx
    // src/js/lib.js
    export const pi = Math.PI; // ES6 모듈 사용
    export function power(x,y){
    	return x ** y; // ES7 지수 연산자 사용
    }
    // ES6 클래스 사용
    export class Foo {
    	#private = 10; // stage 3: 클래스 필드 정의 제안 사용(현재 ES2022에 도입)
    	foo() {
    		// stage4 : 객체 Rest/Spread 프로퍼티 제안 사용(현재 ES9에 도입)
    		const {a,b, ...x} = { ...{a:1, b:2}, c:3,d:4};
    		return {a,b,x};
    	}
    	bar() {
    		return this.#private;
    	}
    }
    ```
    
    ```jsx
    // src/js/main.js
    import { pi, power, Foo } from './lib';
    
    console.log(pi);
    console.log(power(pi,pi));
    const f = new Foo();
    console.log(f.foo());
    console.log(f.bar());
    ```
    
    → 정리하자면 트랜스파일링 테스트를 위해 최신 문법을 버무린 js 파일을 작성한 것
        이걸 아까 작성해둔 script의 build명령어를 실행시켜서 트랜스파일링을 실행 

    ![image](https://github.com/user-attachments/assets/3a94d53e-5b11-46df-b339-1353064118d6)

    - 책의 기준일인 2021년 1월에는 TC39 프로세스의 stage3(candidate) 단계에 있는  private 필드 정의 제안에서 에러가 발생함
        
        → @babel/preset-env가 현재 제안 단계에 있는 사양에 대한 플러그인을 지원하지 않기 때문에 발생. 
        **⇒ 현재 제안 단계에 있는 사양을 트랜스파일링하려면 별도의 플러그인을 설치해야함**
        

### 49.1.4 Babel 플러그인 설치

- 설치가 필요한 Babel 플러그인은 Babel 홈페이지에서 검색해서 설치가능
- 책의 기준대로 클래스 필드 정의 제안 플러그인을 설치해보겠음
    
    [@babel/plugin-transform-class-properties · Babel](https://babeljs.io/docs/babel-plugin-transform-class-properties)
    
    ```bash
    $ npm install --save-dev @babel/plugin-proposal-class-properties
    ```
    
- 설치 완료후 package.json 확인
    
    ```json
    // package.json
    {
    	"name" : "esnext-project",
    	"version" : "1.0.0",
    	"script" : {
    		"build": "babel src/js -w -d dist/js"
    	},
    	"devDependencies" : {
    		"@babel/cli":"^7.10.3",
    		"@babel/core":"^7.10.3",
    		"@babel/plugin-proposal-class-properties": "^7./10.1",
    		"@babel/preset-env":"^7.10.3",
    	}
    }
    ```
    
- 이 플러그인은 babel.config.json 설정 파일에 추가 해야함.
    
    ```json
    //  babel.config.json
    {
    	"presets": ["@babel/preset-env"],
    	"plugins": ["@babel/plugin-proposal-class-properties"]
    }
    ```
    
- 그리고 다시 터미널에서 `npm run build` 명령어를 통해 트랜스파일링을 실행시킴
- 트랜스파일링이 성공하면 프로젝트 루트 폴더에 dist/js 폴더가 자동으로 생성되고 트랜스파일링된 main.js와 lib.js가 저장됨!

### 49.1.5 브라우저에서 모듈 로딩 테스트

- 위 예제의 모듈 기능은 Node.js 환경에서 동작한 것이고 **Babel이 모듈을 트랜스파일링한 것도 Node.js가 기본 지원하는 CommonJS 방식의 모듈 로딩 시스템에 따른 것**임
src/js/main.js가 Babel에 의해 트랜스파일링된 결과 보기
    
    ```jsx
    // dist/js.main.js 트랜스파일링된 결과
    "use strict";
    var _lib = require("./lib");
    
    // src/js/main.js
    console.log(_lib.pi);
    console.log((0, _lib.power)(_lib.pi, _lib.pi));
    var f = new _lib.Foo();
    console.log(f.foo());
    console.log(f.bar());
    ```
    
    ```jsx
    // src/js/main.js 트랜스파일링 되기 전 
    import { pi, power, Foo } from './lib';
    
    console.log(pi);
    console.log(power(pi,pi));
    const f = new Foo();
    console.log(f.foo());
    console.log(f.bar());
    ```
    
- 브라우저는 CommonJS 방식의 require 함수를 지원하지 않으므로 위 결과를 그대로 브라우저에서 실행사면 에러가 발생함
    
    ```json
    // 에러 예시
    Uncaught ReferenceError: export is not defined at lib.js:3
    main.js:3 Uncaught ReferenceError: require is not defind at main.js:3
    ```
    
- 브라우저의 ES6모듈(ESM)을 사용하도록 Babel을 설정할 수도 있지만 ESM을 사용하는 것은 문제가있음 ([**ESM보다 별도의 모듈 로더를 사용하는 이유**](https://www.notion.so/ESM-ce49b889b567458b8c14b2612290ec62?pvs=21)) 참고
    
    ⇒ 그러니까 Webpack을 통해 이러한 문제를 해결해보자!!
    

## 49.2 Webpack

- Webpack
    - 의존관계에 있는 자바스크립트, CSS, 이미지 등의 리소스들을 하나(또는 여러개)의 파일로 번들링하는 모듈 번들러
    - Webpack 사용시 의존 모듈이 하나의 파일로 번들링되므로 별도의 모듈 로더가 필요하지않음
    - 여러 개의 JS 파일을 하나로 번들링하므로 HTML 파일에서 script 태그로 여러 개의 JS파일을 로드해야 하는 번거로움도 사라짐
- Webpack이 JS 파일을 번들링 하기 전에 Babel을 로드하여 ES6+/ES.NEXT 사양의 소스코드를 ES 사양의 소스코드로 트랜스파일링하는 작업을 실행하도록 설정해보자

### 49.2.1 Webpack 설치

- webpack부터 설치하기
    
    ```bash
    $ npm install --save-dev webpack webpack-cli
    ```
    
- 설치 후 package.json 파일 확인
    
    ```json
    // package.json
    {
    	"name" : "esnext-project",
    	"version" : "1.0.0",
    	"script" : {
    		"build": "babel src/js -w -d dist/js"
    	},
    	"devDependencies" : {
    		"@babel/cli":"^7.10.3",
    		"@babel/core":"^7.10.3",
    		"@babel/plugin-proposal-class-properties": "^7./10.1",
    		"@babel/preset-env":"^7.10.3",
    		"webpack": "^4.43.0",
    		"webpack-cli": "^3.3.12",
    	}
    }
    ```
    

### 49.2.2 babel-loader 설치

- Webpack이 모듈을 번들링할 때 Babel을 사용하여 ES6+/ES.NEXT 사양의 소스코드를 ES5 사양의 소스코드로 트랜스파일링하도록 babel-loader 설치
    
    ```bash
    $ npm install --save-dev babel-loader
    ```
    
- 설치 후 package.json 파일 확인
    
    ```json
    // package.json
    {
    	"name" : "esnext-project",
    	"version" : "1.0.0",
    	"script" : {
    		"build": "webpack -w"
    	},
    	"devDependencies" : {
    		"@babel/cli":"^7.10.3",
    		"@babel/core":"^7.10.3",
    		"@babel/plugin-proposal-class-properties": "^7./10.1",
    		"@babel/preset-env":"^7.10.3",
    		"babel-loader":"^8.1.0",
    		"webpack": "^4.43.0",
    		"webpack-cli": "^3.3.12",
    	}
    }
    ```
    

### 49.2.3 webpack.config.js 설정 파일 작성

- webpack.config.js 파일
    - Webpack이 실행될 때 참조하는 설정 파일
- 프로젝트 루트 폴더에 생성
    
    ```jsx
    // webpack.config.js
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
    
- 트랜스파일링은 Babel이 수행하고 번들링은 Webpack이 수행함.
- Webpack 실행하기
    
    `npm run build`
  
    ![image](https://github.com/user-attachments/assets/2499ba01-0cc7-4145-ada3-c4814a41f6eb)
- webpack 실행결과, dist/js 폴더에 bundle.js가 생성됨
bundle.js 파일은 main.js, lib.js 모듈이 하나로 번들링된 결과물임
이걸  참조하도록 index.html을 수정
    
    ```jsx
    // index.html
    ...
    <script src="./dist/js/bundle.js"></script>
    ...
    ```
    
    → 이렇게하면 main.js, lib.js 모듈이 하나로 번들링된 bundle.js가 브라우저에서 문제없이 실행된 것을 볼 수 있음
    

### 49.2.4 babel-polyfill 설치

- Babel을 사용해서 최신 버전의 소스코드를 ES5 사양의 소스코드로 트랜스파일링해도 브라우저가 지원하지 않는 코드가 남아있을 수 있음.
e.g. ES6에서 추가된 Promise, Object.assign, Array.from 등은 ES5 사양으로 트랜스파일링해도 ES5 사양에 대체할 기능이 없기 때문에 트랜스파일링이 되지 못하고 그대로 남게됨
- 위 경우를 해결하지 위해 `@babel/polyfill` 설치 필요
    - 설치 방법
        
        ```bash
        $ npm install @babel/polyfill
        ```
        
    - 설치 후 package.json 확인
        
        ```json
        // package.json
        {
        	"name" : "esnext-project",
        	"version" : "1.0.0",
        	"script" : {
        		"build": "webpack -w"
        	},
        	"devDependencies" : {
        		"@babel/cli":"^7.10.3",
        		"@babel/core":"^7.10.3",
        		"@babel/plugin-proposal-class-properties": "^7./10.1",
        		"@babel/preset-env":"^7.10.3",
        		"babel-loader":"^8.1.0",
        		"webpack": "^4.43.0",
        		"webpack-cli": "^3.3.12",
        	},
        	"dependencies": {
        		"@babel/polyfill": "^7.10.1"
        	}
        }
        ```
        
    - **`@babel/polyfill` 은 개발환경에서만 사용하는 것 X 실제 운영환경에서도 사용해야함
    → 개발용 의존성(devDependencies)으로 설치하는 —save-dev 옵션 지정 ❌**
- ES6의 import를 사용하는 경우 진입점의 선두에서 먼저 폴리필 로드 필요
    
    ```jsx
    // src.js.main.js
    import '@babel/polyfill';
    import { pi, power, Foo } from './lib';
    ```
    
- **Webpack을 사용하는 경우 위 방법 대신 webpack.config.js 파일의 entry 배열에 폴리필 추가**
    
    ```jsx
    // webpack.config.js
    const path = require('path');
    module.exports = {
    	// entry file
    	// https://webpack.js.org.configuration/entry-context/#entry
    	entry: ['@babel/polyfill', './src/js/main.js'],
    ...
    ```
    
- 수정 후 npm run build 수행하면 dist/js/bundle.js에 폴리필이 추가된 것을 확인할 수 있음!
