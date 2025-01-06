# building
FROM node:22-alpine3.19 AS development

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm config --global set registry https://registry.npmmirror.com/ && \
    npm install --location=global pnpm && \
    pnpm install @types/bull --save-dev && \
    pnpm install

COPY . .

RUN pnpm run build

# running
FROM node:22-alpine3.19 AS production

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./


RUN npm config --global set registry https://registry.npmmirror.com/ && \ 
    npm install --location=global pnpm && \
    pnpm install --only=production

COPY --from=development /app/dist ./dist

COPY .env .env
COPY .env.production .env.production

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "sh", "-c", "npm run start:prod"]