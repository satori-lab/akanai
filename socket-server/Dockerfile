FROM node:20

ENV PORT 8080

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

ADD . .

EXPOSE 8080

CMD [ "node", "index.js" ]
