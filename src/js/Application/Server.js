(function(window, $, app) {
    var api = "http://webprod-nap.dave.net-a-porter.com/save_test";
    
    var save = function(pageId, credit_html, content_html) {
        var data = {
            "req_type": "save_changes",
            "page_id": pageId,
            "credit": credit_html,
            "content": content_html
        };
        
        console.log(data);
        data = window.JSON.stringify(data);
        console.log(data);
        return $.postJson(api, data);
    };
    
    app.Server = {
        save: save
    };
})(window, jQuery, app);
