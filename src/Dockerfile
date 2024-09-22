# Stage 1: Build the Angular application
FROM node:20-bullseye AS build

# Install build dependencies
RUN apt-get update && \
    apt-get install -y --no-install-recommends build-essential && \
    rm -rf /var/lib/apt/lists/*

# Set environment variables for Node.js
ENV NODE_ENV=production
ENV NG_CLI_ANALYTICS=false

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Update NPM to the latest version
RUN npm install -g npm@latest

# Install dependencies using npm ci with verbose logging
RUN npm ci --verbose

# Install Angular CLI globally
RUN npm install -g @angular/cli@latest

# Copy the rest of the application code
COPY . .

# Rebuild dependencies (optional, useful for native modules)
RUN npm rebuild

# Build the Angular app in production mode with verbose logging
RUN npm run build -- --configuration production --verbose

# Stage 2: Serve the Angular app with Nginx
FROM nginx:alpine

# Set a maintainer label (optional)
LABEL maintainer="your-email@example.com"

# Remove the default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy the built Angular app from the previous stage
COPY --from=build /usr/src/app/dist/kalyanam /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"]
