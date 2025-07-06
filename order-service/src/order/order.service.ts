import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { CreateOrderDto } from './dto/createOrder.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { EventsGateway } from 'src/event/events.gateway';
import { paginate } from 'src/commom/ultis/paginate';
import { QueryOrderDto } from './dto/getAll.dto';
import { Request } from 'express';
import { PaymentResultStatus } from 'src/commom/constants/payment-result-status.enum';
import { OrderStatus } from 'src/commom/constants/order-status.enum';
import { UpdateOrderDto } from './dto/UpdateOrder.dto';
import { getNextState } from './state/order-status.machine';

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
    // let result: { status: string };
    // try {
    //   result = await this.paymentClient
    //     .send('payment', { PIN: dto.PIN })
    //     .toPromise();
    // } catch (error) {
    //   throw new RpcException('Error');
    // }

    const order = await this.orderRepo.save({
      user_id: dto.user_id,
      product_id: dto.product_id,
    });
    // // Neu bi tu choi
    // if (result.status === PaymentResultStatus.DECLINED) {
    //   order.status = OrderStatus.CANCELLED;
    //   await this.orderRepo.save(order);
    //   throw new BadRequestException('Order bị từ chối!');
    // }
    // // Thanh cong
    // if (result.status === PaymentResultStatus.CONFIRMED) {
    //   order.status = OrderStatus.CONFIRMED;
    //   await this.orderRepo.save(order);
    //   setTimeout(async () => {
    //     order.status = OrderStatus.DELIVERED;
    //     await this.orderRepo.save(order);
    //     this.eventGateway.emitOrderStatusUpdate();
    //     this.eventGateway.emitMessage(
    //       `Đơn hàng #${order.id} đã được vận chuyển!`,
    //     );
    //   }, 5000);
    return {
      message: 'Tạo mới order thành công!',
      data: order,
    };
    // }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    const order = await this.orderRepo.findOne({
      where: {
        id: id,
      },
    });
    if (!order) {
      throw new NotFoundException('Không tồn tại order!');
    }
    const nextStatus = getNextState(order.status, updateOrderDto.event);
    order.status = nextStatus;
    await this.orderRepo.save(order);
    return order;
  }

  async getAll(q: QueryOrderDto, req: Request): Promise<any> {
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

    // Bo loc
    filter !== 'all' &&
      queryBuilder.where('order.status = :status', { status: filter });

    // Tim kiem
    // Theo thoi gian
    queryBuilder.andWhere(
      new Brackets((qb) => {
        qb.andWhere(
          "TO_CHAR(order.created_at, 'HH24:MI DD/MM/YYYY') LIKE :keyword",
          {
            keyword: `%${keyword}%`,
          },
        );
        // Theo ID
        qb.orWhere('CAST(order.id AS TEXT) LIKE :keyword', {
          keyword: `%${keyword}%`,
        });
        // Theo status
        qb.orWhere('CAST(order.status AS TEXT) LIKE :keyword', {
          keyword: `%${keyword}%`,
        });
      }),
    );

    // Sort
    // Kiem tra cac collumn co the sort tranh bi SQL Injection
    const allowSortField = ['id', 'created_at', 'status'];
    const orderSortField = allowSortField.includes(orderBy)
      ? `order.${orderBy}`
      : 'order.id';
    queryBuilder.orderBy(
      orderSortField,
      sortBy.toUpperCase() === 'ASC' ? 'ASC' : 'DESC',
    );

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
