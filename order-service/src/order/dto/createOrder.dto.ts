import { IsInteger } from 'class-validate';

export class CreateOrderDto {
  @IsInteger()
  product_id: number;
}
