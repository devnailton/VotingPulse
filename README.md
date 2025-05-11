### Abordagem Recomendada: Adaptar para a Estrutura deste manual, o GUIA_INSTALACAO.MD (Mais Simples e Explícita)
Esta abordagem envolve usar este manual, o GUIA_INSTALACAO.MD como base, mas reutilizando e corrigindo seu Dockerfile existente. Isso simplifica a estrutura de pastas e garante que todas as configurações estejam explícitas.

Mova seu Dockerfile existente:
No seu servidor VPS, depois de clonar/copiar seu projeto para ~/byod-voting-system (ou o nome que este manual, o GUIA_INSTALACAO.MD sugere, como ~/byod-voting-system), mova o arquivo Dockerfile de dentro da pasta dockerization para a pasta raiz do projeto.
Por exemplo, se seu projeto está em ~/byod-voting-system, mova ~/byod-voting-system/dockerization/Dockerfile para ~/byod-voting-system/Dockerfile.
Você pode ignorar ou remover o arquivo docker-compose.yml que estava na pasta dockerization, pois vamos criar um novo baseado neste manual, o GUIA_INSTALACAO.MD.
Edite o Dockerfile (que agora está na raiz do projeto):
Abra o arquivo ~/byod-voting-system/Dockerfile com nano Dockerfile.
Descomente a linha de build: Altere # RUN npm run build para RUN npm run build.
(Opcional, mas recomendado para consistência com Replit): Seu .replit usa nodejs-20. O Dockerfile usa FROM node:18-alpine. Se seu projeto funciona bem com Node 20 e você quer manter essa versão, altere a primeira linha do Dockerfile para FROM node:20-alpine. Caso contrário, node:18-alpine é uma versão LTS (Long Term Support) estável.
Siga este manual, o GUIA_INSTALACAO.MD para o restante:
Criar docker-compose.yml: Use o Passo 3: Preparar os arquivos do projeto, subitem 1. Criar o arquivo docker-compose.yml deste manual, o GUIA_INSTALACAO.MD. Crie este arquivo na raiz do projeto (~/byod-voting-system/docker-compose.yml) com o conteúdo fornecido no guia. Este docker-compose.yml é projetado para funcionar com o Dockerfile na mesma pasta.
Criar .env: Siga o subitem 2. Criar o arquivo .env deste manual, o GUIA_INSTALACAO.MD na raiz do projeto.
Criar .dockerignore: Siga o subitem 5. Criar o arquivo .dockerignore deste manual, o GUIA_INSTALACAO.MD na raiz do projeto.
Verificar package.json: Certifique-se de que os scripts start e build no seu package.json estão como este manual, o GUIA_INSTALACAO.MD sugere (o que parece já ser o caso, com base no seu package.json e .replit).
Continue com os demais passos deste manual, o GUIA_INSTALACAO.MD (Passo 4: Construir e executar os contêineres, etc.). Os comandos docker-compose devem ser executados a partir da raiz do projeto (~/byod-voting-system).


# Guia de Instalação do Sistema de Votação BYOD

Este guia irá ajudar você a instalar o Sistema de Votação BYOD em um servidor Linux utilizando Docker, mesmo sem conhecimento prévio sobre JavaScript ou os frameworks utilizados no projeto.

## Pré-requisitos

Antes de começar, você precisará:

1. Um servidor VPS Linux (Ubuntu 20.04 ou mais recente recomendado)
2. Acesso SSH ao servidor
3. Um domínio apontando para o IP do seu servidor (opcional, mas recomendado)

## Passo 1: Conectar ao seu servidor VPS

Use um cliente SSH (como PuTTY no Windows ou Terminal no macOS/Linux) para se conectar ao seu servidor:

```bash
ssh usuario@ip-do-seu-servidor
```

Substitua `usuario` e `ip-do-seu-servidor` pelas informações do seu servidor.

## Passo 2: Instalar o Docker e Docker Compose

### Atualizar o sistema:

```bash
sudo apt update
sudo apt upgrade -y
```

### Instalar dependências necessárias:

```bash
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common
```

### Adicionar a chave GPG oficial do Docker:

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

### Adicionar o repositório do Docker:

```bash
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

### Instalar o Docker:

```bash
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io
```

### Instalar o Docker Compose:

```bash
sudo curl -L "https://github.com/docker/compose/releases/download/v2.12.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### Adicionar seu usuário ao grupo docker (para executar Docker sem sudo):

```bash
sudo usermod -aG docker $USER
```

**Importante:** Saia e entre novamente no SSH para que as mudanças de grupo tenham efeito.

## Passo 3: Preparar os arquivos do projeto

### Criar uma pasta para o projeto:

```bash
mkdir -p ~/byod-voting-system
cd ~/byod-voting-system
```

### Criar os arquivos necessários

#### 1. Criar o arquivo `docker-compose.yml`:

```bash
nano docker-compose.yml
```

Copie e cole o seguinte conteúdo:

```yaml
version: '3.8'

services:
  app:
    build: .
    restart: always
    ports:
      - "80:5000"
    depends_on:
      - postgres
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:${POSTGRES_PASSWORD}@postgres:5432/byod_voting
      - SESSION_SECRET=${SESSION_SECRET}
    networks:
      - byod-network

  postgres:
    image: postgres:14
    restart: always
    environment:
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_USER=postgres
      - POSTGRES_DB=byod_voting
    volumes:
      - postgres-data:/var/lib/postgresql/data
    networks:
      - byod-network

networks:
  byod-network:

volumes:
  postgres-data:
```

Salve o arquivo (CTRL+X, depois Y para confirmar).

