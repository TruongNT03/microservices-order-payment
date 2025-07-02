import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseFilters,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Response } from 'express';
import { HttpExceptionFilter } from 'src/exception/http-exception.filter';

@Controller('order')
@UseFilters(new HttpExceptionFilter())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('')
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Put('cancel/:id')
  cancel(@Param('id') id: number) {
    return this.orderService.cancel(id);
  }

  @Get('')
  getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Query('filter') filter: string,
    @Query('keyword') keyword: string,
  ) {
    return this.orderService.getAll(page, limit, filter, keyword);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getById(id);
  }
}
