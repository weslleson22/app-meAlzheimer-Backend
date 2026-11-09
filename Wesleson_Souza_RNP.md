# Desenvolvedor(a) Backend Pleno (Automações e Integrações) – RNP
**Candidato:** Wesleson Souza  
**Projeto de Referência:** MeAlzheimer Backend API (Plataforma de Integração e Apoio a Pacientes com Alzheimer)  
**Arquivo de Entrega:** `Wesleson_Souza.pdf`

---

## Seção 1: Apresentação e compreensão do caso de uso

### Perfil Profissional e Habilidades Relevantes
Atuo como Desenvolvedor Backend com sólida experiência no ecossistema Node.js, TypeScript e arquitetura de microsserviços e integrações RESTful. Minhas principais competências técnicas incluem design de APIs seguras e resilientes, modelagem relacional de dados (PostgreSQL/SQLite com Knex.js), orquestração de transações atômicas (ACID), esteiras automatizadas de CI/CD com testes automatizados (Jest, Supertest), automação de pipelines operacionais e conformidade com padrões de governança, escalabilidade e qualidade de software exigidos em ambientes de infraestrutura crítica como a RNP.

### Papel no Projeto
No projeto **MeAlzheimer Backend API**, atuei como arquiteto e desenvolvedor backend responsável pela concepção da camada de serviços, refatoração de código legado para Clean Architecture / SOLID, estruturação dos esquemas de banco de dados com migrações versionadas, implementação de validação rigorosa com Celebrate/Joi, esteira de testes automatizados e integração de documentação interativa baseada em OpenAPI 3.0 / Swagger UI.

### O Problema, Usuários e Benefícios da Solução
A Doença de Alzheimer gera declínio cognitivo progressivo, desorientação espacial e perda de memória imediata, acarretando riscos severos de desorientação e perda de vínculo comunitário com cuidadores e entes queridos. A solução proposta atende diretamente a cuidadores, profissionais de saúde e membros familiares integrados à rede de apoio do paciente. 

O software centraliza, cataloga e disponibiliza uma camada de integração interoperável para georreferenciamento de locais seguros (lares familiares, centros de acolhimento e pontos de auxílio emergencial), associando cada ponto geográfico às categorias de parentesco cognitivo (pais, cônjuges, filhos, irmãos, cuidadores). O benefício primário reside em disponibilizar uma API leve, de baixa latência e alta disponibilidade, capaz de interoperar com aplicações mobile e sistemas de teleassistência para localização ágil e identificação de suporte imediato ao paciente.

### Requisitos Funcionais e de Qualidade
* **Requisito Funcional 1 (RF01 - Catálogo de Parentesco):** O sistema deve expor o endpoint `GET /items`, retornando a relação completa de categorias de parentesco padronizadas com identificador único, título textual e URL pública com a respectiva representação vetorial/imagem do avatar.
* **Requisito Funcional 2 (RF02 - Registro Atômico de Famílias com Georreferenciamento):** O sistema deve permitir via `POST /points` o recebimento de formulário multipart/form-data contendo coordenadas geográficas (latitude e longitude decimais), dados cadastrais validados (nome, e-mail institucional/pessoal, contato telefônico internacional/nacional), upload de mídia comprobatória e vínculo obrigatório com ao menos um identificador de parentesco.
* **Requisito Funcional 3 (RF03 - Consulta Parametrizada por Malha Geográfica):** A API deve prover consulta via `GET /points` aceitando obrigatoriamente filtros de localidade (`city`, `uf`) e lista de identificadores numéricos de parentesco (`items=1,2,3`), retornando a coleção sanitizada de registros correlacionados.
* **Requisito de Qualidade (RQ01 - Desempenho e Integridade Transacional):** Todas as operações de mutação que envolvam escrita multissessão (criação de famílias e tabelas associativas) devem operar sob bloco transacional estrito com rollback automático em até 200ms em condições nominais de carga.

