var express = require('express');
const fetch = require('node-fetch');

var router = express.Router();

const templateCollection = 'templates';
const memeCollection= 'memes';


function addToDB(db,collection, data) {
    console.log("Received data: " + data);
    // Delete id so that db generates new unique one (prevents duplicate error)
    delete data._id;
    collection = db.get(collection);
    collection.insert(data).then((docs) => console.log(docs));
}

function findAllFromDB(db,collection) {
    collection = db.get(collection);
    return collection.find({});
}

function getTemplatesFromImgFlip(){
    return fetch("https://api.imgflip.com/get_memes")
        .then(response => response.json())
        .then(json => json.data.memes)
}

function findOneFromDB(db, collection, id) {
    collection = db.get(collection);
    collection.find(id).then((docs) => console.log(docs));
}

router.get('/templates', function (req, res, next) {
    db = req.db;
    Promise.all([findAllFromDB(db,templateCollection), getTemplatesFromImgFlip()])
    //getTemplatesFromImgFlip()
        .then(([docs, imgflip]) => {
            console.log(docs)
            console.log(imgflip)
            console.log(docs.concat(imgflip));
            return (docs.concat(imgflip));
        } )
        .then((docs) => {
        console.log(docs);
        res.json({
            "success": true,
            "data": {"templates": docs}
        })
    });
});

router.get('/', function (req, res, next) {
    db = req.db;
    findAllFromDB(db, memeCollection).then((docs) => {
        console.log(docs);
        res.json({
            "success": true,
            "data": {"memes": docs}
        })
    });
});

router.post('/templates', function(req, res){
    const memeTemplate = req.body
    if(
        memeTemplate.hasOwnProperty("name") &&
        memeTemplate.hasOwnProperty("url") &&
        memeTemplate.hasOwnProperty("width") &&
        memeTemplate.hasOwnProperty("height") &&
        memeTemplate.hasOwnProperty("box_count")
    ){
        let db = req.db;
        addToDB(db, templateCollection, memeTemplate);
        res.json({
            "success": true
        })
    } else {
        res.json({
            "success": false
        })
    }
});

module.exports = router;
