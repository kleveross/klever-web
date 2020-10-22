FROM node:12

WORKDIR /usr/src/app

COPY package.json yarn.lock ./

RUN yarn install --prod --ignore-scripts

COPY . .

EXPOSE 8080

CMD [ "node", "app.js" ]
