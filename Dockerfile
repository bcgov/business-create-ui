# build stage
FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production stage
FROM docker.pkg.github.com/bcregistry/base_images/caddy:20200115 as prod
RUN mkdir /srv/basePath
COPY --from=build-stage /app/dist /srv/basePath
