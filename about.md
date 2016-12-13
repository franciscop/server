# About `server`

This is a package started by [Francisco Presencia](http://francisco.io/) but hopefully it will be developed by many contributors.

## Goals

These are the main things that I wasn't happy with the state-of-the-art, so I decided to launch server to build upon the great work on express:

1. Make things work by default, including but not limited to:
  - Cookies
  - Session
  - Form submission
  - Including **file uploads**

2. Make things simpler to use
  - Forget about searching each package's config
  - Secure, sensible defaults
  - Easily customizable options

3. Make some important services available where possible, or some hooks to make it easier:
  - Passport
  - Database (MongoDB, etc)
  - Websockets

This will in turn **make it much easier to get started**. For me the fun is learning new libraries as I already know my way around Node and javascript, but this is overwhelming for people getting started in the ecosystem. The main frustration that I've seen from people coming from:

- Different web backgrounds (Ruby on Rails, PHP), where now they have to hunt down and compare dozens of libraries to do simple tasks.
- Different programming backgrounds (Arduino, C++) where I have to explain not only how to get a server ready with these new tools, but also how the current state of the art and the fun of it is to build your own stack.
- Starting from scratch. I pity those people starting with no programming experience coming to Node.js.
