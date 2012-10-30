# Intro

Basic Munchkin Counter because we need a cross-platform, web-based counter that's free & easy to customize.

[Munchkin](http://www.worldofmunchkin.com/game/) is a card game, by the way. If you don't know what it is then probably very little of this will make sense.

There's a [live, usable version](http://phette.net/munchkin-counter/) on the web.

## HTML5 Boilerplate

I'm using [the HTML5 boilerplate](http://html5boilerplate.com/) as a, um, boilerplate. Once there's a working project with sufficient functionality then I will strip out unused features but for now I'm leaving them in.

## Yeoman

If you have [Yeoman](http://yeoman.io/) installed, you can build an optimized version with the following command (run inside the project's root):

    yeoman build:minify --force

Unfortunately, the r.js component of Yeoman's build tool requires a certain directory structure (an app/index.html to be precise) that this project doesn't conform to, thus the --force flag.

## To Do

In rough order of priority.

- Make into [Mozilla](https://developer.mozilla.org/en-US/docs/Apps/Manifest) & [Chrome](https://developers.google.com/chrome/apps/docs/developers_guide) web app (?)
- Offer to restore previous game if there's content in storage
- Record game progress, offer to chart later (?)

I originally intended to have select options for race & class characteristics but that quickly proved to be too burdensome given the numerous Munchkin expansion packs. If you're interested, there is a "race-class" branch of this repo that contains my initial code. It works fine but does not cover most expansions (e.g. Star Munchkin, Axe Cop Munchkin). I'm also probably not going to backport improvements made in the master branch to the race-class branch.
