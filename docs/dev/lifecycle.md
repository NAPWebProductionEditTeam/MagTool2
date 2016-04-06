# Application Lifecycle
<!-- [[TOC]] -->

## The Bookmark

The bookmark does a few things to initialise the MagTool Application. First off, it defines the public `MagTool` object. Next, it does a simply check to see if the Application has already been loaded. If this is the case, it simply triggers the `Loader` [module][docs_modules]'s `reload` method.

If this is not the case, it will get the current application version using the [GitHub API][gh-api]. If the Application is running in a distribution [environment][docs_env], it will use the latest release tag. In any other environment, it will use the latest commit SHA. This version string is used for cache busting, appending `?v={{ VERSION }}` to any loaded resource. Lastly it will load and execute the main `MagazineTool.js` file.

## The app.js

From all the files that get compiled into the `MagazineTool.js` file, the `app.js` file is the only one that actually executes any code. All other files just define modules and their methods and properties. The `app.js` itself only does a few basic things. First off, it will call the `Loader`'s module `load` method, loading all the other resources the Application uses, like the template, css and some javascript dependencies loaded from a CDN. Once all resources are loaded, it will initialise a new instance of each module, fade in the Magazine Tool's UI, and register all bindings. Once that is done, the Magazine Tool is successfully initialised and ready for the user.

## Reloading The Application

As indicated above in the Bookmark section, if you click the bookmark again when the Application is already loaded, it will reload the Application. When reloading the Application a few things happen. First, it will gracefully shut down the current application, meaning it will stop Editing Mode, fade out the UI and remove any loaded resources from the DOM. Next, it will get the current application version again through the GitHub API, reset the `MagTool` object to its original state and finally load and execute the `MagazineTool.js` file again.

[docs_modules]: docs/dev/modules
[docs_env]: docs/dev/environment
[gh-api]: https://developer.github.com/v3/
