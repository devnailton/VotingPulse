# Guia de Instalação do Sistema de Votação BYOD em um Servidor VPS Linux

## Introdução

Este guia irá ajudar você a instalar e executar o Sistema de Votação BYOD em um servidor VPS Linux, mesmo sem conhecimento prévio de JavaScript ou dos frameworks utilizados no projeto. Vamos usar Docker para facilitar o processo e garantir que tudo funcione corretamente.

## Pré-requisitos

1. Um servidor VPS Linux (Ubuntu 20.04 ou versão mais recente recomendada)
2. Acesso SSH ao servidor
3. Um domínio apontando para o IP do seu servidor (opcional, mas recomendado)

## Passo 1: Conectar ao servidor VPS

Primeiro, você precisa se conectar ao seu servidor VPS via SSH. Se estiver usando Windows, você pode usar o PuTTY; se estiver usando macOS ou Linux, você pode usar o Terminal.

```bash
ssh seu_usuario@ip_do_seu_servidor
```

Substitua `seu_usuario` e `ip_do_seu_servidor` pelas informações do seu servidor VPS.

## Passo 2: Atualizar o sistema

Antes de instalar qualquer coisa, é uma boa prática atualizar o sistema:

```bash
sudo apt update
sudo apt upgrade -y
```

## Passo 3: Instalar o Docker e Docker Compose

### Instalar o Docker:

```bash
# Instalar pacotes necessários
sudo apt install -y apt-transport-https ca-certificates curl software-properties-common

# Adicionar a chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Adicionar o repositório do Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Atualizar a lista de pacotes e instalar o Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io

# Verificar se o Docker foi instalado corretamente
sudo docker --version
```

### Instalar o Docker Compose:

```bash
# Baixar a versão mais recente do Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.18.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# Dar permissão de execução
sudo chmod +x /usr/local/bin/docker-compose

# Verificar se o Docker Compose foi instalado corretamente
docker-compose --version
```

### Adicionar seu usuário ao grupo Docker (para não precisar usar sudo):

```bash
sudo usermod -aG docker $USER
```

**Importante:** Você precisará sair e entrar novamente no SSH para que as mudanças de grupo tenham efeito.

## Passo 4: Baixar o código-fonte do projeto

Agora vamos baixar o código-fonte do projeto:

```bash
# Criar uma pasta para o projeto
mkdir -p ~/byod-voting
cd ~/byod-voting

# Se você tem o código em um arquivo ZIP, você pode fazer upload dele para o servidor
# e depois descompactar:
# unzip arquivo.zip

# Ou você pode clonar o repositório se estiver usando Git
# git clone URL_DO_REPOSITORIO .
```

## Passo 5: Configurar o Docker

### Criar o arquivo .env:

```bash
cd ~/byod-voting
nano .env
```

Adicione o seguinte conteúdo (substitua as senhas por valores seguros):

```
POSTGRES_PASSWORD=sua_senha_segura_aqui
SESSION_SECRET=outra_senha_segura_aqui
```

Salve o arquivo pressionando `Ctrl+X`, depois `Y` e finalmente `Enter`.

## Passo 6: Executar o sistema

Agora vamos iniciar o sistema usando Docker Compose:

```bash
# Certifique-se de que está na pasta do projeto
cd ~/byod-voting/dockerization

# Iniciar os contêineres em segundo plano
docker-compose up -d
```

Este comando irá:
1. Baixar as imagens necessárias
2. Construir a imagem da aplicação
3. Iniciar o banco de dados PostgreSQL
4. Iniciar a aplicação web

## Passo 7: Verificar se está funcionando

Você pode verificar se os contêineres estão em execução com o seguinte comando:

```bash
docker-compose ps
```

Você também pode verificar os logs da aplicação:

```bash
docker-compose logs -f app
```

Para sair dos logs, pressione `Ctrl+C`.

## Passo 8: Acessar o sistema

Agora você pode acessar o sistema em seu navegador usando o IP do seu servidor:

```
http://ip_do_seu_servidor
```

