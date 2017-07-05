var Log2 = function(context) {
    Object.defineProperty(global, '__stack', {
        get: function() {
            var orig = Error.prepareStackTrace;
            Error.prepareStackTrace = function(_, stack) {
                return stack;
            };
            var err = new Error;
            Error.captureStackTrace(err, arguments.callee);
            var stack = err.stack;
            Error.prepareStackTrace = orig;
            return stack;
        }
    });

    Object.defineProperty(global, '__loginfo', {
        get: function() {
            var f = __stack[1].getFunctionName();
            return __filename + (f ? ' > ' + f + ':' : ':') + __stack[1].getLineNumber() + ',';
        }
    });

    function getLogDate() {
        //Timezone is 0;
        var date = new Date();
        date.setHours(date.getHours() + 7);
        return date.toISOString().replace(/T/, ' ').replace(/\..+/, '');
    }

    var log = console.log;
    console.log = function () {
        log.apply(console, [`${getLogDate()},`, 'DEBUG,', ...arguments]);
    }

    var error = console.error;
    console.error = function () {
        error.apply(console, [`${getLogDate()},`, 'ERROR,', ...arguments]);
    }

    console.fatal = function () {
        error.apply(console, [`${getLogDate()},`, 'FATAL,', ...arguments]);
    }

    var info = console.info;
    console.info = function () {
        info.apply(console, [`${getLogDate()},`, 'INFO,', ...arguments]);
    }

    var warn = console.warn;
    console.warn = function () {
        warn.apply(console, [`${getLogDate()},`, 'WARN,', ...arguments]);
    }
    return this;
}

new Log2();
