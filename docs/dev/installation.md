# Installation
<!-- [[TOC]] -->

## Prerequisites

To get started on developing on the Magazine Tool, you'll need a few things. First off you'll need [Git][git], [Node.js][node-js] and [npm][npm] installed. If you don't have those yet, just follow the links and the installation instructions should be on their respective websites. Next, you need [bower][bower] and [Grunt][grunt] installed as well. To do so, run `npm install -g bower` and `npm install -g grunt-cli` in your command-line.

## Installation

Now that you have all required software setup on your system, you can go ahead and clone the [repo][repo] using `git clone https://github.com/NAPWebProductionEditTeam/MagTool2`. Next, install your dependencies by running `npm install` and `bower install` in your project folder. Once that is done, you can keep your dependencies up-to-date by running `grunt update`.

## Local Build

To run a local build, you can just run `grunt`. To watch for file changes, run `grunt watch`. This will build the Magazine Tool locally, without minifying any files. The build files are located in the `build` directory. Copy and paste the `bookmark.min.js` contents into a new bookmark to access the your local version of the Magazine Tool. Please note that you will need to run a local server serving the `build` directory on `http://magtool.local`.

## Specifying environment

You can specify the build environment by passing the `--env` option. The available environments are `dev` (`['dev', 'local', 'development']`), `test` (`['test', 'staging', 'testing']`) and `dist` (`['dist', 'live', 'production', 'distribution']`).

Example: `grunt --env=test`

[git]: https://git-scm.com
[node-js]: https://nodejs.org
[npm]: https://www.npmjs.com
[bower]: http://bower.io
[grunt]: http://gruntjs.com
[repo]: https://github.com/NAPWebProductionEditTeam/MagTool2