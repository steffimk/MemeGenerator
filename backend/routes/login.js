const express = require('express');
var router = express.Router();
var crypto = require('crypto');

const responseTemplates = require('../responseTemplates')
/* Database Operations */
const dbOp = require('../databaseOperations')

/* POST login listing. */
router.post('/', function(req, res, next) {
  const db = req.db
  const { username, password } = req.body
  dbOp.findUserWithName(db, username).then((user) => {
    console.log(user)
    if(user === null) {
        responseTemplates.successBoundResponse(res, false, {"message": "User not found. Check the spelling of the username."})
        return
    } else if (user.hasOwnProperty('salt') && user.hasOwnProperty('hash') && 
        passwordIsValid(password, user.salt, user.hash)) {
      // User succesfully logged in
      console.log("Existing user logged in.")
      responseTemplates.sendJWT(res, username)
    } else responseTemplates.successBoundResponse(res, false, {"message": "Wrong password."})
  })
});

function passwordIsValid(password, dbSalt, dbHash){
  const hash = crypto.pbkdf2Sync(password, dbSalt, 1000, 64, 'sha512').toString('hex')
  return hash == dbHash
}

module.exports = router;