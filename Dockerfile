FROM node:16
WORKDIR /app
COPY . .
RUN npm i --only=production --registry=https://registry.npmmirror.com/
EXPOSE 3090
CMD ["node", "dist/main.js"]