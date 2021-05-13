FROM node:14.15-buster

ENV NODE_ENV production

RUN apt-get update && apt-get install -y apt-utils

COPY . /var/apps/losant-udp-to-webhook
WORKDIR /var/apps/losant-udp-to-webhook
RUN ["npm", "install", "--production", "--loglevel=warn"]

CMD ["node", "/var/apps/losant-udp-to-webhook/main.js"]