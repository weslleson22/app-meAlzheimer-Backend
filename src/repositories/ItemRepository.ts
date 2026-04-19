import Knex from '../database/connection';
import { IItemRepository, IItem } from '../interfaces/repositories';

export class ItemRepository implements IItemRepository {
    async findAll(): Promise<IItem[]> {
        return await Knex('items').select('*');
    }

    async findItemsByPointId(pointId: number): Promise<IItem[]> {
        return await Knex('items')
            .join('point_items', 'items.id', '=', 'point_items.item_id')
            .where('point_items.point_id', pointId)
            .select('items.title');
    }
}