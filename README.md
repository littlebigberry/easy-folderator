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

##Example

This example uses the same folder structure as above under Usage.  lets say we have a folder called models with the following structure:

```
models/
	user.js
	post.js
```

Let's also say that the exports object of each model is simply this:

```js
module.exports = __filename;
```

Now lets look at what will happen:

```js
var path = require('path');
var folderator = require('easy-folderator');

var packagePath = path.join(__dirname, 'models');

folderator
	.createPackage({
		rootDir: packagePath, // a required option
		captializeModules: true
	})
	.then(function (pack) {
		console.log(pack.User);
		//	logs:
		//		/path/to/file/models/user.js
	});
```

##Options

+	rootDir
++ bleh