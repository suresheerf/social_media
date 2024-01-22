FROM node:alpine
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
RUN npm i
RUN npm run build
COPY . .
CMD ["npm","run","dist/server.js"]