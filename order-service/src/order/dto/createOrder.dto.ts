import { IsInteger, IsString } from 'class-validate';

export class CreateOrderDto {
  @IsInteger()
  user_id: number;

  @IsInteger()
  product_id: number;

  @IsString()
  PIN: string;
}