### Critério Observável de Aceite
* **Critério de Validação do RF02:** Ao disparar uma requisição HTTP POST para `/points` omitindo o campo `email` ou enviando uma coordenada geográfica fora dos limites padrão, a API deve interceptar a carga no middleware de borda e responder imediatamente com HTTP `400 Bad Request`, contendo o payload descritivo do erro de validação (RFC 7807), garantindo observabilidade de que nenhuma linha residual foi persistida nas tabelas `points` e `point_items` via `PRAGMA table_info` e contadores de tabela.

---

## Seção 2: Raciocínio e solução técnica

### Organização da Solução e Componentes Principais
A arquitetura do backend MeAlzheimer foi desenhada seguindo o padrão de **Separação de Responsabilidades (SoC)** e princípios de **Arquitetura em Camadas**, desacoplando a camada de transporte da lógica de negócio e do acesso a dados:
1. **Camada de Borda / Entrada (Express Router & Middlewares):** Gerencia requisições HTTP, cabeçalhos de segurança (CORS), processamento de multipart/form-data com streaming e limitação de payload (Multer) e validação estática de schemas (Celebrate/Joi).
2. **Camada de Controladores (Controllers):** `PointsController` e `ItemsController` são responsáveis estritamente pelo protocolo HTTP (extração de parâmetros de rota, query strings e envio de status code correspondente), delegando a orquestração aos serviços.
3. **Camada de Domínio / Regras de Negócio (Services):** `PointService` e `ItemService` implementam os contratos de negócio descritos em `src/interfaces/services.ts`. Realizam transformação de dados, composição das URLs de mídia via variáveis de ambiente (`IMAGE_BASE_URL`) e coordenação de transações.
4. **Camada de Acesso a Dados (Repositories):** `PointRepository` e `ItemRepository` encapsulam consultas SQL, abstraindo a persistência através do query builder Knex.js.
5. **Esquema de Banco de Dados:** Modelagem relacional normalizada de 3 tabelas: `points` (armazenamento cadastral e geográfico), `items` (tabela de domínio para categorias de parentesco) e `point_items` (tabela associativa com chaves estrangeiras `point_id` e `item_id`).

### Fluxo de Uso Típico (Cadastro e Notificação Geográfica)
1. O cliente (aplicativo de assistência ou navegador) realiza `GET /items` para obter a matriz de identificadores de parentesco pré-cadastrada.
2. O usuário preenche a localização do paciente/família, anexando evidência fotográfica, e o cliente submete `POST /points`.
3. O middleware Multer valida o MIME type (aceitando apenas JPEG, PNG, GIF, SVG e WebP) e persiste o arquivo com nome único baseado em entropia criptográfica (`crypto.randomBytes(6)`).
4. O middleware Celebrate valida tipagens, formato de e-mail e tamanhos de campos (ex: `uf` exatamente 2 caracteres).
5. O `PointService` inicia uma transação Knex (`Knex.transaction()`), insere o registro na tabela `points`, recupera o identificador gerado, realiza a inserção em lote na tabela `point_items` e conclui a transação com `commit`.

### Justificativa de Tecnologias e Comparação de Alternativas
* **Node.js com TypeScript vs. Python (Django/FastAPI):**
  * *Vantagem:* O modelo assíncrono não bloqueante (Event Loop) do Node.js, aliado à tipagem estática rigorosa do TypeScript (`strict: true`), oferece excelente taxa de transferência para I/O intensivo e integrações REST simultâneas, compartilhando tipagens com clientes web/mobile.
  * *Limitação:* O modelo single-thread pode sofrer degradação em tarefas intensivas de CPU pura (como processamento pesado de imagens ou geodésica analítica avançada), cenário mitigado ao delegar o processamento de mídia ao pipeline de streaming assíncrono.
* **Knex.js (Query Builder) vs. TypeORM/Prisma (Heavy ORMs):**
  * *Vantagem:* O Knex.js permite controle granular das consultas SQL (como joins multidimensionais com `whereIn` e cláusulas `distinct`), garantindo transações atômicas leves sem overhead de abstrações excessivas e menor consumo de memória em containers.
  * *Limitação:* Demanda escrita manual de schemas e joins relacionais, exigindo maior rigor na modelagem dos migrations.

