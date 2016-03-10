var Argument = Argument || {};

(function(app) {
    app.default = function(arg, d) {
        if (typeof arg === 'undefined') {
            arg = d;
        }
        
        return arg;
    };
})(Argument);
