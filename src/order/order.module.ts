import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    ClientsModule.registerAsync([
      {
        name: 'PRODUCT_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
          if (!rabbitMqUrl) {
            throw new Error('RABBITMQ_URL is not defined');
          }
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqUrl], // urls
              queue: 'product_queue',
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
      {
        name: 'CUSTOMER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
          if (!rabbitMqUrl) {
            throw new Error('RABBITMQ_URL is not defined');
          }
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqUrl], // urls
              queue: 'customer_queue',
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
      {
        name: 'ORDER_SERVICE',
        imports: [ConfigModule],
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => {
          const rabbitMqUrl = configService.get<string>('RABBITMQ_URL');
          if (!rabbitMqUrl) {
            throw new Error('RABBITMQ_URL is not defined');
          }
          return {
            transport: Transport.RMQ,
            options: {
              urls: [rabbitMqUrl], // urls
              queue: 'order_queue',
              queueOptions: {
                durable: false,
              },
            },
          };
        },
      },
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [ClientsModule],
})
export class OrderModule {}
