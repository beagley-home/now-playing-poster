FROM node:latest AS frontend_builder

WORKDIR /var/app/frontend

COPY ./app/frontend/package.json .
COPY ./app/frontend/package-lock.json* .
COPY ./app/frontend .

RUN npm i && npm run build

FROM node:latest AS app_builder

WORKDIR /var/app

COPY ./app/package.json .
COPY ./app/package-lock.json* .

RUN npm i

FROM node:latest AS release

WORKDIR /var/app

COPY ./app .
COPY --from=app_builder /var/app/node_modules ./node_modules
COPY --from=frontend_builder /var/app/frontend/dist/ ./frontend

CMD npm run start