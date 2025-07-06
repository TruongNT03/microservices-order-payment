import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { HttpExceptionFilter } from 'src/commom/exception/http-exception.filter';
import { QueryOrderDto } from './dto/getAll.dto';
import { ServiceExceptionFilter } from 'src/commom/exception/rpc-exception.filter';
import { Request } from 'express';
import { UpdateOrderDto } from './dto/UpdateOrder.dto';

@Controller('order')
@UseFilters(new HttpExceptionFilter())
@UseFilters(new ServiceExceptionFilter())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('')
  async create(@Body() dto: CreateOrderDto) {
    return this.orderService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Get('')
  getAll(@Query() q: QueryOrderDto, @Req() req: Request): any {
    return this.orderService.getAll(q, req);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getById(id);
  }
}
