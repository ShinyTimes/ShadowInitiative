var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var mongodb = require('mongodb');
var url = 'mongodb://localhost:27017/runnerdb';
var runners = 'runners';

function setup()
{

        // setup
        //if (err) throw err;
        //db.createCollection(runners, function (err, res)
        //{
        //    if (err) throw err;
        //    console.log("Runner collection created");
        //    db.close();
        //});

        //if (err) throw err;
        //var aRunnner = { name: "Bob", dice: 2 };
        //db.collection(runners).insert(aRunnner, function (err, res)
        //{
        //    if (err) throw err;
        //    console.log("Added bob");
        //    db.close();
        //});

}

// Gets runner page
router.get('/', function (req, res, next)
{
    res.render('runner', { htmlRes: res });
});

// Gets collection of runners from db
router.get('/api', function (req, result, next)
{
    mongo.connect(url, function (err, db)
    {
        //result.send(getAll(err, db, result));
        if (err) throw err;
        db.collection(runners).find({}).toArray(function (err, res)
        {
            if (err) throw err;
            console.log(res);
            db.close();
            result.send(res)
            //result.render('runner', { htmlRes: res });
        });

    });

})
    .post('/api', function (req, result, next)
    {

        console.log("body:" + JSON.stringify(req.body));
        //console.log(req.body.name);
        //if (!isNaN(req.body.dice))
        //    console.log("Dice is num");
        //else
        //    console.log("Dice is shit");

        mongo.connect(url, function (err, db)
        {
            if (err) throw err;

            //var runner = JSON.parse(req.body);
            db.collection(runners).insertOne(req.body, function (err, res)
            {

                if (err) throw err;
                console.log("Created " + req.body.name);
                db.close();
                result.send(res.insertedId);
            });
        });

        //res.render('runner', { success: "It worked!" , htmlRes: res});
    })
    .delete('/api/:id?', function (req, result, next)
    {
        console.log("Delete hit: " + req.params.id);
        mongo.connect(url, function (err, db)
        {
            var q = { _id: new mongodb.ObjectID(req.params.id) }

            if (err) throw err;
            db.collection(runners).deleteOne(q, function (err, obj)
            {
                if (err) throw err;
                db.close();
                result.send();
            });

            //getAll(err, db, result); 
        });


    });

module.exports = router;