import { Request, Response } from 'express';
import { ItemService } from '../services/ItemService';

class ItemsController {
  private itemService: ItemService;

  constructor() {
    this.itemService = new ItemService();
    this.index = this.index.bind(this);
  }

  async index(request: Request, response: Response) {
    try {
      const items = await this.itemService.getAllItems();
      return response.json(items);
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default ItemsController;

