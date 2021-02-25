const express = require('express');
var router = express.Router();

const responseTemplates = require('../responseTemplates')
/* Database Operations */
const dbOp = require('../databaseOperations');
const {createCanvas, loadImage} = require('canvas')

router.get("/create", function (req, res) {
  const { imageUrl, captionTop, captionBottom } = req.query;

  if(imageUrl && captionTop && captionBottom) {
    loadImage(imageUrl).then((img) => {
      console.log(img.width + ' ' + img.height)
      const canvas = createCanvas(img.width, img.height);
      const context = canvas.getContext('2d')
      context.drawImage(img, 0, 0, img.width, img.height);
      context.font = '50px sans-serif';
      context.fillText(captionTop, img.width*0.2, img.height*0.3)
      context.fillText(captionBottom, img.width*0.2, img.height*0.6)
      const dataUrl = canvas.toDataURL();
      res.status(200);
      res.json({dataUrl: dataUrl});
      res.send();
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

module.exports = router;