import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Res,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Not, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { Response } from 'express';
import { ClientProxy, Payload } from '@nestjs/microservices';
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

  async create(dto: CreateOrderDto) {
    const result: { status: string } = await this.paymentClient
      .send('payment', { PIN: dto.PIN })
      .toPromise();

    const order = await this.orderRepo.save({
      user_id: dto.user_id,
      product_id: dto.product_id,
    });
    // Neu bi tu choi
    if (result.status === 'declined') {
      order.status = 'cancelled';
      await this.orderRepo.save(order);
      throw new BadRequestException('Order bị từ chối!');
    }
    // Thanh cong
    if (result.status === 'confirmed') {
      order.status = 'confirmed';
      await this.orderRepo.save(order);
      setTimeout(async () => {
        order.status = 'delivered';
        await this.orderRepo.save(order);
        this.eventGateway.emitOrderStatusUpdate();
        this.eventGateway.emitMessage(
          `Đơn hàng #${order.id} đã được vận chuyển!`,
        );
      }, 5000);
      return {
        message: 'Tạo mới order thành công!',
        data: order,
      };
    }
  }

  async cancel(id: number) {
    try {
      const order = await this.orderRepo.findOne({
        where: { id: id },
      });
      if (!order) {
        throw new NotFoundException();
      }

      order.status = 'cancelled';
      await this.orderRepo.save(order);

      return {
        data: order,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }

  async getAll(
    page: number,
    limit: number,
    filter: string,
    keyword: string,
    orderBy: string,
    sortBy: string,
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
    const orderCondition = { [orderBy]: sortBy.toLocaleUpperCase() };
    const skip = (page - 1) * limit;
    const totalItem = await this.orderRepo.count({
      where: { ...filterCondition },
    });
    const totalPage = Math.ceil(totalItem / limit);
    const orders = await this.orderRepo.find({
      where: filterCondition,
      order: orderCondition,
      take: limit,
      skip: skip,
    });
    return {
      message: 'Thành công!',
      data: orders,
      currentPage: page,
      totalPage: totalPage,
    };
  }

  async getById(id: number) {
    try {
      const order = await this.orderRepo.findOne({
        where: {
          id: id,
        },
      });
      if (!order) {
        throw new NotFoundException();
      }
      return {
        message: 'Thành công!',
        data: order,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException();
    }
  }
}
