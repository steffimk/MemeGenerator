var express = require('express');
const fetch = require('node-fetch');
const URL = require('url').URL;
const dbOp = require('../databaseOperations')
var router = express.Router();
const responseTemplates = require('../responseTemplates')

const templateCollection = 'templates';
const memeCollection = 'memes';

function getTemplatesFromImgFlip(){
    return fetch("https://api.imgflip.com/get_memes")
        .then(response => response.json())
        .then(json => json.data.memes)
}

router.get('/templates/:username', function(req, res, next){
    let db = req.db;
    const username = req.params.username
    if (username) {
        dbOp.findAllOfUser(db, templateCollection, username).then((docs) => {
            responseTemplates.successBoundResponse(res, true, {"templates": docs})
        })
    }
});

router.get('/templates', function (req, res, next) {
    let db = req.db;
    Promise.all([dbOp.findAllFromDB(db,templateCollection), getTemplatesFromImgFlip()])
        .then(([docs, imgflip]) => {
            imgflip.forEach((template) => template.source = "imgflip")
            docs.forEach((template) => template.id = template._id)
            return (docs.concat(imgflip));
        } )
        .then((docs) => {
            responseTemplates.successBoundResponse(res, true, {"templates": docs})
    });
});

// router.get('/', function (req, res, next) {
//     let db = req.db;
//     const username = req.query.username
//     // if username is defined: only get memes of user
//     if (username) {
//         dbOp.findAllOfUser(db, memeCollection, username).then((docs) => {
//             responseTemplates.successBoundResponse(res, true, {"memes": docs})
//         })
//     } else { // get all memes
//         dbOp.findAllFromDB(db, memeCollection).then((docs) => {
//         responseTemplates.successBoundResponse(res, true, {"memes": docs})
//         });
//     }
// });


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
        name, url, username, width, height, box_count, captions,
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
            name, url, username, width, height, box_count, captions,
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

router.get('/memes/:username', function(req,res) {
    let db = req.db;
    const username = req.params.username
    if (username) {
        dbOp.findAllOfUser(db, memeCollection, username).then((docs) => {
            responseTemplates.successBoundResponse(res, true, {"memes": docs})
        })
    }
});

router.get('/memes', function (req, res) {
    let db = req.db;
    // console.log("in memes", db)
    Promise.all([dbOp.findAllWithPrivacyLabel(db,memeCollection,'public')])
    .then(([docs]) => {
        docs.forEach((template) => template.id = template._id)
        return (docs);
    } )
    .then((docs) => {
        responseTemplates.successBoundResponse(res, true, {"memes": docs})
    });
});

router.post("/memes", function (req, res){
    const meme = req.body;

    const {
        template_id, img, template_url, name, box_count, username, imageDescription,
        captions, captionPositions, fontSize, isItalic, isBold, fontColor, privacyLabel
    } = meme;
    // validate input
    if(
        typeof name === "string" && name.length > 0 &&
        isValidUrl(template_url) &&
        isPositiveInteger(box_count)
    ){

        // ignore any unknown values in the input data
        const normalizedMeme = {
            template_id, img, template_url, name, box_count, username, imageDescription,
            captions, captionPositions, fontColor, fontSize, isItalic, isBold, privacyLabel
        }

        dbOp.addToDB(req.db, memeCollection, normalizedMeme);

        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
});

module.exports = router;
