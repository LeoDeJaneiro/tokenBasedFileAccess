const express = require("express");
const router = express.Router();

const { isTokenValid, increaseTokenUsageCount } = require("../utils/token");
const { getFolderContent, getFiles } = require("../utils/drive");
const { isAuthorizedMiddleware } = require("../utils/auth");

const getDocuments = async (req, res) => {
  try {
    const folderContent = await getFolderContent(req.user.refreshToken);
    res.json(folderContent);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getDocumentsForToken = async (req, res) => {
  try {
    const { documents, error } = await isTokenValid(req.params.tokenId);
    let files;
    if (error) {
      res.status(400).json({ error });
    } else if (documents?.length > 0) {
      files = await getFiles(documents);
    } else {
      files = [];
    }
    await increaseTokenUsageCount(req.params.tokenId);
    res.json(files);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// token-based authorization
router.get("/:tokenId", getDocumentsForToken);

router.use(isAuthorizedMiddleware);
router.get("/", getDocuments);

module.exports = router;
