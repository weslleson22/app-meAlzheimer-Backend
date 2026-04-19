import request from 'supertest';
import express, { Express } from 'express';
import Knex from '../../src/database/connection';

jest.mock('../../src/database/connection');

describe('Integration Tests - Points Endpoints', () => {
  let app: Express;

  beforeAll(() => {
    app = express();
    app.use(express.json());

    // Simulando rota GET /points
    app.get('/points', async (req, res) => {
      try {
        const { city, uf, items } = req.query;

        if (!city || !uf || !items) {
          return res.status(400).json({ message: 'Missing required parameters' });
        }

        const parsedItems = String(items)
          .split(',')
          .map((item) => Number(item.trim()));

        const points = await Knex('points')
          .join('point_items', 'points.id', '=', 'point_items.point_id')
          .whereIn('point_items.item_id', parsedItems)
          .where('city', String(city))
          .where('uf', String(uf))
          .distinct()
          .select('points.*');

        const serializedPoints = points.map((point: any) => ({
          ...point,
          image_url: `http://192.168.0.6:3333/uploads/${point.image}`,
        }));

        res.json(serializedPoints);
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });

    // Simulando rota GET /points/:id
    app.get('/points/:id', async (req, res) => {
      try {
        const { id } = req.params;
        const point = await Knex('points').where('id', id).first();

        if (!point) {
          return res.status(400).json({ message: 'Point not found' });
        }

        const items = await Knex('items')
          .join('point_items', 'items.id', '=', 'point_items.item_id')
          .where('point_items.point_id', id)
          .select('items.title');

        const serializedPoint = {
          ...point,
          image_url: `http://192.168.0.6:3333/uploads/${point.image}`,
        };

        res.json({ point: serializedPoint, items });
      } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
      }
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /points', () => {
    it('should return 200 and list of filtered points', async () => {
      const mockPoints = [
        {
          id: 1,
          name: 'Família Silva',
          email: 'contato@familia.com',
          city: 'Fortaleza',
          uf: 'CE',
          image: 'familia1.png',
        },
      ];

      const mockChain = {
        join: jest.fn().mockReturnThis(),
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockPoints),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => mockChain as any);

      const response = await request(app).get('/points?city=Fortaleza&uf=CE&items=1,2,3');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Família Silva');
    });

    it('should return 400 when missing query parameters', async () => {
      const response = await request(app).get('/points');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle empty results', async () => {
      const mockChain = {
        join: jest.fn().mockReturnThis(),
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([]),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => mockChain as any);

      const response = await request(app).get('/points?city=UnknownCity&uf=XX&items=999');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should add image_url to each point', async () => {
      const mockPoints = [
        {
          id: 1,
          name: 'Família Silva',
          image: 'familia1.png',
          city: 'Fortaleza',
          uf: 'CE',
        },
      ];

      const mockChain = {
        join: jest.fn().mockReturnThis(),
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockPoints),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => mockChain as any);

      const response = await request(app).get('/points?city=Fortaleza&uf=CE&items=1,2');

      expect(response.status).toBe(200);
      expect(response.body[0]).toHaveProperty('image_url');
      expect(response.body[0].image_url).toContain('http://192.168.0.6:3333/uploads/');
    });
  });

  describe('GET /points/:id', () => {
    it('should return 200 and point details', async () => {
      const mockPoint = {
        id: 1,
        name: 'Família Silva',
        email: 'contato@familia.com',
        image: 'familia1.png',
      };

      const mockItems = [{ title: 'Mãe' }, { title: 'Pai' }];

      const mockChain = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockPoint),
      };

      const mockItemsChain = {
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockItems),
      };

      let callCount = 0;
      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => {
        callCount++;
        return callCount === 1 ? (mockChain as any) : (mockItemsChain as any);
      });

      const response = await request(app).get('/points/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('point');
      expect(response.body).toHaveProperty('items');
      expect(response.body.point.name).toBe('Família Silva');
    });

    it('should return 400 when point not found', async () => {
      const mockChain = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => mockChain as any);

      const response = await request(app).get('/points/999');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
    });

    it('should include items array in response', async () => {
      const mockPoint = {
        id: 1,
        name: 'Família Silva',
        image: 'familia1.png',
      };

      const mockItems = [
        { title: 'Mãe' },
        { title: 'Pai' },
        { title: 'Primo' },
      ];

      const mockChain = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockPoint),
      };

      const mockItemsChain = {
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue(mockItems),
      };

      let callCount = 0;
      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => {
        callCount++;
        return callCount === 1 ? (mockChain as any) : (mockItemsChain as any);
      });

      const response = await request(app).get('/points/1');

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(3);
      expect(response.body.items[0]).toHaveProperty('title');
    });
  });
});
