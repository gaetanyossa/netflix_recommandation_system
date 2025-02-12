# Utiliser l'image officielle Node.js
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers du frontend
COPY . /app

# Installer les dépendances
RUN npm install

# Construire le frontend (pour production)
RUN npm run build

# Utiliser Nginx pour servir l'application
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html

# Exposer le port 80
EXPOSE 80

# Lancer Nginx
CMD ["nginx", "-g", "daemon off;"]