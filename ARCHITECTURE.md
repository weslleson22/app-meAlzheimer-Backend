# 🏗️ Arquitetura do Projeto MeAlzheimer Backend

## 📐 Visão Geral da Arquitetura

Este documento descreve a arquitetura, padrões de design e organização do código no backend MeAlzheimer.

```
┌─────────────────────────────────────────────────┐
│         CLIENT (Frontend/Mobile App)            │
└──────────────────┬──────────────────────────────┘
                   │
                   │ HTTP/REST
                   ▼
┌─────────────────────────────────────────────────┐
│              EXPRESS SERVER (PORT 3333)         │
│                                                 │
│  ┌─────────────────────────────────────────┐  │
│  │      MIDDLEWARE LAYER                   │  │
│  │  - CORS                                 │  │
│  │  - Body Parser (JSON)                   │  │
│  │  - Multer (File Upload)                 │  │
│  │  - Celebrate (Validation)               │  │
│  └─────────────────────────────────────────┘  │
│                    │                           │
│                    ▼                           │
│  ┌─────────────────────────────────────────┐  │
│  │      ROUTES LAYER (routes.ts)           │  │
│  │  - GET /items                           │  │
│  │  - GET /points                          │  │
│  │  - GET /points/:id                      │  │
│  │  - POST /points                         │  │
│  └─────────────────────────────────────────┘  │
│                    │                           │
│                    ▼                           │
│  ┌─────────────────────────────────────────┐  │
│  │    CONTROLLERS LAYER                    │  │
│  │  - ItemsController                      │  │
│  │  - PointsController                     │  │
│  └─────────────────────────────────────────┘  │
│                    │                           │
│                    ▼                           │
│  ┌─────────────────────────────────────────┐  │
│  │      DATABASE LAYER (Knex)              │  │
│  │  - Connection                           │  │
│  │  - Query Building                       │  │
│  │  - Transactions                         │  │
│  └─────────────────────────────────────────┘  │
└─────────────────┬──────────────────────────────┘
                  │
                  ▼
        ┌──────────────────┐
        │  SQLite Database │
        │                  │
        │ - points         │
        │ - items          │
        │ - point_items    │
        └──────────────────┘
```

---

## 📁 Estrutura de Diretórios

```
app-meAlzheimer-Backend/
│
├── src/                              # Código-fonte principal
│   ├── config/
│   │   └── multer.ts               # Configuração de upload de arquivos
│   │                                 # - Destino: ./uploads
│   │                                 # - Nomeação: timestamp-originalname
│   │
│   ├── controllers/                 # Lógica de negócios
│   │   ├── ItemsController.ts       # Gerenciamento de itens
│   │   │   └── index()              # Lista todos os itens
│   │   │
│   │   └── PointsController.ts      # Gerenciamento de pontos de coleta
│   │       ├── index()              # Lista com filtros
│   │       ├── show()               # Detalhes específicos
│   │       └── create()             # Criar novo ponto
│   │
│   ├── database/
│   │   ├── connection.ts            # Conexão com SQLite
│   │   │
│   │   ├── migrations/              # Versionamento do schema
│   │   │   ├── 00_create_points.ts       # Tabela points
│   │   │   ├── 01_create_items.ts        # Tabela items
│   │   │   └── 02_create_point_items.ts  # Tabela relacionamento
│   │   │
│   │   └── seeds/                   # Dados iniciais
│   │       └── create_items.ts      # Populate inicial
│   │
│   ├── routes.ts                    # Definição de rotas HTTP
│   ├── routes-swagger.ts            # Documentação Swagger/JSDoc
│   ├── swagger.ts                   # Configuração Swagger
│   └── server.ts                    # Inicialização do servidor
│
├── uploads/                         # Imagens dos pontos (gerado)
│
├── knexfile.ts                      # Configuração do Knex
├── tsconfig.json                    # Configuração TypeScript
├── package.json                     # Dependências do projeto
├── package-lock.json                # Lock de versões
│
├── .env                             # Variáveis de ambiente (git ignore)
├── .env.example                     # Exemplo de .env
├── .gitignore                       # Arquivos ignorados pelo git
│
├── README.md                        # Documentação principal
├── API-EXAMPLES.md                  # Exemplos de requisições
├── ARCHITECTURE.md                  # Este arquivo
└── postman-collection.json          # Coleção Postman
```

---

## 🔄 Fluxo de Dados

### Exemplo 1: Listar Pontos com Filtros

