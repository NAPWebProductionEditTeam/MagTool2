---
layout: default
---

# Actions
<!-- [[TOC]] -->

## Background

Actions are a command or set of commands that can be triggered by the user through various user interactions. They MUST be defined in the [Application Core][docs.application]. Actions are also aware of when they can be triggered. Depending on their definition, actions can be limited to only work in Edit Mode or View Mode. Actions can only be resolved inside the Application Core, and therefore any bindings MUST be defined in the Application Core as well.

## Defining Actions

Actions MUST be defined using the `registerAction` method. Often Actions will just forward a call to a [Module][modules]'s method, but in other occasions it may call various methods from various Modules, and it's own logic. For full usage of the private `registerAction` method, see the [Application's API reference][docs.api.app].

Example action:

```js
var always = false;
var whenEditing = true;

registerAction('myAction', function(param1, param2) {
    app.Module.method(param1, param2);
}, always, whenEditing);
```

## Resolving Actions

Most of the time, Actions are automatically resolved through automatic even binding. However, you MAY resolve Actions manually within other Actions or inside of Keyboard bindings. Actions are resolved using the private `resolveAction` method.

```js
var param1 = 'foo';
var param2 = 'bar';

resolveAction('myAction', [param1, param2]);
```

## Binding Actions

The Application Core binds actions to user actions by looking for the `data-action` and `data-change` attributes on UI Elements. The value or values are automatically passed to the action as well. The `data-action` attribute binds to the click event, while the `data-change` attribute binds on an `input` Element's change event.

```html
    <button type="button" value="paramOne" data-action="myAction">
    
    <input type="text" class="multi-input" name="paramOne" data-change="myAction">
    <input type="text" class="multi-input" name="paramTwo" data-change="myAction">
```

[docs.application]: docs/dev/application
[docs.modules]: docs/dev/modules
