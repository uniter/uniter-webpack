/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Demo of bundling a Uniter app with Webpack.
	 *
	 * MIT license.
	 */
	'use strict';

	var uniter = __webpack_require__(1),
	    phpEngine = uniter.createEngine('PHP'),
	    output = document.getElementById('output');

	// Set up a PHP module loader
	phpEngine.configure({
	    include: function (path, promise) {
	        // Wait 500ms before responding with the file, just to demonstrate async support
	        setTimeout(function () {
	            promise.resolve('<?php return "Hello from ' + path + '!";');
	        }, 500);
	    }
	});

	// Print anything written to stdout to the console
	phpEngine.getStdout().on('data', function (data) {
	    output.insertAdjacentHTML('beforeEnd', '<p>' + data + '</p>');
	});

	// Go!
	phpEngine.execute('<?php print "Required: " . require("test.php") . "!";').done(function () {
	    output.insertAdjacentHTML('beforeEnd', '<p>Done - the 500ms delay was intentional, by the way!</p>');
	});


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Uniter - JavaScript PHP interpreter
	 * Copyright 2013 Dan Phillimore (asmblah)
	 * http://asmblah.github.com/uniter/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var phpRuntime = __webpack_require__(2),
	    phpToAST = __webpack_require__(101),
	    phpToJS = __webpack_require__(115),
	    Uniter = __webpack_require__(165);

	module.exports = new Uniter(phpToAST, phpToJS, phpRuntime);


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(3);


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var builtins = __webpack_require__(4),
	    runtime = __webpack_require__(37);

	runtime.install(builtins);

	module.exports = runtime;


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var arrayFunctions = __webpack_require__(5),
	    constantFunctions = __webpack_require__(30),
	    filesystemConstants = __webpack_require__(31),
	    filesystemFunctions = __webpack_require__(32),
	    functionHandlingFunctions = __webpack_require__(33),
	    stringFunctions = __webpack_require__(34),
	    timeFunctions = __webpack_require__(35),
	    variableHandlingFunctions = __webpack_require__(36);

	module.exports = {
	    constantGroups: [
	        filesystemConstants
	    ],
	    functionGroups: [
	        arrayFunctions,
	        constantFunctions,
	        filesystemFunctions,
	        functionHandlingFunctions,
	        stringFunctions,
	        timeFunctions,
	        variableHandlingFunctions
	    ]
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    phpCommon = __webpack_require__(20),
	    IMPLODE = 'implode',
	    PHPError = phpCommon.PHPError;

	module.exports = function (internals) {
	    var callStack = internals.callStack,
	        methods,
	        valueFactory = internals.valueFactory;

	    methods = {
	        'array_push': function (arrayReference) {
	            var arrayValue = arrayReference.getValue(),
	                i,
	                reference,
	                value;

	            for (i = 1; i < arguments.length; i++) {
	                reference = arguments[i];
	                value = reference.getValue();
	                arrayValue.push(value);
	            }

	            return valueFactory.createInteger(arrayValue.getLength());
	        },
	        'current': function (arrayReference) {
	            var arrayValue = arrayReference.getValue();

	            if (arrayValue.getPointer() >= arrayValue.getLength()) {
	                return valueFactory.createBoolean(false);
	            }

	            return arrayValue.getCurrentElement().getValue();
	        },
	        'implode': function (glueReference, piecesReference) {
	            var glueValue = glueReference.getValue(),
	                piecesValue = piecesReference.getValue(),
	                tmp,
	                values;

	            // For backwards-compatibility, PHP supports receiving args in either order
	            if (glueValue.getType() === 'array') {
	                tmp = glueValue;
	                glueValue = piecesValue;
	                piecesValue = tmp;
	            }

	            values = piecesValue.getValues();

	            _.each(values, function (value, key) {
	                values[key] = value.coerceToString().getNative();
	            });

	            return valueFactory.createString(values.join(glueValue.getNative()));
	        },
	        'join': function (glueReference, piecesReference) {
	            return methods[IMPLODE](glueReference, piecesReference);
	        },
	        'next': function (arrayReference) {
	            var arrayValue = arrayReference.getValue();

	            if (arrayValue.getType() !== 'array') {
	                callStack.raiseError(PHPError.E_WARNING, 'next() expects parameter 1 to be array, ' + arrayValue.getType() + ' given');
	                return valueFactory.createNull();
	            }

	            arrayValue.setPointer(arrayValue.getPointer() + 1);

	            if (arrayValue.getPointer() >= arrayValue.getLength()) {
	                return valueFactory.createBoolean(false);
	            }

	            return arrayValue.getCurrentElement().getValue();
	        }
	    };

	    return methods;
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var each = __webpack_require__(7),
	    escapeRegExp = __webpack_require__(10),
	    extend = __webpack_require__(11),
	    filter = __webpack_require__(13),
	    forOwn = __webpack_require__(12),
	    isArray = __webpack_require__(8),
	    isBoolean = __webpack_require__(14),
	    isFunction = __webpack_require__(15),
	    isNumber = __webpack_require__(16),
	    isPlainObject = __webpack_require__(17),
	    isString = __webpack_require__(18),
	    map = __webpack_require__(19);

	module.exports = {
	    each: each,
	    escapeRegExp: escapeRegExp,
	    extend: extend,
	    filter: filter,
	    forOwn: forOwn,
	    isArray: isArray,
	    isBoolean: isBoolean,
	    isFunction: isFunction,
	    isNumber: isNumber,
	    isPlainObject: isPlainObject,
	    isString: isString,
	    map: map
	};


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var hasOwn = {}.hasOwnProperty,
	    isArray = __webpack_require__(8);

	module.exports = function (object, iterator, thisArg) {
	    var key,
	        length;

	    if (!object) {
	        return;
	    }

	    if (isArray(object) || hasOwn.call(object, 'length')) {
	        for (key = 0, length = object.length; key < length; key++) {
	            if (iterator.call(thisArg, object[key], key, object) === false) {
	                break;
	            }
	        }

	        return;
	    }

	    /*jshint forin: false */
	    for (key in object) {
	        if (hasOwn.call(object, key)) {
	            if (iterator.call(thisArg, object[key], key, object) === false) {
	                break;
	            }
	        }
	    }
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var getType = __webpack_require__(9);

	module.exports = function (object) {
	    return getType(object) === 'Array';
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var REGEX = /\[object ([^\]]+)\]/;

	module.exports = function (object) {
	    return {}.toString.call(object).match(REGEX)[1];
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	var REGEX = /[|\\{}()[\]^$+*?.]/g;

	// From https://github.com/sindresorhus/escape-string-regexp/blob/master/index.js
	module.exports = function (string) {
	    if (typeof string !== 'string') {
	        throw new TypeError('Expected a string');
	    }

	    return string.replace(REGEX,  '\\$&');
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var each = __webpack_require__(7),
	    forOwn = __webpack_require__(12);

	module.exports = function (object) {
	    var sources = [].slice.call(arguments, 1);

	    each(sources, function (source) {
	        forOwn(source, function (value, key) {
	            object[key] = value;
	        });
	    });

	    return object;
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var hasOwn = {}.hasOwnProperty;

	module.exports = function (object, iterator, thisArg) {
	    var key;

	    /*jshint forin: false */
	    for (key in object) {
	        if (hasOwn.call(object, key)) {
	            if (iterator.call(thisArg, object[key], key, object) === false) {
	                break;
	            }
	        }
	    }
	};


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var each = __webpack_require__(7);

	module.exports = function (collection, iteratee, thisArg) {
	    var result = [];

	    each(collection, function (value, key) {
	        if (iteratee.call(thisArg, value, key, collection)) {
	            result.push(value);
	        }
	    });

	    return result;
	};


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var getType = __webpack_require__(9);

	module.exports = function (object) {
	    return getType(object) === 'Boolean';
	};


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var getType = __webpack_require__(9);

	module.exports = function (object) {
	    return getType(object) === 'Function';
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var getType = __webpack_require__(9);

	module.exports = function (object) {
	    return getType(object) === 'Number';
	};


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var getType = __webpack_require__(9);

	module.exports = function (object) {
	    return getType(object) === 'Object';
	};


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var getType = __webpack_require__(9);

	module.exports = function (object) {
	    return getType(object) === 'String';
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Microdash - Tiny utilities for Node and the browser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/microdash
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/microdash/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var each = __webpack_require__(7);

	module.exports = function (collection, iteratee, thisArg) {
	    var result = [];

	    each(collection, function (value, key) {
	        result[key] = iteratee.call(thisArg, value, key, collection);
	    });

	    return result;
	};


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCommon - Common tools for PHP environments
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcommon/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcommon/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var Exception = __webpack_require__(21),
	    PHPError = __webpack_require__(26),
	    PHPFatalError = __webpack_require__(27),
	    PHPParseError = __webpack_require__(29);

	module.exports = {
	    Exception: Exception,
	    PHPError: PHPError,
	    PHPFatalError: PHPFatalError,
	    PHPParseError: PHPParseError
	};


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCommon - Common tools for PHP environments
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcommon/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcommon/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    util = __webpack_require__(22);

	function Exception(message) {
	    this.message = message;
	}

	util.inherits(Exception, Error);

	_.extend(Exception.prototype, {
	    'type': 'Exception'
	});

	module.exports = Exception;


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	var formatRegExp = /%[sdj%]/g;
	exports.format = function(f) {
	  if (!isString(f)) {
	    var objects = [];
	    for (var i = 0; i < arguments.length; i++) {
	      objects.push(inspect(arguments[i]));
	    }
	    return objects.join(' ');
	  }

	  var i = 1;
	  var args = arguments;
	  var len = args.length;
	  var str = String(f).replace(formatRegExp, function(x) {
	    if (x === '%%') return '%';
	    if (i >= len) return x;
	    switch (x) {
	      case '%s': return String(args[i++]);
	      case '%d': return Number(args[i++]);
	      case '%j':
	        try {
	          return JSON.stringify(args[i++]);
	        } catch (_) {
	          return '[Circular]';
	        }
	      default:
	        return x;
	    }
	  });
	  for (var x = args[i]; i < len; x = args[++i]) {
	    if (isNull(x) || !isObject(x)) {
	      str += ' ' + x;
	    } else {
	      str += ' ' + inspect(x);
	    }
	  }
	  return str;
	};


	// Mark that a method should not be used.
	// Returns a modified function which warns once by default.
	// If --no-deprecation is set, then it is a no-op.
	exports.deprecate = function(fn, msg) {
	  // Allow for deprecating things in the process of starting up.
	  if (isUndefined(global.process)) {
	    return function() {
	      return exports.deprecate(fn, msg).apply(this, arguments);
	    };
	  }

	  if (process.noDeprecation === true) {
	    return fn;
	  }

	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (process.throwDeprecation) {
	        throw new Error(msg);
	      } else if (process.traceDeprecation) {
	        console.trace(msg);
	      } else {
	        console.error(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }

	  return deprecated;
	};


	var debugs = {};
	var debugEnviron;
	exports.debuglog = function(set) {
	  if (isUndefined(debugEnviron))
	    debugEnviron = process.env.NODE_DEBUG || '';
	  set = set.toUpperCase();
	  if (!debugs[set]) {
	    if (new RegExp('\\b' + set + '\\b', 'i').test(debugEnviron)) {
	      var pid = process.pid;
	      debugs[set] = function() {
	        var msg = exports.format.apply(exports, arguments);
	        console.error('%s %d: %s', set, pid, msg);
	      };
	    } else {
	      debugs[set] = function() {};
	    }
	  }
	  return debugs[set];
	};


	/**
	 * Echos the value of a value. Trys to print the value out
	 * in the best way possible given the different types.
	 *
	 * @param {Object} obj The object to print out.
	 * @param {Object} opts Optional options object that alters the output.
	 */
	/* legacy: obj, showHidden, depth, colors*/
	function inspect(obj, opts) {
	  // default options
	  var ctx = {
	    seen: [],
	    stylize: stylizeNoColor
	  };
	  // legacy...
	  if (arguments.length >= 3) ctx.depth = arguments[2];
	  if (arguments.length >= 4) ctx.colors = arguments[3];
	  if (isBoolean(opts)) {
	    // legacy...
	    ctx.showHidden = opts;
	  } else if (opts) {
	    // got an "options" object
	    exports._extend(ctx, opts);
	  }
	  // set default options
	  if (isUndefined(ctx.showHidden)) ctx.showHidden = false;
	  if (isUndefined(ctx.depth)) ctx.depth = 2;
	  if (isUndefined(ctx.colors)) ctx.colors = false;
	  if (isUndefined(ctx.customInspect)) ctx.customInspect = true;
	  if (ctx.colors) ctx.stylize = stylizeWithColor;
	  return formatValue(ctx, obj, ctx.depth);
	}
	exports.inspect = inspect;


	// http://en.wikipedia.org/wiki/ANSI_escape_code#graphics
	inspect.colors = {
	  'bold' : [1, 22],
	  'italic' : [3, 23],
	  'underline' : [4, 24],
	  'inverse' : [7, 27],
	  'white' : [37, 39],
	  'grey' : [90, 39],
	  'black' : [30, 39],
	  'blue' : [34, 39],
	  'cyan' : [36, 39],
	  'green' : [32, 39],
	  'magenta' : [35, 39],
	  'red' : [31, 39],
	  'yellow' : [33, 39]
	};

	// Don't use 'blue' not visible on cmd.exe
	inspect.styles = {
	  'special': 'cyan',
	  'number': 'yellow',
	  'boolean': 'yellow',
	  'undefined': 'grey',
	  'null': 'bold',
	  'string': 'green',
	  'date': 'magenta',
	  // "name": intentionally not styling
	  'regexp': 'red'
	};


	function stylizeWithColor(str, styleType) {
	  var style = inspect.styles[styleType];

	  if (style) {
	    return '\u001b[' + inspect.colors[style][0] + 'm' + str +
	           '\u001b[' + inspect.colors[style][1] + 'm';
	  } else {
	    return str;
	  }
	}


	function stylizeNoColor(str, styleType) {
	  return str;
	}


	function arrayToHash(array) {
	  var hash = {};

	  array.forEach(function(val, idx) {
	    hash[val] = true;
	  });

	  return hash;
	}


	function formatValue(ctx, value, recurseTimes) {
	  // Provide a hook for user-specified inspect functions.
	  // Check that value is an object with an inspect function on it
	  if (ctx.customInspect &&
	      value &&
	      isFunction(value.inspect) &&
	      // Filter out the util module, it's inspect function is special
	      value.inspect !== exports.inspect &&
	      // Also filter out any prototype objects using the circular check.
	      !(value.constructor && value.constructor.prototype === value)) {
	    var ret = value.inspect(recurseTimes, ctx);
	    if (!isString(ret)) {
	      ret = formatValue(ctx, ret, recurseTimes);
	    }
	    return ret;
	  }

	  // Primitive types cannot have properties
	  var primitive = formatPrimitive(ctx, value);
	  if (primitive) {
	    return primitive;
	  }

	  // Look up the keys of the object.
	  var keys = Object.keys(value);
	  var visibleKeys = arrayToHash(keys);

	  if (ctx.showHidden) {
	    keys = Object.getOwnPropertyNames(value);
	  }

	  // IE doesn't make error fields non-enumerable
	  // http://msdn.microsoft.com/en-us/library/ie/dww52sbt(v=vs.94).aspx
	  if (isError(value)
	      && (keys.indexOf('message') >= 0 || keys.indexOf('description') >= 0)) {
	    return formatError(value);
	  }

	  // Some type of object without properties can be shortcutted.
	  if (keys.length === 0) {
	    if (isFunction(value)) {
	      var name = value.name ? ': ' + value.name : '';
	      return ctx.stylize('[Function' + name + ']', 'special');
	    }
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    }
	    if (isDate(value)) {
	      return ctx.stylize(Date.prototype.toString.call(value), 'date');
	    }
	    if (isError(value)) {
	      return formatError(value);
	    }
	  }

	  var base = '', array = false, braces = ['{', '}'];

	  // Make Array say that they are Array
	  if (isArray(value)) {
	    array = true;
	    braces = ['[', ']'];
	  }

	  // Make functions say that they are functions
	  if (isFunction(value)) {
	    var n = value.name ? ': ' + value.name : '';
	    base = ' [Function' + n + ']';
	  }

	  // Make RegExps say that they are RegExps
	  if (isRegExp(value)) {
	    base = ' ' + RegExp.prototype.toString.call(value);
	  }

	  // Make dates with properties first say the date
	  if (isDate(value)) {
	    base = ' ' + Date.prototype.toUTCString.call(value);
	  }

	  // Make error with message first say the error
	  if (isError(value)) {
	    base = ' ' + formatError(value);
	  }

	  if (keys.length === 0 && (!array || value.length == 0)) {
	    return braces[0] + base + braces[1];
	  }

	  if (recurseTimes < 0) {
	    if (isRegExp(value)) {
	      return ctx.stylize(RegExp.prototype.toString.call(value), 'regexp');
	    } else {
	      return ctx.stylize('[Object]', 'special');
	    }
	  }

	  ctx.seen.push(value);

	  var output;
	  if (array) {
	    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys);
	  } else {
	    output = keys.map(function(key) {
	      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
	    });
	  }

	  ctx.seen.pop();

	  return reduceToSingleString(output, base, braces);
	}


	function formatPrimitive(ctx, value) {
	  if (isUndefined(value))
	    return ctx.stylize('undefined', 'undefined');
	  if (isString(value)) {
	    var simple = '\'' + JSON.stringify(value).replace(/^"|"$/g, '')
	                                             .replace(/'/g, "\\'")
	                                             .replace(/\\"/g, '"') + '\'';
	    return ctx.stylize(simple, 'string');
	  }
	  if (isNumber(value))
	    return ctx.stylize('' + value, 'number');
	  if (isBoolean(value))
	    return ctx.stylize('' + value, 'boolean');
	  // For some reason typeof null is "object", so special case here.
	  if (isNull(value))
	    return ctx.stylize('null', 'null');
	}


	function formatError(value) {
	  return '[' + Error.prototype.toString.call(value) + ']';
	}


	function formatArray(ctx, value, recurseTimes, visibleKeys, keys) {
	  var output = [];
	  for (var i = 0, l = value.length; i < l; ++i) {
	    if (hasOwnProperty(value, String(i))) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          String(i), true));
	    } else {
	      output.push('');
	    }
	  }
	  keys.forEach(function(key) {
	    if (!key.match(/^\d+$/)) {
	      output.push(formatProperty(ctx, value, recurseTimes, visibleKeys,
	          key, true));
	    }
	  });
	  return output;
	}


	function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
	  var name, str, desc;
	  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
	  if (desc.get) {
	    if (desc.set) {
	      str = ctx.stylize('[Getter/Setter]', 'special');
	    } else {
	      str = ctx.stylize('[Getter]', 'special');
	    }
	  } else {
	    if (desc.set) {
	      str = ctx.stylize('[Setter]', 'special');
	    }
	  }
	  if (!hasOwnProperty(visibleKeys, key)) {
	    name = '[' + key + ']';
	  }
	  if (!str) {
	    if (ctx.seen.indexOf(desc.value) < 0) {
	      if (isNull(recurseTimes)) {
	        str = formatValue(ctx, desc.value, null);
	      } else {
	        str = formatValue(ctx, desc.value, recurseTimes - 1);
	      }
	      if (str.indexOf('\n') > -1) {
	        if (array) {
	          str = str.split('\n').map(function(line) {
	            return '  ' + line;
	          }).join('\n').substr(2);
	        } else {
	          str = '\n' + str.split('\n').map(function(line) {
	            return '   ' + line;
	          }).join('\n');
	        }
	      }
	    } else {
	      str = ctx.stylize('[Circular]', 'special');
	    }
	  }
	  if (isUndefined(name)) {
	    if (array && key.match(/^\d+$/)) {
	      return str;
	    }
	    name = JSON.stringify('' + key);
	    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
	      name = name.substr(1, name.length - 2);
	      name = ctx.stylize(name, 'name');
	    } else {
	      name = name.replace(/'/g, "\\'")
	                 .replace(/\\"/g, '"')
	                 .replace(/(^"|"$)/g, "'");
	      name = ctx.stylize(name, 'string');
	    }
	  }

	  return name + ': ' + str;
	}


	function reduceToSingleString(output, base, braces) {
	  var numLinesEst = 0;
	  var length = output.reduce(function(prev, cur) {
	    numLinesEst++;
	    if (cur.indexOf('\n') >= 0) numLinesEst++;
	    return prev + cur.replace(/\u001b\[\d\d?m/g, '').length + 1;
	  }, 0);

	  if (length > 60) {
	    return braces[0] +
	           (base === '' ? '' : base + '\n ') +
	           ' ' +
	           output.join(',\n  ') +
	           ' ' +
	           braces[1];
	  }

	  return braces[0] + base + ' ' + output.join(', ') + ' ' + braces[1];
	}


	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	function isArray(ar) {
	  return Array.isArray(ar);
	}
	exports.isArray = isArray;

	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;

	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;

	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;

	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;

	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;

	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;

	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;

	function isRegExp(re) {
	  return isObject(re) && objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;

	function isDate(d) {
	  return isObject(d) && objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;

	function isError(e) {
	  return isObject(e) &&
	      (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;

	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;

	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;

	exports.isBuffer = __webpack_require__(24);

	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}


	function pad(n) {
	  return n < 10 ? '0' + n.toString(10) : n.toString(10);
	}


	var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep',
	              'Oct', 'Nov', 'Dec'];

	// 26 Feb 16:19:34
	function timestamp() {
	  var d = new Date();
	  var time = [pad(d.getHours()),
	              pad(d.getMinutes()),
	              pad(d.getSeconds())].join(':');
	  return [d.getDate(), months[d.getMonth()], time].join(' ');
	}


	// log is just a thin wrapper to console.log that prepends a timestamp
	exports.log = function() {
	  console.log('%s - %s', timestamp(), exports.format.apply(exports, arguments));
	};


	/**
	 * Inherit the prototype methods from one constructor into another.
	 *
	 * The Function.prototype.inherits from lang.js rewritten as a standalone
	 * function (not on Function.prototype). NOTE: If this file is to be loaded
	 * during bootstrapping this function needs to be rewritten using some native
	 * functions as prototype setup using normal JavaScript does not work as
	 * expected during bootstrapping (see mirror.js in r114903).
	 *
	 * @param {function} ctor Constructor function which needs to inherit the
	 *     prototype.
	 * @param {function} superCtor Constructor function to inherit prototype from.
	 */
	exports.inherits = __webpack_require__(25);

	exports._extend = function(origin, add) {
	  // Don't do anything if add isn't an object
	  if (!add || !isObject(add)) return origin;

	  var keys = Object.keys(add);
	  var i = keys.length;
	  while (i--) {
	    origin[keys[i]] = add[keys[i]];
	  }
	  return origin;
	};

	function hasOwnProperty(obj, prop) {
	  return Object.prototype.hasOwnProperty.call(obj, prop);
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(23)))

/***/ },
/* 23 */
/***/ function(module, exports) {

	// shim for using process in browser

	var process = module.exports = {};
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = setTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    clearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        setTimeout(drainQueue, 0);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ },
/* 24 */
/***/ function(module, exports) {

	module.exports = function isBuffer(arg) {
	  return arg && typeof arg === 'object'
	    && typeof arg.copy === 'function'
	    && typeof arg.fill === 'function'
	    && typeof arg.readUInt8 === 'function';
	}

/***/ },
/* 25 */
/***/ function(module, exports) {

	if (typeof Object.create === 'function') {
	  // implementation from standard node.js 'util' module
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    ctor.prototype = Object.create(superCtor.prototype, {
	      constructor: {
	        value: ctor,
	        enumerable: false,
	        writable: true,
	        configurable: true
	      }
	    });
	  };
	} else {
	  // old school shim for old browsers
	  module.exports = function inherits(ctor, superCtor) {
	    ctor.super_ = superCtor
	    var TempCtor = function () {}
	    TempCtor.prototype = superCtor.prototype
	    ctor.prototype = new TempCtor()
	    ctor.prototype.constructor = ctor
	  }
	}


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCommon - Common tools for PHP environments
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcommon/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcommon/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    util = __webpack_require__(22),
	    Exception = __webpack_require__(21);

	function PHPError(level, message) {
	    Exception.call(this, 'PHP ' + level + ': ' + message);
	}

	util.inherits(PHPError, Exception);

	_.extend(PHPError, {
	    E_ERROR: 'Error',
	    E_FATAL: 'Fatal error',
	    E_NOTICE: 'Notice',
	    E_PARSE: 'Parse error',
	    E_STRICT: 'Strict standards',
	    E_WARNING: 'Warning'
	});

	module.exports = PHPError;


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCommon - Common tools for PHP environments
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcommon/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcommon/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var MESSAGE_PREFIXES = {
	        1: 'Unsupported operand types',
	        2: 'Call to undefined function ${name}()',
	        3: 'Class \'${name}\' not found',
	        4: 'Call to undefined method ${className}::${methodName}()',
	        5: '\'goto\' into loop or switch statement is disallowed',
	        6: '${name}() must take exactly 1 argument',
	        7: 'Class name must be a valid object or a string',
	        8: 'Access to undeclared static property: ${className}::$${propertyName}',
	        9: 'Call to undefined method ${className}::${methodName}()',
	        10: 'Cannot access self:: when no class scope is active',
	        11: 'Undefined constant \'${name}\'',
	        12: 'Uncaught exception \'${name}\'',
	        13: 'Cannot access ${visibility} property ${className}::$${propertyName}',
	        14: 'Function name must be a string',
	        15: 'Undefined class constant \'${name}\'',
	        16: 'Interfaces may not include member variables',
	        17: 'Interface function ${className}::${methodName}() cannot contain body',
	        18: 'Cannot use ${source} as ${alias} because the name is already in use',
	        19: 'Call to a member function ${name}() on a non-object'
	    },
	    _ = __webpack_require__(6),
	    templateString = __webpack_require__(28),
	    util = __webpack_require__(22),
	    PHPError = __webpack_require__(26);

	function PHPFatalError(code, variables) {
	    PHPError.call(this, PHPError.E_FATAL, templateString(MESSAGE_PREFIXES[code], variables));
	}

	util.inherits(PHPFatalError, PHPError);

	_.extend(PHPFatalError, {
	    UNSUPPORTED_OPERAND_TYPES: 1,
	    CALL_TO_UNDEFINED_FUNCTION: 2,
	    CLASS_NOT_FOUND: 3,
	    UNDEFINED_METHOD: 4,
	    GOTO_DISALLOWED: 5,
	    EXPECT_EXACTLY_1_ARG: 6,
	    CLASS_NAME_NOT_VALID: 7,
	    UNDECLARED_STATIC_PROPERTY: 8,
	    CALL_TO_UNDEFINED_METHOD: 9,
	    SELF_WHEN_NO_ACTIVE_CLASS: 10,
	    UNDEFINED_CONSTANT: 11,
	    UNCAUGHT_EXCEPTION: 12,
	    CANNOT_ACCESS_PROPERTY: 13,
	    FUNCTION_NAME_MUST_BE_STRING: 14,
	    UNDEFINED_CLASS_CONSTANT: 15,
	    INTERFACE_PROPERTY_NOT_ALLOWED: 16,
	    INTERFACE_METHOD_BODY_NOT_ALLOWED: 17,
	    NAME_ALREADY_IN_USE: 18,
	    NON_OBJECT_METHOD_CALL: 19
	});

	module.exports = PHPFatalError;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * TemplateString - Simple template strings
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/template-string/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/template-string/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function templateString(string, variables) {
	    _.forOwn(variables, function (value, name) {
	        var pattern = new RegExp(('${' + name + '}').replace(/[^a-z0-9]/g, '\\$&'), 'g');

	        string = string.replace(pattern, value);
	    });

	    return string;
	}

	module.exports = templateString;


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCommon - Common tools for PHP environments
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcommon/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcommon/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    templateString = __webpack_require__(28),
	    util = __webpack_require__(22),
	    PHPError = __webpack_require__(26),
	    MESSAGE_PREFIXES = {
	        1: 'syntax error, unexpected ${what} in ${file} on line ${line}'
	    };

	function PHPParseError(code, variables) {
	    PHPError.call(this, PHPError.E_PARSE, templateString(MESSAGE_PREFIXES[code], variables));
	}

	util.inherits(PHPParseError, PHPError);

	_.extend(PHPParseError, {
	    SYNTAX_UNEXPECTED: 1
	});

	module.exports = PHPParseError;


/***/ },
/* 30 */
/***/ function(module, exports) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = function (internals) {
	    var globalNamespace = internals.globalNamespace;

	    return {
	        'define': function (name, value, isCaseInsensitive) {
	            var match,
	                namespace,
	                path;

	            name = name.toValue().getNative();
	            isCaseInsensitive = isCaseInsensitive ? isCaseInsensitive.toValue().getNative() : false;
	            value = value.toValue();

	            name = name.replace(/^\//, '');
	            match = name.match(/^(.*?)\\([^\\]+)$/);

	            if (match) {
	                path = match[1];
	                name = match[2];
	                namespace = globalNamespace.getDescendant(path);
	            } else {
	                namespace = globalNamespace;
	            }

	            namespace.defineConstant(name, value, {
	                caseInsensitive: isCaseInsensitive
	            });
	        }
	    };
	};


/***/ },
/* 31 */
/***/ function(module, exports) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = function () {
	    return {
	        'DIRECTORY_SEPARATOR': '/'
	    };
	};


/***/ },
/* 32 */
/***/ function(module, exports) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var INCLUDE_PATH_INI = 'include_path';

	module.exports = function (internals) {
	    var iniState = internals.iniState,
	        valueFactory = internals.valueFactory;

	    return {
	        'dirname': function (pathReference) {
	            var pathValue = pathReference.getValue(),
	                path = pathValue.getNative();

	            if (path && path.indexOf('/') === -1) {
	                path = '.';
	            } else {
	                path = path.replace(/\/[^\/]+$/, '');
	            }

	            pathValue = valueFactory.createString(path);

	            return pathValue;
	        },
	        'get_include_path': function () {
	            return valueFactory.createString(iniState.get(INCLUDE_PATH_INI));
	        },
	        'set_include_path': function (newIncludePathReference) {
	            var oldIncludePath = iniState.get(INCLUDE_PATH_INI);

	            iniState.set(INCLUDE_PATH_INI, newIncludePathReference.getValue().getNative());

	            return valueFactory.createString(oldIncludePath);
	        }
	    };
	};


/***/ },
/* 33 */
/***/ function(module, exports) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = function (internals) {
	    var globalNamespace = internals.globalNamespace,
	        valueFactory = internals.valueFactory;

	    return {
	        'function_exists': function (nameReference) {
	            var name = nameReference.getValue().getNative().replace(/^\\/, '');

	            try {
	                globalNamespace.getFunction(name);
	            } catch (e) {
	                return valueFactory.createBoolean(false);
	            }

	            return valueFactory.createBoolean(true);
	        }
	    };
	};


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    phpCommon = __webpack_require__(20),
	    PHPError = phpCommon.PHPError;

	module.exports = function (internals) {
	    var callStack = internals.callStack,
	        valueFactory = internals.valueFactory;

	    return {
	        'strlen': function (stringReference) {
	            var stringValue = stringReference.getValue();

	            if (stringValue.getType() === 'array' || stringValue.getType() === 'object') {
	                callStack.raiseError(PHPError.E_WARNING, 'strlen() expects parameter 1 to be string, ' + stringValue.getType() + ' given');
	                return valueFactory.createNull();
	            }

	            return valueFactory.createInteger(stringValue.getLength());
	        },

	        'str_replace': function (
	            searchReference,
	            replaceReference,
	            subjectReference,
	            countReference
	        ) {
	            function getNative(reference) {
	                var value = reference.getValue();

	                return value.getNative();
	            }

	            var count = 0,
	                search,
	                replacement,
	                subject,
	                replace = countReference ?
	                    function replace(search, replacement, subject) {
	                        return subject.replace(search, function () {
	                            count++;

	                            return replacement;
	                        });
	                    } :
	                    function replace(search, replacement, subject) {
	                        return subject.replace(search, replacement);
	                    };

	            if (arguments.length < 3) {
	                callStack.raiseError(
	                    PHPError.E_WARNING,
	                    'str_replace() expects at least 3 parameters, ' + arguments.length + ' given'
	                );

	                return valueFactory.createNull();
	            }

	            search = getNative(searchReference);
	            replacement = getNative(replaceReference);
	            subject = getNative(subjectReference);

	            // Use a regex to search for substrings, for speed
	            function buildRegex(search) {
	                return new RegExp(
	                    _.escapeRegExp(search),
	                    'g'
	                );
	            }

	            if (_.isArray(search)) {
	                if (_.isArray(replacement)) {
	                    // Search and replacement are both arrays
	                    _.each(search, function (search, index) {
	                        subject = replace(
	                            buildRegex(search),
	                            index < replacement.length ? replacement[index] : '',
	                            subject
	                        );
	                    });
	                } else {
	                    // Only search is an array, replacement is just a string
	                    _.each(search, function (search) {
	                        subject = replace(
	                            buildRegex(search),
	                            replacement,
	                            subject
	                        );
	                    });
	                }
	            } else {
	                // Simple case: search and replacement are both strings
	                subject = replace(
	                    buildRegex(search),
	                    replacement,
	                    subject
	                );
	            }

	            if (countReference) {
	                countReference.setValue(valueFactory.createInteger(count));
	            }

	            return valueFactory.createString(subject);
	        },

	        'strpos': function (haystackReference, needleReference, offsetReference) {
	            var haystack = haystackReference.getNative(),
	                needle = needleReference.getNative(),
	                offset = offsetReference ? offsetReference.getNative() : 0,
	                position;

	            // Negative offsets indicate no. of chars at end of haystack to scan
	            if (offset < 0) {
	                offset = haystack.length + offset;
	            }

	            position = haystack.substr(offset).indexOf(needle);

	            if (position === -1) {
	                return valueFactory.createBoolean(false);
	            }

	            return valueFactory.createInteger(offset + position);
	        },

	        'strrpos': function (haystackReference, needleReference, offsetReference) {
	            var haystack = haystackReference.getValue().getNative(),
	                needle = needleReference.getValue().getNative(),
	                offset = offsetReference ? offsetReference.getValue().getNative() : 0,
	                position;

	            // Negative offsets indicate no. of chars at end of haystack to scan
	            if (offset < 0) {
	                offset = haystack.length + offset;
	            }

	            position = haystack.substr(offset).lastIndexOf(needle);

	            if (position === -1) {
	                return valueFactory.createBoolean(false);
	            }

	            return valueFactory.createInteger(offset + position);
	        },

	        'strtr': function (stringReference) {
	            var from,
	                to,
	                i,
	                replacePairs,
	                replaceKeys,
	                replaceValues,
	                string = stringReference.getValue().getNative();

	            if (arguments.length === 2) {
	                // 2-operand form: second argument is an associative array
	                // mapping substrings to search for to their replacements
	                replacePairs = arguments[1].getValue();
	                replaceKeys = replacePairs.getKeys();
	                replaceValues = replacePairs.getValues();

	                _.each(replaceKeys, function (key, index) {
	                    var find = key.coerceToString().getNative(),
	                        replace = replaceValues[index].coerceToString().getNative();

	                    string = string.replace(
	                        new RegExp(_.escapeRegExp(find), 'g'),
	                        replace
	                    );
	                });
	            } else {
	                // 3-operand form: replace all characters in $from
	                // with their counterparts at that index in $to
	                from = arguments[1].getValue().getNative();
	                to = arguments[2].getValue().getNative();

	                for (i = 0; i < from.length && i < to.length; i++) {
	                    string = string.replace(
	                        new RegExp(_.escapeRegExp(from.charAt(i)), 'g'),
	                        to.charAt(i)
	                    );
	                }
	            }

	            return valueFactory.createString(string);
	        },

	        'substr': function (stringReference, startReference, lengthReference) {
	            var string = stringReference.getValue().getNative(),
	                start = startReference.getValue().getNative(),
	                length = lengthReference ? lengthReference.getValue().getNative() : string.length,
	                substring;

	            if (start < 0) {
	                start = string.length + start;
	            }

	            if (length < 0) {
	                length = string.length - start + length;
	            }

	            substring = string.substr(start, length);

	            return valueFactory.createString(substring);
	        }
	    };
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var phpCommon = __webpack_require__(20),
	    PHPError = phpCommon.PHPError;

	module.exports = function (internals) {
	    var callStack = internals.callStack,
	        pausable = internals.pausable;

	    return {
	        'usleep': function (microsecondsReference) {
	            var microsecondsValue = microsecondsReference.getValue(),
	                pause;

	            if (microsecondsValue.getType() !== 'integer' && microsecondsValue.getType() !== 'float') {
	                callStack.raiseError(
	                    PHPError.E_WARNING,
	                    'usleep() expects parameter 1 to be integer or float, ' +
	                        microsecondsValue.getType() + ' given'
	                );
	                return;
	            }

	            pause = pausable.createPause();

	            setTimeout(function () {
	                pause.resume();
	            }, microsecondsValue.getNative() / 1000);

	            pause.now();
	        }
	    };
	};


/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPRuntime - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpruntime/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpruntime/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    phpCommon = __webpack_require__(20),
	    MAX_DUMPS = 20000,
	    MAX_RECURSION_DEPTH = 5,
	    MAX_STRING_LENGTH = 2048,
	    PHPError = phpCommon.PHPError;

	module.exports = function (internals) {
	    var callStack = internals.callStack,
	        stdout = internals.stdout;

	    return {
	        // NB: This output matches that of PHP with XDebug disabled
	        'var_dump': function (valueReference) {
	            var arrays = [],
	                dumps = 0,
	                value,
	                objects = [];

	            if (!valueReference) {
	                callStack.raiseError(PHPError.E_WARNING, 'var_dump() expects at least 1 parameter, 0 given');
	                return;
	            }

	            value = valueReference.getValue();

	            function dump(value, depth, isReference) {
	                var currentIndentation = new Array(depth).join('  '),
	                    names,
	                    nativeLength,
	                    nativeValue,
	                    nextIndentation = new Array(depth + 1).join('  '),
	                    representation = currentIndentation;

	                dumps++;

	                if (depth > MAX_RECURSION_DEPTH || dumps > MAX_DUMPS) {
	                    representation += '*RECURSION*';
	                    return representation + '\n';
	                }

	                if (value.getType() === 'array') {
	                    if (arrays.indexOf(value.getValue()) > -1) {
	                        representation += '*RECURSION*';
	                        return representation + '\n';
	                    }

	                    if (isReference) {
	                        arrays.push(value.getValue());
	                        representation += '&';
	                    }

	                    representation += 'array(' + value.getLength() + ') {\n';

	                    _.each(value.getKeys(), function (key) {
	                        var element = value.getElementByKey(key),
	                            elementRepresentation;

	                        elementRepresentation = dump(element.getValue(), depth + 1, element.isReference());

	                        representation += nextIndentation +
	                            '[' +
	                            JSON.stringify(key.getNative()) +
	                            ']=>\n' +
	                            elementRepresentation;
	                    });

	                    representation += currentIndentation + '}';
	                } else if (value.getType() === 'object') {
	                    if (objects.indexOf(value.getNative()) > -1) {
	                        representation += '*RECURSION*';
	                        return representation + '\n';
	                    }

	                    if (isReference) {
	                        representation += '&';
	                    }

	                    names = value.getInstancePropertyNames();

	                    representation += 'object(' + value.getClassName() + ')#' + value.getID() + ' (' + names.length + ') {\n';

	                    objects.push(value.getNative());

	                    _.each(names, function (nameValue) {
	                        var property = value.getInstancePropertyByName(nameValue);
	                        representation += nextIndentation +
	                            '[' +
	                            JSON.stringify(nameValue.getNative()) +
	                            ']=>\n' +
	                            dump(
	                                property.getValue(),
	                                depth + 1,
	                                property.isReference()
	                            );
	                    });

	                    representation += currentIndentation + '}';
	                } else {
	                    if (isReference) {
	                        representation += '&';
	                    }

	                    switch (value.getType()) {
	                    case 'boolean':
	                        representation += 'bool(' + (value.getNative() ? 'true' : 'false') + ')';
	                        break;
	                    case 'float':
	                        representation += 'float(' + value.getNative() + ')';
	                        break;
	                    case 'integer':
	                        representation += 'int(' + value.getNative() + ')';
	                        break;
	                    case 'null':
	                        representation += 'NULL';
	                        break;
	                    case 'string':
	                        nativeValue = value.getNative();
	                        nativeLength = nativeValue.length;

	                        if (nativeLength > MAX_STRING_LENGTH) {
	                            nativeValue = nativeValue.substr(0, MAX_STRING_LENGTH) + '...';
	                        }

	                        representation += 'string(' + nativeLength + ') "' + nativeValue + '"';
	                        break;
	                    }
	                }

	                return representation + '\n';
	            }

	            stdout.write(dump(value, 1));
	        }
	    };
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var pausable = __webpack_require__(38),
	    phpCommon = __webpack_require__(20),
	    phpToAST = __webpack_require__(101),
	    phpToJS = __webpack_require__(115),
	    Engine = __webpack_require__(122),
	    Environment = __webpack_require__(138),
	    Runtime = __webpack_require__(139).async(pausable),
	    runtime = new Runtime(Environment, Engine, phpCommon, pausable, phpToAST, phpToJS);

	module.exports = runtime;


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var Resumable = __webpack_require__(39),
	    Transpiler = __webpack_require__(64);

	module.exports = new Resumable(new Transpiler());


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    escodegen = __webpack_require__(40),
	    acorn = __webpack_require__(59),
	    PauseException = __webpack_require__(60),
	    Promise = __webpack_require__(61),
	    ResumeException = __webpack_require__(63),
	    FROM = 'from',
	    PARAM = 'param',
	    STRICT = 'strict',
	    TO = 'to';

	function Resumable(transpiler) {
	    this.transpiler = transpiler;
	}

	_.extend(Resumable, {
	    _resumeState_: null,
	    PauseException: PauseException,
	    ResumeException: ResumeException
	});

	_.extend(Resumable.prototype, {
	    call: function (func, args, thisObj) {
	        return new Promise(function (resolve, reject) {
	            var result;

	            try {
	                result = func.apply(thisObj, args);
	            } catch (e) {
	                if (e instanceof PauseException) {
	                    e.setPromise(resolve, reject);
	                } else {
	                    reject(e);
	                }

	                return;
	            }

	            resolve(result);
	        });
	    },

	    callSync: function (func, args, thisObj) {
	        var result;

	        try {
	            result = func.apply(thisObj, args);
	        } catch (e) {
	            if (e instanceof PauseException) {
	                throw new Error('Resumable.callSync() :: Main thread must not pause');
	            }

	            throw e;
	        }

	        return result;
	    },

	    createPause: function () {
	        var pause = new PauseException(function (resolve, reject, error, result, states) {
	                var i = 0,
	                    lastResult = result,
	                    state;

	                if (error) {
	                    /*jshint loopfunc: true */
	                    for (; i < states.length; i++) {
	                        state = states[i];

	                        _.each(state.catches, function (data, catchStatementIndex) {
	                            if (state.statementIndex < data[FROM] || state.statementIndex > data[TO]) {
	                                return;
	                            }

	                            state.statementIndex = catchStatementIndex * 1;
	                            state[data[PARAM]] = error;
	                            error = null;

	                            Resumable._resumeState_ = state;

	                            try {
	                                lastResult = state.func();
	                            } catch (e) {
	                                if (e instanceof PauseException) {
	                                    e.setPromise(resolve, reject);

	                                    return false;
	                                }

	                                throw e;
	                            }

	                            return false;
	                        });

	                        if (error === null) {
	                            break;
	                        }
	                    }

	                    if (i === states.length) {
	                        // Error was not handled by anything up the call stack
	                        reject(error);
	                        return;
	                    }
	                }

	                function handleNextState() {
	                    if (i === states.length) {
	                        resolve(lastResult);
	                        return;
	                    }

	                    state = states[i];
	                    i++;

	                    if (state.assignments[state.statementIndex - 1]) {
	                        state[state.assignments[state.statementIndex - 1]] = lastResult;
	                    }

	                    Resumable._resumeState_ = state;

	                    try {
	                        lastResult = state.func();
	                    } catch (e) {
	                        if (e instanceof PauseException) {
	                            e.setPromise(
	                                function (result) {
	                                    lastResult = result;
	                                    handleNextState();
	                                },
	                                function (error) {
	                                    // FIXME: Probably needs to call catch handlers
	                                    reject(error);
	                                }
	                            );

	                            return;
	                        }

	                        throw e;
	                    }

	                    handleNextState();
	                }

	                handleNextState();
	            });

	        return pause;
	    },

	    execute: function (code, options) {
	        var ast = acorn.parse(code, {'allowReturnOutsideFunction': true}),
	            expose,
	            func,
	            names = ['Resumable'],
	            resumable = this,
	            transpiledCode,
	            values = [Resumable];

	        options = options || {};
	        expose = options.expose || {};

	        _.forOwn(expose, function (value, name) {
	            names.push(name);
	            values.push(value);
	        });

	        ast = resumable.transpiler.transpile(ast);

	        transpiledCode = escodegen.generate(ast, {
	            format: {
	                indent: {
	                    style: '    ',
	                    base: 0
	                }
	            }
	        });

	        transpiledCode = 'return ' + transpiledCode;

	        if (options[STRICT]) {
	            transpiledCode = '"use strict"; ' + transpiledCode;
	        }

	        /*jshint evil:true */
	        func = new Function(names, transpiledCode);

	        return resumable.call(func.apply(null, values), [], null);
	    },

	    executeSync: function (args, fn, options) {
	        var code = 'return ' + fn.toString(),
	            ast = acorn.parse(code, {'allowReturnOutsideFunction': true}),
	            expose,
	            func,
	            names = ['Resumable'],
	            resumable = this,
	            transpiledCode,
	            values = [Resumable];

	        options = options || {};
	        expose = options.expose || {};

	        _.forOwn(expose, function (value, name) {
	            names.push(name);
	            values.push(value);
	        });

	        ast = resumable.transpiler.transpile(ast);

	        transpiledCode = escodegen.generate(ast, {
	            format: {
	                indent: {
	                    style: '    ',
	                    base: 0
	                }
	            }
	        });

	        transpiledCode = 'return ' + transpiledCode;

	        if (options[STRICT]) {
	            transpiledCode = '"use strict"; ' + transpiledCode;
	        }

	        /*jshint evil:true */
	        func = new Function(names, transpiledCode);

	        return resumable.callSync(func.apply(null, values)(), args, null);
	    }
	});

	module.exports = Resumable;


/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/*
	  Copyright (C) 2012-2014 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2015 Ingvar Stepanyan <me@rreverser.com>
	  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>
	  Copyright (C) 2012-2013 Michael Ficarra <escodegen.copyright@michael.ficarra.me>
	  Copyright (C) 2012-2013 Mathias Bynens <mathias@qiwi.be>
	  Copyright (C) 2013 Irakli Gozalishvili <rfobic@gmail.com>
	  Copyright (C) 2012 Robert Gust-Bardon <donate@robert.gust-bardon.org>
	  Copyright (C) 2012 John Freeman <jfreeman08@gmail.com>
	  Copyright (C) 2011-2012 Ariya Hidayat <ariya.hidayat@gmail.com>
	  Copyright (C) 2012 Joost-Wim Boekesteijn <joost-wim@boekesteijn.nl>
	  Copyright (C) 2012 Kris Kowal <kris.kowal@cixar.com>
	  Copyright (C) 2012 Arpad Borsos <arpad.borsos@googlemail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	/*global exports:true, require:true, global:true*/
	(function () {
	    'use strict';

	    var Syntax,
	        Precedence,
	        BinaryPrecedence,
	        SourceNode,
	        estraverse,
	        esutils,
	        isArray,
	        base,
	        indent,
	        json,
	        renumber,
	        hexadecimal,
	        quotes,
	        escapeless,
	        newline,
	        space,
	        parentheses,
	        semicolons,
	        safeConcatenation,
	        directive,
	        extra,
	        parse,
	        sourceMap,
	        sourceCode,
	        preserveBlankLines,
	        FORMAT_MINIFY,
	        FORMAT_DEFAULTS;

	    estraverse = __webpack_require__(41);
	    esutils = __webpack_require__(42);

	    Syntax = estraverse.Syntax;

	    // Generation is done by generateExpression.
	    function isExpression(node) {
	        return CodeGenerator.Expression.hasOwnProperty(node.type);
	    }

	    // Generation is done by generateStatement.
	    function isStatement(node) {
	        return CodeGenerator.Statement.hasOwnProperty(node.type);
	    }

	    Precedence = {
	        Sequence: 0,
	        Yield: 1,
	        Await: 1,
	        Assignment: 1,
	        Conditional: 2,
	        ArrowFunction: 2,
	        LogicalOR: 3,
	        LogicalAND: 4,
	        BitwiseOR: 5,
	        BitwiseXOR: 6,
	        BitwiseAND: 7,
	        Equality: 8,
	        Relational: 9,
	        BitwiseSHIFT: 10,
	        Additive: 11,
	        Multiplicative: 12,
	        Unary: 13,
	        Postfix: 14,
	        Call: 15,
	        New: 16,
	        TaggedTemplate: 17,
	        Member: 18,
	        Primary: 19
	    };

	    BinaryPrecedence = {
	        '||': Precedence.LogicalOR,
	        '&&': Precedence.LogicalAND,
	        '|': Precedence.BitwiseOR,
	        '^': Precedence.BitwiseXOR,
	        '&': Precedence.BitwiseAND,
	        '==': Precedence.Equality,
	        '!=': Precedence.Equality,
	        '===': Precedence.Equality,
	        '!==': Precedence.Equality,
	        'is': Precedence.Equality,
	        'isnt': Precedence.Equality,
	        '<': Precedence.Relational,
	        '>': Precedence.Relational,
	        '<=': Precedence.Relational,
	        '>=': Precedence.Relational,
	        'in': Precedence.Relational,
	        'instanceof': Precedence.Relational,
	        '<<': Precedence.BitwiseSHIFT,
	        '>>': Precedence.BitwiseSHIFT,
	        '>>>': Precedence.BitwiseSHIFT,
	        '+': Precedence.Additive,
	        '-': Precedence.Additive,
	        '*': Precedence.Multiplicative,
	        '%': Precedence.Multiplicative,
	        '/': Precedence.Multiplicative
	    };

	    //Flags
	    var F_ALLOW_IN = 1,
	        F_ALLOW_CALL = 1 << 1,
	        F_ALLOW_UNPARATH_NEW = 1 << 2,
	        F_FUNC_BODY = 1 << 3,
	        F_DIRECTIVE_CTX = 1 << 4,
	        F_SEMICOLON_OPT = 1 << 5;

	    //Expression flag sets
	    //NOTE: Flag order:
	    // F_ALLOW_IN
	    // F_ALLOW_CALL
	    // F_ALLOW_UNPARATH_NEW
	    var E_FTT = F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW,
	        E_TTF = F_ALLOW_IN | F_ALLOW_CALL,
	        E_TTT = F_ALLOW_IN | F_ALLOW_CALL | F_ALLOW_UNPARATH_NEW,
	        E_TFF = F_ALLOW_IN,
	        E_FFT = F_ALLOW_UNPARATH_NEW,
	        E_TFT = F_ALLOW_IN | F_ALLOW_UNPARATH_NEW;

	    //Statement flag sets
	    //NOTE: Flag order:
	    // F_ALLOW_IN
	    // F_FUNC_BODY
	    // F_DIRECTIVE_CTX
	    // F_SEMICOLON_OPT
	    var S_TFFF = F_ALLOW_IN,
	        S_TFFT = F_ALLOW_IN | F_SEMICOLON_OPT,
	        S_FFFF = 0x00,
	        S_TFTF = F_ALLOW_IN | F_DIRECTIVE_CTX,
	        S_TTFF = F_ALLOW_IN | F_FUNC_BODY;

	    function getDefaultOptions() {
	        // default options
	        return {
	            indent: null,
	            base: null,
	            parse: null,
	            comment: false,
	            format: {
	                indent: {
	                    style: '    ',
	                    base: 0,
	                    adjustMultilineComment: false
	                },
	                newline: '\n',
	                space: ' ',
	                json: false,
	                renumber: false,
	                hexadecimal: false,
	                quotes: 'single',
	                escapeless: false,
	                compact: false,
	                parentheses: true,
	                semicolons: true,
	                safeConcatenation: false,
	                preserveBlankLines: false
	            },
	            moz: {
	                comprehensionExpressionStartsWithAssignment: false,
	                starlessGenerator: false
	            },
	            sourceMap: null,
	            sourceMapRoot: null,
	            sourceMapWithCode: false,
	            directive: false,
	            raw: true,
	            verbatim: null,
	            sourceCode: null
	        };
	    }

	    function stringRepeat(str, num) {
	        var result = '';

	        for (num |= 0; num > 0; num >>>= 1, str += str) {
	            if (num & 1) {
	                result += str;
	            }
	        }

	        return result;
	    }

	    isArray = Array.isArray;
	    if (!isArray) {
	        isArray = function isArray(array) {
	            return Object.prototype.toString.call(array) === '[object Array]';
	        };
	    }

	    function hasLineTerminator(str) {
	        return (/[\r\n]/g).test(str);
	    }

	    function endsWithLineTerminator(str) {
	        var len = str.length;
	        return len && esutils.code.isLineTerminator(str.charCodeAt(len - 1));
	    }

	    function merge(target, override) {
	        var key;
	        for (key in override) {
	            if (override.hasOwnProperty(key)) {
	                target[key] = override[key];
	            }
	        }
	        return target;
	    }

	    function updateDeeply(target, override) {
	        var key, val;

	        function isHashObject(target) {
	            return typeof target === 'object' && target instanceof Object && !(target instanceof RegExp);
	        }

	        for (key in override) {
	            if (override.hasOwnProperty(key)) {
	                val = override[key];
	                if (isHashObject(val)) {
	                    if (isHashObject(target[key])) {
	                        updateDeeply(target[key], val);
	                    } else {
	                        target[key] = updateDeeply({}, val);
	                    }
	                } else {
	                    target[key] = val;
	                }
	            }
	        }
	        return target;
	    }

	    function generateNumber(value) {
	        var result, point, temp, exponent, pos;

	        if (value !== value) {
	            throw new Error('Numeric literal whose value is NaN');
	        }
	        if (value < 0 || (value === 0 && 1 / value < 0)) {
	            throw new Error('Numeric literal whose value is negative');
	        }

	        if (value === 1 / 0) {
	            return json ? 'null' : renumber ? '1e400' : '1e+400';
	        }

	        result = '' + value;
	        if (!renumber || result.length < 3) {
	            return result;
	        }

	        point = result.indexOf('.');
	        if (!json && result.charCodeAt(0) === 0x30  /* 0 */ && point === 1) {
	            point = 0;
	            result = result.slice(1);
	        }
	        temp = result;
	        result = result.replace('e+', 'e');
	        exponent = 0;
	        if ((pos = temp.indexOf('e')) > 0) {
	            exponent = +temp.slice(pos + 1);
	            temp = temp.slice(0, pos);
	        }
	        if (point >= 0) {
	            exponent -= temp.length - point - 1;
	            temp = +(temp.slice(0, point) + temp.slice(point + 1)) + '';
	        }
	        pos = 0;
	        while (temp.charCodeAt(temp.length + pos - 1) === 0x30  /* 0 */) {
	            --pos;
	        }
	        if (pos !== 0) {
	            exponent -= pos;
	            temp = temp.slice(0, pos);
	        }
	        if (exponent !== 0) {
	            temp += 'e' + exponent;
	        }
	        if ((temp.length < result.length ||
	                    (hexadecimal && value > 1e12 && Math.floor(value) === value && (temp = '0x' + value.toString(16)).length < result.length)) &&
	                +temp === value) {
	            result = temp;
	        }

	        return result;
	    }

	    // Generate valid RegExp expression.
	    // This function is based on https://github.com/Constellation/iv Engine

	    function escapeRegExpCharacter(ch, previousIsBackslash) {
	        // not handling '\' and handling \u2028 or \u2029 to unicode escape sequence
	        if ((ch & ~1) === 0x2028) {
	            return (previousIsBackslash ? 'u' : '\\u') + ((ch === 0x2028) ? '2028' : '2029');
	        } else if (ch === 10 || ch === 13) {  // \n, \r
	            return (previousIsBackslash ? '' : '\\') + ((ch === 10) ? 'n' : 'r');
	        }
	        return String.fromCharCode(ch);
	    }

	    function generateRegExp(reg) {
	        var match, result, flags, i, iz, ch, characterInBrack, previousIsBackslash;

	        result = reg.toString();

	        if (reg.source) {
	            // extract flag from toString result
	            match = result.match(/\/([^/]*)$/);
	            if (!match) {
	                return result;
	            }

	            flags = match[1];
	            result = '';

	            characterInBrack = false;
	            previousIsBackslash = false;
	            for (i = 0, iz = reg.source.length; i < iz; ++i) {
	                ch = reg.source.charCodeAt(i);

	                if (!previousIsBackslash) {
	                    if (characterInBrack) {
	                        if (ch === 93) {  // ]
	                            characterInBrack = false;
	                        }
	                    } else {
	                        if (ch === 47) {  // /
	                            result += '\\';
	                        } else if (ch === 91) {  // [
	                            characterInBrack = true;
	                        }
	                    }
	                    result += escapeRegExpCharacter(ch, previousIsBackslash);
	                    previousIsBackslash = ch === 92;  // \
	                } else {
	                    // if new RegExp("\\\n') is provided, create /\n/
	                    result += escapeRegExpCharacter(ch, previousIsBackslash);
	                    // prevent like /\\[/]/
	                    previousIsBackslash = false;
	                }
	            }

	            return '/' + result + '/' + flags;
	        }

	        return result;
	    }

	    function escapeAllowedCharacter(code, next) {
	        var hex;

	        if (code === 0x08  /* \b */) {
	            return '\\b';
	        }

	        if (code === 0x0C  /* \f */) {
	            return '\\f';
	        }

	        if (code === 0x09  /* \t */) {
	            return '\\t';
	        }

	        hex = code.toString(16).toUpperCase();
	        if (json || code > 0xFF) {
	            return '\\u' + '0000'.slice(hex.length) + hex;
	        } else if (code === 0x0000 && !esutils.code.isDecimalDigit(next)) {
	            return '\\0';
	        } else if (code === 0x000B  /* \v */) { // '\v'
	            return '\\x0B';
	        } else {
	            return '\\x' + '00'.slice(hex.length) + hex;
	        }
	    }

	    function escapeDisallowedCharacter(code) {
	        if (code === 0x5C  /* \ */) {
	            return '\\\\';
	        }

	        if (code === 0x0A  /* \n */) {
	            return '\\n';
	        }

	        if (code === 0x0D  /* \r */) {
	            return '\\r';
	        }

	        if (code === 0x2028) {
	            return '\\u2028';
	        }

	        if (code === 0x2029) {
	            return '\\u2029';
	        }

	        throw new Error('Incorrectly classified character');
	    }

	    function escapeDirective(str) {
	        var i, iz, code, quote;

	        quote = quotes === 'double' ? '"' : '\'';
	        for (i = 0, iz = str.length; i < iz; ++i) {
	            code = str.charCodeAt(i);
	            if (code === 0x27  /* ' */) {
	                quote = '"';
	                break;
	            } else if (code === 0x22  /* " */) {
	                quote = '\'';
	                break;
	            } else if (code === 0x5C  /* \ */) {
	                ++i;
	            }
	        }

	        return quote + str + quote;
	    }

	    function escapeString(str) {
	        var result = '', i, len, code, singleQuotes = 0, doubleQuotes = 0, single, quote;

	        for (i = 0, len = str.length; i < len; ++i) {
	            code = str.charCodeAt(i);
	            if (code === 0x27  /* ' */) {
	                ++singleQuotes;
	            } else if (code === 0x22  /* " */) {
	                ++doubleQuotes;
	            } else if (code === 0x2F  /* / */ && json) {
	                result += '\\';
	            } else if (esutils.code.isLineTerminator(code) || code === 0x5C  /* \ */) {
	                result += escapeDisallowedCharacter(code);
	                continue;
	            } else if (!esutils.code.isIdentifierPartES5(code) && (json && code < 0x20  /* SP */ || !json && !escapeless && (code < 0x20  /* SP */ || code > 0x7E  /* ~ */))) {
	                result += escapeAllowedCharacter(code, str.charCodeAt(i + 1));
	                continue;
	            }
	            result += String.fromCharCode(code);
	        }

	        single = !(quotes === 'double' || (quotes === 'auto' && doubleQuotes < singleQuotes));
	        quote = single ? '\'' : '"';

	        if (!(single ? singleQuotes : doubleQuotes)) {
	            return quote + result + quote;
	        }

	        str = result;
	        result = quote;

	        for (i = 0, len = str.length; i < len; ++i) {
	            code = str.charCodeAt(i);
	            if ((code === 0x27  /* ' */ && single) || (code === 0x22  /* " */ && !single)) {
	                result += '\\';
	            }
	            result += String.fromCharCode(code);
	        }

	        return result + quote;
	    }

	    /**
	     * flatten an array to a string, where the array can contain
	     * either strings or nested arrays
	     */
	    function flattenToString(arr) {
	        var i, iz, elem, result = '';
	        for (i = 0, iz = arr.length; i < iz; ++i) {
	            elem = arr[i];
	            result += isArray(elem) ? flattenToString(elem) : elem;
	        }
	        return result;
	    }

	    /**
	     * convert generated to a SourceNode when source maps are enabled.
	     */
	    function toSourceNodeWhenNeeded(generated, node) {
	        if (!sourceMap) {
	            // with no source maps, generated is either an
	            // array or a string.  if an array, flatten it.
	            // if a string, just return it
	            if (isArray(generated)) {
	                return flattenToString(generated);
	            } else {
	                return generated;
	            }
	        }
	        if (node == null) {
	            if (generated instanceof SourceNode) {
	                return generated;
	            } else {
	                node = {};
	            }
	        }
	        if (node.loc == null) {
	            return new SourceNode(null, null, sourceMap, generated, node.name || null);
	        }
	        return new SourceNode(node.loc.start.line, node.loc.start.column, (sourceMap === true ? node.loc.source || null : sourceMap), generated, node.name || null);
	    }

	    function noEmptySpace() {
	        return (space) ? space : ' ';
	    }

	    function join(left, right) {
	        var leftSource,
	            rightSource,
	            leftCharCode,
	            rightCharCode;

	        leftSource = toSourceNodeWhenNeeded(left).toString();
	        if (leftSource.length === 0) {
	            return [right];
	        }

	        rightSource = toSourceNodeWhenNeeded(right).toString();
	        if (rightSource.length === 0) {
	            return [left];
	        }

	        leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
	        rightCharCode = rightSource.charCodeAt(0);

	        if ((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode ||
	            esutils.code.isIdentifierPartES5(leftCharCode) && esutils.code.isIdentifierPartES5(rightCharCode) ||
	            leftCharCode === 0x2F  /* / */ && rightCharCode === 0x69  /* i */) { // infix word operators all start with `i`
	            return [left, noEmptySpace(), right];
	        } else if (esutils.code.isWhiteSpace(leftCharCode) || esutils.code.isLineTerminator(leftCharCode) ||
	                esutils.code.isWhiteSpace(rightCharCode) || esutils.code.isLineTerminator(rightCharCode)) {
	            return [left, right];
	        }
	        return [left, space, right];
	    }

	    function addIndent(stmt) {
	        return [base, stmt];
	    }

	    function withIndent(fn) {
	        var previousBase;
	        previousBase = base;
	        base += indent;
	        fn(base);
	        base = previousBase;
	    }

	    function calculateSpaces(str) {
	        var i;
	        for (i = str.length - 1; i >= 0; --i) {
	            if (esutils.code.isLineTerminator(str.charCodeAt(i))) {
	                break;
	            }
	        }
	        return (str.length - 1) - i;
	    }

	    function adjustMultilineComment(value, specialBase) {
	        var array, i, len, line, j, spaces, previousBase, sn;

	        array = value.split(/\r\n|[\r\n]/);
	        spaces = Number.MAX_VALUE;

	        // first line doesn't have indentation
	        for (i = 1, len = array.length; i < len; ++i) {
	            line = array[i];
	            j = 0;
	            while (j < line.length && esutils.code.isWhiteSpace(line.charCodeAt(j))) {
	                ++j;
	            }
	            if (spaces > j) {
	                spaces = j;
	            }
	        }

	        if (typeof specialBase !== 'undefined') {
	            // pattern like
	            // {
	            //   var t = 20;  /*
	            //                 * this is comment
	            //                 */
	            // }
	            previousBase = base;
	            if (array[1][spaces] === '*') {
	                specialBase += ' ';
	            }
	            base = specialBase;
	        } else {
	            if (spaces & 1) {
	                // /*
	                //  *
	                //  */
	                // If spaces are odd number, above pattern is considered.
	                // We waste 1 space.
	                --spaces;
	            }
	            previousBase = base;
	        }

	        for (i = 1, len = array.length; i < len; ++i) {
	            sn = toSourceNodeWhenNeeded(addIndent(array[i].slice(spaces)));
	            array[i] = sourceMap ? sn.join('') : sn;
	        }

	        base = previousBase;

	        return array.join('\n');
	    }

	    function generateComment(comment, specialBase) {
	        if (comment.type === 'Line') {
	            if (endsWithLineTerminator(comment.value)) {
	                return '//' + comment.value;
	            } else {
	                // Always use LineTerminator
	                var result = '//' + comment.value;
	                if (!preserveBlankLines) {
	                    result += '\n';
	                }
	                return result;
	            }
	        }
	        if (extra.format.indent.adjustMultilineComment && /[\n\r]/.test(comment.value)) {
	            return adjustMultilineComment('/*' + comment.value + '*/', specialBase);
	        }
	        return '/*' + comment.value + '*/';
	    }

	    function addComments(stmt, result) {
	        var i, len, comment, save, tailingToStatement, specialBase, fragment,
	            extRange, range, prevRange, prefix, infix, suffix, count;

	        if (stmt.leadingComments && stmt.leadingComments.length > 0) {
	            save = result;

	            if (preserveBlankLines) {
	                comment = stmt.leadingComments[0];
	                result = [];

	                extRange = comment.extendedRange;
	                range = comment.range;

	                prefix = sourceCode.substring(extRange[0], range[0]);
	                count = (prefix.match(/\n/g) || []).length;
	                if (count > 0) {
	                    result.push(stringRepeat('\n', count));
	                    result.push(addIndent(generateComment(comment)));
	                } else {
	                    result.push(prefix);
	                    result.push(generateComment(comment));
	                }

	                prevRange = range;

	                for (i = 1, len = stmt.leadingComments.length; i < len; i++) {
	                    comment = stmt.leadingComments[i];
	                    range = comment.range;

	                    infix = sourceCode.substring(prevRange[1], range[0]);
	                    count = (infix.match(/\n/g) || []).length;
	                    result.push(stringRepeat('\n', count));
	                    result.push(addIndent(generateComment(comment)));

	                    prevRange = range;
	                }

	                suffix = sourceCode.substring(range[1], extRange[1]);
	                count = (suffix.match(/\n/g) || []).length;
	                result.push(stringRepeat('\n', count));
	            } else {
	                comment = stmt.leadingComments[0];
	                result = [];
	                if (safeConcatenation && stmt.type === Syntax.Program && stmt.body.length === 0) {
	                    result.push('\n');
	                }
	                result.push(generateComment(comment));
	                if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                    result.push('\n');
	                }

	                for (i = 1, len = stmt.leadingComments.length; i < len; ++i) {
	                    comment = stmt.leadingComments[i];
	                    fragment = [generateComment(comment)];
	                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                        fragment.push('\n');
	                    }
	                    result.push(addIndent(fragment));
	                }
	            }

	            result.push(addIndent(save));
	        }

	        if (stmt.trailingComments) {

	            if (preserveBlankLines) {
	                comment = stmt.trailingComments[0];
	                extRange = comment.extendedRange;
	                range = comment.range;

	                prefix = sourceCode.substring(extRange[0], range[0]);
	                count = (prefix.match(/\n/g) || []).length;

	                if (count > 0) {
	                    result.push(stringRepeat('\n', count));
	                    result.push(addIndent(generateComment(comment)));
	                } else {
	                    result.push(prefix);
	                    result.push(generateComment(comment));
	                }
	            } else {
	                tailingToStatement = !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
	                specialBase = stringRepeat(' ', calculateSpaces(toSourceNodeWhenNeeded([base, result, indent]).toString()));
	                for (i = 0, len = stmt.trailingComments.length; i < len; ++i) {
	                    comment = stmt.trailingComments[i];
	                    if (tailingToStatement) {
	                        // We assume target like following script
	                        //
	                        // var t = 20;  /**
	                        //               * This is comment of t
	                        //               */
	                        if (i === 0) {
	                            // first case
	                            result = [result, indent];
	                        } else {
	                            result = [result, specialBase];
	                        }
	                        result.push(generateComment(comment, specialBase));
	                    } else {
	                        result = [result, addIndent(generateComment(comment))];
	                    }
	                    if (i !== len - 1 && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                        result = [result, '\n'];
	                    }
	                }
	            }
	        }

	        return result;
	    }

	    function generateBlankLines(start, end, result) {
	        var j, newlineCount = 0;

	        for (j = start; j < end; j++) {
	            if (sourceCode[j] === '\n') {
	                newlineCount++;
	            }
	        }

	        for (j = 1; j < newlineCount; j++) {
	            result.push(newline);
	        }
	    }

	    function parenthesize(text, current, should) {
	        if (current < should) {
	            return ['(', text, ')'];
	        }
	        return text;
	    }

	    function generateVerbatimString(string) {
	        var i, iz, result;
	        result = string.split(/\r\n|\n/);
	        for (i = 1, iz = result.length; i < iz; i++) {
	            result[i] = newline + base + result[i];
	        }
	        return result;
	    }

	    function generateVerbatim(expr, precedence) {
	        var verbatim, result, prec;
	        verbatim = expr[extra.verbatim];

	        if (typeof verbatim === 'string') {
	            result = parenthesize(generateVerbatimString(verbatim), Precedence.Sequence, precedence);
	        } else {
	            // verbatim is object
	            result = generateVerbatimString(verbatim.content);
	            prec = (verbatim.precedence != null) ? verbatim.precedence : Precedence.Sequence;
	            result = parenthesize(result, prec, precedence);
	        }

	        return toSourceNodeWhenNeeded(result, expr);
	    }

	    function CodeGenerator() {
	    }

	    // Helpers.

	    CodeGenerator.prototype.maybeBlock = function(stmt, flags) {
	        var result, noLeadingComment, that = this;

	        noLeadingComment = !extra.comment || !stmt.leadingComments;

	        if (stmt.type === Syntax.BlockStatement && noLeadingComment) {
	            return [space, this.generateStatement(stmt, flags)];
	        }

	        if (stmt.type === Syntax.EmptyStatement && noLeadingComment) {
	            return ';';
	        }

	        withIndent(function () {
	            result = [
	                newline,
	                addIndent(that.generateStatement(stmt, flags))
	            ];
	        });

	        return result;
	    };

	    CodeGenerator.prototype.maybeBlockSuffix = function (stmt, result) {
	        var ends = endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString());
	        if (stmt.type === Syntax.BlockStatement && (!extra.comment || !stmt.leadingComments) && !ends) {
	            return [result, space];
	        }
	        if (ends) {
	            return [result, base];
	        }
	        return [result, newline, base];
	    };

	    function generateIdentifier(node) {
	        return toSourceNodeWhenNeeded(node.name, node);
	    }

	    function generateAsyncPrefix(node, spaceRequired) {
	        return node.async ? 'async' + (spaceRequired ? noEmptySpace() : space) : '';
	    }

	    function generateStarSuffix(node) {
	        var isGenerator = node.generator && !extra.moz.starlessGenerator;
	        return isGenerator ? '*' + space : '';
	    }

	    function generateMethodPrefix(prop) {
	        var func = prop.value;
	        if (func.async) {
	            return generateAsyncPrefix(func, !prop.computed);
	        } else {
	            // avoid space before method name
	            return generateStarSuffix(func) ? '*' : '';
	        }
	    }

	    CodeGenerator.prototype.generatePattern = function (node, precedence, flags) {
	        if (node.type === Syntax.Identifier) {
	            return generateIdentifier(node);
	        }
	        return this.generateExpression(node, precedence, flags);
	    };

	    CodeGenerator.prototype.generateFunctionParams = function (node) {
	        var i, iz, result, hasDefault;

	        hasDefault = false;

	        if (node.type === Syntax.ArrowFunctionExpression &&
	                !node.rest && (!node.defaults || node.defaults.length === 0) &&
	                node.params.length === 1 && node.params[0].type === Syntax.Identifier) {
	            // arg => { } case
	            result = [generateAsyncPrefix(node, true), generateIdentifier(node.params[0])];
	        } else {
	            result = node.type === Syntax.ArrowFunctionExpression ? [generateAsyncPrefix(node, false)] : [];
	            result.push('(');
	            if (node.defaults) {
	                hasDefault = true;
	            }
	            for (i = 0, iz = node.params.length; i < iz; ++i) {
	                if (hasDefault && node.defaults[i]) {
	                    // Handle default values.
	                    result.push(this.generateAssignment(node.params[i], node.defaults[i], '=', Precedence.Assignment, E_TTT));
	                } else {
	                    result.push(this.generatePattern(node.params[i], Precedence.Assignment, E_TTT));
	                }
	                if (i + 1 < iz) {
	                    result.push(',' + space);
	                }
	            }

	            if (node.rest) {
	                if (node.params.length) {
	                    result.push(',' + space);
	                }
	                result.push('...');
	                result.push(generateIdentifier(node.rest));
	            }

	            result.push(')');
	        }

	        return result;
	    };

	    CodeGenerator.prototype.generateFunctionBody = function (node) {
	        var result, expr;

	        result = this.generateFunctionParams(node);

	        if (node.type === Syntax.ArrowFunctionExpression) {
	            result.push(space);
	            result.push('=>');
	        }

	        if (node.expression) {
	            result.push(space);
	            expr = this.generateExpression(node.body, Precedence.Assignment, E_TTT);
	            if (expr.toString().charAt(0) === '{') {
	                expr = ['(', expr, ')'];
	            }
	            result.push(expr);
	        } else {
	            result.push(this.maybeBlock(node.body, S_TTFF));
	        }

	        return result;
	    };

	    CodeGenerator.prototype.generateIterationForStatement = function (operator, stmt, flags) {
	        var result = ['for' + space + '('], that = this;
	        withIndent(function () {
	            if (stmt.left.type === Syntax.VariableDeclaration) {
	                withIndent(function () {
	                    result.push(stmt.left.kind + noEmptySpace());
	                    result.push(that.generateStatement(stmt.left.declarations[0], S_FFFF));
	                });
	            } else {
	                result.push(that.generateExpression(stmt.left, Precedence.Call, E_TTT));
	            }

	            result = join(result, operator);
	            result = [join(
	                result,
	                that.generateExpression(stmt.right, Precedence.Sequence, E_TTT)
	            ), ')'];
	        });
	        result.push(this.maybeBlock(stmt.body, flags));
	        return result;
	    };

	    CodeGenerator.prototype.generatePropertyKey = function (expr, computed) {
	        var result = [];

	        if (computed) {
	            result.push('[');
	        }

	        result.push(this.generateExpression(expr, Precedence.Sequence, E_TTT));
	        if (computed) {
	            result.push(']');
	        }

	        return result;
	    };

	    CodeGenerator.prototype.generateAssignment = function (left, right, operator, precedence, flags) {
	        if (Precedence.Assignment < precedence) {
	            flags |= F_ALLOW_IN;
	        }

	        return parenthesize(
	            [
	                this.generateExpression(left, Precedence.Call, flags),
	                space + operator + space,
	                this.generateExpression(right, Precedence.Assignment, flags)
	            ],
	            Precedence.Assignment,
	            precedence
	        );
	    };

	    CodeGenerator.prototype.semicolon = function (flags) {
	        if (!semicolons && flags & F_SEMICOLON_OPT) {
	            return '';
	        }
	        return ';';
	    };

	    // Statements.

	    CodeGenerator.Statement = {

	        BlockStatement: function (stmt, flags) {
	            var range, content, result = ['{', newline], that = this;

	            withIndent(function () {
	                // handle functions without any code
	                if (stmt.body.length === 0 && preserveBlankLines) {
	                    range = stmt.range;
	                    if (range[1] - range[0] > 2) {
	                        content = sourceCode.substring(range[0] + 1, range[1] - 1);
	                        if (content[0] === '\n') {
	                            result = ['{'];
	                        }
	                        result.push(content);
	                    }
	                }

	                var i, iz, fragment, bodyFlags;
	                bodyFlags = S_TFFF;
	                if (flags & F_FUNC_BODY) {
	                    bodyFlags |= F_DIRECTIVE_CTX;
	                }

	                for (i = 0, iz = stmt.body.length; i < iz; ++i) {
	                    if (preserveBlankLines) {
	                        // handle spaces before the first line
	                        if (i === 0) {
	                            if (stmt.body[0].leadingComments) {
	                                range = stmt.body[0].leadingComments[0].extendedRange;
	                                content = sourceCode.substring(range[0], range[1]);
	                                if (content[0] === '\n') {
	                                    result = ['{'];
	                                }
	                            }
	                            if (!stmt.body[0].leadingComments) {
	                                generateBlankLines(stmt.range[0], stmt.body[0].range[0], result);
	                            }
	                        }

	                        // handle spaces between lines
	                        if (i > 0) {
	                            if (!stmt.body[i - 1].trailingComments  && !stmt.body[i].leadingComments) {
	                                generateBlankLines(stmt.body[i - 1].range[1], stmt.body[i].range[0], result);
	                            }
	                        }
	                    }

	                    if (i === iz - 1) {
	                        bodyFlags |= F_SEMICOLON_OPT;
	                    }

	                    if (stmt.body[i].leadingComments && preserveBlankLines) {
	                        fragment = that.generateStatement(stmt.body[i], bodyFlags);
	                    } else {
	                        fragment = addIndent(that.generateStatement(stmt.body[i], bodyFlags));
	                    }

	                    result.push(fragment);
	                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                        if (preserveBlankLines && i < iz - 1) {
	                            // don't add a new line if there are leading coments
	                            // in the next statement
	                            if (!stmt.body[i + 1].leadingComments) {
	                                result.push(newline);
	                            }
	                        } else {
	                            result.push(newline);
	                        }
	                    }

	                    if (preserveBlankLines) {
	                        // handle spaces after the last line
	                        if (i === iz - 1) {
	                            if (!stmt.body[i].trailingComments) {
	                                generateBlankLines(stmt.body[i].range[1], stmt.range[1], result);
	                            }
	                        }
	                    }
	                }
	            });

	            result.push(addIndent('}'));
	            return result;
	        },

	        BreakStatement: function (stmt, flags) {
	            if (stmt.label) {
	                return 'break ' + stmt.label.name + this.semicolon(flags);
	            }
	            return 'break' + this.semicolon(flags);
	        },

	        ContinueStatement: function (stmt, flags) {
	            if (stmt.label) {
	                return 'continue ' + stmt.label.name + this.semicolon(flags);
	            }
	            return 'continue' + this.semicolon(flags);
	        },

	        ClassBody: function (stmt, flags) {
	            var result = [ '{', newline], that = this;

	            withIndent(function (indent) {
	                var i, iz;

	                for (i = 0, iz = stmt.body.length; i < iz; ++i) {
	                    result.push(indent);
	                    result.push(that.generateExpression(stmt.body[i], Precedence.Sequence, E_TTT));
	                    if (i + 1 < iz) {
	                        result.push(newline);
	                    }
	                }
	            });

	            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(base);
	            result.push('}');
	            return result;
	        },

	        ClassDeclaration: function (stmt, flags) {
	            var result, fragment;
	            result  = ['class ' + stmt.id.name];
	            if (stmt.superClass) {
	                fragment = join('extends', this.generateExpression(stmt.superClass, Precedence.Assignment, E_TTT));
	                result = join(result, fragment);
	            }
	            result.push(space);
	            result.push(this.generateStatement(stmt.body, S_TFFT));
	            return result;
	        },

	        DirectiveStatement: function (stmt, flags) {
	            if (extra.raw && stmt.raw) {
	                return stmt.raw + this.semicolon(flags);
	            }
	            return escapeDirective(stmt.directive) + this.semicolon(flags);
	        },

	        DoWhileStatement: function (stmt, flags) {
	            // Because `do 42 while (cond)` is Syntax Error. We need semicolon.
	            var result = join('do', this.maybeBlock(stmt.body, S_TFFF));
	            result = this.maybeBlockSuffix(stmt.body, result);
	            return join(result, [
	                'while' + space + '(',
	                this.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
	                ')' + this.semicolon(flags)
	            ]);
	        },

	        CatchClause: function (stmt, flags) {
	            var result, that = this;
	            withIndent(function () {
	                var guard;

	                result = [
	                    'catch' + space + '(',
	                    that.generateExpression(stmt.param, Precedence.Sequence, E_TTT),
	                    ')'
	                ];

	                if (stmt.guard) {
	                    guard = that.generateExpression(stmt.guard, Precedence.Sequence, E_TTT);
	                    result.splice(2, 0, ' if ', guard);
	                }
	            });
	            result.push(this.maybeBlock(stmt.body, S_TFFF));
	            return result;
	        },

	        DebuggerStatement: function (stmt, flags) {
	            return 'debugger' + this.semicolon(flags);
	        },

	        EmptyStatement: function (stmt, flags) {
	            return ';';
	        },

	        ExportDeclaration: function (stmt, flags) {
	            var result = [ 'export' ], bodyFlags, that = this;

	            bodyFlags = (flags & F_SEMICOLON_OPT) ? S_TFFT : S_TFFF;

	            // export default HoistableDeclaration[Default]
	            // export default AssignmentExpression[In] ;
	            if (stmt['default']) {
	                result = join(result, 'default');
	                if (isStatement(stmt.declaration)) {
	                    result = join(result, this.generateStatement(stmt.declaration, bodyFlags));
	                } else {
	                    result = join(result, this.generateExpression(stmt.declaration, Precedence.Assignment, E_TTT) + this.semicolon(flags));
	                }
	                return result;
	            }

	            // export VariableStatement
	            // export Declaration[Default]
	            if (stmt.declaration) {
	                return join(result, this.generateStatement(stmt.declaration, bodyFlags));
	            }

	            // export * FromClause ;
	            // export ExportClause[NoReference] FromClause ;
	            // export ExportClause ;
	            if (stmt.specifiers) {
	                if (stmt.specifiers.length === 0) {
	                    result = join(result, '{' + space + '}');
	                } else if (stmt.specifiers[0].type === Syntax.ExportBatchSpecifier) {
	                    result = join(result, this.generateExpression(stmt.specifiers[0], Precedence.Sequence, E_TTT));
	                } else {
	                    result = join(result, '{');
	                    withIndent(function (indent) {
	                        var i, iz;
	                        result.push(newline);
	                        for (i = 0, iz = stmt.specifiers.length; i < iz; ++i) {
	                            result.push(indent);
	                            result.push(that.generateExpression(stmt.specifiers[i], Precedence.Sequence, E_TTT));
	                            if (i + 1 < iz) {
	                                result.push(',' + newline);
	                            }
	                        }
	                    });
	                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                        result.push(newline);
	                    }
	                    result.push(base + '}');
	                }

	                if (stmt.source) {
	                    result = join(result, [
	                        'from' + space,
	                        // ModuleSpecifier
	                        this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
	                        this.semicolon(flags)
	                    ]);
	                } else {
	                    result.push(this.semicolon(flags));
	                }
	            }
	            return result;
	        },

	        ExportDefaultDeclaration: function (stmt, flags) {
	             stmt.default = true;
	             return this.ExportDeclaration(stmt, flags);
	        },

	        ExportNamedDeclaration: function (stmt, flags) {
	            return this.ExportDeclaration(stmt, flags);
	        },

	        ExpressionStatement: function (stmt, flags) {
	            var result, fragment;

	            function isClassPrefixed(fragment) {
	                var code;
	                if (fragment.slice(0, 5) !== 'class') {
	                    return false;
	                }
	                code = fragment.charCodeAt(5);
	                return code === 0x7B  /* '{' */ || esutils.code.isWhiteSpace(code) || esutils.code.isLineTerminator(code);
	            }

	            function isFunctionPrefixed(fragment) {
	                var code;
	                if (fragment.slice(0, 8) !== 'function') {
	                    return false;
	                }
	                code = fragment.charCodeAt(8);
	                return code === 0x28 /* '(' */ || esutils.code.isWhiteSpace(code) || code === 0x2A  /* '*' */ || esutils.code.isLineTerminator(code);
	            }

	            function isAsyncPrefixed(fragment) {
	                var code, i, iz;
	                if (fragment.slice(0, 5) !== 'async') {
	                    return false;
	                }
	                if (!esutils.code.isWhiteSpace(fragment.charCodeAt(5))) {
	                    return false;
	                }
	                for (i = 6, iz = fragment.length; i < iz; ++i) {
	                    if (!esutils.code.isWhiteSpace(fragment.charCodeAt(i))) {
	                        break;
	                    }
	                }
	                if (i === iz) {
	                    return false;
	                }
	                if (fragment.slice(i, i + 8) !== 'function') {
	                    return false;
	                }
	                code = fragment.charCodeAt(i + 8);
	                return code === 0x28 /* '(' */ || esutils.code.isWhiteSpace(code) || code === 0x2A  /* '*' */ || esutils.code.isLineTerminator(code);
	            }

	            result = [this.generateExpression(stmt.expression, Precedence.Sequence, E_TTT)];
	            // 12.4 '{', 'function', 'class' is not allowed in this position.
	            // wrap expression with parentheses
	            fragment = toSourceNodeWhenNeeded(result).toString();
	            if (fragment.charCodeAt(0) === 0x7B  /* '{' */ ||  // ObjectExpression
	                    isClassPrefixed(fragment) ||
	                    isFunctionPrefixed(fragment) ||
	                    isAsyncPrefixed(fragment) ||
	                    (directive && (flags & F_DIRECTIVE_CTX) && stmt.expression.type === Syntax.Literal && typeof stmt.expression.value === 'string')) {
	                result = ['(', result, ')' + this.semicolon(flags)];
	            } else {
	                result.push(this.semicolon(flags));
	            }
	            return result;
	        },

	        ImportDeclaration: function (stmt, flags) {
	            // ES6: 15.2.1 valid import declarations:
	            //     - import ImportClause FromClause ;
	            //     - import ModuleSpecifier ;
	            var result, cursor, that = this;

	            // If no ImportClause is present,
	            // this should be `import ModuleSpecifier` so skip `from`
	            // ModuleSpecifier is StringLiteral.
	            if (stmt.specifiers.length === 0) {
	                // import ModuleSpecifier ;
	                return [
	                    'import',
	                    space,
	                    // ModuleSpecifier
	                    this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
	                    this.semicolon(flags)
	                ];
	            }

	            // import ImportClause FromClause ;
	            result = [
	                'import'
	            ];
	            cursor = 0;

	            // ImportedBinding
	            if (stmt.specifiers[cursor].type === Syntax.ImportDefaultSpecifier) {
	                result = join(result, [
	                        this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
	                ]);
	                ++cursor;
	            }

	            if (stmt.specifiers[cursor]) {
	                if (cursor !== 0) {
	                    result.push(',');
	                }

	                if (stmt.specifiers[cursor].type === Syntax.ImportNamespaceSpecifier) {
	                    // NameSpaceImport
	                    result = join(result, [
	                            space,
	                            this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT)
	                    ]);
	                } else {
	                    // NamedImports
	                    result.push(space + '{');

	                    if ((stmt.specifiers.length - cursor) === 1) {
	                        // import { ... } from "...";
	                        result.push(space);
	                        result.push(this.generateExpression(stmt.specifiers[cursor], Precedence.Sequence, E_TTT));
	                        result.push(space + '}' + space);
	                    } else {
	                        // import {
	                        //    ...,
	                        //    ...,
	                        // } from "...";
	                        withIndent(function (indent) {
	                            var i, iz;
	                            result.push(newline);
	                            for (i = cursor, iz = stmt.specifiers.length; i < iz; ++i) {
	                                result.push(indent);
	                                result.push(that.generateExpression(stmt.specifiers[i], Precedence.Sequence, E_TTT));
	                                if (i + 1 < iz) {
	                                    result.push(',' + newline);
	                                }
	                            }
	                        });
	                        if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                            result.push(newline);
	                        }
	                        result.push(base + '}' + space);
	                    }
	                }
	            }

	            result = join(result, [
	                'from' + space,
	                // ModuleSpecifier
	                this.generateExpression(stmt.source, Precedence.Sequence, E_TTT),
	                this.semicolon(flags)
	            ]);
	            return result;
	        },

	        VariableDeclarator: function (stmt, flags) {
	            var itemFlags = (flags & F_ALLOW_IN) ? E_TTT : E_FTT;
	            if (stmt.init) {
	                return [
	                    this.generateExpression(stmt.id, Precedence.Assignment, itemFlags),
	                    space,
	                    '=',
	                    space,
	                    this.generateExpression(stmt.init, Precedence.Assignment, itemFlags)
	                ];
	            }
	            return this.generatePattern(stmt.id, Precedence.Assignment, itemFlags);
	        },

	        VariableDeclaration: function (stmt, flags) {
	            // VariableDeclarator is typed as Statement,
	            // but joined with comma (not LineTerminator).
	            // So if comment is attached to target node, we should specialize.
	            var result, i, iz, node, bodyFlags, that = this;

	            result = [ stmt.kind ];

	            bodyFlags = (flags & F_ALLOW_IN) ? S_TFFF : S_FFFF;

	            function block() {
	                node = stmt.declarations[0];
	                if (extra.comment && node.leadingComments) {
	                    result.push('\n');
	                    result.push(addIndent(that.generateStatement(node, bodyFlags)));
	                } else {
	                    result.push(noEmptySpace());
	                    result.push(that.generateStatement(node, bodyFlags));
	                }

	                for (i = 1, iz = stmt.declarations.length; i < iz; ++i) {
	                    node = stmt.declarations[i];
	                    if (extra.comment && node.leadingComments) {
	                        result.push(',' + newline);
	                        result.push(addIndent(that.generateStatement(node, bodyFlags)));
	                    } else {
	                        result.push(',' + space);
	                        result.push(that.generateStatement(node, bodyFlags));
	                    }
	                }
	            }

	            if (stmt.declarations.length > 1) {
	                withIndent(block);
	            } else {
	                block();
	            }

	            result.push(this.semicolon(flags));

	            return result;
	        },

	        ThrowStatement: function (stmt, flags) {
	            return [join(
	                'throw',
	                this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
	            ), this.semicolon(flags)];
	        },

	        TryStatement: function (stmt, flags) {
	            var result, i, iz, guardedHandlers;

	            result = ['try', this.maybeBlock(stmt.block, S_TFFF)];
	            result = this.maybeBlockSuffix(stmt.block, result);

	            if (stmt.handlers) {
	                // old interface
	                for (i = 0, iz = stmt.handlers.length; i < iz; ++i) {
	                    result = join(result, this.generateStatement(stmt.handlers[i], S_TFFF));
	                    if (stmt.finalizer || i + 1 !== iz) {
	                        result = this.maybeBlockSuffix(stmt.handlers[i].body, result);
	                    }
	                }
	            } else {
	                guardedHandlers = stmt.guardedHandlers || [];

	                for (i = 0, iz = guardedHandlers.length; i < iz; ++i) {
	                    result = join(result, this.generateStatement(guardedHandlers[i], S_TFFF));
	                    if (stmt.finalizer || i + 1 !== iz) {
	                        result = this.maybeBlockSuffix(guardedHandlers[i].body, result);
	                    }
	                }

	                // new interface
	                if (stmt.handler) {
	                    if (isArray(stmt.handler)) {
	                        for (i = 0, iz = stmt.handler.length; i < iz; ++i) {
	                            result = join(result, this.generateStatement(stmt.handler[i], S_TFFF));
	                            if (stmt.finalizer || i + 1 !== iz) {
	                                result = this.maybeBlockSuffix(stmt.handler[i].body, result);
	                            }
	                        }
	                    } else {
	                        result = join(result, this.generateStatement(stmt.handler, S_TFFF));
	                        if (stmt.finalizer) {
	                            result = this.maybeBlockSuffix(stmt.handler.body, result);
	                        }
	                    }
	                }
	            }
	            if (stmt.finalizer) {
	                result = join(result, ['finally', this.maybeBlock(stmt.finalizer, S_TFFF)]);
	            }
	            return result;
	        },

	        SwitchStatement: function (stmt, flags) {
	            var result, fragment, i, iz, bodyFlags, that = this;
	            withIndent(function () {
	                result = [
	                    'switch' + space + '(',
	                    that.generateExpression(stmt.discriminant, Precedence.Sequence, E_TTT),
	                    ')' + space + '{' + newline
	                ];
	            });
	            if (stmt.cases) {
	                bodyFlags = S_TFFF;
	                for (i = 0, iz = stmt.cases.length; i < iz; ++i) {
	                    if (i === iz - 1) {
	                        bodyFlags |= F_SEMICOLON_OPT;
	                    }
	                    fragment = addIndent(this.generateStatement(stmt.cases[i], bodyFlags));
	                    result.push(fragment);
	                    if (!endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            }
	            result.push(addIndent('}'));
	            return result;
	        },

	        SwitchCase: function (stmt, flags) {
	            var result, fragment, i, iz, bodyFlags, that = this;
	            withIndent(function () {
	                if (stmt.test) {
	                    result = [
	                        join('case', that.generateExpression(stmt.test, Precedence.Sequence, E_TTT)),
	                        ':'
	                    ];
	                } else {
	                    result = ['default:'];
	                }

	                i = 0;
	                iz = stmt.consequent.length;
	                if (iz && stmt.consequent[0].type === Syntax.BlockStatement) {
	                    fragment = that.maybeBlock(stmt.consequent[0], S_TFFF);
	                    result.push(fragment);
	                    i = 1;
	                }

	                if (i !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                    result.push(newline);
	                }

	                bodyFlags = S_TFFF;
	                for (; i < iz; ++i) {
	                    if (i === iz - 1 && flags & F_SEMICOLON_OPT) {
	                        bodyFlags |= F_SEMICOLON_OPT;
	                    }
	                    fragment = addIndent(that.generateStatement(stmt.consequent[i], bodyFlags));
	                    result.push(fragment);
	                    if (i + 1 !== iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                        result.push(newline);
	                    }
	                }
	            });
	            return result;
	        },

	        IfStatement: function (stmt, flags) {
	            var result, bodyFlags, semicolonOptional, that = this;
	            withIndent(function () {
	                result = [
	                    'if' + space + '(',
	                    that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
	                    ')'
	                ];
	            });
	            semicolonOptional = flags & F_SEMICOLON_OPT;
	            bodyFlags = S_TFFF;
	            if (semicolonOptional) {
	                bodyFlags |= F_SEMICOLON_OPT;
	            }
	            if (stmt.alternate) {
	                result.push(this.maybeBlock(stmt.consequent, S_TFFF));
	                result = this.maybeBlockSuffix(stmt.consequent, result);
	                if (stmt.alternate.type === Syntax.IfStatement) {
	                    result = join(result, ['else ', this.generateStatement(stmt.alternate, bodyFlags)]);
	                } else {
	                    result = join(result, join('else', this.maybeBlock(stmt.alternate, bodyFlags)));
	                }
	            } else {
	                result.push(this.maybeBlock(stmt.consequent, bodyFlags));
	            }
	            return result;
	        },

	        ForStatement: function (stmt, flags) {
	            var result, that = this;
	            withIndent(function () {
	                result = ['for' + space + '('];
	                if (stmt.init) {
	                    if (stmt.init.type === Syntax.VariableDeclaration) {
	                        result.push(that.generateStatement(stmt.init, S_FFFF));
	                    } else {
	                        // F_ALLOW_IN becomes false.
	                        result.push(that.generateExpression(stmt.init, Precedence.Sequence, E_FTT));
	                        result.push(';');
	                    }
	                } else {
	                    result.push(';');
	                }

	                if (stmt.test) {
	                    result.push(space);
	                    result.push(that.generateExpression(stmt.test, Precedence.Sequence, E_TTT));
	                    result.push(';');
	                } else {
	                    result.push(';');
	                }

	                if (stmt.update) {
	                    result.push(space);
	                    result.push(that.generateExpression(stmt.update, Precedence.Sequence, E_TTT));
	                    result.push(')');
	                } else {
	                    result.push(')');
	                }
	            });

	            result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
	            return result;
	        },

	        ForInStatement: function (stmt, flags) {
	            return this.generateIterationForStatement('in', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
	        },

	        ForOfStatement: function (stmt, flags) {
	            return this.generateIterationForStatement('of', stmt, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF);
	        },

	        LabeledStatement: function (stmt, flags) {
	            return [stmt.label.name + ':', this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF)];
	        },

	        Program: function (stmt, flags) {
	            var result, fragment, i, iz, bodyFlags;
	            iz = stmt.body.length;
	            result = [safeConcatenation && iz > 0 ? '\n' : ''];
	            bodyFlags = S_TFTF;
	            for (i = 0; i < iz; ++i) {
	                if (!safeConcatenation && i === iz - 1) {
	                    bodyFlags |= F_SEMICOLON_OPT;
	                }

	                if (preserveBlankLines) {
	                    // handle spaces before the first line
	                    if (i === 0) {
	                        if (!stmt.body[0].leadingComments) {
	                            generateBlankLines(stmt.range[0], stmt.body[i].range[0], result);
	                        }
	                    }

	                    // handle spaces between lines
	                    if (i > 0) {
	                        if (!stmt.body[i - 1].trailingComments && !stmt.body[i].leadingComments) {
	                            generateBlankLines(stmt.body[i - 1].range[1], stmt.body[i].range[0], result);
	                        }
	                    }
	                }

	                fragment = addIndent(this.generateStatement(stmt.body[i], bodyFlags));
	                result.push(fragment);
	                if (i + 1 < iz && !endsWithLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                    if (preserveBlankLines) {
	                        if (!stmt.body[i + 1].leadingComments) {
	                            result.push(newline);
	                        }
	                    } else {
	                        result.push(newline);
	                    }
	                }

	                if (preserveBlankLines) {
	                    // handle spaces after the last line
	                    if (i === iz - 1) {
	                        if (!stmt.body[i].trailingComments) {
	                            generateBlankLines(stmt.body[i].range[1], stmt.range[1], result);
	                        }
	                    }
	                }
	            }
	            return result;
	        },

	        FunctionDeclaration: function (stmt, flags) {
	            return [
	                generateAsyncPrefix(stmt, true),
	                'function',
	                generateStarSuffix(stmt) || noEmptySpace(),
	                generateIdentifier(stmt.id),
	                this.generateFunctionBody(stmt)
	            ];
	        },

	        ReturnStatement: function (stmt, flags) {
	            if (stmt.argument) {
	                return [join(
	                    'return',
	                    this.generateExpression(stmt.argument, Precedence.Sequence, E_TTT)
	                ), this.semicolon(flags)];
	            }
	            return ['return' + this.semicolon(flags)];
	        },

	        WhileStatement: function (stmt, flags) {
	            var result, that = this;
	            withIndent(function () {
	                result = [
	                    'while' + space + '(',
	                    that.generateExpression(stmt.test, Precedence.Sequence, E_TTT),
	                    ')'
	                ];
	            });
	            result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
	            return result;
	        },

	        WithStatement: function (stmt, flags) {
	            var result, that = this;
	            withIndent(function () {
	                result = [
	                    'with' + space + '(',
	                    that.generateExpression(stmt.object, Precedence.Sequence, E_TTT),
	                    ')'
	                ];
	            });
	            result.push(this.maybeBlock(stmt.body, flags & F_SEMICOLON_OPT ? S_TFFT : S_TFFF));
	            return result;
	        }

	    };

	    merge(CodeGenerator.prototype, CodeGenerator.Statement);

	    // Expressions.

	    CodeGenerator.Expression = {

	        SequenceExpression: function (expr, precedence, flags) {
	            var result, i, iz;
	            if (Precedence.Sequence < precedence) {
	                flags |= F_ALLOW_IN;
	            }
	            result = [];
	            for (i = 0, iz = expr.expressions.length; i < iz; ++i) {
	                result.push(this.generateExpression(expr.expressions[i], Precedence.Assignment, flags));
	                if (i + 1 < iz) {
	                    result.push(',' + space);
	                }
	            }
	            return parenthesize(result, Precedence.Sequence, precedence);
	        },

	        AssignmentExpression: function (expr, precedence, flags) {
	            return this.generateAssignment(expr.left, expr.right, expr.operator, precedence, flags);
	        },

	        ArrowFunctionExpression: function (expr, precedence, flags) {
	            return parenthesize(this.generateFunctionBody(expr), Precedence.ArrowFunction, precedence);
	        },

	        ConditionalExpression: function (expr, precedence, flags) {
	            if (Precedence.Conditional < precedence) {
	                flags |= F_ALLOW_IN;
	            }
	            return parenthesize(
	                [
	                    this.generateExpression(expr.test, Precedence.LogicalOR, flags),
	                    space + '?' + space,
	                    this.generateExpression(expr.consequent, Precedence.Assignment, flags),
	                    space + ':' + space,
	                    this.generateExpression(expr.alternate, Precedence.Assignment, flags)
	                ],
	                Precedence.Conditional,
	                precedence
	            );
	        },

	        LogicalExpression: function (expr, precedence, flags) {
	            return this.BinaryExpression(expr, precedence, flags);
	        },

	        BinaryExpression: function (expr, precedence, flags) {
	            var result, currentPrecedence, fragment, leftSource;
	            currentPrecedence = BinaryPrecedence[expr.operator];

	            if (currentPrecedence < precedence) {
	                flags |= F_ALLOW_IN;
	            }

	            fragment = this.generateExpression(expr.left, currentPrecedence, flags);

	            leftSource = fragment.toString();

	            if (leftSource.charCodeAt(leftSource.length - 1) === 0x2F /* / */ && esutils.code.isIdentifierPartES5(expr.operator.charCodeAt(0))) {
	                result = [fragment, noEmptySpace(), expr.operator];
	            } else {
	                result = join(fragment, expr.operator);
	            }

	            fragment = this.generateExpression(expr.right, currentPrecedence + 1, flags);

	            if (expr.operator === '/' && fragment.toString().charAt(0) === '/' ||
	            expr.operator.slice(-1) === '<' && fragment.toString().slice(0, 3) === '!--') {
	                // If '/' concats with '/' or `<` concats with `!--`, it is interpreted as comment start
	                result.push(noEmptySpace());
	                result.push(fragment);
	            } else {
	                result = join(result, fragment);
	            }

	            if (expr.operator === 'in' && !(flags & F_ALLOW_IN)) {
	                return ['(', result, ')'];
	            }
	            return parenthesize(result, currentPrecedence, precedence);
	        },

	        CallExpression: function (expr, precedence, flags) {
	            var result, i, iz;
	            // F_ALLOW_UNPARATH_NEW becomes false.
	            result = [this.generateExpression(expr.callee, Precedence.Call, E_TTF)];
	            result.push('(');
	            for (i = 0, iz = expr['arguments'].length; i < iz; ++i) {
	                result.push(this.generateExpression(expr['arguments'][i], Precedence.Assignment, E_TTT));
	                if (i + 1 < iz) {
	                    result.push(',' + space);
	                }
	            }
	            result.push(')');

	            if (!(flags & F_ALLOW_CALL)) {
	                return ['(', result, ')'];
	            }
	            return parenthesize(result, Precedence.Call, precedence);
	        },

	        NewExpression: function (expr, precedence, flags) {
	            var result, length, i, iz, itemFlags;
	            length = expr['arguments'].length;

	            // F_ALLOW_CALL becomes false.
	            // F_ALLOW_UNPARATH_NEW may become false.
	            itemFlags = (flags & F_ALLOW_UNPARATH_NEW && !parentheses && length === 0) ? E_TFT : E_TFF;

	            result = join(
	                'new',
	                this.generateExpression(expr.callee, Precedence.New, itemFlags)
	            );

	            if (!(flags & F_ALLOW_UNPARATH_NEW) || parentheses || length > 0) {
	                result.push('(');
	                for (i = 0, iz = length; i < iz; ++i) {
	                    result.push(this.generateExpression(expr['arguments'][i], Precedence.Assignment, E_TTT));
	                    if (i + 1 < iz) {
	                        result.push(',' + space);
	                    }
	                }
	                result.push(')');
	            }

	            return parenthesize(result, Precedence.New, precedence);
	        },

	        MemberExpression: function (expr, precedence, flags) {
	            var result, fragment;

	            // F_ALLOW_UNPARATH_NEW becomes false.
	            result = [this.generateExpression(expr.object, Precedence.Call, (flags & F_ALLOW_CALL) ? E_TTF : E_TFF)];

	            if (expr.computed) {
	                result.push('[');
	                result.push(this.generateExpression(expr.property, Precedence.Sequence, flags & F_ALLOW_CALL ? E_TTT : E_TFT));
	                result.push(']');
	            } else {
	                if (expr.object.type === Syntax.Literal && typeof expr.object.value === 'number') {
	                    fragment = toSourceNodeWhenNeeded(result).toString();
	                    // When the following conditions are all true,
	                    //   1. No floating point
	                    //   2. Don't have exponents
	                    //   3. The last character is a decimal digit
	                    //   4. Not hexadecimal OR octal number literal
	                    // we should add a floating point.
	                    if (
	                            fragment.indexOf('.') < 0 &&
	                            !/[eExX]/.test(fragment) &&
	                            esutils.code.isDecimalDigit(fragment.charCodeAt(fragment.length - 1)) &&
	                            !(fragment.length >= 2 && fragment.charCodeAt(0) === 48)  // '0'
	                            ) {
	                        result.push('.');
	                    }
	                }
	                result.push('.');
	                result.push(generateIdentifier(expr.property));
	            }

	            return parenthesize(result, Precedence.Member, precedence);
	        },

	        UnaryExpression: function (expr, precedence, flags) {
	            var result, fragment, rightCharCode, leftSource, leftCharCode;
	            fragment = this.generateExpression(expr.argument, Precedence.Unary, E_TTT);

	            if (space === '') {
	                result = join(expr.operator, fragment);
	            } else {
	                result = [expr.operator];
	                if (expr.operator.length > 2) {
	                    // delete, void, typeof
	                    // get `typeof []`, not `typeof[]`
	                    result = join(result, fragment);
	                } else {
	                    // Prevent inserting spaces between operator and argument if it is unnecessary
	                    // like, `!cond`
	                    leftSource = toSourceNodeWhenNeeded(result).toString();
	                    leftCharCode = leftSource.charCodeAt(leftSource.length - 1);
	                    rightCharCode = fragment.toString().charCodeAt(0);

	                    if (((leftCharCode === 0x2B  /* + */ || leftCharCode === 0x2D  /* - */) && leftCharCode === rightCharCode) ||
	                            (esutils.code.isIdentifierPartES5(leftCharCode) && esutils.code.isIdentifierPartES5(rightCharCode))) {
	                        result.push(noEmptySpace());
	                        result.push(fragment);
	                    } else {
	                        result.push(fragment);
	                    }
	                }
	            }
	            return parenthesize(result, Precedence.Unary, precedence);
	        },

	        YieldExpression: function (expr, precedence, flags) {
	            var result;
	            if (expr.delegate) {
	                result = 'yield*';
	            } else {
	                result = 'yield';
	            }
	            if (expr.argument) {
	                result = join(
	                    result,
	                    this.generateExpression(expr.argument, Precedence.Yield, E_TTT)
	                );
	            }
	            return parenthesize(result, Precedence.Yield, precedence);
	        },

	        AwaitExpression: function (expr, precedence, flags) {
	            var result = join(
	                expr.all ? 'await*' : 'await',
	                this.generateExpression(expr.argument, Precedence.Await, E_TTT)
	            );
	            return parenthesize(result, Precedence.Await, precedence);
	        },

	        UpdateExpression: function (expr, precedence, flags) {
	            if (expr.prefix) {
	                return parenthesize(
	                    [
	                        expr.operator,
	                        this.generateExpression(expr.argument, Precedence.Unary, E_TTT)
	                    ],
	                    Precedence.Unary,
	                    precedence
	                );
	            }
	            return parenthesize(
	                [
	                    this.generateExpression(expr.argument, Precedence.Postfix, E_TTT),
	                    expr.operator
	                ],
	                Precedence.Postfix,
	                precedence
	            );
	        },

	        FunctionExpression: function (expr, precedence, flags) {
	            var result = [
	                generateAsyncPrefix(expr, true),
	                'function'
	            ];
	            if (expr.id) {
	                result.push(generateStarSuffix(expr) || noEmptySpace());
	                result.push(generateIdentifier(expr.id));
	            } else {
	                result.push(generateStarSuffix(expr) || space);
	            }
	            result.push(this.generateFunctionBody(expr));
	            return result;
	        },

	        ExportBatchSpecifier: function (expr, precedence, flags) {
	            return '*';
	        },

	        ArrayPattern: function (expr, precedence, flags) {
	            return this.ArrayExpression(expr, precedence, flags, true);
	        },

	        ArrayExpression: function (expr, precedence, flags, isPattern) {
	            var result, multiline, that = this;
	            if (!expr.elements.length) {
	                return '[]';
	            }
	            multiline = isPattern ? false : expr.elements.length > 1;
	            result = ['[', multiline ? newline : ''];
	            withIndent(function (indent) {
	                var i, iz;
	                for (i = 0, iz = expr.elements.length; i < iz; ++i) {
	                    if (!expr.elements[i]) {
	                        if (multiline) {
	                            result.push(indent);
	                        }
	                        if (i + 1 === iz) {
	                            result.push(',');
	                        }
	                    } else {
	                        result.push(multiline ? indent : '');
	                        result.push(that.generateExpression(expr.elements[i], Precedence.Assignment, E_TTT));
	                    }
	                    if (i + 1 < iz) {
	                        result.push(',' + (multiline ? newline : space));
	                    }
	                }
	            });
	            if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(multiline ? base : '');
	            result.push(']');
	            return result;
	        },

	        RestElement: function(expr, precedence, flags) {
	            return '...' + this.generatePattern(expr.argument);
	        },

	        ClassExpression: function (expr, precedence, flags) {
	            var result, fragment;
	            result = ['class'];
	            if (expr.id) {
	                result = join(result, this.generateExpression(expr.id, Precedence.Sequence, E_TTT));
	            }
	            if (expr.superClass) {
	                fragment = join('extends', this.generateExpression(expr.superClass, Precedence.Assignment, E_TTT));
	                result = join(result, fragment);
	            }
	            result.push(space);
	            result.push(this.generateStatement(expr.body, S_TFFT));
	            return result;
	        },

	        MethodDefinition: function (expr, precedence, flags) {
	            var result, fragment;
	            if (expr['static']) {
	                result = ['static' + space];
	            } else {
	                result = [];
	            }
	            if (expr.kind === 'get' || expr.kind === 'set') {
	                fragment = [
	                    join(expr.kind, this.generatePropertyKey(expr.key, expr.computed)),
	                    this.generateFunctionBody(expr.value)
	                ];
	            } else {
	                fragment = [
	                    generateMethodPrefix(expr),
	                    this.generatePropertyKey(expr.key, expr.computed),
	                    this.generateFunctionBody(expr.value)
	                ];
	            }
	            return join(result, fragment);
	        },

	        Property: function (expr, precedence, flags) {
	            if (expr.kind === 'get' || expr.kind === 'set') {
	                return [
	                    expr.kind, noEmptySpace(),
	                    this.generatePropertyKey(expr.key, expr.computed),
	                    this.generateFunctionBody(expr.value)
	                ];
	            }

	            if (expr.shorthand) {
	                return this.generatePropertyKey(expr.key, expr.computed);
	            }

	            if (expr.method) {
	                return [
	                    generateMethodPrefix(expr),
	                    this.generatePropertyKey(expr.key, expr.computed),
	                    this.generateFunctionBody(expr.value)
	                ];
	            }

	            return [
	                this.generatePropertyKey(expr.key, expr.computed),
	                ':' + space,
	                this.generateExpression(expr.value, Precedence.Assignment, E_TTT)
	            ];
	        },

	        ObjectExpression: function (expr, precedence, flags) {
	            var multiline, result, fragment, that = this;

	            if (!expr.properties.length) {
	                return '{}';
	            }
	            multiline = expr.properties.length > 1;

	            withIndent(function () {
	                fragment = that.generateExpression(expr.properties[0], Precedence.Sequence, E_TTT);
	            });

	            if (!multiline) {
	                // issues 4
	                // Do not transform from
	                //   dejavu.Class.declare({
	                //       method2: function () {}
	                //   });
	                // to
	                //   dejavu.Class.declare({method2: function () {
	                //       }});
	                if (!hasLineTerminator(toSourceNodeWhenNeeded(fragment).toString())) {
	                    return [ '{', space, fragment, space, '}' ];
	                }
	            }

	            withIndent(function (indent) {
	                var i, iz;
	                result = [ '{', newline, indent, fragment ];

	                if (multiline) {
	                    result.push(',' + newline);
	                    for (i = 1, iz = expr.properties.length; i < iz; ++i) {
	                        result.push(indent);
	                        result.push(that.generateExpression(expr.properties[i], Precedence.Sequence, E_TTT));
	                        if (i + 1 < iz) {
	                            result.push(',' + newline);
	                        }
	                    }
	                }
	            });

	            if (!endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(base);
	            result.push('}');
	            return result;
	        },

	        ObjectPattern: function (expr, precedence, flags) {
	            var result, i, iz, multiline, property, that = this;
	            if (!expr.properties.length) {
	                return '{}';
	            }

	            multiline = false;
	            if (expr.properties.length === 1) {
	                property = expr.properties[0];
	                if (property.value.type !== Syntax.Identifier) {
	                    multiline = true;
	                }
	            } else {
	                for (i = 0, iz = expr.properties.length; i < iz; ++i) {
	                    property = expr.properties[i];
	                    if (!property.shorthand) {
	                        multiline = true;
	                        break;
	                    }
	                }
	            }
	            result = ['{', multiline ? newline : '' ];

	            withIndent(function (indent) {
	                var i, iz;
	                for (i = 0, iz = expr.properties.length; i < iz; ++i) {
	                    result.push(multiline ? indent : '');
	                    result.push(that.generateExpression(expr.properties[i], Precedence.Sequence, E_TTT));
	                    if (i + 1 < iz) {
	                        result.push(',' + (multiline ? newline : space));
	                    }
	                }
	            });

	            if (multiline && !endsWithLineTerminator(toSourceNodeWhenNeeded(result).toString())) {
	                result.push(newline);
	            }
	            result.push(multiline ? base : '');
	            result.push('}');
	            return result;
	        },

	        ThisExpression: function (expr, precedence, flags) {
	            return 'this';
	        },

	        Super: function (expr, precedence, flags) {
	            return 'super';
	        },

	        Identifier: function (expr, precedence, flags) {
	            return generateIdentifier(expr);
	        },

	        ImportDefaultSpecifier: function (expr, precedence, flags) {
	            return generateIdentifier(expr.id || expr.local);
	        },

	        ImportNamespaceSpecifier: function (expr, precedence, flags) {
	            var result = ['*'];
	            var id = expr.id || expr.local;
	            if (id) {
	                result.push(space + 'as' + noEmptySpace() + generateIdentifier(id));
	            }
	            return result;
	        },

	        ImportSpecifier: function (expr, precedence, flags) {
	            return this.ExportSpecifier(expr, precedence, flags);
	        },

	        ExportSpecifier: function (expr, precedence, flags) {
	            var result = [ (expr.id || expr.local).name ];
	            if (expr.name) {
	                result.push(noEmptySpace() + 'as' + noEmptySpace() + generateIdentifier(expr.name));
	            }
	            return result;
	        },

	        Literal: function (expr, precedence, flags) {
	            var raw;
	            if (expr.hasOwnProperty('raw') && parse && extra.raw) {
	                try {
	                    raw = parse(expr.raw).body[0].expression;
	                    if (raw.type === Syntax.Literal) {
	                        if (raw.value === expr.value) {
	                            return expr.raw;
	                        }
	                    }
	                } catch (e) {
	                    // not use raw property
	                }
	            }

	            if (expr.value === null) {
	                return 'null';
	            }

	            if (typeof expr.value === 'string') {
	                return escapeString(expr.value);
	            }

	            if (typeof expr.value === 'number') {
	                return generateNumber(expr.value);
	            }

	            if (typeof expr.value === 'boolean') {
	                return expr.value ? 'true' : 'false';
	            }

	            return generateRegExp(expr.value);
	        },

	        GeneratorExpression: function (expr, precedence, flags) {
	            return this.ComprehensionExpression(expr, precedence, flags);
	        },

	        ComprehensionExpression: function (expr, precedence, flags) {
	            // GeneratorExpression should be parenthesized with (...), ComprehensionExpression with [...]
	            // Due to https://bugzilla.mozilla.org/show_bug.cgi?id=883468 position of expr.body can differ in Spidermonkey and ES6

	            var result, i, iz, fragment, that = this;
	            result = (expr.type === Syntax.GeneratorExpression) ? ['('] : ['['];

	            if (extra.moz.comprehensionExpressionStartsWithAssignment) {
	                fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);
	                result.push(fragment);
	            }

	            if (expr.blocks) {
	                withIndent(function () {
	                    for (i = 0, iz = expr.blocks.length; i < iz; ++i) {
	                        fragment = that.generateExpression(expr.blocks[i], Precedence.Sequence, E_TTT);
	                        if (i > 0 || extra.moz.comprehensionExpressionStartsWithAssignment) {
	                            result = join(result, fragment);
	                        } else {
	                            result.push(fragment);
	                        }
	                    }
	                });
	            }

	            if (expr.filter) {
	                result = join(result, 'if' + space);
	                fragment = this.generateExpression(expr.filter, Precedence.Sequence, E_TTT);
	                result = join(result, [ '(', fragment, ')' ]);
	            }

	            if (!extra.moz.comprehensionExpressionStartsWithAssignment) {
	                fragment = this.generateExpression(expr.body, Precedence.Assignment, E_TTT);

	                result = join(result, fragment);
	            }

	            result.push((expr.type === Syntax.GeneratorExpression) ? ')' : ']');
	            return result;
	        },

	        ComprehensionBlock: function (expr, precedence, flags) {
	            var fragment;
	            if (expr.left.type === Syntax.VariableDeclaration) {
	                fragment = [
	                    expr.left.kind, noEmptySpace(),
	                    this.generateStatement(expr.left.declarations[0], S_FFFF)
	                ];
	            } else {
	                fragment = this.generateExpression(expr.left, Precedence.Call, E_TTT);
	            }

	            fragment = join(fragment, expr.of ? 'of' : 'in');
	            fragment = join(fragment, this.generateExpression(expr.right, Precedence.Sequence, E_TTT));

	            return [ 'for' + space + '(', fragment, ')' ];
	        },

	        SpreadElement: function (expr, precedence, flags) {
	            return [
	                '...',
	                this.generateExpression(expr.argument, Precedence.Assignment, E_TTT)
	            ];
	        },

	        TaggedTemplateExpression: function (expr, precedence, flags) {
	            var itemFlags = E_TTF;
	            if (!(flags & F_ALLOW_CALL)) {
	                itemFlags = E_TFF;
	            }
	            var result = [
	                this.generateExpression(expr.tag, Precedence.Call, itemFlags),
	                this.generateExpression(expr.quasi, Precedence.Primary, E_FFT)
	            ];
	            return parenthesize(result, Precedence.TaggedTemplate, precedence);
	        },

	        TemplateElement: function (expr, precedence, flags) {
	            // Don't use "cooked". Since tagged template can use raw template
	            // representation. So if we do so, it breaks the script semantics.
	            return expr.value.raw;
	        },

	        TemplateLiteral: function (expr, precedence, flags) {
	            var result, i, iz;
	            result = [ '`' ];
	            for (i = 0, iz = expr.quasis.length; i < iz; ++i) {
	                result.push(this.generateExpression(expr.quasis[i], Precedence.Primary, E_TTT));
	                if (i + 1 < iz) {
	                    result.push('${' + space);
	                    result.push(this.generateExpression(expr.expressions[i], Precedence.Sequence, E_TTT));
	                    result.push(space + '}');
	                }
	            }
	            result.push('`');
	            return result;
	        },

	        ModuleSpecifier: function (expr, precedence, flags) {
	            return this.Literal(expr, precedence, flags);
	        }

	    };

	    merge(CodeGenerator.prototype, CodeGenerator.Expression);

	    CodeGenerator.prototype.generateExpression = function (expr, precedence, flags) {
	        var result, type;

	        type = expr.type || Syntax.Property;

	        if (extra.verbatim && expr.hasOwnProperty(extra.verbatim)) {
	            return generateVerbatim(expr, precedence);
	        }

	        result = this[type](expr, precedence, flags);


	        if (extra.comment) {
	            result = addComments(expr, result);
	        }
	        return toSourceNodeWhenNeeded(result, expr);
	    };

	    CodeGenerator.prototype.generateStatement = function (stmt, flags) {
	        var result,
	            fragment;

	        result = this[stmt.type](stmt, flags);

	        // Attach comments

	        if (extra.comment) {
	            result = addComments(stmt, result);
	        }

	        fragment = toSourceNodeWhenNeeded(result).toString();
	        if (stmt.type === Syntax.Program && !safeConcatenation && newline === '' &&  fragment.charAt(fragment.length - 1) === '\n') {
	            result = sourceMap ? toSourceNodeWhenNeeded(result).replaceRight(/\s+$/, '') : fragment.replace(/\s+$/, '');
	        }

	        return toSourceNodeWhenNeeded(result, stmt);
	    };

	    function generateInternal(node) {
	        var codegen;

	        codegen = new CodeGenerator();
	        if (isStatement(node)) {
	            return codegen.generateStatement(node, S_TFFF);
	        }

	        if (isExpression(node)) {
	            return codegen.generateExpression(node, Precedence.Sequence, E_TTT);
	        }

	        throw new Error('Unknown node type: ' + node.type);
	    }

	    function generate(node, options) {
	        var defaultOptions = getDefaultOptions(), result, pair;

	        if (options != null) {
	            // Obsolete options
	            //
	            //   `options.indent`
	            //   `options.base`
	            //
	            // Instead of them, we can use `option.format.indent`.
	            if (typeof options.indent === 'string') {
	                defaultOptions.format.indent.style = options.indent;
	            }
	            if (typeof options.base === 'number') {
	                defaultOptions.format.indent.base = options.base;
	            }
	            options = updateDeeply(defaultOptions, options);
	            indent = options.format.indent.style;
	            if (typeof options.base === 'string') {
	                base = options.base;
	            } else {
	                base = stringRepeat(indent, options.format.indent.base);
	            }
	        } else {
	            options = defaultOptions;
	            indent = options.format.indent.style;
	            base = stringRepeat(indent, options.format.indent.base);
	        }
	        json = options.format.json;
	        renumber = options.format.renumber;
	        hexadecimal = json ? false : options.format.hexadecimal;
	        quotes = json ? 'double' : options.format.quotes;
	        escapeless = options.format.escapeless;
	        newline = options.format.newline;
	        space = options.format.space;
	        if (options.format.compact) {
	            newline = space = indent = base = '';
	        }
	        parentheses = options.format.parentheses;
	        semicolons = options.format.semicolons;
	        safeConcatenation = options.format.safeConcatenation;
	        directive = options.directive;
	        parse = json ? null : options.parse;
	        sourceMap = options.sourceMap;
	        sourceCode = options.sourceCode;
	        preserveBlankLines = options.format.preserveBlankLines && sourceCode !== null;
	        extra = options;

	        if (sourceMap) {
	            if (!exports.browser) {
	                // We assume environment is node.js
	                // And prevent from including source-map by browserify
	                SourceNode = __webpack_require__(46).SourceNode;
	            } else {
	                SourceNode = global.sourceMap.SourceNode;
	            }
	        }

	        result = generateInternal(node);

	        if (!sourceMap) {
	            pair = {code: result.toString(), map: null};
	            return options.sourceMapWithCode ? pair : pair.code;
	        }


	        pair = result.toStringWithSourceMap({
	            file: options.file,
	            sourceRoot: options.sourceMapRoot
	        });

	        if (options.sourceContent) {
	            pair.map.setSourceContent(options.sourceMap,
	                                      options.sourceContent);
	        }

	        if (options.sourceMapWithCode) {
	            return pair;
	        }

	        return pair.map.toString();
	    }

	    FORMAT_MINIFY = {
	        indent: {
	            style: '',
	            base: 0
	        },
	        renumber: true,
	        hexadecimal: true,
	        quotes: 'auto',
	        escapeless: true,
	        compact: true,
	        parentheses: false,
	        semicolons: false
	    };

	    FORMAT_DEFAULTS = getDefaultOptions().format;

	    exports.version = __webpack_require__(58).version;
	    exports.generate = generate;
	    exports.attachComments = estraverse.attachComments;
	    exports.Precedence = updateDeeply({}, Precedence);
	    exports.browser = false;
	    exports.FORMAT_MINIFY = FORMAT_MINIFY;
	    exports.FORMAT_DEFAULTS = FORMAT_DEFAULTS;
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	/*jslint vars:false, bitwise:true*/
	/*jshint indent:4*/
	/*global exports:true, define:true*/
	(function (root, factory) {
	    'use strict';

	    // Universal Module Definition (UMD) to support AMD, CommonJS/Node.js,
	    // and plain browser loading,
	    if (true) {
	        !(__WEBPACK_AMD_DEFINE_ARRAY__ = [exports], __WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof exports !== 'undefined') {
	        factory(exports);
	    } else {
	        factory((root.estraverse = {}));
	    }
	}(this, function clone(exports) {
	    'use strict';

	    var Syntax,
	        isArray,
	        VisitorOption,
	        VisitorKeys,
	        objectCreate,
	        objectKeys,
	        BREAK,
	        SKIP,
	        REMOVE;

	    function ignoreJSHintError() { }

	    isArray = Array.isArray;
	    if (!isArray) {
	        isArray = function isArray(array) {
	            return Object.prototype.toString.call(array) === '[object Array]';
	        };
	    }

	    function deepCopy(obj) {
	        var ret = {}, key, val;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                val = obj[key];
	                if (typeof val === 'object' && val !== null) {
	                    ret[key] = deepCopy(val);
	                } else {
	                    ret[key] = val;
	                }
	            }
	        }
	        return ret;
	    }

	    function shallowCopy(obj) {
	        var ret = {}, key;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                ret[key] = obj[key];
	            }
	        }
	        return ret;
	    }
	    ignoreJSHintError(shallowCopy);

	    // based on LLVM libc++ upper_bound / lower_bound
	    // MIT License

	    function upperBound(array, func) {
	        var diff, len, i, current;

	        len = array.length;
	        i = 0;

	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                len = diff;
	            } else {
	                i = current + 1;
	                len -= diff + 1;
	            }
	        }
	        return i;
	    }

	    function lowerBound(array, func) {
	        var diff, len, i, current;

	        len = array.length;
	        i = 0;

	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                i = current + 1;
	                len -= diff + 1;
	            } else {
	                len = diff;
	            }
	        }
	        return i;
	    }
	    ignoreJSHintError(lowerBound);

	    objectCreate = Object.create || (function () {
	        function F() { }

	        return function (o) {
	            F.prototype = o;
	            return new F();
	        };
	    })();

	    objectKeys = Object.keys || function (o) {
	        var keys = [], key;
	        for (key in o) {
	            keys.push(key);
	        }
	        return keys;
	    };

	    function extend(to, from) {
	        var keys = objectKeys(from), key, i, len;
	        for (i = 0, len = keys.length; i < len; i += 1) {
	            key = keys[i];
	            to[key] = from[key];
	        }
	        return to;
	    }

	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
	        ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        DirectiveStatement: 'DirectiveStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExportBatchSpecifier: 'ExportBatchSpecifier',
	        ExportDeclaration: 'ExportDeclaration',
	        ExportSpecifier: 'ExportSpecifier',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        ForOfStatement: 'ForOfStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        ImportDeclaration: 'ImportDeclaration',
	        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
	        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
	        ImportSpecifier: 'ImportSpecifier',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MethodDefinition: 'MethodDefinition',
	        ModuleSpecifier: 'ModuleSpecifier',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        Program: 'Program',
	        Property: 'Property',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SpreadElement: 'SpreadElement',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        TaggedTemplateExpression: 'TaggedTemplateExpression',
	        TemplateElement: 'TemplateElement',
	        TemplateLiteral: 'TemplateLiteral',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        YieldExpression: 'YieldExpression'
	    };

	    VisitorKeys = {
	        AssignmentExpression: ['left', 'right'],
	        ArrayExpression: ['elements'],
	        ArrayPattern: ['elements'],
	        ArrowFunctionExpression: ['params', 'defaults', 'rest', 'body'],
	        AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
	        BlockStatement: ['body'],
	        BinaryExpression: ['left', 'right'],
	        BreakStatement: ['label'],
	        CallExpression: ['callee', 'arguments'],
	        CatchClause: ['param', 'body'],
	        ClassBody: ['body'],
	        ClassDeclaration: ['id', 'body', 'superClass'],
	        ClassExpression: ['id', 'body', 'superClass'],
	        ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
	        ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
	        ConditionalExpression: ['test', 'consequent', 'alternate'],
	        ContinueStatement: ['label'],
	        DebuggerStatement: [],
	        DirectiveStatement: [],
	        DoWhileStatement: ['body', 'test'],
	        EmptyStatement: [],
	        ExportBatchSpecifier: [],
	        ExportDeclaration: ['declaration', 'specifiers', 'source'],
	        ExportSpecifier: ['id', 'name'],
	        ExpressionStatement: ['expression'],
	        ForStatement: ['init', 'test', 'update', 'body'],
	        ForInStatement: ['left', 'right', 'body'],
	        ForOfStatement: ['left', 'right', 'body'],
	        FunctionDeclaration: ['id', 'params', 'defaults', 'rest', 'body'],
	        FunctionExpression: ['id', 'params', 'defaults', 'rest', 'body'],
	        GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
	        Identifier: [],
	        IfStatement: ['test', 'consequent', 'alternate'],
	        ImportDeclaration: ['specifiers', 'source'],
	        ImportDefaultSpecifier: ['id'],
	        ImportNamespaceSpecifier: ['id'],
	        ImportSpecifier: ['id', 'name'],
	        Literal: [],
	        LabeledStatement: ['label', 'body'],
	        LogicalExpression: ['left', 'right'],
	        MemberExpression: ['object', 'property'],
	        MethodDefinition: ['key', 'value'],
	        ModuleSpecifier: [],
	        NewExpression: ['callee', 'arguments'],
	        ObjectExpression: ['properties'],
	        ObjectPattern: ['properties'],
	        Program: ['body'],
	        Property: ['key', 'value'],
	        ReturnStatement: ['argument'],
	        SequenceExpression: ['expressions'],
	        SpreadElement: ['argument'],
	        SwitchStatement: ['discriminant', 'cases'],
	        SwitchCase: ['test', 'consequent'],
	        TaggedTemplateExpression: ['tag', 'quasi'],
	        TemplateElement: [],
	        TemplateLiteral: ['quasis', 'expressions'],
	        ThisExpression: [],
	        ThrowStatement: ['argument'],
	        TryStatement: ['block', 'handlers', 'handler', 'guardedHandlers', 'finalizer'],
	        UnaryExpression: ['argument'],
	        UpdateExpression: ['argument'],
	        VariableDeclaration: ['declarations'],
	        VariableDeclarator: ['id', 'init'],
	        WhileStatement: ['test', 'body'],
	        WithStatement: ['object', 'body'],
	        YieldExpression: ['argument']
	    };

	    // unique id
	    BREAK = {};
	    SKIP = {};
	    REMOVE = {};

	    VisitorOption = {
	        Break: BREAK,
	        Skip: SKIP,
	        Remove: REMOVE
	    };

	    function Reference(parent, key) {
	        this.parent = parent;
	        this.key = key;
	    }

	    Reference.prototype.replace = function replace(node) {
	        this.parent[this.key] = node;
	    };

	    Reference.prototype.remove = function remove() {
	        if (isArray(this.parent)) {
	            this.parent.splice(this.key, 1);
	            return true;
	        } else {
	            this.replace(null);
	            return false;
	        }
	    };

	    function Element(node, path, wrap, ref) {
	        this.node = node;
	        this.path = path;
	        this.wrap = wrap;
	        this.ref = ref;
	    }

	    function Controller() { }

	    // API:
	    // return property path array from root to current node
	    Controller.prototype.path = function path() {
	        var i, iz, j, jz, result, element;

	        function addToPath(result, path) {
	            if (isArray(path)) {
	                for (j = 0, jz = path.length; j < jz; ++j) {
	                    result.push(path[j]);
	                }
	            } else {
	                result.push(path);
	            }
	        }

	        // root node
	        if (!this.__current.path) {
	            return null;
	        }

	        // first node is sentinel, second node is root element
	        result = [];
	        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
	            element = this.__leavelist[i];
	            addToPath(result, element.path);
	        }
	        addToPath(result, this.__current.path);
	        return result;
	    };

	    // API:
	    // return type of current node
	    Controller.prototype.type = function () {
	        var node = this.current();
	        return node.type || this.__current.wrap;
	    };

	    // API:
	    // return array of parent elements
	    Controller.prototype.parents = function parents() {
	        var i, iz, result;

	        // first node is sentinel
	        result = [];
	        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
	            result.push(this.__leavelist[i].node);
	        }

	        return result;
	    };

	    // API:
	    // return current node
	    Controller.prototype.current = function current() {
	        return this.__current.node;
	    };

	    Controller.prototype.__execute = function __execute(callback, element) {
	        var previous, result;

	        result = undefined;

	        previous  = this.__current;
	        this.__current = element;
	        this.__state = null;
	        if (callback) {
	            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
	        }
	        this.__current = previous;

	        return result;
	    };

	    // API:
	    // notify control skip / break
	    Controller.prototype.notify = function notify(flag) {
	        this.__state = flag;
	    };

	    // API:
	    // skip child nodes of current node
	    Controller.prototype.skip = function () {
	        this.notify(SKIP);
	    };

	    // API:
	    // break traversals
	    Controller.prototype['break'] = function () {
	        this.notify(BREAK);
	    };

	    // API:
	    // remove node
	    Controller.prototype.remove = function () {
	        this.notify(REMOVE);
	    };

	    Controller.prototype.__initialize = function(root, visitor) {
	        this.visitor = visitor;
	        this.root = root;
	        this.__worklist = [];
	        this.__leavelist = [];
	        this.__current = null;
	        this.__state = null;
	        this.__fallback = visitor.fallback === 'iteration';
	        this.__keys = VisitorKeys;
	        if (visitor.keys) {
	            this.__keys = extend(objectCreate(this.__keys), visitor.keys);
	        }
	    };

	    function isNode(node) {
	        if (node == null) {
	            return false;
	        }
	        return typeof node === 'object' && typeof node.type === 'string';
	    }

	    function isProperty(nodeType, key) {
	        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
	    }

	    Controller.prototype.traverse = function traverse(root, visitor) {
	        var worklist,
	            leavelist,
	            element,
	            node,
	            nodeType,
	            ret,
	            key,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel;

	        this.__initialize(root, visitor);

	        sentinel = {};

	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;

	        // initialize
	        worklist.push(new Element(root, null, null, null));
	        leavelist.push(new Element(null, null, null, null));

	        while (worklist.length) {
	            element = worklist.pop();

	            if (element === sentinel) {
	                element = leavelist.pop();

	                ret = this.__execute(visitor.leave, element);

	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }
	                continue;
	            }

	            if (element.node) {

	                ret = this.__execute(visitor.enter, element);

	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }

	                worklist.push(sentinel);
	                leavelist.push(element);

	                if (this.__state === SKIP || ret === SKIP) {
	                    continue;
	                }

	                node = element.node;
	                nodeType = element.wrap || node.type;
	                candidates = this.__keys[nodeType];
	                if (!candidates) {
	                    if (this.__fallback) {
	                        candidates = objectKeys(node);
	                    } else {
	                        throw new Error('Unknown node type ' + nodeType + '.');
	                    }
	                }

	                current = candidates.length;
	                while ((current -= 1) >= 0) {
	                    key = candidates[current];
	                    candidate = node[key];
	                    if (!candidate) {
	                        continue;
	                    }

	                    if (isArray(candidate)) {
	                        current2 = candidate.length;
	                        while ((current2 -= 1) >= 0) {
	                            if (!candidate[current2]) {
	                                continue;
	                            }
	                            if (isProperty(nodeType, candidates[current])) {
	                                element = new Element(candidate[current2], [key, current2], 'Property', null);
	                            } else if (isNode(candidate[current2])) {
	                                element = new Element(candidate[current2], [key, current2], null, null);
	                            } else {
	                                continue;
	                            }
	                            worklist.push(element);
	                        }
	                    } else if (isNode(candidate)) {
	                        worklist.push(new Element(candidate, key, null, null));
	                    }
	                }
	            }
	        }
	    };

	    Controller.prototype.replace = function replace(root, visitor) {
	        function removeElem(element) {
	            var i,
	                key,
	                nextElem,
	                parent;

	            if (element.ref.remove()) {
	                // When the reference is an element of an array.
	                key = element.ref.key;
	                parent = element.ref.parent;

	                // If removed from array, then decrease following items' keys.
	                i = worklist.length;
	                while (i--) {
	                    nextElem = worklist[i];
	                    if (nextElem.ref && nextElem.ref.parent === parent) {
	                        if  (nextElem.ref.key < key) {
	                            break;
	                        }
	                        --nextElem.ref.key;
	                    }
	                }
	            }
	        }

	        var worklist,
	            leavelist,
	            node,
	            nodeType,
	            target,
	            element,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel,
	            outer,
	            key;

	        this.__initialize(root, visitor);

	        sentinel = {};

	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;

	        // initialize
	        outer = {
	            root: root
	        };
	        element = new Element(root, null, null, new Reference(outer, 'root'));
	        worklist.push(element);
	        leavelist.push(element);

	        while (worklist.length) {
	            element = worklist.pop();

	            if (element === sentinel) {
	                element = leavelist.pop();

	                target = this.__execute(visitor.leave, element);

	                // node may be replaced with null,
	                // so distinguish between undefined and null in this place
	                if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
	                    // replace
	                    element.ref.replace(target);
	                }

	                if (this.__state === REMOVE || target === REMOVE) {
	                    removeElem(element);
	                }

	                if (this.__state === BREAK || target === BREAK) {
	                    return outer.root;
	                }
	                continue;
	            }

	            target = this.__execute(visitor.enter, element);

	            // node may be replaced with null,
	            // so distinguish between undefined and null in this place
	            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
	                // replace
	                element.ref.replace(target);
	                element.node = target;
	            }

	            if (this.__state === REMOVE || target === REMOVE) {
	                removeElem(element);
	                element.node = null;
	            }

	            if (this.__state === BREAK || target === BREAK) {
	                return outer.root;
	            }

	            // node may be null
	            node = element.node;
	            if (!node) {
	                continue;
	            }

	            worklist.push(sentinel);
	            leavelist.push(element);

	            if (this.__state === SKIP || target === SKIP) {
	                continue;
	            }

	            nodeType = element.wrap || node.type;
	            candidates = this.__keys[nodeType];
	            if (!candidates) {
	                if (this.__fallback) {
	                    candidates = objectKeys(node);
	                } else {
	                    throw new Error('Unknown node type ' + nodeType + '.');
	                }
	            }

	            current = candidates.length;
	            while ((current -= 1) >= 0) {
	                key = candidates[current];
	                candidate = node[key];
	                if (!candidate) {
	                    continue;
	                }

	                if (isArray(candidate)) {
	                    current2 = candidate.length;
	                    while ((current2 -= 1) >= 0) {
	                        if (!candidate[current2]) {
	                            continue;
	                        }
	                        if (isProperty(nodeType, candidates[current])) {
	                            element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
	                        } else if (isNode(candidate[current2])) {
	                            element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
	                        } else {
	                            continue;
	                        }
	                        worklist.push(element);
	                    }
	                } else if (isNode(candidate)) {
	                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
	                }
	            }
	        }

	        return outer.root;
	    };

	    function traverse(root, visitor) {
	        var controller = new Controller();
	        return controller.traverse(root, visitor);
	    }

	    function replace(root, visitor) {
	        var controller = new Controller();
	        return controller.replace(root, visitor);
	    }

	    function extendCommentRange(comment, tokens) {
	        var target;

	        target = upperBound(tokens, function search(token) {
	            return token.range[0] > comment.range[0];
	        });

	        comment.extendedRange = [comment.range[0], comment.range[1]];

	        if (target !== tokens.length) {
	            comment.extendedRange[1] = tokens[target].range[0];
	        }

	        target -= 1;
	        if (target >= 0) {
	            comment.extendedRange[0] = tokens[target].range[1];
	        }

	        return comment;
	    }

	    function attachComments(tree, providedComments, tokens) {
	        // At first, we should calculate extended comment ranges.
	        var comments = [], comment, len, i, cursor;

	        if (!tree.range) {
	            throw new Error('attachComments needs range information');
	        }

	        // tokens array is empty, we attach comments to tree as 'leadingComments'
	        if (!tokens.length) {
	            if (providedComments.length) {
	                for (i = 0, len = providedComments.length; i < len; i += 1) {
	                    comment = deepCopy(providedComments[i]);
	                    comment.extendedRange = [0, tree.range[0]];
	                    comments.push(comment);
	                }
	                tree.leadingComments = comments;
	            }
	            return tree;
	        }

	        for (i = 0, len = providedComments.length; i < len; i += 1) {
	            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
	        }

	        // This is based on John Freeman's implementation.
	        cursor = 0;
	        traverse(tree, {
	            enter: function (node) {
	                var comment;

	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (comment.extendedRange[1] > node.range[0]) {
	                        break;
	                    }

	                    if (comment.extendedRange[1] === node.range[0]) {
	                        if (!node.leadingComments) {
	                            node.leadingComments = [];
	                        }
	                        node.leadingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }

	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }

	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });

	        cursor = 0;
	        traverse(tree, {
	            leave: function (node) {
	                var comment;

	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (node.range[1] < comment.extendedRange[0]) {
	                        break;
	                    }

	                    if (node.range[1] === comment.extendedRange[0]) {
	                        if (!node.trailingComments) {
	                            node.trailingComments = [];
	                        }
	                        node.trailingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }

	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }

	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });

	        return tree;
	    }

	    exports.version = '1.8.1-dev';
	    exports.Syntax = Syntax;
	    exports.traverse = traverse;
	    exports.replace = replace;
	    exports.attachComments = attachComments;
	    exports.VisitorKeys = VisitorKeys;
	    exports.VisitorOption = VisitorOption;
	    exports.Controller = Controller;
	    exports.cloneEnvironment = function () { return clone({}); };

	    return exports;
	}));
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/


	(function () {
	    'use strict';

	    exports.ast = __webpack_require__(43);
	    exports.code = __webpack_require__(44);
	    exports.keyword = __webpack_require__(45);
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 43 */
/***/ function(module, exports) {

	/*
	  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS 'AS IS'
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function () {
	    'use strict';

	    function isExpression(node) {
	        if (node == null) { return false; }
	        switch (node.type) {
	            case 'ArrayExpression':
	            case 'AssignmentExpression':
	            case 'BinaryExpression':
	            case 'CallExpression':
	            case 'ConditionalExpression':
	            case 'FunctionExpression':
	            case 'Identifier':
	            case 'Literal':
	            case 'LogicalExpression':
	            case 'MemberExpression':
	            case 'NewExpression':
	            case 'ObjectExpression':
	            case 'SequenceExpression':
	            case 'ThisExpression':
	            case 'UnaryExpression':
	            case 'UpdateExpression':
	                return true;
	        }
	        return false;
	    }

	    function isIterationStatement(node) {
	        if (node == null) { return false; }
	        switch (node.type) {
	            case 'DoWhileStatement':
	            case 'ForInStatement':
	            case 'ForStatement':
	            case 'WhileStatement':
	                return true;
	        }
	        return false;
	    }

	    function isStatement(node) {
	        if (node == null) { return false; }
	        switch (node.type) {
	            case 'BlockStatement':
	            case 'BreakStatement':
	            case 'ContinueStatement':
	            case 'DebuggerStatement':
	            case 'DoWhileStatement':
	            case 'EmptyStatement':
	            case 'ExpressionStatement':
	            case 'ForInStatement':
	            case 'ForStatement':
	            case 'IfStatement':
	            case 'LabeledStatement':
	            case 'ReturnStatement':
	            case 'SwitchStatement':
	            case 'ThrowStatement':
	            case 'TryStatement':
	            case 'VariableDeclaration':
	            case 'WhileStatement':
	            case 'WithStatement':
	                return true;
	        }
	        return false;
	    }

	    function isSourceElement(node) {
	      return isStatement(node) || node != null && node.type === 'FunctionDeclaration';
	    }

	    function trailingStatement(node) {
	        switch (node.type) {
	        case 'IfStatement':
	            if (node.alternate != null) {
	                return node.alternate;
	            }
	            return node.consequent;

	        case 'LabeledStatement':
	        case 'ForStatement':
	        case 'ForInStatement':
	        case 'WhileStatement':
	        case 'WithStatement':
	            return node.body;
	        }
	        return null;
	    }

	    function isProblematicIfStatement(node) {
	        var current;

	        if (node.type !== 'IfStatement') {
	            return false;
	        }
	        if (node.alternate == null) {
	            return false;
	        }
	        current = node.consequent;
	        do {
	            if (current.type === 'IfStatement') {
	                if (current.alternate == null)  {
	                    return true;
	                }
	            }
	            current = trailingStatement(current);
	        } while (current);

	        return false;
	    }

	    module.exports = {
	        isExpression: isExpression,
	        isStatement: isStatement,
	        isIterationStatement: isIterationStatement,
	        isSourceElement: isSourceElement,
	        isProblematicIfStatement: isProblematicIfStatement,

	        trailingStatement: trailingStatement
	    };
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 44 */
/***/ function(module, exports) {

	/*
	  Copyright (C) 2013-2014 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2014 Ivan Nikulin <ifaaan@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function () {
	    'use strict';

	    var ES6Regex, ES5Regex, NON_ASCII_WHITESPACES, IDENTIFIER_START, IDENTIFIER_PART, ch;

	    // See `tools/generate-identifier-regex.js`.
	    ES5Regex = {
	        // ECMAScript 5.1/Unicode v7.0.0 NonAsciiIdentifierStart:
	        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2E2F\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,
	        // ECMAScript 5.1/Unicode v7.0.0 NonAsciiIdentifierPart:
	        NonAsciiIdentifierPart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19D9\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u212F-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u2E2F\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099\u309A\u309D-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/
	    };

	    ES6Regex = {
	        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierStart:
	        NonAsciiIdentifierStart: /[\xAA\xB5\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0370-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386\u0388-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u05D0-\u05EA\u05F0-\u05F2\u0620-\u064A\u066E\u066F\u0671-\u06D3\u06D5\u06E5\u06E6\u06EE\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u07F4\u07F5\u07FA\u0800-\u0815\u081A\u0824\u0828\u0840-\u0858\u08A0-\u08B2\u0904-\u0939\u093D\u0950\u0958-\u0961\u0971-\u0980\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC\u09DD\u09DF-\u09E1\u09F0\u09F1\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0\u0AE1\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3D\u0B5C\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D\u0C58\u0C59\u0C60\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0\u0CE1\u0CF1\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32\u0E33\u0E40-\u0E46\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB0\u0EB2\u0EB3\u0EBD\u0EC0-\u0EC4\u0EC6\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065\u1066\u106E-\u1070\u1075-\u1081\u108E\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17D7\u17DC\u1820-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191E\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1AA7\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C7D\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5\u1CF6\u1D00-\u1DBF\u1E00-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u2071\u207F\u2090-\u209C\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CEE\u2CF2\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303C\u3041-\u3096\u309B-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA61F\uA62A\uA62B\uA640-\uA66E\uA67F-\uA69D\uA6A0-\uA6EF\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uA9CF\uA9E0-\uA9E4\uA9E6-\uA9EF\uA9FA-\uA9FE\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA76\uAA7A\uAA7E-\uAAAF\uAAB1\uAAB5\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADD\uAAE0-\uAAEA\uAAF2-\uAAF4\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF21-\uFF3A\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDE80-\uDE9C\uDEA0-\uDED0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF75\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00\uDE10-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE4\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC03-\uDC37\uDC83-\uDCAF\uDCD0-\uDCE8\uDD03-\uDD26\uDD50-\uDD72\uDD76\uDD83-\uDDB2\uDDC1-\uDDC4\uDDDA\uDE00-\uDE11\uDE13-\uDE2B\uDEB0-\uDEDE\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3D\uDF5D-\uDF61]|\uD805[\uDC80-\uDCAF\uDCC4\uDCC5\uDCC7\uDD80-\uDDAE\uDE00-\uDE2F\uDE44\uDE80-\uDEAA]|\uD806[\uDCA0-\uDCDF\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDED0-\uDEED\uDF00-\uDF2F\uDF40-\uDF43\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50\uDF93-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB]|\uD83A[\uDC00-\uDCC4]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]/,
	        // ECMAScript 6/Unicode v7.0.0 NonAsciiIdentifierPart:
	        NonAsciiIdentifierPart: /[\xAA\xB5\xB7\xBA\xC0-\xD6\xD8-\xF6\xF8-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0300-\u0374\u0376\u0377\u037A-\u037D\u037F\u0386-\u038A\u038C\u038E-\u03A1\u03A3-\u03F5\u03F7-\u0481\u0483-\u0487\u048A-\u052F\u0531-\u0556\u0559\u0561-\u0587\u0591-\u05BD\u05BF\u05C1\u05C2\u05C4\u05C5\u05C7\u05D0-\u05EA\u05F0-\u05F2\u0610-\u061A\u0620-\u0669\u066E-\u06D3\u06D5-\u06DC\u06DF-\u06E8\u06EA-\u06FC\u06FF\u0710-\u074A\u074D-\u07B1\u07C0-\u07F5\u07FA\u0800-\u082D\u0840-\u085B\u08A0-\u08B2\u08E4-\u0963\u0966-\u096F\u0971-\u0983\u0985-\u098C\u098F\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BC-\u09C4\u09C7\u09C8\u09CB-\u09CE\u09D7\u09DC\u09DD\u09DF-\u09E3\u09E6-\u09F1\u0A01-\u0A03\u0A05-\u0A0A\u0A0F\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32\u0A33\u0A35\u0A36\u0A38\u0A39\u0A3C\u0A3E-\u0A42\u0A47\u0A48\u0A4B-\u0A4D\u0A51\u0A59-\u0A5C\u0A5E\u0A66-\u0A75\u0A81-\u0A83\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2\u0AB3\u0AB5-\u0AB9\u0ABC-\u0AC5\u0AC7-\u0AC9\u0ACB-\u0ACD\u0AD0\u0AE0-\u0AE3\u0AE6-\u0AEF\u0B01-\u0B03\u0B05-\u0B0C\u0B0F\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32\u0B33\u0B35-\u0B39\u0B3C-\u0B44\u0B47\u0B48\u0B4B-\u0B4D\u0B56\u0B57\u0B5C\u0B5D\u0B5F-\u0B63\u0B66-\u0B6F\u0B71\u0B82\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99\u0B9A\u0B9C\u0B9E\u0B9F\u0BA3\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BBE-\u0BC2\u0BC6-\u0BC8\u0BCA-\u0BCD\u0BD0\u0BD7\u0BE6-\u0BEF\u0C00-\u0C03\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C39\u0C3D-\u0C44\u0C46-\u0C48\u0C4A-\u0C4D\u0C55\u0C56\u0C58\u0C59\u0C60-\u0C63\u0C66-\u0C6F\u0C81-\u0C83\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBC-\u0CC4\u0CC6-\u0CC8\u0CCA-\u0CCD\u0CD5\u0CD6\u0CDE\u0CE0-\u0CE3\u0CE6-\u0CEF\u0CF1\u0CF2\u0D01-\u0D03\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D-\u0D44\u0D46-\u0D48\u0D4A-\u0D4E\u0D57\u0D60-\u0D63\u0D66-\u0D6F\u0D7A-\u0D7F\u0D82\u0D83\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0DCA\u0DCF-\u0DD4\u0DD6\u0DD8-\u0DDF\u0DE6-\u0DEF\u0DF2\u0DF3\u0E01-\u0E3A\u0E40-\u0E4E\u0E50-\u0E59\u0E81\u0E82\u0E84\u0E87\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA\u0EAB\u0EAD-\u0EB9\u0EBB-\u0EBD\u0EC0-\u0EC4\u0EC6\u0EC8-\u0ECD\u0ED0-\u0ED9\u0EDC-\u0EDF\u0F00\u0F18\u0F19\u0F20-\u0F29\u0F35\u0F37\u0F39\u0F3E-\u0F47\u0F49-\u0F6C\u0F71-\u0F84\u0F86-\u0F97\u0F99-\u0FBC\u0FC6\u1000-\u1049\u1050-\u109D\u10A0-\u10C5\u10C7\u10CD\u10D0-\u10FA\u10FC-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u135D-\u135F\u1369-\u1371\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u16EE-\u16F8\u1700-\u170C\u170E-\u1714\u1720-\u1734\u1740-\u1753\u1760-\u176C\u176E-\u1770\u1772\u1773\u1780-\u17D3\u17D7\u17DC\u17DD\u17E0-\u17E9\u180B-\u180D\u1810-\u1819\u1820-\u1877\u1880-\u18AA\u18B0-\u18F5\u1900-\u191E\u1920-\u192B\u1930-\u193B\u1946-\u196D\u1970-\u1974\u1980-\u19AB\u19B0-\u19C9\u19D0-\u19DA\u1A00-\u1A1B\u1A20-\u1A5E\u1A60-\u1A7C\u1A7F-\u1A89\u1A90-\u1A99\u1AA7\u1AB0-\u1ABD\u1B00-\u1B4B\u1B50-\u1B59\u1B6B-\u1B73\u1B80-\u1BF3\u1C00-\u1C37\u1C40-\u1C49\u1C4D-\u1C7D\u1CD0-\u1CD2\u1CD4-\u1CF6\u1CF8\u1CF9\u1D00-\u1DF5\u1DFC-\u1F15\u1F18-\u1F1D\u1F20-\u1F45\u1F48-\u1F4D\u1F50-\u1F57\u1F59\u1F5B\u1F5D\u1F5F-\u1F7D\u1F80-\u1FB4\u1FB6-\u1FBC\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FCC\u1FD0-\u1FD3\u1FD6-\u1FDB\u1FE0-\u1FEC\u1FF2-\u1FF4\u1FF6-\u1FFC\u200C\u200D\u203F\u2040\u2054\u2071\u207F\u2090-\u209C\u20D0-\u20DC\u20E1\u20E5-\u20F0\u2102\u2107\u210A-\u2113\u2115\u2118-\u211D\u2124\u2126\u2128\u212A-\u2139\u213C-\u213F\u2145-\u2149\u214E\u2160-\u2188\u2C00-\u2C2E\u2C30-\u2C5E\u2C60-\u2CE4\u2CEB-\u2CF3\u2D00-\u2D25\u2D27\u2D2D\u2D30-\u2D67\u2D6F\u2D7F-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u2DE0-\u2DFF\u3005-\u3007\u3021-\u302F\u3031-\u3035\u3038-\u303C\u3041-\u3096\u3099-\u309F\u30A1-\u30FA\u30FC-\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA48C\uA4D0-\uA4FD\uA500-\uA60C\uA610-\uA62B\uA640-\uA66F\uA674-\uA67D\uA67F-\uA69D\uA69F-\uA6F1\uA717-\uA71F\uA722-\uA788\uA78B-\uA78E\uA790-\uA7AD\uA7B0\uA7B1\uA7F7-\uA827\uA840-\uA873\uA880-\uA8C4\uA8D0-\uA8D9\uA8E0-\uA8F7\uA8FB\uA900-\uA92D\uA930-\uA953\uA960-\uA97C\uA980-\uA9C0\uA9CF-\uA9D9\uA9E0-\uA9FE\uAA00-\uAA36\uAA40-\uAA4D\uAA50-\uAA59\uAA60-\uAA76\uAA7A-\uAAC2\uAADB-\uAADD\uAAE0-\uAAEF\uAAF2-\uAAF6\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uAB30-\uAB5A\uAB5C-\uAB5F\uAB64\uAB65\uABC0-\uABEA\uABEC\uABED\uABF0-\uABF9\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB00-\uFB06\uFB13-\uFB17\uFB1D-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40\uFB41\uFB43\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE00-\uFE0F\uFE20-\uFE2D\uFE33\uFE34\uFE4D-\uFE4F\uFE70-\uFE74\uFE76-\uFEFC\uFF10-\uFF19\uFF21-\uFF3A\uFF3F\uFF41-\uFF5A\uFF66-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]|\uD800[\uDC00-\uDC0B\uDC0D-\uDC26\uDC28-\uDC3A\uDC3C\uDC3D\uDC3F-\uDC4D\uDC50-\uDC5D\uDC80-\uDCFA\uDD40-\uDD74\uDDFD\uDE80-\uDE9C\uDEA0-\uDED0\uDEE0\uDF00-\uDF1F\uDF30-\uDF4A\uDF50-\uDF7A\uDF80-\uDF9D\uDFA0-\uDFC3\uDFC8-\uDFCF\uDFD1-\uDFD5]|\uD801[\uDC00-\uDC9D\uDCA0-\uDCA9\uDD00-\uDD27\uDD30-\uDD63\uDE00-\uDF36\uDF40-\uDF55\uDF60-\uDF67]|\uD802[\uDC00-\uDC05\uDC08\uDC0A-\uDC35\uDC37\uDC38\uDC3C\uDC3F-\uDC55\uDC60-\uDC76\uDC80-\uDC9E\uDD00-\uDD15\uDD20-\uDD39\uDD80-\uDDB7\uDDBE\uDDBF\uDE00-\uDE03\uDE05\uDE06\uDE0C-\uDE13\uDE15-\uDE17\uDE19-\uDE33\uDE38-\uDE3A\uDE3F\uDE60-\uDE7C\uDE80-\uDE9C\uDEC0-\uDEC7\uDEC9-\uDEE6\uDF00-\uDF35\uDF40-\uDF55\uDF60-\uDF72\uDF80-\uDF91]|\uD803[\uDC00-\uDC48]|\uD804[\uDC00-\uDC46\uDC66-\uDC6F\uDC7F-\uDCBA\uDCD0-\uDCE8\uDCF0-\uDCF9\uDD00-\uDD34\uDD36-\uDD3F\uDD50-\uDD73\uDD76\uDD80-\uDDC4\uDDD0-\uDDDA\uDE00-\uDE11\uDE13-\uDE37\uDEB0-\uDEEA\uDEF0-\uDEF9\uDF01-\uDF03\uDF05-\uDF0C\uDF0F\uDF10\uDF13-\uDF28\uDF2A-\uDF30\uDF32\uDF33\uDF35-\uDF39\uDF3C-\uDF44\uDF47\uDF48\uDF4B-\uDF4D\uDF57\uDF5D-\uDF63\uDF66-\uDF6C\uDF70-\uDF74]|\uD805[\uDC80-\uDCC5\uDCC7\uDCD0-\uDCD9\uDD80-\uDDB5\uDDB8-\uDDC0\uDE00-\uDE40\uDE44\uDE50-\uDE59\uDE80-\uDEB7\uDEC0-\uDEC9]|\uD806[\uDCA0-\uDCE9\uDCFF\uDEC0-\uDEF8]|\uD808[\uDC00-\uDF98]|\uD809[\uDC00-\uDC6E]|[\uD80C\uD840-\uD868\uD86A-\uD86C][\uDC00-\uDFFF]|\uD80D[\uDC00-\uDC2E]|\uD81A[\uDC00-\uDE38\uDE40-\uDE5E\uDE60-\uDE69\uDED0-\uDEED\uDEF0-\uDEF4\uDF00-\uDF36\uDF40-\uDF43\uDF50-\uDF59\uDF63-\uDF77\uDF7D-\uDF8F]|\uD81B[\uDF00-\uDF44\uDF50-\uDF7E\uDF8F-\uDF9F]|\uD82C[\uDC00\uDC01]|\uD82F[\uDC00-\uDC6A\uDC70-\uDC7C\uDC80-\uDC88\uDC90-\uDC99\uDC9D\uDC9E]|\uD834[\uDD65-\uDD69\uDD6D-\uDD72\uDD7B-\uDD82\uDD85-\uDD8B\uDDAA-\uDDAD\uDE42-\uDE44]|\uD835[\uDC00-\uDC54\uDC56-\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDEA5\uDEA8-\uDEC0\uDEC2-\uDEDA\uDEDC-\uDEFA\uDEFC-\uDF14\uDF16-\uDF34\uDF36-\uDF4E\uDF50-\uDF6E\uDF70-\uDF88\uDF8A-\uDFA8\uDFAA-\uDFC2\uDFC4-\uDFCB\uDFCE-\uDFFF]|\uD83A[\uDC00-\uDCC4\uDCD0-\uDCD6]|\uD83B[\uDE00-\uDE03\uDE05-\uDE1F\uDE21\uDE22\uDE24\uDE27\uDE29-\uDE32\uDE34-\uDE37\uDE39\uDE3B\uDE42\uDE47\uDE49\uDE4B\uDE4D-\uDE4F\uDE51\uDE52\uDE54\uDE57\uDE59\uDE5B\uDE5D\uDE5F\uDE61\uDE62\uDE64\uDE67-\uDE6A\uDE6C-\uDE72\uDE74-\uDE77\uDE79-\uDE7C\uDE7E\uDE80-\uDE89\uDE8B-\uDE9B\uDEA1-\uDEA3\uDEA5-\uDEA9\uDEAB-\uDEBB]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D]|\uD87E[\uDC00-\uDE1D]|\uDB40[\uDD00-\uDDEF]/
	    };

	    function isDecimalDigit(ch) {
	        return 0x30 <= ch && ch <= 0x39;  // 0..9
	    }

	    function isHexDigit(ch) {
	        return 0x30 <= ch && ch <= 0x39 ||  // 0..9
	            0x61 <= ch && ch <= 0x66 ||     // a..f
	            0x41 <= ch && ch <= 0x46;       // A..F
	    }

	    function isOctalDigit(ch) {
	        return ch >= 0x30 && ch <= 0x37;  // 0..7
	    }

	    // 7.2 White Space

	    NON_ASCII_WHITESPACES = [
	        0x1680, 0x180E,
	        0x2000, 0x2001, 0x2002, 0x2003, 0x2004, 0x2005, 0x2006, 0x2007, 0x2008, 0x2009, 0x200A,
	        0x202F, 0x205F,
	        0x3000,
	        0xFEFF
	    ];

	    function isWhiteSpace(ch) {
	        return ch === 0x20 || ch === 0x09 || ch === 0x0B || ch === 0x0C || ch === 0xA0 ||
	            ch >= 0x1680 && NON_ASCII_WHITESPACES.indexOf(ch) >= 0;
	    }

	    // 7.3 Line Terminators

	    function isLineTerminator(ch) {
	        return ch === 0x0A || ch === 0x0D || ch === 0x2028 || ch === 0x2029;
	    }

	    // 7.6 Identifier Names and Identifiers

	    function fromCodePoint(cp) {
	        if (cp <= 0xFFFF) { return String.fromCharCode(cp); }
	        var cu1 = String.fromCharCode(Math.floor((cp - 0x10000) / 0x400) + 0xD800);
	        var cu2 = String.fromCharCode(((cp - 0x10000) % 0x400) + 0xDC00);
	        return cu1 + cu2;
	    }

	    IDENTIFIER_START = new Array(0x80);
	    for(ch = 0; ch < 0x80; ++ch) {
	        IDENTIFIER_START[ch] =
	            ch >= 0x61 && ch <= 0x7A ||  // a..z
	            ch >= 0x41 && ch <= 0x5A ||  // A..Z
	            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
	    }

	    IDENTIFIER_PART = new Array(0x80);
	    for(ch = 0; ch < 0x80; ++ch) {
	        IDENTIFIER_PART[ch] =
	            ch >= 0x61 && ch <= 0x7A ||  // a..z
	            ch >= 0x41 && ch <= 0x5A ||  // A..Z
	            ch >= 0x30 && ch <= 0x39 ||  // 0..9
	            ch === 0x24 || ch === 0x5F;  // $ (dollar) and _ (underscore)
	    }

	    function isIdentifierStartES5(ch) {
	        return ch < 0x80 ? IDENTIFIER_START[ch] : ES5Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
	    }

	    function isIdentifierPartES5(ch) {
	        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES5Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
	    }

	    function isIdentifierStartES6(ch) {
	        return ch < 0x80 ? IDENTIFIER_START[ch] : ES6Regex.NonAsciiIdentifierStart.test(fromCodePoint(ch));
	    }

	    function isIdentifierPartES6(ch) {
	        return ch < 0x80 ? IDENTIFIER_PART[ch] : ES6Regex.NonAsciiIdentifierPart.test(fromCodePoint(ch));
	    }

	    module.exports = {
	        isDecimalDigit: isDecimalDigit,
	        isHexDigit: isHexDigit,
	        isOctalDigit: isOctalDigit,
	        isWhiteSpace: isWhiteSpace,
	        isLineTerminator: isLineTerminator,
	        isIdentifierStartES5: isIdentifierStartES5,
	        isIdentifierPartES5: isIdentifierPartES5,
	        isIdentifierStartES6: isIdentifierStartES6,
	        isIdentifierPartES6: isIdentifierPartES6
	    };
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Copyright (C) 2013 Yusuke Suzuki <utatane.tea@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/

	(function () {
	    'use strict';

	    var code = __webpack_require__(44);

	    function isStrictModeReservedWordES6(id) {
	        switch (id) {
	        case 'implements':
	        case 'interface':
	        case 'package':
	        case 'private':
	        case 'protected':
	        case 'public':
	        case 'static':
	        case 'let':
	            return true;
	        default:
	            return false;
	        }
	    }

	    function isKeywordES5(id, strict) {
	        // yield should not be treated as keyword under non-strict mode.
	        if (!strict && id === 'yield') {
	            return false;
	        }
	        return isKeywordES6(id, strict);
	    }

	    function isKeywordES6(id, strict) {
	        if (strict && isStrictModeReservedWordES6(id)) {
	            return true;
	        }

	        switch (id.length) {
	        case 2:
	            return (id === 'if') || (id === 'in') || (id === 'do');
	        case 3:
	            return (id === 'var') || (id === 'for') || (id === 'new') || (id === 'try');
	        case 4:
	            return (id === 'this') || (id === 'else') || (id === 'case') ||
	                (id === 'void') || (id === 'with') || (id === 'enum');
	        case 5:
	            return (id === 'while') || (id === 'break') || (id === 'catch') ||
	                (id === 'throw') || (id === 'const') || (id === 'yield') ||
	                (id === 'class') || (id === 'super');
	        case 6:
	            return (id === 'return') || (id === 'typeof') || (id === 'delete') ||
	                (id === 'switch') || (id === 'export') || (id === 'import');
	        case 7:
	            return (id === 'default') || (id === 'finally') || (id === 'extends');
	        case 8:
	            return (id === 'function') || (id === 'continue') || (id === 'debugger');
	        case 10:
	            return (id === 'instanceof');
	        default:
	            return false;
	        }
	    }

	    function isReservedWordES5(id, strict) {
	        return id === 'null' || id === 'true' || id === 'false' || isKeywordES5(id, strict);
	    }

	    function isReservedWordES6(id, strict) {
	        return id === 'null' || id === 'true' || id === 'false' || isKeywordES6(id, strict);
	    }

	    function isRestrictedWord(id) {
	        return id === 'eval' || id === 'arguments';
	    }

	    function isIdentifierNameES5(id) {
	        var i, iz, ch;

	        if (id.length === 0) { return false; }

	        ch = id.charCodeAt(0);
	        if (!code.isIdentifierStartES5(ch)) {
	            return false;
	        }

	        for (i = 1, iz = id.length; i < iz; ++i) {
	            ch = id.charCodeAt(i);
	            if (!code.isIdentifierPartES5(ch)) {
	                return false;
	            }
	        }
	        return true;
	    }

	    function decodeUtf16(lead, trail) {
	        return (lead - 0xD800) * 0x400 + (trail - 0xDC00) + 0x10000;
	    }

	    function isIdentifierNameES6(id) {
	        var i, iz, ch, lowCh, check;

	        if (id.length === 0) { return false; }

	        check = code.isIdentifierStartES6;
	        for (i = 0, iz = id.length; i < iz; ++i) {
	            ch = id.charCodeAt(i);
	            if (0xD800 <= ch && ch <= 0xDBFF) {
	                ++i;
	                if (i >= iz) { return false; }
	                lowCh = id.charCodeAt(i);
	                if (!(0xDC00 <= lowCh && lowCh <= 0xDFFF)) {
	                    return false;
	                }
	                ch = decodeUtf16(ch, lowCh);
	            }
	            if (!check(ch)) {
	                return false;
	            }
	            check = code.isIdentifierPartES6;
	        }
	        return true;
	    }

	    function isIdentifierES5(id, strict) {
	        return isIdentifierNameES5(id) && !isReservedWordES5(id, strict);
	    }

	    function isIdentifierES6(id, strict) {
	        return isIdentifierNameES6(id) && !isReservedWordES6(id, strict);
	    }

	    module.exports = {
	        isKeywordES5: isKeywordES5,
	        isKeywordES6: isKeywordES6,
	        isReservedWordES5: isReservedWordES5,
	        isReservedWordES6: isReservedWordES6,
	        isRestrictedWord: isRestrictedWord,
	        isIdentifierNameES5: isIdentifierNameES5,
	        isIdentifierNameES6: isIdentifierNameES6,
	        isIdentifierES5: isIdentifierES5,
	        isIdentifierES6: isIdentifierES6
	    };
	}());
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Copyright 2009-2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE.txt or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	exports.SourceMapGenerator = __webpack_require__(47).SourceMapGenerator;
	exports.SourceMapConsumer = __webpack_require__(53).SourceMapConsumer;
	exports.SourceNode = __webpack_require__(57).SourceNode;


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var base64VLQ = __webpack_require__(48);
	  var util = __webpack_require__(50);
	  var ArraySet = __webpack_require__(51).ArraySet;
	  var MappingList = __webpack_require__(52).MappingList;

	  /**
	   * An instance of the SourceMapGenerator represents a source map which is
	   * being built incrementally. You may pass an object with the following
	   * properties:
	   *
	   *   - file: The filename of the generated source.
	   *   - sourceRoot: A root for all relative URLs in this source map.
	   */
	  function SourceMapGenerator(aArgs) {
	    if (!aArgs) {
	      aArgs = {};
	    }
	    this._file = util.getArg(aArgs, 'file', null);
	    this._sourceRoot = util.getArg(aArgs, 'sourceRoot', null);
	    this._skipValidation = util.getArg(aArgs, 'skipValidation', false);
	    this._sources = new ArraySet();
	    this._names = new ArraySet();
	    this._mappings = new MappingList();
	    this._sourcesContents = null;
	  }

	  SourceMapGenerator.prototype._version = 3;

	  /**
	   * Creates a new SourceMapGenerator based on a SourceMapConsumer
	   *
	   * @param aSourceMapConsumer The SourceMap.
	   */
	  SourceMapGenerator.fromSourceMap =
	    function SourceMapGenerator_fromSourceMap(aSourceMapConsumer) {
	      var sourceRoot = aSourceMapConsumer.sourceRoot;
	      var generator = new SourceMapGenerator({
	        file: aSourceMapConsumer.file,
	        sourceRoot: sourceRoot
	      });
	      aSourceMapConsumer.eachMapping(function (mapping) {
	        var newMapping = {
	          generated: {
	            line: mapping.generatedLine,
	            column: mapping.generatedColumn
	          }
	        };

	        if (mapping.source != null) {
	          newMapping.source = mapping.source;
	          if (sourceRoot != null) {
	            newMapping.source = util.relative(sourceRoot, newMapping.source);
	          }

	          newMapping.original = {
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          };

	          if (mapping.name != null) {
	            newMapping.name = mapping.name;
	          }
	        }

	        generator.addMapping(newMapping);
	      });
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content != null) {
	          generator.setSourceContent(sourceFile, content);
	        }
	      });
	      return generator;
	    };

	  /**
	   * Add a single mapping from original source line and column to the generated
	   * source's line and column for this source map being created. The mapping
	   * object should have the following properties:
	   *
	   *   - generated: An object with the generated line and column positions.
	   *   - original: An object with the original line and column positions.
	   *   - source: The original source file (relative to the sourceRoot).
	   *   - name: An optional original token name for this mapping.
	   */
	  SourceMapGenerator.prototype.addMapping =
	    function SourceMapGenerator_addMapping(aArgs) {
	      var generated = util.getArg(aArgs, 'generated');
	      var original = util.getArg(aArgs, 'original', null);
	      var source = util.getArg(aArgs, 'source', null);
	      var name = util.getArg(aArgs, 'name', null);

	      if (!this._skipValidation) {
	        this._validateMapping(generated, original, source, name);
	      }

	      if (source != null && !this._sources.has(source)) {
	        this._sources.add(source);
	      }

	      if (name != null && !this._names.has(name)) {
	        this._names.add(name);
	      }

	      this._mappings.add({
	        generatedLine: generated.line,
	        generatedColumn: generated.column,
	        originalLine: original != null && original.line,
	        originalColumn: original != null && original.column,
	        source: source,
	        name: name
	      });
	    };

	  /**
	   * Set the source content for a source file.
	   */
	  SourceMapGenerator.prototype.setSourceContent =
	    function SourceMapGenerator_setSourceContent(aSourceFile, aSourceContent) {
	      var source = aSourceFile;
	      if (this._sourceRoot != null) {
	        source = util.relative(this._sourceRoot, source);
	      }

	      if (aSourceContent != null) {
	        // Add the source content to the _sourcesContents map.
	        // Create a new _sourcesContents map if the property is null.
	        if (!this._sourcesContents) {
	          this._sourcesContents = {};
	        }
	        this._sourcesContents[util.toSetString(source)] = aSourceContent;
	      } else if (this._sourcesContents) {
	        // Remove the source file from the _sourcesContents map.
	        // If the _sourcesContents map is empty, set the property to null.
	        delete this._sourcesContents[util.toSetString(source)];
	        if (Object.keys(this._sourcesContents).length === 0) {
	          this._sourcesContents = null;
	        }
	      }
	    };

	  /**
	   * Applies the mappings of a sub-source-map for a specific source file to the
	   * source map being generated. Each mapping to the supplied source file is
	   * rewritten using the supplied source map. Note: The resolution for the
	   * resulting mappings is the minimium of this map and the supplied map.
	   *
	   * @param aSourceMapConsumer The source map to be applied.
	   * @param aSourceFile Optional. The filename of the source file.
	   *        If omitted, SourceMapConsumer's file property will be used.
	   * @param aSourceMapPath Optional. The dirname of the path to the source map
	   *        to be applied. If relative, it is relative to the SourceMapConsumer.
	   *        This parameter is needed when the two source maps aren't in the same
	   *        directory, and the source map to be applied contains relative source
	   *        paths. If so, those relative source paths need to be rewritten
	   *        relative to the SourceMapGenerator.
	   */
	  SourceMapGenerator.prototype.applySourceMap =
	    function SourceMapGenerator_applySourceMap(aSourceMapConsumer, aSourceFile, aSourceMapPath) {
	      var sourceFile = aSourceFile;
	      // If aSourceFile is omitted, we will use the file property of the SourceMap
	      if (aSourceFile == null) {
	        if (aSourceMapConsumer.file == null) {
	          throw new Error(
	            'SourceMapGenerator.prototype.applySourceMap requires either an explicit source file, ' +
	            'or the source map\'s "file" property. Both were omitted.'
	          );
	        }
	        sourceFile = aSourceMapConsumer.file;
	      }
	      var sourceRoot = this._sourceRoot;
	      // Make "sourceFile" relative if an absolute Url is passed.
	      if (sourceRoot != null) {
	        sourceFile = util.relative(sourceRoot, sourceFile);
	      }
	      // Applying the SourceMap can add and remove items from the sources and
	      // the names array.
	      var newSources = new ArraySet();
	      var newNames = new ArraySet();

	      // Find mappings for the "sourceFile"
	      this._mappings.unsortedForEach(function (mapping) {
	        if (mapping.source === sourceFile && mapping.originalLine != null) {
	          // Check if it can be mapped by the source map, then update the mapping.
	          var original = aSourceMapConsumer.originalPositionFor({
	            line: mapping.originalLine,
	            column: mapping.originalColumn
	          });
	          if (original.source != null) {
	            // Copy mapping
	            mapping.source = original.source;
	            if (aSourceMapPath != null) {
	              mapping.source = util.join(aSourceMapPath, mapping.source)
	            }
	            if (sourceRoot != null) {
	              mapping.source = util.relative(sourceRoot, mapping.source);
	            }
	            mapping.originalLine = original.line;
	            mapping.originalColumn = original.column;
	            if (original.name != null) {
	              mapping.name = original.name;
	            }
	          }
	        }

	        var source = mapping.source;
	        if (source != null && !newSources.has(source)) {
	          newSources.add(source);
	        }

	        var name = mapping.name;
	        if (name != null && !newNames.has(name)) {
	          newNames.add(name);
	        }

	      }, this);
	      this._sources = newSources;
	      this._names = newNames;

	      // Copy sourcesContents of applied map.
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content != null) {
	          if (aSourceMapPath != null) {
	            sourceFile = util.join(aSourceMapPath, sourceFile);
	          }
	          if (sourceRoot != null) {
	            sourceFile = util.relative(sourceRoot, sourceFile);
	          }
	          this.setSourceContent(sourceFile, content);
	        }
	      }, this);
	    };

	  /**
	   * A mapping can have one of the three levels of data:
	   *
	   *   1. Just the generated position.
	   *   2. The Generated position, original position, and original source.
	   *   3. Generated and original position, original source, as well as a name
	   *      token.
	   *
	   * To maintain consistency, we validate that any new mapping being added falls
	   * in to one of these categories.
	   */
	  SourceMapGenerator.prototype._validateMapping =
	    function SourceMapGenerator_validateMapping(aGenerated, aOriginal, aSource,
	                                                aName) {
	      if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	          && aGenerated.line > 0 && aGenerated.column >= 0
	          && !aOriginal && !aSource && !aName) {
	        // Case 1.
	        return;
	      }
	      else if (aGenerated && 'line' in aGenerated && 'column' in aGenerated
	               && aOriginal && 'line' in aOriginal && 'column' in aOriginal
	               && aGenerated.line > 0 && aGenerated.column >= 0
	               && aOriginal.line > 0 && aOriginal.column >= 0
	               && aSource) {
	        // Cases 2 and 3.
	        return;
	      }
	      else {
	        throw new Error('Invalid mapping: ' + JSON.stringify({
	          generated: aGenerated,
	          source: aSource,
	          original: aOriginal,
	          name: aName
	        }));
	      }
	    };

	  /**
	   * Serialize the accumulated mappings in to the stream of base 64 VLQs
	   * specified by the source map format.
	   */
	  SourceMapGenerator.prototype._serializeMappings =
	    function SourceMapGenerator_serializeMappings() {
	      var previousGeneratedColumn = 0;
	      var previousGeneratedLine = 1;
	      var previousOriginalColumn = 0;
	      var previousOriginalLine = 0;
	      var previousName = 0;
	      var previousSource = 0;
	      var result = '';
	      var mapping;

	      var mappings = this._mappings.toArray();

	      for (var i = 0, len = mappings.length; i < len; i++) {
	        mapping = mappings[i];

	        if (mapping.generatedLine !== previousGeneratedLine) {
	          previousGeneratedColumn = 0;
	          while (mapping.generatedLine !== previousGeneratedLine) {
	            result += ';';
	            previousGeneratedLine++;
	          }
	        }
	        else {
	          if (i > 0) {
	            if (!util.compareByGeneratedPositions(mapping, mappings[i - 1])) {
	              continue;
	            }
	            result += ',';
	          }
	        }

	        result += base64VLQ.encode(mapping.generatedColumn
	                                   - previousGeneratedColumn);
	        previousGeneratedColumn = mapping.generatedColumn;

	        if (mapping.source != null) {
	          result += base64VLQ.encode(this._sources.indexOf(mapping.source)
	                                     - previousSource);
	          previousSource = this._sources.indexOf(mapping.source);

	          // lines are stored 0-based in SourceMap spec version 3
	          result += base64VLQ.encode(mapping.originalLine - 1
	                                     - previousOriginalLine);
	          previousOriginalLine = mapping.originalLine - 1;

	          result += base64VLQ.encode(mapping.originalColumn
	                                     - previousOriginalColumn);
	          previousOriginalColumn = mapping.originalColumn;

	          if (mapping.name != null) {
	            result += base64VLQ.encode(this._names.indexOf(mapping.name)
	                                       - previousName);
	            previousName = this._names.indexOf(mapping.name);
	          }
	        }
	      }

	      return result;
	    };

	  SourceMapGenerator.prototype._generateSourcesContent =
	    function SourceMapGenerator_generateSourcesContent(aSources, aSourceRoot) {
	      return aSources.map(function (source) {
	        if (!this._sourcesContents) {
	          return null;
	        }
	        if (aSourceRoot != null) {
	          source = util.relative(aSourceRoot, source);
	        }
	        var key = util.toSetString(source);
	        return Object.prototype.hasOwnProperty.call(this._sourcesContents,
	                                                    key)
	          ? this._sourcesContents[key]
	          : null;
	      }, this);
	    };

	  /**
	   * Externalize the source map.
	   */
	  SourceMapGenerator.prototype.toJSON =
	    function SourceMapGenerator_toJSON() {
	      var map = {
	        version: this._version,
	        sources: this._sources.toArray(),
	        names: this._names.toArray(),
	        mappings: this._serializeMappings()
	      };
	      if (this._file != null) {
	        map.file = this._file;
	      }
	      if (this._sourceRoot != null) {
	        map.sourceRoot = this._sourceRoot;
	      }
	      if (this._sourcesContents) {
	        map.sourcesContent = this._generateSourcesContent(map.sources, map.sourceRoot);
	      }

	      return map;
	    };

	  /**
	   * Render the source map being generated to a string.
	   */
	  SourceMapGenerator.prototype.toString =
	    function SourceMapGenerator_toString() {
	      return JSON.stringify(this);
	    };

	  exports.SourceMapGenerator = SourceMapGenerator;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 *
	 * Based on the Base 64 VLQ implementation in Closure Compiler:
	 * https://code.google.com/p/closure-compiler/source/browse/trunk/src/com/google/debugging/sourcemap/Base64VLQ.java
	 *
	 * Copyright 2011 The Closure Compiler Authors. All rights reserved.
	 * Redistribution and use in source and binary forms, with or without
	 * modification, are permitted provided that the following conditions are
	 * met:
	 *
	 *  * Redistributions of source code must retain the above copyright
	 *    notice, this list of conditions and the following disclaimer.
	 *  * Redistributions in binary form must reproduce the above
	 *    copyright notice, this list of conditions and the following
	 *    disclaimer in the documentation and/or other materials provided
	 *    with the distribution.
	 *  * Neither the name of Google Inc. nor the names of its
	 *    contributors may be used to endorse or promote products derived
	 *    from this software without specific prior written permission.
	 *
	 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
	 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
	 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
	 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
	 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
	 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
	 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
	 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
	 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
	 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var base64 = __webpack_require__(49);

	  // A single base 64 digit can contain 6 bits of data. For the base 64 variable
	  // length quantities we use in the source map spec, the first bit is the sign,
	  // the next four bits are the actual value, and the 6th bit is the
	  // continuation bit. The continuation bit tells us whether there are more
	  // digits in this value following this digit.
	  //
	  //   Continuation
	  //   |    Sign
	  //   |    |
	  //   V    V
	  //   101011

	  var VLQ_BASE_SHIFT = 5;

	  // binary: 100000
	  var VLQ_BASE = 1 << VLQ_BASE_SHIFT;

	  // binary: 011111
	  var VLQ_BASE_MASK = VLQ_BASE - 1;

	  // binary: 100000
	  var VLQ_CONTINUATION_BIT = VLQ_BASE;

	  /**
	   * Converts from a two-complement value to a value where the sign bit is
	   * placed in the least significant bit.  For example, as decimals:
	   *   1 becomes 2 (10 binary), -1 becomes 3 (11 binary)
	   *   2 becomes 4 (100 binary), -2 becomes 5 (101 binary)
	   */
	  function toVLQSigned(aValue) {
	    return aValue < 0
	      ? ((-aValue) << 1) + 1
	      : (aValue << 1) + 0;
	  }

	  /**
	   * Converts to a two-complement value from a value where the sign bit is
	   * placed in the least significant bit.  For example, as decimals:
	   *   2 (10 binary) becomes 1, 3 (11 binary) becomes -1
	   *   4 (100 binary) becomes 2, 5 (101 binary) becomes -2
	   */
	  function fromVLQSigned(aValue) {
	    var isNegative = (aValue & 1) === 1;
	    var shifted = aValue >> 1;
	    return isNegative
	      ? -shifted
	      : shifted;
	  }

	  /**
	   * Returns the base 64 VLQ encoded value.
	   */
	  exports.encode = function base64VLQ_encode(aValue) {
	    var encoded = "";
	    var digit;

	    var vlq = toVLQSigned(aValue);

	    do {
	      digit = vlq & VLQ_BASE_MASK;
	      vlq >>>= VLQ_BASE_SHIFT;
	      if (vlq > 0) {
	        // There are still more digits in this value, so we must make sure the
	        // continuation bit is marked.
	        digit |= VLQ_CONTINUATION_BIT;
	      }
	      encoded += base64.encode(digit);
	    } while (vlq > 0);

	    return encoded;
	  };

	  /**
	   * Decodes the next base 64 VLQ value from the given string and returns the
	   * value and the rest of the string via the out parameter.
	   */
	  exports.decode = function base64VLQ_decode(aStr, aOutParam) {
	    var i = 0;
	    var strLen = aStr.length;
	    var result = 0;
	    var shift = 0;
	    var continuation, digit;

	    do {
	      if (i >= strLen) {
	        throw new Error("Expected more digits in base 64 VLQ value.");
	      }
	      digit = base64.decode(aStr.charAt(i++));
	      continuation = !!(digit & VLQ_CONTINUATION_BIT);
	      digit &= VLQ_BASE_MASK;
	      result = result + (digit << shift);
	      shift += VLQ_BASE_SHIFT;
	    } while (continuation);

	    aOutParam.value = fromVLQSigned(result);
	    aOutParam.rest = aStr.slice(i);
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var charToIntMap = {};
	  var intToCharMap = {};

	  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
	    .split('')
	    .forEach(function (ch, index) {
	      charToIntMap[ch] = index;
	      intToCharMap[index] = ch;
	    });

	  /**
	   * Encode an integer in the range of 0 to 63 to a single base 64 digit.
	   */
	  exports.encode = function base64_encode(aNumber) {
	    if (aNumber in intToCharMap) {
	      return intToCharMap[aNumber];
	    }
	    throw new TypeError("Must be between 0 and 63: " + aNumber);
	  };

	  /**
	   * Decode a single base 64 digit to an integer.
	   */
	  exports.decode = function base64_decode(aChar) {
	    if (aChar in charToIntMap) {
	      return charToIntMap[aChar];
	    }
	    throw new TypeError("Not a valid base 64 digit: " + aChar);
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  /**
	   * This is a helper function for getting values from parameter/options
	   * objects.
	   *
	   * @param args The object we are extracting values from
	   * @param name The name of the property we are getting.
	   * @param defaultValue An optional value to return if the property is missing
	   * from the object. If this is not specified and the property is missing, an
	   * error will be thrown.
	   */
	  function getArg(aArgs, aName, aDefaultValue) {
	    if (aName in aArgs) {
	      return aArgs[aName];
	    } else if (arguments.length === 3) {
	      return aDefaultValue;
	    } else {
	      throw new Error('"' + aName + '" is a required argument.');
	    }
	  }
	  exports.getArg = getArg;

	  var urlRegexp = /^(?:([\w+\-.]+):)?\/\/(?:(\w+:\w+)@)?([\w.]*)(?::(\d+))?(\S*)$/;
	  var dataUrlRegexp = /^data:.+\,.+$/;

	  function urlParse(aUrl) {
	    var match = aUrl.match(urlRegexp);
	    if (!match) {
	      return null;
	    }
	    return {
	      scheme: match[1],
	      auth: match[2],
	      host: match[3],
	      port: match[4],
	      path: match[5]
	    };
	  }
	  exports.urlParse = urlParse;

	  function urlGenerate(aParsedUrl) {
	    var url = '';
	    if (aParsedUrl.scheme) {
	      url += aParsedUrl.scheme + ':';
	    }
	    url += '//';
	    if (aParsedUrl.auth) {
	      url += aParsedUrl.auth + '@';
	    }
	    if (aParsedUrl.host) {
	      url += aParsedUrl.host;
	    }
	    if (aParsedUrl.port) {
	      url += ":" + aParsedUrl.port
	    }
	    if (aParsedUrl.path) {
	      url += aParsedUrl.path;
	    }
	    return url;
	  }
	  exports.urlGenerate = urlGenerate;

	  /**
	   * Normalizes a path, or the path portion of a URL:
	   *
	   * - Replaces consequtive slashes with one slash.
	   * - Removes unnecessary '.' parts.
	   * - Removes unnecessary '<dir>/..' parts.
	   *
	   * Based on code in the Node.js 'path' core module.
	   *
	   * @param aPath The path or url to normalize.
	   */
	  function normalize(aPath) {
	    var path = aPath;
	    var url = urlParse(aPath);
	    if (url) {
	      if (!url.path) {
	        return aPath;
	      }
	      path = url.path;
	    }
	    var isAbsolute = (path.charAt(0) === '/');

	    var parts = path.split(/\/+/);
	    for (var part, up = 0, i = parts.length - 1; i >= 0; i--) {
	      part = parts[i];
	      if (part === '.') {
	        parts.splice(i, 1);
	      } else if (part === '..') {
	        up++;
	      } else if (up > 0) {
	        if (part === '') {
	          // The first part is blank if the path is absolute. Trying to go
	          // above the root is a no-op. Therefore we can remove all '..' parts
	          // directly after the root.
	          parts.splice(i + 1, up);
	          up = 0;
	        } else {
	          parts.splice(i, 2);
	          up--;
	        }
	      }
	    }
	    path = parts.join('/');

	    if (path === '') {
	      path = isAbsolute ? '/' : '.';
	    }

	    if (url) {
	      url.path = path;
	      return urlGenerate(url);
	    }
	    return path;
	  }
	  exports.normalize = normalize;

	  /**
	   * Joins two paths/URLs.
	   *
	   * @param aRoot The root path or URL.
	   * @param aPath The path or URL to be joined with the root.
	   *
	   * - If aPath is a URL or a data URI, aPath is returned, unless aPath is a
	   *   scheme-relative URL: Then the scheme of aRoot, if any, is prepended
	   *   first.
	   * - Otherwise aPath is a path. If aRoot is a URL, then its path portion
	   *   is updated with the result and aRoot is returned. Otherwise the result
	   *   is returned.
	   *   - If aPath is absolute, the result is aPath.
	   *   - Otherwise the two paths are joined with a slash.
	   * - Joining for example 'http://' and 'www.example.com' is also supported.
	   */
	  function join(aRoot, aPath) {
	    if (aRoot === "") {
	      aRoot = ".";
	    }
	    if (aPath === "") {
	      aPath = ".";
	    }
	    var aPathUrl = urlParse(aPath);
	    var aRootUrl = urlParse(aRoot);
	    if (aRootUrl) {
	      aRoot = aRootUrl.path || '/';
	    }

	    // `join(foo, '//www.example.org')`
	    if (aPathUrl && !aPathUrl.scheme) {
	      if (aRootUrl) {
	        aPathUrl.scheme = aRootUrl.scheme;
	      }
	      return urlGenerate(aPathUrl);
	    }

	    if (aPathUrl || aPath.match(dataUrlRegexp)) {
	      return aPath;
	    }

	    // `join('http://', 'www.example.com')`
	    if (aRootUrl && !aRootUrl.host && !aRootUrl.path) {
	      aRootUrl.host = aPath;
	      return urlGenerate(aRootUrl);
	    }

	    var joined = aPath.charAt(0) === '/'
	      ? aPath
	      : normalize(aRoot.replace(/\/+$/, '') + '/' + aPath);

	    if (aRootUrl) {
	      aRootUrl.path = joined;
	      return urlGenerate(aRootUrl);
	    }
	    return joined;
	  }
	  exports.join = join;

	  /**
	   * Make a path relative to a URL or another path.
	   *
	   * @param aRoot The root path or URL.
	   * @param aPath The path or URL to be made relative to aRoot.
	   */
	  function relative(aRoot, aPath) {
	    if (aRoot === "") {
	      aRoot = ".";
	    }

	    aRoot = aRoot.replace(/\/$/, '');

	    // XXX: It is possible to remove this block, and the tests still pass!
	    var url = urlParse(aRoot);
	    if (aPath.charAt(0) == "/" && url && url.path == "/") {
	      return aPath.slice(1);
	    }

	    return aPath.indexOf(aRoot + '/') === 0
	      ? aPath.substr(aRoot.length + 1)
	      : aPath;
	  }
	  exports.relative = relative;

	  /**
	   * Because behavior goes wacky when you set `__proto__` on objects, we
	   * have to prefix all the strings in our set with an arbitrary character.
	   *
	   * See https://github.com/mozilla/source-map/pull/31 and
	   * https://github.com/mozilla/source-map/issues/30
	   *
	   * @param String aStr
	   */
	  function toSetString(aStr) {
	    return '$' + aStr;
	  }
	  exports.toSetString = toSetString;

	  function fromSetString(aStr) {
	    return aStr.substr(1);
	  }
	  exports.fromSetString = fromSetString;

	  function strcmp(aStr1, aStr2) {
	    var s1 = aStr1 || "";
	    var s2 = aStr2 || "";
	    return (s1 > s2) - (s1 < s2);
	  }

	  /**
	   * Comparator between two mappings where the original positions are compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same original source/line/column, but different generated
	   * line and column the same. Useful when searching for a mapping with a
	   * stubbed out mapping.
	   */
	  function compareByOriginalPositions(mappingA, mappingB, onlyCompareOriginal) {
	    var cmp;

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp || onlyCompareOriginal) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.name, mappingB.name);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    return mappingA.generatedColumn - mappingB.generatedColumn;
	  };
	  exports.compareByOriginalPositions = compareByOriginalPositions;

	  /**
	   * Comparator between two mappings where the generated positions are
	   * compared.
	   *
	   * Optionally pass in `true` as `onlyCompareGenerated` to consider two
	   * mappings with the same generated line and column, but different
	   * source/name/original line and column the same. Useful when searching for a
	   * mapping with a stubbed out mapping.
	   */
	  function compareByGeneratedPositions(mappingA, mappingB, onlyCompareGenerated) {
	    var cmp;

	    cmp = mappingA.generatedLine - mappingB.generatedLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.generatedColumn - mappingB.generatedColumn;
	    if (cmp || onlyCompareGenerated) {
	      return cmp;
	    }

	    cmp = strcmp(mappingA.source, mappingB.source);
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalLine - mappingB.originalLine;
	    if (cmp) {
	      return cmp;
	    }

	    cmp = mappingA.originalColumn - mappingB.originalColumn;
	    if (cmp) {
	      return cmp;
	    }

	    return strcmp(mappingA.name, mappingB.name);
	  };
	  exports.compareByGeneratedPositions = compareByGeneratedPositions;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(50);

	  /**
	   * A data structure which is a combination of an array and a set. Adding a new
	   * member is O(1), testing for membership is O(1), and finding the index of an
	   * element is O(1). Removing elements from the set is not supported. Only
	   * strings are supported for membership.
	   */
	  function ArraySet() {
	    this._array = [];
	    this._set = {};
	  }

	  /**
	   * Static method for creating ArraySet instances from an existing array.
	   */
	  ArraySet.fromArray = function ArraySet_fromArray(aArray, aAllowDuplicates) {
	    var set = new ArraySet();
	    for (var i = 0, len = aArray.length; i < len; i++) {
	      set.add(aArray[i], aAllowDuplicates);
	    }
	    return set;
	  };

	  /**
	   * Add the given string to this set.
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.add = function ArraySet_add(aStr, aAllowDuplicates) {
	    var isDuplicate = this.has(aStr);
	    var idx = this._array.length;
	    if (!isDuplicate || aAllowDuplicates) {
	      this._array.push(aStr);
	    }
	    if (!isDuplicate) {
	      this._set[util.toSetString(aStr)] = idx;
	    }
	  };

	  /**
	   * Is the given string a member of this set?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.has = function ArraySet_has(aStr) {
	    return Object.prototype.hasOwnProperty.call(this._set,
	                                                util.toSetString(aStr));
	  };

	  /**
	   * What is the index of the given string in the array?
	   *
	   * @param String aStr
	   */
	  ArraySet.prototype.indexOf = function ArraySet_indexOf(aStr) {
	    if (this.has(aStr)) {
	      return this._set[util.toSetString(aStr)];
	    }
	    throw new Error('"' + aStr + '" is not in the set.');
	  };

	  /**
	   * What is the element at the given index?
	   *
	   * @param Number aIdx
	   */
	  ArraySet.prototype.at = function ArraySet_at(aIdx) {
	    if (aIdx >= 0 && aIdx < this._array.length) {
	      return this._array[aIdx];
	    }
	    throw new Error('No element indexed by ' + aIdx);
	  };

	  /**
	   * Returns the array representation of this set (which has the proper indices
	   * indicated by indexOf). Note that this is a copy of the internal array used
	   * for storing the members so that no one can mess with internal state.
	   */
	  ArraySet.prototype.toArray = function ArraySet_toArray() {
	    return this._array.slice();
	  };

	  exports.ArraySet = ArraySet;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2014 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(50);

	  /**
	   * Determine whether mappingB is after mappingA with respect to generated
	   * position.
	   */
	  function generatedPositionAfter(mappingA, mappingB) {
	    // Optimized for most common case
	    var lineA = mappingA.generatedLine;
	    var lineB = mappingB.generatedLine;
	    var columnA = mappingA.generatedColumn;
	    var columnB = mappingB.generatedColumn;
	    return lineB > lineA || lineB == lineA && columnB >= columnA ||
	           util.compareByGeneratedPositions(mappingA, mappingB) <= 0;
	  }

	  /**
	   * A data structure to provide a sorted view of accumulated mappings in a
	   * performance conscious manner. It trades a neglibable overhead in general
	   * case for a large speedup in case of mappings being added in order.
	   */
	  function MappingList() {
	    this._array = [];
	    this._sorted = true;
	    // Serves as infimum
	    this._last = {generatedLine: -1, generatedColumn: 0};
	  }

	  /**
	   * Iterate through internal items. This method takes the same arguments that
	   * `Array.prototype.forEach` takes.
	   *
	   * NOTE: The order of the mappings is NOT guaranteed.
	   */
	  MappingList.prototype.unsortedForEach =
	    function MappingList_forEach(aCallback, aThisArg) {
	      this._array.forEach(aCallback, aThisArg);
	    };

	  /**
	   * Add the given source mapping.
	   *
	   * @param Object aMapping
	   */
	  MappingList.prototype.add = function MappingList_add(aMapping) {
	    var mapping;
	    if (generatedPositionAfter(this._last, aMapping)) {
	      this._last = aMapping;
	      this._array.push(aMapping);
	    } else {
	      this._sorted = false;
	      this._array.push(aMapping);
	    }
	  };

	  /**
	   * Returns the flat, sorted array of mappings. The mappings are sorted by
	   * generated position.
	   *
	   * WARNING: This method returns internal data without copying, for
	   * performance. The return value must NOT be mutated, and should be treated as
	   * an immutable borrow. If you want to take ownership, you must make your own
	   * copy.
	   */
	  MappingList.prototype.toArray = function MappingList_toArray() {
	    if (!this._sorted) {
	      this._array.sort(util.compareByGeneratedPositions);
	      this._sorted = true;
	    }
	    return this._array;
	  };

	  exports.MappingList = MappingList;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(50);

	  function SourceMapConsumer(aSourceMap) {
	    var sourceMap = aSourceMap;
	    if (typeof aSourceMap === 'string') {
	      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	    }

	    // We do late requires because the subclasses require() this file.
	    if (sourceMap.sections != null) {
	      var indexedSourceMapConsumer = __webpack_require__(54);
	      return new indexedSourceMapConsumer.IndexedSourceMapConsumer(sourceMap);
	    } else {
	      var basicSourceMapConsumer = __webpack_require__(56);
	      return new basicSourceMapConsumer.BasicSourceMapConsumer(sourceMap);
	    }
	  }

	  SourceMapConsumer.fromSourceMap = function(aSourceMap) {
	    var basicSourceMapConsumer = __webpack_require__(56);
	    return basicSourceMapConsumer.BasicSourceMapConsumer
	            .fromSourceMap(aSourceMap);
	  }

	  /**
	   * The version of the source mapping spec that we are consuming.
	   */
	  SourceMapConsumer.prototype._version = 3;


	  // `__generatedMappings` and `__originalMappings` are arrays that hold the
	  // parsed mapping coordinates from the source map's "mappings" attribute. They
	  // are lazily instantiated, accessed via the `_generatedMappings` and
	  // `_originalMappings` getters respectively, and we only parse the mappings
	  // and create these arrays once queried for a source location. We jump through
	  // these hoops because there can be many thousands of mappings, and parsing
	  // them is expensive, so we only want to do it if we must.
	  //
	  // Each object in the arrays is of the form:
	  //
	  //     {
	  //       generatedLine: The line number in the generated code,
	  //       generatedColumn: The column number in the generated code,
	  //       source: The path to the original source file that generated this
	  //               chunk of code,
	  //       originalLine: The line number in the original source that
	  //                     corresponds to this chunk of generated code,
	  //       originalColumn: The column number in the original source that
	  //                       corresponds to this chunk of generated code,
	  //       name: The name of the original symbol which generated this chunk of
	  //             code.
	  //     }
	  //
	  // All properties except for `generatedLine` and `generatedColumn` can be
	  // `null`.
	  //
	  // `_generatedMappings` is ordered by the generated positions.
	  //
	  // `_originalMappings` is ordered by the original positions.

	  SourceMapConsumer.prototype.__generatedMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_generatedMappings', {
	    get: function () {
	      if (!this.__generatedMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__generatedMappings;
	    }
	  });

	  SourceMapConsumer.prototype.__originalMappings = null;
	  Object.defineProperty(SourceMapConsumer.prototype, '_originalMappings', {
	    get: function () {
	      if (!this.__originalMappings) {
	        this.__generatedMappings = [];
	        this.__originalMappings = [];
	        this._parseMappings(this._mappings, this.sourceRoot);
	      }

	      return this.__originalMappings;
	    }
	  });

	  SourceMapConsumer.prototype._nextCharIsMappingSeparator =
	    function SourceMapConsumer_nextCharIsMappingSeparator(aStr) {
	      var c = aStr.charAt(0);
	      return c === ";" || c === ",";
	    };

	  /**
	   * Parse the mappings in a string in to a data structure which we can easily
	   * query (the ordered arrays in the `this.__generatedMappings` and
	   * `this.__originalMappings` properties).
	   */
	  SourceMapConsumer.prototype._parseMappings =
	    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	      throw new Error("Subclasses must implement _parseMappings");
	    };

	  SourceMapConsumer.GENERATED_ORDER = 1;
	  SourceMapConsumer.ORIGINAL_ORDER = 2;

	  /**
	   * Iterate over each mapping between an original source/line/column and a
	   * generated line/column in this source map.
	   *
	   * @param Function aCallback
	   *        The function that is called with each mapping.
	   * @param Object aContext
	   *        Optional. If specified, this object will be the value of `this` every
	   *        time that `aCallback` is called.
	   * @param aOrder
	   *        Either `SourceMapConsumer.GENERATED_ORDER` or
	   *        `SourceMapConsumer.ORIGINAL_ORDER`. Specifies whether you want to
	   *        iterate over the mappings sorted by the generated file's line/column
	   *        order or the original's source/line/column order, respectively. Defaults to
	   *        `SourceMapConsumer.GENERATED_ORDER`.
	   */
	  SourceMapConsumer.prototype.eachMapping =
	    function SourceMapConsumer_eachMapping(aCallback, aContext, aOrder) {
	      var context = aContext || null;
	      var order = aOrder || SourceMapConsumer.GENERATED_ORDER;

	      var mappings;
	      switch (order) {
	      case SourceMapConsumer.GENERATED_ORDER:
	        mappings = this._generatedMappings;
	        break;
	      case SourceMapConsumer.ORIGINAL_ORDER:
	        mappings = this._originalMappings;
	        break;
	      default:
	        throw new Error("Unknown order of iteration.");
	      }

	      var sourceRoot = this.sourceRoot;
	      mappings.map(function (mapping) {
	        var source = mapping.source;
	        if (source != null && sourceRoot != null) {
	          source = util.join(sourceRoot, source);
	        }
	        return {
	          source: source,
	          generatedLine: mapping.generatedLine,
	          generatedColumn: mapping.generatedColumn,
	          originalLine: mapping.originalLine,
	          originalColumn: mapping.originalColumn,
	          name: mapping.name
	        };
	      }).forEach(aCallback, context);
	    };

	  /**
	   * Returns all generated line and column information for the original source
	   * and line provided. The only argument is an object with the following
	   * properties:
	   *
	   *   - source: The filename of the original source.
	   *   - line: The line number in the original source.
	   *
	   * and an array of objects is returned, each with the following properties:
	   *
	   *   - line: The line number in the generated source, or null.
	   *   - column: The column number in the generated source, or null.
	   */
	  SourceMapConsumer.prototype.allGeneratedPositionsFor =
	    function SourceMapConsumer_allGeneratedPositionsFor(aArgs) {
	      // When there is no exact match, BasicSourceMapConsumer.prototype._findMapping
	      // returns the index of the closest mapping less than the needle. By
	      // setting needle.originalColumn to Infinity, we thus find the last
	      // mapping for the given line, provided such a mapping exists.
	      var needle = {
	        source: util.getArg(aArgs, 'source'),
	        originalLine: util.getArg(aArgs, 'line'),
	        originalColumn: Infinity
	      };

	      if (this.sourceRoot != null) {
	        needle.source = util.relative(this.sourceRoot, needle.source);
	      }

	      var mappings = [];

	      var index = this._findMapping(needle,
	                                    this._originalMappings,
	                                    "originalLine",
	                                    "originalColumn",
	                                    util.compareByOriginalPositions);
	      if (index >= 0) {
	        var mapping = this._originalMappings[index];

	        while (mapping && mapping.originalLine === needle.originalLine) {
	          mappings.push({
	            line: util.getArg(mapping, 'generatedLine', null),
	            column: util.getArg(mapping, 'generatedColumn', null),
	            lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	          });

	          mapping = this._originalMappings[--index];
	        }
	      }

	      return mappings.reverse();
	    };

	  exports.SourceMapConsumer = SourceMapConsumer;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(50);
	  var binarySearch = __webpack_require__(55);
	  var SourceMapConsumer = __webpack_require__(53).SourceMapConsumer;
	  var BasicSourceMapConsumer = __webpack_require__(56).BasicSourceMapConsumer;

	  /**
	   * An IndexedSourceMapConsumer instance represents a parsed source map which
	   * we can query for information. It differs from BasicSourceMapConsumer in
	   * that it takes "indexed" source maps (i.e. ones with a "sections" field) as
	   * input.
	   *
	   * The only parameter is a raw source map (either as a JSON string, or already
	   * parsed to an object). According to the spec for indexed source maps, they
	   * have the following attributes:
	   *
	   *   - version: Which version of the source map spec this map is following.
	   *   - file: Optional. The generated file this source map is associated with.
	   *   - sections: A list of section definitions.
	   *
	   * Each value under the "sections" field has two fields:
	   *   - offset: The offset into the original specified at which this section
	   *       begins to apply, defined as an object with a "line" and "column"
	   *       field.
	   *   - map: A source map definition. This source map could also be indexed,
	   *       but doesn't have to be.
	   *
	   * Instead of the "map" field, it's also possible to have a "url" field
	   * specifying a URL to retrieve a source map from, but that's currently
	   * unsupported.
	   *
	   * Here's an example source map, taken from the source map spec[0], but
	   * modified to omit a section which uses the "url" field.
	   *
	   *  {
	   *    version : 3,
	   *    file: "app.js",
	   *    sections: [{
	   *      offset: {line:100, column:10},
	   *      map: {
	   *        version : 3,
	   *        file: "section.js",
	   *        sources: ["foo.js", "bar.js"],
	   *        names: ["src", "maps", "are", "fun"],
	   *        mappings: "AAAA,E;;ABCDE;"
	   *      }
	   *    }],
	   *  }
	   *
	   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit#heading=h.535es3xeprgt
	   */
	  function IndexedSourceMapConsumer(aSourceMap) {
	    var sourceMap = aSourceMap;
	    if (typeof aSourceMap === 'string') {
	      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	    }

	    var version = util.getArg(sourceMap, 'version');
	    var sections = util.getArg(sourceMap, 'sections');

	    if (version != this._version) {
	      throw new Error('Unsupported version: ' + version);
	    }

	    var lastOffset = {
	      line: -1,
	      column: 0
	    };
	    this._sections = sections.map(function (s) {
	      if (s.url) {
	        // The url field will require support for asynchronicity.
	        // See https://github.com/mozilla/source-map/issues/16
	        throw new Error('Support for url field in sections not implemented.');
	      }
	      var offset = util.getArg(s, 'offset');
	      var offsetLine = util.getArg(offset, 'line');
	      var offsetColumn = util.getArg(offset, 'column');

	      if (offsetLine < lastOffset.line ||
	          (offsetLine === lastOffset.line && offsetColumn < lastOffset.column)) {
	        throw new Error('Section offsets must be ordered and non-overlapping.');
	      }
	      lastOffset = offset;

	      return {
	        generatedOffset: {
	          // The offset fields are 0-based, but we use 1-based indices when
	          // encoding/decoding from VLQ.
	          generatedLine: offsetLine + 1,
	          generatedColumn: offsetColumn + 1
	        },
	        consumer: new SourceMapConsumer(util.getArg(s, 'map'))
	      }
	    });
	  }

	  IndexedSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	  IndexedSourceMapConsumer.prototype.constructor = SourceMapConsumer;

	  /**
	   * The version of the source mapping spec that we are consuming.
	   */
	  IndexedSourceMapConsumer.prototype._version = 3;

	  /**
	   * The list of original sources.
	   */
	  Object.defineProperty(IndexedSourceMapConsumer.prototype, 'sources', {
	    get: function () {
	      var sources = [];
	      for (var i = 0; i < this._sections.length; i++) {
	        for (var j = 0; j < this._sections[i].consumer.sources.length; j++) {
	          sources.push(this._sections[i].consumer.sources[j]);
	        }
	      };
	      return sources;
	    }
	  });

	  /**
	   * Returns the original source, line, and column information for the generated
	   * source's line and column positions provided. The only argument is an object
	   * with the following properties:
	   *
	   *   - line: The line number in the generated source.
	   *   - column: The column number in the generated source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - source: The original source file, or null.
	   *   - line: The line number in the original source, or null.
	   *   - column: The column number in the original source, or null.
	   *   - name: The original identifier, or null.
	   */
	  IndexedSourceMapConsumer.prototype.originalPositionFor =
	    function IndexedSourceMapConsumer_originalPositionFor(aArgs) {
	      var needle = {
	        generatedLine: util.getArg(aArgs, 'line'),
	        generatedColumn: util.getArg(aArgs, 'column')
	      };

	      // Find the section containing the generated position we're trying to map
	      // to an original position.
	      var sectionIndex = binarySearch.search(needle, this._sections,
	        function(needle, section) {
	          var cmp = needle.generatedLine - section.generatedOffset.generatedLine;
	          if (cmp) {
	            return cmp;
	          }

	          return (needle.generatedColumn -
	                  section.generatedOffset.generatedColumn);
	        });
	      var section = this._sections[sectionIndex];

	      if (!section) {
	        return {
	          source: null,
	          line: null,
	          column: null,
	          name: null
	        };
	      }

	      return section.consumer.originalPositionFor({
	        line: needle.generatedLine -
	          (section.generatedOffset.generatedLine - 1),
	        column: needle.generatedColumn -
	          (section.generatedOffset.generatedLine === needle.generatedLine
	           ? section.generatedOffset.generatedColumn - 1
	           : 0)
	      });
	    };

	  /**
	   * Returns the original source content. The only argument is the url of the
	   * original source file. Returns null if no original source content is
	   * available.
	   */
	  IndexedSourceMapConsumer.prototype.sourceContentFor =
	    function IndexedSourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	      for (var i = 0; i < this._sections.length; i++) {
	        var section = this._sections[i];

	        var content = section.consumer.sourceContentFor(aSource, true);
	        if (content) {
	          return content;
	        }
	      }
	      if (nullOnMissing) {
	        return null;
	      }
	      else {
	        throw new Error('"' + aSource + '" is not in the SourceMap.');
	      }
	    };

	  /**
	   * Returns the generated line and column information for the original source,
	   * line, and column positions provided. The only argument is an object with
	   * the following properties:
	   *
	   *   - source: The filename of the original source.
	   *   - line: The line number in the original source.
	   *   - column: The column number in the original source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - line: The line number in the generated source, or null.
	   *   - column: The column number in the generated source, or null.
	   */
	  IndexedSourceMapConsumer.prototype.generatedPositionFor =
	    function IndexedSourceMapConsumer_generatedPositionFor(aArgs) {
	      for (var i = 0; i < this._sections.length; i++) {
	        var section = this._sections[i];

	        // Only consider this section if the requested source is in the list of
	        // sources of the consumer.
	        if (section.consumer.sources.indexOf(util.getArg(aArgs, 'source')) === -1) {
	          continue;
	        }
	        var generatedPosition = section.consumer.generatedPositionFor(aArgs);
	        if (generatedPosition) {
	          var ret = {
	            line: generatedPosition.line +
	              (section.generatedOffset.generatedLine - 1),
	            column: generatedPosition.column +
	              (section.generatedOffset.generatedLine === generatedPosition.line
	               ? section.generatedOffset.generatedColumn - 1
	               : 0)
	          };
	          return ret;
	        }
	      }

	      return {
	        line: null,
	        column: null
	      };
	    };

	  /**
	   * Parse the mappings in a string in to a data structure which we can easily
	   * query (the ordered arrays in the `this.__generatedMappings` and
	   * `this.__originalMappings` properties).
	   */
	  IndexedSourceMapConsumer.prototype._parseMappings =
	    function IndexedSourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	      this.__generatedMappings = [];
	      this.__originalMappings = [];
	      for (var i = 0; i < this._sections.length; i++) {
	        var section = this._sections[i];
	        var sectionMappings = section.consumer._generatedMappings;
	        for (var j = 0; j < sectionMappings.length; j++) {
	          var mapping = sectionMappings[i];

	          var source = mapping.source;
	          var sourceRoot = section.consumer.sourceRoot;

	          if (source != null && sourceRoot != null) {
	            source = util.join(sourceRoot, source);
	          }

	          // The mappings coming from the consumer for the section have
	          // generated positions relative to the start of the section, so we
	          // need to offset them to be relative to the start of the concatenated
	          // generated file.
	          var adjustedMapping = {
	            source: source,
	            generatedLine: mapping.generatedLine +
	              (section.generatedOffset.generatedLine - 1),
	            generatedColumn: mapping.column +
	              (section.generatedOffset.generatedLine === mapping.generatedLine)
	              ? section.generatedOffset.generatedColumn - 1
	              : 0,
	            originalLine: mapping.originalLine,
	            originalColumn: mapping.originalColumn,
	            name: mapping.name
	          };

	          this.__generatedMappings.push(adjustedMapping);
	          if (typeof adjustedMapping.originalLine === 'number') {
	            this.__originalMappings.push(adjustedMapping);
	          }
	        };
	      };

	    this.__generatedMappings.sort(util.compareByGeneratedPositions);
	    this.__originalMappings.sort(util.compareByOriginalPositions);
	  };

	  exports.IndexedSourceMapConsumer = IndexedSourceMapConsumer;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  /**
	   * Recursive implementation of binary search.
	   *
	   * @param aLow Indices here and lower do not contain the needle.
	   * @param aHigh Indices here and higher do not contain the needle.
	   * @param aNeedle The element being searched for.
	   * @param aHaystack The non-empty array being searched.
	   * @param aCompare Function which takes two elements and returns -1, 0, or 1.
	   */
	  function recursiveSearch(aLow, aHigh, aNeedle, aHaystack, aCompare) {
	    // This function terminates when one of the following is true:
	    //
	    //   1. We find the exact element we are looking for.
	    //
	    //   2. We did not find the exact element, but we can return the index of
	    //      the next closest element that is less than that element.
	    //
	    //   3. We did not find the exact element, and there is no next-closest
	    //      element which is less than the one we are searching for, so we
	    //      return -1.
	    var mid = Math.floor((aHigh - aLow) / 2) + aLow;
	    var cmp = aCompare(aNeedle, aHaystack[mid], true);
	    if (cmp === 0) {
	      // Found the element we are looking for.
	      return mid;
	    }
	    else if (cmp > 0) {
	      // aHaystack[mid] is greater than our needle.
	      if (aHigh - mid > 1) {
	        // The element is in the upper half.
	        return recursiveSearch(mid, aHigh, aNeedle, aHaystack, aCompare);
	      }
	      // We did not find an exact match, return the next closest one
	      // (termination case 2).
	      return mid;
	    }
	    else {
	      // aHaystack[mid] is less than our needle.
	      if (mid - aLow > 1) {
	        // The element is in the lower half.
	        return recursiveSearch(aLow, mid, aNeedle, aHaystack, aCompare);
	      }
	      // The exact needle element was not found in this haystack. Determine if
	      // we are in termination case (2) or (3) and return the appropriate thing.
	      return aLow < 0 ? -1 : aLow;
	    }
	  }

	  /**
	   * This is an implementation of binary search which will always try and return
	   * the index of next lowest value checked if there is no exact hit. This is
	   * because mappings between original and generated line/col pairs are single
	   * points, and there is an implicit region between each of them, so a miss
	   * just means that you aren't on the very start of a region.
	   *
	   * @param aNeedle The element you are looking for.
	   * @param aHaystack The array that is being searched.
	   * @param aCompare A function which takes the needle and an element in the
	   *     array and returns -1, 0, or 1 depending on whether the needle is less
	   *     than, equal to, or greater than the element, respectively.
	   */
	  exports.search = function search(aNeedle, aHaystack, aCompare) {
	    if (aHaystack.length === 0) {
	      return -1;
	    }
	    return recursiveSearch(-1, aHaystack.length, aNeedle, aHaystack, aCompare)
	  };

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var util = __webpack_require__(50);
	  var binarySearch = __webpack_require__(55);
	  var ArraySet = __webpack_require__(51).ArraySet;
	  var base64VLQ = __webpack_require__(48);
	  var SourceMapConsumer = __webpack_require__(53).SourceMapConsumer;

	  /**
	   * A BasicSourceMapConsumer instance represents a parsed source map which we can
	   * query for information about the original file positions by giving it a file
	   * position in the generated source.
	   *
	   * The only parameter is the raw source map (either as a JSON string, or
	   * already parsed to an object). According to the spec, source maps have the
	   * following attributes:
	   *
	   *   - version: Which version of the source map spec this map is following.
	   *   - sources: An array of URLs to the original source files.
	   *   - names: An array of identifiers which can be referrenced by individual mappings.
	   *   - sourceRoot: Optional. The URL root from which all sources are relative.
	   *   - sourcesContent: Optional. An array of contents of the original source files.
	   *   - mappings: A string of base64 VLQs which contain the actual mappings.
	   *   - file: Optional. The generated file this source map is associated with.
	   *
	   * Here is an example source map, taken from the source map spec[0]:
	   *
	   *     {
	   *       version : 3,
	   *       file: "out.js",
	   *       sourceRoot : "",
	   *       sources: ["foo.js", "bar.js"],
	   *       names: ["src", "maps", "are", "fun"],
	   *       mappings: "AA,AB;;ABCDE;"
	   *     }
	   *
	   * [0]: https://docs.google.com/document/d/1U1RGAehQwRypUTovF1KRlpiOFze0b-_2gc6fAH0KY0k/edit?pli=1#
	   */
	  function BasicSourceMapConsumer(aSourceMap) {
	    var sourceMap = aSourceMap;
	    if (typeof aSourceMap === 'string') {
	      sourceMap = JSON.parse(aSourceMap.replace(/^\)\]\}'/, ''));
	    }

	    var version = util.getArg(sourceMap, 'version');
	    var sources = util.getArg(sourceMap, 'sources');
	    // Sass 3.3 leaves out the 'names' array, so we deviate from the spec (which
	    // requires the array) to play nice here.
	    var names = util.getArg(sourceMap, 'names', []);
	    var sourceRoot = util.getArg(sourceMap, 'sourceRoot', null);
	    var sourcesContent = util.getArg(sourceMap, 'sourcesContent', null);
	    var mappings = util.getArg(sourceMap, 'mappings');
	    var file = util.getArg(sourceMap, 'file', null);

	    // Once again, Sass deviates from the spec and supplies the version as a
	    // string rather than a number, so we use loose equality checking here.
	    if (version != this._version) {
	      throw new Error('Unsupported version: ' + version);
	    }

	    // Some source maps produce relative source paths like "./foo.js" instead of
	    // "foo.js".  Normalize these first so that future comparisons will succeed.
	    // See bugzil.la/1090768.
	    sources = sources.map(util.normalize);

	    // Pass `true` below to allow duplicate names and sources. While source maps
	    // are intended to be compressed and deduplicated, the TypeScript compiler
	    // sometimes generates source maps with duplicates in them. See Github issue
	    // #72 and bugzil.la/889492.
	    this._names = ArraySet.fromArray(names, true);
	    this._sources = ArraySet.fromArray(sources, true);

	    this.sourceRoot = sourceRoot;
	    this.sourcesContent = sourcesContent;
	    this._mappings = mappings;
	    this.file = file;
	  }

	  BasicSourceMapConsumer.prototype = Object.create(SourceMapConsumer.prototype);
	  BasicSourceMapConsumer.prototype.consumer = SourceMapConsumer;

	  /**
	   * Create a BasicSourceMapConsumer from a SourceMapGenerator.
	   *
	   * @param SourceMapGenerator aSourceMap
	   *        The source map that will be consumed.
	   * @returns BasicSourceMapConsumer
	   */
	  BasicSourceMapConsumer.fromSourceMap =
	    function SourceMapConsumer_fromSourceMap(aSourceMap) {
	      var smc = Object.create(BasicSourceMapConsumer.prototype);

	      smc._names = ArraySet.fromArray(aSourceMap._names.toArray(), true);
	      smc._sources = ArraySet.fromArray(aSourceMap._sources.toArray(), true);
	      smc.sourceRoot = aSourceMap._sourceRoot;
	      smc.sourcesContent = aSourceMap._generateSourcesContent(smc._sources.toArray(),
	                                                              smc.sourceRoot);
	      smc.file = aSourceMap._file;

	      smc.__generatedMappings = aSourceMap._mappings.toArray().slice();
	      smc.__originalMappings = aSourceMap._mappings.toArray().slice()
	        .sort(util.compareByOriginalPositions);

	      return smc;
	    };

	  /**
	   * The version of the source mapping spec that we are consuming.
	   */
	  BasicSourceMapConsumer.prototype._version = 3;

	  /**
	   * The list of original sources.
	   */
	  Object.defineProperty(BasicSourceMapConsumer.prototype, 'sources', {
	    get: function () {
	      return this._sources.toArray().map(function (s) {
	        return this.sourceRoot != null ? util.join(this.sourceRoot, s) : s;
	      }, this);
	    }
	  });

	  /**
	   * Parse the mappings in a string in to a data structure which we can easily
	   * query (the ordered arrays in the `this.__generatedMappings` and
	   * `this.__originalMappings` properties).
	   */
	  BasicSourceMapConsumer.prototype._parseMappings =
	    function SourceMapConsumer_parseMappings(aStr, aSourceRoot) {
	      var generatedLine = 1;
	      var previousGeneratedColumn = 0;
	      var previousOriginalLine = 0;
	      var previousOriginalColumn = 0;
	      var previousSource = 0;
	      var previousName = 0;
	      var str = aStr;
	      var temp = {};
	      var mapping;

	      while (str.length > 0) {
	        if (str.charAt(0) === ';') {
	          generatedLine++;
	          str = str.slice(1);
	          previousGeneratedColumn = 0;
	        }
	        else if (str.charAt(0) === ',') {
	          str = str.slice(1);
	        }
	        else {
	          mapping = {};
	          mapping.generatedLine = generatedLine;

	          // Generated column.
	          base64VLQ.decode(str, temp);
	          mapping.generatedColumn = previousGeneratedColumn + temp.value;
	          previousGeneratedColumn = mapping.generatedColumn;
	          str = temp.rest;

	          if (str.length > 0 && !this._nextCharIsMappingSeparator(str)) {
	            // Original source.
	            base64VLQ.decode(str, temp);
	            mapping.source = this._sources.at(previousSource + temp.value);
	            previousSource += temp.value;
	            str = temp.rest;
	            if (str.length === 0 || this._nextCharIsMappingSeparator(str)) {
	              throw new Error('Found a source, but no line and column');
	            }

	            // Original line.
	            base64VLQ.decode(str, temp);
	            mapping.originalLine = previousOriginalLine + temp.value;
	            previousOriginalLine = mapping.originalLine;
	            // Lines are stored 0-based
	            mapping.originalLine += 1;
	            str = temp.rest;
	            if (str.length === 0 || this._nextCharIsMappingSeparator(str)) {
	              throw new Error('Found a source and line, but no column');
	            }

	            // Original column.
	            base64VLQ.decode(str, temp);
	            mapping.originalColumn = previousOriginalColumn + temp.value;
	            previousOriginalColumn = mapping.originalColumn;
	            str = temp.rest;

	            if (str.length > 0 && !this._nextCharIsMappingSeparator(str)) {
	              // Original name.
	              base64VLQ.decode(str, temp);
	              mapping.name = this._names.at(previousName + temp.value);
	              previousName += temp.value;
	              str = temp.rest;
	            }
	          }

	          this.__generatedMappings.push(mapping);
	          if (typeof mapping.originalLine === 'number') {
	            this.__originalMappings.push(mapping);
	          }
	        }
	      }

	      this.__generatedMappings.sort(util.compareByGeneratedPositions);
	      this.__originalMappings.sort(util.compareByOriginalPositions);
	    };

	  /**
	   * Find the mapping that best matches the hypothetical "needle" mapping that
	   * we are searching for in the given "haystack" of mappings.
	   */
	  BasicSourceMapConsumer.prototype._findMapping =
	    function SourceMapConsumer_findMapping(aNeedle, aMappings, aLineName,
	                                           aColumnName, aComparator) {
	      // To return the position we are searching for, we must first find the
	      // mapping for the given position and then return the opposite position it
	      // points to. Because the mappings are sorted, we can use binary search to
	      // find the best mapping.

	      if (aNeedle[aLineName] <= 0) {
	        throw new TypeError('Line must be greater than or equal to 1, got '
	                            + aNeedle[aLineName]);
	      }
	      if (aNeedle[aColumnName] < 0) {
	        throw new TypeError('Column must be greater than or equal to 0, got '
	                            + aNeedle[aColumnName]);
	      }

	      return binarySearch.search(aNeedle, aMappings, aComparator);
	    };

	  /**
	   * Compute the last column for each generated mapping. The last column is
	   * inclusive.
	   */
	  BasicSourceMapConsumer.prototype.computeColumnSpans =
	    function SourceMapConsumer_computeColumnSpans() {
	      for (var index = 0; index < this._generatedMappings.length; ++index) {
	        var mapping = this._generatedMappings[index];

	        // Mappings do not contain a field for the last generated columnt. We
	        // can come up with an optimistic estimate, however, by assuming that
	        // mappings are contiguous (i.e. given two consecutive mappings, the
	        // first mapping ends where the second one starts).
	        if (index + 1 < this._generatedMappings.length) {
	          var nextMapping = this._generatedMappings[index + 1];

	          if (mapping.generatedLine === nextMapping.generatedLine) {
	            mapping.lastGeneratedColumn = nextMapping.generatedColumn - 1;
	            continue;
	          }
	        }

	        // The last mapping for each line spans the entire line.
	        mapping.lastGeneratedColumn = Infinity;
	      }
	    };

	  /**
	   * Returns the original source, line, and column information for the generated
	   * source's line and column positions provided. The only argument is an object
	   * with the following properties:
	   *
	   *   - line: The line number in the generated source.
	   *   - column: The column number in the generated source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - source: The original source file, or null.
	   *   - line: The line number in the original source, or null.
	   *   - column: The column number in the original source, or null.
	   *   - name: The original identifier, or null.
	   */
	  BasicSourceMapConsumer.prototype.originalPositionFor =
	    function SourceMapConsumer_originalPositionFor(aArgs) {
	      var needle = {
	        generatedLine: util.getArg(aArgs, 'line'),
	        generatedColumn: util.getArg(aArgs, 'column')
	      };

	      var index = this._findMapping(needle,
	                                    this._generatedMappings,
	                                    "generatedLine",
	                                    "generatedColumn",
	                                    util.compareByGeneratedPositions);

	      if (index >= 0) {
	        var mapping = this._generatedMappings[index];

	        if (mapping.generatedLine === needle.generatedLine) {
	          var source = util.getArg(mapping, 'source', null);
	          if (source != null && this.sourceRoot != null) {
	            source = util.join(this.sourceRoot, source);
	          }
	          return {
	            source: source,
	            line: util.getArg(mapping, 'originalLine', null),
	            column: util.getArg(mapping, 'originalColumn', null),
	            name: util.getArg(mapping, 'name', null)
	          };
	        }
	      }

	      return {
	        source: null,
	        line: null,
	        column: null,
	        name: null
	      };
	    };

	  /**
	   * Returns the original source content. The only argument is the url of the
	   * original source file. Returns null if no original source content is
	   * availible.
	   */
	  BasicSourceMapConsumer.prototype.sourceContentFor =
	    function SourceMapConsumer_sourceContentFor(aSource, nullOnMissing) {
	      if (!this.sourcesContent) {
	        return null;
	      }

	      if (this.sourceRoot != null) {
	        aSource = util.relative(this.sourceRoot, aSource);
	      }

	      if (this._sources.has(aSource)) {
	        return this.sourcesContent[this._sources.indexOf(aSource)];
	      }

	      var url;
	      if (this.sourceRoot != null
	          && (url = util.urlParse(this.sourceRoot))) {
	        // XXX: file:// URIs and absolute paths lead to unexpected behavior for
	        // many users. We can help them out when they expect file:// URIs to
	        // behave like it would if they were running a local HTTP server. See
	        // https://bugzilla.mozilla.org/show_bug.cgi?id=885597.
	        var fileUriAbsPath = aSource.replace(/^file:\/\//, "");
	        if (url.scheme == "file"
	            && this._sources.has(fileUriAbsPath)) {
	          return this.sourcesContent[this._sources.indexOf(fileUriAbsPath)]
	        }

	        if ((!url.path || url.path == "/")
	            && this._sources.has("/" + aSource)) {
	          return this.sourcesContent[this._sources.indexOf("/" + aSource)];
	        }
	      }

	      // This function is used recursively from
	      // IndexedSourceMapConsumer.prototype.sourceContentFor. In that case, we
	      // don't want to throw if we can't find the source - we just want to
	      // return null, so we provide a flag to exit gracefully.
	      if (nullOnMissing) {
	        return null;
	      }
	      else {
	        throw new Error('"' + aSource + '" is not in the SourceMap.');
	      }
	    };

	  /**
	   * Returns the generated line and column information for the original source,
	   * line, and column positions provided. The only argument is an object with
	   * the following properties:
	   *
	   *   - source: The filename of the original source.
	   *   - line: The line number in the original source.
	   *   - column: The column number in the original source.
	   *
	   * and an object is returned with the following properties:
	   *
	   *   - line: The line number in the generated source, or null.
	   *   - column: The column number in the generated source, or null.
	   */
	  BasicSourceMapConsumer.prototype.generatedPositionFor =
	    function SourceMapConsumer_generatedPositionFor(aArgs) {
	      var needle = {
	        source: util.getArg(aArgs, 'source'),
	        originalLine: util.getArg(aArgs, 'line'),
	        originalColumn: util.getArg(aArgs, 'column')
	      };

	      if (this.sourceRoot != null) {
	        needle.source = util.relative(this.sourceRoot, needle.source);
	      }

	      var index = this._findMapping(needle,
	                                    this._originalMappings,
	                                    "originalLine",
	                                    "originalColumn",
	                                    util.compareByOriginalPositions);

	      if (index >= 0) {
	        var mapping = this._originalMappings[index];

	        return {
	          line: util.getArg(mapping, 'generatedLine', null),
	          column: util.getArg(mapping, 'generatedColumn', null),
	          lastColumn: util.getArg(mapping, 'lastGeneratedColumn', null)
	        };
	      }

	      return {
	        line: null,
	        column: null,
	        lastColumn: null
	      };
	    };

	  exports.BasicSourceMapConsumer = BasicSourceMapConsumer;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/* -*- Mode: js; js-indent-level: 2; -*- */
	/*
	 * Copyright 2011 Mozilla Foundation and contributors
	 * Licensed under the New BSD license. See LICENSE or:
	 * http://opensource.org/licenses/BSD-3-Clause
	 */
	if (false) {
	    var define = require('amdefine')(module, require);
	}
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function (require, exports, module) {

	  var SourceMapGenerator = __webpack_require__(47).SourceMapGenerator;
	  var util = __webpack_require__(50);

	  // Matches a Windows-style `\r\n` newline or a `\n` newline used by all other
	  // operating systems these days (capturing the result).
	  var REGEX_NEWLINE = /(\r?\n)/;

	  // Newline character code for charCodeAt() comparisons
	  var NEWLINE_CODE = 10;

	  // Private symbol for identifying `SourceNode`s when multiple versions of
	  // the source-map library are loaded. This MUST NOT CHANGE across
	  // versions!
	  var isSourceNode = "$$$isSourceNode$$$";

	  /**
	   * SourceNodes provide a way to abstract over interpolating/concatenating
	   * snippets of generated JavaScript source code while maintaining the line and
	   * column information associated with the original source code.
	   *
	   * @param aLine The original line number.
	   * @param aColumn The original column number.
	   * @param aSource The original source's filename.
	   * @param aChunks Optional. An array of strings which are snippets of
	   *        generated JS, or other SourceNodes.
	   * @param aName The original identifier.
	   */
	  function SourceNode(aLine, aColumn, aSource, aChunks, aName) {
	    this.children = [];
	    this.sourceContents = {};
	    this.line = aLine == null ? null : aLine;
	    this.column = aColumn == null ? null : aColumn;
	    this.source = aSource == null ? null : aSource;
	    this.name = aName == null ? null : aName;
	    this[isSourceNode] = true;
	    if (aChunks != null) this.add(aChunks);
	  }

	  /**
	   * Creates a SourceNode from generated code and a SourceMapConsumer.
	   *
	   * @param aGeneratedCode The generated code
	   * @param aSourceMapConsumer The SourceMap for the generated code
	   * @param aRelativePath Optional. The path that relative sources in the
	   *        SourceMapConsumer should be relative to.
	   */
	  SourceNode.fromStringWithSourceMap =
	    function SourceNode_fromStringWithSourceMap(aGeneratedCode, aSourceMapConsumer, aRelativePath) {
	      // The SourceNode we want to fill with the generated code
	      // and the SourceMap
	      var node = new SourceNode();

	      // All even indices of this array are one line of the generated code,
	      // while all odd indices are the newlines between two adjacent lines
	      // (since `REGEX_NEWLINE` captures its match).
	      // Processed fragments are removed from this array, by calling `shiftNextLine`.
	      var remainingLines = aGeneratedCode.split(REGEX_NEWLINE);
	      var shiftNextLine = function() {
	        var lineContents = remainingLines.shift();
	        // The last line of a file might not have a newline.
	        var newLine = remainingLines.shift() || "";
	        return lineContents + newLine;
	      };

	      // We need to remember the position of "remainingLines"
	      var lastGeneratedLine = 1, lastGeneratedColumn = 0;

	      // The generate SourceNodes we need a code range.
	      // To extract it current and last mapping is used.
	      // Here we store the last mapping.
	      var lastMapping = null;

	      aSourceMapConsumer.eachMapping(function (mapping) {
	        if (lastMapping !== null) {
	          // We add the code from "lastMapping" to "mapping":
	          // First check if there is a new line in between.
	          if (lastGeneratedLine < mapping.generatedLine) {
	            var code = "";
	            // Associate first line with "lastMapping"
	            addMappingWithCode(lastMapping, shiftNextLine());
	            lastGeneratedLine++;
	            lastGeneratedColumn = 0;
	            // The remaining code is added without mapping
	          } else {
	            // There is no new line in between.
	            // Associate the code between "lastGeneratedColumn" and
	            // "mapping.generatedColumn" with "lastMapping"
	            var nextLine = remainingLines[0];
	            var code = nextLine.substr(0, mapping.generatedColumn -
	                                          lastGeneratedColumn);
	            remainingLines[0] = nextLine.substr(mapping.generatedColumn -
	                                                lastGeneratedColumn);
	            lastGeneratedColumn = mapping.generatedColumn;
	            addMappingWithCode(lastMapping, code);
	            // No more remaining code, continue
	            lastMapping = mapping;
	            return;
	          }
	        }
	        // We add the generated code until the first mapping
	        // to the SourceNode without any mapping.
	        // Each line is added as separate string.
	        while (lastGeneratedLine < mapping.generatedLine) {
	          node.add(shiftNextLine());
	          lastGeneratedLine++;
	        }
	        if (lastGeneratedColumn < mapping.generatedColumn) {
	          var nextLine = remainingLines[0];
	          node.add(nextLine.substr(0, mapping.generatedColumn));
	          remainingLines[0] = nextLine.substr(mapping.generatedColumn);
	          lastGeneratedColumn = mapping.generatedColumn;
	        }
	        lastMapping = mapping;
	      }, this);
	      // We have processed all mappings.
	      if (remainingLines.length > 0) {
	        if (lastMapping) {
	          // Associate the remaining code in the current line with "lastMapping"
	          addMappingWithCode(lastMapping, shiftNextLine());
	        }
	        // and add the remaining lines without any mapping
	        node.add(remainingLines.join(""));
	      }

	      // Copy sourcesContent into SourceNode
	      aSourceMapConsumer.sources.forEach(function (sourceFile) {
	        var content = aSourceMapConsumer.sourceContentFor(sourceFile);
	        if (content != null) {
	          if (aRelativePath != null) {
	            sourceFile = util.join(aRelativePath, sourceFile);
	          }
	          node.setSourceContent(sourceFile, content);
	        }
	      });

	      return node;

	      function addMappingWithCode(mapping, code) {
	        if (mapping === null || mapping.source === undefined) {
	          node.add(code);
	        } else {
	          var source = aRelativePath
	            ? util.join(aRelativePath, mapping.source)
	            : mapping.source;
	          node.add(new SourceNode(mapping.originalLine,
	                                  mapping.originalColumn,
	                                  source,
	                                  code,
	                                  mapping.name));
	        }
	      }
	    };

	  /**
	   * Add a chunk of generated JS to this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.add = function SourceNode_add(aChunk) {
	    if (Array.isArray(aChunk)) {
	      aChunk.forEach(function (chunk) {
	        this.add(chunk);
	      }, this);
	    }
	    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	      if (aChunk) {
	        this.children.push(aChunk);
	      }
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Add a chunk of generated JS to the beginning of this source node.
	   *
	   * @param aChunk A string snippet of generated JS code, another instance of
	   *        SourceNode, or an array where each member is one of those things.
	   */
	  SourceNode.prototype.prepend = function SourceNode_prepend(aChunk) {
	    if (Array.isArray(aChunk)) {
	      for (var i = aChunk.length-1; i >= 0; i--) {
	        this.prepend(aChunk[i]);
	      }
	    }
	    else if (aChunk[isSourceNode] || typeof aChunk === "string") {
	      this.children.unshift(aChunk);
	    }
	    else {
	      throw new TypeError(
	        "Expected a SourceNode, string, or an array of SourceNodes and strings. Got " + aChunk
	      );
	    }
	    return this;
	  };

	  /**
	   * Walk over the tree of JS snippets in this node and its children. The
	   * walking function is called once for each snippet of JS and is passed that
	   * snippet and the its original associated source's line/column location.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walk = function SourceNode_walk(aFn) {
	    var chunk;
	    for (var i = 0, len = this.children.length; i < len; i++) {
	      chunk = this.children[i];
	      if (chunk[isSourceNode]) {
	        chunk.walk(aFn);
	      }
	      else {
	        if (chunk !== '') {
	          aFn(chunk, { source: this.source,
	                       line: this.line,
	                       column: this.column,
	                       name: this.name });
	        }
	      }
	    }
	  };

	  /**
	   * Like `String.prototype.join` except for SourceNodes. Inserts `aStr` between
	   * each of `this.children`.
	   *
	   * @param aSep The separator.
	   */
	  SourceNode.prototype.join = function SourceNode_join(aSep) {
	    var newChildren;
	    var i;
	    var len = this.children.length;
	    if (len > 0) {
	      newChildren = [];
	      for (i = 0; i < len-1; i++) {
	        newChildren.push(this.children[i]);
	        newChildren.push(aSep);
	      }
	      newChildren.push(this.children[i]);
	      this.children = newChildren;
	    }
	    return this;
	  };

	  /**
	   * Call String.prototype.replace on the very right-most source snippet. Useful
	   * for trimming whitespace from the end of a source node, etc.
	   *
	   * @param aPattern The pattern to replace.
	   * @param aReplacement The thing to replace the pattern with.
	   */
	  SourceNode.prototype.replaceRight = function SourceNode_replaceRight(aPattern, aReplacement) {
	    var lastChild = this.children[this.children.length - 1];
	    if (lastChild[isSourceNode]) {
	      lastChild.replaceRight(aPattern, aReplacement);
	    }
	    else if (typeof lastChild === 'string') {
	      this.children[this.children.length - 1] = lastChild.replace(aPattern, aReplacement);
	    }
	    else {
	      this.children.push(''.replace(aPattern, aReplacement));
	    }
	    return this;
	  };

	  /**
	   * Set the source content for a source file. This will be added to the SourceMapGenerator
	   * in the sourcesContent field.
	   *
	   * @param aSourceFile The filename of the source file
	   * @param aSourceContent The content of the source file
	   */
	  SourceNode.prototype.setSourceContent =
	    function SourceNode_setSourceContent(aSourceFile, aSourceContent) {
	      this.sourceContents[util.toSetString(aSourceFile)] = aSourceContent;
	    };

	  /**
	   * Walk over the tree of SourceNodes. The walking function is called for each
	   * source file content and is passed the filename and source content.
	   *
	   * @param aFn The traversal function.
	   */
	  SourceNode.prototype.walkSourceContents =
	    function SourceNode_walkSourceContents(aFn) {
	      for (var i = 0, len = this.children.length; i < len; i++) {
	        if (this.children[i][isSourceNode]) {
	          this.children[i].walkSourceContents(aFn);
	        }
	      }

	      var sources = Object.keys(this.sourceContents);
	      for (var i = 0, len = sources.length; i < len; i++) {
	        aFn(util.fromSetString(sources[i]), this.sourceContents[sources[i]]);
	      }
	    };

	  /**
	   * Return the string representation of this source node. Walks over the tree
	   * and concatenates all the various snippets together to one string.
	   */
	  SourceNode.prototype.toString = function SourceNode_toString() {
	    var str = "";
	    this.walk(function (chunk) {
	      str += chunk;
	    });
	    return str;
	  };

	  /**
	   * Returns the string representation of this source node along with a source
	   * map.
	   */
	  SourceNode.prototype.toStringWithSourceMap = function SourceNode_toStringWithSourceMap(aArgs) {
	    var generated = {
	      code: "",
	      line: 1,
	      column: 0
	    };
	    var map = new SourceMapGenerator(aArgs);
	    var sourceMappingActive = false;
	    var lastOriginalSource = null;
	    var lastOriginalLine = null;
	    var lastOriginalColumn = null;
	    var lastOriginalName = null;
	    this.walk(function (chunk, original) {
	      generated.code += chunk;
	      if (original.source !== null
	          && original.line !== null
	          && original.column !== null) {
	        if(lastOriginalSource !== original.source
	           || lastOriginalLine !== original.line
	           || lastOriginalColumn !== original.column
	           || lastOriginalName !== original.name) {
	          map.addMapping({
	            source: original.source,
	            original: {
	              line: original.line,
	              column: original.column
	            },
	            generated: {
	              line: generated.line,
	              column: generated.column
	            },
	            name: original.name
	          });
	        }
	        lastOriginalSource = original.source;
	        lastOriginalLine = original.line;
	        lastOriginalColumn = original.column;
	        lastOriginalName = original.name;
	        sourceMappingActive = true;
	      } else if (sourceMappingActive) {
	        map.addMapping({
	          generated: {
	            line: generated.line,
	            column: generated.column
	          }
	        });
	        lastOriginalSource = null;
	        sourceMappingActive = false;
	      }
	      for (var idx = 0, length = chunk.length; idx < length; idx++) {
	        if (chunk.charCodeAt(idx) === NEWLINE_CODE) {
	          generated.line++;
	          generated.column = 0;
	          // Mappings end at eol
	          if (idx + 1 === length) {
	            lastOriginalSource = null;
	            sourceMappingActive = false;
	          } else if (sourceMappingActive) {
	            map.addMapping({
	              source: original.source,
	              original: {
	                line: original.line,
	                column: original.column
	              },
	              generated: {
	                line: generated.line,
	                column: generated.column
	              },
	              name: original.name
	            });
	          }
	        } else {
	          generated.column++;
	        }
	      }
	    });
	    this.walkSourceContents(function (sourceFile, sourceContent) {
	      map.setSourceContent(sourceFile, sourceContent);
	    });

	    return { code: generated.code, map: map };
	  };

	  exports.SourceNode = SourceNode;

	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 58 */
/***/ function(module, exports) {

	module.exports = {
		"name": "escodegen",
		"description": "ECMAScript code generator",
		"homepage": "http://github.com/estools/escodegen",
		"main": "escodegen.js",
		"bin": {
			"esgenerate": "./bin/esgenerate.js",
			"escodegen": "./bin/escodegen.js"
		},
		"files": [
			"LICENSE.BSD",
			"LICENSE.source-map",
			"README.md",
			"bin",
			"escodegen.js",
			"package.json"
		],
		"version": "1.7.0",
		"engines": {
			"node": ">=0.10.0"
		},
		"maintainers": [
			{
				"name": "constellation",
				"email": "utatane.tea@gmail.com"
			},
			{
				"name": "michaelficarra",
				"email": "npm@michael.ficarra.me"
			}
		],
		"repository": {
			"type": "git",
			"url": "git+ssh://git@github.com/estools/escodegen.git"
		},
		"dependencies": {
			"estraverse": "^1.9.1",
			"esutils": "^2.0.2",
			"esprima": "^1.2.2",
			"optionator": "^0.5.0",
			"source-map": "~0.2.0"
		},
		"optionalDependencies": {
			"source-map": "~0.2.0"
		},
		"devDependencies": {
			"acorn-6to5": "^0.11.1-25",
			"bluebird": "^2.3.11",
			"bower-registry-client": "^0.2.1",
			"chai": "^1.10.0",
			"commonjs-everywhere": "^0.9.7",
			"esprima-moz": "1.0.0-dev-harmony-moz",
			"gulp": "^3.8.10",
			"gulp-eslint": "^0.2.0",
			"gulp-mocha": "^2.0.0",
			"semver": "^4.1.0"
		},
		"license": "BSD-2-Clause",
		"scripts": {
			"test": "gulp travis",
			"unit-test": "gulp test",
			"lint": "gulp lint",
			"release": "node tools/release.js",
			"build-min": "cjsify -ma path: tools/entry-point.js > escodegen.browser.min.js",
			"build": "cjsify -a path: tools/entry-point.js > escodegen.browser.js"
		},
		"gitHead": "5dabbc5441b396febd0afb9252a9afdfa7051657",
		"bugs": {
			"url": "https://github.com/estools/escodegen/issues"
		},
		"_id": "escodegen@1.7.0",
		"_shasum": "4e299d8cc33087b7f29c19e2b9e84362abe35453",
		"_from": "escodegen@>=1.6.1 <2.0.0",
		"_npmVersion": "2.11.3",
		"_nodeVersion": "0.12.7",
		"_npmUser": {
			"name": "michaelficarra",
			"email": "npm@michael.ficarra.me"
		},
		"dist": {
			"shasum": "4e299d8cc33087b7f29c19e2b9e84362abe35453",
			"tarball": "http://registry.npmjs.org/escodegen/-/escodegen-1.7.0.tgz"
		},
		"directories": {},
		"_resolved": "https://registry.npmjs.org/escodegen/-/escodegen-1.7.0.tgz",
		"readme": "ERROR: No README data found!"
	};

/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	var require;var require;(function(f){if(true){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.acorn = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
	// A recursive descent parser operates by defining functions for all
	// syntactic elements, and recursively calling those, each function
	// advancing the input stream and returning an AST node. Precedence
	// of constructs (for example, the fact that `!x[1]` means `!(x[1])`
	// instead of `(!x)[1]` is handled by the fact that the parser
	// function that parses unary prefix operators is called first, and
	// in turn calls the function that parses `[]` subscripts — that
	// way, it'll receive the node for `x[1]` already parsed, and wraps
	// *that* in the unary operator node.
	//
	// Acorn uses an [operator precedence parser][opp] to handle binary
	// operator precedence, because it is much more compact than using
	// the technique outlined above, which uses different, nesting
	// functions to specify precedence, for all of the ten binary
	// precedence levels that JavaScript defines.
	//
	// [opp]: http://en.wikipedia.org/wiki/Operator-precedence_parser

	"use strict";

	var _tokentype = _dereq_("./tokentype");

	var _state = _dereq_("./state");

	var pp = _state.Parser.prototype;

	// Check if property name clashes with already added.
	// Object/class getters and setters are not allowed to clash —
	// either with each other or with an init property — and in
	// strict mode, init properties are also not allowed to be repeated.

	pp.checkPropClash = function (prop, propHash) {
	  if (this.options.ecmaVersion >= 6 && (prop.computed || prop.method || prop.shorthand)) return;
	  var key = prop.key;var name = undefined;
	  switch (key.type) {
	    case "Identifier":
	      name = key.name;break;
	    case "Literal":
	      name = String(key.value);break;
	    default:
	      return;
	  }
	  var kind = prop.kind;

	  if (this.options.ecmaVersion >= 6) {
	    if (name === "__proto__" && kind === "init") {
	      if (propHash.proto) this.raise(key.start, "Redefinition of __proto__ property");
	      propHash.proto = true;
	    }
	    return;
	  }
	  name = "$" + name;
	  var other = propHash[name];
	  if (other) {
	    var isGetSet = kind !== "init";
	    if ((this.strict || isGetSet) && other[kind] || !(isGetSet ^ other.init)) this.raise(key.start, "Redefinition of property");
	  } else {
	    other = propHash[name] = {
	      init: false,
	      get: false,
	      set: false
	    };
	  }
	  other[kind] = true;
	};

	// ### Expression parsing

	// These nest, from the most general expression type at the top to
	// 'atomic', nondivisible expression types at the bottom. Most of
	// the functions will simply let the function(s) below them parse,
	// and, *if* the syntactic construct they handle is present, wrap
	// the AST node that the inner parser gave them in another node.

	// Parse a full expression. The optional arguments are used to
	// forbid the `in` operator (in for loops initalization expressions)
	// and provide reference for storing '=' operator inside shorthand
	// property assignment in contexts where both object expression
	// and object pattern might appear (so it's possible to raise
	// delayed syntax error at correct position).

	pp.parseExpression = function (noIn, refShorthandDefaultPos) {
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  var expr = this.parseMaybeAssign(noIn, refShorthandDefaultPos);
	  if (this.type === _tokentype.types.comma) {
	    var node = this.startNodeAt(startPos, startLoc);
	    node.expressions = [expr];
	    while (this.eat(_tokentype.types.comma)) node.expressions.push(this.parseMaybeAssign(noIn, refShorthandDefaultPos));
	    return this.finishNode(node, "SequenceExpression");
	  }
	  return expr;
	};

	// Parse an assignment expression. This includes applications of
	// operators like `+=`.

	pp.parseMaybeAssign = function (noIn, refShorthandDefaultPos, afterLeftParse) {
	  if (this.type == _tokentype.types._yield && this.inGenerator) return this.parseYield();

	  var failOnShorthandAssign = undefined;
	  if (!refShorthandDefaultPos) {
	    refShorthandDefaultPos = { start: 0 };
	    failOnShorthandAssign = true;
	  } else {
	    failOnShorthandAssign = false;
	  }
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  if (this.type == _tokentype.types.parenL || this.type == _tokentype.types.name) this.potentialArrowAt = this.start;
	  var left = this.parseMaybeConditional(noIn, refShorthandDefaultPos);
	  if (afterLeftParse) left = afterLeftParse.call(this, left, startPos, startLoc);
	  if (this.type.isAssign) {
	    var node = this.startNodeAt(startPos, startLoc);
	    node.operator = this.value;
	    node.left = this.type === _tokentype.types.eq ? this.toAssignable(left) : left;
	    refShorthandDefaultPos.start = 0; // reset because shorthand default was used correctly
	    this.checkLVal(left);
	    this.next();
	    node.right = this.parseMaybeAssign(noIn);
	    return this.finishNode(node, "AssignmentExpression");
	  } else if (failOnShorthandAssign && refShorthandDefaultPos.start) {
	    this.unexpected(refShorthandDefaultPos.start);
	  }
	  return left;
	};

	// Parse a ternary conditional (`?:`) operator.

	pp.parseMaybeConditional = function (noIn, refShorthandDefaultPos) {
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  var expr = this.parseExprOps(noIn, refShorthandDefaultPos);
	  if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
	  if (this.eat(_tokentype.types.question)) {
	    var node = this.startNodeAt(startPos, startLoc);
	    node.test = expr;
	    node.consequent = this.parseMaybeAssign();
	    this.expect(_tokentype.types.colon);
	    node.alternate = this.parseMaybeAssign(noIn);
	    return this.finishNode(node, "ConditionalExpression");
	  }
	  return expr;
	};

	// Start the precedence parser.

	pp.parseExprOps = function (noIn, refShorthandDefaultPos) {
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  var expr = this.parseMaybeUnary(refShorthandDefaultPos);
	  if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
	  return this.parseExprOp(expr, startPos, startLoc, -1, noIn);
	};

	// Parse binary operators with the operator precedence parsing
	// algorithm. `left` is the left-hand side of the operator.
	// `minPrec` provides context that allows the function to stop and
	// defer further parser to one of its callers when it encounters an
	// operator that has a lower precedence than the set it is parsing.

	pp.parseExprOp = function (left, leftStartPos, leftStartLoc, minPrec, noIn) {
	  var prec = this.type.binop;
	  if (prec != null && (!noIn || this.type !== _tokentype.types._in)) {
	    if (prec > minPrec) {
	      var node = this.startNodeAt(leftStartPos, leftStartLoc);
	      node.left = left;
	      node.operator = this.value;
	      var op = this.type;
	      this.next();
	      var startPos = this.start,
	          startLoc = this.startLoc;
	      node.right = this.parseExprOp(this.parseMaybeUnary(), startPos, startLoc, prec, noIn);
	      this.finishNode(node, op === _tokentype.types.logicalOR || op === _tokentype.types.logicalAND ? "LogicalExpression" : "BinaryExpression");
	      return this.parseExprOp(node, leftStartPos, leftStartLoc, minPrec, noIn);
	    }
	  }
	  return left;
	};

	// Parse unary operators, both prefix and postfix.

	pp.parseMaybeUnary = function (refShorthandDefaultPos) {
	  if (this.type.prefix) {
	    var node = this.startNode(),
	        update = this.type === _tokentype.types.incDec;
	    node.operator = this.value;
	    node.prefix = true;
	    this.next();
	    node.argument = this.parseMaybeUnary();
	    if (refShorthandDefaultPos && refShorthandDefaultPos.start) this.unexpected(refShorthandDefaultPos.start);
	    if (update) this.checkLVal(node.argument);else if (this.strict && node.operator === "delete" && node.argument.type === "Identifier") this.raise(node.start, "Deleting local variable in strict mode");
	    return this.finishNode(node, update ? "UpdateExpression" : "UnaryExpression");
	  }
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  var expr = this.parseExprSubscripts(refShorthandDefaultPos);
	  if (refShorthandDefaultPos && refShorthandDefaultPos.start) return expr;
	  while (this.type.postfix && !this.canInsertSemicolon()) {
	    var node = this.startNodeAt(startPos, startLoc);
	    node.operator = this.value;
	    node.prefix = false;
	    node.argument = expr;
	    this.checkLVal(expr);
	    this.next();
	    expr = this.finishNode(node, "UpdateExpression");
	  }
	  return expr;
	};

	// Parse call, dot, and `[]`-subscript expressions.

	pp.parseExprSubscripts = function (refShorthandDefaultPos) {
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  var expr = this.parseExprAtom(refShorthandDefaultPos);
	  var skipArrowSubscripts = expr.type === "ArrowFunctionExpression" && this.input.slice(this.lastTokStart, this.lastTokEnd) !== ")";
	  if (refShorthandDefaultPos && refShorthandDefaultPos.start || skipArrowSubscripts) return expr;
	  return this.parseSubscripts(expr, startPos, startLoc);
	};

	pp.parseSubscripts = function (base, startPos, startLoc, noCalls) {
	  for (;;) {
	    if (this.eat(_tokentype.types.dot)) {
	      var node = this.startNodeAt(startPos, startLoc);
	      node.object = base;
	      node.property = this.parseIdent(true);
	      node.computed = false;
	      base = this.finishNode(node, "MemberExpression");
	    } else if (this.eat(_tokentype.types.bracketL)) {
	      var node = this.startNodeAt(startPos, startLoc);
	      node.object = base;
	      node.property = this.parseExpression();
	      node.computed = true;
	      this.expect(_tokentype.types.bracketR);
	      base = this.finishNode(node, "MemberExpression");
	    } else if (!noCalls && this.eat(_tokentype.types.parenL)) {
	      var node = this.startNodeAt(startPos, startLoc);
	      node.callee = base;
	      node.arguments = this.parseExprList(_tokentype.types.parenR, false);
	      base = this.finishNode(node, "CallExpression");
	    } else if (this.type === _tokentype.types.backQuote) {
	      var node = this.startNodeAt(startPos, startLoc);
	      node.tag = base;
	      node.quasi = this.parseTemplate();
	      base = this.finishNode(node, "TaggedTemplateExpression");
	    } else {
	      return base;
	    }
	  }
	};

	// Parse an atomic expression — either a single token that is an
	// expression, an expression started by a keyword like `function` or
	// `new`, or an expression wrapped in punctuation like `()`, `[]`,
	// or `{}`.

	pp.parseExprAtom = function (refShorthandDefaultPos) {
	  var node = undefined,
	      canBeArrow = this.potentialArrowAt == this.start;
	  switch (this.type) {
	    case _tokentype.types._super:
	      if (!this.inFunction) this.raise(this.start, "'super' outside of function or class");
	    case _tokentype.types._this:
	      var type = this.type === _tokentype.types._this ? "ThisExpression" : "Super";
	      node = this.startNode();
	      this.next();
	      return this.finishNode(node, type);

	    case _tokentype.types._yield:
	      if (this.inGenerator) this.unexpected();

	    case _tokentype.types.name:
	      var startPos = this.start,
	          startLoc = this.startLoc;
	      var id = this.parseIdent(this.type !== _tokentype.types.name);
	      if (canBeArrow && !this.canInsertSemicolon() && this.eat(_tokentype.types.arrow)) return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), [id]);
	      return id;

	    case _tokentype.types.regexp:
	      var value = this.value;
	      node = this.parseLiteral(value.value);
	      node.regex = { pattern: value.pattern, flags: value.flags };
	      return node;

	    case _tokentype.types.num:case _tokentype.types.string:
	      return this.parseLiteral(this.value);

	    case _tokentype.types._null:case _tokentype.types._true:case _tokentype.types._false:
	      node = this.startNode();
	      node.value = this.type === _tokentype.types._null ? null : this.type === _tokentype.types._true;
	      node.raw = this.type.keyword;
	      this.next();
	      return this.finishNode(node, "Literal");

	    case _tokentype.types.parenL:
	      return this.parseParenAndDistinguishExpression(canBeArrow);

	    case _tokentype.types.bracketL:
	      node = this.startNode();
	      this.next();
	      // check whether this is array comprehension or regular array
	      if (this.options.ecmaVersion >= 7 && this.type === _tokentype.types._for) {
	        return this.parseComprehension(node, false);
	      }
	      node.elements = this.parseExprList(_tokentype.types.bracketR, true, true, refShorthandDefaultPos);
	      return this.finishNode(node, "ArrayExpression");

	    case _tokentype.types.braceL:
	      return this.parseObj(false, refShorthandDefaultPos);

	    case _tokentype.types._function:
	      node = this.startNode();
	      this.next();
	      return this.parseFunction(node, false);

	    case _tokentype.types._class:
	      return this.parseClass(this.startNode(), false);

	    case _tokentype.types._new:
	      return this.parseNew();

	    case _tokentype.types.backQuote:
	      return this.parseTemplate();

	    default:
	      this.unexpected();
	  }
	};

	pp.parseLiteral = function (value) {
	  var node = this.startNode();
	  node.value = value;
	  node.raw = this.input.slice(this.start, this.end);
	  this.next();
	  return this.finishNode(node, "Literal");
	};

	pp.parseParenExpression = function () {
	  this.expect(_tokentype.types.parenL);
	  var val = this.parseExpression();
	  this.expect(_tokentype.types.parenR);
	  return val;
	};

	pp.parseParenAndDistinguishExpression = function (canBeArrow) {
	  var startPos = this.start,
	      startLoc = this.startLoc,
	      val = undefined;
	  if (this.options.ecmaVersion >= 6) {
	    this.next();

	    if (this.options.ecmaVersion >= 7 && this.type === _tokentype.types._for) {
	      return this.parseComprehension(this.startNodeAt(startPos, startLoc), true);
	    }

	    var innerStartPos = this.start,
	        innerStartLoc = this.startLoc;
	    var exprList = [],
	        first = true;
	    var refShorthandDefaultPos = { start: 0 },
	        spreadStart = undefined,
	        innerParenStart = undefined;
	    while (this.type !== _tokentype.types.parenR) {
	      first ? first = false : this.expect(_tokentype.types.comma);
	      if (this.type === _tokentype.types.ellipsis) {
	        spreadStart = this.start;
	        exprList.push(this.parseParenItem(this.parseRest()));
	        break;
	      } else {
	        if (this.type === _tokentype.types.parenL && !innerParenStart) {
	          innerParenStart = this.start;
	        }
	        exprList.push(this.parseMaybeAssign(false, refShorthandDefaultPos, this.parseParenItem));
	      }
	    }
	    var innerEndPos = this.start,
	        innerEndLoc = this.startLoc;
	    this.expect(_tokentype.types.parenR);

	    if (canBeArrow && !this.canInsertSemicolon() && this.eat(_tokentype.types.arrow)) {
	      if (innerParenStart) this.unexpected(innerParenStart);
	      return this.parseParenArrowList(startPos, startLoc, exprList);
	    }

	    if (!exprList.length) this.unexpected(this.lastTokStart);
	    if (spreadStart) this.unexpected(spreadStart);
	    if (refShorthandDefaultPos.start) this.unexpected(refShorthandDefaultPos.start);

	    if (exprList.length > 1) {
	      val = this.startNodeAt(innerStartPos, innerStartLoc);
	      val.expressions = exprList;
	      this.finishNodeAt(val, "SequenceExpression", innerEndPos, innerEndLoc);
	    } else {
	      val = exprList[0];
	    }
	  } else {
	    val = this.parseParenExpression();
	  }

	  if (this.options.preserveParens) {
	    var par = this.startNodeAt(startPos, startLoc);
	    par.expression = val;
	    return this.finishNode(par, "ParenthesizedExpression");
	  } else {
	    return val;
	  }
	};

	pp.parseParenItem = function (item) {
	  return item;
	};

	pp.parseParenArrowList = function (startPos, startLoc, exprList) {
	  return this.parseArrowExpression(this.startNodeAt(startPos, startLoc), exprList);
	};

	// New's precedence is slightly tricky. It must allow its argument
	// to be a `[]` or dot subscript expression, but not a call — at
	// least, not without wrapping it in parentheses. Thus, it uses the

	var empty = [];

	pp.parseNew = function () {
	  var node = this.startNode();
	  var meta = this.parseIdent(true);
	  if (this.options.ecmaVersion >= 6 && this.eat(_tokentype.types.dot)) {
	    node.meta = meta;
	    node.property = this.parseIdent(true);
	    if (node.property.name !== "target") this.raise(node.property.start, "The only valid meta property for new is new.target");
	    if (!this.inFunction) this.raise(node.start, "new.target can only be used in functions");
	    return this.finishNode(node, "MetaProperty");
	  }
	  var startPos = this.start,
	      startLoc = this.startLoc;
	  node.callee = this.parseSubscripts(this.parseExprAtom(), startPos, startLoc, true);
	  if (this.eat(_tokentype.types.parenL)) node.arguments = this.parseExprList(_tokentype.types.parenR, false);else node.arguments = empty;
	  return this.finishNode(node, "NewExpression");
	};

	// Parse template expression.

	pp.parseTemplateElement = function () {
	  var elem = this.startNode();
	  elem.value = {
	    raw: this.input.slice(this.start, this.end).replace(/\r\n?/g, '\n'),
	    cooked: this.value
	  };
	  this.next();
	  elem.tail = this.type === _tokentype.types.backQuote;
	  return this.finishNode(elem, "TemplateElement");
	};

	pp.parseTemplate = function () {
	  var node = this.startNode();
	  this.next();
	  node.expressions = [];
	  var curElt = this.parseTemplateElement();
	  node.quasis = [curElt];
	  while (!curElt.tail) {
	    this.expect(_tokentype.types.dollarBraceL);
	    node.expressions.push(this.parseExpression());
	    this.expect(_tokentype.types.braceR);
	    node.quasis.push(curElt = this.parseTemplateElement());
	  }
	  this.next();
	  return this.finishNode(node, "TemplateLiteral");
	};

	// Parse an object literal or binding pattern.

	pp.parseObj = function (isPattern, refShorthandDefaultPos) {
	  var node = this.startNode(),
	      first = true,
	      propHash = {};
	  node.properties = [];
	  this.next();
	  while (!this.eat(_tokentype.types.braceR)) {
	    if (!first) {
	      this.expect(_tokentype.types.comma);
	      if (this.afterTrailingComma(_tokentype.types.braceR)) break;
	    } else first = false;

	    var prop = this.startNode(),
	        isGenerator = undefined,
	        startPos = undefined,
	        startLoc = undefined;
	    if (this.options.ecmaVersion >= 6) {
	      prop.method = false;
	      prop.shorthand = false;
	      if (isPattern || refShorthandDefaultPos) {
	        startPos = this.start;
	        startLoc = this.startLoc;
	      }
	      if (!isPattern) isGenerator = this.eat(_tokentype.types.star);
	    }
	    this.parsePropertyName(prop);
	    this.parsePropertyValue(prop, isPattern, isGenerator, startPos, startLoc, refShorthandDefaultPos);
	    this.checkPropClash(prop, propHash);
	    node.properties.push(this.finishNode(prop, "Property"));
	  }
	  return this.finishNode(node, isPattern ? "ObjectPattern" : "ObjectExpression");
	};

	pp.parsePropertyValue = function (prop, isPattern, isGenerator, startPos, startLoc, refShorthandDefaultPos) {
	  if (this.eat(_tokentype.types.colon)) {
	    prop.value = isPattern ? this.parseMaybeDefault(this.start, this.startLoc) : this.parseMaybeAssign(false, refShorthandDefaultPos);
	    prop.kind = "init";
	  } else if (this.options.ecmaVersion >= 6 && this.type === _tokentype.types.parenL) {
	    if (isPattern) this.unexpected();
	    prop.kind = "init";
	    prop.method = true;
	    prop.value = this.parseMethod(isGenerator);
	  } else if (this.options.ecmaVersion >= 5 && !prop.computed && prop.key.type === "Identifier" && (prop.key.name === "get" || prop.key.name === "set") && (this.type != _tokentype.types.comma && this.type != _tokentype.types.braceR)) {
	    if (isGenerator || isPattern) this.unexpected();
	    prop.kind = prop.key.name;
	    this.parsePropertyName(prop);
	    prop.value = this.parseMethod(false);
	    var paramCount = prop.kind === "get" ? 0 : 1;
	    if (prop.value.params.length !== paramCount) {
	      var start = prop.value.start;
	      if (prop.kind === "get") this.raise(start, "getter should have no params");else this.raise(start, "setter should have exactly one param");
	    }
	  } else if (this.options.ecmaVersion >= 6 && !prop.computed && prop.key.type === "Identifier") {
	    prop.kind = "init";
	    if (isPattern) {
	      if (this.keywords.test(prop.key.name) || (this.strict ? this.reservedWordsStrictBind : this.reservedWords).test(prop.key.name)) this.raise(prop.key.start, "Binding " + prop.key.name);
	      prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
	    } else if (this.type === _tokentype.types.eq && refShorthandDefaultPos) {
	      if (!refShorthandDefaultPos.start) refShorthandDefaultPos.start = this.start;
	      prop.value = this.parseMaybeDefault(startPos, startLoc, prop.key);
	    } else {
	      prop.value = prop.key;
	    }
	    prop.shorthand = true;
	  } else this.unexpected();
	};

	pp.parsePropertyName = function (prop) {
	  if (this.options.ecmaVersion >= 6) {
	    if (this.eat(_tokentype.types.bracketL)) {
	      prop.computed = true;
	      prop.key = this.parseMaybeAssign();
	      this.expect(_tokentype.types.bracketR);
	      return prop.key;
	    } else {
	      prop.computed = false;
	    }
	  }
	  return prop.key = this.type === _tokentype.types.num || this.type === _tokentype.types.string ? this.parseExprAtom() : this.parseIdent(true);
	};

	// Initialize empty function node.

	pp.initFunction = function (node) {
	  node.id = null;
	  if (this.options.ecmaVersion >= 6) {
	    node.generator = false;
	    node.expression = false;
	  }
	};

	// Parse object or class method.

	pp.parseMethod = function (isGenerator) {
	  var node = this.startNode();
	  this.initFunction(node);
	  this.expect(_tokentype.types.parenL);
	  node.params = this.parseBindingList(_tokentype.types.parenR, false, false);
	  if (this.options.ecmaVersion >= 6) node.generator = isGenerator;
	  this.parseFunctionBody(node, false);
	  return this.finishNode(node, "FunctionExpression");
	};

	// Parse arrow function expression with given parameters.

	pp.parseArrowExpression = function (node, params) {
	  this.initFunction(node);
	  node.params = this.toAssignableList(params, true);
	  this.parseFunctionBody(node, true);
	  return this.finishNode(node, "ArrowFunctionExpression");
	};

	// Parse function body and check parameters.

	pp.parseFunctionBody = function (node, isArrowFunction) {
	  var isExpression = isArrowFunction && this.type !== _tokentype.types.braceL;

	  if (isExpression) {
	    node.body = this.parseMaybeAssign();
	    node.expression = true;
	  } else {
	    // Start a new scope with regard to labels and the `inFunction`
	    // flag (restore them to their old value afterwards).
	    var oldInFunc = this.inFunction,
	        oldInGen = this.inGenerator,
	        oldLabels = this.labels;
	    this.inFunction = true;this.inGenerator = node.generator;this.labels = [];
	    node.body = this.parseBlock(true);
	    node.expression = false;
	    this.inFunction = oldInFunc;this.inGenerator = oldInGen;this.labels = oldLabels;
	  }

	  // If this is a strict mode function, verify that argument names
	  // are not repeated, and it does not try to bind the words `eval`
	  // or `arguments`.
	  if (this.strict || !isExpression && node.body.body.length && this.isUseStrict(node.body.body[0])) {
	    var oldStrict = this.strict;
	    this.strict = true;
	    if (node.id) this.checkLVal(node.id, true);
	    this.checkParams(node);
	    this.strict = oldStrict;
	  } else if (isArrowFunction) {
	    this.checkParams(node);
	  }
	};

	// Checks function params for various disallowed patterns such as using "eval"
	// or "arguments" and duplicate parameters.

	pp.checkParams = function (node) {
	  var nameHash = {};
	  for (var i = 0; i < node.params.length; i++) {
	    this.checkLVal(node.params[i], true, nameHash);
	  }
	};

	// Parses a comma-separated list of expressions, and returns them as
	// an array. `close` is the token type that ends the list, and
	// `allowEmpty` can be turned on to allow subsequent commas with
	// nothing in between them to be parsed as `null` (which is needed
	// for array literals).

	pp.parseExprList = function (close, allowTrailingComma, allowEmpty, refShorthandDefaultPos) {
	  var elts = [],
	      first = true;
	  while (!this.eat(close)) {
	    if (!first) {
	      this.expect(_tokentype.types.comma);
	      if (allowTrailingComma && this.afterTrailingComma(close)) break;
	    } else first = false;

	    var elt = undefined;
	    if (allowEmpty && this.type === _tokentype.types.comma) elt = null;else if (this.type === _tokentype.types.ellipsis) elt = this.parseSpread(refShorthandDefaultPos);else elt = this.parseMaybeAssign(false, refShorthandDefaultPos);
	    elts.push(elt);
	  }
	  return elts;
	};

	// Parse the next token as an identifier. If `liberal` is true (used
	// when parsing properties), it will also convert keywords into
	// identifiers.

	pp.parseIdent = function (liberal) {
	  var node = this.startNode();
	  if (liberal && this.options.allowReserved == "never") liberal = false;
	  if (this.type === _tokentype.types.name) {
	    if (!liberal && (this.strict ? this.reservedWordsStrict : this.reservedWords).test(this.value) && (this.options.ecmaVersion >= 6 || this.input.slice(this.start, this.end).indexOf("\\") == -1)) this.raise(this.start, "The keyword '" + this.value + "' is reserved");
	    node.name = this.value;
	  } else if (liberal && this.type.keyword) {
	    node.name = this.type.keyword;
	  } else {
	    this.unexpected();
	  }
	  this.next();
	  return this.finishNode(node, "Identifier");
	};

	// Parses yield expression inside generator.

	pp.parseYield = function () {
	  var node = this.startNode();
	  this.next();
	  if (this.type == _tokentype.types.semi || this.canInsertSemicolon() || this.type != _tokentype.types.star && !this.type.startsExpr) {
	    node.delegate = false;
	    node.argument = null;
	  } else {
	    node.delegate = this.eat(_tokentype.types.star);
	    node.argument = this.parseMaybeAssign();
	  }
	  return this.finishNode(node, "YieldExpression");
	};

	// Parses array and generator comprehensions.

	pp.parseComprehension = function (node, isGenerator) {
	  node.blocks = [];
	  while (this.type === _tokentype.types._for) {
	    var block = this.startNode();
	    this.next();
	    this.expect(_tokentype.types.parenL);
	    block.left = this.parseBindingAtom();
	    this.checkLVal(block.left, true);
	    this.expectContextual("of");
	    block.right = this.parseExpression();
	    this.expect(_tokentype.types.parenR);
	    node.blocks.push(this.finishNode(block, "ComprehensionBlock"));
	  }
	  node.filter = this.eat(_tokentype.types._if) ? this.parseParenExpression() : null;
	  node.body = this.parseExpression();
	  this.expect(isGenerator ? _tokentype.types.parenR : _tokentype.types.bracketR);
	  node.generator = isGenerator;
	  return this.finishNode(node, "ComprehensionExpression");
	};

	},{"./state":10,"./tokentype":14}],2:[function(_dereq_,module,exports){
	// This is a trick taken from Esprima. It turns out that, on
	// non-Chrome browsers, to check whether a string is in a set, a
	// predicate containing a big ugly `switch` statement is faster than
	// a regular expression, and on Chrome the two are about on par.
	// This function uses `eval` (non-lexical) to produce such a
	// predicate from a space-separated string of words.
	//
	// It starts by sorting the words by length.

	// Reserved word lists for various dialects of the language

	"use strict";

	exports.__esModule = true;
	exports.isIdentifierStart = isIdentifierStart;
	exports.isIdentifierChar = isIdentifierChar;
	var reservedWords = {
	  3: "abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile",
	  5: "class enum extends super const export import",
	  6: "enum",
	  strict: "implements interface let package private protected public static yield",
	  strictBind: "eval arguments"
	};

	exports.reservedWords = reservedWords;
	// And the keywords

	var ecma5AndLessKeywords = "break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this";

	var keywords = {
	  5: ecma5AndLessKeywords,
	  6: ecma5AndLessKeywords + " let const class extends export import yield super"
	};

	exports.keywords = keywords;
	// ## Character categories

	// Big ugly regular expressions that match characters in the
	// whitespace, identifier, and identifier-start categories. These
	// are only applied when a character is found to actually have a
	// code point above 128.
	// Generated by `tools/generate-identifier-regex.js`.

	var nonASCIIidentifierStartChars = "ªµºÀ-ÖØ-öø-ˁˆ-ˑˠ-ˤˬˮͰ-ʹͶͷͺ-ͽͿΆΈ-ΊΌΎ-ΡΣ-ϵϷ-ҁҊ-ԯԱ-Ֆՙա-ևא-תװ-ײؠ-يٮٯٱ-ۓەۥۦۮۯۺ-ۼۿܐܒ-ܯݍ-ޥޱߊ-ߪߴߵߺࠀ-ࠕࠚࠤࠨࡀ-ࡘࢠ-ࢲऄ-हऽॐक़-ॡॱ-ঀঅ-ঌএঐও-নপ-রলশ-হঽৎড়ঢ়য়-ৡৰৱਅ-ਊਏਐਓ-ਨਪ-ਰਲਲ਼ਵਸ਼ਸਹਖ਼-ੜਫ਼ੲ-ੴઅ-ઍએ-ઑઓ-નપ-રલળવ-હઽૐૠૡଅ-ଌଏଐଓ-ନପ-ରଲଳଵ-ହଽଡ଼ଢ଼ୟ-ୡୱஃஅ-ஊஎ-ஐஒ-கஙசஜஞடணதந-பம-ஹௐఅ-ఌఎ-ఐఒ-నప-హఽౘౙౠౡಅ-ಌಎ-ಐಒ-ನಪ-ಳವ-ಹಽೞೠೡೱೲഅ-ഌഎ-ഐഒ-ഺഽൎൠൡൺ-ൿඅ-ඖක-නඳ-රලව-ෆก-ะาำเ-ๆກຂຄງຈຊຍດ-ທນ-ຟມ-ຣລວສຫອ-ະາຳຽເ-ໄໆໜ-ໟༀཀ-ཇཉ-ཬྈ-ྌက-ဪဿၐ-ၕၚ-ၝၡၥၦၮ-ၰၵ-ႁႎႠ-ჅჇჍა-ჺჼ-ቈቊ-ቍቐ-ቖቘቚ-ቝበ-ኈኊ-ኍነ-ኰኲ-ኵኸ-ኾዀዂ-ዅወ-ዖዘ-ጐጒ-ጕጘ-ፚᎀ-ᎏᎠ-Ᏼᐁ-ᙬᙯ-ᙿᚁ-ᚚᚠ-ᛪᛮ-ᛸᜀ-ᜌᜎ-ᜑᜠ-ᜱᝀ-ᝑᝠ-ᝬᝮ-ᝰក-ឳៗៜᠠ-ᡷᢀ-ᢨᢪᢰ-ᣵᤀ-ᤞᥐ-ᥭᥰ-ᥴᦀ-ᦫᧁ-ᧇᨀ-ᨖᨠ-ᩔᪧᬅ-ᬳᭅ-ᭋᮃ-ᮠᮮᮯᮺ-ᯥᰀ-ᰣᱍ-ᱏᱚ-ᱽᳩ-ᳬᳮ-ᳱᳵᳶᴀ-ᶿḀ-ἕἘ-Ἕἠ-ὅὈ-Ὅὐ-ὗὙὛὝὟ-ώᾀ-ᾴᾶ-ᾼιῂ-ῄῆ-ῌῐ-ΐῖ-Ίῠ-Ῥῲ-ῴῶ-ῼⁱⁿₐ-ₜℂℇℊ-ℓℕ℘-ℝℤΩℨK-ℹℼ-ℿⅅ-ⅉⅎⅠ-ↈⰀ-Ⱞⰰ-ⱞⱠ-ⳤⳫ-ⳮⳲⳳⴀ-ⴥⴧⴭⴰ-ⵧⵯⶀ-ⶖⶠ-ⶦⶨ-ⶮⶰ-ⶶⶸ-ⶾⷀ-ⷆⷈ-ⷎⷐ-ⷖⷘ-ⷞ々-〇〡-〩〱-〵〸-〼ぁ-ゖ゛-ゟァ-ヺー-ヿㄅ-ㄭㄱ-ㆎㆠ-ㆺㇰ-ㇿ㐀-䶵一-鿌ꀀ-ꒌꓐ-ꓽꔀ-ꘌꘐ-ꘟꘪꘫꙀ-ꙮꙿ-ꚝꚠ-ꛯꜗ-ꜟꜢ-ꞈꞋ-ꞎꞐ-ꞭꞰꞱꟷ-ꠁꠃ-ꠅꠇ-ꠊꠌ-ꠢꡀ-ꡳꢂ-ꢳꣲ-ꣷꣻꤊ-ꤥꤰ-ꥆꥠ-ꥼꦄ-ꦲꧏꧠ-ꧤꧦ-ꧯꧺ-ꧾꨀ-ꨨꩀ-ꩂꩄ-ꩋꩠ-ꩶꩺꩾ-ꪯꪱꪵꪶꪹ-ꪽꫀꫂꫛ-ꫝꫠ-ꫪꫲ-ꫴꬁ-ꬆꬉ-ꬎꬑ-ꬖꬠ-ꬦꬨ-ꬮꬰ-ꭚꭜ-ꭟꭤꭥꯀ-ꯢ가-힣ힰ-ퟆퟋ-ퟻ豈-舘並-龎ﬀ-ﬆﬓ-ﬗיִײַ-ﬨשׁ-זּטּ-לּמּנּסּףּפּצּ-ﮱﯓ-ﴽﵐ-ﶏﶒ-ﷇﷰ-ﷻﹰ-ﹴﹶ-ﻼＡ-Ｚａ-ｚｦ-ﾾￂ-ￇￊ-ￏￒ-ￗￚ-ￜ";
	var nonASCIIidentifierChars = "‌‍·̀-ͯ·҃-֑҇-ׇֽֿׁׂׅׄؐ-ًؚ-٩ٰۖ-ۜ۟-۪ۤۧۨ-ۭ۰-۹ܑܰ-݊ަ-ް߀-߉߫-߳ࠖ-࠙ࠛ-ࠣࠥ-ࠧࠩ-࡙࠭-࡛ࣤ-ःऺ-़ा-ॏ॑-ॗॢॣ०-९ঁ-ঃ়া-ৄেৈো-্ৗৢৣ০-৯ਁ-ਃ਼ਾ-ੂੇੈੋ-੍ੑ੦-ੱੵઁ-ઃ઼ા-ૅે-ૉો-્ૢૣ૦-૯ଁ-ଃ଼ା-ୄେୈୋ-୍ୖୗୢୣ୦-୯ஂா-ூெ-ைொ-்ௗ௦-௯ఀ-ఃా-ౄె-ైొ-్ౕౖౢౣ౦-౯ಁ-ಃ಼ಾ-ೄೆ-ೈೊ-್ೕೖೢೣ೦-೯ഁ-ഃാ-ൄെ-ൈൊ-്ൗൢൣ൦-൯ංඃ්ා-ුූෘ-ෟ෦-෯ෲෳัิ-ฺ็-๎๐-๙ັິ-ູົຼ່-ໍ໐-໙༘༙༠-༩༹༵༷༾༿ཱ-྄྆྇ྍ-ྗྙ-ྼ࿆ါ-ှ၀-၉ၖ-ၙၞ-ၠၢ-ၤၧ-ၭၱ-ၴႂ-ႍႏ-ႝ፝-፟፩-፱ᜒ-᜔ᜲ-᜴ᝒᝓᝲᝳ឴-៓៝០-៩᠋-᠍᠐-᠙ᢩᤠ-ᤫᤰ-᤻᥆-᥏ᦰ-ᧀᧈᧉ᧐-᧚ᨗ-ᨛᩕ-ᩞ᩠-᩿᩼-᪉᪐-᪙᪰-᪽ᬀ-ᬄ᬴-᭄᭐-᭙᭫-᭳ᮀ-ᮂᮡ-ᮭ᮰-᮹᯦-᯳ᰤ-᰷᱀-᱉᱐-᱙᳐-᳔᳒-᳨᳭ᳲ-᳴᳸᳹᷀-᷵᷼-᷿‿⁀⁔⃐-⃥⃜⃡-⃰⳯-⵿⳱ⷠ-〪ⷿ-゙゚〯꘠-꘩꙯ꙴ-꙽ꚟ꛰꛱ꠂ꠆ꠋꠣ-ꠧꢀꢁꢴ-꣄꣐-꣙꣠-꣱꤀-꤉ꤦ-꤭ꥇ-꥓ꦀ-ꦃ꦳-꧀꧐-꧙ꧥ꧰-꧹ꨩ-ꨶꩃꩌꩍ꩐-꩙ꩻ-ꩽꪰꪲ-ꪴꪷꪸꪾ꪿꫁ꫫ-ꫯꫵ꫶ꯣ-ꯪ꯬꯭꯰-꯹ﬞ︀-️︠-︭︳︴﹍-﹏０-９＿";

	var nonASCIIidentifierStart = new RegExp("[" + nonASCIIidentifierStartChars + "]");
	var nonASCIIidentifier = new RegExp("[" + nonASCIIidentifierStartChars + nonASCIIidentifierChars + "]");

	nonASCIIidentifierStartChars = nonASCIIidentifierChars = null;

	// These are a run-length and offset encoded representation of the
	// >0xffff code points that are a valid part of identifiers. The
	// offset starts at 0x10000, and each pair of numbers represents an
	// offset to the next range, and then a size of the range. They were
	// generated by tools/generate-identifier-regex.js
	var astralIdentifierStartCodes = [0, 11, 2, 25, 2, 18, 2, 1, 2, 14, 3, 13, 35, 122, 70, 52, 268, 28, 4, 48, 48, 31, 17, 26, 6, 37, 11, 29, 3, 35, 5, 7, 2, 4, 43, 157, 99, 39, 9, 51, 157, 310, 10, 21, 11, 7, 153, 5, 3, 0, 2, 43, 2, 1, 4, 0, 3, 22, 11, 22, 10, 30, 98, 21, 11, 25, 71, 55, 7, 1, 65, 0, 16, 3, 2, 2, 2, 26, 45, 28, 4, 28, 36, 7, 2, 27, 28, 53, 11, 21, 11, 18, 14, 17, 111, 72, 955, 52, 76, 44, 33, 24, 27, 35, 42, 34, 4, 0, 13, 47, 15, 3, 22, 0, 38, 17, 2, 24, 133, 46, 39, 7, 3, 1, 3, 21, 2, 6, 2, 1, 2, 4, 4, 0, 32, 4, 287, 47, 21, 1, 2, 0, 185, 46, 82, 47, 21, 0, 60, 42, 502, 63, 32, 0, 449, 56, 1288, 920, 104, 110, 2962, 1070, 13266, 568, 8, 30, 114, 29, 19, 47, 17, 3, 32, 20, 6, 18, 881, 68, 12, 0, 67, 12, 16481, 1, 3071, 106, 6, 12, 4, 8, 8, 9, 5991, 84, 2, 70, 2, 1, 3, 0, 3, 1, 3, 3, 2, 11, 2, 0, 2, 6, 2, 64, 2, 3, 3, 7, 2, 6, 2, 27, 2, 3, 2, 4, 2, 0, 4, 6, 2, 339, 3, 24, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 30, 2, 24, 2, 7, 4149, 196, 1340, 3, 2, 26, 2, 1, 2, 0, 3, 0, 2, 9, 2, 3, 2, 0, 2, 0, 7, 0, 5, 0, 2, 0, 2, 0, 2, 2, 2, 1, 2, 0, 3, 0, 2, 0, 2, 0, 2, 0, 2, 0, 2, 1, 2, 0, 3, 3, 2, 6, 2, 3, 2, 3, 2, 0, 2, 9, 2, 16, 6, 2, 2, 4, 2, 16, 4421, 42710, 42, 4148, 12, 221, 16355, 541];
	var astralIdentifierCodes = [509, 0, 227, 0, 150, 4, 294, 9, 1368, 2, 2, 1, 6, 3, 41, 2, 5, 0, 166, 1, 1306, 2, 54, 14, 32, 9, 16, 3, 46, 10, 54, 9, 7, 2, 37, 13, 2, 9, 52, 0, 13, 2, 49, 13, 16, 9, 83, 11, 168, 11, 6, 9, 8, 2, 57, 0, 2, 6, 3, 1, 3, 2, 10, 0, 11, 1, 3, 6, 4, 4, 316, 19, 13, 9, 214, 6, 3, 8, 112, 16, 16, 9, 82, 12, 9, 9, 535, 9, 20855, 9, 135, 4, 60, 6, 26, 9, 1016, 45, 17, 3, 19723, 1, 5319, 4, 4, 5, 9, 7, 3, 6, 31, 3, 149, 2, 1418, 49, 4305, 6, 792618, 239];

	// This has a complexity linear to the value of the code. The
	// assumption is that looking up astral identifier characters is
	// rare.
	function isInAstralSet(code, set) {
	  var pos = 0x10000;
	  for (var i = 0; i < set.length; i += 2) {
	    pos += set[i];
	    if (pos > code) return false;
	    pos += set[i + 1];
	    if (pos >= code) return true;
	  }
	}

	// Test whether a given character code starts an identifier.

	function isIdentifierStart(code, astral) {
	  if (code < 65) return code === 36;
	  if (code < 91) return true;
	  if (code < 97) return code === 95;
	  if (code < 123) return true;
	  if (code <= 0xffff) return code >= 0xaa && nonASCIIidentifierStart.test(String.fromCharCode(code));
	  if (astral === false) return false;
	  return isInAstralSet(code, astralIdentifierStartCodes);
	}

	// Test whether a given character is part of an identifier.

	function isIdentifierChar(code, astral) {
	  if (code < 48) return code === 36;
	  if (code < 58) return true;
	  if (code < 65) return false;
	  if (code < 91) return true;
	  if (code < 97) return code === 95;
	  if (code < 123) return true;
	  if (code <= 0xffff) return code >= 0xaa && nonASCIIidentifier.test(String.fromCharCode(code));
	  if (astral === false) return false;
	  return isInAstralSet(code, astralIdentifierStartCodes) || isInAstralSet(code, astralIdentifierCodes);
	}

	},{}],3:[function(_dereq_,module,exports){
	// Acorn is a tiny, fast JavaScript parser written in JavaScript.
	//
	// Acorn was written by Marijn Haverbeke, Ingvar Stepanyan, and
	// various contributors and released under an MIT license.
	//
	// Git repositories for Acorn are available at
	//
	//     http://marijnhaverbeke.nl/git/acorn
	//     https://github.com/marijnh/acorn.git
	//
	// Please use the [github bug tracker][ghbt] to report issues.
	//
	// [ghbt]: https://github.com/marijnh/acorn/issues
	//
	// This file defines the main parser interface. The library also comes
	// with a [error-tolerant parser][dammit] and an
	// [abstract syntax tree walker][walk], defined in other files.
	//
	// [dammit]: acorn_loose.js
	// [walk]: util/walk.js

	"use strict";

	exports.__esModule = true;
	exports.parse = parse;
	exports.parseExpressionAt = parseExpressionAt;
	exports.tokenizer = tokenizer;

	var _state = _dereq_("./state");

	_dereq_("./parseutil");

	_dereq_("./statement");

	_dereq_("./lval");

	_dereq_("./expression");

	_dereq_("./location");

	exports.Parser = _state.Parser;
	exports.plugins = _state.plugins;

	var _options = _dereq_("./options");

	exports.defaultOptions = _options.defaultOptions;

	var _locutil = _dereq_("./locutil");

	exports.Position = _locutil.Position;
	exports.SourceLocation = _locutil.SourceLocation;
	exports.getLineInfo = _locutil.getLineInfo;

	var _node = _dereq_("./node");

	exports.Node = _node.Node;

	var _tokentype = _dereq_("./tokentype");

	exports.TokenType = _tokentype.TokenType;
	exports.tokTypes = _tokentype.types;

	var _tokencontext = _dereq_("./tokencontext");

	exports.TokContext = _tokencontext.TokContext;
	exports.tokContexts = _tokencontext.types;

	var _identifier = _dereq_("./identifier");

	exports.isIdentifierChar = _identifier.isIdentifierChar;
	exports.isIdentifierStart = _identifier.isIdentifierStart;

	var _tokenize = _dereq_("./tokenize");

	exports.Token = _tokenize.Token;

	var _whitespace = _dereq_("./whitespace");

	exports.isNewLine = _whitespace.isNewLine;
	exports.lineBreak = _whitespace.lineBreak;
	exports.lineBreakG = _whitespace.lineBreakG;
	var version = "2.5.2";

	exports.version = version;
	// The main exported interface (under `self.acorn` when in the
	// browser) is a `parse` function that takes a code string and
	// returns an abstract syntax tree as specified by [Mozilla parser
	// API][api].
	//
	// [api]: https://developer.mozilla.org/en-US/docs/SpiderMonkey/Parser_API

	function parse(input, options) {
	  return new _state.Parser(options, input).parse();
	}

	// This function tries to parse a single expression at a given
	// offset in a string. Useful for parsing mixed-language formats
	// that embed JavaScript expressions.

	function parseExpressionAt(input, pos, options) {
	  var p = new _state.Parser(options, input, pos);
	  p.nextToken();
	  return p.parseExpression();
	}

	// Acorn is organized as a tokenizer and a recursive-descent parser.
	// The `tokenizer` export provides an interface to the tokenizer.

	function tokenizer(input, options) {
	  return new _state.Parser(options, input);
	}

	},{"./expression":1,"./identifier":2,"./location":4,"./locutil":5,"./lval":6,"./node":7,"./options":8,"./parseutil":9,"./state":10,"./statement":11,"./tokencontext":12,"./tokenize":13,"./tokentype":14,"./whitespace":16}],4:[function(_dereq_,module,exports){
	"use strict";

	var _state = _dereq_("./state");

	var _locutil = _dereq_("./locutil");

	var pp = _state.Parser.prototype;

	// This function is used to raise exceptions on parse errors. It
	// takes an offset integer (into the current `input`) to indicate
	// the location of the error, attaches the position to the end
	// of the error message, and then raises a `SyntaxError` with that
	// message.

	pp.raise = function (pos, message) {
	  var loc = _locutil.getLineInfo(this.input, pos);
	  message += " (" + loc.line + ":" + loc.column + ")";
	  var err = new SyntaxError(message);
	  err.pos = pos;err.loc = loc;err.raisedAt = this.pos;
	  throw err;
	};

	pp.curPosition = function () {
	  if (this.options.locations) {
	    return new _locutil.Position(this.curLine, this.pos - this.lineStart);
	  }
	};

	},{"./locutil":5,"./state":10}],5:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;
	exports.getLineInfo = getLineInfo;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _whitespace = _dereq_("./whitespace");

	// These are used when `options.locations` is on, for the
	// `startLoc` and `endLoc` properties.

	var Position = (function () {
	  function Position(line, col) {
	    _classCallCheck(this, Position);

	    this.line = line;
	    this.column = col;
	  }

	  Position.prototype.offset = function offset(n) {
	    return new Position(this.line, this.column + n);
	  };

	  return Position;
	})();

	exports.Position = Position;

	var SourceLocation = function SourceLocation(p, start, end) {
	  _classCallCheck(this, SourceLocation);

	  this.start = start;
	  this.end = end;
	  if (p.sourceFile !== null) this.source = p.sourceFile;
	}

	// The `getLineInfo` function is mostly useful when the
	// `locations` option is off (for performance reasons) and you
	// want to find the line/column position for a given character
	// offset. `input` should be the code string that the offset refers
	// into.

	;

	exports.SourceLocation = SourceLocation;

	function getLineInfo(input, offset) {
	  for (var line = 1, cur = 0;;) {
	    _whitespace.lineBreakG.lastIndex = cur;
	    var match = _whitespace.lineBreakG.exec(input);
	    if (match && match.index < offset) {
	      ++line;
	      cur = match.index + match[0].length;
	    } else {
	      return new Position(line, offset - cur);
	    }
	  }
	}

	},{"./whitespace":16}],6:[function(_dereq_,module,exports){
	"use strict";

	var _tokentype = _dereq_("./tokentype");

	var _state = _dereq_("./state");

	var _util = _dereq_("./util");

	var pp = _state.Parser.prototype;

	// Convert existing expression atom to assignable pattern
	// if possible.

	pp.toAssignable = function (node, isBinding) {
	  if (this.options.ecmaVersion >= 6 && node) {
	    switch (node.type) {
	      case "Identifier":
	      case "ObjectPattern":
	      case "ArrayPattern":
	      case "AssignmentPattern":
	        break;

	      case "ObjectExpression":
	        node.type = "ObjectPattern";
	        for (var i = 0; i < node.properties.length; i++) {
	          var prop = node.properties[i];
	          if (prop.kind !== "init") this.raise(prop.key.start, "Object pattern can't contain getter or setter");
	          this.toAssignable(prop.value, isBinding);
	        }
	        break;

	      case "ArrayExpression":
	        node.type = "ArrayPattern";
	        this.toAssignableList(node.elements, isBinding);
	        break;

	      case "AssignmentExpression":
	        if (node.operator === "=") {
	          node.type = "AssignmentPattern";
	          delete node.operator;
	        } else {
	          this.raise(node.left.end, "Only '=' operator can be used for specifying default value.");
	        }
	        break;

	      case "ParenthesizedExpression":
	        node.expression = this.toAssignable(node.expression, isBinding);
	        break;

	      case "MemberExpression":
	        if (!isBinding) break;

	      default:
	        this.raise(node.start, "Assigning to rvalue");
	    }
	  }
	  return node;
	};

	// Convert list of expression atoms to binding list.

	pp.toAssignableList = function (exprList, isBinding) {
	  var end = exprList.length;
	  if (end) {
	    var last = exprList[end - 1];
	    if (last && last.type == "RestElement") {
	      --end;
	    } else if (last && last.type == "SpreadElement") {
	      last.type = "RestElement";
	      var arg = last.argument;
	      this.toAssignable(arg, isBinding);
	      if (arg.type !== "Identifier" && arg.type !== "MemberExpression" && arg.type !== "ArrayPattern") this.unexpected(arg.start);
	      --end;
	    }

	    if (isBinding && last.type === "RestElement" && last.argument.type !== "Identifier") this.unexpected(last.argument.start);
	  }
	  for (var i = 0; i < end; i++) {
	    var elt = exprList[i];
	    if (elt) this.toAssignable(elt, isBinding);
	  }
	  return exprList;
	};

	// Parses spread element.

	pp.parseSpread = function (refShorthandDefaultPos) {
	  var node = this.startNode();
	  this.next();
	  node.argument = this.parseMaybeAssign(refShorthandDefaultPos);
	  return this.finishNode(node, "SpreadElement");
	};

	pp.parseRest = function (allowNonIdent) {
	  var node = this.startNode();
	  this.next();

	  // RestElement inside of a function parameter must be an identifier
	  if (allowNonIdent) node.argument = this.type === _tokentype.types.name ? this.parseIdent() : this.unexpected();else node.argument = this.type === _tokentype.types.name || this.type === _tokentype.types.bracketL ? this.parseBindingAtom() : this.unexpected();

	  return this.finishNode(node, "RestElement");
	};

	// Parses lvalue (assignable) atom.

	pp.parseBindingAtom = function () {
	  if (this.options.ecmaVersion < 6) return this.parseIdent();
	  switch (this.type) {
	    case _tokentype.types.name:
	      return this.parseIdent();

	    case _tokentype.types.bracketL:
	      var node = this.startNode();
	      this.next();
	      node.elements = this.parseBindingList(_tokentype.types.bracketR, true, true);
	      return this.finishNode(node, "ArrayPattern");

	    case _tokentype.types.braceL:
	      return this.parseObj(true);

	    default:
	      this.unexpected();
	  }
	};

	pp.parseBindingList = function (close, allowEmpty, allowTrailingComma, allowNonIdent) {
	  var elts = [],
	      first = true;
	  while (!this.eat(close)) {
	    if (first) first = false;else this.expect(_tokentype.types.comma);
	    if (allowEmpty && this.type === _tokentype.types.comma) {
	      elts.push(null);
	    } else if (allowTrailingComma && this.afterTrailingComma(close)) {
	      break;
	    } else if (this.type === _tokentype.types.ellipsis) {
	      var rest = this.parseRest(allowNonIdent);
	      this.parseBindingListItem(rest);
	      elts.push(rest);
	      this.expect(close);
	      break;
	    } else {
	      var elem = this.parseMaybeDefault(this.start, this.startLoc);
	      this.parseBindingListItem(elem);
	      elts.push(elem);
	    }
	  }
	  return elts;
	};

	pp.parseBindingListItem = function (param) {
	  return param;
	};

	// Parses assignment pattern around given atom if possible.

	pp.parseMaybeDefault = function (startPos, startLoc, left) {
	  left = left || this.parseBindingAtom();
	  if (this.options.ecmaVersion < 6 || !this.eat(_tokentype.types.eq)) return left;
	  var node = this.startNodeAt(startPos, startLoc);
	  node.left = left;
	  node.right = this.parseMaybeAssign();
	  return this.finishNode(node, "AssignmentPattern");
	};

	// Verify that a node is an lval — something that can be assigned
	// to.

	pp.checkLVal = function (expr, isBinding, checkClashes) {
	  switch (expr.type) {
	    case "Identifier":
	      if (this.strict && this.reservedWordsStrictBind.test(expr.name)) this.raise(expr.start, (isBinding ? "Binding " : "Assigning to ") + expr.name + " in strict mode");
	      if (checkClashes) {
	        if (_util.has(checkClashes, expr.name)) this.raise(expr.start, "Argument name clash");
	        checkClashes[expr.name] = true;
	      }
	      break;

	    case "MemberExpression":
	      if (isBinding) this.raise(expr.start, (isBinding ? "Binding" : "Assigning to") + " member expression");
	      break;

	    case "ObjectPattern":
	      for (var i = 0; i < expr.properties.length; i++) {
	        this.checkLVal(expr.properties[i].value, isBinding, checkClashes);
	      }break;

	    case "ArrayPattern":
	      for (var i = 0; i < expr.elements.length; i++) {
	        var elem = expr.elements[i];
	        if (elem) this.checkLVal(elem, isBinding, checkClashes);
	      }
	      break;

	    case "AssignmentPattern":
	      this.checkLVal(expr.left, isBinding, checkClashes);
	      break;

	    case "RestElement":
	      this.checkLVal(expr.argument, isBinding, checkClashes);
	      break;

	    case "ParenthesizedExpression":
	      this.checkLVal(expr.expression, isBinding, checkClashes);
	      break;

	    default:
	      this.raise(expr.start, (isBinding ? "Binding" : "Assigning to") + " rvalue");
	  }
	};

	},{"./state":10,"./tokentype":14,"./util":15}],7:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _state = _dereq_("./state");

	var _locutil = _dereq_("./locutil");

	var Node = function Node(parser, pos, loc) {
	  _classCallCheck(this, Node);

	  this.type = "";
	  this.start = pos;
	  this.end = 0;
	  if (parser.options.locations) this.loc = new _locutil.SourceLocation(parser, loc);
	  if (parser.options.directSourceFile) this.sourceFile = parser.options.directSourceFile;
	  if (parser.options.ranges) this.range = [pos, 0];
	}

	// Start an AST node, attaching a start offset.

	;

	exports.Node = Node;
	var pp = _state.Parser.prototype;

	pp.startNode = function () {
	  return new Node(this, this.start, this.startLoc);
	};

	pp.startNodeAt = function (pos, loc) {
	  return new Node(this, pos, loc);
	};

	// Finish an AST node, adding `type` and `end` properties.

	function finishNodeAt(node, type, pos, loc) {
	  node.type = type;
	  node.end = pos;
	  if (this.options.locations) node.loc.end = loc;
	  if (this.options.ranges) node.range[1] = pos;
	  return node;
	}

	pp.finishNode = function (node, type) {
	  return finishNodeAt.call(this, node, type, this.lastTokEnd, this.lastTokEndLoc);
	};

	// Finish node at given position

	pp.finishNodeAt = function (node, type, pos, loc) {
	  return finishNodeAt.call(this, node, type, pos, loc);
	};

	},{"./locutil":5,"./state":10}],8:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;
	exports.getOptions = getOptions;

	var _util = _dereq_("./util");

	var _locutil = _dereq_("./locutil");

	// A second optional argument can be given to further configure
	// the parser process. These options are recognized:

	var defaultOptions = {
	  // `ecmaVersion` indicates the ECMAScript version to parse. Must
	  // be either 3, or 5, or 6. This influences support for strict
	  // mode, the set of reserved words, support for getters and
	  // setters and other features.
	  ecmaVersion: 5,
	  // Source type ("script" or "module") for different semantics
	  sourceType: "script",
	  // `onInsertedSemicolon` can be a callback that will be called
	  // when a semicolon is automatically inserted. It will be passed
	  // th position of the comma as an offset, and if `locations` is
	  // enabled, it is given the location as a `{line, column}` object
	  // as second argument.
	  onInsertedSemicolon: null,
	  // `onTrailingComma` is similar to `onInsertedSemicolon`, but for
	  // trailing commas.
	  onTrailingComma: null,
	  // By default, reserved words are only enforced if ecmaVersion >= 5.
	  // Set `allowReserved` to a boolean value to explicitly turn this on
	  // an off. When this option has the value "never", reserved words
	  // and keywords can also not be used as property names.
	  allowReserved: null,
	  // When enabled, a return at the top level is not considered an
	  // error.
	  allowReturnOutsideFunction: false,
	  // When enabled, import/export statements are not constrained to
	  // appearing at the top of the program.
	  allowImportExportEverywhere: false,
	  // When enabled, hashbang directive in the beginning of file
	  // is allowed and treated as a line comment.
	  allowHashBang: false,
	  // When `locations` is on, `loc` properties holding objects with
	  // `start` and `end` properties in `{line, column}` form (with
	  // line being 1-based and column 0-based) will be attached to the
	  // nodes.
	  locations: false,
	  // A function can be passed as `onToken` option, which will
	  // cause Acorn to call that function with object in the same
	  // format as tokens returned from `tokenizer().getToken()`. Note
	  // that you are not allowed to call the parser from the
	  // callback—that will corrupt its internal state.
	  onToken: null,
	  // A function can be passed as `onComment` option, which will
	  // cause Acorn to call that function with `(block, text, start,
	  // end)` parameters whenever a comment is skipped. `block` is a
	  // boolean indicating whether this is a block (`/* */`) comment,
	  // `text` is the content of the comment, and `start` and `end` are
	  // character offsets that denote the start and end of the comment.
	  // When the `locations` option is on, two more parameters are
	  // passed, the full `{line, column}` locations of the start and
	  // end of the comments. Note that you are not allowed to call the
	  // parser from the callback—that will corrupt its internal state.
	  onComment: null,
	  // Nodes have their start and end characters offsets recorded in
	  // `start` and `end` properties (directly on the node, rather than
	  // the `loc` object, which holds line/column data. To also add a
	  // [semi-standardized][range] `range` property holding a `[start,
	  // end]` array with the same numbers, set the `ranges` option to
	  // `true`.
	  //
	  // [range]: https://bugzilla.mozilla.org/show_bug.cgi?id=745678
	  ranges: false,
	  // It is possible to parse multiple files into a single AST by
	  // passing the tree produced by parsing the first file as
	  // `program` option in subsequent parses. This will add the
	  // toplevel forms of the parsed file to the `Program` (top) node
	  // of an existing parse tree.
	  program: null,
	  // When `locations` is on, you can pass this to record the source
	  // file in every node's `loc` object.
	  sourceFile: null,
	  // This value, if given, is stored in every node, whether
	  // `locations` is on or off.
	  directSourceFile: null,
	  // When enabled, parenthesized expressions are represented by
	  // (non-standard) ParenthesizedExpression nodes
	  preserveParens: false,
	  plugins: {}
	};

	exports.defaultOptions = defaultOptions;
	// Interpret and default an options object

	function getOptions(opts) {
	  var options = {};
	  for (var opt in defaultOptions) {
	    options[opt] = opts && _util.has(opts, opt) ? opts[opt] : defaultOptions[opt];
	  }if (options.allowReserved == null) options.allowReserved = options.ecmaVersion >= 5;

	  if (_util.isArray(options.onToken)) {
	    (function () {
	      var tokens = options.onToken;
	      options.onToken = function (token) {
	        return tokens.push(token);
	      };
	    })();
	  }
	  if (_util.isArray(options.onComment)) options.onComment = pushComment(options, options.onComment);

	  return options;
	}

	function pushComment(options, array) {
	  return function (block, text, start, end, startLoc, endLoc) {
	    var comment = {
	      type: block ? 'Block' : 'Line',
	      value: text,
	      start: start,
	      end: end
	    };
	    if (options.locations) comment.loc = new _locutil.SourceLocation(this, startLoc, endLoc);
	    if (options.ranges) comment.range = [start, end];
	    array.push(comment);
	  };
	}

	},{"./locutil":5,"./util":15}],9:[function(_dereq_,module,exports){
	"use strict";

	var _tokentype = _dereq_("./tokentype");

	var _state = _dereq_("./state");

	var _whitespace = _dereq_("./whitespace");

	var pp = _state.Parser.prototype;

	// ## Parser utilities

	// Test whether a statement node is the string literal `"use strict"`.

	pp.isUseStrict = function (stmt) {
	  return this.options.ecmaVersion >= 5 && stmt.type === "ExpressionStatement" && stmt.expression.type === "Literal" && stmt.expression.raw.slice(1, -1) === "use strict";
	};

	// Predicate that tests whether the next token is of the given
	// type, and if yes, consumes it as a side effect.

	pp.eat = function (type) {
	  if (this.type === type) {
	    this.next();
	    return true;
	  } else {
	    return false;
	  }
	};

	// Tests whether parsed token is a contextual keyword.

	pp.isContextual = function (name) {
	  return this.type === _tokentype.types.name && this.value === name;
	};

	// Consumes contextual keyword if possible.

	pp.eatContextual = function (name) {
	  return this.value === name && this.eat(_tokentype.types.name);
	};

	// Asserts that following token is given contextual keyword.

	pp.expectContextual = function (name) {
	  if (!this.eatContextual(name)) this.unexpected();
	};

	// Test whether a semicolon can be inserted at the current position.

	pp.canInsertSemicolon = function () {
	  return this.type === _tokentype.types.eof || this.type === _tokentype.types.braceR || _whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
	};

	pp.insertSemicolon = function () {
	  if (this.canInsertSemicolon()) {
	    if (this.options.onInsertedSemicolon) this.options.onInsertedSemicolon(this.lastTokEnd, this.lastTokEndLoc);
	    return true;
	  }
	};

	// Consume a semicolon, or, failing that, see if we are allowed to
	// pretend that there is a semicolon at this position.

	pp.semicolon = function () {
	  if (!this.eat(_tokentype.types.semi) && !this.insertSemicolon()) this.unexpected();
	};

	pp.afterTrailingComma = function (tokType) {
	  if (this.type == tokType) {
	    if (this.options.onTrailingComma) this.options.onTrailingComma(this.lastTokStart, this.lastTokStartLoc);
	    this.next();
	    return true;
	  }
	};

	// Expect a token of a given type. If found, consume it, otherwise,
	// raise an unexpected token error.

	pp.expect = function (type) {
	  this.eat(type) || this.unexpected();
	};

	// Raise an unexpected token error.

	pp.unexpected = function (pos) {
	  this.raise(pos != null ? pos : this.start, "Unexpected token");
	};

	},{"./state":10,"./tokentype":14,"./whitespace":16}],10:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _identifier = _dereq_("./identifier");

	var _tokentype = _dereq_("./tokentype");

	var _whitespace = _dereq_("./whitespace");

	var _options = _dereq_("./options");

	// Registered plugins
	var plugins = {};

	exports.plugins = plugins;
	function keywordRegexp(words) {
	  return new RegExp("^(" + words.replace(/ /g, "|") + ")$");
	}

	var Parser = (function () {
	  function Parser(options, input, startPos) {
	    _classCallCheck(this, Parser);

	    this.options = _options.getOptions(options);
	    this.sourceFile = this.options.sourceFile;
	    this.keywords = keywordRegexp(_identifier.keywords[this.options.ecmaVersion >= 6 ? 6 : 5]);
	    var reserved = this.options.allowReserved ? "" : _identifier.reservedWords[this.options.ecmaVersion] + (options.sourceType == "module" ? " await" : "");
	    this.reservedWords = keywordRegexp(reserved);
	    var reservedStrict = (reserved ? reserved + " " : "") + _identifier.reservedWords.strict;
	    this.reservedWordsStrict = keywordRegexp(reservedStrict);
	    this.reservedWordsStrictBind = keywordRegexp(reservedStrict + " " + _identifier.reservedWords.strictBind);
	    this.input = String(input);

	    // Used to signal to callers of `readWord1` whether the word
	    // contained any escape sequences. This is needed because words with
	    // escape sequences must not be interpreted as keywords.
	    this.containsEsc = false;

	    // Load plugins
	    this.loadPlugins(this.options.plugins);

	    // Set up token state

	    // The current position of the tokenizer in the input.
	    if (startPos) {
	      this.pos = startPos;
	      this.lineStart = Math.max(0, this.input.lastIndexOf("\n", startPos));
	      this.curLine = this.input.slice(0, this.lineStart).split(_whitespace.lineBreak).length;
	    } else {
	      this.pos = this.lineStart = 0;
	      this.curLine = 1;
	    }

	    // Properties of the current token:
	    // Its type
	    this.type = _tokentype.types.eof;
	    // For tokens that include more information than their type, the value
	    this.value = null;
	    // Its start and end offset
	    this.start = this.end = this.pos;
	    // And, if locations are used, the {line, column} object
	    // corresponding to those offsets
	    this.startLoc = this.endLoc = this.curPosition();

	    // Position information for the previous token
	    this.lastTokEndLoc = this.lastTokStartLoc = null;
	    this.lastTokStart = this.lastTokEnd = this.pos;

	    // The context stack is used to superficially track syntactic
	    // context to predict whether a regular expression is allowed in a
	    // given position.
	    this.context = this.initialContext();
	    this.exprAllowed = true;

	    // Figure out if it's a module code.
	    this.strict = this.inModule = this.options.sourceType === "module";

	    // Used to signify the start of a potential arrow function
	    this.potentialArrowAt = -1;

	    // Flags to track whether we are in a function, a generator.
	    this.inFunction = this.inGenerator = false;
	    // Labels in scope.
	    this.labels = [];

	    // If enabled, skip leading hashbang line.
	    if (this.pos === 0 && this.options.allowHashBang && this.input.slice(0, 2) === '#!') this.skipLineComment(2);
	  }

	  // DEPRECATED Kept for backwards compatibility until 3.0 in case a plugin uses them

	  Parser.prototype.isKeyword = function isKeyword(word) {
	    return this.keywords.test(word);
	  };

	  Parser.prototype.isReservedWord = function isReservedWord(word) {
	    return this.reservedWords.test(word);
	  };

	  Parser.prototype.extend = function extend(name, f) {
	    this[name] = f(this[name]);
	  };

	  Parser.prototype.loadPlugins = function loadPlugins(pluginConfigs) {
	    for (var _name in pluginConfigs) {
	      var plugin = plugins[_name];
	      if (!plugin) throw new Error("Plugin '" + _name + "' not found");
	      plugin(this, pluginConfigs[_name]);
	    }
	  };

	  Parser.prototype.parse = function parse() {
	    var node = this.options.program || this.startNode();
	    this.nextToken();
	    return this.parseTopLevel(node);
	  };

	  return Parser;
	})();

	exports.Parser = Parser;

	},{"./identifier":2,"./options":8,"./tokentype":14,"./whitespace":16}],11:[function(_dereq_,module,exports){
	"use strict";

	var _tokentype = _dereq_("./tokentype");

	var _state = _dereq_("./state");

	var _whitespace = _dereq_("./whitespace");

	var pp = _state.Parser.prototype;

	// ### Statement parsing

	// Parse a program. Initializes the parser, reads any number of
	// statements, and wraps them in a Program node.  Optionally takes a
	// `program` argument.  If present, the statements will be appended
	// to its body instead of creating a new node.

	pp.parseTopLevel = function (node) {
	  var first = true;
	  if (!node.body) node.body = [];
	  while (this.type !== _tokentype.types.eof) {
	    var stmt = this.parseStatement(true, true);
	    node.body.push(stmt);
	    if (first) {
	      if (this.isUseStrict(stmt)) this.setStrict(true);
	      first = false;
	    }
	  }
	  this.next();
	  if (this.options.ecmaVersion >= 6) {
	    node.sourceType = this.options.sourceType;
	  }
	  return this.finishNode(node, "Program");
	};

	var loopLabel = { kind: "loop" },
	    switchLabel = { kind: "switch" };

	// Parse a single statement.
	//
	// If expecting a statement and finding a slash operator, parse a
	// regular expression literal. This is to handle cases like
	// `if (foo) /blah/.exec(foo)`, where looking at the previous token
	// does not help.

	pp.parseStatement = function (declaration, topLevel) {
	  var starttype = this.type,
	      node = this.startNode();

	  // Most types of statements are recognized by the keyword they
	  // start with. Many are trivial to parse, some require a bit of
	  // complexity.

	  switch (starttype) {
	    case _tokentype.types._break:case _tokentype.types._continue:
	      return this.parseBreakContinueStatement(node, starttype.keyword);
	    case _tokentype.types._debugger:
	      return this.parseDebuggerStatement(node);
	    case _tokentype.types._do:
	      return this.parseDoStatement(node);
	    case _tokentype.types._for:
	      return this.parseForStatement(node);
	    case _tokentype.types._function:
	      if (!declaration && this.options.ecmaVersion >= 6) this.unexpected();
	      return this.parseFunctionStatement(node);
	    case _tokentype.types._class:
	      if (!declaration) this.unexpected();
	      return this.parseClass(node, true);
	    case _tokentype.types._if:
	      return this.parseIfStatement(node);
	    case _tokentype.types._return:
	      return this.parseReturnStatement(node);
	    case _tokentype.types._switch:
	      return this.parseSwitchStatement(node);
	    case _tokentype.types._throw:
	      return this.parseThrowStatement(node);
	    case _tokentype.types._try:
	      return this.parseTryStatement(node);
	    case _tokentype.types._let:case _tokentype.types._const:
	      if (!declaration) this.unexpected(); // NOTE: falls through to _var
	    case _tokentype.types._var:
	      return this.parseVarStatement(node, starttype);
	    case _tokentype.types._while:
	      return this.parseWhileStatement(node);
	    case _tokentype.types._with:
	      return this.parseWithStatement(node);
	    case _tokentype.types.braceL:
	      return this.parseBlock();
	    case _tokentype.types.semi:
	      return this.parseEmptyStatement(node);
	    case _tokentype.types._export:
	    case _tokentype.types._import:
	      if (!this.options.allowImportExportEverywhere) {
	        if (!topLevel) this.raise(this.start, "'import' and 'export' may only appear at the top level");
	        if (!this.inModule) this.raise(this.start, "'import' and 'export' may appear only with 'sourceType: module'");
	      }
	      return starttype === _tokentype.types._import ? this.parseImport(node) : this.parseExport(node);

	    // If the statement does not start with a statement keyword or a
	    // brace, it's an ExpressionStatement or LabeledStatement. We
	    // simply start parsing an expression, and afterwards, if the
	    // next token is a colon and the expression was a simple
	    // Identifier node, we switch to interpreting it as a label.
	    default:
	      var maybeName = this.value,
	          expr = this.parseExpression();
	      if (starttype === _tokentype.types.name && expr.type === "Identifier" && this.eat(_tokentype.types.colon)) return this.parseLabeledStatement(node, maybeName, expr);else return this.parseExpressionStatement(node, expr);
	  }
	};

	pp.parseBreakContinueStatement = function (node, keyword) {
	  var isBreak = keyword == "break";
	  this.next();
	  if (this.eat(_tokentype.types.semi) || this.insertSemicolon()) node.label = null;else if (this.type !== _tokentype.types.name) this.unexpected();else {
	    node.label = this.parseIdent();
	    this.semicolon();
	  }

	  // Verify that there is an actual destination to break or
	  // continue to.
	  for (var i = 0; i < this.labels.length; ++i) {
	    var lab = this.labels[i];
	    if (node.label == null || lab.name === node.label.name) {
	      if (lab.kind != null && (isBreak || lab.kind === "loop")) break;
	      if (node.label && isBreak) break;
	    }
	  }
	  if (i === this.labels.length) this.raise(node.start, "Unsyntactic " + keyword);
	  return this.finishNode(node, isBreak ? "BreakStatement" : "ContinueStatement");
	};

	pp.parseDebuggerStatement = function (node) {
	  this.next();
	  this.semicolon();
	  return this.finishNode(node, "DebuggerStatement");
	};

	pp.parseDoStatement = function (node) {
	  this.next();
	  this.labels.push(loopLabel);
	  node.body = this.parseStatement(false);
	  this.labels.pop();
	  this.expect(_tokentype.types._while);
	  node.test = this.parseParenExpression();
	  if (this.options.ecmaVersion >= 6) this.eat(_tokentype.types.semi);else this.semicolon();
	  return this.finishNode(node, "DoWhileStatement");
	};

	// Disambiguating between a `for` and a `for`/`in` or `for`/`of`
	// loop is non-trivial. Basically, we have to parse the init `var`
	// statement or expression, disallowing the `in` operator (see
	// the second parameter to `parseExpression`), and then check
	// whether the next token is `in` or `of`. When there is no init
	// part (semicolon immediately after the opening parenthesis), it
	// is a regular `for` loop.

	pp.parseForStatement = function (node) {
	  this.next();
	  this.labels.push(loopLabel);
	  this.expect(_tokentype.types.parenL);
	  if (this.type === _tokentype.types.semi) return this.parseFor(node, null);
	  if (this.type === _tokentype.types._var || this.type === _tokentype.types._let || this.type === _tokentype.types._const) {
	    var _init = this.startNode(),
	        varKind = this.type;
	    this.next();
	    this.parseVar(_init, true, varKind);
	    this.finishNode(_init, "VariableDeclaration");
	    if ((this.type === _tokentype.types._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) && _init.declarations.length === 1 && !(varKind !== _tokentype.types._var && _init.declarations[0].init)) return this.parseForIn(node, _init);
	    return this.parseFor(node, _init);
	  }
	  var refShorthandDefaultPos = { start: 0 };
	  var init = this.parseExpression(true, refShorthandDefaultPos);
	  if (this.type === _tokentype.types._in || this.options.ecmaVersion >= 6 && this.isContextual("of")) {
	    this.toAssignable(init);
	    this.checkLVal(init);
	    return this.parseForIn(node, init);
	  } else if (refShorthandDefaultPos.start) {
	    this.unexpected(refShorthandDefaultPos.start);
	  }
	  return this.parseFor(node, init);
	};

	pp.parseFunctionStatement = function (node) {
	  this.next();
	  return this.parseFunction(node, true);
	};

	pp.parseIfStatement = function (node) {
	  this.next();
	  node.test = this.parseParenExpression();
	  node.consequent = this.parseStatement(false);
	  node.alternate = this.eat(_tokentype.types._else) ? this.parseStatement(false) : null;
	  return this.finishNode(node, "IfStatement");
	};

	pp.parseReturnStatement = function (node) {
	  if (!this.inFunction && !this.options.allowReturnOutsideFunction) this.raise(this.start, "'return' outside of function");
	  this.next();

	  // In `return` (and `break`/`continue`), the keywords with
	  // optional arguments, we eagerly look for a semicolon or the
	  // possibility to insert one.

	  if (this.eat(_tokentype.types.semi) || this.insertSemicolon()) node.argument = null;else {
	    node.argument = this.parseExpression();this.semicolon();
	  }
	  return this.finishNode(node, "ReturnStatement");
	};

	pp.parseSwitchStatement = function (node) {
	  this.next();
	  node.discriminant = this.parseParenExpression();
	  node.cases = [];
	  this.expect(_tokentype.types.braceL);
	  this.labels.push(switchLabel);

	  // Statements under must be grouped (by label) in SwitchCase
	  // nodes. `cur` is used to keep the node that we are currently
	  // adding statements to.

	  for (var cur, sawDefault = false; this.type != _tokentype.types.braceR;) {
	    if (this.type === _tokentype.types._case || this.type === _tokentype.types._default) {
	      var isCase = this.type === _tokentype.types._case;
	      if (cur) this.finishNode(cur, "SwitchCase");
	      node.cases.push(cur = this.startNode());
	      cur.consequent = [];
	      this.next();
	      if (isCase) {
	        cur.test = this.parseExpression();
	      } else {
	        if (sawDefault) this.raise(this.lastTokStart, "Multiple default clauses");
	        sawDefault = true;
	        cur.test = null;
	      }
	      this.expect(_tokentype.types.colon);
	    } else {
	      if (!cur) this.unexpected();
	      cur.consequent.push(this.parseStatement(true));
	    }
	  }
	  if (cur) this.finishNode(cur, "SwitchCase");
	  this.next(); // Closing brace
	  this.labels.pop();
	  return this.finishNode(node, "SwitchStatement");
	};

	pp.parseThrowStatement = function (node) {
	  this.next();
	  if (_whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.start))) this.raise(this.lastTokEnd, "Illegal newline after throw");
	  node.argument = this.parseExpression();
	  this.semicolon();
	  return this.finishNode(node, "ThrowStatement");
	};

	// Reused empty array added for node fields that are always empty.

	var empty = [];

	pp.parseTryStatement = function (node) {
	  this.next();
	  node.block = this.parseBlock();
	  node.handler = null;
	  if (this.type === _tokentype.types._catch) {
	    var clause = this.startNode();
	    this.next();
	    this.expect(_tokentype.types.parenL);
	    clause.param = this.parseBindingAtom();
	    this.checkLVal(clause.param, true);
	    this.expect(_tokentype.types.parenR);
	    clause.body = this.parseBlock();
	    node.handler = this.finishNode(clause, "CatchClause");
	  }
	  node.finalizer = this.eat(_tokentype.types._finally) ? this.parseBlock() : null;
	  if (!node.handler && !node.finalizer) this.raise(node.start, "Missing catch or finally clause");
	  return this.finishNode(node, "TryStatement");
	};

	pp.parseVarStatement = function (node, kind) {
	  this.next();
	  this.parseVar(node, false, kind);
	  this.semicolon();
	  return this.finishNode(node, "VariableDeclaration");
	};

	pp.parseWhileStatement = function (node) {
	  this.next();
	  node.test = this.parseParenExpression();
	  this.labels.push(loopLabel);
	  node.body = this.parseStatement(false);
	  this.labels.pop();
	  return this.finishNode(node, "WhileStatement");
	};

	pp.parseWithStatement = function (node) {
	  if (this.strict) this.raise(this.start, "'with' in strict mode");
	  this.next();
	  node.object = this.parseParenExpression();
	  node.body = this.parseStatement(false);
	  return this.finishNode(node, "WithStatement");
	};

	pp.parseEmptyStatement = function (node) {
	  this.next();
	  return this.finishNode(node, "EmptyStatement");
	};

	pp.parseLabeledStatement = function (node, maybeName, expr) {
	  for (var i = 0; i < this.labels.length; ++i) {
	    if (this.labels[i].name === maybeName) this.raise(expr.start, "Label '" + maybeName + "' is already declared");
	  }var kind = this.type.isLoop ? "loop" : this.type === _tokentype.types._switch ? "switch" : null;
	  for (var i = this.labels.length - 1; i >= 0; i--) {
	    var label = this.labels[i];
	    if (label.statementStart == node.start) {
	      label.statementStart = this.start;
	      label.kind = kind;
	    } else break;
	  }
	  this.labels.push({ name: maybeName, kind: kind, statementStart: this.start });
	  node.body = this.parseStatement(true);
	  this.labels.pop();
	  node.label = expr;
	  return this.finishNode(node, "LabeledStatement");
	};

	pp.parseExpressionStatement = function (node, expr) {
	  node.expression = expr;
	  this.semicolon();
	  return this.finishNode(node, "ExpressionStatement");
	};

	// Parse a semicolon-enclosed block of statements, handling `"use
	// strict"` declarations when `allowStrict` is true (used for
	// function bodies).

	pp.parseBlock = function (allowStrict) {
	  var node = this.startNode(),
	      first = true,
	      oldStrict = undefined;
	  node.body = [];
	  this.expect(_tokentype.types.braceL);
	  while (!this.eat(_tokentype.types.braceR)) {
	    var stmt = this.parseStatement(true);
	    node.body.push(stmt);
	    if (first && allowStrict && this.isUseStrict(stmt)) {
	      oldStrict = this.strict;
	      this.setStrict(this.strict = true);
	    }
	    first = false;
	  }
	  if (oldStrict === false) this.setStrict(false);
	  return this.finishNode(node, "BlockStatement");
	};

	// Parse a regular `for` loop. The disambiguation code in
	// `parseStatement` will already have parsed the init statement or
	// expression.

	pp.parseFor = function (node, init) {
	  node.init = init;
	  this.expect(_tokentype.types.semi);
	  node.test = this.type === _tokentype.types.semi ? null : this.parseExpression();
	  this.expect(_tokentype.types.semi);
	  node.update = this.type === _tokentype.types.parenR ? null : this.parseExpression();
	  this.expect(_tokentype.types.parenR);
	  node.body = this.parseStatement(false);
	  this.labels.pop();
	  return this.finishNode(node, "ForStatement");
	};

	// Parse a `for`/`in` and `for`/`of` loop, which are almost
	// same from parser's perspective.

	pp.parseForIn = function (node, init) {
	  var type = this.type === _tokentype.types._in ? "ForInStatement" : "ForOfStatement";
	  this.next();
	  node.left = init;
	  node.right = this.parseExpression();
	  this.expect(_tokentype.types.parenR);
	  node.body = this.parseStatement(false);
	  this.labels.pop();
	  return this.finishNode(node, type);
	};

	// Parse a list of variable declarations.

	pp.parseVar = function (node, isFor, kind) {
	  node.declarations = [];
	  node.kind = kind.keyword;
	  for (;;) {
	    var decl = this.startNode();
	    this.parseVarId(decl);
	    if (this.eat(_tokentype.types.eq)) {
	      decl.init = this.parseMaybeAssign(isFor);
	    } else if (kind === _tokentype.types._const && !(this.type === _tokentype.types._in || this.options.ecmaVersion >= 6 && this.isContextual("of"))) {
	      this.unexpected();
	    } else if (decl.id.type != "Identifier" && !(isFor && (this.type === _tokentype.types._in || this.isContextual("of")))) {
	      this.raise(this.lastTokEnd, "Complex binding patterns require an initialization value");
	    } else {
	      decl.init = null;
	    }
	    node.declarations.push(this.finishNode(decl, "VariableDeclarator"));
	    if (!this.eat(_tokentype.types.comma)) break;
	  }
	  return node;
	};

	pp.parseVarId = function (decl) {
	  decl.id = this.parseBindingAtom();
	  this.checkLVal(decl.id, true);
	};

	// Parse a function declaration or literal (depending on the
	// `isStatement` parameter).

	pp.parseFunction = function (node, isStatement, allowExpressionBody) {
	  this.initFunction(node);
	  if (this.options.ecmaVersion >= 6) node.generator = this.eat(_tokentype.types.star);
	  if (isStatement || this.type === _tokentype.types.name) node.id = this.parseIdent();
	  this.parseFunctionParams(node);
	  this.parseFunctionBody(node, allowExpressionBody);
	  return this.finishNode(node, isStatement ? "FunctionDeclaration" : "FunctionExpression");
	};

	pp.parseFunctionParams = function (node) {
	  this.expect(_tokentype.types.parenL);
	  node.params = this.parseBindingList(_tokentype.types.parenR, false, false, true);
	};

	// Parse a class declaration or literal (depending on the
	// `isStatement` parameter).

	pp.parseClass = function (node, isStatement) {
	  this.next();
	  this.parseClassId(node, isStatement);
	  this.parseClassSuper(node);
	  var classBody = this.startNode();
	  var hadConstructor = false;
	  classBody.body = [];
	  this.expect(_tokentype.types.braceL);
	  while (!this.eat(_tokentype.types.braceR)) {
	    if (this.eat(_tokentype.types.semi)) continue;
	    var method = this.startNode();
	    var isGenerator = this.eat(_tokentype.types.star);
	    var isMaybeStatic = this.type === _tokentype.types.name && this.value === "static";
	    this.parsePropertyName(method);
	    method["static"] = isMaybeStatic && this.type !== _tokentype.types.parenL;
	    if (method["static"]) {
	      if (isGenerator) this.unexpected();
	      isGenerator = this.eat(_tokentype.types.star);
	      this.parsePropertyName(method);
	    }
	    method.kind = "method";
	    var isGetSet = false;
	    if (!method.computed) {
	      var key = method.key;

	      if (!isGenerator && key.type === "Identifier" && this.type !== _tokentype.types.parenL && (key.name === "get" || key.name === "set")) {
	        isGetSet = true;
	        method.kind = key.name;
	        key = this.parsePropertyName(method);
	      }
	      if (!method["static"] && (key.type === "Identifier" && key.name === "constructor" || key.type === "Literal" && key.value === "constructor")) {
	        if (hadConstructor) this.raise(key.start, "Duplicate constructor in the same class");
	        if (isGetSet) this.raise(key.start, "Constructor can't have get/set modifier");
	        if (isGenerator) this.raise(key.start, "Constructor can't be a generator");
	        method.kind = "constructor";
	        hadConstructor = true;
	      }
	    }
	    this.parseClassMethod(classBody, method, isGenerator);
	    if (isGetSet) {
	      var paramCount = method.kind === "get" ? 0 : 1;
	      if (method.value.params.length !== paramCount) {
	        var start = method.value.start;
	        if (method.kind === "get") this.raise(start, "getter should have no params");else this.raise(start, "setter should have exactly one param");
	      }
	    }
	  }
	  node.body = this.finishNode(classBody, "ClassBody");
	  return this.finishNode(node, isStatement ? "ClassDeclaration" : "ClassExpression");
	};

	pp.parseClassMethod = function (classBody, method, isGenerator) {
	  method.value = this.parseMethod(isGenerator);
	  classBody.body.push(this.finishNode(method, "MethodDefinition"));
	};

	pp.parseClassId = function (node, isStatement) {
	  node.id = this.type === _tokentype.types.name ? this.parseIdent() : isStatement ? this.unexpected() : null;
	};

	pp.parseClassSuper = function (node) {
	  node.superClass = this.eat(_tokentype.types._extends) ? this.parseExprSubscripts() : null;
	};

	// Parses module export declaration.

	pp.parseExport = function (node) {
	  this.next();
	  // export * from '...'
	  if (this.eat(_tokentype.types.star)) {
	    this.expectContextual("from");
	    node.source = this.type === _tokentype.types.string ? this.parseExprAtom() : this.unexpected();
	    this.semicolon();
	    return this.finishNode(node, "ExportAllDeclaration");
	  }
	  if (this.eat(_tokentype.types._default)) {
	    // export default ...
	    var expr = this.parseMaybeAssign();
	    var needsSemi = true;
	    if (expr.type == "FunctionExpression" || expr.type == "ClassExpression") {
	      needsSemi = false;
	      if (expr.id) {
	        expr.type = expr.type == "FunctionExpression" ? "FunctionDeclaration" : "ClassDeclaration";
	      }
	    }
	    node.declaration = expr;
	    if (needsSemi) this.semicolon();
	    return this.finishNode(node, "ExportDefaultDeclaration");
	  }
	  // export var|const|let|function|class ...
	  if (this.shouldParseExportStatement()) {
	    node.declaration = this.parseStatement(true);
	    node.specifiers = [];
	    node.source = null;
	  } else {
	    // export { x, y as z } [from '...']
	    node.declaration = null;
	    node.specifiers = this.parseExportSpecifiers();
	    if (this.eatContextual("from")) {
	      node.source = this.type === _tokentype.types.string ? this.parseExprAtom() : this.unexpected();
	    } else {
	      // check for keywords used as local names
	      for (var i = 0; i < node.specifiers.length; i++) {
	        if (this.keywords.test(node.specifiers[i].local.name) || this.reservedWords.test(node.specifiers[i].local.name)) {
	          this.unexpected(node.specifiers[i].local.start);
	        }
	      }

	      node.source = null;
	    }
	    this.semicolon();
	  }
	  return this.finishNode(node, "ExportNamedDeclaration");
	};

	pp.shouldParseExportStatement = function () {
	  return this.type.keyword;
	};

	// Parses a comma-separated list of module exports.

	pp.parseExportSpecifiers = function () {
	  var nodes = [],
	      first = true;
	  // export { x, y as z } [from '...']
	  this.expect(_tokentype.types.braceL);
	  while (!this.eat(_tokentype.types.braceR)) {
	    if (!first) {
	      this.expect(_tokentype.types.comma);
	      if (this.afterTrailingComma(_tokentype.types.braceR)) break;
	    } else first = false;

	    var node = this.startNode();
	    node.local = this.parseIdent(this.type === _tokentype.types._default);
	    node.exported = this.eatContextual("as") ? this.parseIdent(true) : node.local;
	    nodes.push(this.finishNode(node, "ExportSpecifier"));
	  }
	  return nodes;
	};

	// Parses import declaration.

	pp.parseImport = function (node) {
	  this.next();
	  // import '...'
	  if (this.type === _tokentype.types.string) {
	    node.specifiers = empty;
	    node.source = this.parseExprAtom();
	  } else {
	    node.specifiers = this.parseImportSpecifiers();
	    this.expectContextual("from");
	    node.source = this.type === _tokentype.types.string ? this.parseExprAtom() : this.unexpected();
	  }
	  this.semicolon();
	  return this.finishNode(node, "ImportDeclaration");
	};

	// Parses a comma-separated list of module imports.

	pp.parseImportSpecifiers = function () {
	  var nodes = [],
	      first = true;
	  if (this.type === _tokentype.types.name) {
	    // import defaultObj, { x, y as z } from '...'
	    var node = this.startNode();
	    node.local = this.parseIdent();
	    this.checkLVal(node.local, true);
	    nodes.push(this.finishNode(node, "ImportDefaultSpecifier"));
	    if (!this.eat(_tokentype.types.comma)) return nodes;
	  }
	  if (this.type === _tokentype.types.star) {
	    var node = this.startNode();
	    this.next();
	    this.expectContextual("as");
	    node.local = this.parseIdent();
	    this.checkLVal(node.local, true);
	    nodes.push(this.finishNode(node, "ImportNamespaceSpecifier"));
	    return nodes;
	  }
	  this.expect(_tokentype.types.braceL);
	  while (!this.eat(_tokentype.types.braceR)) {
	    if (!first) {
	      this.expect(_tokentype.types.comma);
	      if (this.afterTrailingComma(_tokentype.types.braceR)) break;
	    } else first = false;

	    var node = this.startNode();
	    node.imported = this.parseIdent(true);
	    node.local = this.eatContextual("as") ? this.parseIdent() : node.imported;
	    this.checkLVal(node.local, true);
	    nodes.push(this.finishNode(node, "ImportSpecifier"));
	  }
	  return nodes;
	};

	},{"./state":10,"./tokentype":14,"./whitespace":16}],12:[function(_dereq_,module,exports){
	// The algorithm used to determine whether a regexp can appear at a
	// given point in the program is loosely based on sweet.js' approach.
	// See https://github.com/mozilla/sweet.js/wiki/design

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _state = _dereq_("./state");

	var _tokentype = _dereq_("./tokentype");

	var _whitespace = _dereq_("./whitespace");

	var TokContext = function TokContext(token, isExpr, preserveSpace, override) {
	  _classCallCheck(this, TokContext);

	  this.token = token;
	  this.isExpr = !!isExpr;
	  this.preserveSpace = !!preserveSpace;
	  this.override = override;
	};

	exports.TokContext = TokContext;
	var types = {
	  b_stat: new TokContext("{", false),
	  b_expr: new TokContext("{", true),
	  b_tmpl: new TokContext("${", true),
	  p_stat: new TokContext("(", false),
	  p_expr: new TokContext("(", true),
	  q_tmpl: new TokContext("`", true, true, function (p) {
	    return p.readTmplToken();
	  }),
	  f_expr: new TokContext("function", true)
	};

	exports.types = types;
	var pp = _state.Parser.prototype;

	pp.initialContext = function () {
	  return [types.b_stat];
	};

	pp.braceIsBlock = function (prevType) {
	  if (prevType === _tokentype.types.colon) {
	    var _parent = this.curContext();
	    if (_parent === types.b_stat || _parent === types.b_expr) return !_parent.isExpr;
	  }
	  if (prevType === _tokentype.types._return) return _whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.start));
	  if (prevType === _tokentype.types._else || prevType === _tokentype.types.semi || prevType === _tokentype.types.eof || prevType === _tokentype.types.parenR) return true;
	  if (prevType == _tokentype.types.braceL) return this.curContext() === types.b_stat;
	  return !this.exprAllowed;
	};

	pp.updateContext = function (prevType) {
	  var update = undefined,
	      type = this.type;
	  if (type.keyword && prevType == _tokentype.types.dot) this.exprAllowed = false;else if (update = type.updateContext) update.call(this, prevType);else this.exprAllowed = type.beforeExpr;
	};

	// Token-specific context update code

	_tokentype.types.parenR.updateContext = _tokentype.types.braceR.updateContext = function () {
	  if (this.context.length == 1) {
	    this.exprAllowed = true;
	    return;
	  }
	  var out = this.context.pop();
	  if (out === types.b_stat && this.curContext() === types.f_expr) {
	    this.context.pop();
	    this.exprAllowed = false;
	  } else if (out === types.b_tmpl) {
	    this.exprAllowed = true;
	  } else {
	    this.exprAllowed = !out.isExpr;
	  }
	};

	_tokentype.types.braceL.updateContext = function (prevType) {
	  this.context.push(this.braceIsBlock(prevType) ? types.b_stat : types.b_expr);
	  this.exprAllowed = true;
	};

	_tokentype.types.dollarBraceL.updateContext = function () {
	  this.context.push(types.b_tmpl);
	  this.exprAllowed = true;
	};

	_tokentype.types.parenL.updateContext = function (prevType) {
	  var statementParens = prevType === _tokentype.types._if || prevType === _tokentype.types._for || prevType === _tokentype.types._with || prevType === _tokentype.types._while;
	  this.context.push(statementParens ? types.p_stat : types.p_expr);
	  this.exprAllowed = true;
	};

	_tokentype.types.incDec.updateContext = function () {
	  // tokExprAllowed stays unchanged
	};

	_tokentype.types._function.updateContext = function () {
	  if (this.curContext() !== types.b_stat) this.context.push(types.f_expr);
	  this.exprAllowed = false;
	};

	_tokentype.types.backQuote.updateContext = function () {
	  if (this.curContext() === types.q_tmpl) this.context.pop();else this.context.push(types.q_tmpl);
	  this.exprAllowed = false;
	};

	},{"./state":10,"./tokentype":14,"./whitespace":16}],13:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var _identifier = _dereq_("./identifier");

	var _tokentype = _dereq_("./tokentype");

	var _state = _dereq_("./state");

	var _locutil = _dereq_("./locutil");

	var _whitespace = _dereq_("./whitespace");

	// Object type used to represent tokens. Note that normally, tokens
	// simply exist as properties on the parser object. This is only
	// used for the onToken callback and the external tokenizer.

	var Token = function Token(p) {
	  _classCallCheck(this, Token);

	  this.type = p.type;
	  this.value = p.value;
	  this.start = p.start;
	  this.end = p.end;
	  if (p.options.locations) this.loc = new _locutil.SourceLocation(p, p.startLoc, p.endLoc);
	  if (p.options.ranges) this.range = [p.start, p.end];
	}

	// ## Tokenizer

	;

	exports.Token = Token;
	var pp = _state.Parser.prototype;

	// Are we running under Rhino?
	var isRhino = typeof Packages == "object" && Object.prototype.toString.call(Packages) == "[object JavaPackage]";

	// Move to the next token

	pp.next = function () {
	  if (this.options.onToken) this.options.onToken(new Token(this));

	  this.lastTokEnd = this.end;
	  this.lastTokStart = this.start;
	  this.lastTokEndLoc = this.endLoc;
	  this.lastTokStartLoc = this.startLoc;
	  this.nextToken();
	};

	pp.getToken = function () {
	  this.next();
	  return new Token(this);
	};

	// If we're in an ES6 environment, make parsers iterable
	if (typeof Symbol !== "undefined") pp[Symbol.iterator] = function () {
	  var self = this;
	  return { next: function next() {
	      var token = self.getToken();
	      return {
	        done: token.type === _tokentype.types.eof,
	        value: token
	      };
	    } };
	};

	// Toggle strict mode. Re-reads the next number or string to please
	// pedantic tests (`"use strict"; 010;` should fail).

	pp.setStrict = function (strict) {
	  this.strict = strict;
	  if (this.type !== _tokentype.types.num && this.type !== _tokentype.types.string) return;
	  this.pos = this.start;
	  if (this.options.locations) {
	    while (this.pos < this.lineStart) {
	      this.lineStart = this.input.lastIndexOf("\n", this.lineStart - 2) + 1;
	      --this.curLine;
	    }
	  }
	  this.nextToken();
	};

	pp.curContext = function () {
	  return this.context[this.context.length - 1];
	};

	// Read a single token, updating the parser object's token-related
	// properties.

	pp.nextToken = function () {
	  var curContext = this.curContext();
	  if (!curContext || !curContext.preserveSpace) this.skipSpace();

	  this.start = this.pos;
	  if (this.options.locations) this.startLoc = this.curPosition();
	  if (this.pos >= this.input.length) return this.finishToken(_tokentype.types.eof);

	  if (curContext.override) return curContext.override(this);else this.readToken(this.fullCharCodeAtPos());
	};

	pp.readToken = function (code) {
	  // Identifier or keyword. '\uXXXX' sequences are allowed in
	  // identifiers, so '\' also dispatches to that.
	  if (_identifier.isIdentifierStart(code, this.options.ecmaVersion >= 6) || code === 92 /* '\' */) return this.readWord();

	  return this.getTokenFromCode(code);
	};

	pp.fullCharCodeAtPos = function () {
	  var code = this.input.charCodeAt(this.pos);
	  if (code <= 0xd7ff || code >= 0xe000) return code;
	  var next = this.input.charCodeAt(this.pos + 1);
	  return (code << 10) + next - 0x35fdc00;
	};

	pp.skipBlockComment = function () {
	  var startLoc = this.options.onComment && this.curPosition();
	  var start = this.pos,
	      end = this.input.indexOf("*/", this.pos += 2);
	  if (end === -1) this.raise(this.pos - 2, "Unterminated comment");
	  this.pos = end + 2;
	  if (this.options.locations) {
	    _whitespace.lineBreakG.lastIndex = start;
	    var match = undefined;
	    while ((match = _whitespace.lineBreakG.exec(this.input)) && match.index < this.pos) {
	      ++this.curLine;
	      this.lineStart = match.index + match[0].length;
	    }
	  }
	  if (this.options.onComment) this.options.onComment(true, this.input.slice(start + 2, end), start, this.pos, startLoc, this.curPosition());
	};

	pp.skipLineComment = function (startSkip) {
	  var start = this.pos;
	  var startLoc = this.options.onComment && this.curPosition();
	  var ch = this.input.charCodeAt(this.pos += startSkip);
	  while (this.pos < this.input.length && ch !== 10 && ch !== 13 && ch !== 8232 && ch !== 8233) {
	    ++this.pos;
	    ch = this.input.charCodeAt(this.pos);
	  }
	  if (this.options.onComment) this.options.onComment(false, this.input.slice(start + startSkip, this.pos), start, this.pos, startLoc, this.curPosition());
	};

	// Called at the start of the parse and after every token. Skips
	// whitespace and comments, and.

	pp.skipSpace = function () {
	  loop: while (this.pos < this.input.length) {
	    var ch = this.input.charCodeAt(this.pos);
	    switch (ch) {
	      case 32:case 160:
	        // ' '
	        ++this.pos;
	        break;
	      case 13:
	        if (this.input.charCodeAt(this.pos + 1) === 10) {
	          ++this.pos;
	        }
	      case 10:case 8232:case 8233:
	        ++this.pos;
	        if (this.options.locations) {
	          ++this.curLine;
	          this.lineStart = this.pos;
	        }
	        break;
	      case 47:
	        // '/'
	        switch (this.input.charCodeAt(this.pos + 1)) {
	          case 42:
	            // '*'
	            this.skipBlockComment();
	            break;
	          case 47:
	            this.skipLineComment(2);
	            break;
	          default:
	            break loop;
	        }
	        break;
	      default:
	        if (ch > 8 && ch < 14 || ch >= 5760 && _whitespace.nonASCIIwhitespace.test(String.fromCharCode(ch))) {
	          ++this.pos;
	        } else {
	          break loop;
	        }
	    }
	  }
	};

	// Called at the end of every token. Sets `end`, `val`, and
	// maintains `context` and `exprAllowed`, and skips the space after
	// the token, so that the next one's `start` will point at the
	// right position.

	pp.finishToken = function (type, val) {
	  this.end = this.pos;
	  if (this.options.locations) this.endLoc = this.curPosition();
	  var prevType = this.type;
	  this.type = type;
	  this.value = val;

	  this.updateContext(prevType);
	};

	// ### Token reading

	// This is the function that is called to fetch the next token. It
	// is somewhat obscure, because it works in character codes rather
	// than characters, and because operator parsing has been inlined
	// into it.
	//
	// All in the name of speed.
	//
	pp.readToken_dot = function () {
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next >= 48 && next <= 57) return this.readNumber(true);
	  var next2 = this.input.charCodeAt(this.pos + 2);
	  if (this.options.ecmaVersion >= 6 && next === 46 && next2 === 46) {
	    // 46 = dot '.'
	    this.pos += 3;
	    return this.finishToken(_tokentype.types.ellipsis);
	  } else {
	    ++this.pos;
	    return this.finishToken(_tokentype.types.dot);
	  }
	};

	pp.readToken_slash = function () {
	  // '/'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (this.exprAllowed) {
	    ++this.pos;return this.readRegexp();
	  }
	  if (next === 61) return this.finishOp(_tokentype.types.assign, 2);
	  return this.finishOp(_tokentype.types.slash, 1);
	};

	pp.readToken_mult_modulo = function (code) {
	  // '%*'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === 61) return this.finishOp(_tokentype.types.assign, 2);
	  return this.finishOp(code === 42 ? _tokentype.types.star : _tokentype.types.modulo, 1);
	};

	pp.readToken_pipe_amp = function (code) {
	  // '|&'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === code) return this.finishOp(code === 124 ? _tokentype.types.logicalOR : _tokentype.types.logicalAND, 2);
	  if (next === 61) return this.finishOp(_tokentype.types.assign, 2);
	  return this.finishOp(code === 124 ? _tokentype.types.bitwiseOR : _tokentype.types.bitwiseAND, 1);
	};

	pp.readToken_caret = function () {
	  // '^'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === 61) return this.finishOp(_tokentype.types.assign, 2);
	  return this.finishOp(_tokentype.types.bitwiseXOR, 1);
	};

	pp.readToken_plus_min = function (code) {
	  // '+-'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === code) {
	    if (next == 45 && this.input.charCodeAt(this.pos + 2) == 62 && _whitespace.lineBreak.test(this.input.slice(this.lastTokEnd, this.pos))) {
	      // A `-->` line comment
	      this.skipLineComment(3);
	      this.skipSpace();
	      return this.nextToken();
	    }
	    return this.finishOp(_tokentype.types.incDec, 2);
	  }
	  if (next === 61) return this.finishOp(_tokentype.types.assign, 2);
	  return this.finishOp(_tokentype.types.plusMin, 1);
	};

	pp.readToken_lt_gt = function (code) {
	  // '<>'
	  var next = this.input.charCodeAt(this.pos + 1);
	  var size = 1;
	  if (next === code) {
	    size = code === 62 && this.input.charCodeAt(this.pos + 2) === 62 ? 3 : 2;
	    if (this.input.charCodeAt(this.pos + size) === 61) return this.finishOp(_tokentype.types.assign, size + 1);
	    return this.finishOp(_tokentype.types.bitShift, size);
	  }
	  if (next == 33 && code == 60 && this.input.charCodeAt(this.pos + 2) == 45 && this.input.charCodeAt(this.pos + 3) == 45) {
	    if (this.inModule) this.unexpected();
	    // `<!--`, an XML-style comment that should be interpreted as a line comment
	    this.skipLineComment(4);
	    this.skipSpace();
	    return this.nextToken();
	  }
	  if (next === 61) size = this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2;
	  return this.finishOp(_tokentype.types.relational, size);
	};

	pp.readToken_eq_excl = function (code) {
	  // '=!'
	  var next = this.input.charCodeAt(this.pos + 1);
	  if (next === 61) return this.finishOp(_tokentype.types.equality, this.input.charCodeAt(this.pos + 2) === 61 ? 3 : 2);
	  if (code === 61 && next === 62 && this.options.ecmaVersion >= 6) {
	    // '=>'
	    this.pos += 2;
	    return this.finishToken(_tokentype.types.arrow);
	  }
	  return this.finishOp(code === 61 ? _tokentype.types.eq : _tokentype.types.prefix, 1);
	};

	pp.getTokenFromCode = function (code) {
	  switch (code) {
	    // The interpretation of a dot depends on whether it is followed
	    // by a digit or another two dots.
	    case 46:
	      // '.'
	      return this.readToken_dot();

	    // Punctuation tokens.
	    case 40:
	      ++this.pos;return this.finishToken(_tokentype.types.parenL);
	    case 41:
	      ++this.pos;return this.finishToken(_tokentype.types.parenR);
	    case 59:
	      ++this.pos;return this.finishToken(_tokentype.types.semi);
	    case 44:
	      ++this.pos;return this.finishToken(_tokentype.types.comma);
	    case 91:
	      ++this.pos;return this.finishToken(_tokentype.types.bracketL);
	    case 93:
	      ++this.pos;return this.finishToken(_tokentype.types.bracketR);
	    case 123:
	      ++this.pos;return this.finishToken(_tokentype.types.braceL);
	    case 125:
	      ++this.pos;return this.finishToken(_tokentype.types.braceR);
	    case 58:
	      ++this.pos;return this.finishToken(_tokentype.types.colon);
	    case 63:
	      ++this.pos;return this.finishToken(_tokentype.types.question);

	    case 96:
	      // '`'
	      if (this.options.ecmaVersion < 6) break;
	      ++this.pos;
	      return this.finishToken(_tokentype.types.backQuote);

	    case 48:
	      // '0'
	      var next = this.input.charCodeAt(this.pos + 1);
	      if (next === 120 || next === 88) return this.readRadixNumber(16); // '0x', '0X' - hex number
	      if (this.options.ecmaVersion >= 6) {
	        if (next === 111 || next === 79) return this.readRadixNumber(8); // '0o', '0O' - octal number
	        if (next === 98 || next === 66) return this.readRadixNumber(2); // '0b', '0B' - binary number
	      }
	    // Anything else beginning with a digit is an integer, octal
	    // number, or float.
	    case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:
	      // 1-9
	      return this.readNumber(false);

	    // Quotes produce strings.
	    case 34:case 39:
	      // '"', "'"
	      return this.readString(code);

	    // Operators are parsed inline in tiny state machines. '=' (61) is
	    // often referred to. `finishOp` simply skips the amount of
	    // characters it is given as second argument, and returns a token
	    // of the type given by its first argument.

	    case 47:
	      // '/'
	      return this.readToken_slash();

	    case 37:case 42:
	      // '%*'
	      return this.readToken_mult_modulo(code);

	    case 124:case 38:
	      // '|&'
	      return this.readToken_pipe_amp(code);

	    case 94:
	      // '^'
	      return this.readToken_caret();

	    case 43:case 45:
	      // '+-'
	      return this.readToken_plus_min(code);

	    case 60:case 62:
	      // '<>'
	      return this.readToken_lt_gt(code);

	    case 61:case 33:
	      // '=!'
	      return this.readToken_eq_excl(code);

	    case 126:
	      // '~'
	      return this.finishOp(_tokentype.types.prefix, 1);
	  }

	  this.raise(this.pos, "Unexpected character '" + codePointToString(code) + "'");
	};

	pp.finishOp = function (type, size) {
	  var str = this.input.slice(this.pos, this.pos + size);
	  this.pos += size;
	  return this.finishToken(type, str);
	};

	// Parse a regular expression. Some context-awareness is necessary,
	// since a '/' inside a '[]' set does not end the expression.

	function tryCreateRegexp(src, flags, throwErrorAt, parser) {
	  try {
	    return new RegExp(src, flags);
	  } catch (e) {
	    if (throwErrorAt !== undefined) {
	      if (e instanceof SyntaxError) parser.raise(throwErrorAt, "Error parsing regular expression: " + e.message);
	      throw e;
	    }
	  }
	}

	var regexpUnicodeSupport = !!tryCreateRegexp("￿", "u");

	pp.readRegexp = function () {
	  var _this = this;

	  var escaped = undefined,
	      inClass = undefined,
	      start = this.pos;
	  for (;;) {
	    if (this.pos >= this.input.length) this.raise(start, "Unterminated regular expression");
	    var ch = this.input.charAt(this.pos);
	    if (_whitespace.lineBreak.test(ch)) this.raise(start, "Unterminated regular expression");
	    if (!escaped) {
	      if (ch === "[") inClass = true;else if (ch === "]" && inClass) inClass = false;else if (ch === "/" && !inClass) break;
	      escaped = ch === "\\";
	    } else escaped = false;
	    ++this.pos;
	  }
	  var content = this.input.slice(start, this.pos);
	  ++this.pos;
	  // Need to use `readWord1` because '\uXXXX' sequences are allowed
	  // here (don't ask).
	  var mods = this.readWord1();
	  var tmp = content;
	  if (mods) {
	    var validFlags = /^[gmsiy]*$/;
	    if (this.options.ecmaVersion >= 6) validFlags = /^[gmsiyu]*$/;
	    if (!validFlags.test(mods)) this.raise(start, "Invalid regular expression flag");
	    if (mods.indexOf('u') >= 0 && !regexpUnicodeSupport) {
	      // Replace each astral symbol and every Unicode escape sequence that
	      // possibly represents an astral symbol or a paired surrogate with a
	      // single ASCII symbol to avoid throwing on regular expressions that
	      // are only valid in combination with the `/u` flag.
	      // Note: replacing with the ASCII symbol `x` might cause false
	      // negatives in unlikely scenarios. For example, `[\u{61}-b]` is a
	      // perfectly valid pattern that is equivalent to `[a-b]`, but it would
	      // be replaced by `[x-b]` which throws an error.
	      tmp = tmp.replace(/\\u\{([0-9a-fA-F]+)\}/g, function (_match, code, offset) {
	        code = Number("0x" + code);
	        if (code > 0x10FFFF) _this.raise(start + offset + 3, "Code point out of bounds");
	        return "x";
	      });
	      tmp = tmp.replace(/\\u([a-fA-F0-9]{4})|[\uD800-\uDBFF][\uDC00-\uDFFF]/g, "x");
	    }
	  }
	  // Detect invalid regular expressions.
	  var value = null;
	  // Rhino's regular expression parser is flaky and throws uncatchable exceptions,
	  // so don't do detection if we are running under Rhino
	  if (!isRhino) {
	    tryCreateRegexp(tmp, undefined, start, this);
	    // Get a regular expression object for this pattern-flag pair, or `null` in
	    // case the current environment doesn't support the flags it uses.
	    value = tryCreateRegexp(content, mods);
	  }
	  return this.finishToken(_tokentype.types.regexp, { pattern: content, flags: mods, value: value });
	};

	// Read an integer in the given radix. Return null if zero digits
	// were read, the integer value otherwise. When `len` is given, this
	// will return `null` unless the integer has exactly `len` digits.

	pp.readInt = function (radix, len) {
	  var start = this.pos,
	      total = 0;
	  for (var i = 0, e = len == null ? Infinity : len; i < e; ++i) {
	    var code = this.input.charCodeAt(this.pos),
	        val = undefined;
	    if (code >= 97) val = code - 97 + 10; // a
	    else if (code >= 65) val = code - 65 + 10; // A
	      else if (code >= 48 && code <= 57) val = code - 48; // 0-9
	        else val = Infinity;
	    if (val >= radix) break;
	    ++this.pos;
	    total = total * radix + val;
	  }
	  if (this.pos === start || len != null && this.pos - start !== len) return null;

	  return total;
	};

	pp.readRadixNumber = function (radix) {
	  this.pos += 2; // 0x
	  var val = this.readInt(radix);
	  if (val == null) this.raise(this.start + 2, "Expected number in radix " + radix);
	  if (_identifier.isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");
	  return this.finishToken(_tokentype.types.num, val);
	};

	// Read an integer, octal integer, or floating-point number.

	pp.readNumber = function (startsWithDot) {
	  var start = this.pos,
	      isFloat = false,
	      octal = this.input.charCodeAt(this.pos) === 48;
	  if (!startsWithDot && this.readInt(10) === null) this.raise(start, "Invalid number");
	  var next = this.input.charCodeAt(this.pos);
	  if (next === 46) {
	    // '.'
	    ++this.pos;
	    this.readInt(10);
	    isFloat = true;
	    next = this.input.charCodeAt(this.pos);
	  }
	  if (next === 69 || next === 101) {
	    // 'eE'
	    next = this.input.charCodeAt(++this.pos);
	    if (next === 43 || next === 45) ++this.pos; // '+-'
	    if (this.readInt(10) === null) this.raise(start, "Invalid number");
	    isFloat = true;
	  }
	  if (_identifier.isIdentifierStart(this.fullCharCodeAtPos())) this.raise(this.pos, "Identifier directly after number");

	  var str = this.input.slice(start, this.pos),
	      val = undefined;
	  if (isFloat) val = parseFloat(str);else if (!octal || str.length === 1) val = parseInt(str, 10);else if (/[89]/.test(str) || this.strict) this.raise(start, "Invalid number");else val = parseInt(str, 8);
	  return this.finishToken(_tokentype.types.num, val);
	};

	// Read a string value, interpreting backslash-escapes.

	pp.readCodePoint = function () {
	  var ch = this.input.charCodeAt(this.pos),
	      code = undefined;

	  if (ch === 123) {
	    if (this.options.ecmaVersion < 6) this.unexpected();
	    var codePos = ++this.pos;
	    code = this.readHexChar(this.input.indexOf('}', this.pos) - this.pos);
	    ++this.pos;
	    if (code > 0x10FFFF) this.raise(codePos, "Code point out of bounds");
	  } else {
	    code = this.readHexChar(4);
	  }
	  return code;
	};

	function codePointToString(code) {
	  // UTF-16 Decoding
	  if (code <= 0xFFFF) return String.fromCharCode(code);
	  code -= 0x10000;
	  return String.fromCharCode((code >> 10) + 0xD800, (code & 1023) + 0xDC00);
	}

	pp.readString = function (quote) {
	  var out = "",
	      chunkStart = ++this.pos;
	  for (;;) {
	    if (this.pos >= this.input.length) this.raise(this.start, "Unterminated string constant");
	    var ch = this.input.charCodeAt(this.pos);
	    if (ch === quote) break;
	    if (ch === 92) {
	      // '\'
	      out += this.input.slice(chunkStart, this.pos);
	      out += this.readEscapedChar(false);
	      chunkStart = this.pos;
	    } else {
	      if (_whitespace.isNewLine(ch)) this.raise(this.start, "Unterminated string constant");
	      ++this.pos;
	    }
	  }
	  out += this.input.slice(chunkStart, this.pos++);
	  return this.finishToken(_tokentype.types.string, out);
	};

	// Reads template string tokens.

	pp.readTmplToken = function () {
	  var out = "",
	      chunkStart = this.pos;
	  for (;;) {
	    if (this.pos >= this.input.length) this.raise(this.start, "Unterminated template");
	    var ch = this.input.charCodeAt(this.pos);
	    if (ch === 96 || ch === 36 && this.input.charCodeAt(this.pos + 1) === 123) {
	      // '`', '${'
	      if (this.pos === this.start && this.type === _tokentype.types.template) {
	        if (ch === 36) {
	          this.pos += 2;
	          return this.finishToken(_tokentype.types.dollarBraceL);
	        } else {
	          ++this.pos;
	          return this.finishToken(_tokentype.types.backQuote);
	        }
	      }
	      out += this.input.slice(chunkStart, this.pos);
	      return this.finishToken(_tokentype.types.template, out);
	    }
	    if (ch === 92) {
	      // '\'
	      out += this.input.slice(chunkStart, this.pos);
	      out += this.readEscapedChar(true);
	      chunkStart = this.pos;
	    } else if (_whitespace.isNewLine(ch)) {
	      out += this.input.slice(chunkStart, this.pos);
	      ++this.pos;
	      switch (ch) {
	        case 13:
	          if (this.input.charCodeAt(this.pos) === 10) ++this.pos;
	        case 10:
	          out += "\n";
	          break;
	        default:
	          out += String.fromCharCode(ch);
	          break;
	      }
	      if (this.options.locations) {
	        ++this.curLine;
	        this.lineStart = this.pos;
	      }
	      chunkStart = this.pos;
	    } else {
	      ++this.pos;
	    }
	  }
	};

	// Used to read escaped characters

	pp.readEscapedChar = function (inTemplate) {
	  var ch = this.input.charCodeAt(++this.pos);
	  ++this.pos;
	  switch (ch) {
	    case 110:
	      return "\n"; // 'n' -> '\n'
	    case 114:
	      return "\r"; // 'r' -> '\r'
	    case 120:
	      return String.fromCharCode(this.readHexChar(2)); // 'x'
	    case 117:
	      return codePointToString(this.readCodePoint()); // 'u'
	    case 116:
	      return "\t"; // 't' -> '\t'
	    case 98:
	      return "\b"; // 'b' -> '\b'
	    case 118:
	      return "\u000b"; // 'v' -> '\u000b'
	    case 102:
	      return "\f"; // 'f' -> '\f'
	    case 13:
	      if (this.input.charCodeAt(this.pos) === 10) ++this.pos; // '\r\n'
	    case 10:
	      // ' \n'
	      if (this.options.locations) {
	        this.lineStart = this.pos;++this.curLine;
	      }
	      return "";
	    default:
	      if (ch >= 48 && ch <= 55) {
	        var octalStr = this.input.substr(this.pos - 1, 3).match(/^[0-7]+/)[0];
	        var octal = parseInt(octalStr, 8);
	        if (octal > 255) {
	          octalStr = octalStr.slice(0, -1);
	          octal = parseInt(octalStr, 8);
	        }
	        if (octal > 0 && (this.strict || inTemplate)) {
	          this.raise(this.pos - 2, "Octal literal in strict mode");
	        }
	        this.pos += octalStr.length - 1;
	        return String.fromCharCode(octal);
	      }
	      return String.fromCharCode(ch);
	  }
	};

	// Used to read character escape sequences ('\x', '\u', '\U').

	pp.readHexChar = function (len) {
	  var codePos = this.pos;
	  var n = this.readInt(16, len);
	  if (n === null) this.raise(codePos, "Bad character escape sequence");
	  return n;
	};

	// Read an identifier, and return it as a string. Sets `this.containsEsc`
	// to whether the word contained a '\u' escape.
	//
	// Incrementally adds only escaped chars, adding other chunks as-is
	// as a micro-optimization.

	pp.readWord1 = function () {
	  this.containsEsc = false;
	  var word = "",
	      first = true,
	      chunkStart = this.pos;
	  var astral = this.options.ecmaVersion >= 6;
	  while (this.pos < this.input.length) {
	    var ch = this.fullCharCodeAtPos();
	    if (_identifier.isIdentifierChar(ch, astral)) {
	      this.pos += ch <= 0xffff ? 1 : 2;
	    } else if (ch === 92) {
	      // "\"
	      this.containsEsc = true;
	      word += this.input.slice(chunkStart, this.pos);
	      var escStart = this.pos;
	      if (this.input.charCodeAt(++this.pos) != 117) // "u"
	        this.raise(this.pos, "Expecting Unicode escape sequence \\uXXXX");
	      ++this.pos;
	      var esc = this.readCodePoint();
	      if (!(first ? _identifier.isIdentifierStart : _identifier.isIdentifierChar)(esc, astral)) this.raise(escStart, "Invalid Unicode escape");
	      word += codePointToString(esc);
	      chunkStart = this.pos;
	    } else {
	      break;
	    }
	    first = false;
	  }
	  return word + this.input.slice(chunkStart, this.pos);
	};

	// Read an identifier or keyword token. Will check for reserved
	// words when necessary.

	pp.readWord = function () {
	  var word = this.readWord1();
	  var type = _tokentype.types.name;
	  if ((this.options.ecmaVersion >= 6 || !this.containsEsc) && this.keywords.test(word)) type = _tokentype.keywords[word];
	  return this.finishToken(type, word);
	};

	},{"./identifier":2,"./locutil":5,"./state":10,"./tokentype":14,"./whitespace":16}],14:[function(_dereq_,module,exports){
	// ## Token types

	// The assignment of fine-grained, information-carrying type objects
	// allows the tokenizer to store the information it has about a
	// token in a way that is very cheap for the parser to look up.

	// All token type variables start with an underscore, to make them
	// easy to recognize.

	// The `beforeExpr` property is used to disambiguate between regular
	// expressions and divisions. It is set on all token types that can
	// be followed by an expression (thus, a slash after them would be a
	// regular expression).
	//
	// The `startsExpr` property is used to check if the token ends a
	// `yield` expression. It is set on all token types that either can
	// directly start an expression (like a quotation mark) or can
	// continue an expression (like the body of a string).
	//
	// `isLoop` marks a keyword as starting a loop, which is important
	// to know when parsing a label, in order to allow or disallow
	// continue jumps to that label.

	"use strict";

	exports.__esModule = true;

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var TokenType = function TokenType(label) {
	  var conf = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  _classCallCheck(this, TokenType);

	  this.label = label;
	  this.keyword = conf.keyword;
	  this.beforeExpr = !!conf.beforeExpr;
	  this.startsExpr = !!conf.startsExpr;
	  this.isLoop = !!conf.isLoop;
	  this.isAssign = !!conf.isAssign;
	  this.prefix = !!conf.prefix;
	  this.postfix = !!conf.postfix;
	  this.binop = conf.binop || null;
	  this.updateContext = null;
	};

	exports.TokenType = TokenType;

	function binop(name, prec) {
	  return new TokenType(name, { beforeExpr: true, binop: prec });
	}
	var beforeExpr = { beforeExpr: true },
	    startsExpr = { startsExpr: true };

	var types = {
	  num: new TokenType("num", startsExpr),
	  regexp: new TokenType("regexp", startsExpr),
	  string: new TokenType("string", startsExpr),
	  name: new TokenType("name", startsExpr),
	  eof: new TokenType("eof"),

	  // Punctuation token types.
	  bracketL: new TokenType("[", { beforeExpr: true, startsExpr: true }),
	  bracketR: new TokenType("]"),
	  braceL: new TokenType("{", { beforeExpr: true, startsExpr: true }),
	  braceR: new TokenType("}"),
	  parenL: new TokenType("(", { beforeExpr: true, startsExpr: true }),
	  parenR: new TokenType(")"),
	  comma: new TokenType(",", beforeExpr),
	  semi: new TokenType(";", beforeExpr),
	  colon: new TokenType(":", beforeExpr),
	  dot: new TokenType("."),
	  question: new TokenType("?", beforeExpr),
	  arrow: new TokenType("=>", beforeExpr),
	  template: new TokenType("template"),
	  ellipsis: new TokenType("...", beforeExpr),
	  backQuote: new TokenType("`", startsExpr),
	  dollarBraceL: new TokenType("${", { beforeExpr: true, startsExpr: true }),

	  // Operators. These carry several kinds of properties to help the
	  // parser use them properly (the presence of these properties is
	  // what categorizes them as operators).
	  //
	  // `binop`, when present, specifies that this operator is a binary
	  // operator, and will refer to its precedence.
	  //
	  // `prefix` and `postfix` mark the operator as a prefix or postfix
	  // unary operator.
	  //
	  // `isAssign` marks all of `=`, `+=`, `-=` etcetera, which act as
	  // binary operators with a very low precedence, that should result
	  // in AssignmentExpression nodes.

	  eq: new TokenType("=", { beforeExpr: true, isAssign: true }),
	  assign: new TokenType("_=", { beforeExpr: true, isAssign: true }),
	  incDec: new TokenType("++/--", { prefix: true, postfix: true, startsExpr: true }),
	  prefix: new TokenType("prefix", { beforeExpr: true, prefix: true, startsExpr: true }),
	  logicalOR: binop("||", 1),
	  logicalAND: binop("&&", 2),
	  bitwiseOR: binop("|", 3),
	  bitwiseXOR: binop("^", 4),
	  bitwiseAND: binop("&", 5),
	  equality: binop("==/!=", 6),
	  relational: binop("</>", 7),
	  bitShift: binop("<</>>", 8),
	  plusMin: new TokenType("+/-", { beforeExpr: true, binop: 9, prefix: true, startsExpr: true }),
	  modulo: binop("%", 10),
	  star: binop("*", 10),
	  slash: binop("/", 10)
	};

	exports.types = types;
	// Map keyword names to token types.

	var keywords = {};

	exports.keywords = keywords;
	// Succinct definitions of keyword token types
	function kw(name) {
	  var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	  options.keyword = name;
	  keywords[name] = types["_" + name] = new TokenType(name, options);
	}

	kw("break");
	kw("case", beforeExpr);
	kw("catch");
	kw("continue");
	kw("debugger");
	kw("default", beforeExpr);
	kw("do", { isLoop: true, beforeExpr: true });
	kw("else", beforeExpr);
	kw("finally");
	kw("for", { isLoop: true });
	kw("function", startsExpr);
	kw("if");
	kw("return", beforeExpr);
	kw("switch");
	kw("throw", beforeExpr);
	kw("try");
	kw("var");
	kw("let");
	kw("const");
	kw("while", { isLoop: true });
	kw("with");
	kw("new", { beforeExpr: true, startsExpr: true });
	kw("this", startsExpr);
	kw("super", startsExpr);
	kw("class");
	kw("extends", beforeExpr);
	kw("export");
	kw("import");
	kw("yield", { beforeExpr: true, startsExpr: true });
	kw("null", startsExpr);
	kw("true", startsExpr);
	kw("false", startsExpr);
	kw("in", { beforeExpr: true, binop: 7 });
	kw("instanceof", { beforeExpr: true, binop: 7 });
	kw("typeof", { beforeExpr: true, prefix: true, startsExpr: true });
	kw("void", { beforeExpr: true, prefix: true, startsExpr: true });
	kw("delete", { beforeExpr: true, prefix: true, startsExpr: true });

	},{}],15:[function(_dereq_,module,exports){
	"use strict";

	exports.__esModule = true;
	exports.isArray = isArray;
	exports.has = has;

	function isArray(obj) {
	  return Object.prototype.toString.call(obj) === "[object Array]";
	}

	// Checks if an object has a property.

	function has(obj, propName) {
	  return Object.prototype.hasOwnProperty.call(obj, propName);
	}

	},{}],16:[function(_dereq_,module,exports){
	// Matches a whole line break (where CRLF is considered a single
	// line break). Used to count lines.

	"use strict";

	exports.__esModule = true;
	exports.isNewLine = isNewLine;
	var lineBreak = /\r\n?|\n|\u2028|\u2029/;
	exports.lineBreak = lineBreak;
	var lineBreakG = new RegExp(lineBreak.source, "g");

	exports.lineBreakG = lineBreakG;

	function isNewLine(code) {
	  return code === 10 || code === 13 || code === 0x2028 || code == 0x2029;
	}

	var nonASCIIwhitespace = /[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/;
	exports.nonASCIIwhitespace = nonASCIIwhitespace;

	},{}]},{},[3])(3)
	});

/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    util = __webpack_require__(22);

	function PauseException(resumer) {
	    this.message = 'PauseException';
	    this.reject = null;
	    this.resolve = null;
	    this.resumer = resumer;
	    this.states = [];
	}

	util.inherits(PauseException, Error);

	_.extend(PauseException.prototype, {
	    add: function (state) {
	        this.states.push(state);
	    },

	    now: function () {
	        throw this;
	    },

	    resume: function (result) {
	        var exception = this;

	        try {
	            exception.resumer(exception.resolve, exception.reject, null, result, exception.states);
	        } catch (e) {
	            // Just re-throw if another PauseException gets raised,
	            // we're just looking for normal errors
	            if (e instanceof PauseException) {
	                throw e;
	            }

	            // Reject the promise for the run with the error thrown
	            exception.reject(e);
	        }
	    },

	    setPromise: function (resolve, reject) {
	        var exception = this;

	        exception.resolve = resolve;
	        exception.reject = reject;
	    },

	    throw: function (error) {
	        var exception = this;

	        try {
	            exception.resumer(exception.resolve, exception.reject, error, null, exception.states);
	        } catch (e) {
	            // Just re-throw if another PauseException gets raised,
	            // we're just looking for normal errors
	            if (e instanceof PauseException) {
	                throw e;
	            }

	            // Reject the promise for the run with the error thrown
	            exception.reject(e);
	        }
	    }
	});

	module.exports = PauseException;


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var immediate = __webpack_require__(62);

	/* istanbul ignore next */
	function INTERNAL() {}

	var handlers = {};

	var REJECTED = ['REJECTED'];
	var FULFILLED = ['FULFILLED'];
	var PENDING = ['PENDING'];
	/* istanbul ignore else */
	if (!process.browser) {
	  // in which we actually take advantage of JS scoping
	  var UNHANDLED = ['UNHANDLED'];
	}

	module.exports = exports = Promise;

	function Promise(resolver) {
	  if (typeof resolver !== 'function') {
	    throw new TypeError('resolver must be a function');
	  }
	  this.state = PENDING;
	  this.queue = [];
	  this.outcome = void 0;
	  /* istanbul ignore else */
	  if (!process.browser) {
	    this.handled = UNHANDLED;
	  }
	  if (resolver !== INTERNAL) {
	    safelyResolveThenable(this, resolver);
	  }
	}

	Promise.prototype.catch = function (onRejected) {
	  return this.then(null, onRejected);
	};
	Promise.prototype.then = function (onFulfilled, onRejected) {
	  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
	    typeof onRejected !== 'function' && this.state === REJECTED) {
	    return this;
	  }
	  var promise = new this.constructor(INTERNAL);
	  /* istanbul ignore else */
	  if (!process.browser) {
	    if (typeof onRejected === 'function' && this.handled === UNHANDLED) {
	      this.handled = null;
	    }
	  }
	  if (this.state !== PENDING) {
	    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
	    unwrap(promise, resolver, this.outcome);
	  } else {
	    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
	  }

	  return promise;
	};
	function QueueItem(promise, onFulfilled, onRejected) {
	  this.promise = promise;
	  if (typeof onFulfilled === 'function') {
	    this.onFulfilled = onFulfilled;
	    this.callFulfilled = this.otherCallFulfilled;
	  }
	  if (typeof onRejected === 'function') {
	    this.onRejected = onRejected;
	    this.callRejected = this.otherCallRejected;
	  }
	}
	QueueItem.prototype.callFulfilled = function (value) {
	  handlers.resolve(this.promise, value);
	};
	QueueItem.prototype.otherCallFulfilled = function (value) {
	  unwrap(this.promise, this.onFulfilled, value);
	};
	QueueItem.prototype.callRejected = function (value) {
	  handlers.reject(this.promise, value);
	};
	QueueItem.prototype.otherCallRejected = function (value) {
	  unwrap(this.promise, this.onRejected, value);
	};

	function unwrap(promise, func, value) {
	  immediate(function () {
	    var returnValue;
	    try {
	      returnValue = func(value);
	    } catch (e) {
	      return handlers.reject(promise, e);
	    }
	    if (returnValue === promise) {
	      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
	    } else {
	      handlers.resolve(promise, returnValue);
	    }
	  });
	}

	handlers.resolve = function (self, value) {
	  var result = tryCatch(getThen, value);
	  if (result.status === 'error') {
	    return handlers.reject(self, result.value);
	  }
	  var thenable = result.value;

	  if (thenable) {
	    safelyResolveThenable(self, thenable);
	  } else {
	    self.state = FULFILLED;
	    self.outcome = value;
	    var i = -1;
	    var len = self.queue.length;
	    while (++i < len) {
	      self.queue[i].callFulfilled(value);
	    }
	  }
	  return self;
	};
	handlers.reject = function (self, error) {
	  self.state = REJECTED;
	  self.outcome = error;
	  /* istanbul ignore else */
	  if (!process.browser) {
	    if (self.handled === UNHANDLED) {
	      immediate(function () {
	        if (self.handled === UNHANDLED) {
	          process.emit('unhandledRejection', error, self);
	        }
	      });
	    }
	  }
	  var i = -1;
	  var len = self.queue.length;
	  while (++i < len) {
	    self.queue[i].callRejected(error);
	  }
	  return self;
	};

	function getThen(obj) {
	  // Make sure we only access the accessor once as required by the spec
	  var then = obj && obj.then;
	  if (obj && typeof obj === 'object' && typeof then === 'function') {
	    return function appyThen() {
	      then.apply(obj, arguments);
	    };
	  }
	}

	function safelyResolveThenable(self, thenable) {
	  // Either fulfill, reject or reject with error
	  var called = false;
	  function onError(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.reject(self, value);
	  }

	  function onSuccess(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.resolve(self, value);
	  }

	  function tryToUnwrap() {
	    thenable(onSuccess, onError);
	  }

	  var result = tryCatch(tryToUnwrap);
	  if (result.status === 'error') {
	    onError(result.value);
	  }
	}

	function tryCatch(func, value) {
	  var out = {};
	  try {
	    out.value = func(value);
	    out.status = 'success';
	  } catch (e) {
	    out.status = 'error';
	    out.value = e;
	  }
	  return out;
	}

	exports.resolve = resolve;
	function resolve(value) {
	  if (value instanceof this) {
	    return value;
	  }
	  return handlers.resolve(new this(INTERNAL), value);
	}

	exports.reject = reject;
	function reject(reason) {
	  var promise = new this(INTERNAL);
	  return handlers.reject(promise, reason);
	}

	exports.all = all;
	function all(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var values = new Array(len);
	  var resolved = 0;
	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    allResolver(iterable[i], i);
	  }
	  return promise;
	  function allResolver(value, i) {
	    self.resolve(value).then(resolveFromAll, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	    function resolveFromAll(outValue) {
	      values[i] = outValue;
	      if (++resolved === len && !called) {
	        called = true;
	        handlers.resolve(promise, values);
	      }
	    }
	  }
	}

	exports.race = race;
	function race(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    resolver(iterable[i]);
	  }
	  return promise;
	  function resolver(value) {
	    self.resolve(value).then(function (response) {
	      if (!called) {
	        called = true;
	        handlers.resolve(promise, response);
	      }
	    }, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(23)))

/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';
	var Mutation = global.MutationObserver || global.WebKitMutationObserver;

	var scheduleDrain;

	if (process.browser) {
	  if (Mutation) {
	    var called = 0;
	    var observer = new Mutation(nextTick);
	    var element = global.document.createTextNode('');
	    observer.observe(element, {
	      characterData: true
	    });
	    scheduleDrain = function () {
	      element.data = (called = ++called % 2);
	    };
	  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
	    var channel = new global.MessageChannel();
	    channel.port1.onmessage = nextTick;
	    scheduleDrain = function () {
	      channel.port2.postMessage(0);
	    };
	  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
	    scheduleDrain = function () {

	      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	      var scriptEl = global.document.createElement('script');
	      scriptEl.onreadystatechange = function () {
	        nextTick();

	        scriptEl.onreadystatechange = null;
	        scriptEl.parentNode.removeChild(scriptEl);
	        scriptEl = null;
	      };
	      global.document.documentElement.appendChild(scriptEl);
	    };
	  } else {
	    scheduleDrain = function () {
	      setTimeout(nextTick, 0);
	    };
	  }
	} else {
	  scheduleDrain = function () {
	    process.nextTick(nextTick);
	  };
	}

	var draining;
	var queue = [];
	//named nextTick for less confusing stack traces
	function nextTick() {
	  draining = true;
	  var i, oldQueue;
	  var len = queue.length;
	  while (len) {
	    oldQueue = queue;
	    queue = [];
	    i = -1;
	    while (++i < len) {
	      oldQueue[i]();
	    }
	    len = queue.length;
	  }
	  draining = false;
	}

	module.exports = immediate;
	function immediate(task) {
	  if (queue.push(task) === 1 && !draining) {
	    scheduleDrain();
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(23)))

/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var util = __webpack_require__(22);

	function ResumeException(error) {
	    this.error = error;
	}

	util.inherits(ResumeException, Error);

	module.exports = ResumeException;


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = estraverse,
	    ArrayExpressionTranspiler = __webpack_require__(65),
	    AssignmentExpressionTranspiler = __webpack_require__(68),
	    BinaryExpressionTranspiler = __webpack_require__(69),
	    BlockStatementTranspiler = __webpack_require__(70),
	    BreakStatementTranspiler = __webpack_require__(72),
	    CallExpressionTranspiler = __webpack_require__(73),
	    ContinueStatementTranspiler = __webpack_require__(74),
	    DebuggerStatementTranspiler = __webpack_require__(75),
	    DoWhileStatementTranspiler = __webpack_require__(76),
	    ExpressionStatementTranspiler = __webpack_require__(77),
	    ExpressionTranspiler = __webpack_require__(78),
	    ForStatementTranspiler = __webpack_require__(79),
	    FunctionDeclarationTranspiler = __webpack_require__(80),
	    FunctionExpressionTranspiler = __webpack_require__(81),
	    FunctionTranspiler = __webpack_require__(82),
	    IdentifierTranspiler = __webpack_require__(84),
	    IfStatementTranspiler = __webpack_require__(85),
	    LabeledStatementTranspiler = __webpack_require__(86),
	    LogicalExpressionTranspiler = __webpack_require__(87),
	    MemberExpressionTranspiler = __webpack_require__(88),
	    ObjectExpressionTranspiler = __webpack_require__(89),
	    ProgramTranspiler = __webpack_require__(90),
	    PropertyTranspiler = __webpack_require__(91),
	    ReturnStatementTranspiler = __webpack_require__(92),
	    SequenceExpressionTranspiler = __webpack_require__(93),
	    StatementTranspiler = __webpack_require__(94),
	    ThrowStatementTranspiler = __webpack_require__(95),
	    TryStatementTranspiler = __webpack_require__(96),
	    UpdateExpressionTranspiler = __webpack_require__(97),
	    VariableDeclarationTranspiler = __webpack_require__(98),
	    WhileStatementTranspiler = __webpack_require__(99),
	    WithStatementTranspiler = __webpack_require__(100);

	function Transpiler() {
	    var expressionTranspiler = new ExpressionTranspiler(),
	        statementTranspiler = new StatementTranspiler(),
	        functionTranspiler = new FunctionTranspiler(statementTranspiler);

	    _.each([
	        BlockStatementTranspiler,
	        BreakStatementTranspiler,
	        ContinueStatementTranspiler,
	        DebuggerStatementTranspiler,
	        DoWhileStatementTranspiler,
	        ExpressionStatementTranspiler,
	        ForStatementTranspiler,
	        IfStatementTranspiler,
	        LabeledStatementTranspiler,
	        ProgramTranspiler,
	        ReturnStatementTranspiler,
	        ThrowStatementTranspiler,
	        TryStatementTranspiler,
	        VariableDeclarationTranspiler,
	        WhileStatementTranspiler,
	        WithStatementTranspiler
	    ], function (Class) {
	        statementTranspiler.addTranspiler(new Class(statementTranspiler, expressionTranspiler));
	    });

	    statementTranspiler.addTranspiler(
	        new FunctionDeclarationTranspiler(
	            statementTranspiler,
	            expressionTranspiler,
	            functionTranspiler
	        )
	    );

	    _.each([
	        ArrayExpressionTranspiler,
	        AssignmentExpressionTranspiler,
	        BinaryExpressionTranspiler,
	        CallExpressionTranspiler,
	        IdentifierTranspiler,
	        LogicalExpressionTranspiler,
	        MemberExpressionTranspiler,
	        ObjectExpressionTranspiler,
	        PropertyTranspiler,
	        SequenceExpressionTranspiler,
	        UpdateExpressionTranspiler
	    ], function (Class) {
	        expressionTranspiler.addTranspiler(new Class(statementTranspiler, expressionTranspiler));
	    });

	    expressionTranspiler.addTranspiler(
	        new FunctionExpressionTranspiler(
	            statementTranspiler,
	            expressionTranspiler,
	            functionTranspiler
	        )
	    );

	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(Transpiler.prototype, {
	    transpile: function (ast) {
	        return this.statementTranspiler.transpile(ast, null);
	    }
	});

	module.exports = Transpiler;


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    ELEMENTS = 'elements',
	    Syntax = estraverse.Syntax;

	function ArrayExpressionTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(ArrayExpressionTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.ArrayExpression;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var transpiler = this;

	        return {
	            'type': Syntax.ArrayExpression,
	            'elements': transpiler.expressionTranspiler.transpileArray(
	                node[ELEMENTS],
	                node,
	                functionContext,
	                blockContext
	            )
	        };
	    }
	});

	module.exports = ArrayExpressionTranspiler;


/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	/*
	  Copyright (C) 2012-2013 Yusuke Suzuki <utatane.tea@gmail.com>
	  Copyright (C) 2012 Ariya Hidayat <ariya.hidayat@gmail.com>

	  Redistribution and use in source and binary forms, with or without
	  modification, are permitted provided that the following conditions are met:

	    * Redistributions of source code must retain the above copyright
	      notice, this list of conditions and the following disclaimer.
	    * Redistributions in binary form must reproduce the above copyright
	      notice, this list of conditions and the following disclaimer in the
	      documentation and/or other materials provided with the distribution.

	  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
	  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
	  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
	  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
	  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
	  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
	  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
	  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
	  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
	  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
	*/
	/*jslint vars:false, bitwise:true*/
	/*jshint indent:4*/
	/*global exports:true*/
	(function clone(exports) {
	    'use strict';

	    var Syntax,
	        isArray,
	        VisitorOption,
	        VisitorKeys,
	        objectCreate,
	        objectKeys,
	        BREAK,
	        SKIP,
	        REMOVE;

	    function ignoreJSHintError() { }

	    isArray = Array.isArray;
	    if (!isArray) {
	        isArray = function isArray(array) {
	            return Object.prototype.toString.call(array) === '[object Array]';
	        };
	    }

	    function deepCopy(obj) {
	        var ret = {}, key, val;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                val = obj[key];
	                if (typeof val === 'object' && val !== null) {
	                    ret[key] = deepCopy(val);
	                } else {
	                    ret[key] = val;
	                }
	            }
	        }
	        return ret;
	    }

	    function shallowCopy(obj) {
	        var ret = {}, key;
	        for (key in obj) {
	            if (obj.hasOwnProperty(key)) {
	                ret[key] = obj[key];
	            }
	        }
	        return ret;
	    }
	    ignoreJSHintError(shallowCopy);

	    // based on LLVM libc++ upper_bound / lower_bound
	    // MIT License

	    function upperBound(array, func) {
	        var diff, len, i, current;

	        len = array.length;
	        i = 0;

	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                len = diff;
	            } else {
	                i = current + 1;
	                len -= diff + 1;
	            }
	        }
	        return i;
	    }

	    function lowerBound(array, func) {
	        var diff, len, i, current;

	        len = array.length;
	        i = 0;

	        while (len) {
	            diff = len >>> 1;
	            current = i + diff;
	            if (func(array[current])) {
	                i = current + 1;
	                len -= diff + 1;
	            } else {
	                len = diff;
	            }
	        }
	        return i;
	    }
	    ignoreJSHintError(lowerBound);

	    objectCreate = Object.create || (function () {
	        function F() { }

	        return function (o) {
	            F.prototype = o;
	            return new F();
	        };
	    })();

	    objectKeys = Object.keys || function (o) {
	        var keys = [], key;
	        for (key in o) {
	            keys.push(key);
	        }
	        return keys;
	    };

	    function extend(to, from) {
	        var keys = objectKeys(from), key, i, len;
	        for (i = 0, len = keys.length; i < len; i += 1) {
	            key = keys[i];
	            to[key] = from[key];
	        }
	        return to;
	    }

	    Syntax = {
	        AssignmentExpression: 'AssignmentExpression',
	        AssignmentPattern: 'AssignmentPattern',
	        ArrayExpression: 'ArrayExpression',
	        ArrayPattern: 'ArrayPattern',
	        ArrowFunctionExpression: 'ArrowFunctionExpression',
	        AwaitExpression: 'AwaitExpression', // CAUTION: It's deferred to ES7.
	        BlockStatement: 'BlockStatement',
	        BinaryExpression: 'BinaryExpression',
	        BreakStatement: 'BreakStatement',
	        CallExpression: 'CallExpression',
	        CatchClause: 'CatchClause',
	        ClassBody: 'ClassBody',
	        ClassDeclaration: 'ClassDeclaration',
	        ClassExpression: 'ClassExpression',
	        ComprehensionBlock: 'ComprehensionBlock',  // CAUTION: It's deferred to ES7.
	        ComprehensionExpression: 'ComprehensionExpression',  // CAUTION: It's deferred to ES7.
	        ConditionalExpression: 'ConditionalExpression',
	        ContinueStatement: 'ContinueStatement',
	        DebuggerStatement: 'DebuggerStatement',
	        DirectiveStatement: 'DirectiveStatement',
	        DoWhileStatement: 'DoWhileStatement',
	        EmptyStatement: 'EmptyStatement',
	        ExportAllDeclaration: 'ExportAllDeclaration',
	        ExportDefaultDeclaration: 'ExportDefaultDeclaration',
	        ExportNamedDeclaration: 'ExportNamedDeclaration',
	        ExportSpecifier: 'ExportSpecifier',
	        ExpressionStatement: 'ExpressionStatement',
	        ForStatement: 'ForStatement',
	        ForInStatement: 'ForInStatement',
	        ForOfStatement: 'ForOfStatement',
	        FunctionDeclaration: 'FunctionDeclaration',
	        FunctionExpression: 'FunctionExpression',
	        GeneratorExpression: 'GeneratorExpression',  // CAUTION: It's deferred to ES7.
	        Identifier: 'Identifier',
	        IfStatement: 'IfStatement',
	        ImportDeclaration: 'ImportDeclaration',
	        ImportDefaultSpecifier: 'ImportDefaultSpecifier',
	        ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
	        ImportSpecifier: 'ImportSpecifier',
	        Literal: 'Literal',
	        LabeledStatement: 'LabeledStatement',
	        LogicalExpression: 'LogicalExpression',
	        MemberExpression: 'MemberExpression',
	        MetaProperty: 'MetaProperty',
	        MethodDefinition: 'MethodDefinition',
	        ModuleSpecifier: 'ModuleSpecifier',
	        NewExpression: 'NewExpression',
	        ObjectExpression: 'ObjectExpression',
	        ObjectPattern: 'ObjectPattern',
	        Program: 'Program',
	        Property: 'Property',
	        RestElement: 'RestElement',
	        ReturnStatement: 'ReturnStatement',
	        SequenceExpression: 'SequenceExpression',
	        SpreadElement: 'SpreadElement',
	        Super: 'Super',
	        SwitchStatement: 'SwitchStatement',
	        SwitchCase: 'SwitchCase',
	        TaggedTemplateExpression: 'TaggedTemplateExpression',
	        TemplateElement: 'TemplateElement',
	        TemplateLiteral: 'TemplateLiteral',
	        ThisExpression: 'ThisExpression',
	        ThrowStatement: 'ThrowStatement',
	        TryStatement: 'TryStatement',
	        UnaryExpression: 'UnaryExpression',
	        UpdateExpression: 'UpdateExpression',
	        VariableDeclaration: 'VariableDeclaration',
	        VariableDeclarator: 'VariableDeclarator',
	        WhileStatement: 'WhileStatement',
	        WithStatement: 'WithStatement',
	        YieldExpression: 'YieldExpression'
	    };

	    VisitorKeys = {
	        AssignmentExpression: ['left', 'right'],
	        AssignmentPattern: ['left', 'right'],
	        ArrayExpression: ['elements'],
	        ArrayPattern: ['elements'],
	        ArrowFunctionExpression: ['params', 'body'],
	        AwaitExpression: ['argument'], // CAUTION: It's deferred to ES7.
	        BlockStatement: ['body'],
	        BinaryExpression: ['left', 'right'],
	        BreakStatement: ['label'],
	        CallExpression: ['callee', 'arguments'],
	        CatchClause: ['param', 'body'],
	        ClassBody: ['body'],
	        ClassDeclaration: ['id', 'superClass', 'body'],
	        ClassExpression: ['id', 'superClass', 'body'],
	        ComprehensionBlock: ['left', 'right'],  // CAUTION: It's deferred to ES7.
	        ComprehensionExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
	        ConditionalExpression: ['test', 'consequent', 'alternate'],
	        ContinueStatement: ['label'],
	        DebuggerStatement: [],
	        DirectiveStatement: [],
	        DoWhileStatement: ['body', 'test'],
	        EmptyStatement: [],
	        ExportAllDeclaration: ['source'],
	        ExportDefaultDeclaration: ['declaration'],
	        ExportNamedDeclaration: ['declaration', 'specifiers', 'source'],
	        ExportSpecifier: ['exported', 'local'],
	        ExpressionStatement: ['expression'],
	        ForStatement: ['init', 'test', 'update', 'body'],
	        ForInStatement: ['left', 'right', 'body'],
	        ForOfStatement: ['left', 'right', 'body'],
	        FunctionDeclaration: ['id', 'params', 'body'],
	        FunctionExpression: ['id', 'params', 'body'],
	        GeneratorExpression: ['blocks', 'filter', 'body'],  // CAUTION: It's deferred to ES7.
	        Identifier: [],
	        IfStatement: ['test', 'consequent', 'alternate'],
	        ImportDeclaration: ['specifiers', 'source'],
	        ImportDefaultSpecifier: ['local'],
	        ImportNamespaceSpecifier: ['local'],
	        ImportSpecifier: ['imported', 'local'],
	        Literal: [],
	        LabeledStatement: ['label', 'body'],
	        LogicalExpression: ['left', 'right'],
	        MemberExpression: ['object', 'property'],
	        MetaProperty: ['meta', 'property'],
	        MethodDefinition: ['key', 'value'],
	        ModuleSpecifier: [],
	        NewExpression: ['callee', 'arguments'],
	        ObjectExpression: ['properties'],
	        ObjectPattern: ['properties'],
	        Program: ['body'],
	        Property: ['key', 'value'],
	        RestElement: [ 'argument' ],
	        ReturnStatement: ['argument'],
	        SequenceExpression: ['expressions'],
	        SpreadElement: ['argument'],
	        Super: [],
	        SwitchStatement: ['discriminant', 'cases'],
	        SwitchCase: ['test', 'consequent'],
	        TaggedTemplateExpression: ['tag', 'quasi'],
	        TemplateElement: [],
	        TemplateLiteral: ['quasis', 'expressions'],
	        ThisExpression: [],
	        ThrowStatement: ['argument'],
	        TryStatement: ['block', 'handler', 'finalizer'],
	        UnaryExpression: ['argument'],
	        UpdateExpression: ['argument'],
	        VariableDeclaration: ['declarations'],
	        VariableDeclarator: ['id', 'init'],
	        WhileStatement: ['test', 'body'],
	        WithStatement: ['object', 'body'],
	        YieldExpression: ['argument']
	    };

	    // unique id
	    BREAK = {};
	    SKIP = {};
	    REMOVE = {};

	    VisitorOption = {
	        Break: BREAK,
	        Skip: SKIP,
	        Remove: REMOVE
	    };

	    function Reference(parent, key) {
	        this.parent = parent;
	        this.key = key;
	    }

	    Reference.prototype.replace = function replace(node) {
	        this.parent[this.key] = node;
	    };

	    Reference.prototype.remove = function remove() {
	        if (isArray(this.parent)) {
	            this.parent.splice(this.key, 1);
	            return true;
	        } else {
	            this.replace(null);
	            return false;
	        }
	    };

	    function Element(node, path, wrap, ref) {
	        this.node = node;
	        this.path = path;
	        this.wrap = wrap;
	        this.ref = ref;
	    }

	    function Controller() { }

	    // API:
	    // return property path array from root to current node
	    Controller.prototype.path = function path() {
	        var i, iz, j, jz, result, element;

	        function addToPath(result, path) {
	            if (isArray(path)) {
	                for (j = 0, jz = path.length; j < jz; ++j) {
	                    result.push(path[j]);
	                }
	            } else {
	                result.push(path);
	            }
	        }

	        // root node
	        if (!this.__current.path) {
	            return null;
	        }

	        // first node is sentinel, second node is root element
	        result = [];
	        for (i = 2, iz = this.__leavelist.length; i < iz; ++i) {
	            element = this.__leavelist[i];
	            addToPath(result, element.path);
	        }
	        addToPath(result, this.__current.path);
	        return result;
	    };

	    // API:
	    // return type of current node
	    Controller.prototype.type = function () {
	        var node = this.current();
	        return node.type || this.__current.wrap;
	    };

	    // API:
	    // return array of parent elements
	    Controller.prototype.parents = function parents() {
	        var i, iz, result;

	        // first node is sentinel
	        result = [];
	        for (i = 1, iz = this.__leavelist.length; i < iz; ++i) {
	            result.push(this.__leavelist[i].node);
	        }

	        return result;
	    };

	    // API:
	    // return current node
	    Controller.prototype.current = function current() {
	        return this.__current.node;
	    };

	    Controller.prototype.__execute = function __execute(callback, element) {
	        var previous, result;

	        result = undefined;

	        previous  = this.__current;
	        this.__current = element;
	        this.__state = null;
	        if (callback) {
	            result = callback.call(this, element.node, this.__leavelist[this.__leavelist.length - 1].node);
	        }
	        this.__current = previous;

	        return result;
	    };

	    // API:
	    // notify control skip / break
	    Controller.prototype.notify = function notify(flag) {
	        this.__state = flag;
	    };

	    // API:
	    // skip child nodes of current node
	    Controller.prototype.skip = function () {
	        this.notify(SKIP);
	    };

	    // API:
	    // break traversals
	    Controller.prototype['break'] = function () {
	        this.notify(BREAK);
	    };

	    // API:
	    // remove node
	    Controller.prototype.remove = function () {
	        this.notify(REMOVE);
	    };

	    Controller.prototype.__initialize = function(root, visitor) {
	        this.visitor = visitor;
	        this.root = root;
	        this.__worklist = [];
	        this.__leavelist = [];
	        this.__current = null;
	        this.__state = null;
	        this.__fallback = visitor.fallback === 'iteration';
	        this.__keys = VisitorKeys;
	        if (visitor.keys) {
	            this.__keys = extend(objectCreate(this.__keys), visitor.keys);
	        }
	    };

	    function isNode(node) {
	        if (node == null) {
	            return false;
	        }
	        return typeof node === 'object' && typeof node.type === 'string';
	    }

	    function isProperty(nodeType, key) {
	        return (nodeType === Syntax.ObjectExpression || nodeType === Syntax.ObjectPattern) && 'properties' === key;
	    }

	    Controller.prototype.traverse = function traverse(root, visitor) {
	        var worklist,
	            leavelist,
	            element,
	            node,
	            nodeType,
	            ret,
	            key,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel;

	        this.__initialize(root, visitor);

	        sentinel = {};

	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;

	        // initialize
	        worklist.push(new Element(root, null, null, null));
	        leavelist.push(new Element(null, null, null, null));

	        while (worklist.length) {
	            element = worklist.pop();

	            if (element === sentinel) {
	                element = leavelist.pop();

	                ret = this.__execute(visitor.leave, element);

	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }
	                continue;
	            }

	            if (element.node) {

	                ret = this.__execute(visitor.enter, element);

	                if (this.__state === BREAK || ret === BREAK) {
	                    return;
	                }

	                worklist.push(sentinel);
	                leavelist.push(element);

	                if (this.__state === SKIP || ret === SKIP) {
	                    continue;
	                }

	                node = element.node;
	                nodeType = node.type || element.wrap;
	                candidates = this.__keys[nodeType];
	                if (!candidates) {
	                    if (this.__fallback) {
	                        candidates = objectKeys(node);
	                    } else {
	                        throw new Error('Unknown node type ' + nodeType + '.');
	                    }
	                }

	                current = candidates.length;
	                while ((current -= 1) >= 0) {
	                    key = candidates[current];
	                    candidate = node[key];
	                    if (!candidate) {
	                        continue;
	                    }

	                    if (isArray(candidate)) {
	                        current2 = candidate.length;
	                        while ((current2 -= 1) >= 0) {
	                            if (!candidate[current2]) {
	                                continue;
	                            }
	                            if (isProperty(nodeType, candidates[current])) {
	                                element = new Element(candidate[current2], [key, current2], 'Property', null);
	                            } else if (isNode(candidate[current2])) {
	                                element = new Element(candidate[current2], [key, current2], null, null);
	                            } else {
	                                continue;
	                            }
	                            worklist.push(element);
	                        }
	                    } else if (isNode(candidate)) {
	                        worklist.push(new Element(candidate, key, null, null));
	                    }
	                }
	            }
	        }
	    };

	    Controller.prototype.replace = function replace(root, visitor) {
	        function removeElem(element) {
	            var i,
	                key,
	                nextElem,
	                parent;

	            if (element.ref.remove()) {
	                // When the reference is an element of an array.
	                key = element.ref.key;
	                parent = element.ref.parent;

	                // If removed from array, then decrease following items' keys.
	                i = worklist.length;
	                while (i--) {
	                    nextElem = worklist[i];
	                    if (nextElem.ref && nextElem.ref.parent === parent) {
	                        if  (nextElem.ref.key < key) {
	                            break;
	                        }
	                        --nextElem.ref.key;
	                    }
	                }
	            }
	        }

	        var worklist,
	            leavelist,
	            node,
	            nodeType,
	            target,
	            element,
	            current,
	            current2,
	            candidates,
	            candidate,
	            sentinel,
	            outer,
	            key;

	        this.__initialize(root, visitor);

	        sentinel = {};

	        // reference
	        worklist = this.__worklist;
	        leavelist = this.__leavelist;

	        // initialize
	        outer = {
	            root: root
	        };
	        element = new Element(root, null, null, new Reference(outer, 'root'));
	        worklist.push(element);
	        leavelist.push(element);

	        while (worklist.length) {
	            element = worklist.pop();

	            if (element === sentinel) {
	                element = leavelist.pop();

	                target = this.__execute(visitor.leave, element);

	                // node may be replaced with null,
	                // so distinguish between undefined and null in this place
	                if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
	                    // replace
	                    element.ref.replace(target);
	                }

	                if (this.__state === REMOVE || target === REMOVE) {
	                    removeElem(element);
	                }

	                if (this.__state === BREAK || target === BREAK) {
	                    return outer.root;
	                }
	                continue;
	            }

	            target = this.__execute(visitor.enter, element);

	            // node may be replaced with null,
	            // so distinguish between undefined and null in this place
	            if (target !== undefined && target !== BREAK && target !== SKIP && target !== REMOVE) {
	                // replace
	                element.ref.replace(target);
	                element.node = target;
	            }

	            if (this.__state === REMOVE || target === REMOVE) {
	                removeElem(element);
	                element.node = null;
	            }

	            if (this.__state === BREAK || target === BREAK) {
	                return outer.root;
	            }

	            // node may be null
	            node = element.node;
	            if (!node) {
	                continue;
	            }

	            worklist.push(sentinel);
	            leavelist.push(element);

	            if (this.__state === SKIP || target === SKIP) {
	                continue;
	            }

	            nodeType = node.type || element.wrap;
	            candidates = this.__keys[nodeType];
	            if (!candidates) {
	                if (this.__fallback) {
	                    candidates = objectKeys(node);
	                } else {
	                    throw new Error('Unknown node type ' + nodeType + '.');
	                }
	            }

	            current = candidates.length;
	            while ((current -= 1) >= 0) {
	                key = candidates[current];
	                candidate = node[key];
	                if (!candidate) {
	                    continue;
	                }

	                if (isArray(candidate)) {
	                    current2 = candidate.length;
	                    while ((current2 -= 1) >= 0) {
	                        if (!candidate[current2]) {
	                            continue;
	                        }
	                        if (isProperty(nodeType, candidates[current])) {
	                            element = new Element(candidate[current2], [key, current2], 'Property', new Reference(candidate, current2));
	                        } else if (isNode(candidate[current2])) {
	                            element = new Element(candidate[current2], [key, current2], null, new Reference(candidate, current2));
	                        } else {
	                            continue;
	                        }
	                        worklist.push(element);
	                    }
	                } else if (isNode(candidate)) {
	                    worklist.push(new Element(candidate, key, null, new Reference(node, key)));
	                }
	            }
	        }

	        return outer.root;
	    };

	    function traverse(root, visitor) {
	        var controller = new Controller();
	        return controller.traverse(root, visitor);
	    }

	    function replace(root, visitor) {
	        var controller = new Controller();
	        return controller.replace(root, visitor);
	    }

	    function extendCommentRange(comment, tokens) {
	        var target;

	        target = upperBound(tokens, function search(token) {
	            return token.range[0] > comment.range[0];
	        });

	        comment.extendedRange = [comment.range[0], comment.range[1]];

	        if (target !== tokens.length) {
	            comment.extendedRange[1] = tokens[target].range[0];
	        }

	        target -= 1;
	        if (target >= 0) {
	            comment.extendedRange[0] = tokens[target].range[1];
	        }

	        return comment;
	    }

	    function attachComments(tree, providedComments, tokens) {
	        // At first, we should calculate extended comment ranges.
	        var comments = [], comment, len, i, cursor;

	        if (!tree.range) {
	            throw new Error('attachComments needs range information');
	        }

	        // tokens array is empty, we attach comments to tree as 'leadingComments'
	        if (!tokens.length) {
	            if (providedComments.length) {
	                for (i = 0, len = providedComments.length; i < len; i += 1) {
	                    comment = deepCopy(providedComments[i]);
	                    comment.extendedRange = [0, tree.range[0]];
	                    comments.push(comment);
	                }
	                tree.leadingComments = comments;
	            }
	            return tree;
	        }

	        for (i = 0, len = providedComments.length; i < len; i += 1) {
	            comments.push(extendCommentRange(deepCopy(providedComments[i]), tokens));
	        }

	        // This is based on John Freeman's implementation.
	        cursor = 0;
	        traverse(tree, {
	            enter: function (node) {
	                var comment;

	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (comment.extendedRange[1] > node.range[0]) {
	                        break;
	                    }

	                    if (comment.extendedRange[1] === node.range[0]) {
	                        if (!node.leadingComments) {
	                            node.leadingComments = [];
	                        }
	                        node.leadingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }

	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }

	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });

	        cursor = 0;
	        traverse(tree, {
	            leave: function (node) {
	                var comment;

	                while (cursor < comments.length) {
	                    comment = comments[cursor];
	                    if (node.range[1] < comment.extendedRange[0]) {
	                        break;
	                    }

	                    if (node.range[1] === comment.extendedRange[0]) {
	                        if (!node.trailingComments) {
	                            node.trailingComments = [];
	                        }
	                        node.trailingComments.push(comment);
	                        comments.splice(cursor, 1);
	                    } else {
	                        cursor += 1;
	                    }
	                }

	                // already out of owned node
	                if (cursor === comments.length) {
	                    return VisitorOption.Break;
	                }

	                if (comments[cursor].extendedRange[0] > node.range[1]) {
	                    return VisitorOption.Skip;
	                }
	            }
	        });

	        return tree;
	    }

	    exports.version = __webpack_require__(67).version;
	    exports.Syntax = Syntax;
	    exports.traverse = traverse;
	    exports.replace = replace;
	    exports.attachComments = attachComments;
	    exports.VisitorKeys = VisitorKeys;
	    exports.VisitorOption = VisitorOption;
	    exports.Controller = Controller;
	    exports.cloneEnvironment = function () { return clone({}); };

	    return exports;
	}(exports));
	/* vim: set sw=4 ts=4 et tw=80 : */


/***/ },
/* 67 */
/***/ function(module, exports) {

	module.exports = {
		"name": "estraverse",
		"description": "ECMAScript JS AST traversal functions",
		"homepage": "https://github.com/estools/estraverse",
		"main": "estraverse.js",
		"version": "4.1.1",
		"engines": {
			"node": ">=0.10.0"
		},
		"maintainers": [
			{
				"name": "constellation",
				"email": "utatane.tea@gmail.com"
			},
			{
				"name": "michaelficarra",
				"email": "npm@michael.ficarra.me"
			},
			{
				"name": "nzakas",
				"email": "nicholas@nczconsulting.com"
			}
		],
		"repository": {
			"type": "git",
			"url": "git+ssh://git@github.com/estools/estraverse.git"
		},
		"devDependencies": {
			"chai": "^2.1.1",
			"coffee-script": "^1.8.0",
			"espree": "^1.11.0",
			"gulp": "^3.8.10",
			"gulp-bump": "^0.2.2",
			"gulp-filter": "^2.0.0",
			"gulp-git": "^1.0.1",
			"gulp-tag-version": "^1.2.1",
			"jshint": "^2.5.6",
			"mocha": "^2.1.0"
		},
		"license": "BSD-2-Clause",
		"scripts": {
			"test": "npm run-script lint && npm run-script unit-test",
			"lint": "jshint estraverse.js",
			"unit-test": "mocha --compilers coffee:coffee-script/register"
		},
		"gitHead": "bbcccbfe98296585e4311c8755e1d00dcd581e3c",
		"bugs": {
			"url": "https://github.com/estools/estraverse/issues"
		},
		"_id": "estraverse@4.1.1",
		"_shasum": "f6caca728933a850ef90661d0e17982ba47111a2",
		"_from": "estraverse@>=4.0.0 <5.0.0",
		"_npmVersion": "2.14.4",
		"_nodeVersion": "4.1.1",
		"_npmUser": {
			"name": "constellation",
			"email": "utatane.tea@gmail.com"
		},
		"dist": {
			"shasum": "f6caca728933a850ef90661d0e17982ba47111a2",
			"tarball": "http://registry.npmjs.org/estraverse/-/estraverse-4.1.1.tgz"
		},
		"directories": {},
		"_resolved": "https://registry.npmjs.org/estraverse/-/estraverse-4.1.1.tgz",
		"readme": "ERROR: No README data found!"
	};

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    LEFT = 'left',
	    OPERATOR = 'operator',
	    RIGHT = 'right',
	    Syntax = estraverse.Syntax;

	function AssignmentExpressionTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(AssignmentExpressionTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.AssignmentExpression;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var left,
	            right,
	            transpiler = this;

	        left = transpiler.expressionTranspiler.transpile(node[LEFT], node, functionContext, blockContext, {
	            assignment: true
	        });

	        if (node[OPERATOR] === '=') {
	            right = node[RIGHT];
	        } else {
	            right = {
	                'type': Syntax.BinaryExpression,
	                'operator': node[OPERATOR].charAt(0),
	                'left': node[LEFT],
	                'right': node[RIGHT]
	            };
	        }

	        right = transpiler.expressionTranspiler.transpile(right, node, functionContext, blockContext);

	        return {
	            'type': Syntax.AssignmentExpression,
	            'operator': '=',
	            'left': left,
	            'right': right
	        };
	    }
	});

	module.exports = AssignmentExpressionTranspiler;


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    LEFT = 'left',
	    OPERATOR = 'operator',
	    RIGHT = 'right',
	    Syntax = estraverse.Syntax;

	function BinaryExpressionTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(BinaryExpressionTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.BinaryExpression;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var left,
	            right,
	            transpiler = this;

	        left = transpiler.expressionTranspiler.transpile(node[LEFT], node, functionContext, blockContext);
	        right = transpiler.expressionTranspiler.transpile(node[RIGHT], node, functionContext, blockContext);

	        return {
	            'type': Syntax.BinaryExpression,
	            'operator': node[OPERATOR],
	            'left': left,
	            'right': right
	        };
	    }
	});

	module.exports = BinaryExpressionTranspiler;


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    BlockContext = __webpack_require__(71),
	    BODY = 'body',
	    Syntax = estraverse.Syntax;

	function BlockStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(BlockStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.BlockStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var transpiler = this,
	            ownBlockContext = new BlockContext(functionContext),
	            statement = blockContext.prepareStatement();

	        transpiler.statementTranspiler.transpileArray(node[BODY], node, functionContext, ownBlockContext);

	        statement.assign({
	            'type': Syntax.BlockStatement,
	            'body': [
	                ownBlockContext.getSwitchStatement()
	            ]
	        });
	    }
	});

	module.exports = BlockStatementTranspiler;


/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    acorn = __webpack_require__(59),
	    estraverse = __webpack_require__(66),
	    CONSEQUENT = 'consequent',
	    Syntax = estraverse.Syntax,
	    createSwitchCase = function createSwitchCase(statementNode, index, nextIndex) {
	        if (!nextIndex) {
	            nextIndex = index + 1;
	        }

	        return {
	            type: Syntax.SwitchCase,
	            test: {
	                type: Syntax.Literal,
	                value: index
	            },
	            consequent: [
	                statementNode,
	                acorn.parse('statementIndex = ' + nextIndex + ';').body[0]
	            ]
	        };
	    };

	function BlockContext(functionContext) {
	    this.functionContext = functionContext;
	    this.switchCases = [];
	    this.transformNext = null;
	}

	_.extend(BlockContext.prototype, {
	    addAssignment: function (name) {
	        var context = this,
	            index = context.functionContext.getNextStatementIndex();

	        return {
	            assign: function (expressionNode) {
	                if (!expressionNode) {
	                    throw new Error('Expression node must be specified');
	                }

	                context.functionContext.addAssignment(index, name);

	                context.switchCases[index] = createSwitchCase(
	                    {
	                        'type': Syntax.ExpressionStatement,
	                        'expression': {
	                            'type': Syntax.AssignmentExpression,
	                            'operator': '=',
	                            'left': {
	                                'type': Syntax.Identifier,
	                                'name': name
	                            },
	                            'right': expressionNode
	                        }
	                    },
	                    index
	                );
	            }
	        };
	    },

	    addResumeThrow: function () {
	        var context = this,
	            index = context.functionContext.getCurrentStatementIndex();

	        return {
	            assign: function (expressionNode) {
	                var endIndex = context.functionContext.getCurrentStatementIndex() - 1,
	                    i;

	                if (!expressionNode) {
	                    throw new Error('Expression node must be specified');
	                }

	                // Previous statement needs to skip over the throw:
	                // it will only be needed for resumes
	                context.appendToLastStatement({
	                    'type': Syntax.BreakStatement,
	                    'label': null
	                });

	                // Add a case that simply throws the error,
	                // to allow us to easily resume inside a catch block
	                for (i = index; i < endIndex; i++) {
	                    context.switchCases[i] = {
	                        'type': Syntax.SwitchCase,
	                        'test': {
	                            type: Syntax.Literal,
	                            value: i
	                        },
	                        'consequent': []
	                    };
	                }

	                context.switchCases[endIndex] = {
	                    'type': Syntax.SwitchCase,
	                    'test': {
	                        type: Syntax.Literal,
	                        value: endIndex
	                    },
	                    'consequent': [
	                        {
	                            'type': Syntax.ThrowStatement,
	                            'argument': {
	                                'type': Syntax.NewExpression,
	                                'callee': {
	                                    'type': Syntax.MemberExpression,
	                                    'object': {
	                                        'type': Syntax.Identifier,
	                                        'name': 'Resumable'
	                                    },
	                                    'property': {
	                                        'type': Syntax.Identifier,
	                                        'name': 'ResumeException'
	                                    },
	                                    'computed': false
	                                },
	                                'arguments': [expressionNode]
	                            }
	                        }
	                    ]
	                };
	            }
	        };
	    },

	    appendToLastStatement: function (statementNode) {
	        var context = this,
	            switchCase = context.switchCases[context.switchCases.length - 1];

	        if (!switchCase) {
	            return;
	        }

	        if (_.isArray(switchCase)) {
	            switchCase[switchCase.length - 1][CONSEQUENT].push(statementNode);
	        } else {
	            switchCase.push(statementNode);
	        }
	    },

	    getSwitchStatement: function () {
	        var switchCases = [];

	        _.each(this.switchCases, function (switchCase) {
	            if (switchCase) {
	                if (_.isArray(switchCase)) {
	                    [].push.apply(switchCases, switchCase);
	                } else {
	                    switchCases.push(switchCase);
	                }
	            }
	        });

	        return {
	            'type': Syntax.SwitchStatement,
	            'discriminant': {
	                'type': Syntax.Identifier,
	                'name': 'statementIndex'
	            },
	            'cases': switchCases
	        };
	    },

	    prepareStatement: function () {
	        var context = this,
	            endIndex = null,
	            index = context.functionContext.getNextStatementIndex();

	        return {
	            assign: function (statementNode, nextIndex) {
	                var i,
	                    switchCases = [];

	                if (context.transformNext) {
	                    statementNode = context.transformNext(statementNode);
	                    context.transformNext = null;
	                }

	                if (!endIndex) {
	                    endIndex = context.functionContext.getCurrentStatementIndex();
	                }

	                for (i = index; i < endIndex - 1; i++) {
	                    switchCases.push({
	                        type: Syntax.SwitchCase,
	                        test: {
	                            type: Syntax.Literal,
	                            value: i
	                        },
	                        consequent: i === index ? [
	                            acorn.parse('statementIndex = ' + (index + 1) + ';').body[0]
	                        ] : []
	                    });
	                }

	                switchCases.push(createSwitchCase(statementNode, endIndex - 1, nextIndex));

	                context.switchCases[index] = switchCases;
	            },

	            captureEndIndex: function () {
	                endIndex = context.functionContext.getCurrentStatementIndex();
	            },

	            getEndIndex: function () {
	                return endIndex;
	            },

	            getIndex: function () {
	                return index;
	            }
	        };
	    },

	    transformNextStatement: function (transformer) {
	        this.transformNext = transformer;
	    }
	});

	module.exports = BlockContext;


/***/ },
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    LABEL = 'label',
	    Syntax = estraverse.Syntax;

	function BreakStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(BreakStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.BreakStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var label = node[LABEL] ?
	            node[LABEL] :
	            {
	                'type': Syntax.Identifier,
	                'name': functionContext.getLabel()
	            };

	        blockContext.prepareStatement().assign({
	            'type': Syntax.BreakStatement,
	            'label': label
	        });
	    }
	});

	module.exports = BreakStatementTranspiler;


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    ARGUMENTS = 'arguments',
	    CALLEE = 'callee',
	    OBJECT = 'object',
	    TYPE = 'type',
	    Syntax = estraverse.Syntax;

	function CallExpressionTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(CallExpressionTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.CallExpression;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var args = node[ARGUMENTS],
	            assignments,
	            callee,
	            callNode,
	            transpiler = this,
	            tempNameForAssignment;

	        functionContext.clearLastAssignments();

	        callee = transpiler.expressionTranspiler.transpile(node[CALLEE], node, functionContext, blockContext);

	        assignments = functionContext.getLastAssignments();

	        args = transpiler.expressionTranspiler.transpileArray(args, node, functionContext, blockContext);

	        if (node[CALLEE][TYPE] === Syntax.MemberExpression) {
	            // Change callee to a '... .call(...)' to preserve thisObj
	            args = [
	                assignments.length > 1 ?
	                    {
	                        'type': Syntax.Identifier,
	                        'name': assignments[assignments.length - 2]
	                    } :
	                    node[CALLEE][OBJECT]
	            ].concat(args);

	            callee = {
	                'type': Syntax.MemberExpression,
	                'object': callee,
	                'property': {
	                    'type': Syntax.Identifier,
	                    'name': 'call',
	                },
	                'computed': false
	            };
	        }

	        callNode = {
	            'type': Syntax.CallExpression,
	            'callee': callee,
	            'arguments': args
	        };

	        if (parent[TYPE] === Syntax.ExpressionStatement) {
	            return callNode;
	        }

	        tempNameForAssignment = functionContext.getTempName();
	        blockContext.addAssignment(tempNameForAssignment).assign(callNode);

	        return {
	            'type': Syntax.Identifier,
	            'name': tempNameForAssignment
	        };
	    }
	});

	module.exports = CallExpressionTranspiler;


/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    LABEL = 'label',
	    Syntax = estraverse.Syntax;

	function ContinueStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(ContinueStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.ContinueStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var label = node[LABEL] ?
	            node[LABEL] :
	            {
	                'type': Syntax.Identifier,
	                'name': functionContext.getLabel()
	            };

	        blockContext.prepareStatement().assign({
	            'type': Syntax.ContinueStatement,
	            'label': label
	        });
	    }
	});

	module.exports = ContinueStatementTranspiler;


/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    Syntax = estraverse.Syntax;

	function DebuggerStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(DebuggerStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.DebuggerStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        blockContext.prepareStatement().assign({
	            'type': Syntax.DebuggerStatement
	        });
	    }
	});

	module.exports = DebuggerStatementTranspiler;


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    acorn = __webpack_require__(59),
	    estraverse = __webpack_require__(66),
	    BlockContext = __webpack_require__(71),
	    BODY = 'body',
	    TEST = 'test',
	    Syntax = estraverse.Syntax;

	function DoWhileStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(DoWhileStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.DoWhileStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var forNode,
	            ownBlockContext = new BlockContext(functionContext),
	            transpiler = this,
	            expression,
	            statement;

	        functionContext.pushLabelableContext();

	        statement = blockContext.prepareStatement();

	        transpiler.statementTranspiler.transpileArray(node[BODY][BODY], node, functionContext, ownBlockContext);

	        expression = transpiler.expressionTranspiler.transpile(node[TEST], node, functionContext, ownBlockContext);

	        ownBlockContext.prepareStatement().assign({
	            'type': Syntax.IfStatement,
	            'test': {
	                'type': Syntax.UnaryExpression,
	                'operator': '!',
	                'prefix': true,
	                'argument': expression
	            },
	            'consequent': {
	                'type': Syntax.BlockStatement,
	                'body': [
	                    {
	                        'type': Syntax.BreakStatement,
	                        'label': {
	                            'type': Syntax.Identifier,
	                            'name': functionContext.getLabel()
	                        }
	                    }
	                ]
	            }
	        });

	        forNode = {
	            'type': Syntax.ForStatement,
	            'init': null,
	            'test': null,
	            'update': null,
	            'body': {
	                'type': Syntax.BlockStatement,
	                'body': [
	                    acorn.parse('statementIndex = ' + (statement.getIndex() + 1) + ';').body[0],
	                    ownBlockContext.getSwitchStatement()
	                ]
	            }
	        };

	        statement.assign(functionContext.isLabelUsed() ? {
	            'type': Syntax.LabeledStatement,
	            'label': {
	                'type': Syntax.Identifier,
	                'name': functionContext.getLabel()
	            },
	            'body': forNode
	        } : forNode);

	        functionContext.popLabelableContext();
	    }
	});

	module.exports = DoWhileStatementTranspiler;


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    EXPRESSION = 'expression',
	    Syntax = estraverse.Syntax;

	function ExpressionStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(ExpressionStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.ExpressionStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var expression = this.expressionTranspiler.transpile(node[EXPRESSION], node, functionContext, blockContext);

	        blockContext.prepareStatement().assign({
	            'type': Syntax.ExpressionStatement,
	            'expression': expression
	        });
	    }
	});

	module.exports = ExpressionStatementTranspiler;


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    TYPE = 'type',
	    hasOwn = {}.hasOwnProperty;

	function ExpressionTranspiler() {
	    this.transpilers = {};
	}

	_.extend(ExpressionTranspiler.prototype, {
	    addTranspiler: function (transpiler) {
	        this.transpilers[transpiler.getNodeType()] = transpiler;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var transpiler = this;

	        if (!hasOwn.call(transpiler.transpilers, node[TYPE])) {
	            return node;
	        }

	        return transpiler.transpilers[node[TYPE]].transpile(node, parent, functionContext, blockContext);
	    },

	    transpileArray: function (array, parent, functionContext, blockContext) {
	        var result = [],
	            transpiler = this;

	        _.each(array, function (expressionNode) {
	            result.push(transpiler.transpile(expressionNode, parent, functionContext, blockContext));
	        });

	        return result;
	    }
	});

	module.exports = ExpressionTranspiler;


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    acorn = __webpack_require__(59),
	    estraverse = __webpack_require__(66),
	    BlockContext = __webpack_require__(71),
	    BODY = 'body',
	    INIT = 'init',
	    TEST = 'test',
	    UPDATE = 'update',
	    Syntax = estraverse.Syntax;

	function ForStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(ForStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.ForStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var forNode,
	            ownBlockContext = new BlockContext(functionContext),
	            transpiler = this,
	            expression,
	            statement;

	        functionContext.pushLabelableContext();

	        // 'Init' expression
	        if (node[INIT]) {
	            expression = transpiler.expressionTranspiler.transpile(
	                node[INIT],
	                node,
	                functionContext,
	                blockContext
	            );
	            blockContext.prepareStatement().assign({
	                'type': Syntax.ExpressionStatement,
	                'expression': expression
	            });
	        }

	        statement = blockContext.prepareStatement();

	        // 'Test' expression
	        if (node[TEST]) {
	            expression = transpiler.expressionTranspiler.transpile(
	                node[TEST],
	                node,
	                functionContext,
	                ownBlockContext
	            );
	            ownBlockContext.prepareStatement().assign({
	                'type': Syntax.IfStatement,
	                'test': {
	                    'type': Syntax.UnaryExpression,
	                    'operator': '!',
	                    'prefix': true,
	                    'argument': expression
	                },
	                'consequent': {
	                    'type': Syntax.BlockStatement,
	                    'body': [
	                        {
	                            'type': Syntax.BreakStatement,
	                            'label': {
	                                'type': Syntax.Identifier,
	                                'name': functionContext.getLabel()
	                            }
	                        }
	                    ]
	                }
	            });
	        }

	        transpiler.statementTranspiler.transpileArray(
	            node[BODY][BODY],
	            node,
	            functionContext,
	            ownBlockContext
	        );

	        // 'Update' expression
	        if (node[UPDATE]) {
	            expression = transpiler.expressionTranspiler.transpile(
	                node[UPDATE],
	                node,
	                functionContext,
	                ownBlockContext
	            );
	            ownBlockContext.prepareStatement().assign({
	                'type': Syntax.ExpressionStatement,
	                'expression': expression
	            });
	        }

	        forNode = {
	            'type': Syntax.ForStatement,
	            'init': null,
	            'test': null,
	            'update': null,
	            'body': {
	                'type': Syntax.BlockStatement,
	                'body': [
	                    ownBlockContext.getSwitchStatement(),
	                    acorn.parse('statementIndex = ' + (statement.getIndex() + 1) + ';').body[0]
	                ]
	            }
	        };

	        statement.assign(functionContext.isLabelUsed() ? {
	            'type': Syntax.LabeledStatement,
	            'label': {
	                'type': Syntax.Identifier,
	                'name': functionContext.getLabel()
	            },
	            'body': forNode
	        } : forNode);

	        functionContext.popLabelableContext();
	    }
	});

	module.exports = ForStatementTranspiler;


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    Syntax = estraverse.Syntax;

	function FunctionDeclarationTranspiler(statementTranspiler, expressionTranspiler, functionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.functionTranspiler = functionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(FunctionDeclarationTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.FunctionDeclaration;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var newNode = this.functionTranspiler.transpile(node, parent, functionContext, blockContext);

	        functionContext.addFunctionDeclaration(newNode);
	    }
	});

	module.exports = FunctionDeclarationTranspiler;


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    Syntax = estraverse.Syntax;

	function FunctionExpressionTranspiler(statementTranspiler, expressionTranspiler, functionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.functionTranspiler = functionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(FunctionExpressionTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.FunctionExpression;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        return this.functionTranspiler.transpile(node, parent, functionContext, blockContext);
	    }
	});

	module.exports = FunctionExpressionTranspiler;


/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    BlockContext = __webpack_require__(71),
	    FunctionContext = __webpack_require__(83),
	    BODY = 'body',
	    ID = 'id',
	    NAME = 'name',
	    PARAMS = 'params',
	    TYPE = 'type',
	    Syntax = estraverse.Syntax;

	function FunctionTranspiler(statementTranspiler) {
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(FunctionTranspiler.prototype, {
	    transpile: function (node) {
	        var newNode,
	            transpiler = this,
	            ownFunctionContext = new FunctionContext(),
	            ownBlockContext = new BlockContext(ownFunctionContext),
	            statements = [];

	        _.each(node[PARAMS], function (param) {
	            ownFunctionContext.addParameter(param[NAME]);
	        });

	        if (node[BODY][BODY].length > 0) {
	            transpiler.statementTranspiler.transpileArray(node[BODY][BODY], node, ownFunctionContext, ownBlockContext);
	            statements = ownFunctionContext.getStatements(ownBlockContext.getSwitchStatement());
	        }

	        newNode = {
	            'type': node[TYPE],
	            'id': node[ID],
	            'params': node[PARAMS],
	            'body': {
	                'type': Syntax.BlockStatement,
	                'body': statements
	            }
	        };

	        return newNode;
	    }
	});

	module.exports = FunctionTranspiler;


/***/ },
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    acorn = __webpack_require__(59),
	    estraverse = __webpack_require__(66),
	    DECLARATIONS = 'declarations',
	    ID = 'id',
	    NAME = 'name',
	    Syntax = estraverse.Syntax;

	function FunctionContext() {
	    this.assignmentVariables = {};
	    this.catches = [];
	    this.functionDeclarations = [];
	    this.labelIndex = -1;
	    this.labelUsed = false;
	    this.labelUseds = [];
	    this.lastAssignments = [];
	    this.lastTempNames = {};
	    this.nextStatementIndex = 0;
	    this.nextTempIndex = 0;
	    this.parameters = [];
	    this.variables = [];
	}

	_.extend(FunctionContext.prototype, {
	    addAssignment: function (index, variableName) {
	        var context = this;

	        context.assignmentVariables[index] = variableName;
	        context.lastAssignments.push(variableName);
	    },

	    addCatch: function (data) {
	        this.catches.push(data);
	    },

	    addFunctionDeclaration: function (declaration) {
	        this.functionDeclarations.push(declaration);
	    },

	    addParameter: function (name) {
	        this.parameters.push(name);
	    },

	    addVariable: function (name) {
	        this.variables.push(name);
	    },

	    clearLastAssignments: function () {
	        this.lastAssignments = [];
	    },

	    getCurrentStatementIndex: function () {
	        return this.nextStatementIndex;
	    },

	    getLabel: function () {
	        var context = this;

	        context.labelUsed = true;

	        return 'label' + context.labelIndex;
	    },

	    getLastAssignments: function () {
	        var context = this,
	            lastAssignments = context.lastAssignments;

	        context.lastAssignments = [];

	        return lastAssignments;
	    },

	    getNextStatementIndex: function () {
	        return this.nextStatementIndex++;
	    },

	    getStatements: function (switchStatement) {
	        var assignmentProperties = [],
	            catchesProperties,
	            declaration = acorn.parse('var statementIndex = 0;').body[0],
	            functionContext = this,
	            index,
	            statements = [],
	            stateProperties = [],
	            stateSetup = acorn.parse('if (Resumable._resumeState_) { statementIndex = Resumable._resumeState_.statementIndex; }').body[0];

	        _.each(functionContext.variables, function (name) {
	            declaration[DECLARATIONS].push({
	                'type': Syntax.VariableDeclarator,
	                'id': {
	                    'type': Syntax.Identifier,
	                    'name': name
	                },
	                'init': null
	            });
	        });

	        if (functionContext.catches.length > 0) {
	            catchesProperties = [];
	            _.each(functionContext.catches, function (catchData) {
	                catchesProperties.push({
	                    'type': Syntax.Property,
	                    'kind': 'init',
	                    'key': {
	                        'type': Syntax.Identifier,
	                        'name': catchData.catchStatementIndex
	                    },
	                    'value': {
	                        type: Syntax.ObjectExpression,
	                        properties: [
	                            {
	                                'type': Syntax.Property,
	                                'kind': 'init',
	                                'key': {
	                                    'type': Syntax.Identifier,
	                                    'name': 'from'
	                                },
	                                'value': {
	                                    type: Syntax.Literal,
	                                    value: catchData.tryStartIndex
	                                }
	                            },
	                            {
	                                'type': Syntax.Property,
	                                'kind': 'init',
	                                'key': {
	                                    'type': Syntax.Identifier,
	                                    'name': 'to'
	                                },
	                                'value': {
	                                    type: Syntax.Literal,
	                                    value: catchData.tryEndIndex
	                                }
	                            },
	                            {
	                                'type': Syntax.Property,
	                                'kind': 'init',
	                                'key': {
	                                    'type': Syntax.Identifier,
	                                    'name': 'param'
	                                },
	                                'value': {
	                                    type: Syntax.Literal,
	                                    value: catchData.catchParameter
	                                }
	                            }
	                        ]
	                    }
	                });
	            });

	            stateProperties.push({
	                'type': Syntax.Property,
	                'kind': 'init',
	                'key': {
	                    'type': Syntax.Identifier,
	                    'name': 'catches'
	                },
	                'value': {
	                    type: Syntax.ObjectExpression,
	                    properties: catchesProperties
	                }
	            });
	        }

	        for (index = 0; index < functionContext.nextTempIndex; index++) {
	            stateProperties.push({
	                'type': Syntax.Property,
	                'kind': 'init',
	                'key': {
	                    'type': Syntax.Identifier,
	                    'name': 'temp' + index
	                },
	                'value': {
	                    'type': Syntax.Identifier,
	                    'name': 'temp' + index
	                }
	            });

	            declaration.declarations.push({
	                'type': Syntax.VariableDeclarator,
	                'id': {
	                    'type': Syntax.Identifier,
	                    'name': 'temp' + index
	                },
	                'init': null
	            });

	            stateSetup.consequent.body.push({
	                'type': Syntax.ExpressionStatement,
	                'expression': {
	                    'type': Syntax.AssignmentExpression,
	                    'operator': '=',
	                    'left': {
	                        'type': Syntax.Identifier,
	                        'name': 'temp' + index,
	                    },
	                    'right': acorn.parse('Resumable._resumeState_.temp' + index).body[0].expression
	                }
	            });
	        }

	        stateSetup.consequent.body.push(acorn.parse('Resumable._resumeState_ = null;').body[0]);

	        _.forOwn(functionContext.assignmentVariables, function (variableName, statementIndex) {
	            assignmentProperties.push({
	                'type': Syntax.Property,
	                'kind': 'init',
	                'key': {
	                    'type': Syntax.Literal,
	                    'value': statementIndex
	                },
	                'value': {
	                    'type': Syntax.Literal,
	                    'value': variableName
	                }
	            });
	        });

	        statements.push(declaration);
	        [].push.apply(statements, functionContext.functionDeclarations);
	        statements.push({
	            type: Syntax.ReturnStatement,
	            argument: {
	                type: Syntax.CallExpression,
	                arguments: [
	                    {
	                        type: Syntax.ThisExpression
	                    },
	                    {
	                        type: Syntax.Identifier,
	                        name: 'arguments'
	                    }
	                ],
	                callee: {
	                    type: Syntax.MemberExpression,
	                    object: {
	                        type: Syntax.FunctionExpression,
	                        id: {
	                            type: Syntax.Identifier,
	                            name: 'resumableScope'
	                        },
	                        params: [],
	                        body: {
	                            type: Syntax.BlockStatement,
	                            body: [
	                                stateSetup,
	                                {
	                                    type: Syntax.TryStatement,
	                                    block: {
	                                        type: Syntax.BlockStatement,
	                                        body: [
	                                            switchStatement
	                                        ]
	                                    },
	                                    handler: {
	                                        type: Syntax.CatchClause,
	                                        param: {
	                                            type: Syntax.Identifier,
	                                            name: 'e'
	                                        },
	                                        body: {
	                                            type: Syntax.BlockStatement,
	                                            body: [
	                                                {
	                                                    type: Syntax.IfStatement,
	                                                    test: acorn.parse('e instanceof Resumable.PauseException').body[0].expression,
	                                                    consequent: {
	                                                        type: Syntax.BlockStatement,
	                                                        body: [
	                                                            {
	                                                                type: Syntax.ExpressionStatement,
	                                                                expression: {
	                                                                    type: Syntax.CallExpression,
	                                                                    callee: {
	                                                                        type: Syntax.MemberExpression,
	                                                                        object: {
	                                                                            type: Syntax.Identifier,
	                                                                            name: 'e'
	                                                                        },
	                                                                        property: {
	                                                                            type: Syntax.Identifier,
	                                                                            name: 'add'
	                                                                        },
	                                                                        computed: false
	                                                                    },
	                                                                    arguments: [
	                                                                        {
	                                                                            type: Syntax.ObjectExpression,
	                                                                            properties: [
	                                                                                {
	                                                                                    type: Syntax.Property,
	                                                                                    kind: 'init',
	                                                                                    key: {
	                                                                                        type: Syntax.Identifier,
	                                                                                        name: 'func'
	                                                                                    },
	                                                                                    value: {
	                                                                                        type: Syntax.Identifier,
	                                                                                        name: 'resumableScope'
	                                                                                    }
	                                                                                },
	                                                                                {
	                                                                                    type: Syntax.Property,
	                                                                                    kind: 'init',
	                                                                                    key: {
	                                                                                        type: Syntax.Identifier,
	                                                                                        name: 'statementIndex'
	                                                                                    },
	                                                                                    value: {
	                                                                                        type: Syntax.BinaryExpression,
	                                                                                        operator: '+',
	                                                                                        left: {
	                                                                                            type: Syntax.Identifier,
	                                                                                            name: 'statementIndex'
	                                                                                        },
	                                                                                        right: {
	                                                                                            type: Syntax.Literal,
	                                                                                            value: 1
	                                                                                        }
	                                                                                    }
	                                                                                },
	                                                                                {
	                                                                                    type: Syntax.Property,
	                                                                                    kind: 'init',
	                                                                                    key: {
	                                                                                        type: Syntax.Identifier,
	                                                                                        name: 'assignments'
	                                                                                    },
	                                                                                    value: {
	                                                                                        type: Syntax.ObjectExpression,
	                                                                                        properties: assignmentProperties
	                                                                                    }
	                                                                                }
	                                                                            ].concat(stateProperties)
	                                                                        }
	                                                                    ]
	                                                                }
	                                                            }
	                                                        ]
	                                                    }
	                                                },
	                                                {
	                                                    type: Syntax.ThrowStatement,
	                                                    argument: {
	                                                        type: Syntax.Identifier,
	                                                        name: 'e'
	                                                    }
	                                                }
	                                            ]
	                                        }
	                                    }
	                                }
	                            ]
	                        }
	                    },
	                    property: {
	                        type: Syntax.Identifier,
	                        name: 'apply'
	                    }
	                }
	            }
	        });

	        return statements;
	    },

	    getTempName: function () {
	        return 'temp' + this.nextTempIndex++;
	    },

	    getTempNameForVariable: function (variableName, blockContext) {
	        var context = this,
	            tempName;

	        tempName = context.getTempName();

	        context.lastTempNames[variableName] = tempName;

	        blockContext.addAssignment(tempName).assign({
	            'type': Syntax.Identifier,
	            'name': variableName
	        });

	        return tempName;
	    },

	    getLastTempName: function () {
	        return 'temp' + (this.nextTempIndex - 1);
	    },

	    getLastTempNameForVariable: function (variableName) {
	        return this.lastTempNames[variableName];
	    },

	    hasVariableDefined: function (name) {
	        var isDefined = false;

	        _.each(this.functionDeclarations, function (functionDeclaration) {
	            if (functionDeclaration[ID] && functionDeclaration[ID][NAME] === name) {
	                isDefined = true;
	                return false;
	            }
	        });

	        _.each(this.variables, function (variable) {
	            if (variable === name) {
	                isDefined = true;
	            }
	        });

	        return isDefined;
	    },

	    isLabelUsed: function () {
	        var context = this;

	        return context.labelUsed;
	    },

	    popLabelableContext: function () {
	        var context = this;

	        context.labelUsed = context.labelUseds.pop();
	        context.labelIndex--;
	    },

	    pushLabelableContext: function () {
	        var context = this;

	        context.labelUseds.push(context.labelUsed);
	        context.labelUsed = false;
	        context.labelIndex++;
	    }
	});

	module.exports = FunctionContext;


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    LEFT = 'left',
	    NAME = 'name',
	    TYPE = 'type',
	    Syntax = estraverse.Syntax;

	function IdentifierTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(IdentifierTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.Identifier;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var isDefined = functionContext.hasVariableDefined(node[NAME]) ||
	            (
	                parent[TYPE] === Syntax.AssignmentExpression &&
	                node === parent[LEFT]
	            );

	        return {
	            'type': Syntax.Identifier,
	            'name': isDefined ?
	                node[NAME] :
	                functionContext.getTempNameForVariable(node[NAME], blockContext)
	        };
	    }
	});

	module.exports = IdentifierTranspiler;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    ALTERNATE = 'alternate',
	    CONSEQUENT = 'consequent',
	    TEST = 'test',
	    Syntax = estraverse.Syntax;

	function IfStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(IfStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.IfStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var alternateStatement,
	            consequentStatement,
	            transpiler = this,
	            expression = transpiler.expressionTranspiler.transpile(node[TEST], node, functionContext, blockContext);

	        consequentStatement = blockContext.prepareStatement();

	        consequentStatement.assign({
	            'type': Syntax.IfStatement,
	            'test': {
	                'type': Syntax.LogicalExpression,
	                'operator': '||',
	                'left': {
	                    'type': Syntax.BinaryExpression,
	                    'operator': '>',
	                    'left': {
	                        'type': Syntax.Identifier,
	                        'name': 'statementIndex'
	                    },
	                    'right': {
	                        'type': Syntax.Literal,
	                        'value': consequentStatement.getIndex() + 1
	                    }
	                },
	                'right': expression
	            },
	            'consequent': transpiler.statementTranspiler.transpileBlock(node[CONSEQUENT], node, functionContext)
	        });

	        if (node[ALTERNATE]) {
	            alternateStatement = blockContext.prepareStatement();

	            alternateStatement.assign({
	                'type': Syntax.IfStatement,
	                'test': {
	                    'type': Syntax.LogicalExpression,
	                    'operator': '||',
	                    'left': {
	                        'type': Syntax.BinaryExpression,
	                        'operator': '>',
	                        'left': {
	                            'type': Syntax.Identifier,
	                            'name': 'statementIndex'
	                        },
	                        'right': {
	                            'type': Syntax.Literal,
	                            'value': alternateStatement.getIndex() + 1
	                        }
	                    },
	                    'right': {
	                        'type': Syntax.UnaryExpression,
	                        'operator': '!',
	                        'prefix': true,
	                        'argument': expression
	                    }
	                },
	                'consequent': transpiler.statementTranspiler.transpileBlock(node[ALTERNATE], node, functionContext)
	            });
	        }
	    }
	});

	module.exports = IfStatementTranspiler;


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    BODY = 'body',
	    LABEL = 'label',
	    Syntax = estraverse.Syntax;

	function LabeledStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(LabeledStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.LabeledStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var label = node[LABEL],
	            transpiler = this;

	        blockContext.transformNextStatement(function (node) {
	            return {
	                'type': Syntax.LabeledStatement,
	                'label': label,
	                'body': node
	            };
	        });

	        transpiler.statementTranspiler.transpile(node[BODY], node, functionContext, blockContext);
	    }
	});

	module.exports = LabeledStatementTranspiler;


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    BlockContext = __webpack_require__(71),
	    LEFT = 'left',
	    OPERATOR = 'operator',
	    RIGHT = 'right',
	    Syntax = estraverse.Syntax;

	function LogicalExpressionTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(LogicalExpressionTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.LogicalExpression;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var condition,
	            left,
	            right,
	            rightSideBlockContext,
	            statement,
	            tempName,
	            transpiler = this;

	        left = transpiler.expressionTranspiler.transpile(node[LEFT], node, functionContext, blockContext);

	        statement = blockContext.prepareStatement();

	        rightSideBlockContext = new BlockContext(functionContext);

	        right = transpiler.expressionTranspiler.transpile(node[RIGHT], node, functionContext, rightSideBlockContext);

	        /**
	         * Support short-circuit evaluation of the operands -
	         * when '&&' and left operand is truthy, evaluate right,
	         * when '||' and left operand is truthy, do not,
	         * and vice versa.
	         */
	        condition = node[OPERATOR] === '||' ?
	            {
	                'type': Syntax.UnaryExpression,
	                'operator': '!',
	                'prefix': true,
	                'argument': left
	            } :
	            left;

	        statement.assign({
	            'type': Syntax.IfStatement,
	            'test': {
	                'type': Syntax.LogicalExpression,
	                'operator': '||',
	                'left': {
	                    'type': Syntax.BinaryExpression,
	                    'operator': '>',
	                    'left': {
	                        'type': Syntax.Identifier,
	                        'name': 'statementIndex'
	                    },
	                    'right': {
	                        'type': Syntax.Literal,
	                        'value': statement.getIndex() + 1
	                    }
	                },
	                'right': condition
	            },
	            'consequent': {
	                'type': Syntax.BlockStatement,
	                'body': [
	                    rightSideBlockContext.getSwitchStatement()
	                ]
	            }
	        });

	        tempName = functionContext.getTempName();

	        blockContext.addAssignment(tempName).assign({
	            'type': Syntax.LogicalExpression,
	            'operator': node[OPERATOR],
	            'left': left,
	            'right': right
	        });

	        return {
	            'type': Syntax.Identifier,
	            'name': tempName
	        };
	    }
	});

	module.exports = LogicalExpressionTranspiler;


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    COMPUTED = 'computed',
	    OBJECT = 'object',
	    PROPERTY = 'property',
	    TYPE = 'type',
	    Syntax = estraverse.Syntax;

	function MemberExpressionTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(MemberExpressionTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.MemberExpression;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var memberExpression,
	            object = this.expressionTranspiler.transpile(node[OBJECT], node, functionContext, blockContext),
	            property = node[COMPUTED] ?
	                this.expressionTranspiler.transpile(node[PROPERTY], node, functionContext, blockContext) :
	                node[PROPERTY],
	            propertyTempName;

	        memberExpression = {
	            'type': Syntax.MemberExpression,
	            'object': object,
	            'property': property,
	            'computed': node[COMPUTED]
	        };

	        if (parent[TYPE] === Syntax.AssignmentExpression) {
	            return memberExpression;
	        }

	        propertyTempName = functionContext.getTempName();

	        blockContext.addAssignment(propertyTempName).assign(memberExpression);

	        return {
	            'type': Syntax.Identifier,
	            'name': propertyTempName
	        };
	    }
	});

	module.exports = MemberExpressionTranspiler;


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    PROPERTIES = 'properties',
	    Syntax = estraverse.Syntax;

	function ObjectExpressionTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(ObjectExpressionTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.ObjectExpression;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var transpiler = this;

	        return {
	            'type': Syntax.ObjectExpression,
	            'properties': transpiler.expressionTranspiler.transpileArray(
	                node[PROPERTIES],
	                node,
	                functionContext,
	                blockContext
	            )
	        };
	    }
	});

	module.exports = ObjectExpressionTranspiler;


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    BlockContext = __webpack_require__(71),
	    FunctionContext = __webpack_require__(83),
	    BODY = 'body',
	    Syntax = estraverse.Syntax;

	function ProgramTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(ProgramTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.Program;
	    },

	    transpile: function (node) {
	        var transpiler = this,
	            functionContext = new FunctionContext(),
	            blockContext = new BlockContext(functionContext);

	        transpiler.statementTranspiler.transpileArray(node[BODY], node, functionContext, blockContext);

	        return {
	            'type': Syntax.Program,
	            'body': [
	                {
	                    'type': Syntax.ExpressionStatement,
	                    'expression': {
	                        'type': Syntax.FunctionExpression,
	                        'id': null,
	                        'params': [],
	                        'body': {
	                            'type': Syntax.BlockStatement,
	                            'body': functionContext.getStatements(blockContext.getSwitchStatement())
	                        }
	                    }
	                }
	            ]
	        };
	    }
	});

	module.exports = ProgramTranspiler;


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    KEY = 'key',
	    KIND = 'kind',
	    VALUE = 'value',
	    Syntax = estraverse.Syntax;

	function PropertyTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(PropertyTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.Property;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var transpiler = this;

	        return {
	            'type': Syntax.Property,
	            'key': node[KEY],
	            'value': transpiler.expressionTranspiler.transpile(
	                node[VALUE],
	                node,
	                functionContext,
	                blockContext
	            ),
	            'kind': node[KIND]
	        };
	    }
	});

	module.exports = PropertyTranspiler;


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    ARGUMENT = 'argument',
	    Syntax = estraverse.Syntax;

	function ReturnStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(ReturnStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.ReturnStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var expression = node[ARGUMENT] ?
	            this.expressionTranspiler.transpile(node[ARGUMENT], node, functionContext, blockContext) :
	            null;

	        blockContext.prepareStatement().assign({
	            'type': Syntax.ReturnStatement,
	            'argument': expression
	        });
	    }
	});

	module.exports = ReturnStatementTranspiler;


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    EXPRESSIONS = 'expressions',
	    Syntax = estraverse.Syntax;

	function SequenceExpressionTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(SequenceExpressionTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.SequenceExpression;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var expressions = [],
	            transpiler = this;

	        _.each(node[EXPRESSIONS], function (expression) {
	            expressions.push(
	                transpiler.expressionTranspiler.transpile(
	                    expression,
	                    node,
	                    functionContext,
	                    blockContext
	                )
	            );
	        });

	        return {
	            'type': Syntax.SequenceExpression,
	            'expressions': expressions
	        };
	    }
	});

	module.exports = SequenceExpressionTranspiler;


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    hasOwn = {}.hasOwnProperty,
	    BlockContext = __webpack_require__(71),
	    BODY = 'body',
	    TYPE = 'type',
	    Syntax = estraverse.Syntax;

	function StatementTranspiler(expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.transpilers = {};
	}

	_.extend(StatementTranspiler.prototype, {
	    addTranspiler: function (transpiler) {
	        this.transpilers[transpiler.getNodeType()] = transpiler;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var transpiler = this;

	        if (!hasOwn.call(transpiler.transpilers, node[TYPE])) {
	            throw new Error('Unsupported type "' + node[TYPE] + '"');
	        }

	        return transpiler.transpilers[node[TYPE]].transpile(node, parent, functionContext, blockContext);
	    },

	    transpileBlock: function (node, parent, functionContext) {
	        var transpiler = this,
	            ownBlockContext = new BlockContext(functionContext);

	        if (node[TYPE] === Syntax.BlockStatement) {
	            transpiler.transpileArray(node[BODY], parent, functionContext, ownBlockContext);
	        } else {
	            transpiler.transpile(node, parent, functionContext, ownBlockContext);
	        }

	        return {
	            'type': Syntax.BlockStatement,
	            'body': [
	                ownBlockContext.getSwitchStatement()
	            ]
	        };
	    },

	    transpileArray: function (array, parent, functionContext, blockContext) {
	        var transpiler = this;

	        _.each(array, function (statementNode) {
	            transpiler.transpile(statementNode, parent, functionContext, blockContext);
	        });
	    }
	});

	module.exports = StatementTranspiler;


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    ARGUMENT = 'argument',
	    Syntax = estraverse.Syntax;

	function ThrowStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(ThrowStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.ThrowStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var expression = this.expressionTranspiler.transpile(node[ARGUMENT], node, functionContext, blockContext);

	        blockContext.prepareStatement().assign({
	            'type': Syntax.ThrowStatement,
	            'argument': expression
	        });
	    }
	});

	module.exports = ThrowStatementTranspiler;


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    acorn = __webpack_require__(59),
	    estraverse = __webpack_require__(66),
	    BlockContext = __webpack_require__(71),
	    BLOCK = 'block',
	    BODY = 'body',
	    HANDLER = 'handler',
	    FINALIZER = 'finalizer',
	    NAME = 'name',
	    PARAM = 'param',
	    Syntax = estraverse.Syntax;

	function TryStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(TryStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.TryStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var catchStatementIndex = null,
	            catchStatements = [],
	            handler = node[HANDLER],
	            hasCatch = handler && handler[BODY][BODY].length > 0,
	            finalizer = node[FINALIZER],
	            ownBlockContext = new BlockContext(functionContext),
	            statement,
	            transpiler = this,
	            tryEndIndex,
	            tryNode,
	            tryStartIndex;

	        statement = blockContext.prepareStatement();

	        tryStartIndex = functionContext.getCurrentStatementIndex();
	        transpiler.statementTranspiler.transpileArray(node[BLOCK][BODY], node, functionContext, ownBlockContext);
	        tryEndIndex = functionContext.getCurrentStatementIndex();

	        if (hasCatch) {
	            catchStatementIndex = functionContext.getCurrentStatementIndex();

	            (function () {
	                var catchClauseBlockContext = new BlockContext(functionContext),
	                    catchParameter = functionContext.getTempName(),
	                    resumeThrowStatement = ownBlockContext.addResumeThrow();

	                transpiler.statementTranspiler.transpileArray(handler[BODY][BODY], handler, functionContext, catchClauseBlockContext);

	                catchStatements.push(
	                    {
	                        'type': Syntax.IfStatement,
	                        'test': acorn.parse(handler[PARAM][NAME] + ' instanceof Resumable.ResumeException').body[0].expression,
	                        'consequent': {
	                            'type': Syntax.BlockStatement,
	                            'body': [
	                                {
	                                    'type': Syntax.ExpressionStatement,
	                                    'expression': {
	                                        'type': Syntax.AssignmentExpression,
	                                        'operator': '=',
	                                        'left': handler[PARAM],
	                                        'right': {
	                                            'type': Syntax.MemberExpression,
	                                            'object': handler[PARAM],
	                                            'property': {
	                                                'type': Syntax.Identifer,
	                                                'name': 'error'
	                                            },
	                                            'computed': false
	                                        }
	                                    }
	                                }
	                            ]
	                        },
	                        'alternate': {
	                            'type': Syntax.BlockStatement,
	                            'body': [
	                                {
	                                    'type': Syntax.ExpressionStatement,
	                                    'expression': {
	                                        'type': Syntax.AssignmentExpression,
	                                        'operator': '=',
	                                        'left': {
	                                            'type': Syntax.Identifier,
	                                            'name': 'statementIndex'
	                                        },
	                                        'right': {
	                                            'type': Syntax.Literal,
	                                            'value': catchStatementIndex
	                                        }
	                                    }
	                                }
	                            ]
	                        }
	                    },
	                    catchClauseBlockContext.getSwitchStatement()
	                );

	                functionContext.addCatch({
	                    tryStartIndex: tryStartIndex,
	                    tryEndIndex: tryEndIndex - 1,
	                    catchParameter: catchParameter,
	                    catchStatementIndex: catchStatementIndex
	                });

	                resumeThrowStatement.assign({
	                    'type': Syntax.Identifier,
	                    'name': catchParameter
	                });
	            }());
	        }

	        tryNode = {
	            'type': Syntax.TryStatement,
	            'block': {
	                'type': Syntax.BlockStatement,
	                'body': [
	                    ownBlockContext.getSwitchStatement()
	                ]
	            }
	        };

	        if (handler) {
	            tryNode[HANDLER] = {
	                'type': Syntax.CatchClause,
	                'param': handler[PARAM],
	                'body': {
	                    'type': Syntax.BlockStatement,
	                    'body': [
	                        {
	                            'type': Syntax.IfStatement,
	                            'test': acorn.parse(handler[PARAM][NAME] + ' instanceof Resumable.PauseException').body[0].expression,
	                            'consequent': {
	                                'type': Syntax.BlockStatement,
	                                'body': [
	                                    {
	                                        'type': Syntax.ThrowStatement,
	                                        'argument': handler[PARAM]
	                                    }
	                                ]
	                            }
	                        }
	                    ].concat(catchStatements)
	                }
	            };
	        }

	        if (finalizer) {
	            (function () {
	                var finallyClauseBlockContext = new BlockContext(functionContext),
	                    finallyClauseStatementIndex = functionContext.getCurrentStatementIndex();

	                transpiler.statementTranspiler.transpileArray(
	                    finalizer[BODY],
	                    finalizer,
	                    functionContext,
	                    finallyClauseBlockContext
	                );

	                // Jump over the catch block if present to the finalizer
	                if (catchStatementIndex !== null) {
	                    tryNode[BLOCK][BODY].push({
	                        'type': Syntax.IfStatement,
	                        'test': acorn.parse('statementIndex === ' + catchStatementIndex).body[0].expression,
	                        'consequent': {
	                            'type': Syntax.BlockStatement,
	                            'body': [
	                                acorn.parse('statementIndex = ' + finallyClauseStatementIndex + ';').body[0]
	                            ]
	                        }
	                    });
	                }

	                tryNode[FINALIZER] = {
	                    'type': Syntax.BlockStatement,
	                    'body': [
	                        finallyClauseBlockContext.getSwitchStatement()
	                    ]
	                };
	            }());
	        }

	        statement.assign(tryNode);
	    }
	});

	module.exports = TryStatementTranspiler;


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    ARGUMENT = 'argument',
	    COMPUTED = 'computed',
	    NAME = 'name',
	    OBJECT = 'object',
	    OPERATOR = 'operator',
	    PREFIX = 'prefix',
	    PROPERTY = 'property',
	    TYPE = 'type',
	    Syntax = estraverse.Syntax;

	function UpdateExpressionTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(UpdateExpressionTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.UpdateExpression;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var expression,
	            object = null,
	            objectTempName = null,
	            resultTempName;

	        if (node[ARGUMENT][TYPE] === Syntax.MemberExpression) {
	            object = this.expressionTranspiler.transpile(
	                node[ARGUMENT][OBJECT],
	                node,
	                functionContext,
	                blockContext
	            );
	            object = {
	                'type': Syntax.MemberExpression,
	                'object': object,
	                'property': node[ARGUMENT][COMPUTED] ?
	                    this.expressionTranspiler.transpile(
	                        node[ARGUMENT][PROPERTY],
	                        node[ARGUMENT],
	                        functionContext,
	                        blockContext
	                    ) :
	                    node[ARGUMENT][PROPERTY],
	                'computed': node[ARGUMENT][COMPUTED]
	            };
	            objectTempName = functionContext.getTempName();
	            blockContext.addAssignment(objectTempName).assign(object);
	            expression = {
	                'type': Syntax.Identifier,
	                'name': objectTempName
	            };
	        } else {
	            expression = this.expressionTranspiler.transpile(
	                node[ARGUMENT],
	                node,
	                functionContext,
	                blockContext
	            );
	        }

	        // Addition/subtraction of 1
	        resultTempName = functionContext.getTempName();
	        blockContext.addAssignment(resultTempName).assign({
	            'type': Syntax.BinaryExpression,
	            'left': expression,
	            'operator': node[OPERATOR].charAt(0),
	            'right': {
	                'type': Syntax.Literal,
	                'value': 1
	            }
	        });

	        // Assignment back to variable/property
	        blockContext.prepareStatement().assign({
	            'type': Syntax.ExpressionStatement,
	            'expression': {
	                'type': Syntax.AssignmentExpression,
	                'left': object ? object : node[ARGUMENT],
	                'operator': '=',
	                'right': {
	                    'type': Syntax.Identifier,
	                    'name': resultTempName
	                }
	            }
	        });

	        return {
	            'type': Syntax.Identifier,
	            'name': node[PREFIX] ?
	                resultTempName :
	                functionContext.getLastTempNameForVariable(node[ARGUMENT][NAME])
	        };
	    }
	});

	module.exports = UpdateExpressionTranspiler;


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    DECLARATIONS = 'declarations',
	    ID = 'id',
	    INIT = 'init',
	    NAME = 'name',
	    Syntax = estraverse.Syntax;

	function VariableDeclarationTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(VariableDeclarationTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.VariableDeclaration;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var transpiler = this;

	        _.each(node[DECLARATIONS], function (declaration) {
	            var expression;

	            functionContext.addVariable(declaration[ID][NAME]);

	            if (declaration[INIT] !== null) {
	                expression = transpiler.expressionTranspiler.transpile(
	                    declaration[INIT],
	                    node,
	                    functionContext,
	                    blockContext
	                );

	                blockContext.prepareStatement().assign({
	                    'type': Syntax.ExpressionStatement,
	                    'expression': {
	                        'type': Syntax.AssignmentExpression,
	                        'operator': '=',
	                        'left': declaration[ID],
	                        'right': expression
	                    }
	                });
	            }
	        });
	    }
	});

	module.exports = VariableDeclarationTranspiler;


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    acorn = __webpack_require__(59),
	    estraverse = __webpack_require__(66),
	    BlockContext = __webpack_require__(71),
	    BODY = 'body',
	    TEST = 'test',
	    Syntax = estraverse.Syntax;

	function WhileStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(WhileStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.WhileStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var forNode,
	            ownBlockContext = new BlockContext(functionContext),
	            transpiler = this,
	            expression,
	            statement;

	        functionContext.pushLabelableContext();

	        statement = blockContext.prepareStatement();

	        expression = transpiler.expressionTranspiler.transpile(node[TEST], node, functionContext, ownBlockContext);

	        ownBlockContext.prepareStatement().assign({
	            'type': Syntax.IfStatement,
	            'test': {
	                'type': Syntax.UnaryExpression,
	                'operator': '!',
	                'prefix': true,
	                'argument': expression
	            },
	            'consequent': {
	                'type': Syntax.BlockStatement,
	                'body': [
	                    {
	                        'type': Syntax.BreakStatement,
	                        'label': {
	                            'type': Syntax.Identifier,
	                            'name': functionContext.getLabel()
	                        }
	                    }
	                ]
	            }
	        });

	        transpiler.statementTranspiler.transpileArray(node[BODY][BODY], node, functionContext, ownBlockContext);

	        forNode = {
	            'type': Syntax.ForStatement,
	            'init': null,
	            'test': null,
	            'update': null,
	            'body': {
	                'type': Syntax.BlockStatement,
	                'body': [
	                    ownBlockContext.getSwitchStatement(),
	                    acorn.parse('statementIndex = ' + (statement.getIndex() + 1) + ';').body[0]
	                ]
	            }
	        };

	        statement.assign(functionContext.isLabelUsed() ? {
	            'type': Syntax.LabeledStatement,
	            'label': {
	                'type': Syntax.Identifier,
	                'name': functionContext.getLabel()
	            },
	            'body': forNode
	        } : forNode);

	        functionContext.popLabelableContext();
	    }
	});

	module.exports = WhileStatementTranspiler;


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pausable - Pause and resume JavaScript code
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/pausable/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pausable/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    estraverse = __webpack_require__(66),
	    BlockContext = __webpack_require__(71),
	    BODY = 'body',
	    OBJECT = 'object',
	    Syntax = estraverse.Syntax;

	function WithStatementTranspiler(statementTranspiler, expressionTranspiler) {
	    this.expressionTranspiler = expressionTranspiler;
	    this.statementTranspiler = statementTranspiler;
	}

	_.extend(WithStatementTranspiler.prototype, {
	    getNodeType: function () {
	        return Syntax.WithStatement;
	    },

	    transpile: function (node, parent, functionContext, blockContext) {
	        var transpiler = this,
	            object = this.expressionTranspiler.transpile(node[OBJECT], node, functionContext, blockContext),
	            ownBlockContext = new BlockContext(functionContext),
	            statement = blockContext.prepareStatement();

	        transpiler.statementTranspiler.transpileArray(node[BODY][BODY], node, functionContext, ownBlockContext);

	        statement.assign({
	            'type': Syntax.WithStatement,
	            'object': object,
	            'body': {
	                'type': Syntax.BlockStatement,
	                'body': [
	                    ownBlockContext.getSwitchStatement()
	                ]
	            }
	        });
	    }
	});

	module.exports = WithStatementTranspiler;


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHP-To-AST - PHP parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://uniter.github.com/phptoast/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phptoast/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var parsing = __webpack_require__(102),
	    phpGrammarSpec = __webpack_require__(111),
	    PHPToAST = __webpack_require__(114);

	module.exports = new PHPToAST(parsing, phpGrammarSpec);


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Parsing - JSON grammar-based parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/parsing/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/parsing/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var Parser = __webpack_require__(103),
	    Parsing = __webpack_require__(110);

	module.exports = new Parsing(Parser);


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Parsing - JSON grammar-based parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/parsing/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/parsing/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    hasOwn = {}.hasOwnProperty,
	    Component = __webpack_require__(104),
	    Exception = __webpack_require__(107),
	    ParseException = __webpack_require__(108),
	    Rule = __webpack_require__(109);

	function Parser(grammarSpec, stderr) {
	    this.errorHandler = null;
	    this.furthestIgnoreMatch = null;
	    this.furthestIgnoreMatchOffset = -1;
	    this.furthestMatch = null;
	    this.furthestMatchOffset = -1;
	    this.grammarSpec = grammarSpec;
	    this.matchCaches = [];
	    this.state = null;
	    this.stderr = stderr;

	    (function (parser) {
	        // Ensure the regex is anchored to the start of the string so it matches the very next characters
	        function anchorRegex(regex) {
	            if (regex.source.charAt(0) !== '^') {
	                regex = new RegExp('^(?:' + regex.source + ')', regex.toString().match(/[^\/]*$/)[0]);
	            }

	            return regex;
	        }

	        // Speed up repeated match tests in complex grammars by caching component matches
	        function createMatchCache() {
	            var matchCache = {};
	            parser.matchCaches.push(matchCache);
	            return matchCache;
	        }

	        var qualifiers = {
	                // Like "(...)" grouping - 'arg' is an array of components that must all match
	                'allOf': function (text, offset, arg, args, options) {
	                    var matches = [],
	                        textLength = 0,
	                        textOffset = null;

	                    _.each(arg, function (component) {
	                        var componentMatch = component.match(text, offset + (textOffset || 0) + textLength, options);

	                        if (componentMatch === null) {
	                            matches = null;
	                            return false;
	                        }

	                        textLength += componentMatch.textLength;
	                        matches.push(componentMatch.components);

	                        if (textOffset === null) {
	                            textOffset = componentMatch.textOffset;
	                        } else {
	                            textLength += componentMatch.textOffset;
	                        }
	                    });

	                    return matches ? {
	                        components: matches,
	                        textLength: textLength,
	                        textOffset: textOffset || 0
	                    } : null;
	                },
	                // Like "|" (alternation) - 'arg' is an array of components, one of which must match
	                'oneOf': function (text, offset, arg, args, options) {
	                    var match = null;

	                    _.each(arg, function (component) {
	                        var componentMatch = component.match(text, offset, options);

	                        if (componentMatch !== null) {
	                            match = componentMatch;
	                            return false;
	                        }
	                    });

	                    return match;
	                },
	                // Like "+" - 'arg' is an array of components, one or more of which must match consecutively
	                'oneOrMoreOf': function (text, offset, arg, args, options) {
	                    var componentMatch,
	                        matches = [],
	                        textLength = 0,
	                        textOffset = null;

	                    while ((componentMatch = arg.match(text, offset + (textOffset || 0) + textLength, options)) !== null) {
	                        textLength += componentMatch.textLength;
	                        matches.push(componentMatch.components);

	                        if (textOffset === null) {
	                            textOffset = componentMatch.textOffset;
	                        } else {
	                            textLength += componentMatch.textOffset;
	                        }
	                    }

	                    return matches.length > 0 ? {
	                        components: matches,
	                        textLength: textLength,
	                        textOffset: textOffset || 0
	                    } : null;
	                },
	                // Like "?" - 'arg' is a component which may or may not match
	                'optionally': function (text, offset, arg, args, options) {
	                    var match = arg.match(text, offset, options);

	                    if (match) {
	                        if (args.wrapInArray) {
	                            return {
	                                components: [match.components],
	                                textLength: match.textLength,
	                                textOffset: match.textOffset
	                            };
	                        }

	                        return match;
	                    }

	                    return {
	                        components: args.wrapInArray ? [] : '',
	                        textLength: 0,
	                        textOffset: 0
	                    };
	                },
	                // Refers to another rule
	                'rule': function (text, offset, arg, args, options) {
	                    var expectedText = hasOwn.call(args, 'text') ? args.text : null,
	                        match = arg.match(text, offset, options);

	                    if (match === null) {
	                        return null;
	                    }

	                    return (expectedText === null || text.substr(offset + match.textOffset, match.textLength) === expectedText) ? match : null;
	                },
	                'what': function (text, offset, arg, args, options) {
	                    var captureIndex,
	                        match,
	                        result,
	                        whitespaceLength = 0;

	                    function skipWhitespace() {
	                        var match;
	                        if (parser.ignoreRule && options.ignoreWhitespace !== false && args.ignoreWhitespace !== false) {
	                            // Prevent infinite recursion of whitespace skipper
	                            while ((match = parser.ignoreRule.match(text, offset + whitespaceLength, {ignoreWhitespace: false}))) {
	                                whitespaceLength += match.textLength;
	                            }
	                        }
	                    }

	                    function replace(string) {
	                        if (args.replace) {
	                            _.each(args.replace, function (data) {
	                                string = string.replace(data.pattern, data.replacement);
	                            });
	                        }

	                        return string;
	                    }

	                    if (_.isString(arg)) {
	                        skipWhitespace();

	                        if (text.substr(offset + whitespaceLength, arg.length) === arg) {
	                            return {
	                                components: arg,
	                                textLength: arg.length,
	                                textOffset: whitespaceLength
	                            };
	                        }
	                    } else if (arg instanceof RegExp) {
	                        skipWhitespace();

	                        match = text.substr(offset + whitespaceLength).match(arg);

	                        if (match) {
	                            captureIndex = args.captureIndex || 0;
	                            return {
	                                components: replace(match[captureIndex]),
	                                // Always return the entire match length even though we may have only captured part of it
	                                textLength: match[0].length,
	                                textOffset: whitespaceLength
	                            };
	                        }
	                    } else if (arg instanceof Component) {
	                        result = arg.match(text, offset, options);

	                        if (_.isString(result)) {
	                            result = replace(result);
	                        } else if (result && _.isString(result.components)) {
	                            result.components = replace(result.components);
	                        }

	                        return result;
	                    } else if (_.isFunction(arg)) {
	                        skipWhitespace();

	                        return arg(text, offset, whitespaceLength, options);
	                    } else {
	                        throw new Exception('Parser "what" qualifier :: Invalid argument "' + arg + '"');
	                    }

	                    return null;
	                },
	                // Like "*"
	                'zeroOrMoreOf': function (text, offset, arg, args, options) {
	                    var componentMatch,
	                        matches = [],
	                        textLength = 0,
	                        textOffset = null;

	                    while ((componentMatch = arg.match(text, offset + (textOffset || 0) + textLength, options))) {
	                        textLength += componentMatch.textLength;
	                        matches.push(componentMatch.components);

	                        if (textOffset === null) {
	                            textOffset = componentMatch.textOffset;
	                        } else {
	                            textLength += componentMatch.textOffset;
	                        }
	                    }

	                    return {
	                        components: matches,
	                        textLength: textLength,
	                        textOffset: textOffset || 0
	                    };
	                }
	            },
	            rules = {};

	        // Special BeginningOfFile rule
	        rules['<BOF>'] = new Rule('<BOF>', null, null);
	        rules['<BOF>'].setComponent(new Component(parser, createMatchCache(), 'what', qualifiers.what, function (text, offset, textOffset) {
	            return offset === 0 ? {
	                components: '',
	                textLength: 0,
	                textOffset: textOffset
	            } : null;
	        }, {}, null));

	        // Special EndOfFile rule
	        rules['<EOF>'] = new Rule('<EOF>', null, null);
	        rules['<EOF>'].setComponent(new Component(parser, createMatchCache(), 'what', qualifiers.what, function (text, offset, textOffset) {
	            return offset + textOffset === text.length ? {
	                components: '',
	                textLength: 0,
	                textOffset: textOffset
	            } : null;
	        }, {}, null));

	        // Go through and create objects for all rules in this grammar first so we can set up circular references
	        _.each(grammarSpec.rules, function (ruleSpec, name) {
	            var rule;

	            rule = new Rule(
	                name,
	                ruleSpec.captureAs || null,
	                ruleSpec.ifNoMatch || null,
	                ruleSpec.processor || null,
	                ruleSpec.options || null
	            );
	            rules[name] = rule;
	        });

	        _.each(grammarSpec.rules, function (ruleSpec, name) {
	            function createComponent(componentSpec) {
	                var arg,
	                    args = {},
	                    name = null,
	                    qualifierName = null;

	                // Component is a group
	                if (_.isArray(componentSpec)) {
	                    qualifierName = 'allOf';
	                    arg = [];
	                    _.each(componentSpec, function (componentSpec, index) {
	                        arg[index] = createComponent(componentSpec);
	                    });
	                // Component is the name of another rule
	                } else if (_.isString(componentSpec)) {
	                    qualifierName = 'rule';
	                    arg = rules[componentSpec];

	                    if (!arg) {
	                        throw new Exception('Parser :: Invalid component - no rule with name "' + componentSpec + '" exists');
	                    }
	                // Component is a regex terminal
	                } else if (componentSpec instanceof RegExp) {
	                    componentSpec = anchorRegex(componentSpec);

	                    qualifierName = 'what';
	                    arg = componentSpec;
	                } else if (_.isPlainObject(componentSpec)) {
	                    _.each(qualifiers, function (qualifier, name) {
	                        var value;
	                        if (hasOwn.call(componentSpec, name)) {
	                            value = componentSpec[name];
	                            qualifierName = name;

	                            if (qualifierName === 'oneOf') {
	                                arg = [];
	                                _.each(value, function (value, index) {
	                                    arg[index] = createComponent(value);
	                                });
	                            } else if (qualifierName === 'optionally') {
	                                arg = createComponent(value);
	                            } else {
	                                arg = (value instanceof RegExp) ? anchorRegex(value) : createComponent(value);
	                            }

	                            // Qualifier found, stop searching
	                            return false;
	                        }
	                    });

	                    if (!qualifierName) {
	                        if (Object.keys(componentSpec).length !== 1) {
	                            throw new Exception('Parser :: Invalid component - no valid qualifier referenced by spec: ' + JSON.stringify(componentSpec));
	                        }

	                        (function () {
	                            var name = Object.keys(componentSpec)[0];
	                            qualifierName = 'rule';

	                            arg = rules[name];

	                            if (!arg) {
	                                throw new Exception('Parser :: Invalid component - no rule with name "' + name + '" exists');
	                            }
	                            args.text = componentSpec[name];
	                        }());
	                    }

	                    // Pull all arguments out of component spec, excluding the qualifier itself and name (if specified)
	                    _.each(componentSpec, function (value, name) {
	                        if (name !== qualifierName && name !== 'name') {
	                            args[name] = value;
	                        }
	                    });

	                    // Get component name if specified
	                    if (hasOwn.call(componentSpec, 'name')) {
	                        name = componentSpec.name;
	                    }
	                } else {
	                    throw new Exception('Parser :: Invalid componentSpec "' + componentSpec + '" specified');
	                }

	                if (!qualifiers[qualifierName]) {
	                    throw new Exception('Parser :: Invalid component - qualifier name "' + qualifierName + '" is invalid');
	                }

	                return new Component(parser, createMatchCache(), qualifierName, qualifiers[qualifierName], arg, args, name);
	            }

	            rules[name].setComponent(createComponent(ruleSpec.components || ruleSpec));
	        });

	        parser.ignoreRule = rules[grammarSpec.ignore] || null;
	        parser.startRule = rules[grammarSpec.start];
	    }(this));
	}

	_.extend(Parser.prototype, {
	    getErrorHandler: function () {
	        var parser = this;

	        if (!parser.errorHandler && parser.grammarSpec.ErrorHandler) {
	            parser.errorHandler = new parser.grammarSpec.ErrorHandler(parser.stderr, parser.getState());
	        }

	        return parser.errorHandler;
	    },

	    getState: function () {
	        var parser = this;

	        if (!parser.state && parser.grammarSpec.State) {
	            parser.state = new parser.grammarSpec.State();
	        }

	        return parser.state;
	    },

	    logFurthestIgnoreMatch: function (match, offset) {
	        var parser = this;

	        if (offset >= parser.furthestIgnoreMatchOffset && match.textLength > 0) {
	            parser.furthestIgnoreMatch = match;
	            parser.furthestIgnoreMatchOffset = offset;
	        }
	    },

	    logFurthestMatch: function (match, offset) {
	        var parser = this;

	        if (offset >= parser.furthestMatchOffset && match.textLength > 0) {
	            parser.furthestMatch = match;
	            parser.furthestMatchOffset = offset;
	        }
	    },

	    parse: function (text, options) {
	        var parser = this,
	            errorHandler = parser.getErrorHandler(),
	            rule = parser.startRule,
	            match;

	        _.each(parser.matchCaches, function (matchCache) {
	            _.each(matchCache, function (value, name) {
	                delete matchCache[name];
	            });
	        });

	        parser.furthestIgnoreMatch = null;
	        parser.furthestIgnoreMatchOffset = -1;
	        parser.furthestMatch = null;
	        parser.furthestMatchOffset = -1;

	        match = rule.match(text, 0, options);

	        if (errorHandler && (match === null || match.textLength < text.length)) {
	            errorHandler.handle(new ParseException('Parser.parse() :: Unexpected ' + (match ? '"' + text.charAt(match.textLength) + '"' : '$end'), text, parser.furthestMatch, parser.furthestMatchOffset, parser.furthestIgnoreMatch, parser.furthestIgnoreMatchOffset));
	        }

	        return match !== null ? match.components : null;
	    }
	});

	module.exports = Parser;


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Parsing - JSON grammar-based parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/parsing/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/parsing/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    copy = __webpack_require__(105),
	    getLineNumber = __webpack_require__(106),
	    undef;

	function Component(parser, matchCache, qualifierName, qualifier, arg, args, name) {
	    this.arg = arg;
	    this.args = args;
	    this.matchCache = matchCache;
	    this.name = name;
	    this.parser = parser;
	    this.qualifier = qualifier;
	    this.qualifierName = qualifierName;
	}

	_.extend(Component.prototype, {
	    match: function (text, offset, options) {
	        var component = this,
	            match = component.matchCache[offset],
	            subMatch;

	        if (match !== undef) {
	            return match;
	        }

	        subMatch = component.qualifier(text, offset, component.arg, component.args, options);

	        if (subMatch === null) {
	            component.matchCache[offset] = null;
	            return null;
	        }

	        if (options.ignoreWhitespace !== false) {
	            component.parser.logFurthestMatch(subMatch, offset + subMatch.textOffset);
	        } else {
	            component.parser.logFurthestIgnoreMatch(subMatch, offset + subMatch.textOffset);
	        }

	        if (component.name !== null || component.args.allowMerge === false || component.args.captureOffsetAs) {
	            match = createSubMatch(text, match, subMatch, component, offset);
	        } else {
	            // Component is not named: merge its captures in if an array
	            if (_.isArray(subMatch.components)) {
	                match = mergeCaptures(match, subMatch);
	            } else {
	                match = subMatch;
	            }
	        }

	        component.matchCache[offset] = match;

	        return match;
	    }
	});

	function allElementsAreStrings(array) {
	    var allStrings = true;
	    _.each(array, function (element) {
	        if (!_.isString(element)) {
	            allStrings = false;
	            return false;
	        }
	    });
	    return allStrings;
	}

	function mergeCaptures(match, subMatch) {
	    if (allElementsAreStrings(subMatch.components)) {
	        match = {
	            components: subMatch.components.join(''),
	            textLength: subMatch.textLength
	        };
	    } else {
	        match = {
	            components: {},
	            textLength: subMatch.textLength
	        };
	        _.each(subMatch.components, function (value) {
	            if (_.isPlainObject(value)) {
	                copy(match.components, value);
	            }
	        });
	    }

	    if (subMatch.name) {
	        match.components.name = subMatch.name;
	    }

	    match.textOffset = subMatch.textOffset;

	    return match;
	}

	function createSubMatch(text, match, subMatch, component, offset) {
	    // Component is named: don't attempt to merge an array in
	    match = {
	        components: {},
	        textLength: subMatch.textLength,
	        textOffset: subMatch.textOffset
	    };
	    if (subMatch.name) {
	        match.components.name = subMatch.name;
	    }
	    if (component.name !== null) {
	        match.components[component.name] = subMatch.components;
	    }

	    if (component.args.captureOffsetAs) {
	        (function (offset) {
	            match.components[component.args.captureOffsetAs] = {
	                line: getLineNumber(text, offset),
	                offset: offset
	            };
	        }(offset + match.textOffset));
	    }

	    return match;
	}

	module.exports = Component;


/***/ },
/* 105 */
/***/ function(module, exports) {

	/*
	 * Parsing - JSON grammar-based parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/parsing/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/parsing/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function copy(to, from) {
	    var key;

	    for (key in from) {
	        if (hasOwn.call(from, key)) {
	            to[key] = from[key];
	        }
	    }
	}

	module.exports = copy;


/***/ },
/* 106 */
/***/ function(module, exports) {

	/*
	 * Parsing - JSON grammar-based parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/parsing/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/parsing/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	function getLineNumber(text, offset) {
	    function getCount(string, substring) {
	        return string.split(substring).length;
	    }

	    return getCount(text.substr(0, offset), '\n');
	}

	module.exports = getLineNumber;


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Parsing - JSON grammar-based parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/parsing/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/parsing/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    util = __webpack_require__(22);

	function Exception(message) {
	    this.message = message;
	}

	util.inherits(Exception, Error);

	_.extend(Exception.prototype, {
	    type: 'Exception',

	    getMessage: function () {
	        return this.message;
	    }
	});

	module.exports = Exception;


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Parsing - JSON grammar-based parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/parsing/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/parsing/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    getLineNumber = __webpack_require__(106),
	    util = __webpack_require__(22),
	    Exception = __webpack_require__(107);

	function ParseException(
	    message,
	    text,
	    furthestMatch,
	    furthestMatchOffset,
	    furthestIgnoreMatch,
	    furthestIgnoreMatchOffset
	) {
	    Exception.call(this, message);

	    this.furthestIgnoreMatch = furthestIgnoreMatch;
	    this.furthestIgnoreMatchOffset = furthestIgnoreMatchOffset;
	    this.furthestMatch = furthestMatch;
	    this.furthestMatchOffset = furthestMatchOffset;
	    this.text = text;
	}

	util.inherits(ParseException, Exception);

	_.extend(ParseException.prototype, {
	    getFurthestMatchEnd: function () {
	        var exception = this;

	        if (exception.furthestIgnoreMatchOffset > exception.furthestMatchOffset) {
	            return exception.furthestIgnoreMatchOffset + exception.furthestIgnoreMatch.textLength;
	        }

	        return exception.furthestMatchOffset + exception.furthestMatch.textLength;
	    },

	    getLineNumber: function () {
	        var exception = this;

	        return getLineNumber(exception.text, exception.getFurthestMatchEnd());
	    },

	    getText: function () {
	        return this.text;
	    },

	    unexpectedEndOfInput: function () {
	        var exception = this;

	        return exception.getFurthestMatchEnd() === exception.text.length;
	    }
	});

	module.exports = ParseException;


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Parsing - JSON grammar-based parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://asmblah.github.com/parsing/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/parsing/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    copy = __webpack_require__(105);

	function Rule(name, captureName, ifNoMatch, processor, options) {
	    this.captureName = captureName;
	    this.component = null;
	    this.ifNoMatch = ifNoMatch;
	    this.name = name;
	    this.options = options;
	    this.processor = processor;
	}

	_.extend(Rule.prototype, {
	    match: function (text, offset, options) {
	        var component,
	            rule = this,
	            match;

	        options = options || {};

	        match = rule.component.match(text, offset, options);

	        if (match === null) {
	            return null;
	        }

	        if (typeof match.components === 'object') {
	            copy(match.components, rule.options);
	        }

	        if (rule.ifNoMatch && (!(component = match.components[rule.ifNoMatch.component]) || component.length === 0)) {
	            match = {
	                components: match.components[rule.ifNoMatch.capture],
	                textOffset: match.textOffset,
	                textLength: match.textLength
	            };
	        } else {
	            if (!_.isString(match.components) && !match.components.name) {
	                match.components.name = rule.captureName || rule.name;
	            }
	        }

	        if (rule.processor) {
	            match.components = rule.processor(match.components);
	        }

	        return match;
	    },

	    setComponent: function (component) {
	        this.component = component;
	    }
	});

	module.exports = Rule;


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _ = __webpack_require__(6);

	function Parsing(Parser) {
	    this.Parser = Parser;
	}

	_.extend(Parsing.prototype, {
	    create: function (grammarSpec, stderr) {
	        return new this.Parser(grammarSpec, stderr);
	    }
	});

	module.exports = Parsing;


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHP-To-AST - PHP parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://uniter.github.com/phptoast/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phptoast/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	/*
	 * Elimination of left-recursion: http://web.cs.wpi.edu/~kal/PLT/PLT4.1.2.html
	 */

	var _ = __webpack_require__(6),
	    uppercaseReplacements = [{
	        pattern: /.*/g,
	        replacement: function (all) {
	            return all.toUpperCase();
	        }
	    }],
	    stringEscapeReplacements = [{
	        pattern: /\\([\$efnrtv\\"])/g,
	        replacement: function (all, chr) {
	            return {
	                'e': '\x1B', // Escape
	                'f': '\f',   // Form feed
	                'n': '\n',   // Linefeed
	                'r': '\r',   // Carriage-return
	                't': '\t',   // Horizontal tab
	                'v': '\x0B', // Vertical tab (JS '\v' escape not supported in IE < 9)
	                '\\': '\\',
	                '$': '$',
	                '"': '"'
	            }[chr];
	        }
	    }],
	    singleQuotedStringEscapeReplacements = [{
	        // Escaped backslash should result in just one backslash
	        pattern: /\\\\/g,
	        replacement: '\\'
	    }],
	    buildTree = function (first, rest, buildNode) {
	        var i,
	            length,
	            result = first;

	        for (i = 0, length = rest.length; i < length; i++) {
	            result = buildNode(result, rest[i]);
	        }

	        return result;
	    },
	    buildBinaryExpression = function (first, rest) {
	        // Transform the captured flat list into an AST
	        // which will eliminate any ambiguity over precedence.
	        return buildTree(first, rest, function (result, element) {
	            return {
	                name: 'N_EXPRESSION',
	                left: result,
	                right: [
	                    {
	                        operator: element.operator,
	                        operand: element.operand
	                    }
	                ]
	            };
	        });
	    },
	    PHPErrorHandler = __webpack_require__(112),
	    PHPGrammarState = __webpack_require__(113);

	module.exports = {
	    ErrorHandler: PHPErrorHandler,
	    State: PHPGrammarState,
	    ignore: 'N_IGNORE',
	    rules: {
	        'T_ABSTRACT': /abstract\b/i,
	        'T_AND_EQUAL': /&=/i,
	        'T_ARRAY': /array\b/i,
	        'T_ARRAY_CAST': /\(\s*array\s*\)/i,
	        'T_AS': /as\b/i,

	        // Anything below ASCII 32 except \t (0x09), \n (0x0a) and \r (0x0d)
	        'T_BAD_CHARACTER': /(?![\u0009\u000A\u000D])[\u0000-\u001F]/,

	        'T_BOOLEAN_AND': /&&/i,
	        'T_BOOLEAN_OR': /\|\|/,
	        'T_BOOL_CAST': /\(\s*bool(ean)?\s*\)/i,
	        'T_BREAK': /break\b/i,
	        'T_CALLABLE': /callable\b/i,
	        'T_CASE': /case\b/i,
	        'T_CATCH': /catch\b/i,
	        'T_CLASS': /class\b/i,
	        'T_CLASS_C': /__CLASS__/i,
	        'T_CLONE': /clone/i,
	        'T_CLOSE_TAG': /[?%]>\n?/,
	        'T_COMMENT': /(?:\/\/|#)(.*?)[\r\n]+|\/\*(?!\*)([\s\S]*?)\*\//,
	        'T_CONCAT_EQUAL': /\.=/,
	        'T_CONST': /const\b/i,
	        'T_CONSTANT_ENCAPSED_STRING': {oneOf: [
	            // Single-quoted
	            {what: /'((?:[^']|\\')*)'/, captureIndex: 1, replace: singleQuotedStringEscapeReplacements},
	            // Double-quoted
	            {what: /"((?:(?!\$\{?[\$a-z0-9_]+)(?:[^\\"]|\\[\s\S]))*)"/, captureIndex: 1, replace: stringEscapeReplacements}
	        ]},
	        'T_CONTINUE': /continue\b/i,
	        'T_CURLY_OPEN': /\{(?=\$)/,
	        'T_DEC': /--/i,
	        'T_DECLARE': /declare\b/i,
	        'T_DEFAULT': /default\b/i,
	        'T_DIR': /__DIR__\b/i,
	        'T_DIV_EQUAL': /\/=/,

	        // See http://www.php.net/manual/en/language.types.float.php
	        'T_DNUMBER': /\d+\.\d+|\d\.\d+e\d+|\d+e[+-]\d+/i,

	        'T_DOC_COMMENT': /\/\*\*([\s\S]*?)\*\//,
	        'T_DO': /do\b/i,
	        'T_DOLLAR_OPEN_CURLY_BRACES': /\$\{/,
	        'T_DOUBLE_ARROW': /=>/,
	        'T_DOUBLE_CAST': /\((real|double|float)\)/i,

	        // Also defined as T_PAAMAYIM_NEKUDOTAYIM
	        'T_DOUBLE_COLON': /::/i,

	        'T_ECHO': /echo\b/i,
	        'T_ELSE': /else\b/i,
	        'T_ELSEIF': /elseif\b/i,
	        'T_EMPTY': /empty\b/i,
	        'T_ENCAPSED_AND_WHITESPACE': /(?:[^"\${]|\\["\${])+/,
	        'T_ENDDECLARE': /enddeclare\b/i,
	        'T_ENDFOR': /endfor\b/i,
	        'T_ENDFOREACH': /endforeach\b/i,
	        'T_ENDIF': /endif\b/i,
	        'T_ENDSWITCH': /endswitch\b/i,
	        'T_ENDWHILE': /endwhile\b/i,

	        // Token gets defined as a pushed token after a Heredoc is found
	        'T_END_HEREDOC': /(?!)/,

	        'T_EVAL': /eval\b/i,
	        'T_EXIT': /(?:exit|die)\b/i,
	        'T_EXTENDS': /extends\b/i,
	        'T_FILE': /__FILE__\b/i,
	        'T_FINAL': /final\b/i,
	        'T_FINALLY': /finally\b/i,
	        'T_FOR': /for\b/i,
	        'T_FOREACH': /foreach\b/i,
	        'T_FUNCTION': /function\b/i,
	        'T_FUNC_C': /__FUNCTION__\b/i,
	        'T_GLOBAL': /global\b/i,
	        'T_GOTO': /goto\b/i,
	        'T_HALT_COMPILER': /__halt_compiler(?=\(\)|\s|;)/,
	        'T_IF': /if\b/i,
	        'T_IMPLEMENTS': /implements\b/i,
	        'T_INC': /\+\+/,
	        'T_INCLUDE': /include\b/i,
	        'T_INCLUDE_ONCE': /include_once\b/i,
	        'T_INLINE_HTML': /(?:[^<]|<[^?%]|<\?(?!php)[\s\S]{3})+/,
	        'T_INSTANCEOF': /instanceof\b/i,
	        'T_INSTEADOF': /insteadof\b/i,
	        'T_INT_CAST': /\(\s*int(eger)?\s*\)/i,
	        'T_INTERFACE': /interface\b/i,
	        'T_ISSET': /isset\b/i,
	        'T_IS_EQUAL': /==(?!=)/i,
	        'T_IS_GREATER_OR_EQUAL': />=/,
	        'T_IS_IDENTICAL': /===/i,
	        'T_IS_NOT_EQUAL': /!=|<>/,
	        'T_IS_NOT_IDENTICAL': /!==/,
	        'T_IS_SMALLER_OR_EQUAL': /<=/,
	        'T_LINE': /__LINE__\b/i,
	        'T_LIST': /list\b/i,
	        'T_LNUMBER': /\d+|0x[0-9a-f]/i,
	        'T_LOGICAL_AND': /and\b/i,
	        'T_LOGICAL_OR': /or\b/i,
	        'T_LOGICAL_XOR': /xor\b/i,
	        'T_METHOD_C': /__METHOD__\b/i,
	        'T_MINUS_EQUAL': /-=/i,

	        // Not used anymore (PHP 4 only)
	        'T_ML_COMMENT': /(?!)/,

	        'T_MOD_EQUAL': /%=/i,
	        'T_MUL_EQUAL': /\*=/,
	        'T_NAMESPACE': /namespace\b/i,
	        'T_NS_C': /__NAMESPACE__\b/i,
	        'T_NS_SEPARATOR': /\\/,
	        'T_NEW': /new\b/i,
	        'T_NUM_STRING': /\d+/,
	        'T_OBJECT_CAST': /\(\s*object\s*\)/i,
	        'T_OBJECT_OPERATOR': /->/,

	        // Not used anymore (PHP 4 only)
	        'T_OLD_FUNCTION': /old_function\b/i,

	        'T_OPEN_TAG': /(?:<\?(php)?|<%)\s?(?!=)/,

	        'T_OPEN_TAG_WITH_ECHO': /<[?%]=/,
	        'T_OR_EQUAL': /\|=/,

	        // Also defined as T_DOUBLE_COLON
	        'T_PAAMAYIM_NEKUDOTAYIM': /::/i,

	        'T_PLUS_EQUAL': /\+=/,
	        'T_PRINT': /print\b/i,
	        'T_PRIVATE': /private\b/i,
	        'T_PUBLIC': /public\b/i,
	        'T_PROTECTED': /protected\b/i,
	        'T_REQUIRE': /require\b/i,
	        'T_REQUIRE_ONCE': /require_once\b/i,
	        'T_RETURN': /return\b/i,
	        'T_SL': /<</,
	        'T_SL_EQUAL': /<<=/,
	        'T_SR': />>/,
	        'T_SR_EQUAL': />>=/,
	        'T_START_HEREDOC': /<<<(["']?)([\$a-z0-9_]+)\1\n?/,
	        'T_STATIC': /static\b/i,
	        'T_STRING': /(?![\$0-9])[\$a-z0-9_]+/i,
	        'T_STRING_CAST': /\(\s*string\s*\)/i,
	        'T_STRING_VARNAME': /(?![\$0-9])[\$a-z0-9_]+/,
	        'T_SWITCH': /switch\b/i,
	        'T_THROW': /throw\b/i,
	        'T_TRAIT': /trait\b/i,
	        'T_TRAIT_C': /__TRAIT__\b/i,
	        'T_TRY': /try\b/i,
	        'T_UNSET': /unset\b/i,
	        'T_UNSET_CAST': /\(\s*unset\s*\)/i,
	        'T_USE': /use\b/i,
	        'T_VAR': /var\b/i,
	        'T_VARIABLE': {what: /\$([a-z0-9_]+)/i, captureIndex: 1},
	        'T_WHILE': /while\b/i,
	        'T_WHITESPACE': /[\r\n\t ]+/,
	        'T_XOR_EQUAL': /\^=/i,
	        'T_YIELD': /yield\b/i,

	        'N_ARGUMENT': {
	            oneOf: ['N_DECORATED_ARGUMENT', 'N_VARIABLE']
	        },
	        'N_DECORATED_ARGUMENT': {
	            captureAs: 'N_ARGUMENT',
	            components: {oneOf: [
	                [{name: 'variable', rule: 'N_VARIABLE'}, (/=/), {name: 'value', rule: 'N_TERM'}],
	                [{name: 'type', oneOf: ['N_NAMESPACE', 'T_STRING']}, {name: 'variable', rule: 'N_VARIABLE'}, (/=/), {name: 'value', rule: 'N_TERM'}],
	                [{name: 'type', oneOf: ['N_NAMESPACE', 'T_STRING']}, {name: 'variable', rule: 'N_VARIABLE'}]
	            ]}
	        },
	        'N_ARRAY_INDEX': {
	            components: 'N_EXPRESSION_LEVEL_2_A'
	        },
	        'N_ARRAY_LITERAL': {
	            components: ['T_ARRAY', (/\(/), {name: 'elements', zeroOrMoreOf: [{oneOf: ['N_KEY_VALUE_PAIR', 'N_EXPRESSION']}, {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/)]
	        },
	        'N_BOOLEAN': {
	            components: {name: 'bool', what: (/true|false/i)}
	        },
	        'N_BREAK_STATEMENT': {
	            components: ['T_BREAK', {name: 'levels', oneOf: ['N_INTEGER', 'N_JUMP_ONE_LEVEL']}, (/;/)]
	        },
	        'N_CASE': {
	            components: ['T_CASE', {name: 'expression', what: 'N_EXPRESSION'}, (/:/), {name: 'body', zeroOrMoreOf: 'N_STATEMENT'}]
	        },
	        'N_CLASS_STATEMENT': {
	            components: ['T_CLASS', {name: 'className', rule: 'T_STRING'}, {optionally: ['T_EXTENDS', {name: 'extend', oneOf: ['N_NAMESPACE', 'T_STRING']}]}, {optionally: ['T_IMPLEMENTS', {name: 'implement', zeroOrMoreOf: [{oneOf: ['N_NAMESPACE', 'T_STRING']}, {what: (/(,|(?=\{))()/), captureIndex: 2}]}]}, (/\{/), {name: 'members', zeroOrMoreOf: {oneOf: ['N_INSTANCE_PROPERTY_DEFINITION', 'N_STATIC_PROPERTY_DEFINITION', 'N_METHOD_DEFINITION', 'N_STATIC_METHOD_DEFINITION', 'N_CONSTANT_DEFINITION']}}, (/\}/)]
	        },
	        'N_CLOSURE': {
	            components: ['T_FUNCTION', (/\(/), {name: 'args', zeroOrMoreOf: ['N_ARGUMENT', {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/), {oneOf: [['T_USE', (/\(/), {name: 'bindings', zeroOrMoreOf: ['N_VARIABLE', {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/)], {name: 'bindings', zeroOrMoreOf: {what: (/(?!)/)}}]}, {name: 'body', what: 'N_STATEMENT'}]
	        },
	        'N_COMMA_EXPRESSION': {
	            components: {optionally: [{name: 'expressions', zeroOrMoreOf: ['N_EXPRESSION', {what: (/(,|(?=[;\)]))()/), captureIndex: 2}]}, (/(?=[;\)])/)]}
	        },
	        'N_COMPOUND_STATEMENT': {
	            components: [(/\{/), {name: 'statements', zeroOrMoreOf: 'N_STATEMENT'}, (/\}/)]
	        },
	        'N_CONSTANT_DEFINITION': {
	            components: ['T_CONST', {name: 'constant', what: 'T_STRING'}, (/=/), {name: 'value', oneOf: ['N_CLASS_CONSTANT', 'N_TERM']}, (/;/)]
	        },
	        'N_CONTINUE_STATEMENT': {
	            components: ['T_CONTINUE', {name: 'levels', oneOf: ['N_INTEGER', 'N_JUMP_ONE_LEVEL']}, (/;/)]
	        },
	        'N_DEFAULT_CASE': {
	            components: ['T_DEFAULT', (/:/), {name: 'body', zeroOrMoreOf: 'N_STATEMENT'}]
	        },
	        'N_ECHO_STATEMENT': {
	            components: ['T_ECHO', {name: 'expression', what: 'N_EXPRESSION'}, (/;/)]
	        },
	        'N_EMPTY_STATEMENT': {
	            components: (/;/)
	        },
	        'N_EXPRESSION': {
	            components: {oneOf: ['N_EXPRESSION_LEVEL_21']}
	        },

	        /*
	         * Operator precedence: see http://php.net/manual/en/language.operators.precedence.php
	         */
	        // Precedence level 0 (highest) - single terms and bracketed expressions
	        'N_EXPRESSION_LEVEL_0': {
	            components: [{oneOf: ['N_TERM', [(/\(/), 'N_EXPRESSION', (/\)/)]]}]
	        },
	        'N_EXPRESSION_LEVEL_1_A': {
	            captureAs: 'N_NEW_EXPRESSION',
	            components: {oneOf: [
	                [
	                    'T_NEW',
	                    {name: 'className', oneOf: ['N_NAMESPACED_REFERENCE', 'N_EXPRESSION_LEVEL_0']},
	                    {optionally: [
	                        (/\(/),
	                        {name: 'args', zeroOrMoreOf: ['N_EXPRESSION', {what: (/(,|(?=\)))()/), captureIndex: 2}]},
	                        (/\)/)
	                    ]}
	                ],
	                {name: 'next', what: 'N_EXPRESSION_LEVEL_0'}
	            ]},
	            ifNoMatch: {component: 'className', capture: 'next'}
	        },
	        'N_DO_WHILE_STATEMENT': {
	            components: ['T_DO', {name: 'body', what: 'N_STATEMENT'}, 'T_WHILE', (/\(/), {name: 'condition', what: 'N_EXPRESSION'}, (/\)/), (/;/)]
	        },
	        'N_EXPRESSION_LEVEL_1_B': {
	            captureAs: 'N_FUNCTION_CALL',
	            components: {oneOf: [
	                [
	                    {name: 'func', oneOf: ['N_NAMESPACED_REFERENCE', 'N_EXPRESSION_LEVEL_1_A']},
	                    [
	                        (/\(/),
	                        {name: 'args', zeroOrMoreOf: ['N_EXPRESSION', {what: (/(,|(?=\)))()/), captureIndex: 2}]},
	                        (/\)/)
	                    ]
	                ],
	                {name: 'next', what: 'N_EXPRESSION_LEVEL_1_A'}
	            ]},
	            ifNoMatch: {component: 'func', capture: 'next'}
	        },
	        'N_EXPRESSION_LEVEL_1_D': {
	            captureAs: 'N_UNARY_EXPRESSION',
	            components: [{name: 'operator', optionally: 'T_CLONE'}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_1_B'}],
	            ifNoMatch: {component: 'operator', capture: 'operand'},
	            options: {prefix: true}
	        },

	        'N_EXPRESSION_LEVEL_2_A': {
	            captureAs: 'N_CLASS_CONSTANT',
	            components: {oneOf: [
	                [
	                    {name: 'className', oneOf: ['N_NAMESPACED_REFERENCE', 'N_EXPRESSION_LEVEL_1_D']},
	                    'T_DOUBLE_COLON',
	                    {name: 'constant', what: ['T_STRING', (/(?!\()/)]}
	                ],
	                {name: 'next', what: 'N_EXPRESSION_LEVEL_1_D'}
	            ]},
	            ifNoMatch: {component: 'constant', capture: 'next'}
	        },
	        'N_CLASS_CONSTANT': 'N_EXPRESSION_LEVEL_2_A',
	        'N_EMPTY_ARRAY_INDEX': {
	            captureAs: 'N_ARRAY_INDEX',
	            components: {name: 'indices', what: [(/\[/), (/\]/)]},
	            options: {indices: true}
	        },
	        'N_EXPRESSION_LEVEL_2_B': {
	            components: [
	                {
	                    name: 'expression',
	                    oneOf: ['N_EXPRESSION_LEVEL_2_A', 'N_NAMESPACED_REFERENCE']
	                },
	                {
	                    name: 'member',
	                    zeroOrMoreOf: {
	                        oneOf: [
	                            // Array index
	                            {
	                                name: 'array_index',
	                                oneOf: [
	                                    'N_EMPTY_ARRAY_INDEX',
	                                    {
	                                        name: 'indices',
	                                        oneOrMoreOf: [
	                                            (/\[/), {name: 'index', what: 'N_EXPRESSION'}, (/\]/)
	                                        ]
	                                    }
	                                ]
	                            },
	                            // Method call
	                            {
	                                name: 'method_call',
	                                what: {
	                                    name: 'calls',
	                                    oneOrMoreOf: [
	                                        'T_OBJECT_OPERATOR',
	                                        {name: 'func', oneOf: ['N_STRING', 'N_VARIABLE']},
	                                        (/\(/),
	                                        {
	                                            name: 'args',
	                                            zeroOrMoreOf: ['N_EXPRESSION', {
	                                                what: (/(,|(?=\)))()/),
	                                                captureIndex: 2
	                                            }]
	                                        },
	                                        (/\)/)
	                                    ]
	                                }
	                            },
	                            // Object property
	                            {
	                                name: 'object_property',
	                                what: {
	                                    name: 'properties',
	                                    oneOrMoreOf: [
	                                        'T_OBJECT_OPERATOR',
	                                        {name: 'property', what: 'N_INSTANCE_MEMBER'},
	                                        (/(?!\()/)
	                                    ]
	                                }
	                            },
	                            // Static method call
	                            {
	                                name: 'static_method_call',
	                                what: [
	                                    'T_DOUBLE_COLON',
	                                    {name: 'method', oneOf: ['N_STRING', 'N_VARIABLE', 'N_VARIABLE_EXPRESSION']},
	                                    (/\(/),
	                                    {name: 'args', zeroOrMoreOf: ['N_EXPRESSION', {what: (/(,|(?=\)))()/), captureIndex: 2}]},
	                                    (/\)/)
	                                ]
	                            },
	                            // Static object property
	                            {
	                                name: 'static_property',
	                                what: [
	                                    'T_DOUBLE_COLON',
	                                    {name: 'property', what: 'N_STATIC_MEMBER'}
	                                ]
	                            }
	                        ]
	                    }
	                }
	            ],
	            processor: function (node) {
	                var result;

	                if (!node || !node.expression) {
	                    return node;
	                }

	                result = node.expression;

	                _.each(node.member, function (member) {
	                    if (member.array_index) {
	                        result = {
	                            name: 'N_ARRAY_INDEX',
	                            array: result,
	                            indices: member.array_index.indices
	                        };
	                    } else if (member.method_call) {
	                        result = {
	                            name: 'N_METHOD_CALL',
	                            object: result,
	                            calls: member.method_call.calls
	                        };
	                    } else if (member.object_property) {
	                        result = {
	                            name: 'N_OBJECT_PROPERTY',
	                            object: result,
	                            properties: member.object_property.properties
	                        };
	                    } else if (member.static_method_call) {
	                        result = {
	                            name: 'N_STATIC_METHOD_CALL',
	                            className: result,
	                            method: member.static_method_call.method,
	                            args: member.static_method_call.args
	                        };
	                    } else if (member.static_property) {
	                        result = {
	                            name: 'N_STATIC_PROPERTY',
	                            className: result,
	                            property: member.static_property.property
	                        };
	                    }
	                });

	                return result;
	            }
	        },
	        'N_EXPRESSION_LEVEL_3_A': {
	            oneOf: ['N_UNARY_PREFIX_EXPRESSION', 'N_UNARY_SUFFIX_EXPRESSION', 'N_EXPRESSION_LEVEL_2_B']
	        },
	        'N_EXPRESSION_LEVEL_3_B': {
	            oneOf: ['N_ARRAY_CAST', 'N_EXPRESSION_LEVEL_3_A']
	        },
	        'N_ARRAY_CAST': {
	            components: ['T_ARRAY_CAST', {name: 'value', rule: 'N_EXPRESSION_LEVEL_3_A'}]
	        },
	        'N_UNARY_PREFIX_EXPRESSION': {
	            captureAs: 'N_UNARY_EXPRESSION',
	            components: [{name: 'operator', oneOf: ['T_INC', 'T_DEC', (/~/)]}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_2_B'}],
	            ifNoMatch: {component: 'operator', capture: 'operand'},
	            options: {prefix: true}
	        },
	        'N_UNARY_SUFFIX_EXPRESSION': {
	            captureAs: 'N_UNARY_EXPRESSION',
	            components: [{name: 'operand', what: 'N_EXPRESSION_LEVEL_2_B'}, {name: 'operator', oneOf: ['T_INC', 'T_DEC']}],
	            ifNoMatch: {component: 'operator', capture: 'operand'},
	            options: {prefix: false}
	        },
	        'N_EXPRESSION_LEVEL_4': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_3_B'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: 'T_INSTANCEOF'}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_3_B'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_5': {
	            captureAs: 'N_UNARY_EXPRESSION',
	            components: [{name: 'operator', optionally: (/!/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_4'}],
	            ifNoMatch: {component: 'operator', capture: 'operand'},
	            options: {prefix: true}
	        },
	        'N_EXPRESSION_LEVEL_6': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_5'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', oneOf: [(/\*/), (/\//), (/%/)]}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_5'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_7_A': {
	            captureAs: 'N_UNARY_EXPRESSION',
	            components: [{name: 'operator', optionally: (/([+-])(?!\1)/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_6'}],
	            ifNoMatch: {component: 'operator', capture: 'operand'},
	            options: {prefix: true}
	        },
	        'N_EXPRESSION_LEVEL_7_B': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_7_A'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', oneOf: [(/\+/), (/-/), (/\./)]}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_7_A'}]}],
	            processor: function (node) {
	                if (!node.right) {
	                    return node.left;
	                }

	                return buildBinaryExpression(node.left, node.right);
	            }
	        },
	        'N_EXPRESSION_LEVEL_8': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_7_B'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', oneOf: ['T_SL', 'T_SR']}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_7_B'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_9': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_8'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', oneOf: ['T_IS_SMALLER_OR_EQUAL', (/</), 'T_IS_GREATER_OR_EQUAL', (/>/)]}, {name: 'operand', what: 'N_EXPRESSION'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_10': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_9'}, {name: 'right', wrapInArray: true, optionally: [{name: 'operator', oneOf: ['T_IS_IDENTICAL', 'T_IS_EQUAL', 'T_IS_NOT_IDENTICAL', 'T_IS_NOT_EQUAL']}, {name: 'operand', what: 'N_EXPRESSION'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_11': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_10'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/&&/)}, {name: 'operand', what: 'N_EXPRESSION'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_12': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_11'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/\^/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_11'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_13': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_12'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/\|/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_12'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_14': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_13'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/&/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_13'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_15': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_14'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: (/\|\|/)}, {name: 'operand', what: 'N_EXPRESSION'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_16': {
	            captureAs: 'N_TERNARY',
	            components: [{name: 'condition', what: 'N_EXPRESSION_LEVEL_15'}, {name: 'options', zeroOrMoreOf: [(/\?/), {name: 'consequent', what: 'N_EXPRESSION_LEVEL_15'}, (/:/), {name: 'alternate', what: 'N_EXPRESSION_LEVEL_15'}]}],
	            ifNoMatch: {component: 'options', capture: 'condition'}
	        },
	         'N_EXPRESSION_LEVEL_17_A': {
	             captureAs: 'N_EXPRESSION',
	             components: {
	                 // Don't allow binary expressions on the left-hand side of assignments
	                 oneOf: [
	                     [
	                         {name: 'left', what: 'N_EXPRESSION_LEVEL_2_B'},
	                         {name: 'right', oneOrMoreOf: [{name: 'operator', what: (/[+-]?=/)}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_17_A'}]}
	                     ],
	                     'N_EXPRESSION_LEVEL_16'
	                 ]
	             }
	         },
	        'N_EXPRESSION_LEVEL_17_B': {
	            captureAs: 'N_PRINT_EXPRESSION',
	            components: {oneOf: [
	                [
	                    'T_PRINT',
	                    {name: 'operand', what: 'N_EXPRESSION_LEVEL_17_A'},
	                ],
	                {name: 'next', what: 'N_EXPRESSION_LEVEL_17_A'}
	            ]},
	            ifNoMatch: {component: 'operand', capture: 'next'}
	        },
	        'N_EXPRESSION_LEVEL_18': {
	            captureAs: 'N_EXPRESSION',
	            components: [{name: 'left', what: 'N_EXPRESSION_LEVEL_17_B'}, {name: 'right', zeroOrMoreOf: [{name: 'operator', what: 'T_LOGICAL_AND'}, {name: 'operand', what: 'N_EXPRESSION_LEVEL_17_B'}]}],
	            ifNoMatch: {component: 'right', capture: 'left'}
	        },
	        'N_EXPRESSION_LEVEL_19': {
	            components: 'N_EXPRESSION_LEVEL_18'
	        },
	        'N_EXPRESSION_LEVEL_20': {
	            components: 'N_EXPRESSION_LEVEL_19'
	        },
	        'N_EXPRESSION_LEVEL_21': {
	            components: 'N_EXPRESSION_LEVEL_20'
	        },
	        'N_EXPRESSION_STATEMENT': {
	            components: [{name: 'expression', what: 'N_EXPRESSION'}, (/;/)]
	        },
	        'N_FLOAT': {
	            components: {name: 'number', what: 'T_DNUMBER'}
	        },
	        'N_FOR_STATEMENT': {
	            components: ['T_FOR', (/\(/), {name: 'initializer', what: 'N_COMMA_EXPRESSION'}, (/;/), {name: 'condition', what: 'N_COMMA_EXPRESSION'}, (/;/), {name: 'update', what: 'N_COMMA_EXPRESSION'}, (/\)/), {name: 'body', what: 'N_STATEMENT'}]
	        },
	        'N_FOREACH_STATEMENT': {
	            components: ['T_FOREACH', (/\(/), {name: 'array', rule: 'N_EXPRESSION'}, 'T_AS', {optionally: [{name: 'key', oneOf: ['N_ARRAY_INDEX', 'N_VARIABLE']}, 'T_DOUBLE_ARROW']}, {name: 'value', oneOf: ['N_ARRAY_INDEX', 'N_VARIABLE']}, (/\)/), {name: 'body', what: 'N_STATEMENT'}]
	        },
	        'N_FUNCTION_STATEMENT': {
	            components: ['T_FUNCTION', {name: 'func', what: 'T_STRING'}, (/\(/), {name: 'args', zeroOrMoreOf: ['N_ARGUMENT', {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/), {name: 'body', what: 'N_STATEMENT'}]
	        },
	        'N_GOTO_STATEMENT': {
	            components: ['T_GOTO', {name: 'label', what: 'T_STRING'}, (/;/)]
	        },
	        'N_IF_STATEMENT': {
	            components: ['T_IF', (/\(/), {name: 'condition', what: 'N_EXPRESSION'}, (/\)/), {name: 'consequentStatement', what: 'N_STATEMENT'}, {optionally: [(/else(\b|(?=if\b))/), {name: 'alternateStatement', what: 'N_STATEMENT'}]}]
	        },
	        'N_IGNORE': {
	            components: {oneOrMoreOf: {oneOf: ['T_WHITESPACE', 'T_COMMENT', 'T_DOC_COMMENT']}}
	        },
	        'N_INCLUDE_EXPRESSION': {
	            components: ['T_INCLUDE', {name: 'path', what: 'N_EXPRESSION'}]
	        },
	        'N_INLINE_HTML_STATEMENT': [{oneOf: ['T_CLOSE_TAG', '<BOF>']}, {name: 'html', what: 'T_INLINE_HTML'}, {oneOf: ['T_OPEN_TAG', '<EOF>']}],
	        'N_INSTANCE_MEMBER': {
	            components: {oneOf: ['N_STRING', 'N_VARIABLE', [(/\{/), 'N_EXPRESSION', (/\}/)]]}
	        },
	        'N_INSTANCE_PROPERTY_DEFINITION': {
	            components: [{name: 'visibility', oneOf: ['T_PUBLIC', 'T_PRIVATE', 'T_PROTECTED']}, {name: 'variable', what: 'N_VARIABLE'}, {optionally: [(/=/), {name: 'value', what: 'N_TERM'}]}, (/;/)]
	        },
	        'N_INTEGER': {
	            components: {name: 'number', what: 'T_LNUMBER'}
	        },
	        'N_INTERFACE_METHOD_DEFINITION': {
	            components: [{name: 'visibility', oneOf: ['T_PUBLIC', 'T_PRIVATE', 'T_PROTECTED']}, 'T_FUNCTION', {name: 'func', what: 'T_STRING'}, (/\(/), {name: 'args', zeroOrMoreOf: ['N_ARGUMENT', {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/), (/;/)]
	        },
	        'N_INTERFACE_STATEMENT': {
	            components: ['T_INTERFACE', {name: 'interfaceName', rule: 'T_STRING'}, {optionally: ['T_EXTENDS', {name: 'extend', oneOf: ['N_NAMESPACE', 'T_STRING']}]}, (/\{/), {name: 'members', zeroOrMoreOf: {oneOf: ['N_INTERFACE_METHOD_DEFINITION', 'N_STATIC_INTERFACE_METHOD_DEFINITION', 'N_CONSTANT_DEFINITION', 'N_INSTANCE_PROPERTY_DEFINITION', 'N_STATIC_PROPERTY_DEFINITION', 'N_METHOD_DEFINITION', 'N_STATIC_METHOD_DEFINITION']}}, (/\}/)]
	        },
	        'N_ISSET': {
	            components: ['T_ISSET', (/\(/), {name: 'variables', zeroOrMoreOf: ['N_EXPRESSION', {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/)]
	        },
	        'N_JUMP_ONE_LEVEL': {
	            captureAs: 'N_INTEGER',
	            components: {name: 'number', what: (/()/)},
	            options: {number: '1'}
	        },
	        'N_KEY_VALUE_PAIR': {
	            components: [{name: 'key', what: 'N_EXPRESSION'}, 'T_DOUBLE_ARROW', {name: 'value', what: 'N_EXPRESSION'}]
	        },
	        'N_LABEL_STATEMENT': {
	            components: [{name: 'label', what: [(/(?!default\b)/i), 'T_STRING']}, (/:/)]
	        },
	        'N_LIST': {
	            components: ['T_LIST', (/\(/), {name: 'elements', zeroOrMoreOf: {oneOf: [[{oneOf: ['N_VARIABLE', 'N_ARRAY_INDEX']}, {what: (/(,|(?=\)))()/), captureIndex: 2}], 'N_VOID']}}, (/\)/)]
	        },
	        'N_MAGIC_CONSTANT': {
	            components: {oneOf: ['N_MAGIC_DIR_CONSTANT', 'N_MAGIC_FILE_CONSTANT', 'N_MAGIC_LINE_CONSTANT']}
	        },
	        'N_MAGIC_DIR_CONSTANT': {
	            components: {what: 'T_DIR', replace: uppercaseReplacements, allowMerge: false}
	        },
	        'N_MAGIC_FILE_CONSTANT': {
	            components: {what: 'T_FILE', replace: uppercaseReplacements, allowMerge: false}
	        },
	        'N_MAGIC_LINE_CONSTANT': {
	            components: {what: 'T_LINE', replace: uppercaseReplacements, captureOffsetAs: 'offset'}
	        },
	        'N_METHOD_DEFINITION': {
	            components: [{name: 'visibility', optionally: {oneOf: ['T_PUBLIC', 'T_PRIVATE', 'T_PROTECTED']}}, 'T_FUNCTION', {name: 'func', what: 'T_STRING'}, (/\(/), {name: 'args', zeroOrMoreOf: ['N_ARGUMENT', {what: (/(,|(?=\)))()/), captureIndex: 2}]}, (/\)/), {name: 'body', what: 'N_STATEMENT'}],
	            processor: function (node) {
	                if (!node.visibility) {
	                    node.visibility = 'public';
	                }

	                return node;
	            }
	        },
	        'N_NAMESPACE': {
	            components: [(/(?!(?:new|use)\b)/i), {optionally: 'T_STRING'}, {oneOrMoreOf: ['T_NS_SEPARATOR', 'T_STRING']}]
	        },
	        'N_NAMESPACE_STATEMENT': {
	            oneOf: ['N_SEMICOLON_NAMESPACE_STATEMENT', 'N_BRACED_NAMESPACE_STATEMENT']
	        },
	        'N_SEMICOLON_NAMESPACE_STATEMENT': {
	            captureAs: 'N_NAMESPACE_STATEMENT',
	            components: ['T_NAMESPACE', {name: 'namespace', oneOf: ['N_NAMESPACE', 'T_STRING']}, (/;/), {name: 'statements', zeroOrMoreOf: 'N_NAMESPACE_SCOPED_STATEMENT'}]
	        },
	        'N_BRACED_NAMESPACE_STATEMENT': {
	            captureAs: 'N_NAMESPACE_STATEMENT',
	            components: ['T_NAMESPACE', {name: 'namespace', oneOf: ['N_NAMESPACE', 'T_STRING', (/()/)]}, (/\{/), {name: 'statements', zeroOrMoreOf: 'N_NAMESPACE_SCOPED_STATEMENT'}, (/\}/)]
	        },
	        'N_NAMESPACED_REFERENCE': {
	            captureAs: 'N_STRING',
	            components: {name: 'string', what: 'N_NAMESPACE'}
	        },
	        'N_NULL': {
	            allowMerge: false,
	            what: (/null\b/i)
	        },
	        'N_PROGRAM': {
	            components: [{optionally: 'T_OPEN_TAG'}, {name: 'statements', zeroOrMoreOf: 'N_STATEMENT'}, {oneOf: ['T_CLOSE_TAG', {what: '<EOF>'}]}]
	        },
	        'N_RETURN_STATEMENT': {
	            components: ['T_RETURN', {name: 'expression', optionally: 'N_EXPRESSION'}, (/;/)]
	        },
	        'N_STATEMENT': {
	            components: {oneOf: ['N_NAMESPACE_SCOPED_STATEMENT', 'N_NAMESPACE_STATEMENT']}
	        },
	        'N_NAMESPACE_SCOPED_STATEMENT': {
	            components: {oneOf: ['N_COMPOUND_STATEMENT', 'N_RETURN_STATEMENT', 'N_INLINE_HTML_STATEMENT', 'N_EMPTY_STATEMENT', 'N_ECHO_STATEMENT', 'N_BREAK_STATEMENT', 'N_CONTINUE_STATEMENT', 'N_EXPRESSION_STATEMENT', 'N_FUNCTION_STATEMENT', 'N_IF_STATEMENT', 'N_FOREACH_STATEMENT', 'N_FOR_STATEMENT', 'N_WHILE_STATEMENT', 'N_DO_WHILE_STATEMENT', 'N_CLASS_STATEMENT', 'N_INTERFACE_STATEMENT', 'N_SWITCH_STATEMENT', 'N_LABEL_STATEMENT', 'N_GOTO_STATEMENT', 'N_USE_STATEMENT', 'N_THROW_STATEMENT']}
	        },
	        'N_REQUIRE_EXPRESSION': {
	            components: ['T_REQUIRE', {name: 'path', what: 'N_EXPRESSION'}]
	        },
	        'N_REQUIRE_ONCE_EXPRESSION': {
	            components: ['T_REQUIRE_ONCE', {name: 'path', what: 'N_EXPRESSION'}]
	        },
	        'N_SELF': {
	            allowMerge: false,
	            what: /self\b(?=\s*::)/
	        },
	        'N_STATIC_INTERFACE_METHOD_DEFINITION': {
	            components: [
	                {oneOf: [
	                    [{name: 'visibility', rule: 'N_VISIBILITY'}, 'T_STATIC'],
	                    ['T_STATIC', {name: 'visibility', rule: 'N_VISIBILITY'}],
	                    'T_STATIC'
	                ]},
	                'T_FUNCTION',
	                {name: 'method', what: 'T_STRING'},
	                (/\(/),
	                {name: 'args', zeroOrMoreOf: ['N_ARGUMENT', {what: (/(,|(?=\)))()/), captureIndex: 2}]},
	                (/\)/),
	                (/;/)
	            ]            },
	        'N_STATIC_MEMBER': {
	            components: {oneOf: ['N_STATIC_VARIABLE', 'N_STATIC_VARIABLE_EXPRESSION']}
	        },
	        'N_STATIC_METHOD_DEFINITION': {
	            components: [
	                {oneOf: [
	                    [{name: 'visibility', rule: 'N_VISIBILITY'}, 'T_STATIC'],
	                    ['T_STATIC', {name: 'visibility', rule: 'N_VISIBILITY'}],
	                    'T_STATIC'
	                ]},
	                'T_FUNCTION',
	                {name: 'method', what: 'T_STRING'},
	                (/\(/),
	                {name: 'args', zeroOrMoreOf: ['N_ARGUMENT', {what: (/(,|(?=\)))()/), captureIndex: 2}]},
	                (/\)/),
	                {name: 'body', what: 'N_STATEMENT'}
	            ]
	        },
	        'N_STATIC_VARIABLE': {
	            captureAs: 'N_STRING',
	            components: {name: 'string', rule: 'T_VARIABLE'}
	        },
	        'N_STATIC_VARIABLE_EXPRESSION': {
	            oneOf: [
	                [(/\$/), 'N_VARIABLE'],
	                [(/\$\{/), 'N_EXPRESSION', (/\}/)]
	            ]
	        },
	        'N_STATIC_PROPERTY_DEFINITION': {
	            components: [
	                {oneOf: [
	                    [{name: 'visibility', rule: 'N_VISIBILITY'}, 'T_STATIC'],
	                    ['T_STATIC', {name: 'visibility', rule: 'N_VISIBILITY'}],
	                    'T_STATIC'
	                ]},
	                {name: 'variable', what: 'N_VARIABLE'}, {optionally: [(/=/), {name: 'value', what: 'N_TERM'}]}, (/;/)
	            ]
	        },
	        'N_STRING': {
	            components: {name: 'string', what: 'T_STRING'}
	        },
	        'N_STRING_EXPRESSION': {
	            components: [(/"/), {name: 'parts', oneOrMoreOf: {oneOf: ['N_STRING_VARIABLE', 'N_STRING_VARIABLE_EXPRESSION', 'N_STRING_TEXT']}}, (/"/)]
	        },
	        'N_STRING_LITERAL': {
	            components: {oneOf: [{name: 'string', what: 'T_CONSTANT_ENCAPSED_STRING'}, 'N_STRING_EXPRESSION']}
	        },
	        'N_STRING_TEXT': {
	            captureAs: 'N_STRING_LITERAL',
	            components: {name: 'string', what: (/(?:[^\\"\$]|\\[\s\S]|\$(?=\$))+/), ignoreWhitespace: false, replace: stringEscapeReplacements}
	        },
	        'N_STRING_VARIABLE': {
	            captureAs: 'N_VARIABLE',
	            components: [
	                {oneOf: [
	                    {name: 'variable', what: 'T_VARIABLE'},
	                    {name: 'variable', what: (/\$\{([a-z0-9_]+)\}/i), captureIndex: 1}
	                ]}
	            ]
	        },
	        'N_STRING_VARIABLE_EXPRESSION': {
	            captureAs: 'N_VARIABLE_EXPRESSION',
	            components: [
	                {oneOf: [
	                    {name: 'expression', what: [(/\$\{(?=\$)/), 'N_VARIABLE', (/\}/)]}
	                ]}
	            ]
	        },
	        'N_SWITCH_STATEMENT': {
	            components: ['T_SWITCH', (/\(/), {name: 'expression', what: 'N_EXPRESSION'}, (/\)/), (/\{/), {name: 'cases', zeroOrMoreOf: {oneOf: ['N_CASE', 'N_DEFAULT_CASE']}}, (/\}/)]
	        },
	        'N_TERM': {
	            components: {oneOf: ['N_VARIABLE', 'N_FLOAT', 'N_INTEGER', 'N_BOOLEAN', 'N_STRING_LITERAL', 'N_ARRAY_LITERAL', 'N_LIST', 'N_ISSET', 'N_CLOSURE', 'N_MAGIC_CONSTANT', 'N_REQUIRE_EXPRESSION', 'N_REQUIRE_ONCE_EXPRESSION', 'N_INCLUDE_EXPRESSION', 'N_SELF', 'N_NULL', 'N_NAMESPACED_REFERENCE', 'N_STRING']}
	        },
	        'N_THROW_STATEMENT': {
	            components: ['T_THROW', {name: 'expression', rule: 'N_EXPRESSION'}, (/;/)]
	        },
	        'N_USE_STATEMENT': {
	            components: ['T_USE', {name: 'uses', oneOrMoreOf: [{name: 'source', oneOf: ['N_NAMESPACE', 'T_STRING']}, {optionally: ['T_AS', {name: 'alias', what: 'T_STRING'}]}]}, (/;/)]
	        },
	        'N_VARIABLE': {
	            components: [
	                {optionally: {name: 'reference', what: (/&/)}},
	                {oneOf: [
	                    {name: 'variable', what: 'T_VARIABLE'},
	                    {name: 'variable', what: (/\$\{([a-z0-9_]+)\}/i), captureIndex: 1}
	                ]}
	            ]
	        },
	        'N_VARIABLE_EXPRESSION': {
	            components: {
	                name: 'expression',
	                rule: 'N_STATIC_VARIABLE_EXPRESSION'
	            }
	        },
	        'N_VISIBILITY': {
	            oneOf: ['T_PUBLIC', 'T_PRIVATE', 'T_PROTECTED']
	        },
	        'N_VOID': {
	            components: {name: 'value', what: (/,()/), captureIndex: 1}
	        },
	        'N_WHILE_STATEMENT': {
	            components: ['T_WHILE', (/\(/), {name: 'condition', what: 'N_EXPRESSION'}, (/\)/), (/\{/), {name: 'statements', zeroOrMoreOf: 'N_STATEMENT'}, (/\}/)]
	        }
	    },
	    start: 'N_PROGRAM'
	};


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHP-To-AST - PHP parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://uniter.github.com/phptoast/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phptoast/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    PHPParseError = __webpack_require__(20).PHPParseError;

	function ErrorHandler(stderr, state) {
	    this.state = state;
	    this.stderr = stderr;
	}

	_.extend(ErrorHandler.prototype, {
	    handle: function (parseException) {
	        var handler = this,
	            text = parseException.getText(),
	            error,
	            what;

	        if (parseException.unexpectedEndOfInput()) {
	            what = '$end';
	        } else {
	            what = '\'' + text.substr(parseException.getFurthestMatchEnd(), 1) + '\'';
	        }

	        error = new PHPParseError(PHPParseError.SYNTAX_UNEXPECTED, {
	            'file': handler.state.getPath(),
	            'line': parseException.getLineNumber(),
	            'what': what
	        });

	        if (handler.state.isMainProgram() && handler.stderr) {
	            handler.stderr.write(error.message);
	        }

	        throw error;
	    }
	});

	module.exports = ErrorHandler;


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHP-To-AST - PHP parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://uniter.github.com/phptoast/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phptoast/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function State() {
	    this.path = null;
	}

	_.extend(State.prototype, {
	    getPath: function () {
	        var path = this.path;

	        return path === null ? '(program)' : path;
	    },

	    isMainProgram: function () {
	        return this.path === null;
	    },

	    setPath: function (path) {
	        this.path = path;
	    }
	});

	module.exports = State;


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHP-To-AST - PHP parser
	 * Copyright (c) Dan Phillimore (asmblah)
	 * http://uniter.github.com/phptoast/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phptoast/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function PHPToAST(parsing, phpGrammarSpec) {
	    this.parsing = parsing;
	    this.phpGrammarSpec = phpGrammarSpec;
	}

	_.extend(PHPToAST.prototype, {
	    create: function (stderr) {
	        var lib = this;

	        return lib.parsing.create(lib.phpGrammarSpec, stderr);
	    }
	});

	module.exports = PHPToAST;


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPToJS - PHP-to-JavaScript transpiler
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phptojs
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phptojs/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var transpiler = __webpack_require__(116),
	    spec = __webpack_require__(119);

	module.exports = transpiler.create(spec);


/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Transpiler - AST-based transpiler wrapper
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/transpiler
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/transpiler/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var Library = __webpack_require__(117),
	    Transpiler = __webpack_require__(118);

	module.exports = new Library(Transpiler);


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Transpiler - AST-based transpiler wrapper
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/transpiler
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/transpiler/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function Library(Transpiler) {
	    this.Transpiler = Transpiler;
	}

	_.extend(Library.prototype, {
	    create: function (spec) {
	        return new this.Transpiler(spec);
	    }
	});

	module.exports = Library;


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Transpiler - AST-based transpiler wrapper
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/transpiler
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/transpiler/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    hasOwn = {}.hasOwnProperty;

	function Transpiler(spec) {
	    this.spec = spec;
	}

	_.extend(Transpiler.prototype, {
	    transpile: function (node, data) {
	        var transpiler = this,
	            nodeName,
	            spec = transpiler.spec;

	        if (!hasOwn.call(node, 'name')) {
	            throw new Error('Transpiler.transpile() :: Invalid AST node provided');
	        }

	        if (arguments.length === 1) {
	            data = null;
	        }

	        nodeName = node.name;

	        if (!hasOwn.call(spec.nodes, nodeName)) {
	            throw new Error('Transpiler.transpile() :: Spec does not define how to handle node "' + nodeName + '"');
	        }

	        return spec.nodes[nodeName].call(transpiler, node, function (node, newData) {
	            if (arguments.length === 1) {
	                newData = data;
	            } else if (newData && (typeof newData === 'object')) {
	                newData = _.extend({}, data, newData);
	            }

	            if (_.isString(node)) {
	                return node;
	            } else {
	                return transpiler.transpile(node, newData);
	            }
	        }, data);
	    }
	});

	module.exports = Transpiler;


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPToJS - PHP-to-JavaScript transpiler
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phptojs
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phptojs/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    BARE = 'bare',
	    RUNTIME_PATH = 'runtimePath',
	    SYNC = 'sync',
	    binaryOperatorToMethod = {
	        '+': 'add',
	        '-': 'subtract',
	        '*': 'multiply',
	        '/': 'divide',
	        '.': 'concat',
	        '<<': 'shiftLeftBy',
	        '>>': 'shiftRightBy',
	        '+=': 'incrementBy',
	        '-=': 'decrementBy',
	        '==': 'isEqualTo',
	        '!=': 'isNotEqualTo',
	        '===': 'isIdenticalTo',
	        '!==': 'isNotIdenticalTo',
	        '<': 'isLessThan',
	        '=': {
	            'false': 'setValue',
	            'true': 'setReference'
	        }
	    },
	    hasOwn = {}.hasOwnProperty,
	    unaryOperatorToMethod = {
	        prefix: {
	            '+': 'toPositive',
	            '-': 'toNegative',
	            '++': 'preIncrement',
	            '--': 'preDecrement',
	            '~': 'onesComplement',
	            '!': 'logicalNot'
	        },
	        suffix: {
	            '++': 'postIncrement',
	            '--': 'postDecrement'
	        }
	    },
	    LabelRepository = __webpack_require__(120),
	    PHPFatalError = __webpack_require__(20).PHPFatalError;

	function hoistDeclarations(statements) {
	    var declarations = [],
	        nonDeclarations = [];

	    _.each(statements, function (statement) {
	        if (/^N_(CLASS|FUNCTION)_STATEMENT$/.test(statement.name)) {
	            declarations.push(statement);
	        } else {
	            nonDeclarations.push(statement);
	        }
	    });

	    return declarations.concat(nonDeclarations);
	}

	function interpretFunction(argNodes, bindingNodes, statementNode, interpret) {
	    var args = [],
	        argumentAssignments = '',
	        bindingAssignments = '',
	        body = interpret(statementNode);

	    _.each(bindingNodes, function (bindingNode) {
	        var methodSuffix = bindingNode.reference ? 'Reference' : 'Value',
	            variableName = bindingNode.variable;

	        bindingAssignments += 'scope.getVariable("' + variableName + '").set' + methodSuffix + '(parentScope.getVariable("' + variableName + '").get' + methodSuffix + '());';
	    });

	    // Copy passed values for any arguments
	    _.each(argNodes, function (argNode, index) {
	        var valueCode = '$',
	            variable;

	        if (argNode.name === 'N_ARGUMENT') {
	            variable = argNode.variable.variable;
	            valueCode += variable;

	            if (argNode.value) {
	                valueCode += ' || ' + interpret(argNode.value);
	            }
	        } else {
	            variable = argNode.variable;
	            valueCode += variable;

	            if (!argNode.reference) {
	                valueCode += '.getValue()';
	            }
	        }

	        if (argNode.reference) {
	            argumentAssignments += 'scope.getVariable("' + variable + '").setReference(' + valueCode + '.getReference());';
	        } else {
	            argumentAssignments += 'scope.getVariable("' + variable + '").setValue(' + valueCode + ');';
	        }

	        args[index] = '$' + variable;
	    });

	    // Prepend parts in correct order
	    body = argumentAssignments + bindingAssignments + body;

	    // Add scope handling logic
	    body = 'var scope = tools.pushCall(this, currentClass).getScope(); try { ' + body + ' } finally { tools.popCall(); }';

	    // Build function expression
	    body = 'function (' + args.join(', ') + ') {' + body + '}';

	    if (bindingNodes && bindingNodes.length > 0) {
	        body = '(function (parentScope) { return ' + body + '; }(scope))';
	    }

	    return body;
	}

	function processBlock(statements, interpret, context) {
	    var code = '',
	        labelRepository = context.labelRepository,
	        statementDatas = [];

	    _.each(statements, function (statement) {
	        var labels = {},
	            gotos = {},
	            statementCode;

	        function onPendingLabel(label) {
	            gotos[label] = true;
	        }

	        function onFoundLabel(label) {
	            labels[label] = true;
	        }

	        labelRepository.on('pending label', onPendingLabel);
	        labelRepository.on('found label', onFoundLabel);

	        statementCode = interpret(statement, context);
	        labelRepository.off('pending label', onPendingLabel);
	        labelRepository.off('found label', onFoundLabel);

	        statementDatas.push({
	            code: statementCode,
	            gotos: gotos,
	            labels: labels,
	            prefix: '',
	            suffix: ''
	        });
	    });

	    _.each(statementDatas, function (statementData, index) {
	        if (index > 0) {
	            _.each(Object.keys(statementData.labels), function (label) {
	                statementDatas[0].prefix = 'if (!' + 'goingToLabel_' + label + ') {' + statementDatas[0].prefix;
	                statementData.prefix = '}' + statementData.prefix;
	            });
	        }
	    });

	    _.each(statementDatas, function (statementData, statementIndex) {
	        _.each(Object.keys(statementData.gotos), function (label) {
	            if (!hasOwn.call(statementData.labels, label)) {
	                // This is a goto to a label in another statement: find the statement containing the label
	                _.each(statementDatas, function (otherStatementData, otherStatementIndex) {
	                    if (otherStatementData !== statementData) {
	                        if (hasOwn.call(otherStatementData.labels, label)) {
	                            // We have found the label we are trying to jump to
	                            if (otherStatementIndex > statementIndex) {
	                                // The label is after the goto (forward jump)
	                                statementData.prefix = label + ': {' + statementData.prefix;
	                                otherStatementData.prefix = '}' + otherStatementData.prefix;
	                            } else {
	                                // The goto is after the label (backward jump)
	                                otherStatementData.prefix += 'continue_' + label + ': do {';
	                                statementData.suffix += '} while (goingToLabel_' + label + ');';
	                            }
	                        }
	                    }
	                });
	            }
	        });
	    });

	    _.each(statementDatas, function (statementData) {
	        code += statementData.prefix + statementData.code + statementData.suffix;
	    });

	    return code;
	}

	module.exports = {
	    nodes: {
	        'N_ARRAY_CAST': function (node, interpret) {
	            return interpret(node.value, {getValue: true}) + '.coerceToArray()';
	        },
	        'N_ARRAY_INDEX': function (node, interpret, context) {
	            var arrayVariableCode,
	                indexValues = [],
	                suffix = '';

	            if (node.indices !== true) {
	                _.each(node.indices, function (index) {
	                    indexValues.push(interpret(index.index, {assignment: false, getValue: true}));
	                });
	            }

	            if (context.assignment) {
	                arrayVariableCode = 'tools.implyArray(' + interpret(node.array, {getValue: false}) + ')';
	            } else {
	                suffix = '.getValue()';
	                arrayVariableCode = interpret(node.array, {getValue: true});
	            }

	            if (indexValues.length > 0) {
	                if (context.assignment) {
	                    _.each(indexValues.slice(0, -1), function () {
	                        arrayVariableCode = 'tools.implyArray(' + arrayVariableCode;
	                    });

	                    return arrayVariableCode + '.getElementByKey(' + indexValues.join(')).getElementByKey(') + ')' + suffix;
	                }

	                return arrayVariableCode + '.getElementByKey(' + indexValues.join(').getValue().getElementByKey(') + ')' + suffix;
	            }

	            return arrayVariableCode + '.getElementByKey(tools.valueFactory.createInteger(' + arrayVariableCode + '.getLength()))' + suffix;
	        },
	        'N_ARRAY_LITERAL': function (node, interpret) {
	            var elementValues = [];

	            _.each(node.elements, function (element) {
	                elementValues.push(interpret(element));
	            });

	            return 'tools.valueFactory.createArray([' + elementValues.join(', ') + '])';
	        },
	        'N_BOOLEAN': function (node) {
	            return 'tools.valueFactory.createBoolean(' + node.bool + ')';
	        },
	        'N_BREAK_STATEMENT': function (node, interpret, context) {
	            return 'break switch_' + (context.switchCase.depth - (node.levels.number - 1)) + ';';
	        },
	        'N_CASE': function (node, interpret, context) {
	            var body = '';

	            _.each(node.body, function (statement) {
	                body += interpret(statement);
	            });

	            return 'if (switchMatched_' + context.switchCase.depth + ' || switchExpression_' + context.switchCase.depth + '.isEqualTo(' + interpret(node.expression) + ').getNative()) {switchMatched_' + context.switchCase.depth + ' = true; ' + body + '}';
	        },
	        'N_CLASS_CONSTANT': function (node, interpret) {
	            return interpret(node.className, {getValue: true, allowBareword: true}) + '.getConstantByName(' + JSON.stringify(node.constant) + ', namespaceScope)';
	        },
	        'N_CLASS_STATEMENT': function (node, interpret) {
	            var code,
	                constantCodes = [],
	                methodCodes = [],
	                propertyCodes = [],
	                staticPropertyCodes = [],
	                superClass = node.extend ? 'namespaceScope.getClass(' + JSON.stringify(node.extend) + ')' : 'null',
	                interfaces = JSON.stringify(node.implement || []);

	            _.each(node.members, function (member) {
	                var data = interpret(member, {inClass: true});

	                if (member.name === 'N_INSTANCE_PROPERTY_DEFINITION') {
	                    propertyCodes.push('"' + data.name + '": ' + data.value);
	                } else if (member.name === 'N_STATIC_PROPERTY_DEFINITION') {
	                    staticPropertyCodes.push('"' + data.name + '": {visibility: ' + data.visibility + ', value: ' + data.value + '}');
	                } else if (member.name === 'N_METHOD_DEFINITION' || member.name === 'N_STATIC_METHOD_DEFINITION') {
	                    methodCodes.push('"' + data.name + '": ' + data.body);
	                } else if (member.name === 'N_CONSTANT_DEFINITION') {
	                    constantCodes.push('"' + data.name + '": ' + data.value);
	                }
	            });

	            code = '{superClass: ' + superClass + ', interfaces: ' + interfaces + ', staticProperties: {' + staticPropertyCodes.join(', ') + '}, properties: {' + propertyCodes.join(', ') + '}, methods: {' + methodCodes.join(', ') + '}, constants: {' + constantCodes.join(', ') + '}}';

	            return '(function () {var currentClass = namespace.defineClass(' + JSON.stringify(node.className) + ', ' + code + ', namespaceScope);}());';
	        },
	        'N_CLOSURE': function (node, interpret) {
	            var func = interpretFunction(node.args, node.bindings, node.body, interpret);

	            return 'tools.createClosure(' + func + ', scope)';
	        },
	        'N_COMMA_EXPRESSION': function (node, interpret) {
	            var expressionCodes = [];

	            _.each(node.expressions, function (expression) {
	                expressionCodes.push(interpret(expression));
	            });

	            return expressionCodes.join(',');
	        },
	        'N_COMPOUND_STATEMENT': function (node, interpret, context) {
	            return processBlock(node.statements, interpret, context);
	        },
	        'N_CONSTANT_DEFINITION': function (node, interpret) {
	            return {
	                name: node.constant,
	                value: 'function () { return ' + (node.value ? interpret(node.value) : 'null') + '; }'
	            };
	        },
	        'N_CONTINUE_STATEMENT': function (node, interpret, context) {
	            return 'break switch_' + (context.switchCase.depth - (node.levels.number - 1)) + ';';
	        },
	        'N_DEFAULT_CASE': function (node, interpret, context) {
	            var body = '';

	            _.each(node.body, function (statement) {
	                body += interpret(statement);
	            });

	            return 'if (!switchMatched_' + context.switchCase.depth + ') {switchMatched_' + context.switchCase.depth + ' = true; ' + body + '}';
	        },
	        'N_DO_WHILE_STATEMENT': function (node, interpret/*, context*/) {
	            var code = interpret(node.body);

	            return 'do {' + code + '} while (' + interpret(node.condition) + '.coerceToBoolean().getNative());';
	        },
	        'N_ECHO_STATEMENT': function (node, interpret) {
	            return 'stdout.write(' + interpret(node.expression) + '.coerceToString().getNative());';
	        },
	        'N_EXPRESSION': function (node, interpret) {
	            var isAssignment = /^[+-]?=$/.test(node.right[0].operator),
	                expressionEnd = '',
	                expressionStart = interpret(node.left, {assignment: isAssignment, getValue: !isAssignment});

	            _.each(node.right, function (operation, index) {
	                var getValueIfApplicable,
	                    isReference = false,
	                    method,
	                    rightOperand,
	                    valuePostProcess = '';

	                if (isAssignment && operation.operand.reference) {
	                    isReference = true;
	                    valuePostProcess = '.getReference()';
	                }

	                getValueIfApplicable = (!isAssignment || index === node.right.length - 1) && !isReference;

	                rightOperand = interpret(operation.operand, {getValue: getValueIfApplicable});

	                if (operation.operator === '&&') {
	                    expressionStart = 'tools.valueFactory.createBoolean(' +
	                        expressionStart +
	                        '.coerceToBoolean().getNative() && (' +
	                        rightOperand +
	                        valuePostProcess +
	                        '.coerceToBoolean().getNative()';
	                    expressionEnd += '))';
	                } else {
	                    method = binaryOperatorToMethod[operation.operator];

	                    if (!method) {
	                        throw new Error('Unsupported binary operator "' + operation.operator + '"');
	                    }

	                    if (_.isPlainObject(method)) {
	                        method = method[isReference];
	                    }

	                    expressionStart += '.' + method + '(' + rightOperand + valuePostProcess;
	                    expressionEnd += ')';
	                }
	            });

	            return expressionStart + expressionEnd;
	        },
	        'N_EXPRESSION_STATEMENT': function (node, interpret) {
	            return interpret(node.expression) + ';';
	        },
	        'N_FLOAT': function (node) {
	            return 'tools.valueFactory.createFloat(' + node.number + ')';
	        },
	        'N_FOR_STATEMENT': function (node, interpret) {
	            var bodyCode = interpret(node.body),
	                conditionCode = interpret(node.condition),
	                initializerCode = interpret(node.initializer),
	                updateCode = interpret(node.update);

	            if (conditionCode) {
	                conditionCode += '.coerceToBoolean().getNative()';
	            }

	            return 'for (' + initializerCode + ';' + conditionCode + ';' + updateCode + ') {' + bodyCode + '}';
	        },
	        'N_FOREACH_STATEMENT': function (node, interpret, context) {
	            var arrayValue = interpret(node.array),
	                arrayVariable,
	                code = '',
	                key = node.key ? interpret(node.key, {getValue: false}) : null,
	                lengthVariable,
	                pointerVariable,
	                value = interpret(node.value, {getValue: false});

	            if (!context.foreach) {
	                context.foreach = {
	                    depth: 0
	                };
	            } else {
	                context.foreach.depth++;
	            }

	            arrayVariable = 'array_' + context.foreach.depth;

	            // Cache the value being iterated over and reset the internal array pointer before the loop
	            code += 'var ' + arrayVariable + ' = ' + arrayValue + '.reset();';

	            lengthVariable = 'length_' + context.foreach.depth;
	            code += 'var ' + lengthVariable + ' = ' + arrayVariable + '.getLength();';
	            pointerVariable = 'pointer_' + context.foreach.depth;
	            code += 'var ' + pointerVariable + ' = 0;';

	            // Loop management
	            code += 'while (' + pointerVariable + ' < ' + lengthVariable + ') {';

	            if (key) {
	                // Iterator key variable (if specified)
	                code += key + '.setValue(' + arrayVariable + '.getKeyByIndex(' + pointerVariable + '));';
	            }

	            // Iterator value variable
	            code += value + '.set' + (node.value.reference ? 'Reference' : 'Value') + '(' + arrayVariable + '.getElementByIndex(' + pointerVariable + ')' + (node.value.reference ? '' : '.getValue()') + ');';

	            // Set pointer to next element at start of loop body as per spec
	            code += pointerVariable + '++;';

	            code += interpret(node.body);

	            code += '}';

	            return code;
	        },
	        'N_FUNCTION_STATEMENT': function (node, interpret, context) {
	            var func;

	            context.labelRepository = new LabelRepository();

	            func = interpretFunction(node.args, null, node.body, interpret);

	            return 'namespace.defineFunction(' + JSON.stringify(node.func) + ', ' + func + ');';
	        },
	        'N_FUNCTION_CALL': function (node, interpret) {
	            var args = [];

	            _.each(node.args, function (arg) {
	                args.push(interpret(arg, {getValue: false}));
	            });

	            return '(' + interpret(node.func, {getValue: true, allowBareword: true}) + '.call([' + args.join(', ') + '], namespaceScope) || tools.valueFactory.createNull())';
	        },
	        'N_GOTO_STATEMENT': function (node, interpret, context) {
	            var code = '',
	                label = node.label;

	            context.labelRepository.addPending(label);

	            code += 'goingToLabel_' + label + ' = true;';

	            if (context.labelRepository.hasBeenFound(label)) {
	                code += ' continue continue_' + label + ';';
	            } else {
	                code += ' break ' + label + ';';
	            }

	            return code;
	        },
	        'N_IF_STATEMENT': function (node, interpret, context) {
	            // Consequent statements are executed if the condition is truthy,
	            // Alternate statements are executed if the condition is falsy
	            var alternateCode,
	                code = '',
	                conditionCode = interpret(node.condition) + '.coerceToBoolean().getNative()',
	                consequentCode,
	                consequentPrefix = '',
	                gotosJumpingIn = {},
	                labelRepository = context.labelRepository;

	            function onPendingLabel(label) {
	                delete gotosJumpingIn[label];
	            }

	            function onFoundLabel(label) {
	                gotosJumpingIn[label] = true;
	            }

	            labelRepository.on('pending label', onPendingLabel);
	            labelRepository.on('found label', onFoundLabel);

	            consequentCode = interpret(node.consequentStatement);
	            labelRepository.off('pending label', onPendingLabel);
	            labelRepository.off('found label', onFoundLabel);

	            _.each(Object.keys(gotosJumpingIn), function (label) {
	                conditionCode = 'goingToLabel_' + label + ' || (' + conditionCode + ')';
	            });

	            consequentCode = '{' + consequentPrefix + consequentCode + '}';

	            alternateCode = node.alternateStatement ? ' else ' + interpret(node.alternateStatement) : '';

	            code += 'if (' + conditionCode + ') ' + consequentCode + alternateCode;

	            return code;
	        },
	        'N_INCLUDE_EXPRESSION': function (node, interpret) {
	            return 'tools.include(' + interpret(node.path) + '.getNative())';
	        },
	        'N_INLINE_HTML_STATEMENT': function (node) {
	            return 'stdout.write(' + JSON.stringify(node.html) + ');';
	        },
	        'N_INSTANCE_PROPERTY_DEFINITION': function (node, interpret) {
	            return {
	                name: node.variable.variable,
	                value: node.value ? interpret(node.value) : 'null'
	            };
	        },
	        'N_INTEGER': function (node) {
	            return 'tools.valueFactory.createInteger(' + node.number + ')';
	        },
	        'N_INTERFACE_METHOD_DEFINITION': function (node, interpret) {
	            return {
	                name: interpret(node.func),
	                body: '{isStatic: false, abstract: true}'
	            };
	        },
	        'N_INTERFACE_STATEMENT': function (node, interpret) {
	            var code,
	                constantCodes = [],
	                methodCodes = [],
	                superClass = node.extend ? 'namespaceScope.getClass(' + JSON.stringify(node.extend) + ')' : 'null';

	            _.each(node.members, function (member) {
	                var data = interpret(member, {inClass: true});

	                if (member.name === 'N_INSTANCE_PROPERTY_DEFINITION' || member.name === 'N_STATIC_PROPERTY_DEFINITION') {
	                    throw new PHPFatalError(PHPFatalError.INTERFACE_PROPERTY_NOT_ALLOWED);
	                } else if (member.name === 'N_METHOD_DEFINITION' || member.name === 'N_STATIC_METHOD_DEFINITION') {
	                    throw new PHPFatalError(PHPFatalError.INTERFACE_METHOD_BODY_NOT_ALLOWED, {
	                        className: node.interfaceName,
	                        methodName: member.func || member.method
	                    });
	                } else if (member.name === 'N_INTERFACE_METHOD_DEFINITION' || member.name === 'N_STATIC_INTERFACE_METHOD_DEFINITION') {
	                    methodCodes.push('"' + data.name + '": ' + data.body);
	                } else if (member.name === 'N_CONSTANT_DEFINITION') {
	                    constantCodes.push('"' + data.name + '": ' + data.value);
	                }
	            });

	            code = '{superClass: ' + superClass + ', staticProperties: {}, properties: {}, methods: {' + methodCodes.join(', ') + '}, constants: {' + constantCodes.join(', ') + '}}';

	            return '(function () {var currentClass = namespace.defineClass(' + JSON.stringify(node.interfaceName) + ', ' + code + ', namespaceScope);}());';
	        },
	        'N_INTERFACE_STATIC_METHOD_DEFINITION': function (node, interpret) {
	            return {
	                name: interpret(node.func),
	                body: '{isStatic: false, abstract: true}'
	            };
	        },
	        'N_ISSET': function (node, interpret) {
	            var issets = [];

	            _.each(node.variables, function (variable) {
	                issets.push(interpret(variable, {getValue: false}) + '.isSet()');
	            });

	            return '(function (scope) {scope.suppressErrors();' +
	                'var result = tools.valueFactory.createBoolean(' + issets.join(' && ') + ');' +
	                'scope.unsuppressErrors(); return result;}(scope))';
	        },
	        'N_KEY_VALUE_PAIR': function (node, interpret) {
	            return 'tools.createKeyValuePair(' + interpret(node.key) + ', ' + interpret(node.value) + ')';
	        },
	        'N_LABEL_STATEMENT': function (node, interpret, context) {
	            var label = node.label;

	            context.labelRepository.found(label);

	            return '';
	        },
	        'N_LIST': function (node, interpret) {
	            var elementsCodes = [];

	            _.each(node.elements, function (element) {
	                elementsCodes.push(interpret(element, {getValue: false}));
	            });

	            return 'tools.createList([' + elementsCodes.join(',') + '])';
	        },
	        'N_MAGIC_DIR_CONSTANT': function () {
	            return 'tools.getPathDirectory()';
	        },
	        'N_MAGIC_FILE_CONSTANT': function () {
	            return 'tools.getPath()';
	        },
	        'N_MAGIC_LINE_CONSTANT': function (node) {
	            return 'tools.valueFactory.createInteger(' + node.offset.line + ')';
	        },
	        'N_METHOD_CALL': function (node, interpret) {
	            var code = '';

	            _.each(node.calls, function (call) {
	                var args = [];

	                _.each(call.args, function (arg) {
	                    args.push(interpret(arg));
	                });

	                code += '.callMethod(' + interpret(call.func, {allowBareword: true}) + '.getNative(), [' + args.join(', ') + '])';
	            });

	            return interpret(node.object, {getValue: true}) + code;
	        },
	        'N_METHOD_DEFINITION': function (node, interpret) {
	            return {
	                name: interpret(node.func),
	                body: '{isStatic: false, method: ' + interpretFunction(node.args, null, node.body, interpret) + '}'
	            };
	        },
	        'N_NAMESPACE_STATEMENT': function (node, interpret) {
	            var body = '';

	            _.each(hoistDeclarations(node.statements), function (statement) {
	                body += interpret(statement);
	            });

	            if (node.namespace === '') {
	                // Global namespace
	                return body;
	            }

	            return 'if (namespaceResult = (function (globalNamespace) {var namespace = globalNamespace.getDescendant(' + JSON.stringify(node.namespace) + '), namespaceScope = tools.createNamespaceScope(namespace);' + body + '}(namespace))) { return namespaceResult; }';
	        },
	        'N_NEW_EXPRESSION': function (node, interpret) {
	            var args = [];

	            _.each(node.args, function (arg) {
	                args.push(interpret(arg));
	            });

	            return 'tools.createInstance(namespaceScope, ' + interpret(node.className, {allowBareword: true}) + ', [' + args.join(', ') + '])';
	        },
	        'N_NULL': function () {
	            return 'tools.valueFactory.createNull()';
	        },
	        'N_OBJECT_PROPERTY': function (node, interpret, context) {
	            var objectVariableCode,
	                propertyCode = '',
	                suffix = '';

	            if (context.assignment) {
	                objectVariableCode = 'tools.implyObject(' + interpret(node.object, {getValue: false}) + ')';
	            } else {
	                suffix = '.getValue()';
	                objectVariableCode = interpret(node.object, {getValue: true});
	            }

	            _.each(node.properties, function (property, index) {
	                var nameValue = interpret(property.property, {assignment: false, getValue: false, allowBareword: true});

	                propertyCode += '.getInstancePropertyByName(' + nameValue + ')';

	                if (index < node.properties.length - 1) {
	                    propertyCode += '.getValue()';
	                }
	            });

	            return objectVariableCode + propertyCode + suffix;
	        },
	        'N_PRINT_EXPRESSION': function (node, interpret) {
	            return '(stdout.write(' + interpret(node.operand, {getValue: true}) + '.coerceToString().getNative()), tools.valueFactory.createInteger(1))';
	        },
	        'N_PROGRAM': function (node, interpret, options) {
	            var body = '',
	                context = {
	                    labelRepository: new LabelRepository()
	                },
	                labels,
	                name;

	            options = _.extend({
	                'runtimePath': 'phpruntime'
	            }, options);

	            name = options[RUNTIME_PATH];

	            // Optional synchronous mode
	            if (options[SYNC]) {
	                name += '/sync';
	            }

	            body += processBlock(hoistDeclarations(node.statements), interpret, context);

	            labels = context.labelRepository.getLabels();

	            if (labels.length > 0) {
	                body = 'var goingToLabel_' + labels.join(' = false, goingToLabel_') + ' = false;' + body;
	            }

	            body = 'var namespaceScope = tools.createNamespaceScope(namespace), namespaceResult, scope = tools.globalScope, currentClass = null;' + body;

	            // Program returns null rather than undefined if nothing is returned
	            body += 'return tools.valueFactory.createNull();';

	            // Wrap program in function for passing to runtime
	            body = 'function (stdin, stdout, stderr, tools, namespace) {' + body + '}';

	            if (options[BARE] !== true) {
	                body = 'require(\'' + name + '\').compile(' + body + ');';
	            }

	            return body;
	        },
	        'N_REQUIRE_EXPRESSION': function (node, interpret) {
	            return 'tools.require(' + interpret(node.path) + '.getNative())';
	        },
	        'N_REQUIRE_ONCE_EXPRESSION': function (node, interpret) {
	            return 'tools.requireOnce(' + interpret(node.path) + '.getNative())';
	        },
	        'N_RETURN_STATEMENT': function (node, interpret) {
	            var expression = interpret(node.expression);

	            return 'return ' + (expression ? expression : 'tools.valueFactory.createNull()') + ';';
	        },
	        'N_SELF': function (node, interpret, context) {
	            if (context.inClass) {
	                return 'tools.valueFactory.createString(currentClass.getUnprefixedName())';
	            }

	            return 'tools.throwNoActiveClassScope()';
	        },
	        'N_STATIC_METHOD_CALL': function (node, interpret) {
	            var args = [];

	            _.each(node.args, function (arg) {
	                args.push(interpret(arg));
	            });

	            return interpret(node.className, {allowBareword: true}) + '.callStaticMethod(' + interpret(node.method, {allowBareword: true}) + ', [' + args.join(', ') + '], namespaceScope)';
	        },
	        'N_STATIC_METHOD_DEFINITION': function (node, interpret) {
	            return {
	                name: interpret(node.method),
	                body: '{isStatic: true, method: ' + interpretFunction(node.args, null, node.body, interpret) + '}'
	            };
	        },
	        'N_STATIC_PROPERTY': function (node, interpret, context) {
	            var classVariableCode = interpret(node.className, {getValue: true, allowBareword: true}),
	                propertyCode = '.getStaticPropertyByName(' + interpret(node.property, {assignment: false, getValue: true, allowBareword: true}) + ', namespaceScope)',
	                suffix = '';

	            if (!context.assignment) {
	                suffix = '.getValue()';
	            }

	            return classVariableCode + propertyCode + suffix;
	        },
	        'N_STATIC_PROPERTY_DEFINITION': function (node, interpret) {
	            return {
	                name: node.variable.variable,
	                visibility: JSON.stringify(node.visibility),
	                value: node.value ? interpret(node.value) : 'tools.valueFactory.createNull()'
	            };
	        },
	        'N_STRING': function (node, interpret, context) {
	            if (context.allowBareword) {
	                return 'tools.valueFactory.createBarewordString(' + JSON.stringify(node.string) + ')';
	            }

	            return 'namespaceScope.getConstant(' + JSON.stringify(node.string) + ')';
	        },
	        'N_STRING_EXPRESSION': function (node, interpret) {
	            var codes = [];

	            _.each(node.parts, function (part) {
	                codes.push(interpret(part) + '.coerceToString().getNative()');
	            });

	            return 'tools.valueFactory.createString(' + codes.join(' + ') + ')';
	        },
	        'N_STRING_LITERAL': function (node) {
	            return 'tools.valueFactory.createString(' + JSON.stringify(node.string) + ')';
	        },
	        'N_SWITCH_STATEMENT': function (node, interpret, context) {
	            var code = '',
	                expressionCode = interpret(node.expression),
	                switchCase = {
	                    depth: context.switchCase ? context.switchCase.depth + 1 : 0
	                },
	                subContext = {
	                    switchCase: switchCase
	                };

	            code += 'var switchExpression_' + switchCase.depth + ' = ' + expressionCode + ',' +
	                ' switchMatched_' + switchCase.depth + ' = false;';

	            _.each(node.cases, function (caseNode) {
	                code += interpret(caseNode, subContext);
	            });

	            return 'switch_' + switchCase.depth + ': {' + code + '}';
	        },
	        'N_TERNARY': function (node, interpret) {
	            var expression = '(' + interpret(node.condition) + ')';

	            _.each(node.options, function (option) {
	                expression = '(' + expression + '.coerceToBoolean().getNative() ? ' + interpret(option.consequent) + ' : ' + interpret(option.alternate) + ')';
	            });

	            return expression;
	        },
	        'N_THROW_STATEMENT': function (node, interpret) {
	            return 'throw ' + interpret(node.expression) + ';';
	        },
	        'N_UNARY_EXPRESSION': function (node, interpret) {
	            var operator = node.operator,
	                operand = interpret(node.operand, {getValue: operator !== '++' && operator !== '--'});

	            return operand + '.' + unaryOperatorToMethod[node.prefix ? 'prefix' : 'suffix'][operator] + '()';
	        },
	        'N_USE_STATEMENT': function (node) {
	            var code = '';

	            _.each(node.uses, function (use) {
	                if (use.alias) {
	                    code += 'namespaceScope.use(' + JSON.stringify(use.source) + ', ' + JSON.stringify(use.alias) + ');';
	                } else {
	                    code += 'namespaceScope.use(' + JSON.stringify(use.source) + ');';
	                }
	            });

	            return code;
	        },
	        'N_VARIABLE': function (node, interpret, context) {
	            return 'scope.getVariable("' + node.variable + '")' + (context.getValue !== false ? '.getValue()' : '');
	        },
	        'N_VARIABLE_EXPRESSION': function (node, interpret, context) {
	            return 'scope.getVariable(' + interpret(node.expression) + '.getNative())' + (context.getValue !== false ? '.getValue()' : '');
	        },
	        'N_VOID': function () {
	            return 'tools.referenceFactory.createNull()';
	        },
	        'N_WHILE_STATEMENT': function (node, interpret, context) {
	            var code = '';

	            context.labelRepository.on('found label', function () {
	                throw new PHPFatalError(PHPFatalError.GOTO_DISALLOWED);
	            });

	            _.each(node.statements, function (statement) {
	                code += interpret(statement);
	            });

	            return 'while (' + interpret(node.condition) + '.coerceToBoolean().getNative()) {' + code + '}';
	        }
	    }
	};


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPToJS - PHP-to-JavaScript transpiler
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phptojs
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phptojs/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    util = __webpack_require__(22),
	    EventEmitter = __webpack_require__(121).EventEmitter;

	function LabelRepository() {
	    EventEmitter.call(this);

	    this.foundLabels = {};
	    this.labels = {};
	    this.pendingLabels = {};
	}

	util.inherits(LabelRepository, EventEmitter);

	_.extend(LabelRepository.prototype, {
	    addPending: function (label) {
	        var repository = this;

	        repository.labels[label] = true;
	        repository.pendingLabels[label] = true;
	        repository.emit('pending label', label);
	    },

	    found: function (label) {
	        var repository = this;

	        repository.foundLabels[label] = true;
	        repository.labels[label] = true;
	        delete repository.pendingLabels[label];
	        repository.emit('found label', label);
	    },

	    getLabels: function () {
	        return Object.keys(this.labels);
	    },

	    hasBeenFound: function (label) {
	        var repository = this;

	        return repository.foundLabels[label] === true;
	    },

	    hasPending: function () {
	        return Object.keys(this.pendingLabels).length > 0;
	    },

	    isPending: function (label) {
	        return this.pendingLabels[label] === true;
	    },

	    off: function (name, listener) {
	        this.removeListener(name, listener);
	    }
	});

	module.exports = LabelRepository;


/***/ },
/* 121 */
/***/ function(module, exports) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.

	function EventEmitter() {
	  this._events = this._events || {};
	  this._maxListeners = this._maxListeners || undefined;
	}
	module.exports = EventEmitter;

	// Backwards-compat with node 0.10.x
	EventEmitter.EventEmitter = EventEmitter;

	EventEmitter.prototype._events = undefined;
	EventEmitter.prototype._maxListeners = undefined;

	// By default EventEmitters will print a warning if more than 10 listeners are
	// added to it. This is a useful default which helps finding memory leaks.
	EventEmitter.defaultMaxListeners = 10;

	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.
	EventEmitter.prototype.setMaxListeners = function(n) {
	  if (!isNumber(n) || n < 0 || isNaN(n))
	    throw TypeError('n must be a positive number');
	  this._maxListeners = n;
	  return this;
	};

	EventEmitter.prototype.emit = function(type) {
	  var er, handler, len, args, i, listeners;

	  if (!this._events)
	    this._events = {};

	  // If there is no 'error' event listener then throw.
	  if (type === 'error') {
	    if (!this._events.error ||
	        (isObject(this._events.error) && !this._events.error.length)) {
	      er = arguments[1];
	      if (er instanceof Error) {
	        throw er; // Unhandled 'error' event
	      }
	      throw TypeError('Uncaught, unspecified "error" event.');
	    }
	  }

	  handler = this._events[type];

	  if (isUndefined(handler))
	    return false;

	  if (isFunction(handler)) {
	    switch (arguments.length) {
	      // fast cases
	      case 1:
	        handler.call(this);
	        break;
	      case 2:
	        handler.call(this, arguments[1]);
	        break;
	      case 3:
	        handler.call(this, arguments[1], arguments[2]);
	        break;
	      // slower
	      default:
	        args = Array.prototype.slice.call(arguments, 1);
	        handler.apply(this, args);
	    }
	  } else if (isObject(handler)) {
	    args = Array.prototype.slice.call(arguments, 1);
	    listeners = handler.slice();
	    len = listeners.length;
	    for (i = 0; i < len; i++)
	      listeners[i].apply(this, args);
	  }

	  return true;
	};

	EventEmitter.prototype.addListener = function(type, listener) {
	  var m;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events)
	    this._events = {};

	  // To avoid recursion in the case that type === "newListener"! Before
	  // adding it to the listeners, first emit "newListener".
	  if (this._events.newListener)
	    this.emit('newListener', type,
	              isFunction(listener.listener) ?
	              listener.listener : listener);

	  if (!this._events[type])
	    // Optimize the case of one listener. Don't need the extra array object.
	    this._events[type] = listener;
	  else if (isObject(this._events[type]))
	    // If we've already got an array, just append.
	    this._events[type].push(listener);
	  else
	    // Adding the second element, need to change to array.
	    this._events[type] = [this._events[type], listener];

	  // Check for listener leak
	  if (isObject(this._events[type]) && !this._events[type].warned) {
	    if (!isUndefined(this._maxListeners)) {
	      m = this._maxListeners;
	    } else {
	      m = EventEmitter.defaultMaxListeners;
	    }

	    if (m && m > 0 && this._events[type].length > m) {
	      this._events[type].warned = true;
	      console.error('(node) warning: possible EventEmitter memory ' +
	                    'leak detected. %d listeners added. ' +
	                    'Use emitter.setMaxListeners() to increase limit.',
	                    this._events[type].length);
	      if (typeof console.trace === 'function') {
	        // not supported in IE 10
	        console.trace();
	      }
	    }
	  }

	  return this;
	};

	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

	EventEmitter.prototype.once = function(type, listener) {
	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  var fired = false;

	  function g() {
	    this.removeListener(type, g);

	    if (!fired) {
	      fired = true;
	      listener.apply(this, arguments);
	    }
	  }

	  g.listener = listener;
	  this.on(type, g);

	  return this;
	};

	// emits a 'removeListener' event iff the listener was removed
	EventEmitter.prototype.removeListener = function(type, listener) {
	  var list, position, length, i;

	  if (!isFunction(listener))
	    throw TypeError('listener must be a function');

	  if (!this._events || !this._events[type])
	    return this;

	  list = this._events[type];
	  length = list.length;
	  position = -1;

	  if (list === listener ||
	      (isFunction(list.listener) && list.listener === listener)) {
	    delete this._events[type];
	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);

	  } else if (isObject(list)) {
	    for (i = length; i-- > 0;) {
	      if (list[i] === listener ||
	          (list[i].listener && list[i].listener === listener)) {
	        position = i;
	        break;
	      }
	    }

	    if (position < 0)
	      return this;

	    if (list.length === 1) {
	      list.length = 0;
	      delete this._events[type];
	    } else {
	      list.splice(position, 1);
	    }

	    if (this._events.removeListener)
	      this.emit('removeListener', type, listener);
	  }

	  return this;
	};

	EventEmitter.prototype.removeAllListeners = function(type) {
	  var key, listeners;

	  if (!this._events)
	    return this;

	  // not listening for removeListener, no need to emit
	  if (!this._events.removeListener) {
	    if (arguments.length === 0)
	      this._events = {};
	    else if (this._events[type])
	      delete this._events[type];
	    return this;
	  }

	  // emit removeListener for all listeners on all events
	  if (arguments.length === 0) {
	    for (key in this._events) {
	      if (key === 'removeListener') continue;
	      this.removeAllListeners(key);
	    }
	    this.removeAllListeners('removeListener');
	    this._events = {};
	    return this;
	  }

	  listeners = this._events[type];

	  if (isFunction(listeners)) {
	    this.removeListener(type, listeners);
	  } else if (listeners) {
	    // LIFO order
	    while (listeners.length)
	      this.removeListener(type, listeners[listeners.length - 1]);
	  }
	  delete this._events[type];

	  return this;
	};

	EventEmitter.prototype.listeners = function(type) {
	  var ret;
	  if (!this._events || !this._events[type])
	    ret = [];
	  else if (isFunction(this._events[type]))
	    ret = [this._events[type]];
	  else
	    ret = this._events[type].slice();
	  return ret;
	};

	EventEmitter.prototype.listenerCount = function(type) {
	  if (this._events) {
	    var evlistener = this._events[type];

	    if (isFunction(evlistener))
	      return 1;
	    else if (evlistener)
	      return evlistener.length;
	  }
	  return 0;
	};

	EventEmitter.listenerCount = function(emitter, type) {
	  return emitter.listenerCount(type);
	};

	function isFunction(arg) {
	  return typeof arg === 'function';
	}

	function isNumber(arg) {
	  return typeof arg === 'number';
	}

	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}

	function isUndefined(arg) {
	  return arg === void 0;
	}


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    INCLUDE_OPTION = 'include',
	    PATH = 'path',
	    pauser = __webpack_require__(123),
	    Call = __webpack_require__(125),
	    KeyValuePair = __webpack_require__(126),
	    List = __webpack_require__(127),
	    NamespaceScopeWrapper = __webpack_require__(128),
	    ObjectValueWrapper = __webpack_require__(129),
	    Promise = __webpack_require__(133),
	    ScopeWrapper = __webpack_require__(135);

	function Engine(
	    runtime,
	    environment,
	    phpCommon,
	    options,
	    wrapper,
	    pausable,
	    phpToAST,
	    phpToJS
	) {
	    this.environment = environment;
	    this.options = _.extend(
	        {
	            'path': null
	        },
	        options || {}
	    );
	    this.pausable = pausable;
	    this.phpCommon = phpCommon;
	    this.phpToAST = phpToAST;
	    this.phpToJS = phpToJS;
	    this.runtime = runtime;
	    this.wrapper = wrapper;
	}

	_.extend(Engine.prototype, {
	    createPause: function () {
	        var engine = this;

	        if (!engine.pausable) {
	            throw new Error('Pausable is not available');
	        }

	        return engine.pausable.createPause();
	    },

	    execute: function () {
	        var callStack,
	            engine = this,
	            environment = engine.environment,
	            globalNamespace,
	            globalScope,
	            options = engine.options,
	            path = options[PATH],
	            isMainProgram = path === null,
	            pausable = engine.pausable,
	            phpCommon = engine.phpCommon,
	            phpParser,
	            phpToJS = engine.phpToJS,
	            Exception = phpCommon.Exception,
	            PHPError = phpCommon.PHPError,
	            PHPException,
	            PHPFatalError = phpCommon.PHPFatalError,
	            referenceFactory,
	            runtime = engine.runtime,
	            state,
	            stderr = engine.getStderr(),
	            stdin = engine.getStdin(),
	            stdout = engine.getStdout(),
	            tools,
	            valueFactory,
	            wrapper = engine.wrapper,
	            unwrap = function (wrapper) {
	                return pausable ? wrapper.async(pausable) : wrapper.sync();
	            },
	            NamespaceScope = unwrap(NamespaceScopeWrapper),
	            ObjectValue = unwrap(ObjectValueWrapper),
	            Scope = unwrap(ScopeWrapper);

	        function include(path) {
	            var done = false,
	                pause = null,
	                result,
	                subOptions = _.extend({}, options, {
	                    'path': path
	                });

	            function completeWith(moduleResult) {
	                if (pause) {
	                    pause.resume(moduleResult);
	                } else {
	                    result = moduleResult;
	                }
	            }

	            if (!subOptions[INCLUDE_OPTION]) {
	                throw new Exception(
	                    'include(' + path + ') :: No "include" transport is available for loading the module.'
	                );
	            }

	            function resolve(module) {
	                var executeResult,
	                    subWrapper,
	                    subModule;

	                // Handle PHP code string being returned from loader for module
	                if (_.isString(module)) {
	                    if (!phpParser) {
	                        throw new Exception('include(' + path + ') :: PHP parser is not available');
	                    }

	                    if (!phpToJS) {
	                        throw new Exception('include(' + path + ') :: PHPToJS is not available');
	                    }

	                    // Tell the parser the path to the current file
	                    // so it can be included in error messages
	                    phpParser.getState().setPath(path);

	                    /*jshint evil: true */
	                    try {
	                        subWrapper = new Function(
	                            'return ' +
	                            phpToJS.transpile(
	                                phpParser.parse(module),
	                                {'bare': true}
	                            ) +
	                            ';'
	                        )();
	                    } catch (error) {
	                        if (pause) {
	                            pause.throw(error);
	                            return;
	                        }

	                        throw error;
	                    }

	                    subModule = runtime.compile(subWrapper);
	                    executeResult = subModule(subOptions, environment).execute();

	                    if (!pausable) {
	                        done = true;

	                        completeWith(executeResult);
	                        return;
	                    }

	                    executeResult.then(
	                        completeWith,
	                        function (error) {
	                            pause.throw(error);
	                        }
	                    );

	                    return;
	                }

	                // Handle wrapper function being returned from loader for module
	                if (_.isFunction(module)) {
	                    executeResult = module(subOptions, environment).execute();

	                    if (!pausable) {
	                        done = true;

	                        completeWith(executeResult);
	                        return;
	                    }

	                    executeResult.then(
	                        completeWith,
	                        function (error) {
	                            pause.throw(error);
	                        }
	                    );

	                    return;
	                }

	                throw new Exception('include(' + path + ') :: Module is in a weird format');
	            }

	            function reject() {
	                done = true;

	                callStack.raiseError(
	                    PHPError.E_WARNING,
	                    'include(' + path + '): failed to open stream: No such file or directory'
	                );
	                callStack.raiseError(
	                    PHPError.E_WARNING,
	                    'include(): Failed opening \'' + path + '\' for inclusion'
	                );

	                completeWith(valueFactory.createNull());
	            }

	            subOptions[INCLUDE_OPTION](path, {
	                reject: reject,
	                resolve: resolve
	            });

	            if (done) {
	                return result;
	            }

	            if (!pausable) {
	                // Pausable is not available, so we cannot yield while the module is loaded
	                throw new Exception('include(' + path + ') :: Async support not enabled');
	            }

	            pause = pausable.createPause();
	            pause.now();
	        }

	        function getNormalizedPath() {
	            return path === null ? '(program)' : path;
	        }

	        phpParser = environment.getParser();
	        state = environment.getState();
	        referenceFactory = state.getReferenceFactory();
	        valueFactory = state.getValueFactory();
	        globalNamespace = state.getGlobalNamespace();
	        callStack = state.getCallStack();
	        globalScope = state.getGlobalScope();
	        PHPException = state.getPHPExceptionClass();

	        tools = {
	            createClosure: function (func, scope) {
	                func.scopeWhenCreated = scope;

	                return tools.valueFactory.createObject(
	                    func,
	                    globalNamespace.getClass('Closure')
	                );
	            },
	            createInstance: unwrap(pauser([], function () {
	                return function (namespaceScope, classNameValue, args) {
	                    var className = classNameValue.getNative(),
	                        classObject = namespaceScope.getClass(className);

	                    return classObject.instantiate(args);
	                };
	            })),
	            createKeyValuePair: function (key, value) {
	                return new KeyValuePair(key, value);
	            },
	            createList: function (elements) {
	                return new List(elements);
	            },
	            createNamespaceScope: function (namespace) {
	                return new NamespaceScope(globalNamespace, namespace);
	            },
	            getPath: function () {
	                return valueFactory.createString(getNormalizedPath());
	            },
	            getPathDirectory: function () {
	                return valueFactory.createString(getNormalizedPath().replace(/\/[^\/]+$/, ''));
	            },
	            globalScope: globalScope,
	            implyArray: function (variable) {
	                // Undefined variables and variables containing null may be implicitly converted to arrays
	                if (!variable.isDefined() || variable.getValue().getType() === 'null') {
	                    variable.setValue(valueFactory.createArray([]));
	                }

	                return variable.getValue();
	            },
	            implyObject: function (variable) {
	                return variable.getValue();
	            },
	            include: include,
	            popCall: function () {
	                callStack.pop();
	            },
	            pushCall: function (thisObject, currentClass) {
	                var call;

	                if (!valueFactory.isValue(thisObject)) {
	                    thisObject = null;
	                }

	                call = new Call(new Scope(callStack, valueFactory, thisObject, currentClass));

	                callStack.push(call);

	                return call;
	            },
	            referenceFactory: referenceFactory,
	            requireOnce: include,
	            require: include,
	            throwNoActiveClassScope: function () {
	                throw new PHPFatalError(PHPFatalError.SELF_WHEN_NO_ACTIVE_CLASS);
	            },
	            valueFactory: valueFactory
	        };

	        // Push the 'main' global scope call onto the stack
	        callStack.push(new Call(globalScope));

	        function handleError(error, reject) {
	            if (error instanceof ObjectValue) {
	                // Uncaught PHP Exceptions become E_FATAL errors
	                (function (value) {
	                    var error = value.getNative();

	                    if (!(error instanceof PHPException)) {
	                        throw new Exception('Weird value class thrown: ' + value.getClassName());
	                    }

	                    error = new PHPFatalError(
	                        PHPFatalError.UNCAUGHT_EXCEPTION,
	                        {
	                            name: value.getClassName()
	                        }
	                    );

	                    if (isMainProgram) {
	                        stderr.write(error.message);
	                    }

	                    reject(error);
	                }(error));

	                return;
	            }

	            if (error instanceof PHPError) {
	                if (isMainProgram) {
	                    stderr.write(error.message);
	                }

	                reject(error);
	                return;
	            }

	            reject(error);
	        }

	        // Use asynchronous mode if Pausable is available
	        if (pausable) {
	            return new Promise(function (resolve, reject) {
	                var code = 'return (' +
	                    wrapper.toString() +
	                    '(stdin, stdout, stderr, tools, globalNamespace));';

	                pausable.execute(code, {
	                    strict: true,
	                    expose: {
	                        stdin: stdin,
	                        stdout: stdout,
	                        stderr: stderr,
	                        tools: tools,
	                        globalNamespace: globalNamespace
	                    }
	                }).then(resolve, function (error) {
	                    handleError(error, reject);
	                });
	            });
	        }

	        // Otherwise load the module synchronously
	        try {
	            return wrapper(stdin, stdout, stderr, tools, globalNamespace);
	        } catch (error) {
	            handleError(error, function (error) {
	                throw error;
	            });
	        }
	    },

	    expose: function (object, name) {
	        this.environment.expose(object, name);
	    },

	    getStderr: function () {
	        return this.environment.getStderr();
	    },

	    getStdin: function () {
	        return this.environment.getStdin();
	    },

	    getStdout: function () {
	        return this.environment.getStdout();
	    }
	});

	module.exports = Engine;


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pauser - Wrapper for optional Pausable usage
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/pauser/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pauser/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var Wrapper = __webpack_require__(124);

	module.exports = function (args, wrapper, options) {
	    return new Wrapper(args, wrapper, options);
	};


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Pauser - Wrapper for optional Pausable usage
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/asmblah/pauser/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/pauser/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function Wrapper(args, fn, options) {
	    this.args = args;
	    this.evaluatedAsync = false;
	    this.evaluatedSync = false;
	    this.asyncReturnValue = null;
	    this.fn = fn;
	    this.options = options;
	    this.syncReturnValue = null;
	}

	_.extend(Wrapper.prototype, {
	    /**
	     * Executes wrapper asynchronously via the Pausable library.
	     *
	     * @param {Pausable} pausable
	     * @returns {*}
	     */
	    async: function (pausable) {
	        var args,
	            wrapper = this;

	        if (wrapper.evaluatedAsync) {
	            return wrapper.asyncReturnValue;
	        }

	        // Recursively transpile any arguments to the function that are themselves Wrappers
	        args = _.map(wrapper.args, function (arg) {
	            if (arg instanceof Wrapper) {
	                return arg.async(pausable);
	            }

	            return arg;
	        });

	        wrapper.asyncReturnValue = pausable.executeSync(args, wrapper.fn, wrapper.options);
	        wrapper.evaluatedAsync = true;

	        return wrapper.asyncReturnValue;
	    },

	    /**
	     * Executes wrapper synchronously when the Pausable library is not available.
	     *
	     * @returns {*}
	     */
	    sync: function () {
	        var args,
	            wrapper = this;

	        if (wrapper.evaluatedSync) {
	            return wrapper.syncReturnValue;
	        }

	        // Recursively evaluate any arguments to the function that are themselves Wrappers
	        args = _.map(wrapper.args, function (arg) {
	            if (arg instanceof Wrapper) {
	                return arg.sync();
	            }

	            return arg;
	        });

	        wrapper.syncReturnValue = wrapper.fn.apply(null, args);
	        wrapper.evaluatedSync = true;

	        return wrapper.syncReturnValue;
	    }
	});

	module.exports = Wrapper;


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function Call(scope) {
	    this.scope = scope;
	}

	_.extend(Call.prototype, {
	    getScope: function () {
	        return this.scope;
	    }
	});

	module.exports = Call;


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function KeyValuePair(key, value) {
	    this.key = key;
	    this.value = value;
	}

	_.extend(KeyValuePair.prototype, {
	    getKey: function () {
	        return this.key;
	    },

	    getValue: function () {
	        return this.value;
	    }
	});

	module.exports = KeyValuePair;


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function List(elements) {
	    this.elements = elements;
	}

	_.extend(List.prototype, {
	    setValue: function (value) {
	        var listElements = this.elements;

	        if (value.getType() !== 'array') {
	            throw new Error('Unsupported');
	        }

	        _.each(listElements, function (reference, index) {
	            reference.setValue(value.getElementByIndex(index).getValue());
	        });

	        return value;
	    }
	});

	module.exports = List;


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(20)
	], function (
	    _,
	    phpCommon
	) {
	    var hasOwn = {}.hasOwnProperty,
	        PHPFatalError = phpCommon.PHPFatalError;

	    function NamespaceScope(globalNamespace, namespace) {
	        this.globalNamespace = globalNamespace;
	        this.imports = {};
	        this.namespace = namespace;
	    }

	    _.extend(NamespaceScope.prototype, {
	        getClass: function (name) {
	            var match,
	                scope = this,
	                namespace = scope.namespace,
	                path,
	                prefix;

	            // Check whether the entire class name is aliased
	            if (hasOwn.call(scope.imports, name)) {
	                name = scope.imports[name];
	                namespace = scope.globalNamespace;
	            }

	            // Check whether the class path is absolute, so no 'use's apply
	            if (name.charAt(0) === '\\') {
	                match = name.match(/^\\(.*?)\\([^\\]+)$/);

	                if (match) {
	                    path = match[1];
	                    name = match[2];
	                    namespace = scope.globalNamespace.getDescendant(path);
	                } else {
	                    name = name.substr(1);
	                }
	                // Check whether the namespace prefix is an alias
	            } else {
	                match = name.match(/^([^\\]+)(.*?)\\([^\\]+)$/);

	                if (match) {
	                    prefix = match[1];
	                    path = match[2];

	                    if (hasOwn.call(scope.imports, prefix)) {
	                        namespace = scope.globalNamespace.getDescendant(scope.imports[prefix].substr(1) + path);
	                        name = match[3];
	                    }
	                }
	            }

	            return namespace.getClass(name);
	        },

	        getConstant: function (name) {
	            var match,
	                scope = this,
	                namespace = scope.namespace,
	                path,
	                prefix,
	                usesNamespace;

	            // Check whether the constant path is absolute, so no 'use's apply
	            if (name.charAt(0) === '\\') {
	                usesNamespace = true;
	                match = name.match(/^\\(.*?)\\([^\\]+)$/);

	                if (match) {
	                    path = match[1];
	                    name = match[2];
	                    namespace = scope.globalNamespace.getDescendant(path);
	                } else {
	                    name = name.substr(1);
	                }
	                // Check whether the namespace prefix is an alias
	            } else {
	                match = name.match(/^([^\\]+)(.*?)\\([^\\]+)$/);

	                if (match) {
	                    usesNamespace = true;
	                    prefix = match[1];
	                    path = match[2];
	                    name = match[3];

	                    if (hasOwn.call(scope.imports, prefix)) {
	                        namespace = scope.globalNamespace.getDescendant(scope.imports[prefix].substr(1) + path);
	                    } else {
	                        // Not an alias: look up the namespace path relative to this namespace
	                        // (ie. 'namespace Test { echo Our\CONSTANT; }' -> 'echo \Test\Our\CONSTANT;')
	                        namespace = scope.globalNamespace.getDescendant(namespace.getPrefix() + prefix + path);
	                    }
	                }
	            }

	            return namespace.getConstant(name, usesNamespace);
	        },

	        getFunction: function (name) {
	            var match,
	                scope = this,
	                namespace = scope.namespace,
	                path,
	                prefix;

	            // Check whether the function path is absolute, so no 'use's apply
	            if (name.charAt(0) === '\\') {
	                match = name.match(/^\\(.*?)\\([^\\]+)$/);

	                if (match) {
	                    path = match[1];
	                    name = match[2];
	                    namespace = scope.globalNamespace.getDescendant(path);
	                } else {
	                    name = name.substr(1);
	                    namespace = scope.globalNamespace;
	                }
	                // Check whether the namespace prefix is an alias
	            } else {
	                match = name.match(/^([^\\]+)(.*?)\\([^\\]+)$/);

	                if (match) {
	                    prefix = match[1];
	                    path = match[2];
	                    name = match[3];

	                    if (hasOwn.call(scope.imports, prefix)) {
	                        namespace = scope.globalNamespace.getDescendant(scope.imports[prefix].substr(1) + path);
	                    } else {
	                        // Not an alias: look up the namespace path relative to this namespace
	                        // (ie. 'namespace Test { Our\Func(); }' -> '\Test\Our\Func();')
	                        namespace = scope.globalNamespace.getDescendant(namespace.getPrefix() + prefix + path);
	                    }
	                }
	            }

	            return namespace.getFunction(name);
	        },

	        getGlobalNamespace: function () {
	            return this.globalNamespace;
	        },

	        use: function (source, alias) {
	            var scope = this,
	                normalizedSource = source;

	            if (!alias) {
	                alias = source.replace(/^.*?([^\\]+)$/, '$1');
	            }

	            if (normalizedSource.charAt(0) !== '\\') {
	                normalizedSource = '\\' + normalizedSource;
	            }

	            if (scope.imports[alias]) {
	                throw new PHPFatalError(
	                    PHPFatalError.NAME_ALREADY_IN_USE,
	                    {
	                        alias: alias,
	                        source: source
	                    }
	                );
	            }

	            scope.imports[alias] = normalizedSource;
	        }
	    });

	    return NamespaceScope;
	}, {strict: true});


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(20),
	    __webpack_require__(22),
	    __webpack_require__(126),
	    __webpack_require__(130),
	    __webpack_require__(131),
	    __webpack_require__(132)
	], function (
	    _,
	    phpCommon,
	    util,
	    KeyValuePair,
	    NullReference,
	    PropertyReference,
	    Value
	) {
	    var hasOwn = {}.hasOwnProperty,
	        PHPError = phpCommon.PHPError,
	        PHPFatalError = phpCommon.PHPFatalError;

	    function ObjectValue(factory, callStack, object, classObject, id) {
	        Value.call(this, factory, callStack, 'object', object);

	        this.classObject = classObject;
	        this.id = id;
	        this.properties = {};
	    }

	    util.inherits(ObjectValue, Value);

	    _.extend(ObjectValue.prototype, {
	        add: function (rightValue) {
	            return rightValue.addToObject(this);
	        },

	        addToArray: function () {
	            var value = this;

	            value.callStack.raiseError(
	                PHPError.E_NOTICE,
	                'Object of class ' + value.classObject.getName() + ' could not be converted to int'
	            );

	            throw new PHPFatalError(PHPFatalError.UNSUPPORTED_OPERAND_TYPES);
	        },

	        addToBoolean: function (booleanValue) {
	            var value = this;

	            value.callStack.raiseError(
	                PHPError.E_NOTICE,
	                'Object of class ' + value.classObject.getName() + ' could not be converted to int'
	            );

	            return value.factory.createInteger((booleanValue.value ? 1 : 0) + 1);
	        },

	        addToFloat: function (floatValue) {
	            var value = this;

	            value.callStack.raiseError(
	                PHPError.E_NOTICE,
	                'Object of class ' + value.classObject.getName() + ' could not be converted to int'
	            );

	            return value.factory.createFloat(floatValue.value + 1);
	        },

	        call: function (args) {
	            return this.callMethod('__invoke', args);
	        },

	        callMethod: function (name, args) {
	            var defined = true,
	                func,
	                value = this,
	                object = value.value,
	                otherObject,
	                thisObject = value,
	                thisVariable;

	            // Call functions directly when invoking the magic method
	            if (name === '__invoke' && _.isFunction(object)) {
	                func = object;
	            } else {
	                // Allow methods inherited via the prototype chain up to but not including Object.prototype
	                if (!hasOwn.call(object, name)) {
	                    otherObject = object;

	                    do {
	                        otherObject = Object.getPrototypeOf(otherObject);
	                        if (!otherObject || otherObject === Object.prototype) {
	                            defined = false;
	                            break;
	                        }
	                    } while (!hasOwn.call(otherObject, name));
	                }

	                func = object[name];
	            }

	            if (!defined || !_.isFunction(func)) {
	                throw new PHPFatalError(
	                    PHPFatalError.UNDEFINED_METHOD,
	                    {
	                        className: value.classObject.getName(),
	                        methodName: name
	                    }
	                );
	            }

	            // Unwrap thisObj and argument Value objects when calling out
	            // to a native JS object method
	            if (value.classObject.getName() === 'JSObject') {
	                thisObject = object;
	                _.each(args, function (arg, index) {
	                    args[index] = arg.unwrapForJS();
	                });
	                // Use the current object as $this for PHP closures by default
	            } else if (value.classObject.getName() === 'Closure') {
	                // Store the current PHP thisObj to set for the closure
	                thisVariable = object.scopeWhenCreated.getVariable('this');
	                thisObject = thisVariable.isDefined() ?
	                    thisVariable.getValue() :
	                    null;
	            }

	            return value.factory.coerce(func.apply(thisObject, args));
	        },

	        callStaticMethod: function (nameValue, args) {
	            return this.classObject.callStaticMethod(nameValue.getNative(), args);
	        },

	        clone: function () {
	            throw new Error('Unimplemented');
	        },

	        coerceToArray: function () {
	            var elements = [],
	                value = this,
	                factory = value.factory;

	            _.each(value.value, function (propertyValue, propertyName) {
	                elements.push(
	                    new KeyValuePair(
	                        factory.coerce(propertyName),
	                        factory.coerce(propertyValue)
	                    )
	                );
	            });

	            return value.factory.createArray(elements);
	        },

	        coerceToBoolean: function () {
	            return this.factory.createBoolean(true);
	        },

	        coerceToKey: function () {
	            this.callStack.raiseError(PHPError.E_WARNING, 'Illegal offset type');
	        },

	        coerceToString: function () {
	            return this.callMethod('__toString');
	        },

	        getClassName: function () {
	            return this.classObject.getName();
	        },

	        getConstantByName: function (name) {
	            return this.classObject.getConstantByName(name);
	        },

	        getElementByIndex: function (index) {
	            var value = this,
	                names = value.getInstancePropertyNames();

	            if (!hasOwn.call(names, index)) {
	                value.callStack.raiseError(
	                    PHPError.E_NOTICE,
	                    'Undefined ' + value.referToElement(index)
	                );

	                return new NullReference(value.factory);
	            }

	            return value.getInstancePropertyByName(names[index]);
	        },

	        getForAssignment: function () {
	            return this;
	        },

	        getID: function () {
	            return this.id;
	        },

	        getInstancePropertyByName: function (nameValue) {
	            var nameKey = nameValue.coerceToKey(),
	                name = nameKey.getNative(),
	                value = this;

	            if (value.classObject.hasStaticPropertyByName(name)) {
	                value.callStack.raiseError(
	                    PHPError.E_STRICT,
	                    'Accessing static property ' + value.classObject.getName() + '::$' + name + ' as non static'
	                );
	            }

	            if (!hasOwn.call(value.properties, name)) {
	                value.properties[name] = new PropertyReference(
	                    value.factory,
	                    value.callStack,
	                    value,
	                    nameKey
	                );
	            }

	            return value.properties[name];
	        },

	        getInstancePropertyNames: function () {
	            var nameHash = {},
	                names = [],
	                value = this;

	            _.each(value.value, function (value, name) {
	                nameHash[name] = true;
	            });

	            _.each(value.properties, function (value, name) {
	                nameHash[name] = true;
	            });

	            _.each(nameHash, function (t, name) {
	                names.push(value.factory.coerce(name));
	            });

	            return names;
	        },

	        getKeyByIndex: function (index) {
	            var value = this,
	                keys = value.getInstancePropertyNames();

	            return keys[index] || null;
	        },

	        getLength: function () {
	            return this.getInstancePropertyNames().length;
	        },

	        getNative: function () {
	            return this.value;
	        },

	        getStaticPropertyByName: function (nameValue) {
	            return this.classObject.getStaticPropertyByName(nameValue.getNative());
	        },

	        isEqualTo: function (rightValue) {
	            return rightValue.isEqualToObject(this);
	        },

	        isEqualToArray: function () {
	            return this.factory.createBoolean(false);
	        },

	        isEqualToFloat: function (floatValue) {
	            return this.factory.createBoolean(floatValue.getNative() === 1);
	        },

	        isEqualToInteger: function (integerValue) {
	            return this.factory.createBoolean(integerValue.getNative() === 1);
	        },

	        isEqualToNull: function () {
	            return this.factory.createBoolean(false);
	        },

	        isEqualToObject: function (rightValue) {
	            var equal = true,
	                leftValue = this,
	                factory = leftValue.factory;

	            if (
	                rightValue.getLength() !== leftValue.getLength() ||
	                rightValue.getClassName() !== leftValue.getClassName()
	            ) {
	                return factory.createBoolean(false);
	            }

	            _.forOwn(rightValue.value, function (element, nativeKey) {
	                if (
	                    !hasOwn.call(leftValue.value, nativeKey) ||
	                    factory.coerce(element).isNotEqualTo(
	                        leftValue.value[nativeKey].getValue()
	                    ).getNative()
	                ) {
	                    equal = false;
	                    return false;
	                }
	            });

	            return factory.createBoolean(equal);
	        },

	        isEqualToString: function () {
	            return this.factory.createBoolean(false);
	        },

	        isIdenticalTo: function (rightValue) {
	            return rightValue.isIdenticalToObject(this);
	        },

	        isIdenticalToArray: function () {
	            return this.factory.createBoolean(false);
	        },

	        isIdenticalToObject: function (rightValue) {
	            var leftValue = this,
	                factory = leftValue.factory;

	            return factory.createBoolean(rightValue.value === leftValue.value);
	        },

	        referToElement: function (key) {
	            return 'property: ' + this.getClassName() + '::$' + key;
	        },

	        reset: function () {
	            var value = this;

	            value.pointer = 0;

	            return value;
	        },

	        setPointer: function (pointer) {
	            this.pointer = pointer;
	        },

	        unwrapForJS: function () {
	            var value = this;

	            if (value.classObject.getName() === 'Closure') {
	                // When calling a PHP closure from JS, preserve thisObj
	                // by passing it in (wrapped) as the first argument
	                return function () {
	                    // Wrap thisObj in *Value object
	                    var thisObj = value.factory.coerce(this),
	                        args = [];

	                    // Wrap all native JS values in *Value objects
	                    _.each(arguments, function (arg) {
	                        args.push(value.factory.coerce(arg));
	                    });

	                    return value.value.apply(thisObj, args);
	                };
	            }

	            // Return a wrapper object that presents a promise-based API
	            // for calling methods of PHP objects in sync or async mode
	            return value.factory.createPHPObject(value);
	        }
	    });

	    return ObjectValue;
	}, {strict: true});


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function NullReference(valueFactory, options) {
	    options = options || {};

	    this.onSet = options.onSet;
	    this.valueFactory = valueFactory;
	}

	_.extend(NullReference.prototype, {
	    getValue: function () {
	        return this.valueFactory.createNull();
	    },

	    setValue: function () {
	        var reference = this;

	        if (reference.onSet) {
	            reference.onSet();
	        }
	    }
	});

	module.exports = NullReference;


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    hasOwn = {}.hasOwnProperty,
	    phpCommon = __webpack_require__(20),
	    PHPError = phpCommon.PHPError;

	function PropertyReference(valueFactory, callStack, objectValue, key) {
	    this.objectValue = objectValue;
	    this.key = key;
	    this.reference = null;
	    this.callStack = callStack;
	    this.valueFactory = valueFactory;
	}

	_.extend(PropertyReference.prototype, {
	    clone: function () {
	        var property = this;

	        return new PropertyReference(
	            property.valueFactory,
	            property.callStack,
	            property.objectValue,
	            property.key
	        );
	    },

	    getKey: function () {
	        return this.key;
	    },

	    getValue: function () {
	        var property = this,
	            nativeObject = property.objectValue.getNative(),
	            nativeKey = property.key.getNative();

	        // Special value of native null (vs. NullValue) represents undefined
	        if (!property.isDefined()) {
	            property.callStack.raiseError(
	                PHPError.E_NOTICE,
	                'Undefined ' + property.objectValue.referToElement(
	                    nativeKey
	                )
	            );

	            return property.valueFactory.createNull();
	        }

	        return property.reference ?
	            property.reference.getValue() :
	            property.valueFactory.coerce(
	                nativeObject[nativeKey]
	            );
	    },

	    isDefined: function () {
	        var defined = true,
	            otherObject,
	            property = this,
	            nativeObject = property.objectValue.getNative(),
	            nativeKey = property.key.getNative();

	        if (property.reference) {
	            return true;
	        }

	        // Allow properties inherited via the prototype chain up to but not including Object.prototype
	        if (!hasOwn.call(nativeObject, nativeKey)) {
	            otherObject = nativeObject;

	            do {
	                otherObject = Object.getPrototypeOf(otherObject);
	                if (!otherObject || otherObject === Object.prototype) {
	                    defined = false;
	                    break;
	                }
	            } while (!hasOwn.call(otherObject, nativeKey));
	        }

	        return defined;
	    },

	    isReference: function () {
	        return !!this.reference;
	    },

	    setReference: function (reference) {
	        var property = this;

	        property.reference = reference;
	    },

	    setValue: function (value) {
	        var property = this,
	            nativeObject = property.objectValue.getNative(),
	            nativeKey = property.key.getNative(),
	            isFirstProperty = (property.objectValue.getLength() === 0);

	        // Ensure we write the native value to properties on native JS objects
	        function getValueForAssignment() {
	            if (property.objectValue.getClassName() === 'JSObject') {
	                return value.getNative();
	            }

	            return value.getForAssignment();
	        }

	        if (property.reference) {
	            property.reference.setValue(value);
	        } else {
	            nativeObject[nativeKey] = getValueForAssignment();
	        }

	        if (isFirstProperty) {
	            property.objectValue.setPointer(
	                property.objectValue.getKeys().indexOf(
	                    property.key.getNative().toString()
	                )
	            );
	        }
	    }
	});

	module.exports = PropertyReference;


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(20),
	    __webpack_require__(130)
	], function (
	    _,
	    phpCommon,
	    NullReference
	) {
	    var PHPError = phpCommon.PHPError,
	        PHPFatalError = phpCommon.PHPFatalError;

	    function Value(factory, callStack, type, value) {
	        this.factory = factory;
	        this.callStack = callStack;
	        this.type = type;
	        this.value = value;
	    }

	    _.extend(Value.prototype, {
	        addToArray: function () {
	            throw new PHPFatalError(PHPFatalError.UNSUPPORTED_OPERAND_TYPES);
	        },

	        addToFloat: function (floatValue) {
	            var leftValue = this;

	            // Coerce to float and return a float if either operand is a float
	            return leftValue.factory.createFloat(leftValue.coerceToFloat().getNative() + floatValue.getNative());
	        },

	        addToNull: function () {
	            return this;
	        },

	        addToString: function (stringValue) {
	            return stringValue.coerceToNumber().add(this.coerceToNumber());
	        },

	        callMethod: function (name) {
	            throw new PHPFatalError(PHPFatalError.NON_OBJECT_METHOD_CALL, {
	                name: name
	            });
	        },

	        callStaticMethod: function () {
	            throw new PHPFatalError(PHPFatalError.CLASS_NAME_NOT_VALID);
	        },

	        coerceToArray: function () {
	            var value = this;

	            return value.factory.createArray([value]);
	        },

	        coerceToFloat: function () {
	            var value = this;

	            return value.factory.createFloat(Number(value.value));
	        },

	        coerceToString: function () {
	            throw new Error('Unimplemented');
	        },

	        concat: function (rightValue) {
	            var leftValue = this;

	            return leftValue.factory.createString(
	                leftValue.coerceToString().getNative() + rightValue.coerceToString().getNative()
	            );
	        },

	        getConstantByName: function () {
	            throw new PHPFatalError(PHPFatalError.CLASS_NAME_NOT_VALID);
	        },

	        getElementByKey: function () {
	            var callStack = this.callStack;

	            return new NullReference(this.factory, {
	                onSet: function () {
	                    callStack.raiseError(PHPError.E_WARNING, 'Cannot use a scalar value as an array');
	                }
	            });
	        },

	        getForAssignment: function () {
	            return this;
	        },

	        getInstancePropertyByName: function () {
	            throw new Error('Unimplemented');
	        },

	        getLength: function () {
	            return this.coerceToString().getLength();
	        },

	        getNative: function () {
	            return this.value;
	        },

	        getStaticPropertyByName: function () {
	            throw new PHPFatalError(PHPFatalError.CLASS_NAME_NOT_VALID);
	        },

	        getType: function () {
	            return this.type;
	        },

	        getValue: function () {
	            return this;
	        },

	        isEqualTo: function (rightValue) {
	            /*jshint eqeqeq:false */
	            var leftValue = this;

	            return leftValue.factory.createBoolean(rightValue.value == leftValue.value);
	        },

	        isEqualToArray: function (rightValue) {
	            return this.isEqualTo(rightValue);
	        },

	        isEqualToFloat: function (rightValue) {
	            return this.isEqualTo(rightValue);
	        },

	        isEqualToInteger: function (rightValue) {
	            return this.isEqualTo(rightValue);
	        },

	        isEqualToNull: function (rightValue) {
	            return this.isEqualTo(rightValue);
	        },

	        isEqualToObject: function (rightValue) {
	            return this.isEqualTo(rightValue);
	        },

	        isIdenticalTo: function (rightValue) {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(
	                rightValue.type === leftValue.type &&
	                rightValue.value === leftValue.value
	            );
	        },

	        isIdenticalToArray: function (rightValue) {
	            return this.isIdenticalTo(rightValue);
	        },

	        isIdenticalToObject: function (rightValue) {
	            return this.isIdenticalTo(rightValue);
	        },

	        isNotEqualTo: function (rightValue) {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(!leftValue.isEqualTo(rightValue).getNative());
	        },

	        isNotIdenticalTo: function (rightValue) {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(!leftValue.isIdenticalTo(rightValue).getNative());
	        },

	        isSet: function () {
	            // All values except NULL are classed as 'set'
	            return true;
	        },

	        logicalAnd: function (rightValue) {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(
	                leftValue.coerceToBoolean().getNative() &&
	                rightValue.coerceToBoolean().getNative()
	            );
	        },

	        logicalNot: function () {
	            var value = this;

	            return value.factory.createBoolean(!value.coerceToBoolean().getNative());
	        },

	        subtractFromNull: function () {
	            throw new PHPFatalError(PHPFatalError.UNSUPPORTED_OPERAND_TYPES);
	        },

	        toValue: function () {
	            return this;
	        },

	        unwrapForJS: function () {
	            return this.getNative();
	        }
	    });

	    return Value;
	}, {strict: true});


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	var immediate = __webpack_require__(134);

	/* istanbul ignore next */
	function INTERNAL() {}

	var handlers = {};

	var REJECTED = ['REJECTED'];
	var FULFILLED = ['FULFILLED'];
	var PENDING = ['PENDING'];
	/* istanbul ignore else */
	if (!process.browser) {
	  // in which we actually take advantage of JS scoping
	  var UNHANDLED = ['UNHANDLED'];
	}

	module.exports = exports = Promise;

	function Promise(resolver) {
	  if (typeof resolver !== 'function') {
	    throw new TypeError('resolver must be a function');
	  }
	  this.state = PENDING;
	  this.queue = [];
	  this.outcome = void 0;
	  /* istanbul ignore else */
	  if (!process.browser) {
	    this.handled = UNHANDLED;
	  }
	  if (resolver !== INTERNAL) {
	    safelyResolveThenable(this, resolver);
	  }
	}

	Promise.prototype.catch = function (onRejected) {
	  return this.then(null, onRejected);
	};
	Promise.prototype.then = function (onFulfilled, onRejected) {
	  if (typeof onFulfilled !== 'function' && this.state === FULFILLED ||
	    typeof onRejected !== 'function' && this.state === REJECTED) {
	    return this;
	  }
	  var promise = new this.constructor(INTERNAL);
	  /* istanbul ignore else */
	  if (!process.browser) {
	    if (typeof onRejected === 'function' && this.handled === UNHANDLED) {
	      this.handled = null;
	    }
	  }
	  if (this.state !== PENDING) {
	    var resolver = this.state === FULFILLED ? onFulfilled : onRejected;
	    unwrap(promise, resolver, this.outcome);
	  } else {
	    this.queue.push(new QueueItem(promise, onFulfilled, onRejected));
	  }

	  return promise;
	};
	function QueueItem(promise, onFulfilled, onRejected) {
	  this.promise = promise;
	  if (typeof onFulfilled === 'function') {
	    this.onFulfilled = onFulfilled;
	    this.callFulfilled = this.otherCallFulfilled;
	  }
	  if (typeof onRejected === 'function') {
	    this.onRejected = onRejected;
	    this.callRejected = this.otherCallRejected;
	  }
	}
	QueueItem.prototype.callFulfilled = function (value) {
	  handlers.resolve(this.promise, value);
	};
	QueueItem.prototype.otherCallFulfilled = function (value) {
	  unwrap(this.promise, this.onFulfilled, value);
	};
	QueueItem.prototype.callRejected = function (value) {
	  handlers.reject(this.promise, value);
	};
	QueueItem.prototype.otherCallRejected = function (value) {
	  unwrap(this.promise, this.onRejected, value);
	};

	function unwrap(promise, func, value) {
	  immediate(function () {
	    var returnValue;
	    try {
	      returnValue = func(value);
	    } catch (e) {
	      return handlers.reject(promise, e);
	    }
	    if (returnValue === promise) {
	      handlers.reject(promise, new TypeError('Cannot resolve promise with itself'));
	    } else {
	      handlers.resolve(promise, returnValue);
	    }
	  });
	}

	handlers.resolve = function (self, value) {
	  var result = tryCatch(getThen, value);
	  if (result.status === 'error') {
	    return handlers.reject(self, result.value);
	  }
	  var thenable = result.value;

	  if (thenable) {
	    safelyResolveThenable(self, thenable);
	  } else {
	    self.state = FULFILLED;
	    self.outcome = value;
	    var i = -1;
	    var len = self.queue.length;
	    while (++i < len) {
	      self.queue[i].callFulfilled(value);
	    }
	  }
	  return self;
	};
	handlers.reject = function (self, error) {
	  self.state = REJECTED;
	  self.outcome = error;
	  /* istanbul ignore else */
	  if (!process.browser) {
	    if (self.handled === UNHANDLED) {
	      immediate(function () {
	        if (self.handled === UNHANDLED) {
	          process.emit('unhandledRejection', error, self);
	        }
	      });
	    }
	  }
	  var i = -1;
	  var len = self.queue.length;
	  while (++i < len) {
	    self.queue[i].callRejected(error);
	  }
	  return self;
	};

	function getThen(obj) {
	  // Make sure we only access the accessor once as required by the spec
	  var then = obj && obj.then;
	  if (obj && typeof obj === 'object' && typeof then === 'function') {
	    return function appyThen() {
	      then.apply(obj, arguments);
	    };
	  }
	}

	function safelyResolveThenable(self, thenable) {
	  // Either fulfill, reject or reject with error
	  var called = false;
	  function onError(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.reject(self, value);
	  }

	  function onSuccess(value) {
	    if (called) {
	      return;
	    }
	    called = true;
	    handlers.resolve(self, value);
	  }

	  function tryToUnwrap() {
	    thenable(onSuccess, onError);
	  }

	  var result = tryCatch(tryToUnwrap);
	  if (result.status === 'error') {
	    onError(result.value);
	  }
	}

	function tryCatch(func, value) {
	  var out = {};
	  try {
	    out.value = func(value);
	    out.status = 'success';
	  } catch (e) {
	    out.status = 'error';
	    out.value = e;
	  }
	  return out;
	}

	exports.resolve = resolve;
	function resolve(value) {
	  if (value instanceof this) {
	    return value;
	  }
	  return handlers.resolve(new this(INTERNAL), value);
	}

	exports.reject = reject;
	function reject(reason) {
	  var promise = new this(INTERNAL);
	  return handlers.reject(promise, reason);
	}

	exports.all = all;
	function all(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var values = new Array(len);
	  var resolved = 0;
	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    allResolver(iterable[i], i);
	  }
	  return promise;
	  function allResolver(value, i) {
	    self.resolve(value).then(resolveFromAll, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	    function resolveFromAll(outValue) {
	      values[i] = outValue;
	      if (++resolved === len && !called) {
	        called = true;
	        handlers.resolve(promise, values);
	      }
	    }
	  }
	}

	exports.race = race;
	function race(iterable) {
	  var self = this;
	  if (Object.prototype.toString.call(iterable) !== '[object Array]') {
	    return this.reject(new TypeError('must be an array'));
	  }

	  var len = iterable.length;
	  var called = false;
	  if (!len) {
	    return this.resolve([]);
	  }

	  var i = -1;
	  var promise = new this(INTERNAL);

	  while (++i < len) {
	    resolver(iterable[i]);
	  }
	  return promise;
	  function resolver(value) {
	    self.resolve(value).then(function (response) {
	      if (!called) {
	        called = true;
	        handlers.resolve(promise, response);
	      }
	    }, function (error) {
	      if (!called) {
	        called = true;
	        handlers.reject(promise, error);
	      }
	    });
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(23)))

/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {'use strict';
	var Mutation = global.MutationObserver || global.WebKitMutationObserver;

	var scheduleDrain;

	if (process.browser) {
	  if (Mutation) {
	    var called = 0;
	    var observer = new Mutation(nextTick);
	    var element = global.document.createTextNode('');
	    observer.observe(element, {
	      characterData: true
	    });
	    scheduleDrain = function () {
	      element.data = (called = ++called % 2);
	    };
	  } else if (!global.setImmediate && typeof global.MessageChannel !== 'undefined') {
	    var channel = new global.MessageChannel();
	    channel.port1.onmessage = nextTick;
	    scheduleDrain = function () {
	      channel.port2.postMessage(0);
	    };
	  } else if ('document' in global && 'onreadystatechange' in global.document.createElement('script')) {
	    scheduleDrain = function () {

	      // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	      // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	      var scriptEl = global.document.createElement('script');
	      scriptEl.onreadystatechange = function () {
	        nextTick();

	        scriptEl.onreadystatechange = null;
	        scriptEl.parentNode.removeChild(scriptEl);
	        scriptEl = null;
	      };
	      global.document.documentElement.appendChild(scriptEl);
	    };
	  } else {
	    scheduleDrain = function () {
	      setTimeout(nextTick, 0);
	    };
	  }
	} else {
	  scheduleDrain = function () {
	    process.nextTick(nextTick);
	  };
	}

	var draining;
	var queue = [];
	//named nextTick for less confusing stack traces
	function nextTick() {
	  draining = true;
	  var i, oldQueue;
	  var len = queue.length;
	  while (len) {
	    oldQueue = queue;
	    queue = [];
	    i = -1;
	    while (++i < len) {
	      oldQueue[i]();
	    }
	    len = queue.length;
	  }
	  draining = false;
	}

	module.exports = immediate;
	function immediate(task) {
	  if (queue.push(task) === 1 && !draining) {
	    scheduleDrain();
	  }
	}

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(23)))

/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(136)
	], function (
	    _,
	    Variable
	) {
	    var hasOwn = {}.hasOwnProperty;

	    function Scope(callStack, valueFactory, thisObject, currentClass) {
	        var thisObjectVariable;

	        this.currentClass = currentClass;
	        this.errorsSuppressed = false;
	        this.callStack = callStack;
	        this.thisObject = thisObject;
	        this.valueFactory = valueFactory;
	        this.variables = {};

	        if (thisObject) {
	            thisObjectVariable = new Variable(callStack, valueFactory, 'this');
	            thisObjectVariable.setValue(thisObject);
	            this.variables['this'] = thisObjectVariable;
	        }
	    }

	    _.extend(Scope.prototype, {
	        defineVariable: function (name) {
	            var scope = this,
	                variable = new Variable(scope.callStack, scope.valueFactory, name);

	            scope.variables[name] = variable;

	            return variable;
	        },

	        defineVariables: function (names) {
	            var scope = this;

	            _.each(names, function (name) {
	                scope.defineVariable(name);
	            });
	        },

	        expose: function (object, name) {
	            var scope = this,
	                valueFactory = scope.valueFactory;

	            scope.defineVariable(name).setValue(valueFactory.coerce(object));
	        },

	        getCurrentClass: function () {
	            return this.currentClass;
	        },

	        getThisObject: function () {
	            return this.thisObject;
	        },

	        getVariable: function (name) {
	            var scope = this;

	            if (!hasOwn.call(scope.variables, name)) {
	                // Implicitly define the variable
	                scope.variables[name] = new Variable(scope.callStack, scope.valueFactory, name);
	            }

	            return scope.variables[name];
	        },

	        suppressErrors: function () {
	            this.errorsSuppressed = true;
	        },

	        suppressesErrors: function () {
	            return this.errorsSuppressed;
	        },

	        unsuppressErrors: function () {
	            this.errorsSuppressed = false;
	        }
	    });

	    return Scope;
	}, {strict: true});


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(20),
	    __webpack_require__(137)
	], function (
	    _,
	    phpCommon,
	    VariableReference
	) {
	    var PHPError = phpCommon.PHPError;

	    function Variable(callStack, valueFactory, name) {
	        this.name = name;
	        this.reference = null;
	        this.callStack = callStack;
	        this.value = null;
	        this.valueFactory = valueFactory;
	    }

	    _.extend(Variable.prototype, {
	        decrementBy: function (rightValue) {
	            var variable = this;

	            variable.setValue(variable.getValue().subtract(rightValue));
	        },

	        getValue: function () {
	            var variable = this;

	            if (variable.value) {
	                return variable.value;
	            }

	            if (variable.reference) {
	                return variable.reference.getValue();
	            }

	            variable.callStack.raiseError(PHPError.E_NOTICE, 'Undefined variable: ' + variable.name);

	            return variable.valueFactory.createNull();
	        },

	        getNative: function () {
	            return this.getValue().getNative();
	        },

	        getReference: function () {
	            return new VariableReference(this);
	        },

	        incrementBy: function (rightValue) {
	            var variable = this;

	            variable.setValue(variable.getValue().add(rightValue));
	        },

	        isDefined: function () {
	            var variable = this;

	            return variable.value || variable.reference;
	        },

	        isSet: function () {
	            var variable = this;

	            return variable.isDefined() && variable.getValue().isSet();
	        },

	        postDecrement: function () {
	            var variable = this,
	                decrementedValue = variable.value.decrement(),
	                result = variable.value;

	            if (decrementedValue) {
	                variable.value = decrementedValue;
	            }

	            return result;
	        },

	        preDecrement: function () {
	            var variable = this,
	                decrementedValue = variable.value.decrement();

	            if (decrementedValue) {
	                variable.value = decrementedValue;
	            }

	            return variable.value;
	        },

	        postIncrement: function () {
	            var variable = this,
	                incrementedValue = variable.value.increment(),
	                result = variable.value;

	            if (incrementedValue) {
	                variable.value = incrementedValue;
	            }

	            return result;
	        },

	        preIncrement: function () {
	            var variable = this,
	                incrementedValue = variable.value.increment();

	            if (incrementedValue) {
	                variable.value = incrementedValue;
	            }

	            return variable.value;
	        },

	        setValue: function (value) {
	            var variable = this;

	            if (variable.reference) {
	                variable.reference.setValue(value);
	            } else {
	                variable.value = value.getForAssignment();
	            }

	            return value;
	        },

	        setReference: function (reference) {
	            var variable = this;

	            variable.reference = reference;
	            variable.value = null;
	        },

	        toArray: function () {
	            return this.value.toArray();
	        },

	        toBoolean: function () {
	            return this.value.toBoolean();
	        },

	        toFloat: function () {
	            return this.value.toFloat();
	        },

	        toInteger: function () {
	            return this.value.toInteger();
	        },

	        toValue: function () {
	            return this.getValue();
	        },

	        unwrapForJS: function () {
	            var value = this;

	            return value.value ? value.value.unwrapForJS() : null;
	        }
	    });

	    return Variable;
	}, {strict: true});


/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function VariableReference(variable) {
	    this.variable = variable;
	}

	_.extend(VariableReference.prototype, {
	    getValue: function () {
	        return this.variable.getValue();
	    },

	    setValue: function (value) {
	        this.variable.setValue(value);
	    }
	});

	module.exports = VariableReference;


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function Environment(state, parser, options) {
	    this.options = options;
	    this.parser = parser;
	    this.state = state;
	}

	_.extend(Environment.prototype, {
	    expose: function (object, name) {
	        this.state.getGlobalScope().expose(object, name);
	    },

	    getOptions: function () {
	        return this.options;
	    },

	    getParser: function () {
	        return this.parser;
	    },

	    getState: function () {
	        return this.state;
	    },

	    getStderr: function () {
	        return this.state.getStderr();
	    },

	    getStdin: function () {
	        return this.state.getStdin();
	    },

	    getStdout: function () {
	        return this.state.getStdout();
	    }
	});

	module.exports = Environment;


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(140),
	    __webpack_require__(164)
	], function (
	    _,
	    PHPState,
	    Stream
	) {
	    function Runtime(Environment, Engine, phpCommon, pausable, phpToAST, phpToJS) {
	        this.builtins = {
	            classes: {},
	            constantGroups: [],
	            functionGroups: []
	        };
	        this.Engine = Engine;
	        this.Environment = Environment;
	        this.pausable = pausable;
	        this.phpCommon = phpCommon;
	        this.phpToAST = phpToAST;
	        this.phpToJS = phpToJS;
	    }

	    _.extend(Runtime.prototype, {
	        compile: function (wrapper) {
	            var runtime = this,
	                pausable = runtime.pausable,
	                phpCommon = runtime.phpCommon,
	                phpToAST = runtime.phpToAST,
	                phpToJS = runtime.phpToJS;

	            return function (options, environment) {
	                if (environment) {
	                    options = _.extend({}, environment.getOptions(), options);
	                } else {
	                    environment = runtime.createEnvironment(options);
	                }

	                return new runtime.Engine(
	                    runtime,
	                    environment,
	                    phpCommon,
	                    options,
	                    wrapper,
	                    pausable,
	                    phpToAST,
	                    phpToJS
	                );
	            };
	        },

	        createEnvironment: function (options) {
	            var runtime = this,
	                stdin = new Stream(),
	                stdout = new Stream(),
	                stderr = new Stream(),
	                parser = runtime.phpToAST.create(stderr),
	                state = new PHPState(runtime.builtins, stdin, stdout, stderr, runtime.pausable);

	            return new runtime.Environment(state, parser, options);
	        },

	        install: function (newBuiltins) {
	            var builtins = this.builtins;

	            [].push.apply(builtins.functionGroups, newBuiltins.functionGroups);
	            _.extend(builtins.classes, newBuiltins.classes);
	            [].push.apply(builtins.constantGroups, newBuiltins.constantGroups);
	        }
	    });

	    return Runtime;
	}, {strict: true});


/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(141),
	    __webpack_require__(22),
	    __webpack_require__(147),
	    __webpack_require__(148),
	    __webpack_require__(149),
	    __webpack_require__(150),
	    __webpack_require__(153),
	    __webpack_require__(135),
	    __webpack_require__(154)
	], function (
	    _,
	    builtinTypes,
	    util,
	    CallStack,
	    ClassAutoloader,
	    INIState,
	    Namespace,
	    ReferenceFactory,
	    Scope,
	    ValueFactory
	) {
	    var EXCEPTION_CLASS = 'Exception',
	        setUpState = function (state, installedBuiltinTypes) {
	            var globalNamespace = state.globalNamespace,
	                internals = {
	                    callStack: state.callStack,
	                    classAutoloader: state.classAutoloader,
	                    globalNamespace: globalNamespace,
	                    iniState: state.iniState,
	                    pausable: state.pausable,
	                    stdout: state.stdout,
	                    valueFactory: state.valueFactory
	                };

	            function installFunctionGroup(groupFactory) {
	                var groupBuiltins = groupFactory(internals);

	                _.each(groupBuiltins, function (fn, name) {
	                    globalNamespace.defineFunction(name, fn);
	                });
	            }

	            function installClass(classFactory, name) {
	                var Class = classFactory(internals);

	                if (name === EXCEPTION_CLASS) {
	                    state.PHPException = Class;
	                }

	                globalNamespace.defineClass(name, Class);
	            }

	            function installConstantGroup(groupFactory) {
	                var groupBuiltins = groupFactory(internals);

	                _.each(groupBuiltins, function (value, name) {
	                    globalNamespace.defineConstant(name, state.valueFactory.coerce(value));
	                });
	            }

	            // Core builtins
	            _.each(builtinTypes.functionGroups, installFunctionGroup);
	            _.forOwn(builtinTypes.classes, installClass);
	            _.each(builtinTypes.constantGroups, installConstantGroup);

	            // Optional installed builtins
	            _.each(installedBuiltinTypes.functionGroups, installFunctionGroup);
	            _.forOwn(installedBuiltinTypes.classes, installClass);
	            _.each(installedBuiltinTypes.constantGroups, installConstantGroup);
	        };

	    function PHPState(installedBuiltinTypes, stdin, stdout, stderr, pausable) {
	        var callStack = new CallStack(stderr),
	            valueFactory = new ValueFactory(pausable, callStack),
	            classAutoloader = new ClassAutoloader(valueFactory),
	            globalNamespace = new Namespace(callStack, valueFactory, classAutoloader, null, '');

	        classAutoloader.setGlobalNamespace(globalNamespace);
	        valueFactory.setGlobalNamespace(globalNamespace);

	        this.callStack = callStack;
	        this.globalNamespace = globalNamespace;
	        this.globalScope = new Scope(callStack, valueFactory, null, null);
	        this.iniState = new INIState();
	        this.referenceFactory = new ReferenceFactory(valueFactory);
	        this.callStack = callStack;
	        this.classAutoloader = classAutoloader;
	        this.pausable = pausable;
	        this.stderr = stderr;
	        this.stdin = stdin;
	        this.stdout = stdout;
	        this.valueFactory = valueFactory;
	        this.PHPException = null;

	        setUpState(this, installedBuiltinTypes);
	    }

	    _.extend(PHPState.prototype, {
	        getCallStack: function () {
	            return this.callStack;
	        },

	        getGlobalNamespace: function () {
	            return this.globalNamespace;
	        },

	        getGlobalScope: function () {
	            return this.globalScope;
	        },

	        getPHPExceptionClass: function () {
	            return this.PHPException;
	        },

	        getReferenceFactory: function () {
	            return this.referenceFactory;
	        },

	        getStderr: function () {
	            return this.stderr;
	        },

	        getStdin: function () {
	            return this.stdin;
	        },

	        getStdout: function () {
	            return this.stdout;
	        },

	        getValueFactory: function () {
	            return this.valueFactory;
	        }
	    });

	    return PHPState;
	}, {strict: true});


/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(142),
	    __webpack_require__(143),
	    __webpack_require__(144),
	    __webpack_require__(145),
	    __webpack_require__(146)
	], function (
	    splFunctions,
	    stdClass,
	    Closure,
	    Exception,
	    JSObject
	) {
	    return {
	        classes: {
	            'stdClass': stdClass,
	            'Closure': Closure,
	            'Exception': Exception,
	            'JSObject': JSObject
	        },
	        constantGroups: [],
	        functionGroups: [
	            splFunctions
	        ]
	    };
	}, {strict: true});


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(136)
	], function (
	    Variable
	) {
	    return function (internals) {
	        var classAutoloader = internals.classAutoloader,
	            valueFactory = internals.valueFactory;

	        return {
	            'spl_autoload_register': function (callableReference) {
	                var isReference = (callableReference instanceof Variable),
	                    callableValue = isReference ? callableReference.getValue() : callableReference;

	                classAutoloader.appendAutoloadCallable(callableValue);
	            },
	            'spl_autoload_unregister': function (callableReference) {
	                var isReference = (callableReference instanceof Variable),
	                    callableValue = isReference ? callableReference.getValue() : callableReference;

	                return valueFactory.createBoolean(
	                    classAutoloader.removeAutoloadCallable(callableValue)
	                );
	            }
	        };
	    };
	}, {strict: true});


/***/ },
/* 143 */
/***/ function(module, exports) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = function () {
	    function stdClass() {

	    }

	    return stdClass;
	};


/***/ },
/* 144 */
/***/ function(module, exports) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = function () {
	    function Closure() {

	    }

	    return Closure;
	};


/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    phpCommon = __webpack_require__(20),
	    util = __webpack_require__(22),
	    PHPError = phpCommon.PHPError;

	module.exports = function () {
	    function Exception() {

	    }

	    util.inherits(Exception, PHPError);

	    _.extend(Exception.prototype, {

	    });

	    return Exception;
	};


/***/ },
/* 146 */
/***/ function(module, exports) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = function () {
	    function JSObject() {

	    }

	    return JSObject;
	};


/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    phpCommon = __webpack_require__(20),
	    PHPError = phpCommon.PHPError;

	function CallStack(stderr) {
	    this.calls = [];
	    this.stderr = stderr;
	}

	_.extend(CallStack.prototype, {
	    getCurrent: function () {
	        var chain = this;

	        return chain.calls[chain.calls.length - 1];
	    },

	    pop: function () {
	        this.calls.pop();
	    },

	    push: function (call) {
	        this.calls.push(call);
	    },

	    raiseError: function (level, message) {
	        var call,
	            chain = this,
	            calls = chain.calls,
	            error,
	            index = 0;

	        for (index = calls.length - 1; index >= 0; --index) {
	            call = calls[index];

	            if (call.getScope().suppressesErrors()) {
	                return;
	            }
	        }

	        error = new PHPError(level, message);

	        chain.stderr.write(error.message + '\n');
	    }
	});

	module.exports = CallStack;


/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6)
	], function (
	    _
	) {
	    var MAGIC_AUTOLOAD_FUNCTION = '__autoload';

	    function ClassAutoloader(valueFactory) {
	        this.globalNamespace = null;
	        this.splStack = null;
	        this.valueFactory = valueFactory;
	    }

	    _.extend(ClassAutoloader.prototype, {
	        appendAutoloadCallable: function (autoloadCallable) {
	            var autoloader = this,
	                splStack = autoloader.splStack;

	            if (!splStack) {
	                splStack = [];
	                autoloader.splStack = splStack;
	            }

	            splStack.push(autoloadCallable);
	        },

	        autoloadClass: function (name) {
	            var autoloader = this,
	                globalNamespace = autoloader.globalNamespace,
	                magicAutoloadFunction,
	                splStack = autoloader.splStack;

	            if (splStack) {
	                _.each(splStack, function (autoloadCallable) {
	                    autoloadCallable.call([autoloader.valueFactory.createString(name)], globalNamespace);

	                    if (globalNamespace.hasClass(name)) {
	                        // Autoloader has defined the class: no need to call any further autoloaders
	                        return false;
	                    }
	                });
	            } else {
	                magicAutoloadFunction = globalNamespace.getOwnFunction(MAGIC_AUTOLOAD_FUNCTION);

	                if (magicAutoloadFunction) {
	                    magicAutoloadFunction(autoloader.valueFactory.createString(name));
	                }
	            }
	        },

	        removeAutoloadCallable: function (autoloadCallable) {
	            var found = false,
	                splStack = this.splStack;

	            if (!splStack) {
	                // SPL stack has not been enabled: nothing to do
	                return false;
	            }

	            _.each(splStack, function (existingAutoloadCallable, index) {
	                // Callables may be different value types or different objects,
	                // so compare using the *Value API
	                if (existingAutoloadCallable.isEqualTo(autoloadCallable).getNative()) {
	                    found = true;
	                    splStack.splice(index, 1);
	                    return false;
	                }
	            });

	            return found;
	        },

	        setGlobalNamespace: function (globalNamespace) {
	            this.globalNamespace = globalNamespace;
	        }
	    });

	    return ClassAutoloader;
	}, {strict: true});


/***/ },
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function INIState() {
	    this.settings = {
	        'include_path': '.'
	    };
	}

	_.extend(INIState.prototype, {
	    get: function (name) {
	        return this.settings[name];
	    },

	    set: function (name, value) {
	        this.settings[name] = value;
	    }
	});

	module.exports = INIState;


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(20),
	    __webpack_require__(151)
	], function (
	    _,
	    phpCommon,
	    Class
	) {
	    var IS_STATIC = 'isStatic',
	        hasOwn = {}.hasOwnProperty,
	        PHPError = phpCommon.PHPError,
	        PHPFatalError = phpCommon.PHPFatalError;

	    function Namespace(callStack, valueFactory, classAutoloader, parent, name) {
	        this.callStack = callStack;
	        this.children = {};
	        this.classAutoloader = classAutoloader;
	        this.classes = {};
	        this.constants = {};
	        this.functions = {};
	        this.name = name;
	        this.parent = parent;
	        this.valueFactory = valueFactory;
	    }

	    _.extend(Namespace.prototype, {
	        defineClass: function (name, definition, namespaceScope) {
	            var classObject,
	                constants,
	                constructorName = null,
	                methodData = {},
	                namespace = this,
	                staticProperties,
	                InternalClass;

	            if (_.isFunction(definition)) {
	                InternalClass = definition;
	            } else {
	                InternalClass = function () {
	                    var instance = this;

	                    if (definition.superClass) {
	                        definition.superClass.getInternalClass().call(this);
	                    }

	                    _.each(definition.properties, function (value, name) {
	                        instance[name] = value;
	                    });
	                };

	                // Prevent native 'constructor' property from erroneously being detected as PHP class method
	                delete InternalClass.prototype.constructor;

	                if (definition.superClass) {
	                    InternalClass.prototype = Object.create(definition.superClass.getInternalClass().prototype);
	                }

	                _.each(definition.methods, function (data, methodName) {
	                    // PHP5-style __construct magic method takes precedence
	                    if (methodName === '__construct') {
	                        if (constructorName) {
	                            namespace.callStack.raiseError(PHPError.E_STRICT, 'Redefining already defined constructor for class ' + name);
	                        }

	                        constructorName = methodName;
	                    }

	                    if (!constructorName && methodName === name) {
	                        constructorName = methodName;
	                    }

	                    data.method[IS_STATIC] = data[IS_STATIC];
	                    data.method.data = methodData;

	                    InternalClass.prototype[methodName] = data.method;
	                });

	                staticProperties = definition.staticProperties;
	                constants = definition.constants;
	            }

	            classObject = new Class(
	                namespace.valueFactory,
	                namespace.callStack,
	                namespace.getPrefix() + name,
	                constructorName,
	                InternalClass,
	                staticProperties,
	                constants,
	                definition.superClass,
	                definition.interfaces,
	                namespaceScope
	            );

	            methodData.classObject = classObject;

	            namespace.classes[name.toLowerCase()] = classObject;

	            return classObject;
	        },

	        defineConstant: function (name, value, options) {
	            var caseInsensitive;

	            options = options || {};

	            caseInsensitive = options.caseInsensitive;

	            if (caseInsensitive) {
	                name = name.toLowerCase();
	            }

	            this.constants[name] = {
	                caseInsensitive: caseInsensitive,
	                value: value
	            };
	        },

	        defineFunction: function (name, func) {
	            var namespace = this;

	            if (namespace.name === '') {
	                if (/__autoload/i.test(name) && func.length !== 1) {
	                    throw new PHPFatalError(PHPFatalError.EXPECT_EXACTLY_1_ARG, {name: name.toLowerCase()});
	                }
	            }

	            namespace.functions[name] = func;
	        },

	        getClass: function (name) {
	            var lowerName = name.toLowerCase(),
	                namespace = this,
	                parsed = namespace.parseClassName(name);

	            if (parsed) {
	                return parsed.namespace.getClass(parsed.name);
	            }

	            if (!hasOwn.call(namespace.classes, lowerName)) {
	                // Try to autoload the class
	                namespace.classAutoloader.autoloadClass(namespace.getPrefix() + name);

	                // Raise an error if it is still not defined
	                if (!hasOwn.call(namespace.classes, lowerName)) {
	                    throw new PHPFatalError(PHPFatalError.CLASS_NOT_FOUND, {name: namespace.getPrefix() + name});
	                }
	            }

	            return namespace.classes[lowerName];
	        },

	        getConstant: function (name, usesNamespace) {
	            var globalNamespace,
	                lowercaseName,
	                namespace = this;

	            if (hasOwn.call(namespace.constants, name)) {
	                return namespace.constants[name].value;
	            }

	            lowercaseName = name.toLowerCase();

	            if (
	                hasOwn.call(namespace.constants, lowercaseName) &&
	                namespace.constants[lowercaseName].caseInsensitive
	            ) {
	                return namespace.constants[lowercaseName].value;
	            }

	            globalNamespace = namespace.getGlobal();

	            if (hasOwn.call(globalNamespace.constants, name)) {
	                return globalNamespace.constants[name].value;
	            }

	            if (
	                hasOwn.call(globalNamespace.constants, lowercaseName) &&
	                globalNamespace.constants[lowercaseName].caseInsensitive
	            ) {
	                return globalNamespace.constants[lowercaseName].value;
	            }

	            if (usesNamespace) {
	                throw new PHPFatalError(PHPFatalError.UNDEFINED_CONSTANT, {name: namespace.getPrefix() + name});
	            } else {
	                namespace.callStack.raiseError(PHPError.E_NOTICE, 'Use of undefined constant ' + name + ' - assumed \'' + name + '\'');

	                return this.valueFactory.createString(name);
	            }
	        },

	        getDescendant: function (name) {
	            var namespace = this;

	            _.each(name.split('\\'), function (part) {
	                if (!hasOwn.call(namespace.children, part)) {
	                    namespace.children[part] = new Namespace(
	                        namespace.callStack,
	                        namespace.valueFactory,
	                        namespace.classAutoloader,
	                        namespace,
	                        part
	                    );
	                }

	                namespace = namespace.children[part];
	            });

	            return namespace;
	        },

	        getFunction: function (name) {
	            var globalNamespace,
	                match,
	                namespace = this,
	                path,
	                subNamespace;

	            if (_.isFunction(name)) {
	                return name;
	            }

	            match = name.match(/^(.*?)\\([^\\]+)$/);

	            if (match) {
	                path = match[1];
	                name = match[2];

	                subNamespace = namespace.getDescendant(path);

	                return subNamespace.getFunction(name);
	            }

	            if (hasOwn.call(namespace.functions, name)) {
	                return namespace.functions[name];
	            }

	            globalNamespace = namespace.getGlobal();

	            if (hasOwn.call(globalNamespace.functions, name)) {
	                return globalNamespace.functions[name];
	            }

	            throw new PHPFatalError(PHPFatalError.CALL_TO_UNDEFINED_FUNCTION, {name: namespace.getPrefix() + name});
	        },

	        getGlobal: function () {
	            var namespace = this;

	            return namespace.name === '' ? namespace : namespace.getParent().getGlobal();
	        },

	        getGlobalNamespace: function () {
	            return this.getGlobal();
	        },

	        getOwnFunction: function (name) {
	            var namespace = this;

	            if (hasOwn.call(namespace.functions, name)) {
	                return namespace.functions[name];
	            }

	            return null;
	        },

	        getParent: function () {
	            return this.parent;
	        },

	        getPrefix: function () {
	            var namespace = this;

	            if (namespace.name === '') {
	                return '';
	            }

	            return (namespace.parent ? namespace.parent.getPrefix() : '') + namespace.name + '\\';
	        },

	        hasClass: function (name) {
	            var lowerName = name.toLowerCase(),
	                namespace = this,
	                parsed = namespace.parseClassName(name);

	            if (parsed) {
	                return parsed.namespace.hasClass(parsed.name);
	            }

	            return hasOwn.call(namespace.classes, lowerName);
	        },

	        parseClassName: function (name) {
	            var match = name.match(/^(.*?)\\([^\\]+)$/),
	                namespace = this,
	                path,
	                subNamespace;

	            if (match) {
	                path = match[1];
	                name = match[2];

	                subNamespace = namespace.getDescendant(path);

	                return {
	                    namespace: subNamespace,
	                    name: name
	                };
	            }

	            return null;
	        }
	    });

	    return Namespace;
	}, {strict: true});


/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(20),
	    __webpack_require__(152)
	], function (
	    _,
	    phpCommon,
	    StaticPropertyReference
	) {
	    var IS_STATIC = 'isStatic',
	        VALUE = 'value',
	        VISIBILITY = 'visibility',
	        hasOwn = {}.hasOwnProperty,
	        PHPError = phpCommon.PHPError,
	        PHPFatalError = phpCommon.PHPFatalError;

	    function Class(
	        valueFactory,
	        callStack,
	        name,
	        constructorName,
	        InternalClass,
	        staticPropertiesData,
	        constants,
	        superClass,
	        interfaceNames,
	        namespaceScope
	    ) {
	        var classObject = this,
	            staticProperties = {};

	        this.callStack = callStack;
	        this.constants = constants;
	        this.constructorName = constructorName;
	        this.interfaceNames = interfaceNames || [];
	        this.InternalClass = InternalClass;
	        this.name = name;
	        this.namespaceScope = namespaceScope;
	        this.staticProperties = staticProperties;
	        this.superClass = superClass;
	        this.valueFactory = valueFactory;

	        _.each(staticPropertiesData, function (data, name) {
	            staticProperties[name] = new StaticPropertyReference(classObject, name, data[VISIBILITY], data[VALUE]);
	        });
	    }

	    _.extend(Class.prototype, {
	        callStaticMethod: function (name, args) {
	            var classObject = this,
	                defined = true,
	                method,
	                prototype = classObject.InternalClass.prototype,
	                otherPrototype;

	            // Allow methods inherited via the prototype chain up to but not including Object.prototype
	            if (!hasOwn.call(prototype, name)) {
	                otherPrototype = prototype;

	                do {
	                    otherPrototype = Object.getPrototypeOf(otherPrototype);
	                    if (!otherPrototype || otherPrototype === Object.prototype) {
	                        defined = false;
	                        break;
	                    }
	                } while (!hasOwn.call(otherPrototype, name));
	            }

	            method = prototype[name];

	            if (!defined || !_.isFunction(method)) {
	                throw new PHPFatalError(PHPFatalError.CALL_TO_UNDEFINED_METHOD, {
	                    className: classObject.name,
	                    methodName: name
	                });
	            }

	            if (!method[IS_STATIC]) {
	                classObject.callStack.raiseError(PHPError.E_STRICT, 'Non-static method ' + method.data.classObject.name + '::' + name + '() should not be called statically');
	            }

	            return classObject.valueFactory.coerce(method.apply(null, args));
	        },

	        extends: function (superClass) {
	            var classObject = this;

	            return classObject.superClass && (classObject.superClass.name === superClass.name || classObject.superClass.extends(superClass));
	        },

	        getConstantByName: function self(name) {
	            var classObject = this,
	                i,
	                interfaceObject;

	            if (hasOwn.call(classObject.constants, name)) {
	                return classObject.constants[name]();
	            }

	            if (classObject.superClass) {
	                return classObject.superClass.getConstantByName(name);
	            }

	            for (i = 0; i < classObject.interfaceNames.length; i++) {
	                interfaceObject = classObject.namespaceScope.getClass(classObject.interfaceNames[i]);

	                try {
	                    return interfaceObject.getConstantByName(name);
	                } catch (e) {
	                    console.log('hmm');
	                }
	            }

	            throw new PHPFatalError(PHPFatalError.UNDEFINED_CLASS_CONSTANT, {
	                name: name
	            });
	        },

	        getInternalClass: function () {
	            return this.InternalClass;
	        },

	        getName: function () {
	            return this.name;
	        },

	        getUnprefixedName: function () {
	            return this.name.replace(/^.*\\/, '');
	        },

	        getStaticPropertyByName: function (name) {
	            var classObject = this,
	                currentClass,
	                staticProperty;

	            if (!hasOwn.call(classObject.staticProperties, name)) {
	                throw new PHPFatalError(PHPFatalError.UNDECLARED_STATIC_PROPERTY, {
	                    className: classObject.name,
	                    propertyName: name
	                });
	            }

	            staticProperty = classObject.staticProperties[name];

	            // Property is private; may only be read from methods of this class and not derivatives
	            if (staticProperty.getVisibility() === 'private') {
	                currentClass = classObject.callStack.getCurrent().getScope().getCurrentClass();

	                if (!currentClass || currentClass.name !== classObject.name) {
	                    throw new PHPFatalError(PHPFatalError.CANNOT_ACCESS_PROPERTY, {
	                        className: classObject.name,
	                        propertyName: name,
	                        visibility: 'private'
	                    });
	                }
	                // Property is protected; may be read from methods of this class and methods of derivatives
	            } else if (staticProperty.getVisibility() === 'protected') {
	                currentClass = classObject.callStack.getCurrent().getScope().getCurrentClass();

	                if (!currentClass || (classObject.name !== currentClass.name && !currentClass.extends(classObject))) {
	                    throw new PHPFatalError(PHPFatalError.CANNOT_ACCESS_PROPERTY, {
	                        className: classObject.name,
	                        propertyName: name,
	                        visibility: 'protected'
	                    });
	                }
	            }

	            return staticProperty;
	        },

	        hasStaticPropertyByName: function (name) {
	            return hasOwn.call(this.staticProperties, name);
	        },

	        instantiate: function (args) {
	            var classObject = this,
	                nativeObject = new classObject.InternalClass(),
	                objectValue = classObject.valueFactory.createObject(nativeObject, classObject);

	            if (classObject.constructorName) {
	                objectValue.callMethod(classObject.constructorName, args);
	            }

	            return objectValue;
	        }
	    });

	    return Class;
	}, {strict: true});


/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6);

	function StaticPropertyReference(classObject, name, visibility, value) {
	    this.classObject = classObject;
	    this.name = name;
	    this.reference = null;
	    this.value = value;
	    this.visibility = visibility;
	}

	_.extend(StaticPropertyReference.prototype, {
	    getName: function () {
	        return this.name;
	    },

	    getValue: function () {
	        var property = this;

	        return property.value ? property.value : property.reference.getValue();
	    },

	    getVisibility: function () {
	        return this.visibility;
	    },

	    isReference: function () {
	        return !!this.reference;
	    },

	    setReference: function (reference) {
	        var property = this;

	        property.reference = reference;
	        property.value = null;
	    },

	    setValue: function (value) {
	        var property = this;

	        if (property.reference) {
	            property.reference.setValue(value);
	        } else {
	            property.value = value.getForAssignment();
	        }
	    }
	});

	module.exports = StaticPropertyReference;


/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(130)
	], function (
	    _,
	    NullReference
	) {
	    function ReferenceFactory(valueFactory) {
	        this.valueFactory = valueFactory;
	    }

	    _.extend(ReferenceFactory.prototype, {
	        createNull: function () {
	            return new NullReference(this.valueFactory);
	        }
	    });

	    return ReferenceFactory;
	}, {strict: true});


/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(20),
	    __webpack_require__(155),
	    __webpack_require__(157),
	    __webpack_require__(159),
	    __webpack_require__(160),
	    __webpack_require__(161),
	    __webpack_require__(162),
	    __webpack_require__(129),
	    __webpack_require__(163),
	    __webpack_require__(158),
	    __webpack_require__(132)
	], function (
	    _,
	    phpCommon,
	    ArrayValue,
	    BarewordStringValue,
	    BooleanValue,
	    FloatValue,
	    IntegerValue,
	    NullValue,
	    ObjectValue,
	    PHPObject,
	    StringValue,
	    Value
	) {
	    function ValueFactory(pausable, callStack) {
	        this.nextObjectID = 1;
	        this.callStack = callStack;
	        this.globalNamespace = null;
	        this.pausable = pausable;
	    }

	    _.extend(ValueFactory.prototype, {
	        coerce: function (value) {
	            if (value instanceof Value) {
	                return value;
	            }

	            return this.createFromNative(value);
	        },
	        createArray: function (value) {
	            var factory = this;

	            return new ArrayValue(factory, factory.callStack, value);
	        },
	        createBarewordString: function (value) {
	            var factory = this;

	            return new BarewordStringValue(factory, factory.callStack, value);
	        },
	        createBoolean: function (value) {
	            var factory = this;

	            return new BooleanValue(factory, factory.callStack, value);
	        },
	        createFloat: function (value) {
	            var factory = this;

	            return new FloatValue(factory, factory.callStack, value);
	        },
	        createFromNative: function (nativeValue) {
	            var factory = this;

	            if (nativeValue === null || typeof nativeValue === 'undefined') {
	                return factory.createNull();
	            }

	            if (_.isString(nativeValue)) {
	                return factory.createString(nativeValue);
	            }

	            if (_.isNumber(nativeValue)) {
	                return factory.createInteger(nativeValue);
	            }

	            if (_.isBoolean(nativeValue)) {
	                return factory.createBoolean(nativeValue);
	            }

	            if (_.isArray(nativeValue)) {
	                return factory.createArray(nativeValue);
	            }

	            return factory.createObject(nativeValue, factory.globalNamespace.getClass('JSObject'));
	        },
	        createInteger: function (value) {
	            var factory = this;

	            return new IntegerValue(factory, factory.callStack, value);
	        },
	        createNull: function () {
	            var factory = this;

	            return new NullValue(factory, factory.callStack);
	        },
	        createObject: function (value, classObject) {
	            var factory = this;

	            // Object ID tracking is incomplete: ID should be freed when all references are lost
	            return new ObjectValue(factory, factory.callStack, value, classObject, factory.nextObjectID++);
	        },
	        createPHPObject: function (object) {
	            var factory = this;

	            return new PHPObject(factory.pausable, factory, object);
	        },
	        createString: function (value) {
	            var factory = this;

	            return new StringValue(factory, factory.callStack, value);
	        },
	        isValue: function (object) {
	            return object instanceof Value;
	        },
	        setGlobalNamespace: function (globalNamespace) {
	            this.globalNamespace = globalNamespace;
	        }
	    });

	    return ValueFactory;
	}, {strict: true});


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(20),
	    __webpack_require__(22),
	    __webpack_require__(156),
	    __webpack_require__(126),
	    __webpack_require__(130),
	    __webpack_require__(132),
	    __webpack_require__(136)
	], function (
	    _,
	    phpCommon,
	    util,
	    ElementReference,
	    KeyValuePair,
	    NullReference,
	    Value,
	    Variable
	) {
	    var hasOwn = {}.hasOwnProperty,
	        PHPError = phpCommon.PHPError,
	        PHPFatalError = phpCommon.PHPFatalError;

	    function ArrayValue(factory, callStack, orderedElements, type) {
	        var elements = [],
	            keysToElements = [],
	            value = this;

	        _.each(orderedElements, function (element, key) {
	            if (element instanceof KeyValuePair) {
	                key = element.getKey();
	                element = element.getValue();
	            } else {
	                if (_.isNumber(key)) {
	                    key = factory.createInteger(keysToElements.length);
	                } else {
	                    key = factory.createFromNative(key);
	                }

	                if (element instanceof Variable) {
	                    element = element.getValue();
	                } else {
	                    element = factory.coerce(element);
	                }
	            }

	            element = new ElementReference(factory, callStack, value, key, element);

	            elements.push(element);
	            keysToElements[key.getNative()] = element;
	        });

	        Value.call(this, factory, callStack, type || 'array', elements);

	        this.keysToElements = keysToElements;
	        this.pointer = 0;
	    }

	    util.inherits(ArrayValue, Value);

	    _.extend(ArrayValue.prototype, {
	        add: function (rightValue) {
	            return rightValue.addToArray(this);
	        },

	        addToArray: function (leftValue) {
	            var rightValue = this,
	                resultArray = leftValue.clone();

	            _.forOwn(rightValue.keysToElements, function (element, key) {
	                if (!hasOwn.call(resultArray.keysToElements, key)) {
	                    resultArray.getElementByKey(element.getKey()).setValue(element.getValue());
	                }
	            });

	            return resultArray;
	        },

	        addToBoolean: function () {
	            throw new PHPFatalError(PHPFatalError.UNSUPPORTED_OPERAND_TYPES);
	        },

	        addToFloat: function () {
	            throw new PHPFatalError(PHPFatalError.UNSUPPORTED_OPERAND_TYPES);
	        },

	        addToInteger: function () {
	            throw new PHPFatalError(PHPFatalError.UNSUPPORTED_OPERAND_TYPES);
	        },

	        addToNull: function () {
	            throw new PHPFatalError(PHPFatalError.UNSUPPORTED_OPERAND_TYPES);
	        },

	        addToObject: function (objectValue) {
	            return objectValue.addToArray(this);
	        },

	        addToString: function () {
	            throw new PHPFatalError(PHPFatalError.UNSUPPORTED_OPERAND_TYPES);
	        },

	        call: function (args, namespaceOrNamespaceScope) {
	            var value = this.value;

	            if (value.length < 2) {
	                throw new PHPFatalError(PHPFatalError.FUNCTION_NAME_MUST_BE_STRING);
	            }

	            return value[0].getValue().callMethod(value[1].getValue().getNative(), args, namespaceOrNamespaceScope);
	        },

	        clone: function () {
	            var arrayValue = this,
	                orderedElements = [];

	            _.each(arrayValue.value, function (element) {
	                if (element.isDefined()) {
	                    orderedElements.push(new KeyValuePair(element.getKey(), element.getValue()));
	                }
	            });

	            return new ArrayValue(arrayValue.factory, arrayValue.callStack, orderedElements, arrayValue.type);
	        },

	        coerceToArray: function () {
	            return this;
	        },

	        coerceToBoolean: function () {
	            var value = this;

	            return value.factory.createBoolean(value.value.length > 0);
	        },

	        coerceToInteger: function () {
	            var value = this;

	            return value.factory.createInteger(value.value.length === 0 ? 0 : 1);
	        },

	        coerceToKey: function () {
	            this.callStack.raiseError(PHPError.E_WARNING, 'Illegal offset type');
	        },

	        coerceToNumber: function () {
	            return this.coerceToInteger();
	        },

	        coerceToString: function () {
	            return this.factory.createString('Array');
	        },

	        getForAssignment: function () {
	            return this.clone();
	        },

	        getKeys: function () {
	            var keys = [];

	            _.each(this.value, function (element) {
	                keys.push(element.getKey());
	            });

	            return keys;
	        },

	        getNative: function () {
	            var result = [];

	            _.each(this.value, function (element) {
	                result[element.getKey().getNative()] = element.getValue().getNative();
	            });

	            return result;
	        },

	        getCurrentElement: function () {
	            var value = this;

	            return value.value[value.pointer] || value.factory.createNull();
	        },

	        getElementByKey: function (key) {
	            var element,
	                keyValue,
	                value = this;

	            key = key.coerceToKey(value.callStack);

	            if (!key) {
	                // Could not be coerced to a key: error will already have been handled, just return NULL
	                return new NullReference(value.factory);
	            }

	            keyValue = key.getNative();

	            if (!hasOwn.call(value.keysToElements, keyValue)) {
	                element = new ElementReference(value.factory, value.callStack, value, key, null);

	                value.value.push(element);
	                value.keysToElements[keyValue] = element;
	            }

	            return value.keysToElements[keyValue];
	        },

	        getElementByIndex: function (index) {
	            var value = this;

	            return value.value[index] || (function () {
	                    value.callStack.raiseError(PHPError.E_NOTICE, 'Undefined ' + value.referToElement(index));

	                    return new NullReference(value.factory);
	                }());
	        },

	        getKeyByIndex: function (index) {
	            var value = this,
	                element = value.value[index];

	            return element ? element.key : null;
	        },

	        getLength: function () {
	            return this.value.length;
	        },

	        getPointer: function () {
	            return this.pointer;
	        },

	        getValues: function () {
	            var values = [];

	            _.each(this.value, function (element) {
	                values.push(element.getValue());
	            });

	            return values;
	        },

	        isEqualTo: function (rightValue) {
	            return rightValue.isEqualToArray(this);
	        },

	        isEqualToNull: function () {
	            var value = this;

	            return value.factory.createBoolean(value.value.length === 0);
	        },

	        isEqualToArray: function (rightValue) {
	            var equal = true,
	                leftValue = this,
	                factory = leftValue.factory;

	            if (rightValue.value.length !== leftValue.value.length) {
	                return factory.createBoolean(false);
	            }

	            _.forOwn(rightValue.keysToElements, function (element, nativeKey) {
	                if (!hasOwn.call(leftValue.keysToElements, nativeKey) || element.getValue().isNotEqualTo(leftValue.keysToElements[nativeKey].getValue()).getNative()) {
	                    equal = false;
	                    return false;
	                }
	            });

	            return factory.createBoolean(equal);
	        },

	        isEqualToBoolean: function (rightValue) {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(rightValue.getNative() === (leftValue.value.length > 0));
	        },

	        isEqualToFloat: function () {
	            return this.factory.createBoolean(false);
	        },

	        isEqualToInteger: function () {
	            return this.factory.createBoolean(false);
	        },

	        isEqualToObject: function () {
	            return this.factory.createBoolean(false);
	        },

	        isEqualToString: function () {
	            return this.factory.createBoolean(false);
	        },

	        isIdenticalTo: function (rightValue) {
	            return rightValue.isIdenticalToArray(this);
	        },

	        isIdenticalToArray: function (rightValue) {
	            var identical = true,
	                leftValue = this,
	                factory = leftValue.factory;

	            if (rightValue.value.length !== leftValue.value.length) {
	                return factory.createBoolean(false);
	            }

	            _.each(rightValue.value, function (element, index) {
	                if (
	                    leftValue.value[index].getKey().isNotIdenticalTo(element.getKey()).getNative() ||
	                    leftValue.value[index].getValue().isNotIdenticalTo(element.getValue()).getNative()
	                ) {
	                    identical = false;
	                    return false;
	                }
	            });

	            return factory.createBoolean(identical);
	        },

	        next: function () {
	            this.pointer++;
	        },

	        onesComplement: function () {
	            throw new PHPFatalError(PHPFatalError.UNSUPPORTED_OPERAND_TYPES);
	        },

	        push: function (otherValue) {
	            var value = this,
	                index = value.factory.createInteger(value.getLength());

	            value.getElementByKey(index).setValue(otherValue);

	            return value;
	        },

	        referToElement: function (key) {
	            return 'offset: ' + key;
	        },

	        reset: function () {
	            var value = this;

	            value.pointer = 0;

	            return value;
	        },

	        setPointer: function (pointer) {
	            this.pointer = pointer;
	        },

	        shiftLeftBy: function (rightValue) {
	            return this.coerceToInteger().shiftLeftBy(rightValue);
	        },

	        shiftRightBy: function (rightValue) {
	            return this.coerceToInteger().shiftRightBy(rightValue);
	        }
	    });

	    return ArrayValue;
	}, {strict: true});


/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    phpCommon = __webpack_require__(20),
	    PHPError = phpCommon.PHPError;

	function ElementReference(valueFactory, callStack, arrayValue, key, value) {
	    this.arrayValue = arrayValue;
	    this.key = key;
	    this.reference = null;
	    this.callStack = callStack;
	    this.value = value;
	    this.valueFactory = valueFactory;
	}

	_.extend(ElementReference.prototype, {
	    clone: function () {
	        var element = this;

	        return new ElementReference(element.valueFactory, element.callStack, element.arrayValue, element.key, element.value);
	    },

	    getKey: function () {
	        return this.key;
	    },

	    getValue: function () {
	        var element = this;

	        // Special value of native null (vs. NullValue) represents undefined
	        if (!element.value && !element.reference) {
	            element.callStack.raiseError(PHPError.E_NOTICE, 'Undefined ' + element.arrayValue.referToElement(element.key.getNative()));
	            return element.valueFactory.createNull();
	        }

	        return element.value ? element.value : element.reference.getValue();
	    },

	    isDefined: function () {
	        var element = this;

	        return element.value || element.reference;
	    },

	    isReference: function () {
	        return !!this.reference;
	    },

	    setReference: function (reference) {
	        var element = this;

	        element.reference = reference;
	        element.value = null;
	    },

	    setValue: function (value) {
	        var element = this,
	            isFirstElement = (element.arrayValue.getLength() === 0);

	        if (element.reference) {
	            element.reference.setValue(value);
	        } else {
	            element.value = value.getForAssignment();
	        }

	        if (isFirstElement) {
	            element.arrayValue.setPointer(element.arrayValue.getKeys().indexOf(element.key.getNative().toString()));
	        }
	    }
	});

	module.exports = ElementReference;


/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(22),
	    __webpack_require__(158)
	], function (
	    _,
	    util,
	    StringValue
	) {
	    function BarewordStringValue(factory, callStack, value) {
	        StringValue.call(this, factory, callStack, value);
	    }

	    util.inherits(BarewordStringValue, StringValue);

	    _.extend(BarewordStringValue.prototype, {
	        call: function (args, namespaceOrNamespaceScope) {
	            return namespaceOrNamespaceScope.getFunction(this.value).apply(null, args);
	        }
	    });

	    return BarewordStringValue;
	}, {strict: true});


/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(22),
	    __webpack_require__(130),
	    __webpack_require__(132)
	], function (
	    _,
	    util,
	    NullReference,
	    Value
	) {
	    function StringValue(factory, callStack, value) {
	        Value.call(this, factory, callStack, 'string', value);
	    }

	    util.inherits(StringValue, Value);

	    _.extend(StringValue.prototype, {
	        add: function (rightValue) {
	            return rightValue.addToString(this);
	        },

	        addToBoolean: function (booleanValue) {
	            return this.coerceToNumber().add(booleanValue);
	        },

	        call: function (args, namespaceOrNamespaceScope) {
	            return namespaceOrNamespaceScope.getGlobalNamespace().getFunction(this.value).apply(null, args);
	        },

	        callMethod: function (name, args, namespaceScope) {
	            var value = this;

	            return value.callStaticMethod(value.factory.coerce(name), args, namespaceScope);
	        },

	        callStaticMethod: function (nameValue, args, namespaceScope) {
	            var value = this,
	                classObject = namespaceScope.getClass(value.value);

	            return classObject.callStaticMethod(nameValue.getNative(), args);
	        },

	        coerceToBoolean: function () {
	            return this.factory.createBoolean(this.value !== '' && this.value !== '0');
	        },

	        coerceToFloat: function () {
	            var value = this;

	            return value.factory.createFloat(/^(\d|-\d)/.test(value.value) ? parseFloat(value.value) : 0);
	        },

	        coerceToInteger: function () {
	            var value = this;

	            return value.factory.createInteger(/^(\d|-\d)/.test(value.value) ? parseInt(value.value, 10) : 0);
	        },

	        coerceToKey: function () {
	            return this;
	        },

	        coerceToNumber: function () {
	            var value = this,
	                isInteger = /^[^.eE]*$/.test(value.value);

	            if (isInteger) {
	                return value.coerceToInteger();
	            } else {
	                return value.coerceToFloat();
	            }
	        },

	        coerceToString: function () {
	            return this;
	        },

	        getConstantByName: function (name, namespaceScope) {
	            var value = this,
	                classObject = namespaceScope.getClass(value.value);

	            return classObject.getConstantByName(name);
	        },

	        getElementByKey: function (key) {
	            var keyValue,
	                value = this;

	            key = key.coerceToKey(value.callStack);

	            if (!key) {
	                // Could not be coerced to a key: error will already have been handled, just return NULL
	                return new NullReference(value.factory);
	            }

	            keyValue = key.getNative();

	            return value.factory.createString(value.value.charAt(keyValue));
	        },

	        getLength: function () {
	            return this.value.length;
	        },

	        getStaticPropertyByName: function (nameValue, namespaceScope) {
	            var value = this,
	                classObject = namespaceScope.getClass(value.value);

	            return classObject.getStaticPropertyByName(nameValue.getNative());
	        },

	        isEqualTo: function (rightValue) {
	            return rightValue.isEqualToString(this);
	        },

	        isEqualToNull: function () {
	            var value = this;

	            return value.factory.createBoolean(value.getNative() === '');
	        },

	        isEqualToObject: function () {
	            return this.factory.createBoolean(false);
	        },

	        isEqualToString: function (rightValue) {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(leftValue.value === rightValue.value);
	        },

	        onesComplement: function () {
	            return this.factory.createString('?');
	        }
	    });

	    return StringValue;
	}, {strict: true});


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(20),
	    __webpack_require__(22),
	    __webpack_require__(132)
	], function (
	    _,
	    phpCommon,
	    util,
	    Value
	) {
	    var PHPFatalError = phpCommon.PHPFatalError;

	    function BooleanValue(factory, callStack, value) {
	        Value.call(this, factory, callStack, 'boolean', !!value);
	    }

	    util.inherits(BooleanValue, Value);

	    _.extend(BooleanValue.prototype, {
	        add: function (rightValue) {
	            return rightValue.addToBoolean(this);
	        },

	        addToBoolean: function (rightValue) {
	            var value = this;

	            return value.factory.createInteger(value.value + rightValue.value);
	        },

	        addToInteger: function (integerValue) {
	            return integerValue.addToBoolean(this);
	        },

	        addToNull: function () {
	            return this.coerceToInteger();
	        },

	        addToObject: function (objectValue) {
	            return objectValue.addToBoolean(this);
	        },

	        coerceToBoolean: function () {
	            return this;
	        },

	        coerceToInteger: function () {
	            var value = this;

	            return value.factory.createInteger(value.value ? 1 : 0);
	        },

	        coerceToKey: function () {
	            return this.coerceToInteger();
	        },

	        coerceToNumber: function () {
	            return this.coerceToInteger();
	        },

	        coerceToString: function () {
	            var value = this;

	            return value.factory.createString(value.value ? '1' : '');
	        },

	        getElement: function () {
	            // Array access on booleans always returns null, no notice or warning is raised
	            return this.factory.createNull();
	        },

	        isEqualTo: function (rightValue) {
	            var leftValue = this,
	                factory = leftValue.factory;

	            return factory.createBoolean(rightValue.coerceToBoolean().value === leftValue.value);
	        },

	        isEqualToObject: function () {
	            return this;
	        },

	        isEqualToString: function (stringValue) {
	            var booleanValue = this;

	            return stringValue.factory.createBoolean(
	                stringValue.coerceToBoolean().getNative() === booleanValue.getNative()
	            );
	        },

	        onesComplement: function () {
	            throw new PHPFatalError(PHPFatalError.UNSUPPORTED_OPERAND_TYPES);
	        },

	        shiftLeftBy: function (rightValue) {
	            return this.coerceToInteger().shiftLeftBy(rightValue);
	        },

	        shiftRightBy: function (rightValue) {
	            return this.coerceToInteger().shiftRightBy(rightValue);
	        }
	    });

	    return BooleanValue;
	}, {strict: true});


/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(22),
	    __webpack_require__(132)
	], function (
	    _,
	    util,
	    Value
	) {
	    function FloatValue(factory, callStack, value) {
	        Value.call(this, factory, callStack, 'float', value);
	    }

	    util.inherits(FloatValue, Value);

	    _.extend(FloatValue.prototype, {
	        add: function (rightValue) {
	            return rightValue.addToFloat(this);
	        },

	        addToBoolean: function (booleanValue) {
	            var value = this;

	            return value.factory.createFloat(value.value + Number(booleanValue.value));
	        },

	        addToInteger: function (integerValue) {
	            var value = this;

	            return value.factory.createFloat(value.value + integerValue.value);
	        },

	        addToObject: function (objectValue) {
	            return objectValue.addToFloat(this);
	        },

	        addToNull: function () {
	            return this.coerceToNumber();
	        },

	        coerceToBoolean: function () {
	            var value = this;

	            return value.factory.createBoolean(!!value.value);
	        },

	        coerceToFloat: function () {
	            return this;
	        },

	        coerceToInteger: function () {
	            /*jshint bitwise: false */
	            var value = this;

	            return value.factory.createInteger(value.value >> 0);
	        },

	        coerceToKey: function () {
	            return this.coerceToInteger();
	        },

	        coerceToNumber: function () {
	            return this;
	        },

	        coerceToString: function () {
	            var value = this;

	            return value.factory.createString(value.value + '');
	        },

	        getElement: function () {
	            // Array access on floats always returns null, no notice or warning is raised
	            return this.factory.createNull();
	        },

	        isEqualTo: function (rightValue) {
	            return rightValue.isEqualToFloat(this);
	        },

	        isEqualToFloat: function (rightValue) {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(rightValue.value === leftValue.value);
	        },

	        isEqualToInteger: function (rightValue) {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(rightValue.coerceToFloat().value === leftValue.value);
	        },

	        isEqualToNull: function () {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(leftValue.value === 0);
	        },

	        isEqualToObject: function (objectValue) {
	            return objectValue.isEqualToFloat(this);
	        },

	        isEqualToString: function (stringValue) {
	            var floatValue = this;

	            return floatValue.factory.createBoolean(floatValue.value === stringValue.coerceToFloat().value);
	        },

	        onesComplement: function () {
	            /*jshint bitwise: false */
	            return this.factory.createInteger(~this.value);
	        },

	        shiftLeftBy: function (rightValue) {
	            return this.coerceToInteger().shiftLeftBy(rightValue);
	        },

	        shiftRightBy: function (rightValue) {
	            return this.coerceToInteger().shiftRightBy(rightValue);
	        },

	        subtract: function (rightValue) {
	            var leftValue = this,
	                factory = leftValue.factory;

	            rightValue = rightValue.coerceToNumber();

	            return factory.createFloat(leftValue.getNative() - rightValue.getNative());
	        },

	        toNegative: function () {
	            var value = this;

	            return value.factory.createFloat(-value.value);
	        },

	        toPositive: function () {
	            var value = this;

	            return value.factory.createInteger(+value.value);
	        }
	    });

	    return FloatValue;
	}, {strict: true});


/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(22),
	    __webpack_require__(132)
	], function (
	    _,
	    util,
	    Value
	) {
	    function IntegerValue(factory, callStack, value) {
	        Value.call(this, factory, callStack, 'integer', value);
	    }

	    util.inherits(IntegerValue, Value);

	    _.extend(IntegerValue.prototype, {
	        add: function (rightValue) {
	            return rightValue.addToInteger(this);
	        },

	        addToBoolean: function (booleanValue) {
	            var value = this;

	            return value.factory.createInteger(value.value + booleanValue.value);
	        },

	        addToInteger: function (rightValue) {
	            var value = this;

	            return value.factory.createInteger(value.value + rightValue.value);
	        },

	        coerceToBoolean: function () {
	            var value = this;

	            return value.factory.createBoolean(!!value.value);
	        },

	        coerceToFloat: function () {
	            var value = this;

	            return value.factory.createFloat(value.value);
	        },

	        coerceToInteger: function () {
	            return this;
	        },

	        coerceToKey: function () {
	            return this;
	        },

	        coerceToNumber: function () {
	            return this;
	        },

	        coerceToString: function () {
	            var value = this;

	            return value.factory.createString(value.value.toString());
	        },

	        decrement: function () {
	            var value = this;

	            return value.factory.createInteger(value.value - 1);
	        },

	        getElement: function () {
	            // Array access on integers always returns null, no notice or warning is raised
	            return this.factory.createNull();
	        },

	        increment: function () {
	            var value = this;

	            return value.factory.createInteger(value.value + 1);
	        },

	        isEqualTo: function (rightValue) {
	            return rightValue.isEqualToInteger(this);
	        },

	        isEqualToInteger: function (rightValue) {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(rightValue.value === leftValue.value);
	        },

	        isEqualToNull: function () {
	            var leftValue = this;

	            return leftValue.factory.createBoolean(leftValue.value === 0);
	        },

	        isEqualToObject: function (objectValue) {
	            return objectValue.isEqualToInteger(this);
	        },

	        isEqualToString: function (stringValue) {
	            var integerValue = this;

	            return integerValue.factory.createBoolean(integerValue.getNative() === parseFloat(stringValue.getNative()));
	        },

	        isLessThan: function (rightValue) {
	            var leftValue = this,
	                factory = leftValue.factory;

	            return factory.createBoolean(leftValue.getNative() < rightValue.getNative());
	        },

	        multiply: function (rightValue) {
	            var leftValue = this,
	                factory = leftValue.factory,
	                rightType = rightValue.getType();

	            // Coerce to float and return a float if either operand is a float
	            if (rightType === 'float') {
	                return factory.createFloat(leftValue.coerceToFloat().getNative() + rightValue.coerceToFloat().getNative());
	            }

	            return factory.createInteger(leftValue.getNative() * rightValue.getNative());
	        },

	        onesComplement: function () {
	            /*jshint bitwise: false */
	            return this.factory.createInteger(~this.value);
	        },

	        shiftLeftBy: function (rightValue) {
	            /*jshint bitwise: false */
	            var leftValue = this,
	                factory = leftValue.factory;

	            return factory.createInteger(leftValue.getNative() << rightValue.coerceToInteger().getNative());
	        },

	        shiftRightBy: function (rightValue) {
	            /*jshint bitwise: false */
	            var leftValue = this,
	                factory = leftValue.factory;

	            return factory.createInteger(leftValue.getNative() >> rightValue.coerceToInteger().getNative());
	        },

	        subtract: function (rightValue) {
	            var leftValue = this,
	                factory = leftValue.factory;

	            rightValue = rightValue.coerceToNumber();

	            // Coerce to float and return a float if either operand is a float
	            if (rightValue.getType() === 'float') {
	                return factory.createFloat(leftValue.coerceToFloat().getNative() - rightValue.coerceToFloat().getNative());
	            }

	            return factory.createInteger(leftValue.getNative() - rightValue.getNative());
	        },

	        subtractFromNull: function () {
	            var value = this;

	            return value.factory.createInteger(-value.getNative());
	        },

	        toNegative: function () {
	            var value = this;

	            return value.factory.createInteger(-value.value);
	        },

	        toPositive: function () {
	            var value = this;

	            return value.factory.createInteger(+value.value);
	        }
	    });

	    return IntegerValue;
	}, {strict: true});


/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	module.exports = __webpack_require__(123)([
	    __webpack_require__(6),
	    __webpack_require__(20),
	    __webpack_require__(22),
	    __webpack_require__(132)
	], function (
	    _,
	    phpCommon,
	    util,
	    Value
	) {
	    var PHPError = phpCommon.PHPError;

	    function NullValue(factory, callStack) {
	        Value.call(this, factory, callStack, 'null', null);
	    }

	    util.inherits(NullValue, Value);

	    _.extend(NullValue.prototype, {
	        add: function (rightValue) {
	            return rightValue.addToNull();
	        },

	        addToBoolean: function (booleanValue) {
	            return booleanValue.coerceToInteger();
	        },

	        coerceToArray: function () {
	            // Null just casts to an empty array
	            return this.factory.createArray();
	        },

	        coerceToBoolean: function () {
	            return this.factory.createBoolean(false);
	        },

	        coerceToKey: function () {
	            return this.factory.createString('');
	        },

	        coerceToString: function () {
	            return this.factory.createString('');
	        },

	        getInstancePropertyByName: function () {
	            var value = this;

	            value.callStack.raiseError(
	                PHPError.E_NOTICE,
	                'Trying to get property of non-object'
	            );

	            return value.factory.createNull();
	        },

	        isEqualTo: function (rightValue) {
	            return rightValue.isEqualToNull(this);
	        },

	        isEqualToFloat: function (floatValue) {
	            return floatValue.isEqualToNull();
	        },

	        isEqualToNull: function () {
	            return this.factory.createBoolean(true);
	        },

	        isEqualToObject: function (objectValue) {
	            return objectValue.isEqualToNull();
	        },

	        isEqualToString: function (stringValue) {
	            return stringValue.isEqualToNull();
	        },

	        isSet: function () {
	            return false;
	        },

	        subtract: function (rightValue) {
	            return rightValue.subtractFromNull();
	        }
	    });

	    return NullValue;
	}, {strict: true});


/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    Promise = __webpack_require__(133);

	function PHPObject(pausable, valueFactory, objectValue) {
	    this.objectValue = objectValue;
	    this.pausable = pausable;
	    this.valueFactory = valueFactory;
	}

	_.extend(PHPObject.prototype, {
	    /**
	     * Calls the specified method of the wrapped ObjectValue, returning a Promise.
	     * Allows JS-land code to call objects exported/returned from PHP-land,
	     * where asynchronous (blocking) operation is possible.
	     *
	     * @param {string} name
	     * @returns {Promise}
	     */
	    callMethod: function (name) {
	        var phpObject = this,
	            args = [].slice.call(arguments, 1);

	        // Arguments will be from JS-land, so coerce any to wrapped PHP value objects
	        args = _.map(args, function (arg) {
	            return phpObject.valueFactory.coerce(arg);
	        });

	        if (phpObject.pausable) {
	            return new Promise(function (resolve, reject) {
	                // Call the method via Pausable to allow for blocking operation
	                phpObject.pausable.call(
	                    phpObject.objectValue.callMethod,
	                    [name, args],
	                    phpObject.objectValue
	                )
	                    .then(resolve, reject);
	            });
	        }

	        // Pausable is unavailable (non-blocking mode)
	        return phpObject.objectValue.callMethod(name, args);
	    }
	});

	module.exports = PHPObject;


/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * PHPCore - PHP environment runtime components
	 * Copyright (c) Dan Phillimore (asmblah)
	 * https://github.com/uniter/phpcore/
	 *
	 * Released under the MIT license
	 * https://github.com/uniter/phpcore/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    util = __webpack_require__(22),
	    EventEmitter = __webpack_require__(121).EventEmitter;

	function Stream() {
	    EventEmitter.call(this);

	    this.data = '';
	}

	util.inherits(Stream, EventEmitter);

	_.extend(Stream.prototype, {
	    read: function (length) {
	        var data,
	            stream = this;

	        if (!length && length !== 0) {
	            data = stream.data;
	            stream.data = '';
	        } else {
	            data = stream.data.substr(0, length);
	            stream.data = stream.data.substr(length);
	        }

	        return data;
	    },

	    readAll: function () {
	        var stream = this;

	        return stream.read(stream.data.length);
	    },

	    write: function (data) {
	        var stream = this;

	        stream.data += data;
	        stream.emit('data', data);
	    }
	});

	module.exports = Stream;


/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Uniter - JavaScript PHP interpreter
	 * Copyright 2013 Dan Phillimore (asmblah)
	 * http://asmblah.github.com/uniter/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    Engine = __webpack_require__(166);

	function Uniter(phpToAST, phpToJS, phpRuntime) {
	    this.phpRuntime = phpRuntime;
	    this.phpToAST = phpToAST;
	    this.phpToJS = phpToJS;
	}

	_.extend(Uniter.prototype, {
	    createEngine: function (name, options) {
	        var uniter = this;

	        if (name !== 'PHP') {
	            throw new Error('Uniter.createEngine() :: Only language "PHP" is supported');
	        }

	        return new Engine(
	            uniter.phpToAST.create(),
	            uniter.phpToJS,
	            uniter.phpRuntime,
	            uniter.phpRuntime.createEnvironment(),
	            options
	        );
	    },

	    createParser: function () {
	        return this.phpToAST.create();
	    }
	});

	module.exports = Uniter;


/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Uniter - JavaScript PHP interpreter
	 * Copyright 2013 Dan Phillimore (asmblah)
	 * http://asmblah.github.com/uniter/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    phpCommon = __webpack_require__(20),
	    PHPError = phpCommon.PHPError,
	    Promise = __webpack_require__(167);

	function Engine(phpParser, phpToJS, phpRuntime, environment, options) {
	    this.environment = environment;
	    this.options = options || {};
	    this.phpParser = phpParser;
	    this.phpRuntime = phpRuntime;
	    this.phpToJS = phpToJS;
	}

	_.extend(Engine.prototype, {
	    configure: function (options) {
	        _.extend(this.options, options);
	    },

	    execute: function (code, path) {
	        var engine = this,
	            module,
	            options,
	            promise = new Promise(),
	            subEngine,
	            wrapper;

	        path = path || null;
	        options = _.extend({}, engine.options, {
	            path: path
	        });

	        try {
	            code = 'return ' +
	                engine.phpToJS.transpile(
	                    engine.phpParser.parse(code),
	                    {'bare': true}
	                ) +
	                ';';
	        } catch (error) {
	            // Any PHP errors from the transpiler or parser should be written to stdout by default
	            if (path === null && error instanceof PHPError) {
	                engine.getStderr().write(error.message);
	            }

	            return promise.reject(error);
	        }

	        /*jshint evil: true */
	        wrapper = new Function(code)();

	        module = engine.phpRuntime.compile(wrapper);
	        subEngine = module(options, engine.environment);

	        subEngine.execute().then(
	            function (resultValue) {
	                promise.resolve(resultValue.getNative(), resultValue.getType(), resultValue);
	            },
	            function (error) {
	                promise.reject(error);
	            }
	        );

	        return promise;
	    },

	    expose: function (object, name) {
	        this.environment.expose(object, name);
	    },

	    getStderr: function () {
	        return this.environment.getStderr();
	    },

	    getStdin: function () {
	        return this.environment.getStdin();
	    },

	    getStdout: function () {
	        return this.environment.getStdout();
	    }
	});

	module.exports = Engine;


/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Uniter - JavaScript PHP interpreter
	 * Copyright 2013 Dan Phillimore (asmblah)
	 * http://asmblah.github.com/uniter/
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/uniter/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    slice = [].slice,
	    util = __webpack_require__(22),
	    SimplePromise = __webpack_require__(168),
	    parent = SimplePromise.prototype;

	function Promise() {
	    SimplePromise.call(this);
	}

	util.inherits(Promise, SimplePromise);

	_.extend(Promise.prototype, {
	    always: function (callback) {
	        return this.then(callback, callback);
	    },

	    done: function (callback) {
	        return this.then(callback);
	    },

	    fail: function (callback) {
	        return this.then(null, callback);
	    },

	    resolve: function () {
	        return parent.resolve.call(this, slice.call(arguments));
	    },

	    then: function (onResolve, onReject) {
	        return parent.then.call(this, onResolve ? function (args) {
	            onResolve.apply(null, args);
	        } : null, onReject);
	    }
	});

	module.exports = Promise;


/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	/*
	 * Modular - JavaScript AMD Framework
	 * Copyright 2013 Dan Phillimore (asmblah)
	 * http://asmblah.github.com/modular/
	 *
	 * Implements the AMD specification - see https://github.com/amdjs/amdjs-api/wiki/AMD
	 *
	 * Released under the MIT license
	 * https://github.com/asmblah/modular/raw/master/MIT-LICENSE.txt
	 */

	'use strict';

	var _ = __webpack_require__(6),
	    PENDING = 0,
	    REJECTED = 1,
	    RESOLVED = 2;

	function Promise() {
	    this.mode = PENDING;
	    this.thens = [];
	    this.valueArgs = null;
	}

	_.extend(Promise.prototype, {
	    reject: function () {
	        var args = [].slice.call(arguments),
	            promise = this;

	        if (promise.mode === PENDING) {
	            promise.mode = REJECTED;
	            promise.valueArgs = args;

	            _.each(promise.thens, function (callbacks) {
	                if (callbacks.onReject) {
	                    callbacks.onReject.apply(null, args);
	                }
	            });
	        }

	        return promise;
	    },

	    resolve: function () {
	        var args = [].slice.call(arguments),
	            promise = this;

	        if (promise.mode === PENDING) {
	            promise.mode = RESOLVED;
	            promise.valueArgs = args;

	            _.each(promise.thens, function (callbacks) {
	                if (callbacks.onResolve) {
	                    callbacks.onResolve.apply(null, args);
	                }
	            });
	        }

	        return promise;
	    },

	    then: function (onResolve, onReject) {
	        var promise = this;

	        if (promise.mode === PENDING) {
	            promise.thens.push({
	                onReject: onReject,
	                onResolve: onResolve
	            });
	        } else if (promise.mode === REJECTED) {
	            if (onReject) {
	                onReject.apply(null, promise.valueArgs);
	            }
	        } else if (promise.mode === RESOLVED) {
	            if (onResolve) {
	                onResolve.apply(null, promise.valueArgs);
	            }
	        }

	        return promise;
	    }
	});

	module.exports = Promise;


/***/ }
/******/ ]);