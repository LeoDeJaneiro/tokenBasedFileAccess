const express = require("express");
const router = express.Router();
const { isTokenValid, increaseTokenUsageCount } = require("../utils/token");

const getDocument = async (req, res) => {
  const { isValid, error } = await isTokenValid(req.params.tokenId);
  if (!isValid) {
    return res.status(400).json({ error });
  }
  await increaseTokenUsageCount(req.params.tokenId);
  res.json({ document: true });
};

router.get("/:tokenId", getDocument);

module.exports = router;
