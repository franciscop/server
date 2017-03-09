# Benchmark

Compare performance of `server` with `express`. As server is based on express, the theoretical maximum rps is that of express, so this is just to see that it doesn't fall too far below.

In my machine, this means that `server` can perform **37.4%** of the requests of `express` with the default configuration and **56.2%** with no middleware. From initial debugging, this seems to be related mainly to Promises inefficiencies which should get better as Promises get improved in V8 and as we improve the library.

I consider this to be good enough to keep developing and release the 1.0.0. Optimizations for this should be handled in the future before 2.0.0.

To run it:

```
node app.js
```

Then test each of them:

```
ab -n 100000 -c 100 http://localhost:2000/
ab -n 100000 -c 100 http://localhost:3000/
```


## Notes

Removing error handling yields to **13.6% more requests**. From this:

```js
// Pass an array of modern middleware and return a single modern middleware
module.exports = (...middles) => ctx => load(middles).reduce((prev, next) => {

  const handler = err => {
    ctx.error = err;
    if (next.error && next instanceof Function) next.error(ctx);
  };

  // Make sure that we pass the original context to the next promise
  // Catched errors should not be passed to the next thing
  return prev.catch(handler).then(fake => ctx).then(next).then(fake => ctx);

// Get it started with the right context
}, Promise.resolve(ctx));
```

To this:

```js
// Pass an array of modern middleware and return a single modern middleware
module.exports = (...middles) => ctx => load(middles).reduce((prev, next) => {

  // Make sure that we pass the original context to the next promise
  // Catched errors should not be passed to the next thing
  return prevthen(next).then(fake => ctx);

// Get it started with the right context
}, Promise.resolve(ctx));
```

However, for obvious reasons we want to handle errors.


## Server

Results for server on my machine:

```
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            3000

Document Path:          /
Document Length:        12 bytes

Concurrency Level:      100
Time taken for tests:   51.368 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      23200000 bytes
HTML transferred:       1200000 bytes
Requests per second:    1946.76 [#/sec] (mean)
Time per request:       51.368 [ms] (mean)
Time per request:       0.514 [ms] (mean, across all concurrent requests)
Transfer rate:          441.06 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.3      0      12
Processing:    24   51   5.2     51      84
Waiting:       24   51   5.2     51      84
Total:         36   51   5.2     51      84

Percentage of the requests served within a certain time (ms)
  50%     51
  66%     52
  75%     53
  80%     53
  90%     55
  95%     58
  98%     72
  99%     76
 100%     84 (longest request)
 ```



## Express

Results for express on my machine:

```
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            2000

Document Path:          /
Document Length:        12 bytes

Concurrency Level:      100
Time taken for tests:   19.225 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      20600000 bytes
HTML transferred:       1200000 bytes
Requests per second:    5201.60 [#/sec] (mean)
Time per request:       19.225 [ms] (mean)
Time per request:       0.192 [ms] (mean, across all concurrent requests)
Transfer rate:          1046.42 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.1      0       7
Processing:     4   19   3.6     17      55
Waiting:        4   19   3.6     17      55
Total:         11   19   3.6     17      56

Percentage of the requests served within a certain time (ms)
  50%     17
  66%     18
  75%     19
  80%     21
  90%     26
  95%     27
  98%     29
  99%     32
 100%     56 (longest request)
```



## Server without middleware plugin

```
This is ApacheBench, Version 2.3 <$Revision: 1706008 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 10000 requests
Completed 20000 requests
Completed 30000 requests
Completed 40000 requests
Completed 50000 requests
Completed 60000 requests
Completed 70000 requests
Completed 80000 requests
Completed 90000 requests
Completed 100000 requests
Finished 100000 requests


Server Software:        
Server Hostname:        localhost
Server Port:            3001

Document Path:          /
Document Length:        12 bytes

Concurrency Level:      100
Time taken for tests:   34.174 seconds
Complete requests:      100000
Failed requests:        0
Total transferred:      18300000 bytes
HTML transferred:       1200000 bytes
Requests per second:    2926.17 [#/sec] (mean)
Time per request:       34.174 [ms] (mean)
Time per request:       0.342 [ms] (mean, across all concurrent requests)
Transfer rate:          522.94 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       9
Processing:     2   34   3.8     34      60
Waiting:        2   34   3.8     34      60
Total:         11   34   3.8     34      60

Percentage of the requests served within a certain time (ms)
  50%     34
  66%     35
  75%     35
  80%     36
  90%     37
  95%     41
  98%     49
  99%     51
 100%     60 (longest request)
```
