var url = require('url')
  , http = require('http')
  , https = require('https');
const express = require('express');
const cors = require('cors')

var PORT = process.argv[2] || 8000;

const app = express()
app.use(cors())

var server = http.createServer(function(req, res) {
  var reqUrl = req.url.substr(1);
  console.log('==> Making req for' + reqUrl + '\n');

  req.pause();

  var options = url.parse(reqUrl);
  options.headers = req.headers;
  options.method = req.method;
  options.agent = false;

  options.headers['host'] = options.host;

  var connector = (options.protocol == 'https:' ? https : http).request(options, function(serverResponse) {
    console.log('<== Received res for ', serverResponse.statusCode, reqUrl);
    console.log('\t-> Request Headers: ', options);
    console.log(' ');
    console.log('\t-> Response Headers: ', serverResponse.headers);

    serverResponse.pause();

    if (options.method == 'OPTIONS') {
      serverResponse.statusCode = 200;
    }

    serverResponse.headers['access-control-allow-origin'] = '*';
    serverResponse.headers['access-control-allow-headers'] = '*';

    switch (serverResponse.statusCode) {
      // pass through.  we're not too smart here...
      case 200: case 201: case 202: case 203: case 204: case 205: case 206:
      case 304:
      case 400: case 401: case 402: case 403: case 404: case 405:
      case 406: case 407: case 408: case 409: case 410: case 411:
      case 412: case 413: case 414: case 415: case 416: case 417: case 418:
        res.writeHeader(serverResponse.statusCode, serverResponse.headers);
        serverResponse.pipe(res, {end:true});
        serverResponse.resume();
      break;

      // fix host and pass through.  
      case 301:
      case 302:
      case 303:
        serverResponse.statusCode = 303;
        serverResponse.headers['location'] = 'http://localhost:'+PORT+'/'+serverResponse.headers['location'];
        console.log('\t-> Redirecting to ', serverResponse.headers['location']);
        res.writeHeader(serverResponse.statusCode, serverResponse.headers);
        serverResponse.pipe(res, {end:true});
        serverResponse.resume();
      break;

      // error everything else
      default:
        var stringifiedHeaders = JSON.stringify(serverResponse.headers, null, 4);
        serverResponse.resume();
        res.writeHeader(500, {
          'content-type': 'text/plain'
        });
        res.end(process.argv.join(' ') + ':\n\nError ' + serverResponse.statusCode + '\n' + stringifiedHeaders);
      break;
    }

    console.log('\n\n');
  });
  req.pipe(connector, {end:true});
  req.resume();
});

console.log('Listening on http://localhost:%s...', PORT);
server.listen(PORT);