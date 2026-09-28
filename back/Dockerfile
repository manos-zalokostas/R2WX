# back/Dockerfile
# Use Node.js 22 Alpine as the base image
FROM node:22-alpine AS base

# Install OpenSSL - crucial for Prisma on Alpine to avoid SSL detection warnings
# and ensure SSL connectivity if your MySQL requires it.
RUN apk add --no-cache openssl

# Set the working directory in the container
# All subsequent paths will be relative to this
WORKDIR /usr/src/app

# Install PNPM globally using Corepack (recommended for Node >=16.10)
# In both front/Dockerfile and back/Dockerfile
RUN corepack enable
RUN corepack prepare pnpm@8.15.5 --activate
# --- Dependency Layer ---
# Copy only the files necessary for installing ALL workspace dependencies first.
# This leverages Docker's layer caching: if these files don't change,
# the expensive 'pnpm install' step won't re-run.
COPY pnpm-workspace.yaml ./
# Root package.json
COPY package.json ./
# Root lockfile
COPY pnpm-lock.yaml ./

# Copy the backend's specific package.json
# The path is relative to the build context (project root),
# and destination is relative to WORKDIR.
COPY back/package.json ./back/package.json

# Install all workspace dependencies.
# PNPM is workspace-aware and will set up node_modules correctly.
# --frozen-lockfile is good for CI/reproducibility, ensure pnpm-lock.yaml is committed and up-to-date.
# For dev, you might omit --frozen-lockfile if you want 'pnpm install' to be able
# to update the lockfile during the build (though less common for Docker builds).
RUN pnpm install --frozen-lockfile --prod=false

# --- Application Code Layer ---
# Copy the backend application code.
# If only this code changes, the layers above (OS, PNPM, dependencies) are cached.
COPY ./back /usr/src/app/back


# If you have a shared 'packages/' directory that 'back' depends on, copy it too:
# COPY ./packages /usr/src/app/packages

# No WORKDIR change needed here if your docker-compose commands are like:
# "pnpm --filter back exec prisma generate"
# "pnpm --filter back run debug"
# These commands correctly target the 'back' workspace from the root of the app context.

# The CMD is specified in docker-compose.override.yml for development.
# A placeholder CMD can be useful for inspecting the image if run directly.
CMD [ "node", "-e", "console.log('Backend container ready. Run with docker-compose.')" ]