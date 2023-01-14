# [Rammer](https://www.npmjs.com/package/rammer)
A command-line tool that allows you to put an entire folder into a single class file and retrieve the contents of each file using the get method.  
[![CICD](https://github.com/trysd/npm-rammer/actions/workflows/release.yml/badge.svg)](https://github.com/trysd/npm-rammer/actions/workflows/release.yml)

## Usage
to TS
```js
    $ npx rammer --type-ts ./example ./example.ts
```
to JS
```js
  $ npx rammer --type-js ./example ./example.js
```
to txt
```js
  $ npx rammer --type-txt ./example ./example.txt
```

## example
Before
```
example
├── floor
│   └── floor.tpl
└── sample.tpl
```

Execute
```
$ npx rammer@latest --type-ts ./example after-sample.ts
```

Will be able to load
```js
import { AfterSample } from "./after-sample";

// Get the contents of the original file.
// Argument types are limited to file names.
const res = AfterSample.get('floor/floor.tpl');
```

## unrammer
You can also simply restore the files. However, it is limited to text files converted by the "--type-txt" option.

Restoration command sample
```js
  $ npm rammer@latest --decode ./example.txt ./newly
```
