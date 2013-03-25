# Intro

Basic Level Counter to keep track of your levels, bonuses, and combat scenarios because we need a cross-platform, web-based counter that's free & easy to customize.

There's a [live, usable version](http://phette.net/level-counter/) on my website.

## Build Script

This project used to use [Yeoman](http://yeoman.io/) to build an optimized version (if you have the old Yeoman project, `yeoman build:minify --force` should still work), but that project has gone in a different direction, leaving the build process to [Grunt](http://gruntjs.com/). Currently, `grunt build` is just going to error out if you run it. Eventually, I'll update the Gruntfile and get the project working, but for now it's not possible to optimize the app automatically with any current tools.

## To Do

In rough order of priority.

### Development

- Use [Bower](http://twitter.github.com/bower/) to manage JS libs, e.g. jQuery, JSON3, Bootstrap Modal
- Replace call to `alert` inside `restorePlayer` with a native prompt
- Break main.js into smaller components, e.g. combat, prompt, storage
- Get a working build process with Grunt

### Features

- Implement a basic CSS grid using classes like 1-of-2
- Better prompt box, move to Bootstrap Modal
- Keyboard shortcuts for +/- buttons, combat
- Record game progress, offer to chart later (?)
