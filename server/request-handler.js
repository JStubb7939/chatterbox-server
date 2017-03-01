var utilities = require('./utilities.js');

var objectId = 1;

var messages = [
  {
    text: 'Hello again',
    username: 'Fred'
  }
];

var actions = {
  'GET': function(request, response) {
    utilities.sendResponse(response, {results: messages});
  },

  'POST': function(request, response) {
    utilities.collectData(request, function(message) {
      messages.push(message);
      message.objectId = ++objectId;
      utilities.sendResponse(response, {objectId: 1}, 201);
    });
  },

  'OPTIONS': function(request, response) {
    utilities.sendResponse(response, null);
  }
};

module.exports = function(request, response) {
  var action = actions[request.method];
  if (action) {
    action(request, response);
  } else {
    utilities.sendResponse(response, 'Not Found', 404);
  }

};


// var messages = [];

// exports.requestHandler = function(request, response) {

//   var headers = defaultCorsHeaders;
//   var method = request.method;
//   var statusCode;
//   var body = [];

//   request.on('error', function(err) {
//     console.error(err);
//   });

//   request.on('data', function(chunk) {
//     body.push(chunk);
//   });

//   request.on('end', function() {

//     var responseBody = {
//       headers: headers,
//       method: method,
//       url: request.url,
//       body: body
//     };

//     if (method === 'GET' && request.url === '/classes/messages') {
//       response.writeHead(200, headers);
//       responseBody.results = messages;
//     } else if (method === 'POST' && request.url === '/classes/messages') {
//       body = body.join('').toString();
//       response.writeHead(201, headers);
//       messages.push(JSON.parse(body));
//       responseBody.results = messages;
//     } else if (method === 'OPTIONS') {
//       response.writeHead(200, headers);
//     } else {
//       response.statusCode = 404;
//     }


//     response.end(JSON.stringify(responseBody));
//   });
// };

// var defaultCorsHeaders = {
//   'access-control-allow-origin': '*',
//   'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
//   'access-control-allow-headers': 'content-type, accept',
//   'access-control-max-age': 10, // Seconds.
//   'Content-Type': 'application/json'
// };


  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  // console.log('Serving request type ' + request.method + ' for url ' + request.url);

  // The outgoing status.
  // var statusCode = 200;

  // See the note below about CORS headers.
  // var headers = defaultCorsHeaders;


  // console.log('page ' + page);

  // console.log('Response: ', response.body);

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  // headers['Content-Type'] = 'text/plain';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
  // response.writeHead(statusCode, headers);

  // if (request.url == '/classes/messages') {
  //   response.send(JSON.stringify(messages));
  // }

  // response.write(JSON.stringify(messages));

  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  // response.end('Hello, World!');

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.