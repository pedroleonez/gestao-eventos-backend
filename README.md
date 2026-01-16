# Gestão de Eventos (Backend)

Backend desenvolvido em Node.js para uma plataforma de gestão de eventos. O sistema permite o cadastro de usuários, criação de eventos, inscrições e gerenciamento de participantes.

## 🚀 Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **TypeScript**: Superset do JavaScript com tipagem estática.
- **Express**: Framework web rápido e minimalista.
- **Prisma**: ORM moderno para Node.js e TypeScript.
- **PostgreSQL**: Banco de dados relacional.
- **JWT (JSON Web Token)**: Autenticação segura via tokens.
- **BCrypt**: Hash de senhas para segurança.

## 📋 Pré-requisitos

- Node.js (versão 18 ou superior recomendada)
- Gerenciador de pacotes (npm, yarn ou pnpm)
- Banco de dados PostgreSQL rodando localmente ou em nuvem (ex: Docker)

## 🔧 Instalação e Configuração

1. **Clone o repositório**
   ```bash
   git clone https://github.com/pedroleonez/gestao-eventos-backend.git
   cd gestao-eventos-backend
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto e preencha com suas configurações. Você pode seguir o modelo abaixo:

   ```env
   # .env
   DATABASE_URL="postgresql://usuario:senha@localhost:5432/gestao_eventos_db?schema=public"
   JWT_SECRET="sua_chave_ultra_secreta_aqui"
   ```

4. **Execute as Migrations do Banco de Dados**
   Isso criará as tabelas no seu banco PostgreSQL.
   ```bash
   npx prisma migrate dev
   ```

## ⚡ Executando o Projeto

### Desenvolvimento
Para rodar o servidor em modo de desenvolvimento (com auto-reload):
```bash
npm run dev
```

### Produção
Para buildar e rodar o código transpilado:
```bash
npm run build
npm start
```

O servidor estará rodando em `http://localhost:3333`.

---

## 📚 Documentação da API

### Autenticação

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| `POST` | `/users` | Cadastrar um novo usuário | Não |
| `POST` | `/login` | Autenticar usuário e obter token JWT | Não |
| `GET` | `/me` | Obter dados do usuário logado | **Sim** |

### Eventos

| Método | Endpoint | Descrição | Autenticação |
|---|---|---|---|
| `GET` | `/events` | Listar todos os eventos (com contagem de inscritos) | Não |
| `POST` | `/events` | Criar um novo evento (Organizador) | **Sim** |
| `POST` | `/events/:eventId/register` | Inscrever-se em um evento | **Sim** |
| `DELETE` | `/events/:eventId/register` | Cancelar inscrição em um evento | **Sim** |
| `GET` | `/my-registrations` | Listar eventos onde o usuário está inscrito | **Sim** |
| `GET` | `/events/:eventId/attendees` | Ver lista de inscritos (Apenas Organizador) | **Sim** |

---

## 🗄️ Estrutura do Banco de Dados (Prisma)

O projeto possui as seguintes entidades principais:

- **User**: Usuários do sistema (Organizadores e Participantes).
- **Event**: Eventos criados pelos usuários. Possui relação com o organizador (`User`).
- **Registration**: Tabela pivô que gerencia a inscrição de usuários (`User`) em eventos (`Event`).

### Schema Visual
Você pode visualizar e editar o banco de dados usando o Prisma Studio:
```bash
npm run prisma studio
```

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.
