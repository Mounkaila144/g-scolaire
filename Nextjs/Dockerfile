# Utiliser une image de base Node.js
FROM node:20-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier le fichier package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du code source de l'application
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application en mode développement
CMD ["npm", "run", "dev"]
