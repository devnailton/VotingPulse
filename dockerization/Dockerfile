FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências primeiro para aproveitar cache do Docker
COPY package*.json ./
RUN npm install

# Copiar o resto do código
COPY . .

# Construir a aplicação para produção
RUN npm run build

# Expor a porta que a aplicação irá utilizar
EXPOSE 5000

# Variáveis de ambiente padrão (serão substituídas pelo docker-compose)
ENV NODE_ENV=production

# Comando para iniciar a aplicação
CMD ["node", "dist/index.js"]