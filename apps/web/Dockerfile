# Stage 1: Build
FROM node:14 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:14-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
RUN npm ci --only=production
COPY --from=build /usr/src/app/.next ./.next

EXPOSE 3000
CMD ["npm", "start"]
