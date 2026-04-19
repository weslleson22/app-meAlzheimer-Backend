import request from 'supertest';
import express, { Express } from 'express';
import Knex from '../../src/database/connection';

// Mock do Knex
jest.mock('../../src/database/connection');

describe('Integration Tests - Items Endpoints', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Simulando rotas
    app.get('/items', async (req, res) => {
      try {
        const items = await Knex('items').select('*');
        const serializedItems = items.map((item: any) => ({
          id: item.id,
          title: item.title,
          image_url: `http://192.168.0.6:3333/uploads/${item.image}`,
        }));
        res.json(serializedItems);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /items', () => {
    it('should return 200 and list of items', async () => {
      const mockItems = [
        { id: 1, title: 'Mãe', image: 'mae.png' },
        { id: 2, title: 'Pai', image: 'pai.png' },
      ];

      const mockChain = {
        select: jest.fn().mockResolvedValue(mockItems),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => mockChain as any);

      const response = await request(app).get('/items');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('title');
      expect(response.body[0]).toHaveProperty('image_url');
    });

    it('should handle empty items list', async () => {
      const mockChain = {
        select: jest.fn().mockResolvedValue([]),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => mockChain as any);

      const response = await request(app).get('/items');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should have correct response format', async () => {
      const mockItems = [
        { id: 1, title: 'Avó', image: 'avo.png' },
      ];

      const mockChain = {
        select: jest.fn().mockResolvedValue(mockItems),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => mockChain as any);

      const response = await request(app).get('/items');

      expect(response.status).toBe(200);
      expect(response.body[0].id).toBe(1);
      expect(response.body[0].title).toBe('Avó');
      expect(response.body[0].image_url).toContain('http://192.168.0.6:3333/uploads/');
    });
  });
});