```
┌─────────────────────────────────────────────────┐
│  1. Cliente faz requisição                      │
│  GET /points?city=Fortaleza&uf=CE&items=1,2,3  │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  2. Express Router identifica rota              │
│  routes.get('/points', controller.index)       │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  3. PointsController.index() executa           │
│  - Extrai query params (city, uf, items)       │
│  - Valida e formata dados                      │
│  - Constrói query SQL com Knex                 │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  4. Knex Query Builder                         │
│  SELECT points.*                               │
│  FROM points                                   │
│  JOIN point_items ON points.id = point_items. │
│  WHERE point_items.item_id IN (1, 2, 3)       │
│  AND city = 'Fortaleza'                        │
│  AND uf = 'CE'                                 │
│  DISTINCT                                      │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  5. SQLite Database executa query              │
│  Retorna resultados da tabela                  │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  6. Serializar resposta                        │
│  - Mapear resultados                           │
│  - Construir URLs de imagem                    │
│  - Formatar para JSON                          │
└────────────────────┬────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────┐
│  7. Enviar resposta JSON para cliente          │
│  HTTP 200 OK                                   │
│  [                                             │
│    {                                           │
│      id: 1,                                    │
│      name: "Ponto Ecológico",                  │
│      image_url: "http://..."                   │
│      ...                                       │
│    }                                           │
│  ]                                             │
└─────────────────────────────────────────────────┘
```

### Exemplo 2: Criar Novo Ponto

```
┌──────────────────────────────────────────────┐
│  1. Cliente envia multipart/form-data        │
│  POST /points                                │
│  - Dados do ponto (nome, email, etc)        │
│  - Arquivo de imagem                        │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  2. Middleware Multer                        │
│  - Recebe arquivo                            │
│  - Salva em ./uploads/{timestamp}-{name}    │
│  - Adiciona info em request.file             │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  3. Middleware Celebrate                     │
│  - Valida schema com Joi                     │
│  - Verifica tipos de dados                   │
│  - Valida email, coordenadas, etc            │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  4. PointsController.create()               │
│  - Extrai dados validados                   │
│  - Prepara objeto point                     │
│  - Inicia transaction no Knex               │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  5. Insert into points table                │
│  - INSERT point (name, email, ...)          │
│  - Retorna ID do novo ponto                 │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  6. Insert into point_items table           │
│  - Para cada item_id                        │
│  - INSERT (point_id, item_id)               │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  7. Commit transaction                       │
│  - Se tudo OK: confirma                      │
│  - Se erro: rollback automático              │
└────────────────┬─────────────────────────────┘
                 │
                 ▼
┌──────────────────────────────────────────────┐
│  8. Resposta HTTP 201 Created                │
│  {                                           │
│    "id": 5,                                  │
│    "message": "Ponto criado com sucesso"    │
│  }                                           │
└──────────────────────────────────────────────┘
```

---

## 🗄️ Modelo de Dados

### Diagrama ER (Entidade-Relacionamento)

```
┌─────────────────┐         ┌──────────────────┐         ┌─────────────┐
│     ITEMS       │         │  POINT_ITEMS     │         │   POINTS    │
├─────────────────┤         ├──────────────────┤         ├─────────────┤
│ id (PK)         │◄────────│ item_id (FK)     │         │ id (PK)     │
│ title           │         │ point_id (FK)    │────────►│ name        │
│ image           │         │ id (PK)          │         │ email       │
│ created_at      │         │ UNIQUE(item_id,  │         │ whatsapp    │
│                 │         │         point_id)│         │ latitude    │
└─────────────────┘         └──────────────────┘         │ longitude   │
        (M)                        (1:M)                  │ city        │
                                                          │ uf          │
        Relação: Uma ITEM pode estar em                  │ image       │
        vários PONTOS, e um PONTO pode                   │ created_at  │
        aceitar vários ITEMS                             └─────────────┘
```

### Schema Detalhado

**Tabela: items**
```sql
CREATE TABLE items (
  id        INTEGER PRIMARY KEY AUTOINCREMENT,
  image     TEXT NOT NULL,
  title     TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Tabela: points**
```sql
CREATE TABLE points (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  image      TEXT,
  name       TEXT NOT NULL,
  email      TEXT NOT NULL,
  whatsapp   TEXT NOT NULL,
  latitude   REAL NOT NULL,
  longitude  REAL NOT NULL,
  city       TEXT NOT NULL,
  uf         TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Tabela: point_items**
```sql
CREATE TABLE point_items (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id   INTEGER NOT NULL,
  item_id    INTEGER NOT NULL,
  FOREIGN KEY (point_id) REFERENCES points(id),
  FOREIGN KEY (item_id) REFERENCES items(id),
  UNIQUE (point_id, item_id)
);
```

---

## 🎯 Padrões de Design

### 1. MVC (Model-View-Controller)

O projeto segue o padrão MVC adaptado:

- **Model**: Schema de dados (migrations + knex queries)
- **View**: Responses JSON (serialização)
- **Controller**: Lógica de negócios (controllers/)

```
Request → Routes → Controller → Database → Serialization → Response
```

### 2. Dependency Injection (DI)

Controllers instanciam suas dependências:

```typescript
class ItemsController {
  async index(request: Request, response: Response) {
    const items = await Knex('items').select('*');
    // Knex é injetado diretamente
  }
}
```

### 3. Repository Pattern (Simplificado)

Database queries centralizadas nos controllers:

```typescript
// PointsController
const points = await Knex("points")
  .join("point_items", ...)
  .where(...)
  .distinct()
  .select("points.*");
```

### 4. Serialization

Transformação de dados antes de enviar ao cliente:

```typescript
const serializedItems = items.map(item => ({
  id: item.id,
  title: item.title,
  image_url: `http://192.168.0.6:3333/uploads/${item.image}`
}));
```

---

## 🔐 Validação e Segurança

### Camadas de Validação

```
┌──────────────────────────────┐
│  1. Express Validators       │
│  - Content-Type              │
│  - Headers básicos           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  2. Multer (Files)           │
│  - Tamanho máximo            │
│  - Extensão (opcional)       │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  3. Celebrate + Joi          │
│  - Tipos de dados            │
│  - Email válido              │
│  - Coordenadas (números)     │
│  - Max length (UF = 2)       │
│  - Required fields           │
└──────────────┬───────────────┘
               │
               ▼
