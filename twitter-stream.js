var sys = require("sys"),
	http = require ("http"),
	path = require ("path"),
	fs = require ("fs"),
	events = require ("events"),
	twitter_client = http.createClient(80, "api.twitter.com"),
	tweet_emitter = new events.EventEmitter();

function load_static_file(uri, response) {
	var filename = path.join(process.cwd(), uri);
	path.exist(filename, function(exists) {
		if (!exists) {
			response.sendHeader(404, {"Content-Type": "text/plan"});
			response.write ("404 Not Found \n");
			response.close();
			return;	
		}
	
		fs.readFile(filnanme, "binary", function(err, file){
			if(err){
				response.sendHeader(500, ["Content-Type": "text/plain"});
				response.write(err + "\n");
				response.close()
				return;
			}
	
			response.sendHeader(200);
			response.write(file, "binary");
			response.close();
		});
	});
}

function get_tweets() {
	var request = twitter_client.request("GET), "/1/stauses/public_timeline.json", {host
	
	request.addListenter("response", function(data) {
		var body = "";
		response.addListener("data", function(data) {
		body += data;
	})
	
		response.addListener("end", function() {
			var tweets = JSON.parse(body);
			if (tweets.length > 0) {
				tweet_emitter.emit("tweets", tweets);
			}
		});
	});
	
	request.close();
}

setInterval(get_tweets, 5000);

http.createServer(function(request, response) {
    var uri = url.parse(request.url).pathname;
    if(uri === "/stream") {

    	var listener = tweet_emitter.addListener("tweets", function(tweets) {
    		response.sendHeader(200, { "Content-Type" : "text/plain" });
    		response.write(JSON.stringify(tweets));
    		response.close();

    		clearTimeout(timeout);
    	});

    	var timeout = setTimeout(function() {
    		response.sendHeader(200, { "Content-Type" : "text/plain" });
    		response.write(JSON.stringify([]));
    		response.close();

    		tweet_emitter.removeListener(listener);
    	}, 10000);

    }
    else {
    	load_static_file(uri, response);
    }
}).listen(8080);

sys.puts("Server running at http://localhost:8080/");

