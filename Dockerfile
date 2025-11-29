# Utiliser Node.js version 20 (requis pour Next.js 16)
FROM node:20-alpine

# Dossier de travail
WORKDIR /app

# Copier package.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier tout le code
COPY . .

# Build Next.js
RUN npm run build

# Exposer le port 3000
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]