'use strict';

var utilities = require('./utilities.js');

var objectId = 1;

var messages = [{
  text: 'Hello again',
  username: 'Fred'
}];

var actions = {
  'GET': function GET(request, response) {
    utilities.sendResponse(response, { results: messages });
  },

  'POST': function POST(request, response) {
    utilities.collectData(request, function (message) {
      messages.push(message);
      message.objectId = ++objectId;
      utilities.sendResponse(response, { objectId: 1 }, 201);
    });
  },

  'OPTIONS': function OPTIONS(request, response) {
    utilities.sendResponse(response, null);
  }
};

module.exports = function (request, response) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NlcnZlci9yZXF1ZXN0LWhhbmRsZXIuanMiXSwibmFtZXMiOlsidXRpbGl0aWVzIiwicmVxdWlyZSIsIm9iamVjdElkIiwibWVzc2FnZXMiLCJ0ZXh0IiwidXNlcm5hbWUiLCJhY3Rpb25zIiwicmVxdWVzdCIsInJlc3BvbnNlIiwic2VuZFJlc3BvbnNlIiwicmVzdWx0cyIsImNvbGxlY3REYXRhIiwibWVzc2FnZSIsInB1c2giLCJtb2R1bGUiLCJleHBvcnRzIiwiYWN0aW9uIiwibWV0aG9kIl0sIm1hcHBpbmdzIjoiOztBQUFBLElBQUlBLFlBQVlDLFFBQVEsZ0JBQVIsQ0FBaEI7O0FBRUEsSUFBSUMsV0FBVyxDQUFmOztBQUVBLElBQUlDLFdBQVcsQ0FDYjtBQUNFQyxRQUFNLGFBRFI7QUFFRUMsWUFBVTtBQUZaLENBRGEsQ0FBZjs7QUFPQSxJQUFJQyxVQUFVO0FBQ1osU0FBTyxhQUFTQyxPQUFULEVBQWtCQyxRQUFsQixFQUE0QjtBQUNqQ1IsY0FBVVMsWUFBVixDQUF1QkQsUUFBdkIsRUFBaUMsRUFBQ0UsU0FBU1AsUUFBVixFQUFqQztBQUNELEdBSFc7O0FBS1osVUFBUSxjQUFTSSxPQUFULEVBQWtCQyxRQUFsQixFQUE0QjtBQUNsQ1IsY0FBVVcsV0FBVixDQUFzQkosT0FBdEIsRUFBK0IsVUFBU0ssT0FBVCxFQUFrQjtBQUMvQ1QsZUFBU1UsSUFBVCxDQUFjRCxPQUFkO0FBQ0FBLGNBQVFWLFFBQVIsR0FBbUIsRUFBRUEsUUFBckI7QUFDQUYsZ0JBQVVTLFlBQVYsQ0FBdUJELFFBQXZCLEVBQWlDLEVBQUNOLFVBQVUsQ0FBWCxFQUFqQyxFQUFnRCxHQUFoRDtBQUNELEtBSkQ7QUFLRCxHQVhXOztBQWFaLGFBQVcsaUJBQVNLLE9BQVQsRUFBa0JDLFFBQWxCLEVBQTRCO0FBQ3JDUixjQUFVUyxZQUFWLENBQXVCRCxRQUF2QixFQUFpQyxJQUFqQztBQUNEO0FBZlcsQ0FBZDs7QUFrQkFNLE9BQU9DLE9BQVAsR0FBaUIsVUFBU1IsT0FBVCxFQUFrQkMsUUFBbEIsRUFBNEI7QUFDM0MsTUFBSVEsU0FBU1YsUUFBUUMsUUFBUVUsTUFBaEIsQ0FBYjtBQUNBLE1BQUlELE1BQUosRUFBWTtBQUNWQSxXQUFPVCxPQUFQLEVBQWdCQyxRQUFoQjtBQUNELEdBRkQsTUFFTztBQUNMUixjQUFVUyxZQUFWLENBQXVCRCxRQUF2QixFQUFpQyxXQUFqQyxFQUE4QyxHQUE5QztBQUNEO0FBRUYsQ0FSRDs7QUFXQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7OztBQUdBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJyZXF1ZXN0LWhhbmRsZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgdXRpbGl0aWVzID0gcmVxdWlyZSgnLi91dGlsaXRpZXMuanMnKTtcblxudmFyIG9iamVjdElkID0gMTtcblxudmFyIG1lc3NhZ2VzID0gW1xuICB7XG4gICAgdGV4dDogJ0hlbGxvIGFnYWluJyxcbiAgICB1c2VybmFtZTogJ0ZyZWQnXG4gIH1cbl07XG5cbnZhciBhY3Rpb25zID0ge1xuICAnR0VUJzogZnVuY3Rpb24ocmVxdWVzdCwgcmVzcG9uc2UpIHtcbiAgICB1dGlsaXRpZXMuc2VuZFJlc3BvbnNlKHJlc3BvbnNlLCB7cmVzdWx0czogbWVzc2FnZXN9KTtcbiAgfSxcblxuICAnUE9TVCc6IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gICAgdXRpbGl0aWVzLmNvbGxlY3REYXRhKHJlcXVlc3QsIGZ1bmN0aW9uKG1lc3NhZ2UpIHtcbiAgICAgIG1lc3NhZ2VzLnB1c2gobWVzc2FnZSk7XG4gICAgICBtZXNzYWdlLm9iamVjdElkID0gKytvYmplY3RJZDtcbiAgICAgIHV0aWxpdGllcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UsIHtvYmplY3RJZDogMX0sIDIwMSk7XG4gICAgfSk7XG4gIH0sXG5cbiAgJ09QVElPTlMnOiBmdW5jdGlvbihyZXF1ZXN0LCByZXNwb25zZSkge1xuICAgIHV0aWxpdGllcy5zZW5kUmVzcG9uc2UocmVzcG9uc2UsIG51bGwpO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XG4gIHZhciBhY3Rpb24gPSBhY3Rpb25zW3JlcXVlc3QubWV0aG9kXTtcbiAgaWYgKGFjdGlvbikge1xuICAgIGFjdGlvbihyZXF1ZXN0LCByZXNwb25zZSk7XG4gIH0gZWxzZSB7XG4gICAgdXRpbGl0aWVzLnNlbmRSZXNwb25zZShyZXNwb25zZSwgJ05vdCBGb3VuZCcsIDQwNCk7XG4gIH1cblxufTtcblxuXG4vLyB2YXIgbWVzc2FnZXMgPSBbXTtcblxuLy8gZXhwb3J0cy5yZXF1ZXN0SGFuZGxlciA9IGZ1bmN0aW9uKHJlcXVlc3QsIHJlc3BvbnNlKSB7XG5cbi8vICAgdmFyIGhlYWRlcnMgPSBkZWZhdWx0Q29yc0hlYWRlcnM7XG4vLyAgIHZhciBtZXRob2QgPSByZXF1ZXN0Lm1ldGhvZDtcbi8vICAgdmFyIHN0YXR1c0NvZGU7XG4vLyAgIHZhciBib2R5ID0gW107XG5cbi8vICAgcmVxdWVzdC5vbignZXJyb3InLCBmdW5jdGlvbihlcnIpIHtcbi8vICAgICBjb25zb2xlLmVycm9yKGVycik7XG4vLyAgIH0pO1xuXG4vLyAgIHJlcXVlc3Qub24oJ2RhdGEnLCBmdW5jdGlvbihjaHVuaykge1xuLy8gICAgIGJvZHkucHVzaChjaHVuayk7XG4vLyAgIH0pO1xuXG4vLyAgIHJlcXVlc3Qub24oJ2VuZCcsIGZ1bmN0aW9uKCkge1xuXG4vLyAgICAgdmFyIHJlc3BvbnNlQm9keSA9IHtcbi8vICAgICAgIGhlYWRlcnM6IGhlYWRlcnMsXG4vLyAgICAgICBtZXRob2Q6IG1ldGhvZCxcbi8vICAgICAgIHVybDogcmVxdWVzdC51cmwsXG4vLyAgICAgICBib2R5OiBib2R5XG4vLyAgICAgfTtcblxuLy8gICAgIGlmIChtZXRob2QgPT09ICdHRVQnICYmIHJlcXVlc3QudXJsID09PSAnL2NsYXNzZXMvbWVzc2FnZXMnKSB7XG4vLyAgICAgICByZXNwb25zZS53cml0ZUhlYWQoMjAwLCBoZWFkZXJzKTtcbi8vICAgICAgIHJlc3BvbnNlQm9keS5yZXN1bHRzID0gbWVzc2FnZXM7XG4vLyAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdQT1NUJyAmJiByZXF1ZXN0LnVybCA9PT0gJy9jbGFzc2VzL21lc3NhZ2VzJykge1xuLy8gICAgICAgYm9keSA9IGJvZHkuam9pbignJykudG9TdHJpbmcoKTtcbi8vICAgICAgIHJlc3BvbnNlLndyaXRlSGVhZCgyMDEsIGhlYWRlcnMpO1xuLy8gICAgICAgbWVzc2FnZXMucHVzaChKU09OLnBhcnNlKGJvZHkpKTtcbi8vICAgICAgIHJlc3BvbnNlQm9keS5yZXN1bHRzID0gbWVzc2FnZXM7XG4vLyAgICAgfSBlbHNlIGlmIChtZXRob2QgPT09ICdPUFRJT05TJykge1xuLy8gICAgICAgcmVzcG9uc2Uud3JpdGVIZWFkKDIwMCwgaGVhZGVycyk7XG4vLyAgICAgfSBlbHNlIHtcbi8vICAgICAgIHJlc3BvbnNlLnN0YXR1c0NvZGUgPSA0MDQ7XG4vLyAgICAgfVxuXG5cbi8vICAgICByZXNwb25zZS5lbmQoSlNPTi5zdHJpbmdpZnkocmVzcG9uc2VCb2R5KSk7XG4vLyAgIH0pO1xuLy8gfTtcblxuLy8gdmFyIGRlZmF1bHRDb3JzSGVhZGVycyA9IHtcbi8vICAgJ2FjY2Vzcy1jb250cm9sLWFsbG93LW9yaWdpbic6ICcqJyxcbi8vICAgJ2FjY2Vzcy1jb250cm9sLWFsbG93LW1ldGhvZHMnOiAnR0VULCBQT1NULCBQVVQsIERFTEVURSwgT1BUSU9OUycsXG4vLyAgICdhY2Nlc3MtY29udHJvbC1hbGxvdy1oZWFkZXJzJzogJ2NvbnRlbnQtdHlwZSwgYWNjZXB0Jyxcbi8vICAgJ2FjY2Vzcy1jb250cm9sLW1heC1hZ2UnOiAxMCwgLy8gU2Vjb25kcy5cbi8vICAgJ0NvbnRlbnQtVHlwZSc6ICdhcHBsaWNhdGlvbi9qc29uJ1xuLy8gfTtcblxuXG4gIC8vIFJlcXVlc3QgYW5kIFJlc3BvbnNlIGNvbWUgZnJvbSBub2RlJ3MgaHR0cCBtb2R1bGUuXG4gIC8vXG4gIC8vIFRoZXkgaW5jbHVkZSBpbmZvcm1hdGlvbiBhYm91dCBib3RoIHRoZSBpbmNvbWluZyByZXF1ZXN0LCBzdWNoIGFzXG4gIC8vIGhlYWRlcnMgYW5kIFVSTCwgYW5kIGFib3V0IHRoZSBvdXRnb2luZyByZXNwb25zZSwgc3VjaCBhcyBpdHMgc3RhdHVzXG4gIC8vIGFuZCBjb250ZW50LlxuICAvL1xuICAvLyBEb2N1bWVudGF0aW9uIGZvciBib3RoIHJlcXVlc3QgYW5kIHJlc3BvbnNlIGNhbiBiZSBmb3VuZCBpbiB0aGUgSFRUUCBzZWN0aW9uIGF0XG4gIC8vIGh0dHA6Ly9ub2RlanMub3JnL2RvY3VtZW50YXRpb24vYXBpL1xuXG4gIC8vIERvIHNvbWUgYmFzaWMgbG9nZ2luZy5cbiAgLy9cbiAgLy8gQWRkaW5nIG1vcmUgbG9nZ2luZyB0byB5b3VyIHNlcnZlciBjYW4gYmUgYW4gZWFzeSB3YXkgdG8gZ2V0IHBhc3NpdmVcbiAgLy8gZGVidWdnaW5nIGhlbHAsIGJ1dCB5b3Ugc2hvdWxkIGFsd2F5cyBiZSBjYXJlZnVsIGFib3V0IGxlYXZpbmcgc3RyYXlcbiAgLy8gY29uc29sZS5sb2dzIGluIHlvdXIgY29kZS5cbiAgLy8gY29uc29sZS5sb2coJ1NlcnZpbmcgcmVxdWVzdCB0eXBlICcgKyByZXF1ZXN0Lm1ldGhvZCArICcgZm9yIHVybCAnICsgcmVxdWVzdC51cmwpO1xuXG4gIC8vIFRoZSBvdXRnb2luZyBzdGF0dXMuXG4gIC8vIHZhciBzdGF0dXNDb2RlID0gMjAwO1xuXG4gIC8vIFNlZSB0aGUgbm90ZSBiZWxvdyBhYm91dCBDT1JTIGhlYWRlcnMuXG4gIC8vIHZhciBoZWFkZXJzID0gZGVmYXVsdENvcnNIZWFkZXJzO1xuXG5cbiAgLy8gY29uc29sZS5sb2coJ3BhZ2UgJyArIHBhZ2UpO1xuXG4gIC8vIGNvbnNvbGUubG9nKCdSZXNwb25zZTogJywgcmVzcG9uc2UuYm9keSk7XG5cbiAgLy8gVGVsbCB0aGUgY2xpZW50IHdlIGFyZSBzZW5kaW5nIHRoZW0gcGxhaW4gdGV4dC5cbiAgLy9cbiAgLy8gWW91IHdpbGwgbmVlZCB0byBjaGFuZ2UgdGhpcyBpZiB5b3UgYXJlIHNlbmRpbmcgc29tZXRoaW5nXG4gIC8vIG90aGVyIHRoYW4gcGxhaW4gdGV4dCwgbGlrZSBKU09OIG9yIEhUTUwuXG4gIC8vIGhlYWRlcnNbJ0NvbnRlbnQtVHlwZSddID0gJ3RleHQvcGxhaW4nO1xuXG4gIC8vIC53cml0ZUhlYWQoKSB3cml0ZXMgdG8gdGhlIHJlcXVlc3QgbGluZSBhbmQgaGVhZGVycyBvZiB0aGUgcmVzcG9uc2UsXG4gIC8vIHdoaWNoIGluY2x1ZGVzIHRoZSBzdGF0dXMgYW5kIGFsbCBoZWFkZXJzLlxuICAvLyByZXNwb25zZS53cml0ZUhlYWQoc3RhdHVzQ29kZSwgaGVhZGVycyk7XG5cbiAgLy8gaWYgKHJlcXVlc3QudXJsID09ICcvY2xhc3Nlcy9tZXNzYWdlcycpIHtcbiAgLy8gICByZXNwb25zZS5zZW5kKEpTT04uc3RyaW5naWZ5KG1lc3NhZ2VzKSk7XG4gIC8vIH1cblxuICAvLyByZXNwb25zZS53cml0ZShKU09OLnN0cmluZ2lmeShtZXNzYWdlcykpO1xuXG4gIC8vIE1ha2Ugc3VyZSB0byBhbHdheXMgY2FsbCByZXNwb25zZS5lbmQoKSAtIE5vZGUgbWF5IG5vdCBzZW5kXG4gIC8vIGFueXRoaW5nIGJhY2sgdG8gdGhlIGNsaWVudCB1bnRpbCB5b3UgZG8uIFRoZSBzdHJpbmcgeW91IHBhc3MgdG9cbiAgLy8gcmVzcG9uc2UuZW5kKCkgd2lsbCBiZSB0aGUgYm9keSBvZiB0aGUgcmVzcG9uc2UgLSBpLmUuIHdoYXQgc2hvd3NcbiAgLy8gdXAgaW4gdGhlIGJyb3dzZXIuXG4gIC8vXG4gIC8vIENhbGxpbmcgLmVuZCBcImZsdXNoZXNcIiB0aGUgcmVzcG9uc2UncyBpbnRlcm5hbCBidWZmZXIsIGZvcmNpbmdcbiAgLy8gbm9kZSB0byBhY3R1YWxseSBzZW5kIGFsbCB0aGUgZGF0YSBvdmVyIHRvIHRoZSBjbGllbnQuXG4gIC8vIHJlc3BvbnNlLmVuZCgnSGVsbG8sIFdvcmxkIScpO1xuXG4vLyBUaGVzZSBoZWFkZXJzIHdpbGwgYWxsb3cgQ3Jvc3MtT3JpZ2luIFJlc291cmNlIFNoYXJpbmcgKENPUlMpLlxuLy8gVGhpcyBjb2RlIGFsbG93cyB0aGlzIHNlcnZlciB0byB0YWxrIHRvIHdlYnNpdGVzIHRoYXRcbi8vIGFyZSBvbiBkaWZmZXJlbnQgZG9tYWlucywgZm9yIGluc3RhbmNlLCB5b3VyIGNoYXQgY2xpZW50LlxuLy9cbi8vIFlvdXIgY2hhdCBjbGllbnQgaXMgcnVubmluZyBmcm9tIGEgdXJsIGxpa2UgZmlsZTovL3lvdXIvY2hhdC9jbGllbnQvaW5kZXguaHRtbCxcbi8vIHdoaWNoIGlzIGNvbnNpZGVyZWQgYSBkaWZmZXJlbnQgZG9tYWluLlxuLy9cbi8vIEFub3RoZXIgd2F5IHRvIGdldCBhcm91bmQgdGhpcyByZXN0cmljdGlvbiBpcyB0byBzZXJ2ZSB5b3UgY2hhdFxuLy8gY2xpZW50IGZyb20gdGhpcyBkb21haW4gYnkgc2V0dGluZyB1cCBzdGF0aWMgZmlsZSBzZXJ2aW5nLiJdfQ==