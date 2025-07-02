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
import { paginate } from 'src/commom/ultis/paginate';
import { QueryOrderDto } from './dto/getAll.dto';

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

  async getAll(q: QueryOrderDto): Promise<any> {
    const {
      page = 1,
      limit = 10,
      filter,
      orderBy = 'id',
      sortBy = 'ASC',
      keyword,
    } = q;
    // Chi khoi tao chua tao dieu kien
    const queryBuilder = this.orderRepo.createQueryBuilder('order');

    // Tim kiem
    // Theo thoi gian
    queryBuilder.andWhere(
      "TO_CHAR(order.createdAt, 'HH24:MI DD/MM/YYYY') LIKE :keyword",
      {
        keyword: `%${keyword}%`,
      },
    );
    // Theo ID
    queryBuilder.orWhere('CAST(order.id AS TEXT) LIKE :keyword', {
      keyword: `%${keyword}%`,
    });
    // Theo status
    queryBuilder.orWhere('CAST(order.status AS TEXT) LIKE :keyword', {
      keyword: `%${keyword}%`,
    });
    // Sort
    // Kiem tra cac collumn co the sort tranh bi SQL Injection
    const allowSortField = ['id', 'createdAt', 'status'];
    const orderSortField = allowSortField.includes(orderBy)
      ? `order.${orderBy}`
      : 'order.id';
    queryBuilder.orderBy(
      orderSortField,
      sortBy.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
    );
    // Neu muon tim kiem tat ca
    filter !== 'all' &&
      queryBuilder.where('order.status = :status', { status: filter });

    return paginate(queryBuilder, page, limit);
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
