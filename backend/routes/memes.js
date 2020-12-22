var express = require('express');
var router = express.Router();

const templateCollection = 'templates';
const memeCollection= 'memes';

let memes = [
    {
        "id": "181913649",
        "name": "Drake Hotline Bling",
        "url": "https://i.imgflip.com/30b1gx.jpg",
        "width": 1200,
        "height": 1200,
        "box_count": 2
    },
    {
        "id": "112126428",
        "name": "Distracted Boyfriend",
        "url": "https://i.imgflip.com/1ur9b0.jpg",
        "width": 1200,
        "height": 800,
        "box_count": 3
    },
]

function addToDB(db,collection, data) {
    collection = db.get(collection);
    collection.insert(data).then((docs) => console.log(docs));
}

function initializeDB(db, collection) {
    collection = db.get(collection);
    collection.find({}).then((res) => {
        if (res.length === 0) {
            collection.insert(memes);
        }
    });
}

function findAllFromDB(db,collection) {
    collection = db.get(collection);
    return collection.find({});
}

function findOneFromDB(db, collection, id) {
    collection = db.get(collection);
    collection.find(id).then((docs) => console.log(docs));
}

router.get('/templates', function (req, res, next) {
    db = req.db;
    initializeDB(db, templateCollection);
    findAllFromDB(db,templateCollection).then((docs) => {
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
