######### Stage 1: Build the Angular App

# Use the official Node.js image as the base for the build stage
FROM node:18-alpine as builder

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Install esbuild as a dev dependency
RUN npm install esbuild --save-dev

# Copy the rest of the application code
COPY . .

# Build the Angular application
#RUN npm run build -- --project kalyanam --configuration production --output-path=dist
RUN npm run build




######### Stage 2: Serve the Angular App using NGINX
# Create a new image for serving the application
FROM nginx:alpine

# Copy the built Angular application
COPY --from=builder /app/dist/kalyanam/browser /usr/share/nginx/html/kalyanam

# Copy custom NGINX configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80


# NGINX will automatically serve the content in /usr/share/nginx/html
CMD ["nginx", "-g", "daemon off;"]