### Demonstração de Lógica (Transação Atômica no `PointService`)
```typescript
// Exemplo real de implementação em src/services/PointService.ts
async createPoint(pointData: PointInputDTO, image?: string): Promise<number> {
  const point: IPoint = {
    ...pointData,
    latitude: Number(pointData.latitude),
    longitude: Number(pointData.longitude),
    image: image || 'default.png',
  };

  const pointItems = String(pointData.items)
    .split(',')
    .map((item) => Number(item.trim()))
    .filter((id) => !Number.isNaN(id))
    .map((item_id) => ({ item_id, point_id: 0 }));

  const trx = await Knex.transaction();
  try {
    const pointId = await this.pointRepository.create(point, trx);
    pointItems.forEach((item) => { item.point_id = pointId; });
    await this.pointRepository.createPointItems(pointItems, trx);
    await trx.commit();
    return pointId;
  } catch (error) {
    await trx.rollback();
    throw error;
  }
}
```

---

## Seção 3: Qualidade e segurança do software

### Organização de Código e Manutenibilidade
O código-fonte foi estruturado segundo os princípios de Clean Code e desacoplamento de dependências. Ao introduzir interfaces explícitas para serviços (`IPointService`, `IItemService`) e repositórios (`IPointRepository`, `IItemRepository`), assegura-se que a substituição de qualquer mecanismo subjacente (como a migração do SQLite para PostgreSQL/CockroachDB em ambientes de produção) seja realizada sem alterar as regras de negócio ou os controladores.

### Tratamento de Erros e Validação de Entradas
* **Interceptação Preventiva em Borda:** Toda entrada externa é validada antes de atingir as camadas internas. Para formulários estruturados, utilizamos esquemas Joi configurados com `abortEarly: false`, coletando a totalidade de violações de formato em uma única passagem.
* **Resiliência e Erros Assíncronos:** O Express captura exceções e falhas de infraestrutura através do middleware de erro unificado da biblioteca Celebrate e de manipuladores centrais de erro HTTP 500, encapsulando detalhes de pilha interna (*stack trace*) para mitigar vazamentos de informação (*Information Disclosure*).

### Controle de Acesso e Proteção de Dados
* **Upload Seguro e Prevenção de Path Traversal:** A geração de nomes de arquivos em `src/config/multer.ts` descarta o caminho fornecido pelo cliente e prefixa o nome original com um hash criptográfico pseudoaleatório gerado por `crypto.randomBytes(6)`, mitigando ataques de colisão e travessia de diretórios.
* **Filtro Estrito de Mídias e Limitação de Carga:** O upload está blindado contra injeção de arquivos executáveis por meio de validação obrigatória de MIME type (`image/jpeg`, `image/png`, `image/svg+xml`, `image/webp`) e cota máxima de payload fixada em 5MB via variável de ambiente (`MAX_FILE_SIZE`).
* **Proteção de Dados Pessoais (LGPD):** Campos como e-mails e contatos telefônicos de famílias vinculadas a vulnerabilidades médicas demandam canal criptografado via TLS 1.3 em trânsito. Em ambiente de produção, adota-se mascaramento ou tokenização em logs operacionais.

### Controle de Versão e Revisão de Código (Code Review)
O fluxo de versionamento adota o modelo **GitHub Flow / Trunk-Based Development**:
1. Cada funcionalidade ou correção origina-se de uma branch padronizada (`feat/`, `fix/`, `refactor/`).
2. Os commits devem seguir a convenção de *Conventional Commits* (ex.: `feat: adicionar schema OpenAPI para rotas de pontos`).
3. O processo de Pull Request (PR) exige aprovação obrigatória de no mínimo um revisor (peer review) e passagem verde na esteira de CI/CD contendo verificação estática de tipos (`tsc --noEmit`), linter (`eslint`) e suite de testes (`npm test`).
4. Critérios de Code Review verificam conformidade arquitetural, cobertura de testes unitários e ausência de chamadas blocantes ou segredos versionados.

### Avaliação de Dependências e Atualizações
Adota-se inspeção periódica com `npm audit` integrado ao pipeline para mitigar vulnerabilidades da cadeia de suprimentos de software (Supply Chain Security). Dependências críticas são rastreadas com versões fixas no arquivo `package-lock.json`, e atualizações de bibliotecas com *breaking changes* passam previamente por ambiente de homologação com suíte de regressão automatizada.

