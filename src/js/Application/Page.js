(function(window, $, app, builder) {
    var currentPage;
    
    var get = function() {
        if (typeof currentPage == 'undefined') {
            currentPage = $('#page' + builder.get_CurrentPageNumber());
        }
        
        return currentPage;
    };
    
    var getId = function() {
        return get().data('id');
    };
    
    var getTitle = function() {
        return get().data('feature-title');
    };
    
    app.Page = {
        get: get,
        getId: getId,
        getTitle: getTitle
    };
})(window, jQuery, app, magazineBuilder);
