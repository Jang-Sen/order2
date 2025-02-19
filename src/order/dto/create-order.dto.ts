import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '', description: '제품 UUID' })
  productId: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: '', description: '고객 UUID' })
  customerId: string;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ example: 2, description: '총 수량' })
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  @ApiProperty({ example: 80000, description: '총 가격' })
  totalPrice: number;
}
