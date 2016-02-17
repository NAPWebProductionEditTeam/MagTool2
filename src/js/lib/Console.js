var Console = Console || {};

(function(console) {
    console.header = function(str) {
        console.log('');
        console.log('/**');
        console.log(' * ' + str);
        console.log(' */');
    };
    
    console.file = function(file, contents) {
        console.header(file);
        console.log(contents);
    };
    
    // Aliases
    console.err = console.error;
})(window.console);
