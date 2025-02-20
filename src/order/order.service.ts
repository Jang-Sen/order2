import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { CreateOrderDto } from './dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(Order)
    private readonly repository: Repository<Order>,
  ) {}

  // 등록
  async createOrder(dto: CreateOrderDto): Promise<Order> {
    const { productId, customerId, quantity, totalPrice } = dto;

    const order = dto.id
      ? this.repository.create({
          id: dto.id,
          customerId,
          productId,
          quantity,
          totalPrice,
        })
      : this.repository.create({
          customerId,
          productId,
          quantity,
          totalPrice,
        });

    await this.repository.save(order);
    return order;
  }
}
