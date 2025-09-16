FROM node:22-alpine as builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

FROM node:22-alpine

RUN apk add --no-cache redis

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/node_modules ./node_modules

COPY package*.json ./
COPY . .

RUN mkdir -p /data

EXPOSE 5001
EXPOSE 6379

COPY start.sh ./
RUN chmod +x start.sh

CMD ["./start.sh"]