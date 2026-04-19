import Knex from '../database/connection';
import { IPointRepository, IPoint, IPointItem } from '../interfaces/repositories';

export class PointRepository implements IPointRepository {
    async findByFilters(city: string, uf: string, itemIds: number[]): Promise<IPoint[]> {
        return await Knex("points")
            .join("point_items", "points.id", "=", "point_items.point_id")
            .whereIn("point_items.item_id", itemIds)
            .where("city", city)
            .where("uf", uf)
            .distinct()
            .select("points.*");
    }

    async findById(id: number): Promise<IPoint | undefined> {
        return await Knex('points').where('id', id).first();
    }

    async create(point: IPoint, trx?: any): Promise<number> {
        const query = trx || Knex;
        const insertedIds = await query('points').insert(point);
        return insertedIds[0];
    }

    async createPointItems(pointItems: IPointItem[], trx?: any): Promise<void> {
        const query = trx || Knex;
        await query('point_items').insert(pointItems);
    }
}