┌──────────────────────────────┐
│  4. Database Constraints     │
│  - PRIMARY KEY               │
│  - FOREIGN KEY               │
│  - UNIQUE (point_id, item_id)│
└──────────────────────────────┘
```

### Exemplo de Validação

```typescript
celebrate({
  body: Joi.object().keys({
    name: Joi.string().required(),
    email: Joi.string().required().email(),
    whatsapp: Joi.string().required(),
    latitude: Joi.number().required(),
    longitude: Joi.number().required(),
    city: Joi.string().required(),
    uf: Joi.string().required().max(2),
    items: Joi.string().required(),
  })
}, {
  abortEarly: false // Retorna todos os erros, não só o primeiro
})
```

---

## 🚀 Performance

### Otimizações Implementadas

1. **Query Joins Eficientes**
   ```typescript
   // Evita N+1 queries
   const points = await Knex("points")
     .join("point_items", "points.id", "point_items.point_id")
     .whereIn("point_items.item_id", parsedItems)
     .distinct()
     .select("points.*");
   ```

2. **Distinct Results**
   ```typescript
   // Evita duplicatas quando há múltiplos items
   .distinct()
   ```

3. **Índices do Banco (adicionar)**
   ```sql
   CREATE INDEX idx_points_city ON points(city);
   CREATE INDEX idx_points_uf ON points(uf);
   CREATE INDEX idx_point_items_point_id ON point_items(point_id);
   CREATE INDEX idx_point_items_item_id ON point_items(item_id);
   ```

---

## 📚 Principais Dependências

| Dependência | Versão | Propósito |
|------------|--------|----------|
| express | ^4.18 | Framework web |
| cors | ^2.8 | CORS middleware |
| knex | ^2.2 | Query builder |
| sqlite3 | ^5.0 | Database driver |
| multer | ^1.4 | File upload |
| celebrate | ^15.0 | Validação |
| joi | ^18.1 | Schema validation |
| swagger-ui-express | ^5.0 | Documentação UI |
| swagger-jsdoc | ^6.2 | Geração Swagger |
| ts-node | ^10.9 | Execução TS direto |
| ts-node-dev | ^2.0 | Dev server com reload |
| typescript | ^4.7 | Tipagem estática |

---

## 🔧 Extensões Futuras

### 1. Autenticação
```typescript
// Adicionar JWT
import jwt from 'jsonwebtoken';
```

### 2. Paginação
```typescript
const page = request.query.page || 1;
const limit = 20;
const offset = (page - 1) * limit;
```

### 3. Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';
```

### 4. Cache
```typescript
import redis from 'redis';
```

### 5. Logs
```typescript
import winston from 'winston';
```

---

## 📊 Fluxo de Desenvolvimento

```
1. Entender Requisito
   ↓
2. Criar/Atualizar Migration (schema)
   ↓
3. Implementar Controller (lógica)
   ↓
4. Definir Rota (endpoint)
   ↓
5. Documentar Swagger (API docs)
   ↓
6. Testar (Postman/Swagger)
   ↓
7. Commit & Push
```

---

## 🧪 Testando a Arquitetura

### Health Check
```bash
curl http://localhost:3333/items
```

### Ver Documentação
```
http://localhost:3333/api-docs
```

### Verificar Banco
```bash
sqlite3 src/database/database.sqlite ".schema"
```

---

## 📝 Notas Importantes

1. **Transações**: POST /points usa transação para garantir integridade
2. **Serialização**: Todas as respostas serializam URLs de imagem
3. **Validação**: Celebrate valida antes de atingir controller
4. **CORS**: Habilitado para facilitar testes, configurar em produção

---

## 🔗 Referências

- [Express.js Docs](https://expressjs.com/)
- [Knex.js Query Builder](https://knexjs.org/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [Celebrate Validation](https://github.com/arb/celebrate)
- [Joi Schema Docs](https://joi.dev/)
