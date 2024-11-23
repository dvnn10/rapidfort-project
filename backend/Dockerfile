# Stage 1: Use the LibreOffice alpine image
FROM libreofficedocker/alpine:3.17 AS libreoffice

FROM node:20-alpine

# Install necessary dependencies for LibreOffice
RUN apk add --no-cache \
    libmount \
    dbus-libs \
    gcompat \
    ttf-droid \
    ttf-freefont \
    ttf-liberation \
    ttf-dejavu  # Optional: for better font rendering


# Set working directory
WORKDIR /app

# Copy LibreOffice binaries from the first stage
COPY --from=libreoffice /usr /usr

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Expose the backend port
EXPOSE 5000

# Define environment variables (optional)
ENV PORT=5000

# Start the server
CMD ["node", "server.js"]