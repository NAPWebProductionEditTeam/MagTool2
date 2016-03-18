(function(window, $, app) {
    function Server() {
        var api = "http://webprod-nap.dave.net-a-porter.com/save_test";
        
        this.edit = function(pageId) {
            var data = {
                "req_type": "start_edit",
                "page_id": pageId
            };
            
            data = window.JSON.stringify(data);
            
            return $.postJson(api, data);
        };
        
        this.unlock = function(pageId) {
            var data = {
                "req_type": "unlock",
                "page_id": pageId
            };
            
            data = window.JSON.stringify(data);
            
            return $.postJson(api, data);
        };
        
        this.save = function(pageId, credits, infoBlocks) {
            var data = {
                "req_type": "save_changes",
                "page_id": pageId,
                "credit": credits,
                "content": infoBlocks
            };
            
            data = window.JSON.stringify(data);
            
            return $.postJson(api, data);
        };
    }
    
    app.registerModule('Server', Server);
})(window, jQuery, MagTool);
