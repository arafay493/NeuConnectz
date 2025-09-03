# Build stage for Next.js
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy frontend source code
COPY . .

# Build the Next.js application
RUN npm run build

# Expose Next.js port
EXPOSE 3000

# Start the Next.js application
CMD ["npm", "start"]