# Choose the Image which has Node installed already
FROM node:16.18.0

# install simple http server for serving static content
# also installing yarn because of reasons... 

RUN npm install -g serve
RUN npm install -g http-server


#not needed as it is installed on the alpine image lol
#RUN npm install -g yarn

# make the 'app' folder the current working directory
WORKDIR /app


COPY package*.json ./



# install project dependencies
#RUN npm install -f
RUN yarn install


# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .


RUN yarn build


# build app for production with minification

EXPOSE 8080

RUN chmod -R 775 /app

RUN chgrp -R 0 /app && chmod -R g+rwX /app

#RUN chown -R node:root /app

#USER node

#CMD [ "yarn", "serve","--host","0.0.0.0" ]
CMD [ "http-server", "dist" ]