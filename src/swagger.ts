import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MeAlzheimer Backend API',
      version: '1.0.0',
      description: 'API para gerenciamento de pontos de coleta de itens recicláveis e conscientização sobre Alzheimer',
      contact: {
        name: 'Seu Nome',
        email: 'seu.email@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3333',
        description: 'Servidor de desenvolvimento',
      },
      {
        url: 'http://192.168.0.6:3333',
        description: 'Servidor local da rede',
      },
    ],
    components: {
      schemas: {
        Item: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do item',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Nome/título do item',
              example: 'Plástico',
            },
            image: {
              type: 'string',
              description: 'Nome do arquivo de imagem',
              example: 'plastico.png',
            },
            image_url: {
              type: 'string',
              description: 'URL completa da imagem do item',
              example: 'http://192.168.0.6:3333/uploads/plastico.png',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
          },
          required: ['id', 'title'],
        },
        Point: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'ID único do ponto de coleta',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'Nome do ponto de coleta',
              example: 'Ponto Ecológico Centro',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de contato',
              example: 'contato@ponto.com',
            },
            whatsapp: {
              type: 'string',
              description: 'Número de WhatsApp',
              example: '85988776655',
            },
            latitude: {
              type: 'number',
              format: 'double',
              description: 'Latitude da localização',
              example: -3.7319,
            },
            longitude: {
              type: 'number',
              format: 'double',
              description: 'Longitude da localização',
              example: -38.5267,
            },
            city: {
              type: 'string',
              description: 'Cidade',
              example: 'Fortaleza',
            },
            uf: {
              type: 'string',
              minLength: 2,
              maxLength: 2,
              description: 'Estado (UF)',
              example: 'CE',
            },
            image: {
              type: 'string',
              description: 'Nome do arquivo de imagem',
              example: 'ponto1.png',
            },
            image_url: {
              type: 'string',
              description: 'URL completa da imagem do ponto',
              example: 'http://192.168.0.6:3333/uploads/ponto1.png',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação',
            },
          },
          required: ['id', 'name', 'email', 'whatsapp', 'latitude', 'longitude', 'city', 'uf'],
        },
        PointDetail: {
          type: 'object',
          properties: {
            point: {
              $ref: '#/components/schemas/Point',
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  title: {
                    type: 'string',
                    example: 'Plástico',
                  },
                },
              },
              description: 'Lista de itens aceitos no ponto',
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Mensagem de erro',
            },
          },
        },
      },
    },
  },
  apis: [],
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
