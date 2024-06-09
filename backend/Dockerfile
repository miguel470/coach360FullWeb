# Usa una imagen base de Node.js
# FROM node:14-alpine

# Establece el directorio de trabajo
# WORKDIR /usr/src/app

# Copia el archivo package.json y package-lock.json
# COPY package*.json ./

# Instala las dependencias
# RUN npm install

# Copia el resto de los archivos del proyecto desde la carpeta backend
# COPY . .

# Construye la aplicación Strapi
# RUN npm run build

# Expone el puerto 1337
# EXPOSE 1337

# Inicia la aplicación Strapi
# CMD ["npm", "start"]

# FROM node:16

# # Establece el directorio de trabajo
# WORKDIR /usr/src/app

# # Copia los archivos package.json y package-lock.json al contenedor
# COPY package*.json ./

# # Instala las dependencias
# RUN npm install

# # Copia el resto de los archivos del proyecto al contenedor
# COPY . .

# # Expone el puerto en el que corre Strapi
# EXPOSE 1337

# # Define el comando por defecto para correr la aplicación
# CMD ["npm", "run", "develop"]

# FROM node:16

# # Establece el directorio de trabajo
# WORKDIR /usr/src/app

# # Copia los archivos package.json y package-lock.json al contenedor
# COPY package*.json ./

# # Instala las dependencias
# RUN npm install

# # Copia el resto de los archivos del proyecto al contenedor
# COPY . .

# # Compila el proyecto (opcional, si es necesario para producción)
# RUN npm run build

# # Expone el puerto en el que corre Strapi
# EXPOSE 1337

# # Define el comando por defecto para correr la aplicación en modo producción
# CMD ["npm", "start"]


FROM node:16

# Establece el directorio de trabajo
WORKDIR /usr/src/app

# Copia los archivos package.json y package-lock.json al contenedor
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos del proyecto al contenedor
COPY . .

# Compila el proyecto (opcional, si es necesario para producción)
RUN npm run build

# Asegúrate de que las dependencias nativas se compilen correctamente
RUN npm rebuild better-sqlite3

# Expone el puerto en el que corre Strapi
EXPOSE 1337

# Define el comando por defecto para correr la aplicación en modo producción
CMD ["npm", "start"]
