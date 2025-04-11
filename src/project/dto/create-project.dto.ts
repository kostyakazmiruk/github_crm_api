import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
  @ApiProperty({ example: 'facebook/react' })
  @IsString()
  @IsNotEmpty()
  path: string;
}
