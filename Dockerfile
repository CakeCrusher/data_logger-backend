FROM node:14
WORKDIR /app
COPY . .
RUN npm install && npm install typescript -g
EXPOSE 3000
CMD ["npm", "run", "start-dev"]