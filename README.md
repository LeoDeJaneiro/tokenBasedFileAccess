# Token-based File Access

With this system, you can provide files to a person for a limited period of time and within a limited access scope, hence you will keep control over the sharing beyond standard personal-cloud features. A use case would be, to share your creative work or portfolio with potential business partners without the need to provide a download link to them. Additionally, the link usage count offers metadata on how the person used your content.

With a token-based Link for the access authorization, no log-in will be necessary to retrieve the accessible files. Each token has an _Expiration Date_ and can, furthermore, be _rejected_ via the admin panel. The files are either toggled as downloadable or as embedded into the page - with the result of a hindered unauthorized download. The embedding, for the scope of this prototype, has been developed for PDF-files which are conditionally chosen per screen-width, and rendered as html-canvas.

After Google authentication of the administrator files within a specific directory in the admin's personal Google Drive can be selected.

### Prepare:

- MongoDB
  - add connection string to the .env-file
- Google OAuth & Google Drive API
  - from the Google Cloud Platform console: enable APIs, create credentials, create APP for OAuth
  - fill .env-file

### ▶ start API

- Replace `.env.sample` with `.env` and provide variables

```bash
npm i
npm start
```

### ▶ start React-APP

```bash
npm i
npm start
```
