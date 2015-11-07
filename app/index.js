/*
 * Demo of bundling a Uniter app with Webpack.
 *
 * MIT license.
 */
'use strict';

var uniter = require('uniter'),
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
