# Local Builds
<!-- [[TOC]] -->


## Running A Local Build

To run a local build, you can just run `grunt`. This will build the Magazine Tool locally, without minifying any files. The build files are located in the `build` directory. Next, run `grunt serve` to start a local server that will serve the Magazine Tool files. Lastly, copy and paste the `bookmark.min.js` contents into a new bookmark to access the your local version of the Magazine Tool.

Please note that you must specify `magtool.local` in your hosts file. On OS X, run `sudo nano /etc/hosts` and add the line below.

```
127.0.0.1       magtool.local
```

### Watching For File Changes

You can also make grunt watch for file changes. To do so, run `grunt watch`. This will automatically run the server as well, so there is no need to open another cli window and run `grunt serve`.

## Bookmark

Once you ran a local build, you can copy the contents of the `build/js/bookmark.min.js` file and save them into a bookmark in your browser. If you have a local server running, this bookmark will load your local version of the Magazine Tool.

## Specifying Environment

You can specify the build environment by passing the `--env` option. The available environments are `dev` (`['dev', 'local', 'development']`), `test` (`['test', 'staging', 'testing']`) and `dist` (`['dist', 'live', 'production', 'distribution']`).

Example: `grunt --env=test`
