import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
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
import { UpdateOrderDto } from './dto/UpdateOrder.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';

@Controller('order')
@UseFilters(new HttpExceptionFilter())
@UseFilters(new ServiceExceptionFilter())
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(JwtAuthGuard)
  @Post('')
  async create(@Body() createDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createDto, req);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  getAll(@Query() q: QueryOrderDto, @Req() req: Request): any {
    return this.orderService.getAll(q, req);
  }

  @Get(':id')
  getById(@Param('id', ParseIntPipe) id: number) {
    return this.orderService.getById(id);
  }
}
