# 🧪 Testes do Backend MeAlzheimer

## 📋 Visão Geral

Este documento descreve a estrutura de testes implementada no backend MeAlzheimer, incluindo testes unitários, testes de integração e validação de estética de código.

## 🏗️ Estrutura de Testes

```
tests/
├── unit/
│   ├── ItemsController.spec.ts       # Testes unitários do ItemsController
│   ├── PointsController.spec.ts      # Testes unitários do PointsController
│   └── codeStyle.spec.ts             # Testes de estética e padrão de código
└── integration/
    ├── items.integration.spec.ts     # Testes de integração para /items
    └── points.integration.spec.ts    # Testes de integração para /points
```

## 🧩 Testes Unitários

### ItemsController.spec.ts

Testa a lógica isolada do `ItemsController`:

#### Casos de Teste

| Teste | Descrição | Status |
|-------|-----------|--------|
| `should return a list of items with correct format` | Verifica se os itens são retornados com o formato correto | ✅ |
| `should handle empty items list` | Testa comportamento com lista vazia | ✅ |
| `should map item properties correctly` | Verifica se as propriedades são mapeadas corretamente | ✅ |

**Exemplo:**
```bash
npm run test:unit -- ItemsController.spec.ts
```

### PointsController.spec.ts

Testa a lógica isolada do `PointsController`:

#### Casos de Teste - index()

| Teste | Descrição |
|-------|-----------|
| `should return a filtered list of points` | Valida filtros por cidade, estado e itens |
| `should parse items string correctly` | Verifica parsing de string de IDs |
| `should return empty array when no points found` | Testa resultado vazio |

#### Casos de Teste - show()

| Teste | Descrição |
|-------|-----------|
| `should return point details with items` | Retorna detalhes com categorias |
| `should return 400 when point not found` | Status correto para ponto não encontrado |
| `should add image_url to point` | Verifica construção de URL da imagem |

**Exemplo:**
```bash
npm run test:unit -- PointsController.spec.ts
```

## 🔗 Testes de Integração

### items.integration.spec.ts

Testa os endpoints de itens em contexto integrado:

```bash
npm run test:integration -- items.integration.spec.ts
```

**Endpoints Testados:**
- `GET /items` - Lista todas as categorias
  - ✅ Retorna status 200
  - ✅ Formato de resposta correto
  - ✅ Propriedades obrigatórias presentes
  - ✅ Handles lista vazia

### points.integration.spec.ts

Testa os endpoints de famílias em contexto integrado:

```bash
npm run test:integration -- points.integration.spec.ts
```

**Endpoints Testados:**

#### GET /points
- ✅ Lista filtrada com parâmetros válidos
- ✅ Retorna erro 400 com parâmetros faltando
- ✅ Handles resultados vazios
- ✅ Inclui `image_url` em cada ponto

#### GET /points/:id
- ✅ Retorna detalhes com itens associados
- ✅ Retorna erro 400 quando ponto não existe
- ✅ Inclui array de itens
- ✅ Adiciona `image_url` corretamente

## 🎨 Testes de Estética e Code Style

### codeStyle.spec.ts

Valida conformidade com padrões de codificação:

```bash
npm run test:unit -- codeStyle.spec.ts
```

#### Categorias Testadas

1. **Estrutura de Arquivos**
   - Convenções de nomeação TypeScript
   - Extensões de arquivo corretas
   - Estrutura de diretórios

2. **Padrões de Formatação**
   - Indentação (2 espaços)
   - Single quotes para strings
   - Semicolons nas instruções
   - camelCase para variáveis
   - PascalCase para classes

3. **Melhores Práticas TypeScript**
   - Tipagem de Request/Response
   - Uso de async/await
   - Minimização de uso de `any`

4. **Documentação**
   - JSDoc para métodos públicos
   - Comentários para lógica complexa

5. **Organização de Imports/Exports**
   - Agrupamento lógico de imports
   - Sintaxe consistente de exports

6. **Tratamento de Erros**
   - Try/catch adequado
   - Status HTTP apropriados

7. **Convenções de Nomenclatura**
   - Nomes descritivos
   - Consistência em nomes de funções

## 📊 Executar Testes

### Todos os Testes
```bash
npm test
```

### Testes Unitários Apenas
```bash
npm run test:unit
```

### Testes de Integração Apenas
```bash
npm run test:integration
```

### Com Modo Watch (reexecuta ao salvar)
```bash
npm run test:watch
```

### Com Cobertura de Código
```bash
npm run test:coverage
```

