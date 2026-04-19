import { IPoint, IItem } from './models';

export { IPoint, IItem } from './models';

export interface IPointService {
    getPoints(city: string, uf: string, items: string): Promise<IPoint[]>;
    getPointById(id: number): Promise<{ point: IPoint; items: IItem[] } | null>;
    createPoint(pointData: any, image?: string): Promise<number>;
}

export interface IItemService {
    getAllItems(): Promise<IItem[]>;
}