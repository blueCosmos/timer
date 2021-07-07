FROM cimg/node:12.16

# Create app directory
WORKDIR /usr/src/app

COPY package.json ./
COPY yarn.lock ./

# Install
RUN yarn install
RUN yarn global add typescript

# Bundle app source
COPY . .

EXPOSE 8080

CMD ["node", "build/index.js"]