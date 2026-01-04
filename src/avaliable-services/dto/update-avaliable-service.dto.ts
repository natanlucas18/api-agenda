import { PartialType } from '@nestjs/swagger';
import { CreateAvaliableServiceDto } from './create-avaliable-service.dto';

export class UpdateAvaliableServiceDto extends PartialType(
  CreateAvaliableServiceDto,
) {}
