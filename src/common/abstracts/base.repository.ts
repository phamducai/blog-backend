import { IBaseRepository } from '../interfaces/base.repository.interface';
import { PrismaService } from '../../prisma/prisma.service';
import { LoggerService } from '../../logger/logger.service';

export abstract class BaseRepository<T> implements IBaseRepository<T> {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly modelName: string,
    protected readonly logger: LoggerService = new LoggerService(null),
  ) {
    this.logger.setContext(`${modelName}Repository`);
  }

  async findAll(options?: any): Promise<T[]> {
    this.logger.debug(`Finding all ${this.modelName} with options: ${JSON.stringify(options || {})}`);
    
    const { includeDeleted, ...prismaOptions } = options || {};
    
    const results = await this.prisma[this.modelName].findMany(prismaOptions);
    
    if (includeDeleted) {
      return results;
    }
    
    const filteredResults: any[] = [];
    for (const item of results) {
      if (item['isDeleted'] !== true) {
        filteredResults.push(item);
      }
    }
    
    return filteredResults as unknown as T[];
  }

  async findOne(id: string, options?: any): Promise<T | null> {
    this.logger.debug(`Finding ${this.modelName} with id: ${id} and options: ${JSON.stringify(options || {})}`);
    
    const { includeDeleted, ...prismaOptions } = options || {};
    
    const result = await this.prisma[this.modelName].findUnique({
      where: { id },
      ...prismaOptions
    });
    
    if (!result) {
      return null;
    }
    
    if (includeDeleted) {
      return result as unknown as T;
    }
    
    if (result['isDeleted'] === true) {
      return null;
    }
    
    return result as unknown as T;
  }

  async create(data: any): Promise<T> {
    this.logger.debug(`Creating ${this.modelName} with data: ${JSON.stringify(data)}`);
    return this.prisma[this.modelName].create({ data }) as unknown as T;
  }

  async update(id: string, data: any): Promise<T> {
    this.logger.debug(`Updating ${this.modelName} with id: ${id} and data: ${JSON.stringify(data)}`);
    return this.prisma[this.modelName].update({
      where: { id },
      data,
    }) as unknown as T;
  }

  async delete(id: string, softDelete: boolean = true): Promise<T> {
    this.logger.debug(`Deleting ${this.modelName} with id: ${id}, softDelete: ${softDelete}`);
    
    if (softDelete) {
      return this.prisma[this.modelName].update({
        where: { id },
        data: { isDeleted: true },
      }) as unknown as T;
    }
    
    return this.prisma[this.modelName].delete({
      where: { id },
    }) as unknown as T;
  }
}
