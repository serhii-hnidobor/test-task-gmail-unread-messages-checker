FROM ubuntu:22.04

ARG EMAIL
ENV EMAIL=$EMAIL
ARG PASSWORD
ENV PASSWORD=$PASSWORD

WORKDIR /app

RUN apt-get update && apt-get install -y curl

RUN curl -sL https://deb.nodesource.com/setup_18.x -o /tmp/nodesource_setup.sh

RUN bash /tmp/nodesource_setup.sh

RUN apt-get update && apt-get install -y nodejs

COPY ./package.json ./package.json

RUN npm i
RUN npx playwright install chromium
RUN npx playwright install-deps chromium

RUN apt install xvfb

COPY ./main.js ./main.js

EXPOSE 3000

CMD [ "xvfb-run", "--auto-servernum", "--server-num=1", "node","./main.js", "-e", "$EMAIL", "-p", "$PASSWORD"]
