import { IPoint, IItem, IPointItem } from './models';

export { IPoint, IItem, IPointItem } from './models';

export interface IPointRepository {
    findByFilters(city: string, uf: string, itemIds: number[]): Promise<IPoint[]>;
    findById(id: number): Promise<IPoint | undefined>;
    create(point: IPoint, trx?: any): Promise<number>;
    createPointItems(pointItems: IPointItem[], trx?: any): Promise<void>;
}

export interface IItemRepository {
    findAll(): Promise<IItem[]>;
    findItemsByPointId(pointId: number): Promise<IItem[]>;
}