var express = require('express'),
    app = express();
var port = process.env.PORT || 5000;
app.use(express.static(__dirname)).listen(port, function(){ 
	console.log("Listening on " + port); 
});