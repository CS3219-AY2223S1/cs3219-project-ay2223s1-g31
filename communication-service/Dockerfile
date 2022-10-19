FROM node:18-alpine

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 8002

CMD ["npm", "start"]