Generates report em `coverage/` com:
- Percentage of lines covered
- Uncovered branches
- HTML visual report

**Exemplo de saída:**
```
Statements   : 85.23% ( 123/144 )
Branches     : 78.45% ( 98/125 )
Functions    : 90.12% ( 112/124 )
Lines        : 86.54% ( 134/155 )
```

## 🔍 Linting e Formatação

### ESLint

Verifica erros de código e padrões:

```bash
npm run lint
```

Corrige automaticamente:
```bash
npm run lint:fix
```

**Regras Configuradas:**
- TypeScript best practices
- Sem `console.log` em produção
- Variáveis não usadas geram erro
- Indentação consistente
- Nomenclatura camelCase

### Prettier

Formata código automaticamente:

```bash
npm run format
```

Verifica sem alterar:
```bash
npm run format:check
```

**Configurações:**
- 2 espaços de indentação
- Single quotes
- Sem trailing commas
- 100 caracteres por linha

## 🔬 Verificação de Tipos

```bash
npm run type-check
```

Verifica tipos TypeScript sem compilar.

## 📈 Cobertura de Testes Esperada

| Componente | Cobertura Target | Status |
|-----------|-----------------|--------|
| Controllers | 90%+ | ✅ |
| Utils | 85%+ | ✅ |
| Validators | 95%+ | ✅ |
| Database Layer | 80%+ | ✅ |
| **Overall** | **85%+** | ✅ |

## 🚀 Pipeline de CI/CD

Recomendado executar antes de commit:

```bash
# 1. Verificar tipos
npm run type-check

# 2. Executar linter
npm run lint

# 3. Formatar código
npm run format

# 4. Executar testes
npm test

# 5. Verificar cobertura
npm run test:coverage
```

**Ou em um comando:**
```bash
npm run type-check && npm run lint && npm test
```

## 📝 Exemplo de Teste Unitário

```typescript
describe('ItemsController', () => {
  let itemsController: ItemsController;

  beforeEach(() => {
    itemsController = new ItemsController();
    jest.clearAllMocks();
  });

  describe('index', () => {
    it('should return a list of items with correct format', async () => {
      // Arrange
      const mockItems = [
        { id: 1, title: 'Mãe', image: 'mae.png' },
      ];
      
      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockItems),
      } as any));

      // Act
      await itemsController.index(mockRequest, mockResponse);

      // Assert
      expect(mockResponse.json).toHaveBeenCalled();
      const result = mockResponse.json.mock.calls[0][0];
      expect(result[0]).toHaveProperty('image_url');
    });
  });
});
```

## 📝 Exemplo de Teste de Integração

```typescript
describe('GET /items', () => {
  it('should return 200 and list of items', async () => {
    const mockItems = [
      { id: 1, title: 'Mãe', image: 'mae.png' },
    ];

    const mockChain = {
      select: jest.fn().mockResolvedValue(mockItems),
    };

    (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(
      () => mockChain as any
    );

    const response = await request(app).get('/items');

    expect(response.status).toBe(200);
    expect(response.body).toHaveLength(1);
  });
});
```

## 🐛 Debugging de Testes

### Executar teste específico
```bash
npm test -- --testNamePattern="should return a list"
```

### Executar com logs detalhados
```bash
npm test -- --verbose
```

### Modo inspect (debug)
```bash
node --inspect-brk ./node_modules/.bin/jest --runInBand
```

## 📚 Recursos

- [Jest Documentation](https://jestjs.io/)
- [Supertest](https://github.com/visionmedia/supertest)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Options](https://prettier.io/docs/en/options.html)
- [TypeScript Testing](https://www.typescriptlang.org/docs/handbook/testing.html)

## ✅ Checklist de Qualidade

Antes de submeter um PR:

- [ ] Todos os testes passam (`npm test`)
- [ ] Cobertura de código >= 85% (`npm run test:coverage`)
- [ ] Sem erros de linting (`npm run lint`)
- [ ] Código formatado corretamente (`npm run format`)
- [ ] Tipos verificados (`npm run type-check`)
- [ ] Não há `console.log` em código de produção
- [ ] Variáveis não usadas foram removidas
- [ ] Comentários atualizados

## 📞 Suporte

Para adicionar novos testes:

1. Crie arquivo em `tests/unit/` ou `tests/integration/`
2. Siga padrão: `ComponentName.spec.ts`
3. Use estrutura: `describe` > `beforeEach` > `it`
4. Rode testes: `npm test`
5. Verifique cobertura: `npm run test:coverage`
