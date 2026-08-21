import { ApiProperty } from '@nestjs/swagger';

export class SuccessResponseDto {
  @ApiProperty() success: boolean;
}

export class SuccessMessageResponseDto {
  @ApiProperty() success: boolean;
  @ApiProperty() message: string;
}
