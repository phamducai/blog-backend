import { IBaseService } from '../interfaces/base.service.interface';
import { IBaseRepository } from '../interfaces/base.repository.interface';
import { NotFoundException } from '../exceptions/not-found.exception';

export abstract class BaseService<T> implements IBaseService<T> {
  protected constructor(protected readonly repository: IBaseRepository<T>) {}

  async findAll(options?: any): Promise<T[]> {
    return this.repository.findAll(options);
  }

  async findOne(id: string, options?: any): Promise<T> {
    const entity = await this.repository.findOne(id, options);
    if (!entity) {
      throw new NotFoundException('Entity', id);
    }
    return entity;
  }

  async create(data: any): Promise<T> {
    return this.repository.create(data);
  }

  async update(id: string, data: any): Promise<T> {
    await this.findOne(id); // Ensure entity exists
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<T> {
    await this.findOne(id); // Ensure entity exists
    return this.repository.delete(id);
  }
}
