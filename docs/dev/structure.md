# Application Structure
<!-- [[TOC]] -->

## Folder Structure

The Application is structured inside the `src` directory. In there you have the `js` directory where all javascript files go, the `scss` directory where all SASS files go, and the `tpl` directory where all html templates go.

### Javascript Structure

The javascript directory has the `app.js` and `bookmark.js` files, and then is subdivided into a few directories. There is a `jQuery` directory for any jQuery extensions that can't be managed to [bower][bower] or [npm][npm], a `lib` directory for other libraries, and finally the `Application` directory that contains most of the Application.

### SASS Structure

The SASS directory is divided into the `core`, `components`, `layouts` and `ui` directories. The files in the SASS directory are mainly used to import files from those directories or the `bower_components` directory, or to set variables.

[bower]: http://bower.io
[npm]: https://www.npmjs.com
