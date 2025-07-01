import {
  Inject,
  Injectable,
  NotFoundException,
  Param,
  Query,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Response } from 'express';
import { ClientProxy, Payload } from '@nestjs/microservices';
import { EventService } from 'src/event/event.service';
import { EventsGateway } from 'src/event/events.gateway';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepo: Repository<Order>,
    @Inject('PAYMENT_SERVICE')
    private paymentClient: ClientProxy,
    private readonly eventGateway: EventsGateway,
  ) {}

  async create(dto: CreateOrderDto, @Res() res: Response) {
    const result: { status: string } = await this.paymentClient
      .send('payment', { PIN: dto.PIN })
      .toPromise();
    const order = await this.orderRepo.save({
      user_id: dto.user_id,
      product_id: dto.product_id,
    });
    if (result.status === 'declined') {
      order.status = 'cancelled';
      await this.orderRepo.save(order);
      return res
        .status(400)
        .json({ message: 'Order bị từ chối!', data: order });
    }
    if (result.status === 'confirmed') {
      order.status = 'confirmed';
      await this.orderRepo.save(order);
      setTimeout(async () => {
        order.status = 'delivered';
        await this.orderRepo.save(order);
        this.eventGateway.emitOrderStatusUpdate();
      }, 5000);
      return res.status(201).json({
        message: 'Tạo mới order thành công!',
        data: order,
      });
    }
    return res.status(500).json({ message: 'Error' });
  }

  async cancel(id: number, @Res() res: Response) {
    const order = await this.orderRepo.findOne({
      where: { id: id },
    });
    if (!order) {
      return res.status(404).json({
        message: 'Không tồn tại order!',
      });
    }
    order.status = 'cancelled';
    await this.orderRepo.save(order);
    return res.status(200).json({
      message: 'Cancel Order thành công!',
    });
  }

  async getAll(
    page: number,
    limit: number,
    filter: string,
    keyword: string,
    @Res() res: Response,
  ) {
    const filterCondition =
      filter === 'all'
        ? {}
        : {
            status: filter,
          };
    const searchCondition = keyword
      ? {
          id: keyword,
        }
      : {};
    const skip = (page - 1) * limit;
    const totalItem = await this.orderRepo.count({
      where: { ...filterCondition },
    });
    const totalPage = Math.ceil(totalItem / limit);
    const orders = await this.orderRepo.find({
      where: filterCondition,
      order: { id: 'ASC' },
      take: limit,
      skip: skip,
    });
    return res.status(200).json({
      message: 'Thành công!',
      data: orders,
      currentPage: page,
      totalPage: totalPage,
    });
  }

  async getById(@Res() res: Response, id: number) {
    const order = await this.orderRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!order) {
      return res.status(404).json({
        message: 'Không tồn tại order',
      });
    }
    return res.status(200).json({
      message: 'Thành công!',
      data: order,
    });
  }
}
