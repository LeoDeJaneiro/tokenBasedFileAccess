const { google } = require("googleapis");
var jwt = require("jsonwebtoken");

const authorizedUsers = process.env.AUTHORIZED_MAIL_ADDRESSES.split(",");
const authorizedRoute = `${process.env.FRONTEND_HOST}${process.env.ADMIN_ROUTE}`;
const cookieTitle = "session";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_AUTH_CLIENT_ID,
  process.env.GOOGLE_AUTH_CLIENT_SECRET,
  `${process.env.API}/auth/callback`
);

const isAuthorized = (emailAddress) => authorizedUsers.includes(emailAddress);

const signJWT = (user) =>
  jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "6d" });

const verifyJWT = (token) => {
  try {
    return { user: jwt.verify(token, process.env.JWT_SECRET) };
  } catch (err) {
    return { invalid: true };
  }
};

const isAuthorizedMiddleware = (req, res, next) => {
  const { user, invalid } = verifyJWT(req.cookies[cookieTitle]);
  if (invalid) {
    res.status(403).json({
      error: "unauthenticated",
    });
  } else {
    req.user = user;
    next();
  }
};

module.exports = {
  isAuthorized,
  oAuth2Client,
  isAuthorizedMiddleware,
  authorizedRoute,
  cookieTitle,
  signJWT,
};
