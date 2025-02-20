import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
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
  exports: [ClientsModule],
})
export class RabbitmqModule {}
