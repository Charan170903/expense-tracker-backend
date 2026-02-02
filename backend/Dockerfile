# Use Node.js 20 Alpine for a lightweight image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the API port
EXPOSE 5000

# Set environment to production by default
ENV NODE_ENV=production

# Start the application
CMD ["npm", "start"]
