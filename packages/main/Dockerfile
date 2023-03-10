# building
FROM node:lts-alpine AS development

WORKDIR app

COPY package.json ./
COPY tsconfig.build.json ./

RUN npm install -g pnpm --registry=https://registry.npmmirror.com/ 
RUN pnpm install --registry=https://registry.npmmirror.com/ 

COPY . .


RUN pnpm run build

# running
FROM node:lts-alpine AS production

WORKDIR app

COPY package.json ./
COPY tsconfig.build.json ./

# RUN npm install --omit=dev --registry=https://registry.npmmirror.com/

RUN npm install -g pnpm --registry=https://registry.npmmirror.com/ 
RUN pnpm install --only=production --registry=https://registry.npmmirror.com/ 

COPY . .

COPY --from=development /app/dist ./dist

ENV NODE_ENV=production

EXPOSE 3000

CMD [ "sh", "-c", "npm run start:prod"]