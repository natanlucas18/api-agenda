import { PartialType } from '@nestjs/swagger';
import { CreateAvailableServiceDto } from './create-available-service.dto';

export class UpdateAvailableServiceDto extends PartialType(
  CreateAvailableServiceDto,
) {}
