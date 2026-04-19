import PointsController from '../../src/controllers/PointsController';
import Knex from '../../src/database/connection';

jest.mock('../../src/database/connection');

describe('PointsController', () => {
  let pointsController: PointsController;

  beforeEach(() => {
    pointsController = new PointsController();
    jest.clearAllMocks();
  });

  describe('index', () => {
    it('should return a filtered list of points', async () => {
      const mockPoints = [
        {
          id: 1,
          name: 'Família Silva',
          email: 'contato@familia.com',
          whatsapp: '85988776655',
          latitude: -3.7319,
          longitude: -38.5267,
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

      const mockRequest = {
        query: {
          city: 'Fortaleza',
          uf: 'CE',
          items: '1,2,3',
        },
      } as any;

      const mockResponse = {
        json: jest.fn().mockReturnThis(),
      } as any;

      await pointsController.index(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalled();
      const result = mockResponse.json.mock.calls[0][0];

      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Família Silva');
      expect(result[0]).toHaveProperty('image_url');
    });

    it('should parse items string correctly', async () => {
      const mockChain = {
        join: jest.fn().mockReturnThis(),
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([]),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => mockChain as any);

      const mockRequest = {
        query: {
          city: 'Fortaleza',
          uf: 'CE',
          items: '1,2,3',
        },
      } as any;

      const mockResponse = {
        json: jest.fn().mockReturnThis(),
      } as any;

      await pointsController.index(mockRequest, mockResponse);

      // Verify whereIn was called with parsed items
      expect(mockChain.whereIn).toHaveBeenCalled();
      const whereInCall = mockChain.whereIn.mock.calls[0];
      expect(whereInCall[1]).toEqual([1, 2, 3]);
    });

    it('should return empty array when no points found', async () => {
      const mockChain = {
        join: jest.fn().mockReturnThis(),
        whereIn: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        distinct: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([]),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => mockChain as any);

      const mockRequest = {
        query: {
          city: 'UnknownCity',
          uf: 'XX',
          items: '999',
        },
      } as any;

      const mockResponse = {
        json: jest.fn().mockReturnThis(),
      } as any;

      await pointsController.index(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });
  });

  describe('show', () => {
    it('should return point details with items', async () => {
      const mockPoint = {
        id: 1,
        name: 'Família Silva',
        email: 'contato@familia.com',
        city: 'Fortaleza',
        image: 'familia1.png',
      };

      const mockItems = [
        { title: 'Mãe' },
        { title: 'Pai' },
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

      const mockRequest = {
        params: { id: 1 },
      } as any;

      const mockResponse = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as any;

      await pointsController.show(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalled();
      const result = mockResponse.json.mock.calls[0][0];

      expect(result).toHaveProperty('point');
      expect(result).toHaveProperty('items');
      expect(result.point.name).toBe('Família Silva');
    });

    it('should return 400 when point not found', async () => {
      const mockChain = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(null),
      };

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => mockChain as any);

      const mockRequest = {
        params: { id: 999 },
      } as any;

      const mockResponse = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis(),
      } as any;

      await pointsController.show(mockRequest, mockResponse);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Point nor found' });
    });

    it('should add image_url to point', async () => {
      const mockPoint = {
        id: 1,
        name: 'Família Silva',
        image: 'familia1.png',
      };

      const mockChain = {
        where: jest.fn().mockReturnThis(),
        first: jest.fn().mockResolvedValue(mockPoint),
      };

      const mockItemsChain = {
        join: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        select: jest.fn().mockResolvedValue([]),
      };

      let callCount = 0;
      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => {
        callCount++;
        return callCount === 1 ? (mockChain as any) : (mockItemsChain as any);
      });

      const mockRequest = {
        params: { id: 1 },
      } as any;

      const mockResponse = {
        json: jest.fn().mockReturnThis(),
        status: jest.fn().mockReturnThis(),
      } as any;

      await pointsController.show(mockRequest, mockResponse);

      const result = mockResponse.json.mock.calls[0][0];
      expect(result.point.image_url).toBe('http://192.168.0.6:3333/uploads/familia1.png');
    });
  });
});
