## 48장 모듈

### 48.1 모듈의 일반적 의미

> [!NOTE]
> 모듈은 애플리케이션과 분리되어 개별적으로 존재하다가 필요에 따라 다른 모듈에 의해 재사용된다.
>
> 모듈을 사용하면 코드의 단위를 명확히 분리하여 애플리케이션을 구성할 수 있기 때문에(재사용성) 개발 효율성과 유지 보수성을 높일 수 있다.

#### 모듈(module)

- 애플리케이션을 구성하는 개별적 요소로서 재사용 가능한 코드 조각
- 일반적으로 모듈은 기능을 기준으로 파일 단위로 분리한다.
- 모듈이 성립하려면 모듈은 자신만의 **파일 스코프(모듈 스코프)**를 가질 수 있어야 한다.
- 모듈의 자산은 기본적으로 비공개 상태
- 다시 말해, 자신만의 파일 스코프를 갖는 모듈의 모든 자산은 **캡슐화**되어 다른 모듈에서 접근할 수 없다.
- 즉, 모듈은 개별적 존재로서 애플리케이션과 분리되어 존재한다.

#### export

- 하지만 애플리케이션과 완전히 분리되어 개별적으로 존재하는 모듈은 재사용이 불가능하므로 존재의 의미가 없다.
- 모듈은 재사용되어야 의미가 있다!
- 따라서 모듈은 export 키워드를 통해 공개가 필요한 자산에 한정하여 명시적으로 선택적 공개가 가능하다.

#### import

- 공개된 모듈의 자산은 다른 모듈에서 재사용할 수 있다.
- 모듈 사용자(module consumer): 공개된 모듈의 자산을 사용하는 모듈
- **모듈 사용자는 import 키워드를 통해 모듈이 공개한 자산 중 일부 또는 전체를 선택해 자신의 스코프 내로 불러들여 재사용할 수 있다.**

### 48.2 자바스크립트와 모듈

- 자바스크립트 런타임 환경인 Node.js는 모듈 시스템의 사실상 표준인 CommonJS를 채택하여 기본적으로 CommonJS 사양을 따르고 있다.
- 즉, Node.js는 ECMAScript 표준 사양은 아니지만 모듈 시스템을 지원한다.
- 따라서 Node.js 화녁ㅇ에서는 파일별로 독립적인 파일 스코프(모듈 스코프)를 갖는다.

### 48.3 ES6 모듈(ESM)

- ES6에서는 클라이언트 사이드 자바스크립트에서도 동작하는 모듈 기능을 도입했다.

#### ESM 사용법

- script 태그에 `type="module"` 어트리뷰트를 추가 -> 로드된 자바스크립트 파일은 모듈로서 동작
- 일반적인 자바스크립트 파일이 아닌 ESM임을 명확히 하기 위해 ESM의 파일 확장자는 mjs를 사용할 것을 권장한다.
- ESM에는 기본적으로 strict mode가 적용된다.

```html
<script type="module" src="app.mjs"></script>
```

#### 48.3.1 모듈 스코프

> [!NOTE]
> ESM은 독자적인 모듈 스코프를 갖는다.

```html
<!DOCTYPE html>
<html>
  <body>
    <script type="module" src="foo.mjs"></script>
    <script type="module" src="bar.mjs"></script>
  </body>
</html>
</html>
```

- 모듈 내에서 선언한 식별자는 모듈 외부에서 참조할 수 없다.

```js
// foo.mjs
const x = 'foo'
console.log(x) // foo
```

```js
// bar.mjs
console.log(window.x) // ReferenceError: x is not defined
```

#### 48.3.2 export 키워드

- 모듈 내부에서 선언한 식별자를 **공개**하여 다른 모듈들이 재사용할 수 있게 하려면 export 키워드를 사용한다.

```js
// 변수의 export
export const pi = Math.PI

// 함수의 export
export function square(x) {
  return x * x
}

// 클래스의 export
export class Person {
  constructor(name) {
    this.name = name
  }
}
```

