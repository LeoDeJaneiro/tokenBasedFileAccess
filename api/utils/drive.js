const { google } = require("googleapis");
const _ = require("lodash");
const zlib = require("zlib");
const { oAuth2Client } = require("./auth");
const drive = google.drive({ version: "v3", auth: oAuth2Client });

const getFolderContent = async (refreshToken) => {
  oAuth2Client.setCredentials({ refresh_token: refreshToken });
  const folderRes = await drive.files.list({
    q: `mimeType = 'application/vnd.google-apps.folder' and fullText contains '${process.env.GOOGLE_DRIVE_FOLDER}'`,
  });
  if (folderRes.data.files.length === 0) {
    return [];
  }
  const folderId = folderRes.data.files[0].id;
  const filesRes = await drive.files.list({
    orderBy: "name, modifiedTime desc",
    q: `parents in '${folderId}' and not mimeType = 'application/vnd.google-apps.folder'`,
  });
  if (filesRes.errors) {
    throw new Error(
      `Google Drive error on file search: ${filesRes.errors[0].message}.`
    );
  }
  return filesRes.data.files;
};

const setToken = () => {
  if (!process.env.REFRESH_TOKEN) {
    throw new Error("REFRESH_TOKEN is missing");
  }
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });
};

const getFilesMetaData = async (fileIds) => {
  setToken();
  const metadataResponses = await Promise.allSettled(
    fileIds?.map((fileId) =>
      drive.files.get({
        fileId,
      })
    )
  );

  return metadataResponses.map((response) => {
    if (response.status === "rejected") {
      throw new Error("rejected authorization");
    }
    return response.value.data;
  });
};

const getFile = async (fileId) => {
  setToken();
  return new Promise(async (resolve, reject) => {
    const fileStream = await drive.files.get(
      {
        fileId,
        alt: "media",
      },
      { responseType: "stream" }
    );

    const chunks = [];
    fileStream.data
      .on("end", () => {
        const fileBuffer = Buffer.concat(chunks);
        resolve(fileBuffer);
      })
      .on("error", (err) => {
        reject(err);
      })
      .on("data", (chunk) => {
        chunks.push(chunk);
      });
  });
};

module.exports = { getFilesMetaData, getFile, getFolderContent };
