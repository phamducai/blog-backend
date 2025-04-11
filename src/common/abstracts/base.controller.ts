import { Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { IBaseService } from '../interfaces/base.service.interface';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';

export abstract class BaseController<T> {
  protected constructor(protected readonly service: IBaseService<T>) {}

  @Get()
  async findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(@Body() createDto: any, @CurrentUser() user: any) {
    return this.service.create(createDto);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async update(@Param('id') id: string, @Body() updateDto: any, @CurrentUser() user: any) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async delete(@Param('id') id: string, @CurrentUser() user: any) {
    return this.service.delete(id);
  }
}
