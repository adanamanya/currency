# base image
FROM node:8

# set working directory
RUN mkdir /usr/src/app
WORKDIR /usr/src/app

# install and cache app dependencies
COPY package.json /usr/src/app/package.json
COPY scripts /usr/src/app/scripts
COPY config /usr/src/app/config
COPY public /usr/src/app/public
COPY src /usr/src/app/src

RUN npm install 
RUN npm install react-scripts

# start app
EXPOSE 3000
CMD ["node", "scripts/start.js"]