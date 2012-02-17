# Intro

Basic Munchkin Counter because we need a cross-platform, web-based counter that's free & easy to customize.

[Munchkin](http://www.worldofmunchkin.com/game/) is a card game, btw. If you don't know what it is then probably very little of this will make sense.

## HTML5 Boilerplate

I'm using [the HTML5 boilerplate](http://html5boilerplate.com/) as a, um, boilerplate. Once there's a working project with sufficient functionality then I will strip out unused features but for now I'm leaving them in. So there's a link to [jQuery](http://jquery.com/) & [Modernizr](http://www.modernizr.com/) even though I'm not using either right now.

## To Do

In rough order of priority.

- Stylize; it's pretty ugly right now, could use a button style for clickable elements
- Mobile styles: looks decent on iPhone but +, - buttons very much needed, page is just slightly too tall
- Better onclick handling; shouldn't need to copy-paste code into each span. Use case for jQuery
- "Add Race", "Add Class" buttons, list out race/class on page
- Is a contenteditable polyfill needed? 1 possible use case for Modernizr but basically only older mobile browsers don't support it
- Speaking of mobile: testing, testing, testing. Does it work?
- Combat page for 1-time bonuses, strength vs. monster
- Multiple players on one HTML page, use left/right-arrow to switch between them, load content into/out of DOM using JavaScript