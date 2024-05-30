ARG NODE_VERSION=18.19

# Setup pnpm and turbo on the alpine base
FROM node:${NODE_VERSION}-alpine AS base
ARG PROJECT
WORKDIR /app

ENV PNPM_HOME=/usr/local/bin
RUN corepack enable && \
    pnpm install turbo --global

# Prune projects
FROM base AS pruner

COPY . .
RUN turbo prune --scope=${PROJECT} --docker

# Build the project
FROM base AS builder

# Build dependencies
RUN apk add --no-cache build-base python3

# Copy lockfile and package.json's of isolated subworkspace
COPY --from=pruner /app/out/pnpm-lock.yaml /app/out/pnpm-workspace.yaml .
COPY --from=pruner /app/out/json .

# First install the dependencies (as they change less often)
RUN --mount=type=cache,id=pnpm,target=${PNPM_HOME}/store \
    pnpm install --frozen-lockfile

# Copy source code of isolated subworkspace and build it
COPY --from=pruner /app/out/full .
RUN turbo build --filter=${PROJECT}
RUN --mount=type=cache,id=pnpm,target=${PNPM_HOME}/store \
    pnpm prune --prod --no-optional && \
    rm -rf apps/*/src

# Final image
FROM base AS runner

# Exists on base image
USER node
COPY --from=builder --chown=node:node /app .
WORKDIR /app/apps/${PROJECT}

ENV NODE_ENV=production
EXPOSE 4000 4001

CMD ["node", "dist/index"]
