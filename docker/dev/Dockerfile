FROM node:19

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5501

CMD ["npm","run","dev"]

