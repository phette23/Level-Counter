# Intro

Basic Munchkin Counter because we need a cross-platform, web-based counter that's free & easy to customize.

[Munchkin](http://www.worldofmunchkin.com/game/) is a card game, by the way. If you don't know what it is then probably very little of this will make sense.

There's a [live, usable version](http://phette.net/munchkin-counter/) on the web.

## Yeoman

If you have [Yeoman](http://yeoman.io/) installed, you can build an optimized version with the following command (run inside the project's root):

    yeoman build:minify --force

Unfortunately, the r.js component of Yeoman's build tool requires a certain directory structure (an app/index.html to be precise) that this project doesn't conform to, thus the --force flag.

## To Do

In rough order of priority.

- Implement a basic CSS grid using classes like 1-of-2
- Make native HTML/CSS pop-ups instead of using JS prompt, alert
- Record game progress, offer to chart later (?)
