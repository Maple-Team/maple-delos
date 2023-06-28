# building
FROM node:18-alpine3.14 AS development

WORKDIR app

COPY package.json ./
COPY tsconfig.build.json ./

RUN npm config --global set registry https://registry.npmmirror.com/ 
RUN npm install -g pnpm
RUN pnpm install --registry=https://registry.npmmirror.com/ 

COPY . .

RUN pnpm run build

# running
FROM node:18-alpine3.14 AS production

WORKDIR app

COPY package.json ./
COPY tsconfig.build.json ./

COPY --from=development /app/dist ./dist

# RUN npm install --omit=dev --registry=https://registry.npmmirror.com/
RUN npm config --global set registry https://registry.npmmirror.com/ 
RUN npm install --location=global pnpm
RUN pnpm install --only=production

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "sh", "-c", "npm run start:prod"]