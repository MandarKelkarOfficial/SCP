# 1) Build React frontend
FROM node:22 AS react-build
WORKDIR /app

# Install client deps
COPY client/package*.json ./
RUN npm install

# Copy client source & build
COPY client/ .
RUN npm run build


# 2) Build final image with server + static assets
FROM node:22
WORKDIR /app

# Copy server package files & install production deps
COPY server/package*.json ./
RUN npm install --production

# Copy server code
COPY server/ .

# Copy React build into server’s public directory (to serve static)
COPY --from=react-build /app/build ./public

# Ensure your Express serves ./public (see next step)

EXPOSE 5000
CMD ["node", "server.js"]