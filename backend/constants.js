const secureRandom = require('secure-random');

// TODO: Right now we generate new signing key everytime the server is restarted. Good or bad?
const SIGNING_KEY = secureRandom(256, {type: 'Buffer'})

module.exports = {
  SIGNING_KEY: SIGNING_KEY
};