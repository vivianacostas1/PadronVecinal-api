# ── ETAPA 1: BUILDER (compilar TypeScript) ──────────────
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

# Generar Prisma Client
RUN npx prisma generate

COPY tsconfig.json ./
COPY tsconfig.seed.json ./
COPY src ./src
COPY prisma.config.ts ./

# Compila:
# - API src -> dist
# - seed prisma -> dist/prisma/seed.js
RUN npm run build


# ── ETAPA 2: RUNNER ─────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

RUN apk add --no-cache dumb-init

RUN addgroup -g 1001 -S nodejs \
    && adduser -S nodejs -u 1001


COPY --from=builder --chown=nodejs:nodejs /app/package*.json ./

COPY --from=builder --chown=nodejs:nodejs /app/node_modules ./node_modules

COPY --from=builder --chown=nodejs:nodejs /app/dist ./dist

COPY --from=builder --chown=nodejs:nodejs /app/prisma ./prisma

COPY --from=builder --chown=nodejs:nodejs /app/prisma.config.ts ./


USER nodejs

EXPOSE 3000

ENV NODE_ENV=production


CMD ["dumb-init", "sh", "-c", "npx prisma db push --accept-data-loss && npx prisma db seed && node dist/index.js"]
