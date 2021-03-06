var getStackTrace = function() {
    // var obj = {};
    // Error.captureStackTrace(obj, getStackTrace);
    var orig = Error.prepareStackTrace;
    Error.prepareStackTrace = function(_, stack) {
        // console.log(stack.toString());
        return stack;
    };
    var err = new Error;
    Error.captureStackTrace(err, getStackTrace);
    var stack = err.stack;
    Error.prepareStackTrace = orig;
    return stack && stack[1] && stack[1].toString();
};

var Log2 = function(context) {
    // Object.defineProperty(global, '__stack', {
    //     get: function() {
    //         var orig = Error.prepareStackTrace;
    //         Error.prepareStackTrace = function(_, stack) {
    //             return stack;
    //         };
    //         var err = new Error;
    //         Error.captureStackTrace(err, arguments.callee);
    //         var stack = err.stack;
    //         Error.prepareStackTrace = orig;
    //         return stack;
    //     }
    // });

    // Object.defineProperty(global, '__loginfo', {
    //     get: function() {
    //         var f = __stack[1].getFunctionName();
    //         return __filename + (f ? ' > ' + f + ':' : ':') + __stack[1].getLineNumber() + ',';
    //     }
    // });

    function getLogDate() {
        //Timezone is 0;
        var date = new Date();
        date.setHours(date.getHours() + 7);
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }

    var log = console.log;
    console.log = function () {
        var trace = getStackTrace() + ",";
        log.apply(console, [`${getLogDate()},`, 'DEBUG,', trace, ...arguments]);
    }

    var error = console.error;
    console.error = function () {
        var trace = getStackTrace() + ",";
        error.apply(console, [`${getLogDate()},`, 'ERROR,', trace, ...arguments]);
    }

    console.fatal = function () {
        var trace = getStackTrace() + ",";
        error.apply(console, [`${getLogDate()},`, 'FATAL,', trace, ...arguments]);
    }

    var info = console.info;
    console.info = function () {
        var trace = getStackTrace() + ",";
        info.apply(console, [`${getLogDate()},`, 'INFO,', trace, ...arguments]);
    }

    var warn = console.warn;
    console.warn = function () {
        var trace = getStackTrace() + ",";
        warn.apply(console, [`${getLogDate()},`, 'WARN,', trace, ...arguments]);
    }
    return this;
}

new Log2();
