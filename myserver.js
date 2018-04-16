var express = require('express');
var app = express();
var fs = require('fs');
var connection  = require('express-myconnection');
var mysql = require('mysql');

app.use(
    connection(mysql,{
        host     : 'localhost',
        user     : 'your_user_here',
        password : 'your_password_here',
        database : 'card_ui',
        debug    : false
    },'request')
);


//RESTful route
var router = express.Router();
router.use(function(req, res, next) {
    console.log(req.method, req.url);
    next();
});



var allstudentspage = router.route('/students');
allstudentspage.get(function(req,res,next){
	req.getConnection(function(err,conn){
		if (err) return next("Cannot Connect");
		var query = conn.query("SELECT * FROM students",function(err,rows){
	    if(err){
	      console.log(err);
	      return next("Mysql error, check your query");
	    }
	    res.json(rows);
		});
	});
});


var studentpage = router.route('/students/:student_id');
studentpage.get(function(req,res,next){
	var student_id = req.params.student_id;

	req.getConnection(function(err,conn){
		if (err) return next("Cannot Connect");
		var query = conn.query("SELECT * FROM students WHERE student_id = " + student_id,function(err,rows){
	    if(err){
	      console.log(err);
	      return next("Mysql error, check your query");
	    }
	    res.json(rows);
		});
	});
});

var indexes = router.route('/:pathnames');
indexes.get(function(request,response,next){
	// Parse the request containing file name
	var pathnames = request.params.pathnames;
	// Print the name of the file for which request is made.
	console.log("Request for " + pathnames + " received.");
	// Read the requested file content from file system
	fs.readFile(pathnames, function (err, data) {
		if (err) {
			console.log(err);
			// HTTP Status: 404 : NOT FOUND
			// Content Type: text/plain
			response.writeHead(404, {'Content-Type': 'text/html'});
		} else {
			//Page found
			// HTTP Status: 200 : OK
			// Content Type: text/plain
			response.writeHead(200, {'Content-Type': 'text/html'});
			// Write the content of the file to response body
			response.write(data.toString());
		}
		// Send the response body
		response.end();
	});
  // res.send('Welcome');
});

app.use('/', router);

var server = app.listen(3000, function() {
  var host = 'localhost'
  var port = '3000'
  console.log(`Server listening at http://%s:%s`, host, port)
});
