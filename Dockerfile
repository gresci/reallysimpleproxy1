FROM node:16-alpine
WORKDIR /app
COPY /app/package.json /app
RUN cd /app && npm install
COPY /app/index.js /app
EXPOSE 3000
CMD ["node", "/app/index.js"]

