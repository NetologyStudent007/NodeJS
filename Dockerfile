FROM node:20.11-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY package*.json /app/
RUN npm i
RUN npx tsc
COPY dist/ /app/dist
COPY src/views/ /app/dist/views

CMD [ "node", "dist/index.js" ]
