import { Request, Response } from 'express';
import { ItemService } from '../services/ItemService';

class ItemsController {
    private itemService: ItemService;

    constructor() {
        this.itemService = new ItemService();
    }

    async index(request: Request, response: Response) {
        const items = await this.itemService.getAllItems();
        return response.json(items);
    }
}

export default ItemsController;
