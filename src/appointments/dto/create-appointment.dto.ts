import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAppointmentDto {
  @IsNotEmpty()
  provider: string;

  @IsString()
  @IsNotEmpty()
  service: string;

  @IsNotEmpty()
  data: Date;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  @MaxLength(100)
  clientName: string;
}
