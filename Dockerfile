FROM node:alpine

WORKDIR /usr/home/app

COPY package*.json/ ./

RUN npm ci

COPY . .

CMD [ "node", "app.js" ]
