var http = require("http");
var url = require('url');
var path = require("path");
var fs = require("fs");

var portNumber = parseInt(process.argv[2]);

http.createServer(function (request, response) {
	var urlParts = url.parse(request.url, true);

	console.log(urlParts.pathname);

    switch (urlParts.pathname)
    {
    	case '/api/google':
    		var searchArg = urlParts.query.s;
			var options = {
				host: 'www.google.com',
				path: '/search?q=' + encodeURI(searchArg)
			};

			var chunks = [];

			http.request(options, function(googleResponse) {
				googleResponse.on('data', function (chunk) {
				    chunks.push(chunk);
				});
				googleResponse.on('end', function () {
				    response.writeHead(200, { 'Content-Type': 'application/json' });
				    response.write(JSON.stringify({ html: chunks.join('') }));
				    response.end();
				});
			}).end();	
    		break;

    	case '/form.html':
    		var filename = path.join(process.cwd(), urlParts.pathname);
    		fs.readFile(filename, "binary", function(err, file) {
				response.writeHead(200);
				response.write(file, "binary");
				response.end();
		    });
		    break;

    	default:
    		response.writeHead(404);
    		response.end();
    		break;
    }

}).listen(portNumber);

