# ---- build stage: install everything, generate the Prisma client, compile ----
FROM node:22-alpine AS build
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN apk add --no-cache openssl && corepack enable
WORKDIR /app

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

COPY . .
# prisma.config.ts requires DATABASE_URL; generating the client never connects,
# so a placeholder is enough at build time.
RUN DATABASE_URL=postgresql://build:build@localhost:5432/build pnpm prisma generate \
  && pnpm build \
  && pnpm prune --prod

# ---- runtime stage: only production dependencies and the compiled code ----
FROM node:22-alpine AS runtime
RUN apk add --no-cache openssl
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/package.json ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/prisma.config.ts ./

USER node
EXPOSE 3333

# Apply pending migrations, then start the API.
CMD ["sh", "-c", "node_modules/.bin/prisma migrate deploy && node dist/infra/main"]
