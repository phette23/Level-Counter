# Intro

Basic Level Counter to keep track of your levels, bonuses, and combat scenarios because we need a cross-platform, web-based counter that's free & easy to customize.

There's a [live, usable version](http://phette.net/level-counter/) on my website.

## Build Script

This project used to use [Yeoman](http://yeoman.io/) to build an optimized version (if you have the old Yeoman project, `yeoman build:minify --force` should still work), but that project has gone in a different direction, leaving the build process to [Grunt](http://gruntjs.com/). Currently, `grunt build` is just going to error out if you run it. Eventually, I'll update the Gruntfile and get the project working, but for now it's not possible to optimize the app automatically with any current tools.

## To Do

In rough order of priority.

- Implement a basic CSS grid using classes like 1-of-2
- Make native HTML/CSS pop-ups instead of using JS prompt, alert
- Get a working build process with Grunt
- Record game progress, offer to chart later (?)
