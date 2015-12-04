// @codekit-prepend "Application/Loader.js";

var app = app || {};

(function(window, $, app) {
    app.$body = $('body');
    
    app.Loader.load();
})(window, $, app);
