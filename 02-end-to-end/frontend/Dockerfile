FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies with npm
RUN npm ci

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files and node_modules from builder
COPY --from=builder /app/package.json /app/package.json
COPY --from=builder /app/node_modules /app/node_modules

# Copy source for dev server
COPY . .

EXPOSE 5173

# Run dev server (can be replaced with nginx for production builds)
CMD ["npm", "run", "dev"]
