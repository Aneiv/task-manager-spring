# use node 20
FROM node:20

WORKDIR /frontend

# copy packages
COPY task-manager-frontend/package*.json ./

# install dependencies
RUN npm install

# port expose
EXPOSE 5173

# setup commands
CMD ["npm", "run", "dev", "--", "--host"]