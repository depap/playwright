FROM mcr.microsoft.com/playwright:v1.65.0-noble

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY playwright.config.ts tsconfig.json ./
COPY tests ./tests/

ENTRYPOINT ["npx", "playwright", "test"]
