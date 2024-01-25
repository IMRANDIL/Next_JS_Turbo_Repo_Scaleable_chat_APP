# Stage 1: Build
FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
# RUN npm install -g npm@10.4.0
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Production image
FROM node:18-alpine
WORKDIR /usr/src/app
COPY --from=build /usr/src/app/package*.json ./
RUN npm install --only=production
COPY --from=build /usr/src/app/.next ./.next

EXPOSE 3000
CMD ["npm", "start"]
