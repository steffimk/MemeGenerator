const jwt = require('njwt')

module.exports = {

  /**
   * Template for a response to a http request
   * @param {*} res - the http response
   * @param {*} isSuccessful - suggests whether the request was succesful
   * @param {*} data - the requested data
   */
  successBoundResponse(res, isSuccessful, data) {
    res.json({
      "success": isSuccessful,
      "data": data
    })
  },

  /**
   * Template for sending the JSONWebToken
   * @param {*} res - the http response
   * @param {*} username - the name of the user receiving the JWT
   */
  sendJWT(res, username) {
    const claims = {permission: 'read-data', username: username}
    const token = jwt.create(claims, process.env.SIGNING_KEY)
    token.setExpiration(new Date().getTime() + 60*60*5000) // token expires after five hours
    const jwtTokenString = token.compact()
    // send response
    this.successBoundResponse(res, true, {"token": jwtTokenString})
  }

}