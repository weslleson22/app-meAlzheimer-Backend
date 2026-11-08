import request from 'supertest';
import app from '../../src/app';
import Knex from '../../src/database/connection';

jest.mock('../../src/database/connection');

describe('Integration Tests - Items Endpoints', () => {
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

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(
        () => mockChain as unknown as ReturnType<typeof Knex>
      );

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

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(
        () => mockChain as unknown as ReturnType<typeof Knex>
      );

      const response = await request(app).get('/items');

      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('should have correct response format', async () => {
      const mockItems = [{ id: 1, title: 'Avó', image: 'avo.png' }];

      const mockChain = {
        select: jest.fn().mockResolvedValue(mockItems),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(
        () => mockChain as unknown as ReturnType<typeof Knex>
      );

      const response = await request(app).get('/items');

      expect(response.status).toBe(200);
      expect(response.body[0].id).toBe(1);
      expect(response.body[0].title).toBe('Avó');
      expect(response.body[0].image_url).toContain('http://192.168.0.6:3333/uploads/');
    });
  });
});

