FROM node:latest AS build-stage

WORKDIR /app

COPY . .

RUN npm install && npm run build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html

COPY --from=build-stage /app/dist /usr/share/nginx/html