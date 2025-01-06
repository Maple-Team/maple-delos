# building
FROM node:20.18-alpine3.19 AS development

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm config --global set registry https://registry.npmmirror.com/ && \
    npm install --location=global pnpm@9.9.0
RUN pnpm install 

COPY . .

RUN pnpm run build

# running
FROM node:20.18-alpine3.19 AS production

WORKDIR /app

COPY package.json ./
COPY tsconfig.json ./
COPY tsconfig.build.json ./

RUN npm config --global set registry https://registry.npmmirror.com/ && \
    npm install --location=global pnpm@9.9.0
RUN pnpm install --only=production  

COPY . .

COPY --from=development /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 8801

CMD [ "sh", "-c", "npm run start:prod"]