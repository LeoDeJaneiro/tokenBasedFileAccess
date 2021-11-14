const express = require("express");
const router = express.Router();

const { isTokenValid, increaseTokenUsageCount } = require("../utils/token");
const { getFolderContent, getFiles } = require("../utils/drive");

const getDocuments = async (req, res) => {
  try {
    const folderContent = await getFolderContent();
    res.json(folderContent);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

const getDocument = async (req, res) => {
  try {
    const { documents, error } = await isTokenValid(req.params.tokenId);
    if (error) {
      return res.status(400).json({ error });
    }
    await increaseTokenUsageCount(req.params.tokenId);
    const files = await getFiles(documents);
    res.json(files);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

router.get("/:tokenId", getDocument);
router.get("/", getDocuments);

module.exports = router;
