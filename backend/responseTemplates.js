const jwt = require('njwt')
const constants = require('./constants')

module.exports = {

  successBoundResponse(res, isSuccessful, data) {
    res.json({
      "success": isSuccessful,
      "data": data
    })
  },

  sendJWT(res, username) {
    const claims = {permission: 'read-data', username: username}
    const token = jwt.create(claims, constants.SIGNING_KEY)
    token.setExpiration(new Date().getTime() + 60*60*5000) // token expires after five hours
    const jwtTokenString = token.compact()
    // send response
    this.successBoundResponse(res, true, {"token": jwtTokenString})
  }

}