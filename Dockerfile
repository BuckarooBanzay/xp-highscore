FROM node:alpine

COPY package.json /data/
COPY src /data/src
COPY public /data/public

RUN cd /data && npm i

WORKDIR /data

EXPOSE 8080

CMD ["node", "src/index.js"]
