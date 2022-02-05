
# Production
# ---- Node modules ---- #
# FROM node:16.13 AS node_modules

# RUN mkdir -p /usr/src/app
# WORKDIR /usr/src/app
# COPY package*.json yarn.lock ./
# RUN yarn install --prod


# # ---- Build ---- #
# FROM node:16.13-alpine AS build

# ENV NODE_ENV=production
# WORKDIR /usr/src/app
# COPY . .
# COPY --from=node_modules /usr/src/app/node_modules ./node_modules
# RUN yarn build


# # ---- Release ---- #
# FROM node:16.13-alpine

# ENV NODE_ENV=production
# WORKDIR /usr/src/app

# COPY --from=build /usr/src/app/next.config.js ./
# COPY --from=build /usr/src/app/public ./public
# COPY --from=build /usr/src/app/.next ./.next
# COPY --from=build /usr/src/app/node_modules ./node_modules

# CMD ["node_modules/.bin/next", "start"]


# ---- Build ---- #
FROM node:16.13-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package*.json yarn.lock /usr/src/app/
RUN yarn install

COPY . /usr/src/app

CMD "yarn" "dev"