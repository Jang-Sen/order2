import { Base } from '../../common/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity()
export class Order extends Base {
  @Column()
  public productId: string;

  @Column()
  public customerId: string;

  @Column()
  public quantity: number;

  @Column()
  public totalPrice: number;
}
