import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty() total: number;
  @ApiProperty() page: number;
  @ApiProperty() totalPages: number;
}
