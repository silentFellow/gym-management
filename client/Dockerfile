FROM node:alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

# use static server for production
RUN npm install -g serve

CMD ["serve", "-s", "dist", "-l", "3000"]
