(function($) {
    $.postJson = function(url, data) {
        return $.ajax(url, {
            global: false,
            type: "POST",
            cache: false,
            contentType: "application/json",
            data: data
        });
    };
})(jQuery);
