# front/Dockerfile

# Changed alias to 'base' for clarity, though 'development' is also fine
FROM node:22-alpine AS base

WORKDIR /usr/src/app
# ...
# Install PNPM globally
# In both front/Dockerfile and back/Dockerfile
RUN corepack enable
RUN corepack prepare pnpm@8.15.5 --activate
# --- First, install dependencies to leverage Docker layer caching ---
# Copy only the files necessary for installing dependencies
COPY pnpm-workspace.yaml ./
# Root package.json
COPY package.json ./
# Root lockfile
COPY pnpm-lock.yaml ./

# Copy the specific package.json for the service (front or back)
# Note: Path includes service name
COPY front/package.json ./front/package.json

# Install ALL workspace dependencies.
# PNPM will only install what's needed for 'front' if we build its files later,
# or we can be more explicit here if preferred for this layer.
# This approach installs all workspace deps, then copies only relevant app code.
RUN pnpm install --frozen-lockfile --prod=false # Installs all workspace deps

# --- Then, copy the application code ---
# This ensures that if only app code changes, the dependency layer above is cached.
COPY front/ ./front/
# If you have a shared 'packages/' directory that 'front' depends on:
# COPY packages/ ./packages/


# The CMD will be overridden by docker-compose for development
# Ensure --host is used by Vite (either here or in vite.config.js or npm script)
# Assumes 'dev' script is in front/package.json
CMD [ "pnpm", "dev", "--host" ]
