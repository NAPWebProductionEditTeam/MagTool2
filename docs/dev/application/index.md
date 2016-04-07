---
layout: default
---

# The Application
<!-- [[TOC]] -->

## Core

The Core of the Application is located in `Application/Application.js`. It contains some Core Application Methods that can be called directly on the `MagTool` object, but also contains all of the Bindings and Keyboard Shortcuts. Finally, it has the definition of all the [Actions][docs_actions] that can be triggered by user interactions.

## Properties

The Application has a few public properties, most of them are read-only values. It also has the `BASE_URI` and `VERSION` constants set. These contants SHOULD NOT be modified anywhere outside the `bookmark.js` code. The only exception to this rule is the `Loader` Module's `reload` method, which simply passes those constants on to the new `MagTool` object. Additionally, all registered Moduls are available through their name as a property on the Application.

### List Of Properties

 - `$doc`: Result of `$(document)`. This property MUST be used instead of calling `$(document)`. *(jQuery, read-only)*
 - `$body`: Result of `$('body')`. This property MUST be used instead of calling `$('body')`. *(jQuery, read-only)*
 - `cta`: Selector for CTA links. *(String, read-only)*

[docs_actions]: docs/dev/actions
