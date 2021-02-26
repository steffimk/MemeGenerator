const express = require('express');
var router = express.Router();
var JSZip = require('jszip');
var atob = require('atob');

const responseTemplates = require('../responseTemplates')
/* Database Operations */
const dbOp = require('../databaseOperations');
const {createCanvas, loadImage} = require('canvas')

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
      zipImages([dataUrl]).then((zip) => {
        res.status(200);
        res.send(zip)
      });
    }).catch((e) => {
      console.log(e)
      res.status(406)
      res.send()
    })
  } else {
      res.status(406)
      res.send()
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

function zipImages(dataUrls) {
  var zip = new JSZip();
  var memesFolder = zip.folder("memes");

  dataUrls.forEach((dataUrl,i) => {
    var contentIndex = dataUrl.indexOf('base64,') + 'base64,'.length
    var imageContent = dataUrl.substring(contentIndex)
    var byteString = atob(imageContent)   // decode dataUrl
    var bStrLength = byteString.length
    var uint8 = new Uint8Array(new ArrayBuffer(bStrLength))
    for(i = 0; i < bStrLength; i++) {
      uint8[i] = byteString.charCodeAt(i)
    }
    memesFolder.file(`meme${i}.png`, uint8, {base64: true})
  })

  return zip.generateAsync({type:"uint8array"})
}

module.exports = router;