# Use Node.js official image
FROM node:20

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application files
COPY . .

# Build TypeScript files
RUN npx tsc

# Expose the application port
EXPOSE 3000

# Run the application
CMD ["node", "dist/server.js"]
# RUN npm run dev
