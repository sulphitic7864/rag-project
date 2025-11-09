# Use official Node.js image as the base
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Build the React app
RUN npm run build

# Install a lightweight server to serve the build files
RUN npm install -g serve

# Expose port 3000 (or the port you want)
EXPOSE 3000

# Command to serve the app
CMD ["serve", "-s", "dist", "-l", "3000"]
