# Build AdonisJS
FROM node:14-alpine as builder
# Set directory for all files
WORKDIR /home/node/app
# Copy over package.json files
COPY package.json ./
COPY yarn.lock ./
# Install all packages
RUN yarn install
# Copy over source code
COPY . .
# Build AdonisJS for production
RUN yarn run build


# Build final runtime container
FROM node:14-alpine
# Set environment variables
ENV NODE_ENV=production
# Disable .env file loading
# ENV ENV_SILENT=true
# Listen to external network connections
# Otherwise it would only listen in-container ones
ENV HOST=0.0.0.0
# Set port to listen
ENV PORT=3333
# Set home dir
WORKDIR /home/node/app
# Copy over built files
COPY --from=builder /home/node/app/build .
# Install only required packages
RUN yarn install --production
# Expose port to outside world
EXPOSE 3333
# Start server up
CMD [ "node", "server.js" ]
