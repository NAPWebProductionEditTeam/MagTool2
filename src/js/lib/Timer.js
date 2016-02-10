(function(window) {
    function Timer(callback, delay) {
        var timerId, start, remaining = delay;
        
        this.pause = function() {
            window.clearTimeout(timerId);
            remaining -= new Date() - start;
        };
        
        this.start = function() {
            start = new Date();
            window.clearTimeout(timerId);
            timerId = window.setTimeout(callback, remaining);
        };
        
        this.resume = this.start;
    }
    
    window.Timer = Timer;
})(window);
