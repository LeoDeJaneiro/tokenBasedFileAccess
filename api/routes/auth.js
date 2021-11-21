const express = require("express");
const router = express.Router();
const passport = require("passport");

require("../utils/passport");
const {
  cookieTitle,
  isAuthorized,
  signJWT,
  authorizedRoute,
} = require("../utils/auth");

const callback = async (req, res) => {
  try {
    if (isAuthorized(req.user.email)) {
      const token = signJWT({
        email: req.user.email,
        givenName: req.user.given_name,
        picture: req.user.picture,
        refreshToken: req.user.refreshToken,
      });
      res
        .cookie(cookieTitle, token, { secure: true })
        .redirect(authorizedRoute);
    } else {
      throw new Error("unauthorized");
    }
  } catch (error) {
    console.error("error: ", error);
    res.status(403).json({
      error: "unauthenticated",
    });
  }
};

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
  }),
  callback
);

router.get(
  "/",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/userinfo.email",
      "https://www.googleapis.com/auth/drive.readonly",
      "https://www.googleapis.com/auth/drive.metadata.readonly",
    ],
    accessType: "offline",
    prompt: "consent",
  })
);

module.exports = router;
