var express = require('express');
const fetch = require('node-fetch');
const URL = require('url').URL;
const dbOp = require('../databaseOperations')
var router = express.Router();

const templateCollection = 'templates';
const memeCollection = 'memes';


function getTemplatesFromImgFlip(){
    return fetch("https://api.imgflip.com/get_memes")
        .then(response => response.json())
        .then(json => json.data.memes)
}

router.get('/templates', function (req, res, next) {
    let db = req.db;
    Promise.all([dbOp.findAllFromDB(db,templateCollection), getTemplatesFromImgFlip()])
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
    dbOp.findAllFromDB(db, memeCollection).then((docs) => {
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
    // console.log("memeTemplate ", req.body)
    const {
        name, url, width, height, box_count, captions,
        captionPositions, fontColor, fontSize, isItalic, isBold,
        imageInfo, addedImages, addedImgInfo, canvasSize, drawingCoordinates,
        imageDescription
    } = memeTemplate;
    // console.log(memeTemplate)
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
            imageInfo, addedImages, addedImgInfo, canvasSize, drawingCoordinates,
            imageDescription
        }

        dbOp.addToDB(req.db, templateCollection, normalizedTemplate);

        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
});

router.get('/memes', function (req, res) {
    let db = req.db;
    // console.log("in memes", db)
    Promise.all([dbOp.findAllFromDB(db,memeCollection)])
        .then(([docs]) => {
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

        // ignore any unknown values in the input data
        const normalizedMeme = {
            template_id, img, template_url, name, box_count, captions,
            captionPositions, fontColor, fontSize, isItalic, isBold,
        }

        dbOp.addToDB(req.db, memeCollection, normalizedMeme);

        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
});

router.post("/memes/like", function(req, res) {
    let db = req.db;
    const memeId = req.body.memeId;
    const username = req.body.username;
    console.log(memeId + " " + username)
    if (memeId && username) {
        dbOp.likeMeme(db, memeId, username)
        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
});

router.post("/memes/comment", function(req, res) {
    let db = req.db;
    const memeId = req.body.memeId;
    const comment = req.body.comment;
    if (memeId && comment) {
        dbOp.addCommentToMeme(db, memeId, comment)
        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
});

module.exports = router;
