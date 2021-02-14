const jwt = require('njwt')
const constants = require('./constants')

module.exports = {

  negativeResponse(res, message) {
    res.json({
      "success": false,
      "data": {"message": message}
    })
  },

  sendJWT(res, username) {
    const claims = {permission: 'read-data', username: username}
    const token = jwt.create(claims, constants.SIGNING_KEY)
    token.setExpiration(new Date().getTime() + 60*60*5000) // token expires after five hours
    const jwtTokenString = token.compact()
    res.json({
      "success": true,
      "data": {"token": jwtTokenString}
    })
  }

}