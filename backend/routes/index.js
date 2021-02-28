var express = require('express');
const dbOp = require('../databaseOperations')
var router = express.Router();
const responseTemplates = require('../responseTemplates')
const { isValidUrl, isPositiveInteger } = require('./templates')
const {createCanvas, loadImage} = require('canvas')

router.get('/:username', function(req,res) {
  let db = req.db;
  const username = req.params.username
  if (username) {
      dbOp.findAllOfUser(db, dbOp.MEME_COLLECTION, username).then((docs) => {
          responseTemplates.successBoundResponse(res, true, {"memes": docs})
      })
  } else {
    res.status(406);
    res.send();
  }
});

router.get('/', function (req, res) {
  let db = req.db;
  // console.log("in memes", db)
  dbOp.findAllWithPrivacyLabel(db,dbOp.MEME_COLLECTION,'public')
  .then((docs) => {
      docs.forEach((template) => template.id = template._id)
      return (docs);
  } )
  .then((docs) => {
      responseTemplates.successBoundResponse(res, true, {"memes": docs})
  });
});

router.post("/", function (req, res){
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
      let creation_time = Date.now();

      // ignore any unknown values in the input data
      const normalizedMeme = {
          template_id, creation_time, img, template_url, name, box_count, username, imageDescription,
          captions, captionPositions, fontColor, fontSize, isItalic, isBold, privacyLabel
      }
      normalizedMeme.views = []
      normalizedMeme.viewCount = 0 // set views to 0
      dbOp.addToDB(req.db, dbOp.MEME_COLLECTION, normalizedMeme);

      res.status(200);
      res.send();
  } else {
      res.status(406);
      res.send();
  }
});


router.post("/create", function (req, res) {

    const meme = req.body;


    const {
        currentImage, imageInfo, captions, captionPositions_X, captionPositions_Y, fontSize, isItalic,
        isBold, fontColor, addedImages, addedImgPositions_X, addedImgPositions_Y, addedImgSizes, canvasSize,
        drawingCoordinates
    } = meme;

    const canvas = createCanvas(canvasSize.width, canvasSize.height);
    const context = canvas.getContext('2d');

    // Load main image
    loadImage(currentImage.url).then((image) => {
        let promises = [];
        addedImages.forEach( (element) => {
            promises.push(loadImage(element.url));
            }
        )
        //load all other images
        Promise.all(promises).then((erg) => {
            drawImage(imageInfo, currentImage, context, image, canvasSize, erg, addedImgSizes, addedImgPositions_X,
                addedImgPositions_Y);
            drawCaptions(captions, captionPositions_X, captionPositions_Y, isItalic, isBold, context, fontSize, fontColor,
                canvasSize);
            drawCoordinates(drawingCoordinates, context);
            const dataUrl = canvas.toDataURL();
            res.status(200);
            res.json({dataUrl: dataUrl});
            res.send();
        })
    });

});

/**
 * Draw image on Canvas
 * @param imageInfo
 * @param currentImage
 * @param context
 * @param image
 * @param canvasSize
 * @param addedImages
 * @param addedImgSizes
 * @param addedImgPositions_X
 * @param addedImgPositions_Y
 */
drawImage = (imageInfo, currentImage, context, image, canvasSize, addedImages, addedImgSizes, addedImgPositions_X,
             addedImgPositions_Y) => {

    if (imageInfo.size != null) {
        const imgWidth = currentImage.width * imageInfo.size / 100;
        const imgHeight = currentImage.height * imageInfo.size / 100;
        context.drawImage(
            image,
            imageInfo.x * ((canvasSize.width - imgWidth) / 100),
            imageInfo.y * ((canvasSize.height - imgHeight) / 100),
            imgWidth, imgHeight
        );
    } else {
        context.drawImage(image, 0, 0, canvasSize.width, canvasSize.height);
    }

    addedImages.forEach((imgRef, i) => {
        if(imgRef) {
            const imgWidth = imgRef.width* addedImgSizes[i]/100
            const imgHeight = imgRef.height* addedImgSizes[i]/100
            context.drawImage(
                imgRef,
                addedImgPositions_X[i] * ((canvasSize.width - imgWidth)/100),
                addedImgPositions_Y[i] * ((canvasSize.height - imgHeight)/100),
                imgWidth, imgHeight)
        }
    })
}
/**
 * Draw Captions
 * @param captions
 * @param captionsPositions_X
 * @param captionsPositions_Y
 * @param isItalic
 * @param isBold
 * @param context
 * @param fontSize
 * @param fontColor
 * @param canvasSize
 */
drawCaptions = (captions, captionsPositions_X, captionsPositions_Y, isItalic, isBold, context, fontSize, fontColor,
                canvasSize) => {

    captions.forEach((captionText, index) => {
        let captionPosition_X = captionsPositions_X[index];
        let captionPosition_Y = captionsPositions_Y[index];

        if(captionPosition_X !== undefined && captionPosition_Y !== undefined) {
            const italic = isItalic === true ? 'italic' : 'normal';
            const bold = isBold === true ? 'bold' : 'normal';
            context.font = italic + ' ' + bold + ' ' + fontSize + 'px sans-serif';
            context.fillStyle = fontColor;
            context.fillText(captionText, captionPosition_X * canvasSize.width/100,
                captionPosition_Y * canvasSize.height/100)
        }
    })
}

/**
 * Draw hand drawing
 * @param drawingCoordinates
 * @param context
 */
drawCoordinates = (drawingCoordinates, context) => {

    if (drawingCoordinates.length > 0) {
        drawingCoordinates.forEach((coordinate, index) => {
            const {x, y, isNewStroke} = coordinate;
            if (isNewStroke) {
                if (index > 0) context.stroke();
                context.beginPath();
                context.moveTo(x, y);
            } else {
                context.lineTo(x, y);
            }
        });
        context.stroke();
    }
}

router.post("/like", function(req, res) {
  let db = req.db;
  const { memeId, username, date, isDislike } = req.body;
  console.log(memeId + " " + username + " " + date + " " + isDislike)
  if (memeId && username && date && isDislike !== undefined) {
      if (isDislike === true) {
        dbOp.dislikeMeme(db, memeId, username, date)
      } else {
        dbOp.likeMeme(db, memeId, username, date)
      }
      res.status(200);
      res.send();
  } else {
      res.status(406);
      res.send();
  }
});

router.post("/comment", function(req, res) {
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

router.post("/view", function(req, res) {
    let db = req.db;
    const memeId = req.body.memeId;
    const date = req.body.date;
    if (memeId) {
        dbOp.viewMeme(db, memeId, date)
        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
});


router.get('/templateurl/:url', function (req, res){
    let db = req.db;

    let template_url = decodeURIComponent(req.params.url);
    console.log("template url ", template_url)
    if (template_url) {
        dbOp.findWithTemplateUrl(db, dbOp.MEME_COLLECTION, template_url).then((memes) => {
            res.status(200);
            res.json({memes: memes});
            res.send();
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

module.exports = router;