- 선언문 앞에 매번 export 키워드를 붙이는 것이 번거롭다면 expor할 대상을 하나의 객체로 구성하여 한 번에 export할 수도 있다.

```js
// lib.mjs
const pi = Math.PI

function square(x) {
  return x * x
}

class Person {
  constructor(name) {
    this.name = name
  }
}

export { pi, square, Person }
```

#### 48.3.3 import 키워드

- 다른 모듈에서 공개(export)한 식별자를 자신의 모듈 스코프 내부로 로드하려면 import 키워드를 사용한다.
- 다른 모듈이 export한 식별자 이름으로 import해야 하며 ESM의 경우 파일 확장자를 생략할 수 없다.

```js
// app.mjs
import { pi, square, Person } from './lib.mjs'
```

- `app.mjs`는 애플리케이션의 진입점(entry point)이므로 반드시 script 태그로 로드해야 한다.
- 하지만 `lib.mjs`는 `app.mjs`의 import 문에 의해 로드되는 의존성이다. 따라서 `lib.mjs`는 script 태그로 로드하지 않아도 된다.

```html
<!DOCTYPE html>
<html>
  <body>
    <script type="module" src="app.mjs"></script>
  </body>
</html>
```

- 모듈이 export한 식별자 이름을 일일이 지정하지 않고 하나의 이름으로 한 번에 import할 수도 있다.
- 이때 import되는 식별자는 as 뒤에 지정한 이름의 객체에 프로퍼티로 할당된다.

```js
// app.mjs
import * as lib from './lib.mjs'
```

- 모듈이 export한 식별자 이름을 변경하여 import할 수도 있다.

```js
// app.mjs
import { pi as PI, square as sq, Person as P } from './lib.mjs'
```

- 모듈에서 하나의 값만 export한다면 default 키워드를 사용할 수 있다. default 키워드를 사용하는 경우 기본적으로 이름 없이 하나의 값을 export한다.

```js
// lib.mjs
export default x => x * x
```

- default 키워드를 사용하는 경우 var, let, const 키워드는 사용할 수 없다.

```js
// lib.mjs
export default const foo => () => {}
// SyntaxError: Unexpected token 'const'
```

- default 키워드와 함께 export한 모듈은 {} 없이 임의의 이름으로 import한다.

```js
// app.mjs
import square from './lib.mjs'

console.log(square(3)) // 9
```

## 49장 Babel과 Webpack을 이용한 ES6+/ES.NEXT 개발 환경 구축

ES6+와 ES.NEXT의 최신 ECMAScript 사양을 사용하여 프로젝트를 진행하려면 최신 사양으로 작성된 코드를 경우에 따라 IE를 포함한 구형 브라우저에서 문제 없이 동작시키기 위한 개발 환경을 구축하는 것이 필요하다.
또한 대부분의 프로젝트가 모듈을 사용하므로 모듈 로더도 필요하다.

- IE를 포함한 구형 브라우저는 ESM을 지원하지 않는다.
- ESM을 사용하더라도 트랜스파일링이나 번들링이 필요한 것은 변함이 없다.
- ESM이 아직 지원하지 않는 기능(bare import 등)이 있고 점차 해결되고는 있지만 아직 몇 가지 이슈가 존재한다.

### 49.1 Babel

Babel은 ES6+/ES.NEXT로 구현된 최신 사양의 소스코드를 IE같은 구형 브라우저에서도 동작하는 ES5 사양의 소스코드로 변환(트랜스파일링)할 수 있다.

#### 49.1.1 Babel 설치

```shell
$ npm init -y
$ npm install --save-dev @babel/core @babel/cli
```

#### 49.1.2 Babel 프리셋 설치와 babel.config.json 설정 파일 작성

