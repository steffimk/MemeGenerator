const express = require('express');
var router = express.Router();
var { encryptPassword } = require('./signup')

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

/**
 * Checks whether the entered password is correct
 * @param {*} password - pw entered by the user
 * @param {*} dbSalt - salt of user from database
 * @param {*} dbHash - hash of password of user from database
 */
function passwordIsValid(password, dbSalt, dbHash){
  const hash = encryptPassword(password, dbSalt)
  return hash == dbHash
}

module.exports = router;