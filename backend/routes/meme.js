const express = require('express');
var router = express.Router();
var JSZip = require('jszip');
var atob = require('atob');

const responseTemplates = require('../responseTemplates')
/* Database Operations */
const dbOp = require('../databaseOperations');
const {createCanvas, loadImage} = require('canvas');

router.get("/create", function (req, res) {
  const { imageUrl, captionTop, captionBottom } = req.query;

  if(imageUrl && captionTop && captionBottom) {
    loadImage(imageUrl).then((img) => {
      const canvas = createCanvas(img.width, img.height);
      const context = canvas.getContext('2d')
      context.drawImage(img, 0, 0, img.width, img.height);
      context.font = '50px sans-serif';
      context.fillText(captionTop, img.width*0.2, img.height*0.3)
      context.fillText(captionBottom, img.width*0.2, img.height*0.6)
      const dataUrl = canvas.toDataURL();
      res.setHeader("Content-Disposition", "attachment; filename=\"" + "memes.zip" + "\"");
      res.setHeader("Content-Type", "application/zip");
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
            for (i = 0; i < captions.length-1 && i < 10; i = i+2) { // Maximal 10 Bilder
              const canvas = createCanvas(img.width, img.height);
              const context = canvas.getContext('2d');
              context.drawImage(img, 0, 0, img.width, img.height);
              context.font = '50px sans-serif';
              context.fillText(captions[i], img.width * 0.2, img.height * 0.3);
              context.fillText(captions[i + 1], img.width * 0.2, img.height * 0.6);
              dataUrls.push(canvas.toDataURL());
            }
            res.setHeader('Content-Disposition', 'attachment; filename="' + 'memes.zip' + '"');
            res.setHeader('Content-Type', 'application/zip');
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

router.get('/:id', function(req, res){
  let db = req.db;
  const id = req.params.id
  if (id) {
      dbOp.findOneFromDB(db, 'memes', id).then((meme) => {
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

  zip
    .generateNodeStream({ type: 'nodebuffer', streamFiles: true })
    .pipe(response)
    .on('finish', () => console.log('out.zip written.'));
}

module.exports = router;