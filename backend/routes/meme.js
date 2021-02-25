const express = require('express');
var router = express.Router();

const responseTemplates = require('../responseTemplates')
/* Database Operations */
const dbOp = require('../databaseOperations');

router.get('/mostviews', function(req,res){
  let db = req.db;
  dbOp.findMostViews(db, dbOp.MEME_COLLECTION).then((memes) => {
    const dataUrls = memes.map(meme => meme.img)
    responseTemplates.successBoundResponse(res, true, {images: dataUrls})
  })
})

// router.get('/newest', function(req,res){
//   let db = req.db;
//   dbOp.findNewest(db, dbOp.MEME_COLLECTION).then((memes) => {
//     const dataUrls = memes.map(meme => meme.img)
//     responseTemplates(res, true, {images: dataUrls})
//   })
// })

router.get('/mostlikes', function(req,res){
  let db = req.db;
  dbOp.findMostLikes(db, dbOp.MEME_COLLECTION).then((memes) => {
    const dataUrls = memes.map(meme => meme.name)
    responseTemplates.successBoundResponse(res, true, {images: dataUrls})
  })
})

router.get('/name/:name', function(req,res){
  let db = req.db;
  const name = req.params.name
  if (name) {
    dbOp.findWithName(db, dbOp.MEME_COLLECTION, name).then((memes) => {
      const dataUrls = memes.map(meme => meme.img)
      responseTemplates.successBoundResponse(res, true, {images: dataUrls})
    })
  } else {
    res.status(406);
    res.send();
  }
})

router.get('/:id', function(req, res){
  let db = req.db;
  const id = req.params.id
  if (id) {
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

module.exports = router;