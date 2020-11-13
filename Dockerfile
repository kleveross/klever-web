FROM node:12

WORKDIR /usr/src/app

COPY . .

RUN yarn install --prod --ignore-scripts

EXPOSE 8080

CMD [ "npm", "run", "server" ]
