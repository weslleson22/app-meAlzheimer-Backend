import { Request, Response } from 'express';
import { PointService } from '../services/PointService';

class PointsController {
    private pointService: PointService;

    constructor() {
        this.pointService = new PointService();
    }

    async index(request: Request, response: Response) {
        const { city, uf, items } = request.query as { city: string; uf: string; items: string };
        const points = await this.pointService.getPoints(city, uf, items);
        return response.json(points);
    }

    async show(request: Request, response: Response) {
        const { id } = request.params;
        const result = await this.pointService.getPointById(Number(id));
        if (!result) {
            return response.status(400).json({ message: 'Point not found' });
        }
        return response.json(result);
    }

    async create(request: Request, response: Response) {
        const pointId = await this.pointService.createPoint(request.body, request.file?.filename);
        return response.json({ id: pointId });
    }
}

export default PointsController;
