const express = require("express");
const router = express.Router();

const { getFolderContent } = require("../utils/drive");
const { isAuthorizedMiddleware } = require("../utils/auth");

const getDocuments = async (req, res) => {
  try {
    const folderContent = await getFolderContent(req.user.refreshToken);
    res.json(folderContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

router.use(isAuthorizedMiddleware);
router.get("/", getDocuments);

module.exports = router;
