const { expressjwt: jwt } = require('express-jwt');
const jwks = require('jwks-rsa');
require('dotenv').config();

const authenticateToken = jwt({
  secret: jwks.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256']
});

module.exports = function(req, res, next) {
  authenticateToken(req, res, (err) => {
    if (err) {
      return res.status(401).json({ error: 'Unauthorized', details: err.message });
    }
    next();
  });
};