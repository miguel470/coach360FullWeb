
# # Utiliza la imagen oficial de Node.js como base
FROM node:alpine

# # Establece el directorio de trabajo en el contenedor
WORKDIR usr/src/app

# # Copia los archivos del proyecto al contenedor
COPY . .

# # Instala las dependencias
RUN npm install

# # Expone el puerto 3000 para acceder a la aplicación
EXPOSE 3000

# # Comando para iniciar la aplicación
CMD ["npm", "run", "dev"]

