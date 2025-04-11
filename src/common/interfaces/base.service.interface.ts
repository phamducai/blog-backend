export interface IBaseService<T> {
  findAll(options?: any): Promise<T[]>;
  findOne(id: string, options?: any): Promise<T>;
  create(data: any): Promise<T>;
  update(id: string, data: any): Promise<T>;
  delete(id: string): Promise<T>;
}
