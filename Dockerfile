FROM node:18-alpine

WORKDIR /apps/spotify-clone

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run prebuild
RUN npm run build