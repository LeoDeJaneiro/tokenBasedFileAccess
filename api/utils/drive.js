const { google } = require("googleapis");
const _ = require("lodash");

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

const getFiles = async (fileIds) => {
  if (!process.env.REFRESH_TOKEN) {
    throw new Error("REFRESH_TOKEN is missing");
  }
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const fileResponses = await Promise.allSettled([
    // file metadata
    Promise.allSettled(
      fileIds?.map((fileId) =>
        drive.files.get({
          fileId,
        })
      )
    ),
    // file buffer
    Promise.allSettled(
      fileIds?.map((fileId) =>
        drive.files.get(
          {
            fileId,
            alt: "media",
          },
          { responseType: "stream" }
        )
      )
    ),
  ]);

  if (
    _.chain(fileResponses)
      .first()
      .get("value")
      .value()
      .some((res) => res.status === "rejected")
  ) {
    throw new Error("rejected authorization");
  }

  const filesWithMeta = _.zipWith(
    ...fileResponses.map((response) => response.value),
    (metadataRes, dataRes) => ({
      name: metadataRes.value.data.name,
      mimeType: metadataRes.value.data.mimeType,
      fileBuffer: dataRes.value.data,
    })
  );
  return filesWithMeta;
};

module.exports = { getFiles, getFolderContent };
