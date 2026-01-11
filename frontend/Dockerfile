# 1. Use lightweight Node image
FROM node:18-alpine

# 2. Set working directory
WORKDIR /app

# 3. Copy package files first for caching
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy the rest of the source code
COPY . .

# 6. Build the Next.js application for production
# This creates the optimized .next folder
RUN npm run build

# 7. Expose the standard Next.js port
EXPOSE 3000

# 8. Start the Next.js production server
CMD ["npm", "start"]