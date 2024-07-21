FROM node:20.15.1

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma migrate deploy
RUN npx prisma generate

RUN npm run build 

EXPOSE 3000
CMD npm start