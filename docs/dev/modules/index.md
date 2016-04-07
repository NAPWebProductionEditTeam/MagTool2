---
layout: default
---

# Modules
<!-- [[TOC]] -->

## Defining Modules

Modules MUST be defined within a self invoking anonymous function, preventing any naming conflicts. When they are initialised in the `app.js`, their instances will become available as a property on the `MagTool` object. Modules MUST be defined as a function starting with a Capital letter. Private methods and properties MUST be defined using the `var` keyword inside this function. Public methods and properties MUST be defined using the `this` keyword. Lastly, each Module MUST be registered with the Magazine Tool Application using the Application's `registerModule` method. Each module MUST be registered with a unique name.

An example Module:

```js
(function(window, app) {
    function MyModule() {
        var privateProperty = 0;
        
        var privateMethod = function() {
            // I am private
        };
        
        this.publicProperty = 1;
        
        this.publicMethod = function() {
            // I am public
        };
    }
 
    app.registerModule('MyModule', MyModule);
})(window, MagTool);

```

## Importing Public Objects

To import default javascript functions and classes from `window`, you SHOULD redefine them before your Module Definition by accessing them through the `window` object, rather than passing all of them to the self invoking function. Other javascript libraries MAY be imported by passing them to the self invocing function.

An example Module that imports `window.Math` and `jQuery`:

```js
(function(window, $, app) {
    var Math = window.Math;
    
    function MyModule() {
        this.thisMethodUsesMath = function() {
            return Math.max(0, 5);
        };
        
        this.thisMethodUsesJquery = function() {
            return $('#magtool');
        };
    }
 
    app.registerModule('MyModule', MyModule);
})(window, jQuery, MagTool);

```
