# RAMMER
A command-line tool that allows you to put an entire folder into a single class file and retrieve the contents of each file using the get method.

## Usage
to TS
```js
    $ npx rammer --type-ts ./exampleDir ./rammerNewFile.ts
```
to JS
```js
  $ npx rammer --type-js ./DirectoryName ./rammerNewFile.js
```
to txt
```js
  $ npx rammer --type-txt ./DirectoryName ./rammerNewFile.txt
```

## example
before
```
example
├── floor
│   └── floor.tpl
└── sample.tpl
```

execute
```
$ npx rammer@latest --type-ts ./example after-sample.tx
```

will be able to load
```js
import { AfterSample } from "./after-sample";

// Get the contents of the original file.
// Argument types are limited to file names.
const res = XAfter.get('floor/floor.tpl');
```

## unrammer
You can also simply restore the files. However, it is limited to text files converted by the "--type-txt" option.

Restoration command sample
```js
  $ npm rammer@latest --decode ./yourRammedFile.txt ./writeDir
```
