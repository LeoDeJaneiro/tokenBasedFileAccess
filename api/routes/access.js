const express = require("express");
const router = express.Router();

const { isTokenValid, increaseTokenUsageCount } = require("../utils/token");
const { getFilesMetaData, getFile } = require("../utils/drive");

const getAccess = async (req, res) => {
  try {
    const { documents, error } = await isTokenValid(req.query.token);
    await increaseTokenUsageCount(req.query.token);

    if (error) {
      res.status(400).json({ error });
    } else if (documents?.length > 0) {
      const meta = await getFilesMetaData(documents);
      res.json(meta);
    } else {
      res.json([]);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const getDocumentAccess = async (req, res) => {
  try {
    const { documents, error } = await isTokenValid(req.query.token);
    if (error) {
      res.status(400).json({ error });
    } else if (!documents.includes(req.params.documentId)) {
      res.status(400).json({ error: "Unknown documentId" });
    } else {
      const file = await getFile(req.params.documentId);
      res.send(file);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// token-based authorization
router.get("/", getAccess);
router.get("/:documentId", getDocumentAccess);

module.exports = router;
