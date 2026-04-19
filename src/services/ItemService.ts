import { IItemService, IItem } from '../interfaces/services';
import { IItemRepository } from '../interfaces/repositories';
import { ItemRepository } from '../repositories/ItemRepository';

export class ItemService implements IItemService {
    private itemRepository: IItemRepository;

    constructor() {
        this.itemRepository = new ItemRepository();
    }

    async getAllItems(): Promise<IItem[]> {
        const items = await this.itemRepository.findAll();
        return items.map(item => ({
            id: item.id,
            title: item.title,
            image: item.image,
            image_url: `http://192.168.0.6:3333/uploads/${item.image}`,
        }));
    }
}