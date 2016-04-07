---
layout: default
---

# Modules
<!-- [[TOC]] -->

## Defining Modules

Modules are each defined within a self invoking anonymous function, preventing any naming conflicts. When they are initialised in the `app.js`, their instances will become available as a property on the `MagTool` object. Modules are defined as a function starting with a Capital letter. Private methods and properties are defined using the `var` keyword inside this function. Public methods and properties are defined using the `this` keyword. Lastly, to register the Module in the Magazine Tool Application, use the Application's `registerModule` method. Obviously, each module should be registered with a unique name.

An example module:

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

To import default javascript functions and classes from `window`, redefine them before your module function by accessing them through the `window` object, rather than passing all of them to the self invoking function. Other javascript libraries can be imported by passing them to the self invocing function.

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
