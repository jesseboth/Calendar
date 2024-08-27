FROM node:latest
ENV TZ=America/New_York
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8000

#CMD ["node", "server.js"]
CMD ["sh", "-c", "node server.js >> /usr/src/app/logs/server.log 2>&1"]
