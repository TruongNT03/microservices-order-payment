import {
  IsOptional,
  IsString,
  IsNumber,
  Min,
  Max,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class QueryOrderDto {
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page?: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @IsOptional()
  @IsString()
  keyword?: string = '';

  @IsOptional()
  @IsString()
  @IsIn(['all', 'delivered', 'created', 'comfirmed', 'cancelled'])
  filter?: string = 'all';

  @IsOptional()
  @IsString()
  @IsIn(['ASC', 'DESC'])
  sortBy?: string = 'DESC';

  @IsOptional()
  @IsString()
  @IsIn(['createdAt', 'status', 'id'])
  orderBy?: string = 'createdAt';
}
