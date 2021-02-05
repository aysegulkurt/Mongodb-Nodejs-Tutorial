//Imports (1)
var express = require("express");
var bodyParser = require('body-parser'); 
var MongoClient = require('mongodb').MongoClient;

//Objects (2)
var app = express();

//Database connection object from connection string. (3)
var mongo_url = "mongodb://localhost:27017/";

//POST interface data parsing method (4)
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json()); 

//Server Port (5)
const _port = process.env.PORT || 5000;

//Server Data (6)
const _app_folder = __dirname + '/' ;

//This shows Database table in json format in browser (7)
app.get("/api/data", function(request, response) {
    MongoClient.connect(mongo_url, function(err, db) {
        if(err) { return console.log(err); }
        var dbo = db.db("treetest");
        dbo.collection("trees").find({}).toArray(function(err, result) {
            if(err) { return console.log(err); }
            response.send(result);
            db.close();
        });
    });   
});

//This shows Database filtered table in json format in browser (8)
app.post("/api/greaterdata", function(request, response) {
    //MongoClient conntection with connect function (9)
    MongoClient.connect(mongo_url, function(err, db) {
        //Return error log to console (10)
        if(err) { return console.log(err); }
        //Database selected (11)
        var dbo = db.db("treetest");
        //Query created (12)
        var query = { TreeHeight: { $gt: parseFloat(request.body.FilterHeight) } };
        //Collection selected and data found (13)
        dbo.collection("trees").find(query).toArray(function(err, result) {
            //Return error log to console (14)
            if(err) { return console.log(err); }
            //JSON Objects from collection sent to response url (15)
            response.send(result);
            //Database connection closed (16)
            db.close();
        });
    });   
});

//This shows Database filtered table in json format in browser (17)
app.post("/api/lowerdata", function(request, response) {
    MongoClient.connect(mongo_url, function(err, db) {
        if(err) { return console.log(err); }
        var dbo = db.db("treetest");
        var query = { TreeHeight: { $lt: parseFloat(request.body.FilterHeight) } };
        dbo.collection("trees").find(query).toArray(function(err, result) {
            if(err) { return console.log(err); }
            response.send(result);
            db.close();
        });
    });   
});

//This saves data to database (18)
app.post('/post', function(request, response) {
    MongoClient.connect(mongo_url, function(err, db) {
        if (err) { return console.log(err); }
        var dbo = db.db("treetest");
        //Created object with request values (19)
        var obj = { Name: request.body.Name, Latitude: request.body.Latitude, Longitude: request.body.Longitude, TreeHeight: parseFloat(request.body.TreeHeight) };
        //Data inserted to collection (20)
        dbo.collection("trees").insertOne(obj, function(err, res) {
            if (err) { return console.log(err); }
            //Status code set 200 (21)
            response.statusCode = 200;
            // Set Header (22)
            response.setHeader('Content-Type', 'text/plain');
            // Output (23)
            response.end('Data Store Success!');
            db.close();
        });
    });
});

//Pushes files from server to client. like "index html" (24)
app.all('*', function (req, res) {
    res.status(200).sendFile(`/index.html`, {root: _app_folder});
});

// ---- START UP THE NODE SERVER  ---- (25)
app.listen(_port, function () {
    console.log("Node Express server for " + app.name + " listening on http://localhost:" + _port);
});