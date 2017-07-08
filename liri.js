var keys = require("./keys.js");
var request = require('request');
var Twitter = require('twitter');
var Spotify = require('node-spotify-api');
var fs = require('fs');


var conKey = keys.twitterKeys.consumer_key;
var conSec = keys.twitterKeys.consumer_secret;
var accTocKey = keys.twitterKeys.access_token_key;
var accTocSec = keys.twitterKeys.access_token_secret;
var cliKey = keys.spotifyKeys.client_id;
var cliSec = keys.spotifyKeys.client_secret;
var ombdKey = keys.spotifyKeys.ombdKey;


var client = new Twitter ({
  consumer_key: conKey,
  consumer_secret: conSec,
  access_token_key: accTocKey,
  access_token_secret: accTocSec
});

var spotify = new Spotify({
  id: cliKey,
  secret: cliSec
});

var input = process.argv[2];
var tweets = [];
var name;
var songIn= '';
var dataArr;
for (var i = 3; i < process.argv.length; i++) {
	songIn += (process.argv[i] + ' ');
} 
function doit() {
	if (input === 'do-what-it-says') {
		fs.readFile("random.txt", "utf8", function(error, data) {
	  // If the code experiences any errors it will log the error to the console.
		  if (error) {
		    return console.log(error);
		  } else {

			  dataArr = data.split(",");
			  // We will then re-display the content as an array for later use.
			  input = dataArr[0];
			  songIn = dataArr[1];
			  console.log(dataArr)
			  runit();
			}
		});
	}
}
function runit() {
	if (input === 'my-tweets') {
		var params = {screen_name: 'JoelEmbiid'};
		client.get('statuses/user_timeline', params, function(error, tweets, response) {
		if (!error) {
	    	for (i=0;i<20;i++) {
	    		console.log("--------------------------")
	    		console.log("The Proccess tweeted:")
	    		console.log(tweets[i].text)
	    		console.log(tweets[i].created_at)
	    	}
	  	}
	});
	} else if (input === 'spotify-this-song') {
		spotify.search({ type: 'track', query: songIn, limit: 1 }, function(err, data) {
		if (err) {
			return console.log('Error occurred: ' + err);
		} 
			console.log("Artist: " + data.tracks.items[0].artists[0].name);
			console.log("Song: " + data.tracks.items[0].name); 
			console.log("Song Preview: " + data.tracks.items[0].preview_url);
			console.log("Album: " + data.tracks.items[0].album.name)
		});
	} else if (input === 'movie-this') {
		request("http://www.omdbapi.com/?t=" + songIn + "&y=&plot=short&apikey=40e9cece", function(error, response, body) {
	  	if (!error && response.statusCode === 200) {
		    console.log("Title: " + JSON.parse(body).Title);
		    console.log("Year: " + JSON.parse(body).Year);
		    console.log("IMBD Rating: " + JSON.parse(body).imdbRating);
		    console.log("Country: " + JSON.parse(body).Country);
		    console.log("Languages: " + JSON.parse(body).Language);
		    console.log("Plot: " + JSON.parse(body).Plot);
		    console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[2].Value);
		  }
		});
	}
}


doit();

