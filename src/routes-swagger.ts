/**
 * @swagger
 * /items:
 *   get:
 *     summary: Lista todas as categorias de parentesco disponíveis
 *     description: Retorna uma lista de todas as categorias de parentesco usadas para identificar membros de famílias
 *     tags:
 *       - Items
 *     responses:
 *       200:
 *         description: Lista de categorias obtida com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *             example:
 *               - id: 1
 *                 title: "Mãe"
 *                 image_url: "http://192.168.0.6:3333/uploads/mae.png"
 *               - id: 2
 *                 title: "Pai"
 *                 image_url: "http://192.168.0.6:3333/uploads/pai.png"
 *               - id: 3
 *                 title: "Primo"
 *                 image_url: "http://192.168.0.6:3333/uploads/primo.png"
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
 *     summary: Lista localizações de família com filtros
 *     description: Retorna localizações de família filtradas por cidade, estado e categorias de parentesco
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
 *         description: IDs das categorias de parentesco separados por vírgula
 *         required: true
 *         schema:
 *           type: string
 *         example: "1,2,3"
 *     responses:
 *       200:
 *         description: Localizações de família encontradas com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Point'
 *             example:
 *               - id: 1
 *                 name: "Família Silva"
 *                 email: "contato@familia.com"
 *                 whatsapp: "85988776655"
 *                 latitude: -3.7319
 *                 longitude: -38.5267
 *                 city: "Fortaleza"
 *                 uf: "CE"
 *                 image_url: "http://192.168.0.6:3333/uploads/familia1.png"
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
 *     summary: Cria uma nova localização de família
 *     description: Cria uma localização de família com informações de contato e localização. Aceita upload de imagem.
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
 *                 description: Nome da família
 *                 example: "Família Silva"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Email de contato da família
 *                 example: "contato@familia.com"
 *               whatsapp:
 *                 type: string
 *                 description: Número de WhatsApp para contato
 *                 example: "85988776655"
 *               latitude:
 *                 type: number
 *                 format: double
 *                 description: Latitude da localização da família
 *                 example: -3.7319
 *               longitude:
 *                 type: number
 *                 format: double
 *                 description: Longitude da localização da família
 *                 example: -38.5267
 *               city:
 *                 type: string
 *                 description: Cidade onde a família está localizada
 *                 example: "Fortaleza"
 *               uf:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 2
 *                 description: Sigla do estado (2 caracteres)
 *                 example: "CE"
 *               items:
 *                 type: string
 *                 description: IDs das categorias de parentesco associadas, separados por vírgula
 *                 example: "1,2,3"
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Imagem de identificação da família
 *     responses:
 *       201:
 *         description: Localização da família criada com sucesso
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
 *                   example: "Localização da família criada com sucesso"
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
 *     summary: Obtém detalhes de uma família específica
 *     description: Retorna informações detalhadas de uma localização de família, incluindo categorias de parentesco associadas
 *     tags:
 *       - Points
 *     parameters:
 *       - name: id
 *         in: path
 *         description: ID da família
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Detalhes da família obtidos com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PointDetail'
 *             example:
 *               point:
 *                 id: 1
 *                 name: "Família Silva"
 *                 email: "contato@familia.com"
 *                 whatsapp: "85988776655"
 *                 latitude: -3.7319
 *                 longitude: -38.5267
 *                 city: "Fortaleza"
 *                 uf: "CE"
 *                 image_url: "http://192.168.0.6:3333/uploads/familia1.png"
 *               items:
 *                 - title: "Mãe"
 *                 - title: "Pai"
 *                 - title: "Primo"
 *       400:
 *         description: Família não encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Family not found"
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
