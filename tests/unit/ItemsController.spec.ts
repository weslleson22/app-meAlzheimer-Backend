import ItemsController from '../../src/controllers/ItemsController';
import Knex from '../../src/database/connection';

jest.mock('../../src/database/connection');

describe('ItemsController', () => {
  let itemsController: ItemsController;

  beforeEach(() => {
    itemsController = new ItemsController();
    jest.clearAllMocks();
  });

  describe('index', () => {
    it('should return a list of items with correct format', async () => {
      const mockItems = [
        { id: 1, title: 'Mãe', image: 'mae.png' },
        { id: 2, title: 'Pai', image: 'pai.png' },
        { id: 3, title: 'Primo', image: 'primo.png' },
      ];

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockItems),
      } as any));

      const mockRequest = {} as any;
      const mockResponse = {
        json: jest.fn().mockReturnThis(),
      } as any;

      await itemsController.index(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalled();
      const result = mockResponse.json.mock.calls[0][0];

      expect(result).toHaveLength(3);
      expect(result[0]).toHaveProperty('id');
      expect(result[0]).toHaveProperty('title');
      expect(result[0]).toHaveProperty('image_url');
      expect(result[0].image_url).toContain('http://192.168.0.6:3333/uploads/');
    });

    it('should handle empty items list', async () => {
      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue([]),
      } as any));

      const mockRequest = {} as any;
      const mockResponse = {
        json: jest.fn().mockReturnThis(),
      } as any;

      await itemsController.index(mockRequest, mockResponse);

      expect(mockResponse.json).toHaveBeenCalledWith([]);
    });

    it('should map item properties correctly', async () => {
      const mockItems = [
        { id: 99, title: 'Avó', image: 'avo.png' },
      ];

      (Knex as jest.MockedFunction<typeof Knex>).mockImplementation(() => ({
        select: jest.fn().mockResolvedValue(mockItems),
      } as any));

      const mockRequest = {} as any;
      const mockResponse = {
        json: jest.fn().mockReturnThis(),
      } as any;

      await itemsController.index(mockRequest, mockResponse);

      const result = mockResponse.json.mock.calls[0][0];
      expect(result[0].id).toBe(99);
      expect(result[0].title).toBe('Avó');
      expect(result[0].image_url).toBe('http://192.168.0.6:3333/uploads/avo.png');
    });
  });
});
