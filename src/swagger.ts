import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'MeAlzheimer Backend API',
      version: '1.0.0',
      description: 'API para gerenciamento de famílias e categorias de parentesco com integração de conscientização sobre Alzheimer',
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
              description: 'ID único da categoria de família',
              example: 1,
            },
            title: {
              type: 'string',
              description: 'Nome da categoria de parentesco',
              example: 'Mãe',
            },
            image: {
              type: 'string',
              description: 'Nome do arquivo de imagem da categoria',
              example: 'mae.png',
            },
            image_url: {
              type: 'string',
              description: 'URL completa da imagem da categoria',
              example: 'http://192.168.0.6:3333/uploads/mae.png',
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
              description: 'ID único da localização da família',
              example: 1,
            },
            name: {
              type: 'string',
              description: 'Nome da família',
              example: 'Família Silva',
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Email de contato da família',
              example: 'contato@familia.com',
            },
            whatsapp: {
              type: 'string',
              description: 'Número de WhatsApp da família',
              example: '85988776655',
            },
            latitude: {
              type: 'number',
              format: 'double',
              description: 'Latitude da localização da família',
              example: -3.7319,
            },
            longitude: {
              type: 'number',
              format: 'double',
              description: 'Longitude da localização da família',
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
              description: 'Nome do arquivo de imagem da família',
              example: 'familia1.png',
            },
            image_url: {
              type: 'string',
              description: 'URL completa da imagem da família',
              example: 'http://192.168.0.6:3333/uploads/familia1.png',
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
                    example: 'Mãe',
                  },
                },
              },
              description: 'Lista de categorias de parentesco relacionadas à família',
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