#### 2. Criar o arquivo `.env`:

```bash
nano .env
```

Copie e cole o seguinte conteúdo (substitua os valores por senhas fortes):

```
POSTGRES_PASSWORD=escolha_uma_senha_forte_aqui
SESSION_SECRET=escolha_outra_senha_forte_diferente_aqui
```

Salve o arquivo (CTRL+X, depois Y para confirmar).

#### 3. Criar o arquivo `Dockerfile`:

```bash
nano Dockerfile
```

Copie e cole o seguinte conteúdo:

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 5000

CMD ["npm", "run", "start"]
```

Salve o arquivo (CTRL+X, depois Y para confirmar).

#### 4. Fazer upload do código-fonte

Agora você precisa fazer upload dos arquivos do projeto para o seu servidor. Você pode:

- Fazer um arquivo zip do projeto localmente e usar `scp` para enviar para o servidor
- Ou clonar o repositório diretamente no servidor se estiver em um repositório Git

**Método usando scp (de sua máquina local):**

```bash
# Executar na sua máquina local, não no servidor
scp arquivos-do-projeto.zip usuario@ip-do-seu-servidor:~/byod-voting-system/
```

Depois, no servidor:

```bash
cd ~/byod-voting-system
unzip arquivos-do-projeto.zip
```

#### 5. Criar o arquivo `.dockerignore`:

```bash
nano .dockerignore
```

Copie e cole o seguinte conteúdo:

```
node_modules
.git
.env
```

Salve o arquivo (CTRL+X, depois Y para confirmar).

#### 6. Criar um script de produção no package.json

Edite o arquivo package.json para incluir um script de produção:

```bash
nano package.json
```

Adicione aos scripts (dentro da seção "scripts"):

```json
"start": "NODE_ENV=production node server/index.js",
```

Certifique-se que existe um script de build:

```json
"build": "vite build",
```

## Passo 4: Construir e executar os contêineres

### Iniciar o aplicativo:

```bash
docker-compose up -d
```

Este comando irá:
1. Construir a imagem Docker para o aplicativo
2. Iniciar o banco de dados PostgreSQL
3. Iniciar o servidor da aplicação

### Verificar os logs:

```bash
docker-compose logs -f
```

Para sair dos logs, pressione CTRL+C.

## Passo 5: Acessar o sistema

Agora você pode acessar o sistema usando o navegador:

```
http://ip-do-seu-servidor
```

Ou se você configurou um domínio:

```
http://seu-dominio.com
```

## Passo 6: Configurar as contas iniciais

O sistema vem com três contas pré-configuradas:

1. **Professor**
   - Usuário: professor
   - Senha: Nlt@@123

2. **Favor**
   - Usuário: favor
   - Senha: NLS@@25

3. **Contra**
   - Usuário: contra
   - Senha: KYU##29

## Passo 7: Configurar o Nginx com SSL (Opcional, mas recomendado)

Para tornar seu site mais seguro, é recomendável configurar o Nginx com SSL usando Certbot:

### Instalar Nginx:

```bash
sudo apt install -y nginx
```

### Configurar Nginx:

```bash
sudo nano /etc/nginx/sites-available/byod
```

Copie e cole o seguinte conteúdo (substitua `seu-dominio.com` pelo seu domínio):

```nginx
server {
    listen 80;
    server_name seu-dominio.com www.seu-dominio.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Ativar o site:

```bash
sudo ln -s /etc/nginx/sites-available/byod /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Instalar Certbot e configurar SSL:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu-dominio.com -d www.seu-dominio.com
```

Siga as instruções na tela para configurar o SSL.

## Comandos úteis para manutenção

### Reiniciar a aplicação:

```bash
docker-compose restart
```

### Parar a aplicação:

```bash
docker-compose down
```

### Atualizar a aplicação (após fazer alterações no código):

```bash
docker-compose down
docker-compose up -d --build
```

### Ver logs do aplicativo:

```bash
docker-compose logs -f app
```

### Ver logs do banco de dados:

```bash
docker-compose logs -f postgres
```

## Solução de problemas

### Se a aplicação não estiver acessível:

1. Verifique se os contêineres estão rodando:
   ```bash
   docker-compose ps
   ```

2. Verifique as portas abertas:
   ```bash
   sudo netstat -tulpn | grep 80
   ```

3. Verifique o firewall:
   ```bash
   sudo ufw status
   ```
   
   Se necessário, permita tráfego na porta 80:
   ```bash
   sudo ufw allow 80/tcp
   ```

4. Verifique os logs da aplicação:
   ```bash
   docker-compose logs -f app
   ```

### Se o banco de dados não estiver conectando:

1. Verifique as variáveis de ambiente:
   ```bash
   docker-compose config
   ```

2. Reinicie o contêiner do banco de dados:
   ```bash
   docker-compose restart postgres
   ```

### Se precisar acessar o banco de dados diretamente:

```bash
docker-compose exec postgres psql -U postgres -d byod_voting
```

## Backups

### Fazer backup do banco de dados:

```bash
docker-compose exec postgres pg_dump -U postgres byod_voting > backup_$(date +%Y%m%d).sql
```

### Restaurar um backup:

```bash
cat backup_20250511.sql | docker-compose exec -T postgres psql -U postgres -d byod_voting
```

---

Este guia deve ajudá-lo a instalar e executar o Sistema de Votação BYOD em seu servidor VPS Linux usando Docker, mesmo sem conhecimento prévio sobre JavaScript ou os frameworks utilizados no projeto. Se encontrar problemas durante a instalação, verifique os logs e as etapas de solução de problemas acima.
