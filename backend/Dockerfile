# start with base image, linux + node
FROM node:22-alpine

# create a folder for the app on the target OS
WORKDIR /app

# copy package.json file && package-lock.json
COPY ./package*.json ./

# install all dependencies while the image builds
RUN npm install

# copy everything except whatever is in .dockerignore
COPY ./ ./

# build typescript into javascript
RUN npm run build

# lets get rid of the src folder
RUN rm -rf ./src

# what runs when the image is loaded by docker into a container
CMD ["npm", "start"]

# docker run --name sunnydb-backend -d -e NODE_ENV=docker  -p 3010:3000 idoyahav/sunnydb-backend:4.0.0