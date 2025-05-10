# reference: https://pnpm.io/docker#example-2-build-multiple-docker-images-in-a-monorepo

FROM node:18.20-alpine3.18 AS base

WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV registry="https://registry.npmmirror.com"
ENV COREPACK_NPM_REGISTRY=${registry}

RUN npm config set registry ${registry} && npm install -g corepack@latest && corepack enable pnpm

FROM base AS build
COPY . /app
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --registry=https://registry.npmmirror.com/  --frozen-lockfile
RUN pnpm install --registry=${registry} --frozen-lockfile

ENV TZ=Asia/Shanghai
RUN pnpm -r build

# 在你的 monorepo 中构建完所有内容后，在第二个镜像中执行此操作，
# 该镜像使用你的 monorepo 基础镜像作为构建上下文或在额外的构建阶段：
# Deploy a package from a workspace. During deployment, the files of the deployed package are copied to the target directory.
# All dependencies of the deployed package, including dependencies from the workspace,
# are installed inside an isolated node_modules directory at the target directory.
# The target directory will contain a portable package that can be copied to a server and executed without additional steps.
RUN pnpm --filter=main --prod deploy /prod/main
RUN pnpm --filter=minio --prod deploy /prod/minio
RUN pnpm --filter=puppeteer --prod deploy /prod/puppeteer

########################main################################
FROM base AS main
WORKDIR /app
COPY --from=build /app/packages/main/dist /app/dist
COPY --from=build /app/packages/main/package.json /app/package.json
COPY ./packages/main/.env.production .env.production

RUN pnpm install --only=production

ENV NODE_ENV=production
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache tzdata
ENV TZ=Asia/Shanghai

ARG APP_VERSION
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
RUN sed -i 's/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g' /etc/apk/repositories
RUN apk add --no-cache tzdata
ENV TZ=Asia/Shanghai

RUN mkdir -p /app/logs
RUN ln -sf /dev/stderr /app/logs/error.log
EXPOSE 8801
# 足够的等待时间
CMD [ "sh", "-c", "npm run start:prod"]

########################puppeteer################################
# https://github.com/puppeteer/puppeteer/blob/main/docker/Dockerfile
FROM ghcr.io/puppeteer/puppeteer:24.8.2 AS puppeteer
# NOTE 设置用户目录权限
USER root
RUN mkdir -p /home/pptruser/.local/bin && chown -R pptruser:pptruser /home/pptruser/.local

# 配置环境变量
ENV PATH="/home/pptruser/.local/bin:${PATH}"

# 启用 corepack 到用户目录
RUN npm config set registry https://registry.npmmirror.com && corepack enable pnpm --install-directory /home/pptruser/.local/bin

WORKDIR /app
# 这应该会将服务部署到/prod/puppeteer目录下
COPY --from=build /app/packages/puppeteer/dist /app/dist
COPY --from=build /app/packages/puppeteer/package.json /app/package.json
RUN chown -R pptruser:pptruser /app

# 切换回默认用户
USER pptruser
RUN pnpm install --only=production

ENV NODE_ENV=production

ENV TZ=Asia/Shanghai

EXPOSE 3000

RUN mkdir -p /app/logs
RUN ln -sf /dev/stderr /app/logs/error.log

CMD [ "sh", "-c", "npm run start:prod"]

# FIXME 每次都要重新构建多个镜像，即使他们的源码没有变化
