# 1. Use the lightweight Alpine Node image (only ~50MB)
FROM node:18-alpine

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Copy package.json first to cache dependencies
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the application code
COPY . .

# 6. Expose the port your Express app runs on
EXPOSE 5000

# 7. Command to run the app
CMD ["node", "server.js"]