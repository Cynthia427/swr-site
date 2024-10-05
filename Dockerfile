# Use an official Node runtime as the base image
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Install Typesense
RUN curl -O https://dl.typesense.org/releases/27.1/typesense-server-27.1-linux-amd64.tar.gz \
    && tar -xzf typesense-server-27.1-linux-amd64.tar.gz \
    && rm typesense-server-27.1-linux-amd64.tar.gz

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Next.js app
RUN npm run build

# Expose the ports for Next.js and Typesense
EXPOSE 3000 8108

# Start Typesense and the Next.js app
CMD ./typesense-server --data-dir=/tmp/typesense-data --api-key=$TYPESENSE_API_KEY --enable-cors --host=0.0.0.0 --port=$TYPESENSE_PORT & \
    NODE_ENV=production node server.js