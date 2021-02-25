var express = require('express');
const dbOp = require('../databaseOperations')
var router = express.Router();
const responseTemplates = require('../responseTemplates')
const { isValidUrl, isPositiveInteger } = require('./templates')

router.get('/:username', function(req,res) {
  let db = req.db;
  const username = req.params.username
  if (username) {
      dbOp.findAllOfUser(db, dbOp.MEME_COLLECTION, username).then((docs) => {
          responseTemplates.successBoundResponse(res, true, {"memes": docs})
      })
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
      normalizedMeme.views = 0              // set views to 0
      dbOp.addToDB(req.db, dbOp.MEME_COLLECTION, normalizedMeme);

      res.status(200);
      res.send();
  } else {
      res.status(406);
      res.send();
  }
});

router.post("/like", function(req, res) {
  let db = req.db;
  const memeId = req.body.memeId;
  const like = req.body.like;
  console.log(memeId + " " + like)
  if (memeId && like) {
      dbOp.likeMeme(db, memeId, like)
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
    if (memeId) {
        dbOp.viewMeme(db, memeId)
        res.status(200);
        res.send();
    } else {
        res.status(406);
        res.send();
    }
});

module.exports = router;
