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

const getDocument = async (req, res) => {
  try {
    const { documents, error } = await isTokenValid(req.params.tokenId);
    if (error) {
      return res.status(400).json({ error });
    } else if (documents) {
      await increaseTokenUsageCount(req.params.tokenId);
      const { files, error } = await getFiles(documents);
      if (error) {
        throw new Error(error);
      } else {
        res.json(files);
      }
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error("error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// this route uses token for auth
router.get("/:tokenId", getDocument);

router.use(isAuthorizedMiddleware);
router.get("/", getDocuments);

module.exports = router;
