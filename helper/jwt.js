const { expressjwt: jwt } = require("express-jwt");

function authJwt() {
  const secret = process.env.SECRET;
  const apiUrl = process.env.APP_URL;
  return jwt({
    secret,
    isRevoked: isRevoked,
    algorithms: ["HS256"],
  }).unless({
    path: [
      { url: /\/public\/upload(.*)/, methods: ["GET", "OPTIONS"] },
      { url: /\/api\/v1\/products(.*)/, methods: ["GET", "OPTIONS"] },
      {
        url: /\/api\/v1\/categories(.*)/,
        methods: ["GET", "OPTIONS"],
      },
      `${apiUrl}/users/login`,
      `${apiUrl}/users/register`,
    ],
  });
}

async function isRevoked(req, token, callBack) {
  if (!token.payload.isAdmin) {
    // TODO Find Why call back is not working
    // callBack(null, true);
    return true;
  }
  // callBack();
  return false;
}

module.exports = authJwt;
