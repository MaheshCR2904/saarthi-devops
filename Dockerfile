FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

# Non-secret build-time database URL
ENV MONGODB_URI=mongodb://mongodb:27017/saarthi

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]