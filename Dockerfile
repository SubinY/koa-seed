# build stage
FROM node:14.15.0 as build-stage
ADD . /app

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 8083


#RUN npm run dev
CMD ["npm", "run", "dev"]

# production stage
#FROM nginx:stable-perl as production-stage
#
#COPY --from=build-stage /app/dist /usr/share/nginx/html
#
#COPY --from=build-stage /app/nginx/default.conf /etc/nginx/conf.d/default.conf


#CMD ["nginx", "-g", "daemon off;"]