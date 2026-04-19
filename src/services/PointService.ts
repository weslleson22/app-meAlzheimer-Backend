import { IPointService, IPoint, IItem } from '../interfaces/services';
import { IPointItem } from '../interfaces/repositories';
import { IPointRepository } from '../interfaces/repositories';
import { PointRepository } from '../repositories/PointRepository';
import { ItemRepository } from '../repositories/ItemRepository';
import Knex from '../database/connection';

export class PointService implements IPointService {
    private pointRepository: IPointRepository;
    private itemRepository: ItemRepository;

    constructor() {
        this.pointRepository = new PointRepository();
        this.itemRepository = new ItemRepository();
    }

    async getPoints(city: string, uf: string, items: string): Promise<IPoint[]> {
        const parsedItems = items
            .split(',')
            .map(item => Number(item.trim()));

        const points = await this.pointRepository.findByFilters(city, uf, parsedItems);
        return points.map(point => ({
            ...point,
            image_url: `http://192.168.0.6:3333/uploads/${point.image}`,
        }));
    }

    async getPointById(id: number): Promise<{ point: IPoint; items: IItem[] } | null> {
        const point = await this.pointRepository.findById(id);
        if (!point) {
            return null;
        }

        const serializedPoint = {
            ...point,
            image_url: `http://192.168.0.6:3333/uploads/${point.image}`,
        };

        const items = await this.itemRepository.findItemsByPointId(id);
        return { point: serializedPoint, items };
    }

    async createPoint(pointData: any, image?: string): Promise<number> {
        const point: IPoint = {
            name: pointData.name,
            email: pointData.email,
            whatsapp: pointData.whatsapp,
            latitude: pointData.latitude,
            longitude: pointData.longitude,
            city: pointData.city,
            uf: pointData.uf,
            image: image,
        };

        const pointItems = pointData.items
            .split(',')
            .map((item: string) => Number(item.trim()))
            .map((item_id: number) => ({
                item_id,
                point_id: 0, // será setado após insert
            }));

        // Usar transação para ambos
        const trx = await Knex.transaction();
        try {
            const pointId = await this.pointRepository.create(point, trx);

            pointItems.forEach((item: IPointItem) => item.point_id = pointId);
            await this.pointRepository.createPointItems(pointItems, trx);

            await trx.commit();
            return pointId;
        } catch (error) {
            await trx.rollback();
            throw error;
        }
    }
}