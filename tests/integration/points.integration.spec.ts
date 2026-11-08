import request from 'supertest';
import app from '../../src/app';
import Knex from '../../src/database/connection';

jest.mock('../../src/database/connection');

describe('Integration Tests - Points Endpoints', () => {
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

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(
        () => mockChain as unknown as ReturnType<typeof Knex>
      );

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

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(
        () => mockChain as unknown as ReturnType<typeof Knex>
      );

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

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(
        () => mockChain as unknown as ReturnType<typeof Knex>
      );

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
        return (callCount === 1 ? mockChain : mockItemsChain) as unknown as ReturnType<typeof Knex>;
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

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(
        () => mockChain as unknown as ReturnType<typeof Knex>
      );

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

      const mockItems = [{ title: 'Mãe' }, { title: 'Pai' }, { title: 'Primo' }];

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
        return (callCount === 1 ? mockChain : mockItemsChain) as unknown as ReturnType<typeof Knex>;
      });

      const response = await request(app).get('/points/1');

      expect(response.status).toBe(200);
      expect(response.body.items).toHaveLength(3);
      expect(response.body.items[0]).toHaveProperty('title');
    });
  });
});

