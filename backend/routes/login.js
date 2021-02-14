const express = require('express');
var router = express.Router();

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
        responseTemplates.negativeResponse(res, "User not found. Check the spelling of the username.")
        return
    } else if (user.hasOwnProperty('password') && user.password === password) {
      // User succesfully logged in
      console.log("Existing user logged in.")
      responseTemplates.sendJWT(res, username)
    } else responseTemplates.negativeResponse(res, "Wrong password.")
  })
});

module.exports = router;