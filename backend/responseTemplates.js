const jwt = require('njwt')

module.exports = {

  successBoundResponse(res, isSuccessful, data) {
    res.json({
      "success": isSuccessful,
      "data": data
    })
  },

  sendJWT(res, username) {
    const claims = {permission: 'read-data', username: username}
    const token = jwt.create(claims, process.env.SIGNING_KEY)
    token.setExpiration(new Date().getTime() + 60*60*5000) // token expires after five hours
    const jwtTokenString = token.compact()
    // send response
    this.successBoundResponse(res, true, {"token": jwtTokenString})
  }

}