Se você configurou um domínio, você pode acessar usando o domínio:

```
http://seu_dominio.com
```

## Passo 9: Configurar o Nginx e HTTPS (opcional, mas recomendado)

Para uma configuração mais segura, você pode configurar o Nginx como proxy reverso e habilitar HTTPS com Let's Encrypt:

### Instalar o Nginx:

```bash
sudo apt install -y nginx
```

### Configurar o Nginx:

```bash
sudo nano /etc/nginx/sites-available/byod
```

Adicione o seguinte conteúdo (substitua `seu_dominio.com` pelo seu domínio):

```nginx
server {
    listen 80;
    server_name seu_dominio.com www.seu_dominio.com;

    location / {
        proxy_pass http://localhost:80;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Salve o arquivo e ative-o:

```bash
sudo ln -s /etc/nginx/sites-available/byod /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Instalar o Certbot e configurar HTTPS:

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d seu_dominio.com -d www.seu_dominio.com
```

Siga as instruções na tela para concluir a configuração do HTTPS.

## Credenciais de acesso

O sistema vem configurado com as seguintes contas de usuário:

1. **Professor**
   - Usuário: professor
   - Senha: Nlt@@123

2. **Favor**
   - Usuário: favor
   - Senha: NLS@@25

3. **Contra**
   - Usuário: contra
   - Senha: KYU##29

## Manutenção

### Reiniciar a aplicação:

```bash
cd ~/byod-voting/dockerization
docker-compose restart
```

### Parar a aplicação:

```bash
cd ~/byod-voting/dockerization
docker-compose down
```

### Atualizar a aplicação após mudanças no código:

```bash
cd ~/byod-voting/dockerization
docker-compose down
docker-compose up -d --build
```

### Visualizar logs:

```bash
# Visualizar logs de todos os serviços
docker-compose logs -f

# Visualizar logs apenas da aplicação
docker-compose logs -f app

# Visualizar logs apenas do banco de dados
docker-compose logs -f postgres
```

## Backup do banco de dados

### Criar um backup:

```bash
cd ~/byod-voting/dockerization

# Criar um diretório para backups se não existir
mkdir -p ../backups

# Fazer o backup do banco de dados
docker-compose exec -T postgres pg_dump -U postgres -d byod_voting > ../backups/backup_$(date +%Y%m%d).sql
```

### Restaurar um backup:

```bash
cd ~/byod-voting/dockerization

# Restaurar o banco de dados a partir de um backup
cat ../backups/backup_20250511.sql | docker-compose exec -T postgres psql -U postgres -d byod_voting
```

## Solução de problemas

### Se a aplicação não estiver acessível:

1. Verifique se os contêineres estão em execução:
   ```bash
   docker-compose ps
   ```

2. Verifique os logs da aplicação:
   ```bash
   docker-compose logs -f app
   ```

3. Verifique se a porta 80 está aberta no firewall:
   ```bash
   sudo ufw status
   ```

   Se necessário, abra a porta:
   ```bash
   sudo ufw allow 80/tcp
   ```

4. Verifique se o Docker está em execução:
   ```bash
   sudo systemctl status docker
   ```

   Se estiver parado, inicie-o:
   ```bash
   sudo systemctl start docker
   ```

### Se o banco de dados não estiver conectando:

1. Verifique os logs do banco de dados:
   ```bash
   docker-compose logs -f postgres
   ```

2. Verifique as variáveis de ambiente:
   ```bash
   docker-compose config
   ```

3. Reinicie o contêiner do banco de dados:
   ```bash
   docker-compose restart postgres
   ```

## Conclusão

Você agora tem um Sistema de Votação BYOD totalmente funcional executando em seu servidor VPS Linux usando Docker. O sistema está disponível através do seu IP ou domínio e, se você seguiu as etapas opcionais, está protegido por HTTPS.

Para qualquer dúvida adicional ou problemas, consulte os logs da aplicação e do banco de dados, pois eles geralmente contêm informações úteis para solucionar problemas.

Lembre-se de fazer backups regulares do banco de dados para evitar perdas de dados.