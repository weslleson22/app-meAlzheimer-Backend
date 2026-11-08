import { Request, Response } from 'express';
import { PointService } from '../services/PointService';

class PointsController {
  private pointService: PointService;

  constructor() {
    this.pointService = new PointService();
    this.index = this.index.bind(this);
    this.show = this.show.bind(this);
    this.create = this.create.bind(this);
  }

  async index(request: Request, response: Response) {
    try {
      const { city, uf, items } = request.query as {
        city?: string;
        uf?: string;
        items?: string;
      };

      if (!city || !uf || !items) {
        return response.status(400).json({ message: 'Missing required parameters' });
      }

      const points = await this.pointService.getPoints(city, uf, items);
      return response.json(points);
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' });
    }
  }

  async show(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const result = await this.pointService.getPointById(Number(id));
      if (!result) {
        return response.status(400).json({ message: 'Point not found' });
      }
      return response.json(result);
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' });
    }
  }

  async create(request: Request, response: Response) {
    try {
      const pointId = await this.pointService.createPoint(
        request.body,
        request.file?.filename
      );
      return response.status(201).json({
        id: pointId,
        message: 'Localização da família criada com sucesso',
      });
    } catch (error) {
      return response.status(500).json({ message: 'Internal server error' });
    }
  }
}

export default PointsController;

