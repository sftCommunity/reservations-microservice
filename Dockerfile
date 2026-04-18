FROM node:21-alpine3.19

WORKDIR /repo/microservices/reservations-microservice

COPY microservices/reservations-microservice/package.json microservices/reservations-microservice/package-lock.json* ./
COPY packages/shared /repo/packages/shared

RUN cd /repo/packages/shared && npm ci && npm run build

RUN npm install

COPY microservices/reservations-microservice/ .

RUN npx prisma generate

EXPOSE 3010
