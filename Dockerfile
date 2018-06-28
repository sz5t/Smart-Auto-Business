# STEP 1: Build
FROM node:8-alpine as builder

LABEL authors="cipchk <cipchk@qq.com>"

COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force
RUN npm i && mkdir /sinoforce && cp -R ./node_modules ./sinoforce

WORKDIR /sinoforce

COPY . .

RUN npm run build

# STEP 2: Setup
FROM nginx:1.13.5-alpine

COPY --from=builder /sinoforce/_nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /sinoforce/_nginx/ssl/* /etc/nginx/ssl/

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /sinoforce/dist /usr/share/nginx/html

CMD [ "nginx", "-g", "daemon off;"]
