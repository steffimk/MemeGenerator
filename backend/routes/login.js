const express = require('express');
const jwt = require('njwt')
const constants = require('../constants')

var router = express.Router();


/* POST login listing. */
router.post('/', function(req, res, next) {
  const db = req.db
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
    const token = jwt.create(claims, constants.SIGNING_KEY)
    token.setExpiration(new Date().getTime() + 60*60*5000) // token expires after five hours
    const jwtTokenString = token.compact()
    res.json({
      "success": true,
      "data": {"token": jwtTokenString}
    })
  }
});

module.exports = router;