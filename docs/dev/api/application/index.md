---
layout: default
---

# Application
<!-- [[TOC]] -->

## Accessor

 - Internal: `app`
 - External: `window.MagTool`

## Available Properties

#### `$body`

 - Type: Read-only
 - Var: jQuery[body]

#### `$doc`

 - Type: Read-only
 - Var: jQuery[#document]

#### `BASE_URI`

The base uri for the Application's resources.

 - Type: Constant
 - Var: String

#### `VERSION`

The Application version. Latest commit SHA for local, latest release tag for distribution.

 - Type: Constant
 - Var: String

#### `CTA`

Css / jQuery selector for CTA links.

 - Type: Constant
 - Var: String

## Available Methods

#### `bindOriginalKeyEvents()`

Bind the original key Events bound by the magazine.

#### `bindOriginalNavigationEvents()`

Bind the original click Events to navigate bound by the magazine.

#### `define()`

Define a read-only property on the Application.

 - @param  {String}   [name]  The name of the property
 - @param  {mixed}    [value] The value of the property

#### `env()`

Check if the current Environment matches the given Environment.

 - @param  {String}    [env]   The name of the environment
 - @return {Boolean}

#### `getLanguage()`

Get the current language.

 - @return {String}

#### `getModules()`

Get the registered Modules.

 - @return {Object}

#### `getVersion()`

Get the Application's Version.

 - @return {String}

#### `registerBindings()`

Register the Application's Event bindings.

#### `registerKeyBindings()`

Register the Application's Key bindings.

#### `registerModule()`

Register a Module with the Application.

 - @param  {String}   [id]     The ID of the Module
 - @param  {Function} [Module] The Module

#### `registerNavigationBindings()`

Register bindings for when the user tries to navigate away.

#### `unbindOriginalKeyEvents()`

Unbind the original key Events bound by the magazine.

#### `unbindOriginalNavigationEvents()`

Unbind the original click Events to navigate bound by the magazine.
