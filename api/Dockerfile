FROM node:15-alpine
RUN apk --update --no-cache upgrade
RUN npm install pm2 -g 

RUN mkdir /service
WORKDIR /service

COPY . .
RUN yarn --production

CMD ["pm2-runtime", "process.yml"]