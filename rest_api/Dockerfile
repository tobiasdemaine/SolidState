# pull the base image

FROM debian


# set the working direction

WORKDIR /app
#VOLUME /var/run/docker.sock:/var/run/docker.sock

# add `/app/node_modules/.bin` to $PATH

ENV PATH /app/node_modules/.bin:$PATH

# installdocker
RUN apt-get update
RUN apt-get -y install docker.io curl gnupg
RUN curl -sL https://deb.nodesource.com/setup_17.x  | bash -
RUN apt-get -y install nodejs
RUN npm install
# installer
# install app dependencies

COPY package.json ./


COPY package-lock.json ./



RUN npm install


# add app

COPY . ./


# start app

CMD ["npm", "start"]