# Frontend Dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy application code
COPY . .

# Build the React application
RUN npm run build

# Install serve to run the application
RUN npm install -g serve

# Set environment variables
ENV NODE_ENV=production
ENV REACT_APP_API_URL=http://localhost:8000/api

# Expose port
EXPOSE 3000

# Run the application
CMD ["serve", "-s", "build", "-l", "3000"]
