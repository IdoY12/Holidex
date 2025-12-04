FROM node:22-alpine

WORKDIR /app

COPY ./package*.json ./

RUN npm install

COPY ./ ./

CMD ["npm", "run", "docker"]

# docker run --name sunnydb-frontend -d -p 3011:5173 idoyahav/sunnydb-frontend:1.0.1