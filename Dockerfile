FROM node
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
COPY tsconfig.json .
RUN npm i
RUN npm run build
COPY . .
CMD ["npm","run","dist/server.js"]