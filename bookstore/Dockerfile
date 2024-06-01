FROM node:20.11-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json /app/
RUN npm i
COPY src/ /app/src

CMD [ "node", "src/index.js" ]
