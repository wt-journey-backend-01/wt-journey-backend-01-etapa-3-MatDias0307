INSTRUÇÕES PARA CONFIGURAÇÃO DO PROJETO

1. Crie um arquivo `.env` na raiz com:
```bash
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=policia_db
NODE_ENV=development
```

2. Instale as dependências:
```bash
npm install
```

3. Subir o banco com Docker:
```bash
docker-compose up -d
```

4. Rodar as migrations:
```bash
npx knex migrate:latest
```

5. Rodar os seeds:
```bash
npm run seed:run
```

6. Iniciar o servidor:
```bash
npm start
```

7. Acessar a aplicação:
API: http://localhost:3000
Docs: http://localhost:3000/docs

8.  Reset completo do banco de dados:
```bash
npm run db:reset
```