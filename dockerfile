FROM node:latest AS builder

WORKDIR /var/app

COPY ./app/package.json .
COPY ./app/package-lock.json* .

RUN npm i

FROM node:latest AS release

WORKDIR /var/app

COPY --from=builder /var/app/ ./
COPY ./app .

CMD npm run start