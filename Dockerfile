FROM node:14.17.6-alpine3.13

# RUN addgroup nomad && adduser -S -G nomad nomad
# USER nomad

WORKDIR /app

COPY package.json ./

COPY client/package.json client/yarn.lock client/
RUN cd client && yarn install

COPY server/package.json server/yarn.lock server/
RUN cd server && yarn install

COPY server/ server/
RUN cd server && yarn build

COPY client/ client/
RUN cd client && yarn build

USER node

RUN cd server
CMD [ "yarn","start" ]

EXPOSE 3000

