FROM node:18-bullseye as builder

ARG env=test
ARG tag=dev

WORKDIR /app
COPY . /app

ENV PORT=3000
ENV TZ=Asia/Shanghai

RUN chmod +x docker/config.sh && docker/config.sh $env $tag &&  rm -rf _config_
RUN yarn config set registry https://registry.npm.taobao.org/ && yarn global add pnpm
RUN --mount=type=cache,target=/pnpm_cache pnpm config set store-dir /pnpm_cache && pnpm install && pnpm lint && pnpm build
RUN rm -Rf src

FROM node:18-bullseye-slim AS runner
WORKDIR /app
ENV PORT=3000
ENV TZ=Asia/Shanghai
COPY --from=builder /app ./
CMD node dist/src/main.js
