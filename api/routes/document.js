const express = require("express");
const router = express.Router();
const { google } = require("googleapis");

const { isTokenValid, increaseTokenUsageCount } = require("../utils/token");

const refreshToken =
  "1//048oHbjuX0dUICgYIARAAGAQSNwF-L9IrcTk5Xy8w64lLT-9ycuGWyfRbTb1U4vpiplpguBl6cvZJHp7bPMlW5WHvftmIEHHsX2M";

const oAuth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_AUTH_CLIENT_ID,
  process.env.GOOGLE_AUTH_CLIENT_SECRET,
  process.env.REDIRECT_URL
);
oAuth2Client.setCredentials({ refresh_token: refreshToken });
const drive = google.drive({ version: "v3", auth: oAuth2Client });

const getFolderContent = async () => {
  const folderRes = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and fullText contains '${process.env.G_DRIVE_FOLDER}'`,
  });
  if (folderRes.data.files.length === 0) {
    throw new Error("Google Drive folder has not been found.");
  }
  const folderId = folderRes.data.files[0].id;
  const filesRes = await drive.files.list({
    orderBy: "folder,modifiedTime desc,name",
    q: `parents in '${folderId}'`,
  });
  if (filesRes.errors) {
    throw new Error(
      `Google Drive error on file search: ${filesRes.errors[0].message}.`
    );
  }
  return filesRes.data.files;
};

const getFiles = async (fileIds = ["151PflLMd27MjqkgRZc3Fw98dD0g7SEDN"]) => {
  const fileResponses = await Promise.allSettled(
    fileIds.map((fileId) =>
      drive.files.get(
        {
          fileId,
          alt: "media",
        },
        { responseType: "stream" }
      )
    )
  );
  return fileResponses.map(
    (response) =>
      response.status === "fulfilled" && {
        data: response.value.data,
        headers: response.value.headers,
      }
  );
};

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
    const { fileIds, error } = await isTokenValid(req.params.tokenId);
    if (error) {
      return res.status(400).json({ error });
    }
    await increaseTokenUsageCount(req.params.tokenId);
    const file = await getFiles(fileIds);
    res.json(file);
  } catch (err) {
    res.status(500).send(err.message);
  }
};

router.get("/:tokenId", getDocument);
router.get("/", getDocuments);

module.exports = router;
