# About `server`

Server is a NPM package intended to make Node.js development simpler and more intuitive.

## Goals

These are the main things that I wasn't happy with the state-of-the-art, so I decided to launch server to build upon the great work of express:

1. Make things work by default:
  - Cookies
  - Session
  - Form submission
  - Including **file uploads**
  - ...

2. Make things simpler to use
  - Many low-level things work out of the box
  - Sensible, secure defaults => no need to change anything
  - Easily customizable options

3. Make some important services available where possible, or some hooks to make it easier:
  - Passport
  - Database (MongoDB, etc)
  - Websockets

4. Better error handling (if possible). No more ALLCAPS error messages with no information at all.


This will in turn **make it much easier to get started**, for both people who are new to Node or for experienced people who don't want to set-up everything again and again. The main frustration that I've seen from people coming from:

- Different web backgrounds (Ruby on Rails, PHP), where now they have to hunt down and compare dozens of libraries to do simple tasks.
- Different programming backgrounds (Arduino, C++) where I have to explain not only how to get a server ready with these new tools, but also how the current state of the art and the fun of it is to build your own stack.
- Starting from scratch. I pity those people starting with no programming experience coming to Node.js. This shouldn't be so difficult, should it?


## Contribute

If you have some ideas of how Node.js development could be improved, please [open a new issue in Github's repository](github.com/serverjs/server/issues).



## Web design

This website was built with [Paperdocs](http://francisco.io/paperdocs/), a project built on top of [Picnic CSS](http://picnicss.com/) and [Umbrella JS](http://umbrellajs.com/) from the author of Server, [Francisco Presencia](http://francisco.io/).
