FROM node:16-slim

WORKDIR /app

# Copia só os arquivos de dependência primeiro (melhora cache e garante instalação)
COPY package*.json ./

RUN npm install

# Agora copia o restante do projeto
COPY . .

EXPOSE 3000
CMD ["npm", "start"]