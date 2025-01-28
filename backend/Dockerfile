FROM node:16

WORKDIR /usr/src/app/backend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

CMD ["npm", "run", "start:prod"]