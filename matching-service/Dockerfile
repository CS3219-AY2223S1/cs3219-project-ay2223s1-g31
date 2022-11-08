FROM node:18-alpine

WORKDIR /usr/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .

EXPOSE 8001

CMD ["npm", "start"]