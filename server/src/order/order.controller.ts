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
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Response } from 'express';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('')
  async create(@Body() dto: CreateOrderDto, @Res() res: Response) {
    this.orderService.create(dto, res);
  }

  @Put('cancel/:id')
  cancel(@Param('id') id: number, @Res() res: Response) {
    this.orderService.cancel(id, res);
  }

  @Get('')
  getAll(
    @Query('page', ParseIntPipe) page: number,
    @Query('limit', ParseIntPipe) limit: number,
    @Res() res: Response,
  ) {
    this.orderService.getAll(page, limit, res);
  }

  @Get('/:id')
  getById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
    this.orderService.getById(res, id);
  }
}
