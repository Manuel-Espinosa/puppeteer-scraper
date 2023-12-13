# Use an official Node runtime as a parent image
FROM node:18

# Install required dependencies for Puppeteer
RUN apt-get update && apt-get install -y \
    wget \
    gnupg2 \
    ca-certificates \
    apt-transport-https \
    software-properties-common \
    libxss1 \
    libx11-xcb1 \
    libxtst6 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libdbus-1-3 \
    libexpat1 \
    libgtk-3-0 \
    libgbm1 \
    libnss3 \
    libxshmfence1 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libglib2.0-0 \
    libcairo2 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxss1 \
    libx11-xcb1

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install any needed packages
RUN npm install

# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Change ownership of the npm cache directory
RUN chown -R node:node /app

# Switch to non-root user
USER node

# Make port 8080 available to the world outside this container
EXPOSE 8080

# The command to run your app using Node.js
CMD ["npm", "run" ,"dev"]