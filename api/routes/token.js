const express = require("express");
const router = express.Router();
const moment = require("moment");

const { isAuthorized } = require("../utils/auth");
const Token = require("../utils/tokenModel");
const { getTokenById } = require("../utils/token");

const get = async (req, res, next) => {
  if (req.params.tokenId) {
    const token = await getTokenById(req.params.tokenId).catch(next);
    res.json(token);
  } else {
    const [
      {
        result,
        totalCount: [{ totalCount }],
      },
    ] = await Token.aggregate([
      {
        $facet: {
          result: [
            { $sort: { createdAt: -1 } },
            { $skip: ((req.query.page || 1) - 1) * 10 },
            { $limit: 10 },
          ],
          totalCount: [{ $count: "totalCount" }],
        },
      },
    ]);
    res.json({ result, totalCount });
  }
};

const post = async (req, res, next) => {
  const expiresAt = moment(new Date(req.body.expiresAt)).isValid()
    ? req.body.expiresAt
    : moment().add(21, "days");
  const token = new Token({
    user: req.body.user,
    expiresAt,
  });
  token.save().catch(next);
  res.json(token);
};

const update = async (req, res, next) => {
  const token = await Token.findByIdAndUpdate(req.params.tokenId, req.body, {
    new: true,
  }).catch(next);
  res.json(token);
};

const remove = async (req, res, next) => {
  await Token.findByIdAndRemove(req.params.tokenId).catch(next);
  res.json({ message: "success" });
};

router.use((req, res, next) => {
  if (!isAuthorized(req)) {
    res.status(401);
  }
  next();
});

router.get("/", get);
router.get("/:tokenId", get);
router.post("/", post);
router.put("/:tokenId", update);
router.delete("/:tokenId", remove);

router.use((error, req, res, next) => {
  if (error.toString().startsWith("CastError: Cast to ObjectId failed")) {
    return res.status(400).json({ error: "unknown token" });
  }
  return res.status(400).json({ error: error.toString() });
});

module.exports = router;
