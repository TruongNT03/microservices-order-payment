import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseFilters,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { HttpExceptionFilter } from 'src/commom/exception/http-exception.filter';
import { QueryOrderDto } from './dto/getAll.dto';
import { ServiceExceptionFilter } from 'src/commom/exception/rpc-exception.filter';

@Controller('order')
@UseFilters(new HttpExceptionFilter())
@UseFilters(new ServiceExceptionFilter())
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
  getAll(@Query() q: QueryOrderDto): any {
    return this.orderService.getAll(q);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getById(id);
  }
}
