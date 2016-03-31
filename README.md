<!-- header start -->
[![Latest Stable Version](https://img.shields.io/github/release/NAPWebProductionEditTeam/MagTool2.svg)]()

# MagTool2
### Net-A-Porter Magazine Tool
<!-- header end -->

The Net-A-Porter Magazine Tool is a front-end UI tool to build and edit *The EDIT* magazine right from your browser.

## Quickstart

Open the [bookmark.min.js](http://staging.net-a-porter.com/alfresco/nap/webAssets/magazine/_shared/contents/MagTool/js/bookmark.min.js?v=0.0.0) file and copy the text displayed (`cmd+a` & `cmd+c`) in your browser. Next, create a new bookmark and paste in the content you just copied as the url.

Now open The EDIT magazine to a page you'd like to edit, and click the bookmark you just created. This will start the Magazine Tool. Once it's loaded, click the Start Edit button, and you're good to go.

## Building the MagTool

### Installation

Run `npm install` and `bower install` to install all required dependencies.
If you haven't yet, also install `grunt-cli` by running `npm install -g grunt-cli`.

### Running a build

Run `grunt` to do a dev build, and `grunt dist` for a release build.

### Watching for file changes

Simply run `grunt watch` to watch files for changes and run a build instantly.
