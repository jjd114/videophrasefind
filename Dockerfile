FROM node:20-alpine AS base

RUN apk add ffmpeg
RUN corepack enable pnpm

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .
# TODO: copy **/package.json first before installing
# https://github.com/moby/moby/issues/35639
COPY . .
# For some reason simple pnpm install fails to create node_modules
# https://github.com/pnpm/pnpm/issues/4321#issuecomment-1978703086
RUN pnpm add turbo -w

RUN pnpm run build --filter worker

ENV PORT 5173
EXPOSE 5173

WORKDIR apps/worker
CMD ["npm", "start"]

