FROM node:15-alpine

RUN mkdir /api
WORKDIR /api

COPY . .
RUN yarn --production

CMD ["yarn", "start"]