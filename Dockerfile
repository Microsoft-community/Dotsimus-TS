FROM node:17-alpine

WORKDIR /app
COPY package*.json .
RUN npm i

COPY . .

RUN npm run build

ENTRYPOINT [ "npm", "run", "start-no-build" ]