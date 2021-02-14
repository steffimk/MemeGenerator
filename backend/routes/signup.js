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
      if (username.length < 1 || /\s/.test(username) || password.length < 7) {
        responseTemplates.negativeResponse(res, "Invalid inputs: Name contains whitespaces or the password is too short.")
        return
      }
      dbOp.createNewUser(db, username, password) // TODO: Check whether successful or not
      // New user created.
      console.log("New user created.")
      responseTemplates.sendJWT(res, username)
    } else responseTemplates.negativeResponse(res, "This username exists already.")
  })
});

module.exports = router;