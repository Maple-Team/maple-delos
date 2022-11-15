FROM node:16 AS builder

WORKDIR app
COPY . .

RUN npm install -g pnpm --registry=https://registry.npmmirror.com/
RUN pnpm install --registry=https://registry.npmmirror.com/
RUN pnpm run build

ENV NODE_ENV=production
EXPOSE 3000

CMD [ "sh", "-c", "npm run start:prod"]