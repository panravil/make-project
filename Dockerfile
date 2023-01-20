# ----- Builder image -----

ARG BASE_BRANCH

FROM node:16 AS builder

ARG NPM_TOKEN

ENV DEBIAN_FRONTEND noninteractive
ENV IMT_ENV production
ENV IMT_ROOT_DIR /data/integromat
ENV NODE_ENV production
ENV NODE_PATH $IMT_ROOT_DIR

SHELL ["/bin/bash", "-c"]

RUN echo "//registry.npmjs.org/:_authToken=${NPM_TOKEN}" > /root/.npmrc

WORKDIR $IMT_ROOT_DIR/make-web

# Install Sharp for Next, Vercel was providing this automatically, we're not sure if we need this at build time, but there's DDoS, no time to loose
RUN npm i -g sharp
ENV NEXT_SHARP_PATH /usr/local/lib/node_modules/sharp

COPY package*.json ./
RUN npm ci --force
COPY . .
RUN npm run build

# ----- Result image -----

FROM integromat/base:${BASE_BRANCH}-node16 AS result

ARG BUILD_BRANCH

ENV DEBIAN_FRONTEND noninteractive
ENV IMT_ENV production
ENV IMT_ROOT_DIR /data/integromat
ENV NODE_ENV production
ENV NODE_PATH $IMT_ROOT_DIR
ENV BUILD_BRANCH $BUILD_BRANCH

SHELL ["/bin/bash", "-c"]

WORKDIR $IMT_ROOT_DIR/make-web

COPY --from=builder --chown=integromat:integromat $IMT_ROOT_DIR/make-web $IMT_ROOT_DIR/make-web

# Install Sharp for Next, Vercel was providing this automatically
RUN npm i -g sharp
ENV NEXT_SHARP_PATH /usr/local/lib/node_modules/sharp

RUN set -eux; \
	apt-get update; \
	apt-get install -y --no-install-recommends ca-certificates imagemagick graphicsmagick; \
	rm -rf /var/lib/apt/lists/*;

USER integromat
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=1s --retries=3 CMD curl -f http://localhost:3000/en || exit 1

CMD ["npm", "start"]
