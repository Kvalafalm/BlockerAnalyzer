

FROM node:18
ENV NODE_ENV=production
WORKDIR /usr/app/
COPY ./ /usr/app

RUN npm install cross-env
RUN npm install
RUN npm install --prefix client
RUN npm run build --prefix client

EXPOSE 80
CMD ["npm", "start"]
