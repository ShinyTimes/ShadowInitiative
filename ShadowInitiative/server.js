'use strict';
var http = require('http');
var port = process.env.PORT || 1337;

var mongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

mongoClient.connect(url, function(err, db)
{
    // Create collection
    //if (err) throw err;
    //db.createCollection("runners", function (err, res)
    //{
    //    if (err) throw err;
    //    console.log("runner collections created")
    //    db.close();
    //});

    // Insert 1
    //if (err) throw err;
    //var aRunner = { name: "Carl", die: 2 };
    //db.collection("runners").insertOne(aRunner, function (err, res)
    //{
    //    if (err) throw err;
    //    console.log("inserted a runner");
    //    db.close();
    //})

    // Find 1
    //if (err) throw err;
    //db.collection("runners").findOne({}, function (err, result)
    //{
    //    if (err) throw err;
    //    console.log(result.name);
    //    db.close();
    //});

    // Find all
    //if (err) throw err;
    //db.collection("runners").find({}).toArray(function (err, res)
    //{
    //    if (err) throw err;
    //    console.log(res);
    //    db.close();
    //});

    // Query specific
    //if (err) throw err;
    //var query = { name: "Carl" };
    //db.collection("runners").find(query).toArray(function (err, res)
    //{
    //    if (err) throw err;
    //    console.log(res);
    //    db.close();
    //})


    //if (err) throw err;
    //var q = { dice: 3 };
    //var change = { name:"Carl", die: 3 };
    //db.collection("runners").updateOne(q, change, function (err, res)
    //{
    //    console.log("Made carl more buff");
    //});

     //Find all
    //if (err) throw err;
    //db.collection("runners").find({}).toArray(function (err, res)
    //{
    //    if (err) throw err;
    //    console.log(res);
    //    db.close();
    //});

    //Drop collection
    //if (err) throw err;
    //db.collection("runners").drop(function (err, delOK)
    //{
    //    if (err) throw err;
    //    if (delOK) console.log("Deleted Runner collection");
    //    db.close();

    //});

});

http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(port);

