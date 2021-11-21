const { google } = require("googleapis");
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
    q: `parents in '${folderId}'`,
  });
  if (filesRes.errors) {
    throw new Error(
      `Google Drive error on file search: ${filesRes.errors[0].message}.`
    );
  }
  return filesRes.data.files;
};

const getFiles = async (refreshToken, fileIds) => {
  oAuth2Client.setCredentials({ refresh_token: refreshToken });
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

module.exports = { getFiles, getFolderContent };
