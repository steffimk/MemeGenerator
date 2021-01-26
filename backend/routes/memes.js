var express = require('express');
const fetch = require('node-fetch');
const URL = require("url").URL;

var router = express.Router();

const templateCollection = 'templates';
const memeCollection= 'memes';


function addToDB(db,collection, data) {
    // Delete id so that db generates new unique one (prevents duplicate error)
    //delete data._id;
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
    let db = req.db;
    Promise.all([findAllFromDB(db,templateCollection), getTemplatesFromImgFlip()])
        .then(([docs, imgflip]) => {
            imgflip.forEach((template) => template.source = "imgflip")
            docs.forEach((template) => template.id = template._id)
            return (docs.concat(imgflip));
        } )
        .then((docs) => {
        res.json({
            "success": true,
            "data": {"templates": docs}
        })
    });
});

router.get('/', function (req, res, next) {
    let db = req.db;
    findAllFromDB(db, memeCollection).then((docs) => {
        res.json({
            "success": true,
            "data": {"memes": docs}
        })
    });
});


const isValidUrl = (s) => {
    try {
        new URL(s);
        return true;
    } catch (err) {
        console.error("Invalid url: "+s);
        return false;
    }
};

function isPositiveInteger(x){
    x = parseInt(x)
    let ret = x !== undefined && typeof x === "number" && x >= 0;
    if(!ret){
        console.error("Invalid positive integer: "+x);
    }
    return ret;
}

router.post('/templates', function(req, res){
    const memeTemplate = req.body;
    const {
        name, url, width, height, box_count, captions,
        captionPositions, fontColor, fontSize, isItalic, isBold,
        imageInfo, addedImages, addedImgInfo, canvasSize
    } = memeTemplate;
    console.log(memeTemplate)
    // validate input
    if(
        typeof name === "string" && name.length > 0 &&
        isValidUrl(url) &&
        isPositiveInteger(width) &&
        isPositiveInteger(height) &&
        isPositiveInteger(box_count)
    ){

        // ignore any unknown values in the input data
        const normalizedTemplate = {
            name, url, width, height, box_count, captions,
            captionPositions, fontColor, fontSize, isItalic, isBold,
            imageInfo, addedImages, addedImgInfo, canvasSize
        }

        addToDB(req.db, templateCollection, normalizedTemplate);

        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
});

module.exports = router;
