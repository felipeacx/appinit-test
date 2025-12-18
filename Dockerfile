# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./
COPY tsconfig.json ./
COPY eslint.config.mjs ./
COPY postcss.config.mjs ./
COPY next.config.ts ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY app ./app
COPY public ./public
COPY types ./types
COPY next-env.d.ts ./

# Build de Next.js
RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine

WORKDIR /app

# Instalar dependencias de producción solamente
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copiar el build desde stage anterior
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules
COPY next.config.ts ./

# Variables de entorno
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Exponer puerto
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Comando para iniciar la aplicación
CMD ["npm", "start"]
