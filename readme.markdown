# Intro

Basic Level Counter to keep track of your levels, bonuses, and combat strength because we need a cross-platform, web-based counter that's free.

There's a [live, usable version](http://phette.net/level-counter/) on my website.

Level Counter used to be more robust but frankly less satisfying. You could restore a previous level-bonus combo if you accidentally navigated away from the tab, edit a player name, and open a combat dialog where you could add helping players and wandering monsters. The code, however, was jQuery spaghetti and this app is a dozen lines of AngularJS. If there's a lot of demand for those additional features I can re-implement them, but I never found myself using them. I just want to keep track of my levels and bonuses, nothing more.

## To Do

- Fix display bugs on mobile
- Keyboard shortcuts for all buttons

## Developer Info

### Yeoman, Bower, Grunt

This project uses [Yeoman](http://yeoman.io/) as a development tool, which in turns relies on [Bower](http://twitter.github.com/bower/) for client-side package management and [Grunt](http://gruntjs.com/) for various tasks like building an optimized version. Most of the documentation at the Yeoman website should provide a fair grasp on how to use it in this project, but the main items are:

- `grunt server` runs a local test server
- `grunt build` compiles an optimized version in the dist directory
- `bower install <library>` installs libraries in app/components/

I haven't written unit tests so `grunt test` isn't useful.

### Version Number Management

Because I'm trying to use one code base to write two separate apps (a Mozilla web app, a Chrome Store app) and there are two main branches, there are a few different version numbers floating around in this project. The files that hold the version numbers are:

- package.json - metadata for Grunt, NPM, developers
- app/manifest.json - for the [Chrome Web Store](https://developer.chrome.com/apps/manifest.html), only on the `chrome-app` branch

There is also an app/manifest.webapp file for Mozilla's [Open Web Apps](https://developer.mozilla.org/en-US/docs/Apps/Manifest) but it does not include a version number.

To help version number consistency, I wrote a pair of short scripts to print, validate, and update version numbers. They've only been tested in <abbr title="Bourne Again Shell">BASH</abbr> on Mac OS X and rely on [node](nodejs.org). Simply run the `ver.sh` script and pass it one of three options: p for print, v for validate versions, and u for update which takes an additional argument that becomes the new version, e.g. `./ver.sh -v 1.2.4`.
