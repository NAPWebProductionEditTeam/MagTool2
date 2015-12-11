(function(window, $, app) {
    function Server() {
        var api = "http://webprod-nap.dave.net-a-porter.com/save_test";
        
        this.save = function(pageId, credit_html, content_html) {
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
    }
    
    app.modules.Server = Server;
})(window, jQuery, app);