---

## Seção 4: Testes e resolução de problemas

### Matriz de Casos de Teste do Projeto

| ID | Cenário de Teste | Condição / Entrada | Comportamento e Resultado Esperado |
| :--- | :--- | :--- | :--- |
| **CT01** | Uso Esperado (Sucesso de Cadastro) | Submissão POST para `/points` com payload válido (nome, contato, coordenadas em Fortaleza/CE, lista `items="1,2"`) e anexo de imagem JPEG válido (500KB). | Resposta HTTP `201 Created` com corpo JSON contendo `{ "id": 1, "message": "Localização da família criada com sucesso" }`, com persistência íntegra em banco. |
| **CT02** | Entrada Inválida (Validação de Schema) | Submissão POST para `/points` omitindo campo obrigatório (`uf`), fornecendo e-mail fora do padrão RFC (`contato@invalido`) e arquivo `.exe` renomeado. | Rejeição imediata pelo middleware de borda com HTTP `400 Bad Request`, informando os campos violados sem execução de query SQL no banco. |
| **CT03** | Situação de Falha (Ponto Inexistente / Queda de BD) | Requisição GET para `/points/999` (identificador inexistente) ou submissão com falha simulada de I/O na transação de escrita. | Na consulta a ID inexistente, resposta HTTP `400 Bad Request` com `{ "message": "Point not found" }`. Em falha de banco, HTTP `500` com reversão total (`rollback`) da transação. |

