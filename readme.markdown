# Intro

Basic Level Counter to keep track of your levels, bonuses, & combat strength because we need a cross-platform, web-based counter that's free.

# Installation

- In the [Firefox Marketplace](https://marketplace.firefox.com/app/level-counter/)
- In the [Chrome Webstore](https://chrome.google.com/webstore/detail/level-counter/omechdmoagbfojanbihfodbcnckcjmkg)
- Web version [on my site](http://phette.net/level-counter/) & [GitHub pages](//phette23.github.io/Level-Counter/).

## Developer Info

### Grunt

[Grunt](http://gruntjs.com/) provides various tasks:

- `grunt server` runs a local test server
- `grunt build` compiles an optimized version in the dist/ directory
- `grunt test` runs JSHint & Selenium UI tests (see test/readme.mdown for details)

### Version Number Management

Because I'm trying to use one code base to write two separate apps (a Mozilla web app, a Chrome Store app) & there are two main branches, there are a few different version numbers floating around in this project. Files that hold version numbers are:

- "package.json" - metadata for Grunt, NPM, developers
- "app/manifest.json" - for the [Chrome Web Store](https://developer.chrome.com/apps/manifest.html), only on the `chrome-app` branch

There's also "app/manifest.webapp" for Mozilla's [Open Web Apps](https://developer.mozilla.org/en-US/docs/Apps/Manifest) but it does not include a version number.

To help version number consistency, I wrote a pair of short scripts to print, validate, & update version numbers. They've only been tested in <abbr title="Bourne Again Shell">BASH</abbr> on Mac OS X & rely on [node](nodejs.org). Simply run `ver.sh` in the scripts directory & pass it one of three options: p for print, v for validate versions, & u for update which takes an additional argument that becomes the new version, e.g. `./scripts/ver.sh -u 1.2.4`.

## License

[GPLv3](https://www.gnu.org/licenses/gpl-3.0.html)

![GPL 3 logo](https://www.gnu.org/graphics/gplv3-127x51.png "GPLv3")
