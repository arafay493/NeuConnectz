# ----------------------
# Build stage
# ----------------------
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies only when needed
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
