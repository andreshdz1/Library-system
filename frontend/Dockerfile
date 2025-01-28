FROM node:16

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

CMD ["npm", "run", "serve"]