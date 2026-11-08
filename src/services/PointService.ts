import { IPointService, IPoint, IItem } from '../interfaces/services';
import { IPointItem, IPointRepository } from '../interfaces/repositories';
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

  private getBaseUrl(): string {
    return process.env.IMAGE_BASE_URL || 'http://192.168.0.7:3333';
  }

  async getPoints(city: string, uf: string, items: string): Promise<IPoint[]> {
    const parsedItems = String(items)
      .split(',')
      .map((item) => Number(item.trim()))
      .filter((item) => !Number.isNaN(item));

    const baseUrl = this.getBaseUrl();
    const points = await this.pointRepository.findByFilters(city, uf, parsedItems);
    return points.map((point) => ({
      ...point,
      image_url: `${baseUrl}/uploads/${point.image}`,
    }));
  }

  async getPointById(id: number): Promise<{ point: IPoint; items: IItem[] } | null> {
    const point = await this.pointRepository.findById(id);
    if (!point) {
      return null;
    }

    const baseUrl = this.getBaseUrl();
    const serializedPoint: IPoint = {
      ...point,
      image_url: `${baseUrl}/uploads/${point.image}`,
    };

    const items = await this.itemRepository.findItemsByPointId(id);
    return { point: serializedPoint, items };
  }

  async createPoint(
    pointData: Omit<IPoint, 'id' | 'image' | 'image_url'> & { items: string },
    image?: string
  ): Promise<number> {
    const point: IPoint = {
      name: pointData.name,
      email: pointData.email,
      whatsapp: pointData.whatsapp,
      latitude: Number(pointData.latitude),
      longitude: Number(pointData.longitude),
      city: pointData.city,
      uf: pointData.uf,
      image: image || 'default.png',
    };

    const pointItems = String(pointData.items)
      .split(',')
      .map((item: string) => Number(item.trim()))
      .filter((item_id: number) => !Number.isNaN(item_id))
      .map((item_id: number) => ({
        item_id,
        point_id: 0,
      }));

    const trx = await Knex.transaction();
    try {
      const pointId = await this.pointRepository.create(point, trx);

      pointItems.forEach((item: IPointItem) => {
        item.point_id = pointId;
      });
      await this.pointRepository.createPointItems(pointItems, trx);

      await trx.commit();
      return pointId;
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  }
}
