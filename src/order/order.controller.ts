import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
  ServiceUnavailableException,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { ClientProxy } from '@nestjs/microservices';
import { Order } from './entities/order.entity';
import { ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';

const GET_CUSTOMER = 'get_customer';
const GET_PRODUCT = 'get_product';
const IS_PRODUCT_IN_STOCK = 'is_product_in_stock';

@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    @Inject('CUSTOMER_SERVICE')
    private readonly customerClient: ClientProxy,
    @Inject('PRODUCT_SERVICE')
    private readonly productClient: ClientProxy,
  ) {}

  @Post()
  @ApiOperation({ summary: '주문 받기' })
  @ApiConsumes('application/x-www-form-urlencoded')
  async create(@Body() dto: CreateOrderDto): Promise<Order> {
    const { customerId, productId, quantity } = dto;
    let customer, product;

    try {
      // 고객 정보 갖고 오기
      customer = await this.customerClient
        .send(GET_CUSTOMER, {
          customerId,
        })
        .toPromise();

      // 제품 정보 갖고 오기
      product = await this.productClient
        .send(GET_PRODUCT, {
          productId,
        })
        .toPromise();
    } catch (err) {
      console.log('Order Controller: Create Method Error', err);
      throw new ServiceUnavailableException(
        '서비스를 이용할 수 없습니다. 나중에 다시 시도해 주세요.',
      );
    }

    if (!customer) {
      throw new NotFoundException('고객이 존재하지 않습니다.');
    }

    if (!product) {
      throw new NotFoundException('제품이 존재하지 않습니다.');
    }

    // 주문을 받았을 경우, 제품 수량 감소
    const isProductInStock = await this.productClient
      .send(IS_PRODUCT_IN_STOCK, {
        productId,
        quantity,
      })
      .toPromise();

    if (!isProductInStock) {
      throw new BadRequestException('제품의 수량이 충분하지 않습니다.');
    }

    return await this.orderService.createOrder(dto);
  }
}
