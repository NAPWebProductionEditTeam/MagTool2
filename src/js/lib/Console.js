var Console = Console || {};

(function(console) {
    console.header = function(str) {
        var header = '';

        header += '\n';
        header += '/**\n';
        header += ' * ' + str + '\n';
        header += ' */';

        console.log(header);
    };

    console.file = function(file, contents) {
        console.header(file);
        console.log(contents);
    };

    // Aliases
    console.err = console.error;
})(window.console);
