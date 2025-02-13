# reference: https://pnpm.io/docker#example-2-build-multiple-docker-images-in-a-monorepo

FROM node:18.20-alpine3.18 AS base

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV registry="https://registry.npmmirror.com"
ENV COREPACK_NPM_REGISTRY=${registry}

RUN npm config set registry ${registry}
RUN npm install -g corepack@latest
RUN corepack enable pnpm
ARG APP_VERSION

FROM base AS build
COPY . /app
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --registry=https://registry.npmmirror.com/  --frozen-lockfile
RUN pnpm install --registry=${registry} --frozen-lockfile
# RUN pnpx browserslist@latest --update-db
# RUN pnpm up caniuse-lite

ENV TZ=Asia/Shanghai

# pnpm 递归执行build命令
RUN pnpm -r build

# 在你的 monorepo 中构建完所有内容后，在第二个镜像中执行此操作，
# 该镜像使用你的 monorepo 基础镜像作为构建上下文或在额外的构建阶段：
# Deploy a package from a workspace. During deployment, the files of the deployed package are copied to the target directory.
# All dependencies of the deployed package, including dependencies from the workspace,
# are installed inside an isolated node_modules directory at the target directory.
# The target directory will contain a portable package that can be copied to a server and executed without additional steps.
RUN pnpm --filter=main --prod deploy /prod/main
RUN pnpm --filter=minio --prod deploy /prod/minio

########################main################################
FROM base AS main
WORKDIR /app
COPY --from=build /app/packages/main/dist /app/dist
COPY --from=build /app/packages/main/package.json /app/package.json
COPY ./packages/main/.env.production .env.production

RUN pnpm install --only=production

ENV NODE_ENV=production
RUN apk add --no-cache tzdata
ENV TZ=Asia/Shanghai
ENV APP_VERSION=${APP_VERSION}
EXPOSE 3000

RUN mkdir -p /app/logs
RUN ln -sf /dev/stderr /app/logs/error.log

# 足够的等待时间
CMD [ "sh", "-c", "npm run start:prod"]

########################minio################################
FROM base AS minio
WORKDIR /app
COPY --from=build /app/packages/minio/dist /app/dist
COPY --from=build /app/packages/minio/package.json /app/package.json
COPY ./packages/minio/.env.production .env.production

RUN pnpm install --only=production

ENV NODE_ENV=production
RUN apk add --no-cache tzdata
ENV TZ=Asia/Shanghai
ENV APP_VERSION=${APP_VERSION}

RUN mkdir -p /app/logs
RUN ln -sf /dev/stderr /app/logs/error.log
EXPOSE 8801
# 足够的等待时间
CMD [ "sh", "-c", "npm run start:prod"]
