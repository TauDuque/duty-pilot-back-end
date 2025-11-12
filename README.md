# Duty Pilot - Backend

Backend API para o aplicativo Duty Pilot - Um sistema de gerenciamento de tarefas (to-do list).

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **TypeScript** - Superset tipado do JavaScript (strict mode)
- **Express** - Framework web minimalista
- **PostgreSQL** - Banco de dados relacional
- **pg** - Driver PostgreSQL para Node.js
- **Jest** - Framework de testes
- **ESLint & Prettier** - Linting e formatação de código

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL 15+ instalado (ou via Docker)
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório

```bash
git clone <repository-url>
cd duty-pilot/back
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do diretório `back` baseado no `.env.example`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=duty_pilot
DB_USER=postgres
DB_PASSWORD=postgres

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

### 4. Configure o banco de dados

#### Opção A: PostgreSQL via Docker

```bash
# Inicie o container PostgreSQL
docker run --name duty-pilot-db \
  -e POSTGRES_DB=duty_pilot \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -d postgres:15
```

#### Opção B: PostgreSQL local

Certifique-se de que o PostgreSQL está rodando e crie o banco de dados:

```sql
CREATE DATABASE duty_pilot;
```

### 5. Inicialize as tabelas do banco

```bash
npm run db:init
```

Este comando criará a tabela `duties` com a seguinte estrutura:

```sql
CREATE TABLE duties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Build para produção
npm run build

# Executar em produção
npm start

# Executar testes
npm test

# Executar testes em modo watch
npm run test:watch

# Executar testes com cobertura
npm run test:coverage

# Lint do código
npm run lint

# Lint e correção automática
npm run lint:fix

# Formatação de código
npm run format

# Inicializar banco de dados
npm run db:init
```

## 📚 API Endpoints

Base URL: `http://localhost:3001/api`

### Health Check

```
GET /api/health
```

**Resposta:**

```json
{
  "success": true,
  "message": "API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Listar todas as tarefas

```
GET /api/duties
```

**Resposta:**

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "Task name",
      "created_at": "2024-01-01T00:00:00.000Z",
      "updated_at": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### Buscar tarefa por ID

```
GET /api/duties/:id
```

**Resposta:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Task name",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Criar nova tarefa

```
POST /api/duties
Content-Type: application/json

{
  "name": "Task name"
}
```

**Validações:**

- `name` é obrigatório
- `name` deve ser uma string
- `name` não pode estar vazio
- `name` deve ter menos de 255 caracteres

**Resposta:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Task name",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Atualizar tarefa

```
PUT /api/duties/:id
Content-Type: application/json

{
  "name": "Updated task name"
}
```

**Validações:**

- `name` é obrigatório
- `name` deve ser uma string
- `name` não pode estar vazio
- `name` deve ter menos de 255 caracteres

**Resposta:**

```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Updated task name",
    "created_at": "2024-01-01T00:00:00.000Z",
    "updated_at": "2024-01-01T00:00:00.000Z"
  }
}
```

### Deletar tarefa

```
DELETE /api/duties/:id
```

**Resposta:**

- Status: 204 No Content

### Tratamento de Erros

Todos os erros seguem o formato:

```json
{
  "error": "ErrorType",
  "message": "Error message",
  "details": {} // opcional
}
```

Códigos de status HTTP:

- `200` - Sucesso
- `201` - Criado com sucesso
- `204` - Deletado com sucesso (sem conteúdo)
- `400` - Erro de validação
- `404` - Recurso não encontrado
- `500` - Erro interno do servidor

## 🏗️ Arquitetura

O projeto segue uma arquitetura em camadas para garantir separação de responsabilidades e escalabilidade:

```
src/
├── config/           # Configurações (DB, env)
├── controllers/      # Controladores (recebem requisições)
├── services/         # Lógica de negócio
├── repositories/     # Acesso ao banco de dados (SQL puro)
├── routes/          # Definição de rotas
├── middlewares/     # Middlewares (CORS, error handling)
├── validators/      # Validações de entrada
├── types/           # Tipos TypeScript
└── index.ts         # Entry point
```

### Fluxo de uma requisição:

1. **Route** → Define o endpoint e middlewares
2. **Validator** → Valida os dados de entrada
3. **Controller** → Recebe a requisição
4. **Service** → Executa a lógica de negócio
5. **Repository** → Acessa o banco de dados
6. **Response** → Retorna a resposta formatada

## 🧪 Testes

O projeto inclui testes unitários e de integração:

```bash
# Executar todos os testes
npm test

# Ver cobertura de testes
npm run test:coverage
```

Arquivos de teste:

- `tests/duty.service.test.ts` - Testes da camada de serviço
- `tests/duty.routes.test.ts` - Testes de integração das rotas
- `tests/validators.test.ts` - Testes dos validadores

## 📝 Observabilidade

- Logs estruturados no console
- Tratamento centralizado de erros
- Health check endpoint
- Mensagens claras de erro para o cliente

## 🔒 Segurança

- Validação rigorosa de entrada
- TypeScript strict mode
- Proteção contra SQL injection (prepared statements)
- CORS configurável
- Tratamento de erros sem exposição de informações sensíveis

## 🚀 Deploy

### Build para produção

```bash
npm run build
```

O código compilado estará em `dist/`.

### Executar em produção

```bash
NODE_ENV=production npm start
```

### Variáveis de ambiente em produção

Certifique-se de configurar todas as variáveis de ambiente necessárias no seu servidor/plataforma de deploy.

## 📄 Licença

ISC

## 👥 Autor

Desenvolvido como parte de um teste técnico.
