# MeAlzheimer Backend API

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-ISC-green)
![Node](https://img.shields.io/badge/node-%3E%3D14-brightgreen)

Plataforma backend para gerenciamento de famílias de acordo com o seu parentesco, com integração de conscientização sobre Alzheimer.

## 📋 Índice

- [Características](#características)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Uso](#uso)
- [API Endpoints](#api-endpoints)
- [Documentação Swagger](#documentação-swagger)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Database](#database)
- [Troubleshooting](#troubleshooting)

## ✨ Características

- ✅ Listagem de família
- ✅ Criação e listagem da localização da família
- ✅ Filtros por cidade, estado e categorias de parentesco
- ✅ Upload de imagens para o registro da família
- ✅ Validação de dados com Celebrate/Joi
- ✅ Documentação automática com Swagger/OpenAPI
- ✅ CORS habilitado para integração com frontend
- ✅ Banco de dados SQLite com migrações
- ✅ Tipagem completa com TypeScript

## 🛠️ Tecnologias Utilizadas

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web minimalista
- **TypeScript** - Tipagem estática para JavaScript
- **SQLite3** - Banco de dados leve
- **Knex.js** - Query builder e gerenciador de migrações
- **Multer** - Processamento de upload de arquivos
- **Celebrate + Joi** - Validação de dados robusta
- **CORS** - Compartilhamento de recursos entre origens
- **Swagger/OpenAPI** - Documentação interativa da API

### Desenvolvimento
- **ts-node-dev** - Execução e reload automático
- **TypeScript Compiler** - Compilação de TypeScript

## 📦 Pré-requisitos

Antes de iniciar, você precisa ter instalado:

- Node.js (versão 14 ou superior)
- npm ou yarn
- SQLite3 (geralmente vem com o Node)

Verificar versões:
```bash
node --version
npm --version
```

## 🚀 Instalação

### 1. Clonar o repositório

```bash
git clone <url-do-repositorio>
cd app-meAlzheimer-Backend
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto (opcional):

```env
NODE_ENV=development
PORT=3333
DATABASE_URL=./src/database/database.sqlite
```

### 4. Executar migrações do banco de dados

```bash
npm run knex:migrate
```

### 5. Populate do banco (opcional)

```bash
npm run knex:seed
```

## ⚙️ Configuração

### Configuração do Multer

O arquivo `src/config/multer.ts` define como as imagens são armazenadas:

```typescript
// Destino: ./uploads/
// Nomeação: timestamp-original-filename
```

### Configuração do Swagger

O arquivo `src/swagger.ts` define a documentação da API. Para personalizar:

1. Edite a URL do servidor em `servers`
2. Adicione informações de contato
3. Configure schemas customizados

### Variáveis de Configuração

**IP Local (para rede)**: `http://192.168.0.6:3333`  
**URLs de Imagem**: As imagens são servidas via `/uploads/{filename}`

## 📱 Uso

### Iniciar servidor em desenvolvimento

```bash
npm run dev
```

Saída esperada:
```
✅ Servidor rodando na porta 3333
📚 Documentação Swagger disponível em: http://localhost:3333/api-docs
```

### Compilar TypeScript

```bash
npx tsc
```

### Gerenciar Banco de Dados

```bash
# Executar migrações pendentes
npm run knex:migrate

# Executar seeds
npm run knex:seed

# Criar nova migração
npx knex migrate:make --knexfile knexfile.ts <nome-da-migracao>

# Reverter última migração
npx knex migrate:rollback --knexfile knexfile.ts
```

## 🔌 API Endpoints

### Categories (Categorias de Família)

#### GET `/items`
Lista todas as categorias de parentesco usadas no sistema.

**Exemplo de Requisição:**
```bash
curl http://localhost:3333/items
```

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "title": "Mãe",
    "image_url": "http://192.168.0.6:3333/uploads/mae.png"
  },
  {
    "id": 2,
    "title": "Pai",
    "image_url": "http://192.168.0.6:3333/uploads/pai.png"
  }
]
```

---

#### GET `/points`
Lista localizações de família com filtros.

**Parâmetros Query (obrigatórios):**
| Parâmetro | Tipo | Descrição | Exemplo |
|-----------|------|-----------|---------|
| `city` | string | Nome da cidade | `Fortaleza` |
| `uf` | string | Estado (2 caracteres) | `CE` |
| `items` | string | IDs das categorias de parentesco (separados por vírgula) | `1,2,3` |

**Exemplo de Requisição:**
```bash
curl "http://localhost:3333/points?city=Fortaleza&uf=CE&items=1,2,3"
```

**Exemplo de Resposta:**
```json
[
  {
    "id": 1,
    "name": "Família Silva",
    "email": "contato@familia.com",
    "whatsapp": "85988776655",
    "latitude": -3.7319,
    "longitude": -38.5267,
    "city": "Fortaleza",
    "uf": "CE",
    "image": "familia1.png",
    "image_url": "http://192.168.0.6:3333/uploads/familia1.png"
  }
]
```

---

#### GET `/points/:id`
Obtém detalhes específicos de uma família.

**Parâmetros Path:**
| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `id` | integer | ID da família |

**Exemplo de Requisição:**
```bash
curl http://localhost:3333/points/1
```

**Exemplo de Resposta:**
```json
{
  "point": {
    "id": 1,
    "name": "Família Silva",
    "email": "contato@familia.com",
    "whatsapp": "85988776655",
    "latitude": -3.7319,
    "longitude": -38.5267,
    "city": "Fortaleza",
    "uf": "CE",
    "image": "familia1.png",
    "image_url": "http://192.168.0.6:3333/uploads/familia1.png"
  },
  "items": [
    { "title": "Mãe" },
    { "title": "Pai" },
    { "title": "Primo" }
  ]
}
```

---

#### POST `/points`
Cria uma nova localização de família.

**Parâmetros Body (multipart/form-data):**
| Campo | Tipo | Obrigatório | Descrição | Exemplo |
|-------|------|-------------|-----------|---------|
| `name` | string | ✅ | Nome da família | `Família Silva` |
| `email` | string | ✅ | Email de contato | `contato@familia.com` |
| `whatsapp` | string | ✅ | Número WhatsApp | `85988776655` |
| `latitude` | number | ✅ | Coordenada latitude | `-3.7319` |
| `longitude` | number | ✅ | Coordenada longitude | `-38.5267` |
| `city` | string | ✅ | Cidade | `Fortaleza` |
| `uf` | string (max 2) | ✅ | Estado | `CE` |
| `items` | string | ✅ | IDs das categorias de parentesco (separados por vírgula) | `1,2,3` |
| `image` | file | ❌ | Imagem do registro da família | arquivo.png |

**Exemplo de Requisição (cURL):**
```bash
curl -X POST http://localhost:3333/points \
  -F "name=Família Silva" \
  -F "email=contato@familia.com" \
  -F "whatsapp=85988776655" \
  -F "latitude=-3.7319" \
  -F "longitude=-38.5267" \
  -F "city=Fortaleza" \
  -F "uf=CE" \
  -F "items=1,2,3" \
  -F "image=@/caminho/para/imagem.png"
```

**Exemplo de Requisição (JavaScript/Node.js):**
```javascript
const FormData = require('form-data');
const fs = require('fs');

const form = new FormData();
form.append('name', 'Família Silva');
form.append('email', 'contato@familia.com');
form.append('whatsapp', '85988776655');
form.append('latitude', -3.7319);
form.append('longitude', -38.5267);
form.append('city', 'Fortaleza');
form.append('uf', 'CE');
form.append('items', '1,2,3');
form.append('image', fs.createReadStream('./imagem.png'));

axios.post('http://localhost:3333/points', form, {
  headers: form.getHeaders(),
});
```

**Exemplo de Resposta (201 Created):**
```json
{
  "id": 5,
  "message": "Localização da família criada

**Códigos de Erro:**
- `400` - Dados inválidos ou campos obrigatórios faltando
- `500` - Erro interno do servidor

---

## 📚 Documentação Swagger

A documentação interativa da API está disponível em:

```
http://localhost:3333/api-docs
```

### Acessando a Documentação

1. Inicie o servidor: `npm run dev`
2. Abra seu navegador em: `http://localhost:3333/api-docs`
3. Você verá a interface interativa do Swagger UI com todos os endpoints

### Testando Endpoints no Swagger

1. Clique em um endpoint para expandi-lo
2. Clique em "Try it out"
3. Preencha os parâmetros/body
4. Clique em "Execute"
5. Visualize a resposta

### Acessar via Rede Local

Se acessando de outro computador na rede:
```
http://192.168.0.6:3333/api-docs
```

## 📂 Estrutura do Projeto

```
app-meAlzheimer-Backend/
├── src/
│   ├── config/
│   │   └── multer.ts              # Configuração de upload de arquivos
│   ├── controllers/
│   │   ├── ItemsController.ts     # Lógica de itens
│   │   └── PointsController.ts    # Lógica de pontos de coleta
│   ├── database/
│   │   ├── connection.ts          # Conexão com SQLite
│   │   ├── migrations/
│   │   │   ├── 00_create_points.ts       # Tabela de pontos
│   │   │   ├── 01_create_items.ts        # Tabela de itens
│   │   │   └── 02_create_point_items.ts  # Tabela de relacionamento
│   │   └── seeds/
│   │       └── create_items.ts    # Dados iniciais
│   ├── routes.ts                  # Definição de rotas
│   ├── routes-swagger.ts          # Documentação Swagger
│   ├── swagger.ts                 # Configuração do Swagger
│   └── server.ts                  # Inicialização do servidor
├── uploads/                       # Imagens dos pontos de coleta
├── .env                          # Variáveis de ambiente
├── knexfile.ts                   # Configuração do Knex
├── package.json                  # Dependências do projeto
├── tsconfig.json                 # Configuração do TypeScript
└── README.md                      # Este arquivo
```

## 💾 Database

### Esquema do Banco de Dados

#### Tabela: `items`
```sql
CREATE TABLE items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image TEXT NOT NULL,
  title TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabela: `points`
```sql
CREATE TABLE points (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  image TEXT,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  latitude REAL NOT NULL,
  longitude REAL NOT NULL,
  city TEXT NOT NULL,
  uf TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Tabela: `point_items`
```sql
CREATE TABLE point_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  point_id INTEGER NOT NULL,
  item_id INTEGER NOT NULL,
  FOREIGN KEY (point_id) REFERENCES points(id),
  FOREIGN KEY (item_id) REFERENCES items(id),
  UNIQUE (point_id, item_id)
);
```

### Relacionamentos

```
items (1) ──→ (many) point_items ←──(many) points
```

## 🚨 Troubleshooting

### Erro: "Cannot find module 'celebrate'"

**Solução:**
```bash
npm install celebrate joi
npm list celebrate joi
```

### Erro: "Port 3333 already in use"

**Solução 1:** Liberar a porta
```bash
# Windows
netstat -ano | findstr :3333
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3333
kill -9 <PID>
```

**Solução 2:** Usar porta diferente
```bash
PORT=3334 npm run dev
```

### Erro: "Database not found"

**Solução:**
```bash
npm run knex:migrate
```

### Erro: "Cannot connect to database"

Verifique se:
- O arquivo `database.sqlite` existe em `src/database/`
- As migrações foram executadas (`npm run knex:migrate`)
- Você tem permissão de leitura/escrita na pasta

### Swagger não carrega estilos

**Solução:**
- Limpe o cache do navegador (Ctrl+Shift+Del)
- Use Ctrl+F5 para recarregar forçadamente
- Tente em outro navegador

### Imagens não aparecem

Verifique se:
- As imagens foram salvas em `uploads/`
- O servidor está servindo `/uploads` corretamente
- A URL da imagem usa o IP correto (localhost ou 192.168.0.6)

## 📖 Exemplos de Uso

### JavaScript/Node.js

```javascript
// Listar itens
fetch('http://localhost:3333/items')
  .then(res => res.json())
  .then(data => console.log(data));

// Filtrar pontos
const params = new URLSearchParams({
  city: 'Fortaleza',
  uf: 'CE',
  items: '1,2,3'
});

fetch(`http://localhost:3333/points?${params}`)
  .then(res => res.json())
  .then(data => console.log(data));

// Obter ponto específico
fetch('http://localhost:3333/points/1')
  .then(res => res.json())
  .then(data => console.log(data));
```

### Python

```python
import requests

# Listar itens
response = requests.get('http://localhost:3333/items')
print(response.json())

# Filtrar pontos
params = {
    'city': 'Fortaleza',
    'uf': 'CE',
    'items': '1,2,3'
}
response = requests.get('http://localhost:3333/points', params=params)
print(response.json())

# Criar ponto
files = {'image': open('imagem.png', 'rb')}
data = {
    'name': 'Ponto Ecológico Centro',
    'email': 'contato@ponto.com',
    'whatsapp': '85988776655',
    'latitude': -3.7319,
    'longitude': -38.5267,
    'city': 'Fortaleza',
    'uf': 'CE',
    'items': '1,2,3'
}
response = requests.post('http://localhost:3333/points', data=data, files=files)
print(response.json())
```

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença ISC. Veja o arquivo `package.json` para mais detalhes.

## 👤 Autor

Seu Nome - [seus links de contato]

---

## 📞 Suporte

Para dúvidas ou problemas:
- Abra uma issue no repositório
- Envie um email para: seu.email@example.com
- Consulte a documentação Swagger em: `/api-docs`

---

**Desenvolvido com ❤️ para a conscientização sobre Alzheimer**
