FROM node:8-alpine

EXPOSE 4000
WORKDIR /usr/src/app
RUN apk add git
COPY . .
RUN npm install -g serve
RUN npm install

ENV PORT 4000
ENV NODE_ENV production

RUN npm run build -- --mode staging

CMD ["serve", "-s", "wwwroot"]
