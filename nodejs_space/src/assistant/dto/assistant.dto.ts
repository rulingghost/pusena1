import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsArray } from 'class-validator';

export class ChatMessageItemDto {
  @ApiPropertyOptional({ example: 'user' })
  @IsOptional()
  @IsString()
  sender?: string;

  @ApiPropertyOptional({ example: 'Bugün semptomlarım normal mi?' })
  @IsOptional()
  @IsString()
  text?: string;
}

export class ChatAssistantDto {
  @ApiProperty({ description: 'Kullanıcının asistan sorusu', example: 'Bugün döngümün hangi evresindeyim?' })
  @IsNotEmpty({ message: 'Soru metni boş bırakılamaz.' })
  @IsString()
  question!: string;

  @ApiPropertyOptional({ description: 'Önceki mesaj geçmişi', type: [ChatMessageItemDto] })
  @IsOptional()
  @IsArray()
  history?: ChatMessageItemDto[];
}

export class ReportAssistantResponseDto {
  @ApiPropertyOptional({ description: 'Şikayet edilen asistan mesaj IDsi' })
  @IsOptional()
  @IsString()
  messageId?: string;

  @ApiPropertyOptional({ description: 'Kullanıcının sorduğu soru' })
  @IsOptional()
  @IsString()
  question?: string;

  @ApiProperty({ description: 'Şikayet edilen yapay zeka yanıt metni' })
  @IsNotEmpty({ message: 'Yanıt metni gereklidir.' })
  @IsString()
  responseText!: string;

  @ApiProperty({ description: 'Şikayet nedeni', example: 'Yanıltıcı tıbbi bilgi' })
  @IsNotEmpty({ message: 'Şikayet nedeni belirtilmelidir.' })
  @IsString()
  reason!: string;
}

export class AssistantResponseDto {
  @ApiProperty({ example: 'rep-1700000000' })
  id!: string;

  @ApiProperty({ example: 'assistant' })
  sender!: string;

  @ApiProperty({ example: 'Foliküler evredesiniz. Östrojen artışı enerjinizi destekler.' })
  text!: string;

  @ApiProperty({ example: ['Beslenme önerileri', 'Semptom kaydet'] })
  options!: string[];

  @ApiProperty({ example: 'Şimdi' })
  timestamp!: string;
}
