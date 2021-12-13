FROM node:15-alpine
RUN apk --update --no-cache upgrade
RUN npm install pm2 -g 

RUN mkdir /service
WORKDIR /service

COPY . .
RUN yarn --production 
ARG REACT_APP_GOOGLE_DRIVE_FOLDER
ARG REACT_APP_API
ARG NODE_ENV

RUN yarn build


CMD ["pm2-runtime", "process.yml"]