#Easy Folderator

An easy way to automatically include and name modules in subdirectories.

##Installation

```
npm install easy-folderator
```

##Usage

Easy Folderator makes use of promises.

Lets say we have the following directory structure:

```
folder/
	inner-folder/
		deeper-inner-folder/
			deeper-inner-test-module.js
		inner-test-module.js
	test-module.js
```

The folderator.createPackage function will return an object with the following structure:

```js
var package = {
	innerFolder: {
		deeperInnerFolder {
			deeperInnerTestModule: /* module.exports of deeper-inner-test-module.js */
		},
		innerTestModule: /* module.exports of inner-test-module.js */
	},
	testModule: /* module.exports of test-module.js */
}
```