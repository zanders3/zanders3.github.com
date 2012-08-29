var express = require('express'),
    app = express();

app.configure(function(){
    app.use(express.static(__dirname));
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});