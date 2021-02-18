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
      if (username.length < 1 || /\s/.test(username) || password.length < 7) {
        responseTemplates.successBoundResponse(res, false, {"message": "Invalid inputs: Name contains whitespaces or the password is too short."})
        return
      }
      const salt = crypto.randomBytes(16).toString('hex')
      const hash = encryptPassword(password, salt)
      dbOp.createNewUser(db, username, salt, hash) // TODO: Check whether successful or not
      // New user created.
      console.log("New user created.")
      responseTemplates.sendJWT(res, username)
    } else responseTemplates.successBoundResponse(res, false, {"message": "This username exists already."})
  })
});

function encryptPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

module.exports = {
  signupRouter: router,
  encryptPassword: encryptPassword
}