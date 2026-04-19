# Exemplos de Requisições da API

## 📋 Índice

- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Items Endpoints](#items-endpoints)
- [Points Endpoints](#points-endpoints)

---

## 🌍 Variáveis de Ambiente

Use estas variáveis em suas requisições:

```
{{base_url}} = http://localhost:3333
{{base_url_network}} = http://192.168.0.6:3333
```

Ou configure em seu cliente (Postman, Insomnia, etc):

```json
{
  "base_url": "http://localhost:3333",
  "content_type": "application/json"
}
```

---

## 📦 Items Endpoints

### 1. Listar Todos os Items

```http
GET {{base_url}}/items HTTP/1.1
Host: localhost:3333
Accept: application/json
```

**cURL:**
```bash
curl -X GET http://localhost:3333/items \
  -H "Accept: application/json"
```

**JavaScript (Fetch):**
```javascript
fetch('http://localhost:3333/items')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Plástico",
    "image_url": "http://192.168.0.6:3333/uploads/plastico.png"
  },
  {
    "id": 2,
    "title": "Papel",
    "image_url": "http://192.168.0.6:3333/uploads/papel.png"
  },
  {
    "id": 3,
    "title": "Vidro",
    "image_url": "http://192.168.0.6:3333/uploads/vidro.png"
  },
  {
    "id": 4,
    "title": "Metais",
    "image_url": "http://192.168.0.6:3333/uploads/metais.png"
  },
  {
    "id": 5,
    "title": "Eletrônicos",
    "image_url": "http://192.168.0.6:3333/uploads/eletronicos.png"
  },
  {
    "id": 6,
    "title": "Orgânicos",
    "image_url": "http://192.168.0.6:3333/uploads/organicos.png"
  }
]
```

---

## 🗺️ Points Endpoints

### 1. Listar Pontos com Filtros

**Descrição:** Lista pontos de coleta filtrados por cidade, estado e tipos de itens.

```http
GET {{base_url}}/points?city=Fortaleza&uf=CE&items=1,2,3 HTTP/1.1
Host: localhost:3333
Accept: application/json
```

**Parâmetros Query:**
- `city` (obrigatório): Nome da cidade
- `uf` (obrigatório): Sigla do estado (2 caracteres)
- `items` (obrigatório): IDs dos itens separados por vírgula

**cURL:**
```bash
curl -X GET "http://localhost:3333/points?city=Fortaleza&uf=CE&items=1,2,3" \
  -H "Accept: application/json"
```

**JavaScript (Fetch):**
```javascript
const params = new URLSearchParams({
  city: 'Fortaleza',
  uf: 'CE',
  items: '1,2,3'
});

fetch(`http://localhost:3333/points?${params}`)
  .then(response => response.json())
  .then(data => console.log(data));
```

**JavaScript (Axios):**
```javascript
axios.get('http://localhost:3333/points', {
  params: {
    city: 'Fortaleza',
    uf: 'CE',
    items: '1,2,3'
  }
})
.then(response => console.log(response.data));
```

**Resposta (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Ponto Ecológico Centro",
    "email": "contato@ponto.com",
    "whatsapp": "85988776655",
    "latitude": -3.7319,
    "longitude": -38.5267,
    "city": "Fortaleza",
    "uf": "CE",
    "image": "ponto1.png",
    "image_url": "http://192.168.0.6:3333/uploads/ponto1.png",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": 2,
    "name": "Cooperativa Sustentável",
    "email": "contato@sustentavel.com",
    "whatsapp": "85987654321",
    "latitude": -3.7384,
    "longitude": -38.5432,
    "city": "Fortaleza",
    "uf": "CE",
    "image": "ponto2.png",
    "image_url": "http://192.168.0.6:3333/uploads/ponto2.png",
    "created_at": "2024-01-20T14:22:00.000Z"
  }
]
```

**Códigos de Erro:**
```json
// 400 - Parâmetros inválidos ou faltando
{
  "message": "Invalid query parameters"
}

// 500 - Erro interno
{
  "message": "Internal server error"
}
```

---

### 2. Obter Detalhes de um Ponto

**Descrição:** Obtém informações completas de um ponto específico, incluindo os itens que aceita.

```http
GET {{base_url}}/points/1 HTTP/1.1
Host: localhost:3333
Accept: application/json
```

**Parâmetros Path:**
- `id` (obrigatório): ID do ponto de coleta

**cURL:**
```bash
curl -X GET http://localhost:3333/points/1 \
  -H "Accept: application/json"
```

**JavaScript (Fetch):**
```javascript
fetch('http://localhost:3333/points/1')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Resposta (200 OK):**
```json
{
  "point": {
    "id": 1,
    "name": "Ponto Ecológico Centro",
    "email": "contato@ponto.com",
    "whatsapp": "85988776655",
    "latitude": -3.7319,
    "longitude": -38.5267,
    "city": "Fortaleza",
    "uf": "CE",
    "image": "ponto1.png",
    "image_url": "http://192.168.0.6:3333/uploads/ponto1.png",
    "created_at": "2024-01-15T10:30:00.000Z"
  },
  "items": [
    {
      "title": "Plástico"
    },
    {
      "title": "Papel"
    },
    {
      "title": "Vidro"
    }
  ]
}
```

**Códigos de Erro:**
```json
// 400 - Ponto não encontrado
{
  "message": "Point not found"
}
```

---

### 3. Criar Novo Ponto de Coleta

**Descrição:** Cria um novo ponto de coleta com imagem, localização e itens aceitos.

```http
POST {{base_url}}/points HTTP/1.1
Host: localhost:3333
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary

------WebKitFormBoundary
Content-Disposition: form-data; name="name"

Ponto Ecológico Centro
------WebKitFormBoundary
Content-Disposition: form-data; name="email"

contato@ponto.com
------WebKitFormBoundary
Content-Disposition: form-data; name="whatsapp"

85988776655
------WebKitFormBoundary
Content-Disposition: form-data; name="latitude"

-3.7319
------WebKitFormBoundary
Content-Disposition: form-data; name="longitude"

-38.5267
------WebKitFormBoundary
Content-Disposition: form-data; name="city"

Fortaleza
------WebKitFormBoundary
Content-Disposition: form-data; name="uf"

CE
------WebKitFormBoundary
Content-Disposition: form-data; name="items"

1,2,3
------WebKitFormBoundary
Content-Disposition: form-data; name="image"; filename="ponto.png"
Content-Type: image/png

[arquivo binário]
------WebKitFormBoundary--
```

**Campos Obrigatórios:**
| Campo | Tipo | Descrição | Exemplo |
|-------|------|-----------|---------|
| name | string | Nome do ponto | `Ponto Ecológico Centro` |
| email | string (email) | Email de contato | `contato@ponto.com` |
| whatsapp | string | Número WhatsApp | `85988776655` |
| latitude | number | Coordenada latitude | `-3.7319` |
| longitude | number | Coordenada longitude | `-38.5267` |
| city | string | Cidade | `Fortaleza` |
| uf | string (max 2) | Estado | `CE` |
| items | string | IDs dos itens (separados por vírgula) | `1,2,3` |
| image | file (opcional) | Imagem do ponto | arquivo.png |

**cURL:**
```bash
curl -X POST http://localhost:3333/points \
  -F "name=Ponto Ecológico Centro" \
  -F "email=contato@ponto.com" \
  -F "whatsapp=85988776655" \
  -F "latitude=-3.7319" \
  -F "longitude=-38.5267" \
  -F "city=Fortaleza" \
  -F "uf=CE" \
  -F "items=1,2,3" \
  -F "image=@/caminho/para/ponto.png"
```

**JavaScript (Fetch):**
```javascript
const formData = new FormData();
formData.append('name', 'Ponto Ecológico Centro');
formData.append('email', 'contato@ponto.com');
formData.append('whatsapp', '85988776655');
formData.append('latitude', -3.7319);
formData.append('longitude', -38.5267);
formData.append('city', 'Fortaleza');
formData.append('uf', 'CE');
formData.append('items', '1,2,3');
formData.append('image', fileInput.files[0]); // <input type="file" id="fileInput">

fetch('http://localhost:3333/points', {
  method: 'POST',
  body: formData
})
.then(response => response.json())
.then(data => console.log(data));
```

**JavaScript (Axios):**
```javascript
const formData = new FormData();
formData.append('name', 'Ponto Ecológico Centro');
formData.append('email', 'contato@ponto.com');
formData.append('whatsapp', '85988776655');
formData.append('latitude', -3.7319);
formData.append('longitude', -38.5267);
formData.append('city', 'Fortaleza');
formData.append('uf', 'CE');
formData.append('items', '1,2,3');
formData.append('image', fileInput.files[0]);

axios.post('http://localhost:3333/points', formData, {
  headers: {
    'Content-Type': 'multipart/form-data'
  }
})
.then(response => console.log(response.data));
```

**Python (Requests):**
```python
import requests

files = {'image': open('ponto.png', 'rb')}
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

**Resposta (201 Created):**
```json
{
  "id": 5,
  "message": "Ponto de coleta criado com sucesso"
}
```

**Erros Comuns (400 Bad Request):**

Email inválido:
```json
{
  "message": "Invalid email format"
}
```

Campos faltando:
```json
{
  "message": "Missing required field: name",
  "field": "name"
}
```

UF com mais de 2 caracteres:
```json
{
  "message": "UF must be exactly 2 characters"
}
```

---

## 🧪 Testando com Postman

### 1. Importar Collection

Copie o JSON abaixo e importe em Postman:

```json
{
  "info": {
    "name": "MeAlzheimer API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Items",
      "item": [
        {
          "name": "List Items",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/items",
              "host": ["{{base_url}}"],
              "path": ["items"]
            }
          }
        }
      ]
    },
    {
      "name": "Points",
      "item": [
        {
          "name": "List Points",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/points?city=Fortaleza&uf=CE&items=1,2,3",
              "host": ["{{base_url}}"],
              "path": ["points"],
              "query": [
                {"key": "city", "value": "Fortaleza"},
                {"key": "uf", "value": "CE"},
                {"key": "items", "value": "1,2,3"}
              ]
            }
          }
        },
        {
          "name": "Get Point Detail",
          "request": {
            "method": "GET",
            "url": {
              "raw": "{{base_url}}/points/1",
              "host": ["{{base_url}}"],
              "path": ["points", "1"]
            }
          }
        },
        {
          "name": "Create Point",
          "request": {
            "method": "POST",
            "url": {
              "raw": "{{base_url}}/points",
              "host": ["{{base_url}}"],
              "path": ["points"]
            },
            "body": {
              "mode": "formdata",
              "formdata": [
                {"key": "name", "value": "Ponto Ecológico Centro", "type": "text"},
                {"key": "email", "value": "contato@ponto.com", "type": "text"},
                {"key": "whatsapp", "value": "85988776655", "type": "text"},
                {"key": "latitude", "value": "-3.7319", "type": "text"},
                {"key": "longitude", "value": "-38.5267", "type": "text"},
                {"key": "city", "value": "Fortaleza", "type": "text"},
                {"key": "uf", "value": "CE", "type": "text"},
                {"key": "items", "value": "1,2,3", "type": "text"},
                {"key": "image", "type": "file"}
              ]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {"key": "base_url", "value": "http://localhost:3333"}
  ]
}
```

### 2. Configurar Variáveis de Ambiente

No Postman:
1. Clique em "Manage Environments" (engrenagem)
2. Crie novo environment: `MeAlzheimer Dev`
3. Adicione variáveis:
   - `base_url`: `http://localhost:3333`
   - `base_url_network`: `http://192.168.0.6:3333`

---

## 📊 Fluxos de Uso Comuns

### Fluxo 1: Buscar Pontos por Interesse

```
1. GET /items
   ↓ (obtém IDs dos itens interessantes)
2. GET /points?city=Fortaleza&uf=CE&items=1,2,3
   ↓ (obtém lista de pontos)
3. GET /points/{id}
   ↓ (obtém detalhes específicos)
```

### Fluxo 2: Criar Novo Ponto

```
1. POST /points
   ├─ Enviar dados do ponto
   ├─ Enviar imagem
   ├─ Especificar itens aceitos
   └─ Retorna ID do novo ponto
2. GET /points/{id}
   └─ (verificar ponto criado)
```

---

## ⚠️ Códigos de Status HTTP

| Código | Descrição |
|--------|-----------|
| `200` | OK - Requisição bem-sucedida |
| `201` | Created - Recurso criado com sucesso |
| `400` | Bad Request - Dados inválidos |
| `404` | Not Found - Recurso não encontrado |
| `500` | Internal Server Error - Erro no servidor |

---

## 💡 Dicas

1. **Testar Imagens:** Use imagens PNG ou JPG menores de 5MB
2. **Coordenadas:** Obtenha latitude/longitude do Google Maps
3. **WhatsApp:** Use números sem formatação especial
4. **Items Separados:** Use vírgula sem espaços: `1,2,3` (não `1, 2, 3`)
5. **Documentação Interativa:** Acesse `/api-docs` para teste ao vivo

---

## 🔗 Referências

- [Documentação Swagger](/api-docs)
- [README](./README.md)
- [Express.js Docs](https://expressjs.com/)
- [Knex.js Docs](https://knexjs.org/)
