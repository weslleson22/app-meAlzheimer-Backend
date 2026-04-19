/**
 * @swagger
 * /items:
 *   get:
 *     summary: Lista todos os itens disponíveis
 *     description: Retorna uma lista de todos os itens que podem ser coletados
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: Lista de itens obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *             example:
 *               - id: 1
 *                 title: "Plástico"
 *                 image_url: "http://192.168.0.6:3333/uploads/plastico.png"
 *               - id: 2
 *                 title: "Papel"
 *                 image_url: "http://192.168.0.6:3333/uploads/papel.png"
 *               - id: 3
 *                 title: "Vidro"
 *                 image_url: "http://192.168.0.6:3333/uploads/vidro.png"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /points:
 *   get:
 *     summary: Lista pontos de coleta com filtros
 *     description: Retorna pontos de coleta filtrados por cidade, estado e itens aceitos
 *     tags:
 *       - Points
 *     parameters:
 *       - name: city
 *         in: query
 *         description: Nome da cidade para filtrar
 *         required: true
 *         schema:
 *           type: string
 *         example: "Fortaleza"
 *       - name: uf
 *         in: query
 *         description: Sigla do estado (2 caracteres)
 *         required: true
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 2
 *         example: "CE"
 *       - name: items
 *         in: query
 *         description: IDs dos itens separados por vírgula
 *         required: true
 *         schema:
 *           type: string
 *         example: "1,2,3"
 *     responses:
 *       200:
 *         description: Pontos de coleta encontrados com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 *             example:
 *               - id: 1
 *                 name: "Ponto Ecológico Centro"
 *                 email: "contato@ponto.com"
 *                 whatsapp: "85988776655"
 *                 latitude: -3.7319
 *                 longitude: -38.5267
 *                 city: "Fortaleza"
 *                 uf: "CE"
 *                 image_url: "http://192.168.0.6:3333/uploads/ponto1.png"
 *       400:
 *         description: Parâmetros de filtro inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *
 *   post:
 *     summary: Cria um novo ponto de coleta
 *     description: Cria um novo ponto de coleta com informações de localização e contato. Aceita upload de imagem.
 *     tags:
 *       - Points
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - whatsapp
 *               - latitude
 *               - longitude
 *               - city
 *               - uf
 *               - items
 *             properties:
 *               name:
 *                 type: string
 *                 description: Nome do ponto de coleta
 *                 example: "Ponto Ecológico Centro"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de contato
 *                 example: "contato@ponto.com"
 *               whatsapp:
 *                 type: string
 *                 description: Número de WhatsApp para contato
 *                 example: "85988776655"
 *               latitude:
 *                 type: number
 *                 format: double
 *                 description: Latitude da localização do ponto
 *                 example: -3.7319
 *               longitude:
 *                 type: number
 *                 format: double
 *                 description: Longitude da localização do ponto
 *                 example: -38.5267
 *               city:
 *                 type: string
 *                 description: Cidade onde o ponto está localizado
 *                 example: "Fortaleza"
 *               uf:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 description: Sigla do estado (2 caracteres)
 *                 example: "CE"
 *               items:
 *                 type: string
 *                 description: IDs dos itens que são coletados, separados por vírgula
 *                 example: "1,2,3"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagem de identificação do ponto de coleta
 *     responses:
 *       201:
 *         description: Ponto de coleta criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   example: 5
 *                 message:
 *                   type: string
 *                   example: "Ponto de coleta criado com sucesso"
 *       400:
 *         description: Dados inválidos ou faltando campos obrigatórios
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * @swagger
 * /points/{id}:
 *   get:
 *     summary: Obtém detalhes de um ponto de coleta específico
 *     description: Retorna informações detalhadas de um ponto de coleta, incluindo os itens que aceita
 *     tags:
 *       - Points
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID do ponto de coleta
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalhes do ponto obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PointDetail'
 *             example:
 *               point:
 *                 id: 1
 *                 name: "Ponto Ecológico Centro"
 *                 email: "contato@ponto.com"
 *                 whatsapp: "85988776655"
 *                 latitude: -3.7319
 *                 longitude: -38.5267
 *                 city: "Fortaleza"
 *                 uf: "CE"
 *                 image_url: "http://192.168.0.6:3333/uploads/ponto1.png"
 *               items:
 *                 - title: "Plástico"
 *                 - title: "Papel"
 *                 - title: "Vidro"
 *       400:
 *         description: Ponto de coleta não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Point not found"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
