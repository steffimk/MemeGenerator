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
    collection.insert(data);
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
    collection.find(id);
}

router.get('/templates', function (req, res, next) {
    let db = req.db;
    Promise.all([db.get(templateCollection).find({}, req.sort_term), getTemplatesFromImgFlip()])
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
    console.log("memeTemplate ", req.body)
    const {
        name, url, width, height, box_count, captions,
        captionPositions, fontColor, fontSize, isItalic, isBold,
        imageInfo, addedImages, addedImgInfo, canvasSize, drawingCoordinates,
        imageDescription
    } = memeTemplate;

    // validate input
    if(
        typeof name === "string" && name.length > 0 &&
        isValidUrl(url) &&
        isPositiveInteger(width) &&
        isPositiveInteger(height) &&
        isPositiveInteger(box_count)
    ){

        const creation_time = Date.now();

        // ignore any unknown values in the input data
        const normalizedTemplate = {
            name, creation_time, url, width, height, box_count, captions,
            captionPositions, fontColor, fontSize, isItalic, isBold,
            imageInfo, addedImages, addedImgInfo, canvasSize, drawingCoordinates,
            imageDescription
        }

        addToDB(req.db, templateCollection, normalizedTemplate);

        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
});

router.use((req, res, next) => {
    let sort_term = {};
    if(req.query.hasOwnProperty("orderBy")){
        // {sort: {_id: -1}} to order by insertion time
        sort_term = {sort: JSON.parse(req.query.orderBy)};
    }
    console.log(sort_term);
    req.sort_term = sort_term;
    console.log(req);
    next();
})

router.get('/memes', function (req, res) {
    let db = req.db;

    console.log("get"+req);

    db.get(memeCollection).find({}, req.sort_term)
        .then((docs) => {
            docs.forEach((template) => template.id = template._id)
            return (docs);
        } )
        .then((docs) => {
            res.json({
                "success": true,
                "data": {"memes": docs}
            })
        });
});
router.post("/memes", function (req, res){
    const meme = req.body;

    const {
        template_id, img, template_url, name, box_count,
        captions, captionPositions, fontSize, isItalic, isBold, fontColor
    } = meme;
    // validate input
    if(
        typeof name === "string" && name.length > 0 &&
        isValidUrl(template_url) &&
        isPositiveInteger(box_count)
    ){

        const creation_time = Date.now();

        // ignore any unknown values in the input data
        const normalizedMeme = {
            template_id, creation_time, img, template_url, name, box_count, captions,
            captionPositions, fontColor, fontSize, isItalic, isBold,
        }

        addToDB(req.db, memeCollection, normalizedMeme);

        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
});

module.exports = router;
