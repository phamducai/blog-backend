export interface IBaseRepository<T> {
  findAll(options?: any): Promise<T[]>;
  findOne(id: string, options?: any): Promise<T | null>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
}
