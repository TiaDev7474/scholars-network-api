# Copy application dependency manifests to the container image.
COPY --chown=node:node package*.json ./
COPY entrypoint.sh ./

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci

# Bundle app source
COPY --chown=node:node . .

# Set NODE_ENV environment variable
ENV NODE_ENV development

RUN chmod +x /usr/src/app
RUN chmod +x /usr/src/app/entrypoint.sh

RUN npx prisma generate --schema=/usr/src/app/src/common/database/schema.prisma

# Expose the port the app runs on
EXPOSE 3000



# Start the application in development mode
CMD ["npm", "run", "start:dev"]

###################
# BUILD FOR PRODUCTION
###################

FROM node:18-alpine As build

WORKDIR /usr/src/app

RUN npx prisma generate
# Copy package.json and package-lock.json from development stage
COPY --chown=node:node --from=development /usr/src/app/package*.json ./

# Copy node_modules from development stage
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules



# Bundle app source
COPY --chown=node:node . .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Optimize node_modules by installing production dependencies only
RUN npm ci --only=production && npm cache clean --force

# Set the correct permissions for the application directory and node_modules
RUN chown -R node:node /usr/src/app

USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

WORKDIR /usr/src/app

# Copy the bundled code and node_modules from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist


# Switch to the node user
USER node

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
