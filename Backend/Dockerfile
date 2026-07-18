#backend/dockerfile
FROM node:24-alpine
WORKDIR /app
RUN corepack enable
RUN pnpm -v 
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY . .
EXPOSE 3000
CMD ["node", "src/server.js"]
