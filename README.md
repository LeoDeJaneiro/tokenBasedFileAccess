# Token-based File Access (React, Express, Docker, Google APIs)


https://user-images.githubusercontent.com/38670508/145969084-3b93fd76-607c-44ca-951b-8d19211e667e.mov


With this system, you can provide files to a person for a limited period of time and within a limited access scope, hence you will keep control over the sharing beyond standard personal-cloud features. A use case would be, to share your creative work or portfolio with potential business partners without the need to provide a download link to them. Additionally, the link usage count offers metadata on how the person used your content.

With a token-based Link for the access authorization, no log-in will be necessary to retrieve the accessible files. Each token has an _Expiration Date_ and can, furthermore, be _rejected_ via the admin panel. The files are either toggled as downloadable or as embedded into the page - with the result of a hindered unauthorized download. The embedding, for the scope of this prototype, has been developed for PDF-files which are conditionally chosen per screen-width (the file name ending _[...]desktop.pdf_ flags the file for wider screens), and rendered as html-canvas.

After Google authentication of the administrator files within a specific directory in the admin's personal Google Drive can be selected.

### ▶ Dependencies:
  - Node.js 
  - Google Drive API
  - Google OAuth2

### ▶ Prepare:

- Google OAuth & Google Drive API
  - from the Google Cloud Platform console: enable APIs, create credentials, create APP for OAuth
- fill .env-file
  - Google keys GOOGLE_API_KEY, GOOGLE_AUTH_CLIENT_ID, GOOGLE_AUTH_CLIENT_SECRET
    - from the prior step
  - GOOGLE_DRIVE_FOLDER
    - name of the folder in your Google drive which will be used for file selection
  - refresh token
    - Needs to be copied from the admin's session in order to enable token-based access to the admin's files.
  - AUTHORIZED_MAIL_ADDRESSES
    - To keep it simple, there is no user DB for the admin authorization. Instead this list will be used and the admin's google login email address is compared to the list content.

### ▶ start system via Docker compose

```bash
docker-compose build
docker-compose up
```
