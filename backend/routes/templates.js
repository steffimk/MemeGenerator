var express = require('express');
const fetch = require('node-fetch');
const URL = require('url').URL;
const dbOp = require('../databaseOperations')
var router = express.Router();
const responseTemplates = require('../responseTemplates')

function getTemplatesFromImgFlip(){
    return fetch("https://api.imgflip.com/get_memes")
        .then(response => response.json())
        .then(json => json.data.memes)
}

router.get('/:username', function(req, res, next){
    let db = req.db;
    const username = req.params.username
    if (username) {
        dbOp.findAllOfUser(db, dbOp.TEMPLATE_COLLECTION, username).then((docs) => {
            responseTemplates.successBoundResponse(res, true, {"templates": docs})
        })
    }
});

router.get('/', function (req, res, next) {
    let db = req.db;
    Promise.all([dbOp.findAllFromDB(db,dbOp.TEMPLATE_COLLECTION), getTemplatesFromImgFlip()])
        .then(([docs, imgflip]) => {
            imgflip.forEach((template) => template.source = "imgflip")
            docs.forEach((template) => template.id = template._id)
            return (docs.concat(imgflip));
        } )
        .then((docs) => {
            responseTemplates.successBoundResponse(res, true, {"templates": docs})
    });
});

router.post('/', function(req, res){
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

        dbOp.addToDB(req.db, dbOp.TEMPLATE_COLLECTION, normalizedTemplate);

        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
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

const isPositiveInteger = (x) => {
    x = parseInt(x)
    let ret = x !== undefined && typeof x === "number" && x >= 0;
    if(!ret){
        console.error("Invalid positive integer: "+x);
    }
    return ret;
}

module.exports = {
    templatesRouter: router, 
    isPositiveInteger: isPositiveInteger,
    isValidUrl: isValidUrl};
