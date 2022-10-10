FROM node:16-alpine AS builder

WORKDIR "/app"
COPY . .
RUN npm install --registry=https://registry.npmmirror.com/
RUN npm run build
RUN npm prune --production

# RUN npm install -g pnpm
# RUN pnpm install
# RUN pnpm run build
# RUN pnpm prune --prod

FROM node:16-alpine AS production

WORKDIR "/app"
COPY --from=builder /app/package.json ./package.json
# COPY --from=builder /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production

CMD [ "sh", "-c", "npm run start:prod"]