- `@babel/preset-env`
  - 함께 사용되어야 하는 Babel 플러그인을 모아 둔 것. Babel 프리셋
  - 필요한 플러그인들을 프로젝트 지원 환경에 맞춰 동적으로 결정해 준다.
- 공식 Babel 프리셋
  - `@babel/preset-env`
  - `@babel/preset-flow`
  - `@babel/preset-react`
  - `@babel/preset-typescript`
- 프로젝트 지원 환경은 Browserlist 형식으로 `.browserlistrc` 파일에 상세히 설정할 수 있다.
  - 프로젝트 지원 환경 설정 작업 생략 시 기본값으로 설정

```shell
$ npm install --save-dev @babel/preset-env
```

#### Babel 설정 파일 생성

- 설치가 완료되면 프로젝트 루트 폴더에 `babel.config.json` 설정 파일을 생성하고 presets 옵션을 추가한다.

```json
{
  "presets": ["@babel/preset-env"]
}
```

#### 49.1.3 트랜스파일링

- npm scripts에 트랜스파일링을 위한 Babel CLI 추가
- src/js 폴더(타깃 폴더)에 있는 모든 자바스크립트 파일들을 트랜스파일링한 후, 그 결과물을 dist/js 폴더에 저장한다.
  - `-w`(`--watch`): 타깃 폴더에 있는 모든 자바스크립트 파일들의 변경을 감지하여 자동으로 트랜스파일한다.
  - `-d`(`--out-dir`): 트랜스파일링된 결과물이 저장될 폴더를 지정한다. 만약 지정된 폴더가 존재하지 않으면 자동 생성한다.

```json
{
  "scripts": {
    "build": "babel scr/js -w -d dist/js"
  }
}
```

- 트랜스파일링 테스트를 위해 ES6+/ES.NEXT 사양의 자바스크립트 파일 작성

```js
// src/js/lib.js
export const pi = Math.PI

export function power(x, y) {
  return x ** y
}

export class Foo {
  #private = 10

  foo() {
    const { a, b, ...x } = { ...{ a: 1, b: 2 }, c: 3, d: 4 }
    return { a, b, x }
  }

  bar() {
    return this.#private
  }
}
```

```js
// src/js/main.js
import { pi, power, Foo } from './lib'

console.log(pi)
console.log(power(pi, pi))

const f = new Foo()
console.log(f.foo())
console.log(f.bar())
```

- 트랜스파일링 실행
- 트랜스파일링에 성공하면 프로젝트 루트 폴더에 `dist/js` 폴더가 자동으로 생성되고 트랜스파일링된 `main.js`와 `lib.js`가 저장된다.

```shell
$ npm run build
```

- 트랜스파일링된 `main.js` 실행

```shell
node dist/js/main
```

#### 49.1.4 Babel 플러그인 설치

- 설치가 필요한 Babel 플러그인은 [Babel 홈페이지](https://babeljs.io/)에서 검색할 수 있다.
- public/private 클래스 필드를 지원하는 플러그인 설치

```shell
$ npm install --save-dev @babel/plugin-proposal-class-properties
```

- 설치한 플러그인 `babel.config.json` 설정 파일에 추가

```json
{
  "presets": ["@babel/preset-env"],
  "plugins": ["@babel/plugin-proposal-class-properties"]
}
```

#### 49.1.5 브라우저에서 모듈 로딩 테스트

### 49.2 Webpack

#### 49.2.1 Webpack 설치

```shell
$ npm install --save-dev webpack webpack-cli
```

#### 49.2.2 babel-loader 설치

```shell
$ npm install --save-dev babel-loader
```

#### 49.2.3 webpack.config.js 설정 파일 작성

- `webpack.config.js`는 Webpack이 실행될 때 참조하는 설정 파일
- 프로젝트 루트 폴더에 생성

```js

```

- webpack을 실행하여 트랜스파일링 및 번들링 실행

```shell
$ npm run build
```

#### 49.2.4 babel-polyfill 설치
