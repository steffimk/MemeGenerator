const express = require('express');
var router = express.Router();
var JSZip = require('jszip');
var atob = require('atob');

const responseTemplates = require('../responseTemplates')
/* Database Operations */
const dbOp = require('../databaseOperations');
const {createCanvas, loadImage} = require('canvas');

// ------------------------ This route acts as API ------------------------

/**
 * Creates a new meme from the imageUrl and two captions.
 * Respondes with a zip
 */
router.get("/create", function (req, res) {
  const { imageUrl, captionTop, captionBottom } = req.query;

  if(imageUrl && captionTop && captionBottom) {
    loadImage(imageUrl).then((img) => {
      const dataUrl = generateDataUrl(img, captionTop, captionBottom);
      zipImages([dataUrl], res)
    }).catch((e) => {
      console.log(e)
      res.status(500)
      res.send()
    })
  } else {
      res.status(406)
      res.send()
  }
});

/**
 * Creates up to five random memes with the imageURL and captions pulled from the database
 */
router.get('/createrandom', function (req, res) {
  const db = req.db;
  const { imageUrl } = req.query;

  if (imageUrl) {
    const dataUrls = [];
    loadImage(imageUrl)
      .then((img) => {
        dbOp.getCaptions(db)
          .then((docs) => {
            var captions = []
            docs.forEach((meme) => captions.push(...meme.captions))
            captions = captions.filter(c => c !== '' && c !== null && c !== undefined)
            for (i = 0; i < captions.length-1 && i < dbOp.MAX_FILES_IN_ZIP*2; i = i+2) { // Don't go over max-files-limit.
              const dataUrl = generateDataUrl(img, captions[i], captions[i+1])
              dataUrls.push(dataUrl);
            }
            zipImages(dataUrls, res);
          })
          .catch((e) => {console.log(e); res.status(500), res.send()});
      }).catch((e) => {
        console.log(e);
        res.status(500);
        res.send();
      });
  } else {
    res.status(406);
    res.send();
  }
});

/**
 * Respondes with a zip containing the five most viewed memes
 */
router.get('/mostviews', function(req,res){
  let db = req.db;
  dbOp.findMostViews(db, dbOp.MEME_COLLECTION).then((memes) => {
    const dataUrls = memes.map(meme => meme.img)
    zipImages(dataUrls, res);
  }).catch((e) => {
    console.log(e);
    res.status(500);
    res.send();
  })
})

/**
 * Respondes with a zip containing the five newest memes
 */
router.get('/newest', function(req,res){
  let db = req.db;
  dbOp.findNewest(db, dbOp.MEME_COLLECTION).then((memes) => {
    const dataUrls = memes.map(meme => meme.img)
    zipImages(dataUrls, res);
  }).catch((e) => {
    console.log(e);
    res.status(500);
    res.send();
  })
})

/**
 * Respondes with a zip containing the five most liked memes
 */
router.get('/mostlikes', function(req,res){
  let db = req.db;
  dbOp.findMostLikes(db, dbOp.MEME_COLLECTION).then((memes) => {
    const dataUrls = memes.map(meme => meme.img)
    zipImages(dataUrls, res);
  }).catch((e) => {
    console.log(e);
    res.status(500);
    res.send();
  })
})

/**
 * Respondes with up to five memes with the exact name passed in the url.
 * If name has blank spaces, fill them with %20.
 */
router.get('/name/:name', function(req,res){
  let db = req.db;
  const name = req.params.name
  if (name) {
    dbOp.findWithName(db, dbOp.MEME_COLLECTION, name).then((memes) => {
      const dataUrls = memes.map(meme => meme.img)
      zipImages(dataUrls, res);
    }).catch((e) => {
      console.log(e);
      res.status(500);
      res.send();
    })
  } else {
    res.status(406);
    res.send();
  }
})

/**
 * Respondes with a json containing the dataURL of the meme with the id passed in the url
 */
router.get('/:id', function(req, res){
  let db = req.db;
  const id = req.params.id
  if (id) {
      dbOp.viewMeme(db, id, Date.now());
      dbOp.findOneFromDB(db, dbOp.MEME_COLLECTION, id).then((meme) => {
        if(meme !== null && meme.img){
          const privacyLabel = meme.privacyLabel
          if(privacyLabel && privacyLabel === 'private'){
            responseTemplates.successBoundResponse(res, false, {})
            return
          }
          responseTemplates.successBoundResponse(res, true, {"image": meme.img})
          return
        }
        responseTemplates.successBoundResponse(res, false, {})
      })
  }
});

/**
 * Decodes an array of data urls, generates files from them and sends them in a zip file in the response
 * @param {[String]} dataUrls - the data urls of the images
 * @param {*} response - the http response
 */
function zipImages(dataUrls, response) {
  var zip = new JSZip();
  var memesFolder = zip.folder("memes");

  dataUrls.forEach((dataUrl,index) => {
    var contentIndex = dataUrl.indexOf('base64,') + 'base64,'.length
    var imageContent = dataUrl.substring(contentIndex)
    var byteString = atob(imageContent)   // decode dataUrl
    var bStrLength = byteString.length
    var uint8 = new Uint8Array(new ArrayBuffer(bStrLength))
    for(i = 0; i < bStrLength; i++) {
      uint8[i] = byteString.charCodeAt(i)
    }
    memesFolder.file(`meme${index}.png`, uint8, {base64: true})
  })

  response.setHeader('Content-Disposition', 'attachment; filename="' + 'memes.zip' + '"');
  response.setHeader('Content-Type', 'application/zip');

  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(response)
    .on('finish', () => console.log('memes.zip written.'));
}

/**
 * Generates a DataURL from a given image and two captions
 * @param {*} img - the image
 * @param {*} captionTop - the first caption
 * @param {*} captionBottom - the second caption
 */
function generateDataUrl(img, captionTop, captionBottom){
  const canvas = createCanvas(img.width, img.height);
  const context = canvas.getContext('2d');
  context.drawImage(img, 0, 0, img.width, img.height);
  context.font = '50px sans-serif';
  context.fillText(captionTop, img.width * 0.2, img.height * 0.3);
  context.fillText(captionBottom, img.width * 0.2, img.height * 0.6);
  return canvas.toDataURL()
}

module.exports = router;