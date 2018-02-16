# Changelog

These are the changes for server. Follows semver as long as you use the documented features. If you reach into the internals, make sure to lock the version and follow the changes. Feel free to ask any question in Github :)


## 1.0.18 [[reference](https://github.com/franciscop/server/compare/1.0.17...1.0.18)]

- Fixed tag for npm so it doesn't install alphas by default.


## 1.0.17 [[reference](https://github.com/franciscop/server/compare/1.0.16...1.0.17)]

- Forgot a couple of debugging console.log(), so had to re-publish without them.



## 1.0.16 [[reference](https://github.com/franciscop/server/compare/1.0.15...1.0.16)]

- Add [`options` sub-schema definition in the plugin parser](https://github.com/franciscop/server/issues/60).



## 1.0.15 [[reference](https://github.com/franciscop/server/compare/1.0.14...1.0.15)]

- Added [session to the sockets](https://github.com/franciscop/server/issues/55).
- Fixed test and docs for jsonp.



## 1.0.14 [[reference](https://github.com/franciscop/server/compare/1.0.13...1.0.14)]

- Added [express session globally](https://github.com/franciscop/server/issues/30) so stores can be created based on that.



## 1.0.13 [[reference](https://github.com/franciscop/server/compare/1.0.12...1.0.13)]

- Fixed bug where some error handling might throw an error. From internal testing in one of my projects.



## 1.0.12 [[reference](https://github.com/franciscop/server/compare/1.0.11...1.0.12)]

- Remove [the unexpected body that was set by express](https://github.com/franciscop/server/issues/46) when only an status code was sent by making it explicit with status(NUMBER).send().



## 1.0.11 [[reference](https://github.com/franciscop/server/compare/1.0.10...1.0.11)]

- Never published, published on 1.0.12 instead.



## 1.0.10 [[reference](https://github.com/franciscop/server/compare/1.0.9...1.0.10)]

- Do not show a warning if [only the status was set but no body](https://github.com/franciscop/server/issues/46) was set.



## 1.0.9 [[reference](https://github.com/franciscop/server/compare/1.0.8...1.0.9)]

- Better error handling and warnings when there is no response from the server. Shows error only when it should.



## 1.0.8 [[reference](https://github.com/franciscop/server/compare/1.0.7...1.0.8)]

- Never published, published on 1.0.9 instead.



## 1.0.7 [[reference](https://github.com/franciscop/server/compare/1.0.6...1.0.7)]

- Fix for [Yarn and npm having different path resolution](https://github.com/franciscop/server/issues/43). This was giving inconsistent results when using yarn (vs the expected one with npm):

```js
server(
  get('*', (ctx) => status(200))
);
```



## 1.0.6 [[reference](https://github.com/franciscop/server/compare/1.0.5...1.0.6)]

- Never published, published on 1.0.7 instead.



## 1.0.5 [[reference](https://github.com/franciscop/server/compare/1.0.4...1.0.5)]

- Fix subdomain order resolution (merged from @nick-woodward).
- Test subdomain handling.
- Removed pointless warning.



## 1.0.4 [[reference](https://github.com/franciscop/server/compare/1.0.3...1.0.4)]

- Specify that the `views` for express should be a folder (that can inherit).
- Added environment variable name handling.



## 1.0.3 [[reference](https://github.com/franciscop/server/compare/1.0.2...1.0.3)]

- The log plugin is always on since it's needed internally.



## 1.0.2

- Better error handling for environment variables.



## 1.0.1

- Added the option to disable the CSRF and security plugins independently.



## 1.0.0

**First major release.**