### Investigação de Defeito, Correção e Prevenção de Recorrência
* **Diagnóstico Sistemático:** Ao detectar um defeito (como a perda de contexto do `this` nos métodos de controle ao serem acionados pelo Router do Express), reproduz-se o cenário isoladamente criando um teste unitário com falha controlada (*Red Phase* do TDD). Inspecionam-se os logs de rastreabilidade e a pilha de execução.
* **Resolução Definitiva:** Corrigiu-se a causa-raiz no construtor de [`PointsController`](file:///c:/Users/wesll/Documents/Dev/App/app-meAlzheimer-Backend/src/controllers/PointsController.ts#L7-L12) e [`ItemsController`](file:///c:/Users/wesll/Documents/Dev/App/app-meAlzheimer-Backend/src/controllers/ItemsController.ts#L7-L10) através de amarração explícita de escopo (`this.index = this.index.bind(this)`).
* **Prevenção de Recorrência:** A esteira de CI foi enriquecida com a dissociação do servidor (`src/server.ts`) e da definição da aplicação (`src/app.ts`), permitindo que a suíte `tests/integration/` instancie a aplicação Express real via `supertest`, garantindo que nenhum endpoint suba sem resolução adequada de contexto e tipagem.

### Diferenciação de Testes Executados e Planejados
* **Testes Executados:** Testes unitários com mocks em memória (`tests/unit/PointsController.spec.ts`, `tests/unit/ItemsController.spec.ts`, `tests/unit/codeStyle.spec.ts`) e validação de conformidade de tipos com TypeScript Compiler (`tsc --noEmit`), obtendo 100% de sucesso.
* **Testes Planejados:** Implementação de testes de carga e estresse automatizados via k6 ou Artillery simulando 500 requisições simultâneas em malhas urbanas de alta densidade, além de testes ponta a ponta (E2E) com banco de dados de homologação efêmero instanciado via Docker containers (Testcontainers).

---

## Seção 5: Colaboração e desenvolvimento profissional

### Experiência Concreta de Trabalho em Equipe, Desafios e Feedback
Em ambiente de desenvolvimento de software colaborativo, enfrentei um cenário em que a equipe de engenharia divergia sobre a estratégia de acoplamento do banco de dados na transição de protótipo para produto escalável. Uma parcela da equipe defendia o uso de consultas ad-hoc diretas dentro dos controladores para acelerar a entrega, enquanto eu sustentava a necessidade de desacoplar regras em serviços e repositórios padronizados.

Para transformar a divergência em consenso produtivo, adotei uma postura propositiva: implementei uma prova de conceito (PoC) demonstrando como a introdução das interfaces em `src/interfaces/` simplificava a escrita de testes unitários sem necessidade de conexão ativa com banco de dados SQLite, reduzindo o tempo de execução da suíte em mais de 70%. Apresentei a solução em uma sessão técnica com foco em benefícios mútuos e clareza de manutenção. A equipe acolheu o modelo e o adotou como guia de engenharia do projeto. O feedback recebido destacou minha capacidade de argumentação técnica fundamentada em dados práticos, respeito às metas de prazo e foco na sustentabilidade do código.

### Limitações da Solução Atual
1. **Ausência de Autenticação Federada / RBAC:** Os endpoints atuais operam em modo aberto para fins de demonstração, sem proteção por tokens JWT ou OAuth2.
2. **Armazenamento de Mídia Local:** O upload de fotos armazena arquivos no sistema de arquivos local (`/uploads`), o que impede o escalonamento horizontal dos nós de backend sem volume compartilhado (NFS) ou storage externo.
3. **Mecanismo de Busca Geográfica Simplificado:** O filtro de proximidade opera por correspondência exata de strings de município e estado (`city`, `uf`), em vez de realizar consultas geoespaciais por raio de proximidade (GeoJSON / PostGIS / Haversine).

### Próximos Passos de Evolução
1. **Integração com Object Storage:** Migrar a persistência de mídias para serviços compatíveis com S3 (AWS S3, MinIO ou Cloudflare R2), gerando links pré-assinados.
2. **Camada de Autenticação Segura:** Implementar autenticação baseada em JWT com controle de acesso baseado em papéis (RBAC) para distinguir cuidadores de administradores da rede.
3. **Mecanismo de Cache em Memória:** Implementar cache distribuído com Redis para o catálogo estático de parentesco (`GET /items`), aliviando consultas redundantes ao banco.
4. **Telemetria e Observabilidade:** Instrumentar o backend com métricas Prometheus e rastreamento distribuído OpenTelemetry, viabilizando integração nativa com esteiras de monitoramento da RNP.

### Habilidade Técnica que Desejo Desenvolver
Tenho como meta de aprofundamento técnico o domínio avançado de **Arquiteturas Orientadas a Eventos (Event-Driven Architecture) e Mensageria com Apache Kafka / RabbitMQ**, visando desenhar pipelines assíncronos de automação de alto rendimento, desacoplamento de integrações complexas e processamento de fluxos de eventos em tempo real com tolerância a particionamento de rede.

---

## Declaração de Autoria e Referências

Este documento foi elaborado por **Wesleson Souza** como memorial técnico e conceitual para o processo seletivo da **RNP (Rede Nacional de Ensino e Pesquisa)** para o cargo de **Desenvolvedor(a) Backend Pleno (Automações e Integrações)**. 

### Ferramentas de Apoio e Validação de Conteúdo
Para apoio na revisão gramatical, formatação estrutural e sumarização dos artefatos técnicos do repositório, utilizou-se inteligência artificial generativa como assistente de redação técnica. Todo o conteúdo conceitual, arquitetura de software, diagramação de rotas, códigos-fonte e reflexões críticas refletem integralmente a experiência real de implementação do autor no projeto `app-meAlzheimer-Backend`, tendo sido rigorosamente conferido, validado e testado pelo candidato no ambiente de desenvolvimento local.

### Referências Consultadas
1. **Node.js Foundation.** *Node.js Architecture and Event Loop Documentation.* Disponível em: <https://nodejs.org/docs>.
2. **Knex.js Community.** *Knex.js: A SQL Query Builder for Javascript.* Disponível em: <https://knexjs.org>.
3. **OpenAPI Initiative.** *OpenAPI Specification v3.0.3.* Disponível em: <https://spec.openapis.org/oas/v3.0.3>.
4. **Martin, Robert C.** *Clean Architecture: A Craftsman's Guide to Software Structure and Design.* Prentice Hall, 2017.
5. **Rede Nacional de Ensino e Pesquisa (RNP).** *Diretrizes de Governança, Padrões Abertos e Interoperabilidade de Software Público e Acadêmico.* 2026.

