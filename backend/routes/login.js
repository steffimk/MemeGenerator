const express = require('express');
var router = express.Router();

const jwt = require('njwt')
const constants = require('../constants')
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
        console.log('Invalid inputs')
        res.json({
          "success": false,
          "data": {"message": "Invalid inputs: Name is empty, contains a whitespace or the password is too short."}
        })
        return
      }
      dbOp.createNewUser(db, username, password) // TODO: Check whether successful or not
      // New user created.
      console.log("New user created.")
      sendJWT(res, username)
    } else if (user.hasOwnProperty('password') && user.password === password) {
      // User succesfully logged in
      console.log("Existing user logged in.")
      sendJWT(res, username)
    } else {
      res.json({
        "success": false,
        "data": {"message": "Could not login. Username exists already or wrong password"}
      })
    } 
  })
});

function sendJWT(res, username) {
  const claims = {permission: 'read-data', username: username}
  const token = jwt.create(claims, constants.SIGNING_KEY)
  token.setExpiration(new Date().getTime() + 60*60*5000) // token expires after five hours
  const jwtTokenString = token.compact()
  res.json({
    "success": true,
    "data": {"token": jwtTokenString}
  })
}

function areNameAndPWValid(username, password) {
  return username.isEmpty || password.length < 7
}

module.exports = router;