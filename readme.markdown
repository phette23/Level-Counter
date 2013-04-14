# Intro

Basic Level Counter to keep track of your levels, bonuses, and combat scenarios because we need a cross-platform, web-based counter that's free & easy to customize.

There's a [live, usable version](http://phette.net/level-counter/) on my website.

## To Do

In rough order of priority.

### Development

- Replace call to `alert` inside `restorePlayer` with a native prompt
- Break main.js into smaller components, e.g. combat, prompt, storage
- Use require.js with above modules (see [this blog post](http://www.elijahmanor.com/2013/04/angry-birds-of-javascript-yellow-bird.html)
- Use pub-sub instead of DOM events? See [this blog post](http://www.elijahmanor.com/2013/03/angry-birds-of-javascript-blue-bird.html)

### Features

- Better prompt box, move to Bootstrap Modal
- Keyboard shortcuts for +/- buttons, combat
- Make something stupendous happen when you win
- Record game progress, offer to chart later (?)

## Developer Info

### Yeoman, Bower, Grunt

This project uses [Yeoman](http://yeoman.io/) as a development tool, which in turns relies on [Bower](http://twitter.github.com/bower/) for client-side package management and [Grunt](http://gruntjs.com/) for various tasks like building an optimized version. Most of the documentation at the Yeoman website should provide a fair grasp on how to use it in this project, but the main items are:

- `grunt server` runs a local test server
- `grunt build` compiles an optimized version in dist/
- `bower install <library>` installs libraries (e.g. jQuery plugins, polyfills) in app/components/

I haven't ported the main client-side dependencies (jQuery, Modernizr, JSON3) over to Bower yet. I also haven't written unit tests so `grunt test` isn't useful.

### Version Number Management

Because I'm trying to use one code base to write two separate apps (a Mozilla web app, a Chrome Store app), and there are two main branches, and Grunt also needs a package.json, there are seven different version numbers floating around in this project. The `master` branch has three and `chrome-app` branch has the same three plus one for the Chrome Web Store. The files that hold the version numbers are:

- package.json - metadata for developers, and for Yeoman's sake
- app/package.json - to be perfectly honest, I'm not sure what this one is for. But I must have put it here for a reason! It might be a compliment to Mozilla's manifest.webapp which contains versioning info.
- app/manifest.json - for the [Chrome Web Store](https://developer.chrome.com/apps/manifest.html), only on the `chrome-app` branch

There is also an app/manifest.webapp file for Mozilla's [Open Web Apps](https://developer.mozilla.org/en-US/docs/Apps/Manifest) but it does not include a version number.

To help version number consistency, I wrote a pair of short scripts to print, validate, and update version numbers. They've only been tested in BASH on Mac OS X and rely on [node](nodejs.org). Simply run the `ver.sh` script and pass it one of three options: p for print, v for validate versions, and u for update which takes an additional argument that becomes the new version, e.g. `./ver.sh -v 1.2.4`.
