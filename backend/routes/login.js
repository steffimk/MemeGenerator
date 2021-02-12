const express = require('express');
const jwt = require('njwt')
const secureRandom = require('secure-random');
const signingKey = secureRandom(256, {type: 'Buffer'}); // TOODO: save key

var router = express.Router();

/* GET login listing. */
router.post('/', function(req, res, next) {
  const username = req.body.username
  const password = req.body.password
  if ('username schon vergeben oder pw falsch' === '') { // TODO
    res.json({
      "success": false,
      "data": {"message": "Could not login. Username exists already or wrong password"}
    })
    return
  }
  else {  // TODO: evtl new user in db
    const claims = {permission: 'read-data', username: username}
    const token = jwt.create(claims, 'key')
    token.setExpiration(new Date().getTime() + 60*60*5000) // token expires after five ho
    const jwtTokenString = token.compact()
    res.json({
      "success": true,
      "data": {"token": jwtTokenString}
    })
  }
});

module.exports = router;