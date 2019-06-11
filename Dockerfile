# Specify base image
FROM mhart/alpine-node
WORKDIR /app
COPY package.json .
RUN apk add --no-cache \
  autoconf \
  automake \
  bash \
  g++ \
  make \
  nasm
RUN npm install -g pm2
RUN npm install
COPY . .
RUN npm run build

EXPOSE 80/tcp
EXPOSE 8080/tcp
ENV NODE_ENV production
CMD ["pm2", "start", "-f", "server.js", "--name", "next-weather", "--no-daemon"]
