import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenPayloadDto } from 'src/auth/dtos/token-payload.dto';
import { HashingService } from 'src/auth/hashing/hashing.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly hashingService: HashingService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createUserDto.password,
      );
      const userData = {
        email: createUserDto.email,
        passwordHash,
        name: createUserDto.name,
      };
      const user = this.userRespository.create(userData);
      if (!user) {
        throw new BadRequestException('Erro ao criar usuário.');
      }
      await this.userRespository.save(user);
      return;
    } catch {
      throw new BadRequestException('Falha ao criar usuário.');
    }
  }

  async findOne(id: number) {
    const user = await this.userRespository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return user;
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tokenPayloadDto: TokenPayloadDto,
  ) {
    const userData = {
      name: updateUserDto?.name,
    };
    if (updateUserDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updateUserDto.password,
      );
      userData['passwordHash'] = passwordHash;
    }
    const user = await this.userRespository.preload({
      id,
      ...userData,
    });
    if (!user) {
      throw new NotFoundException('Pessoa não encontrada.');
    }

    if (user.id !== tokenPayloadDto.sub) {
      throw new ForbiddenException('Voce não pode atualizar esse usuário.');
    }

    await this.userRespository.save(user);
  }

  async remove(id: number, tokenPayloadDto: TokenPayloadDto) {
    const user = await this.userRespository.findOneBy({
      id,
    });
    if (!user) {
      throw new NotFoundException('Pessoa não encontrada.');
    }
    if (user.id !== tokenPayloadDto.sub) {
      throw new ForbiddenException('Voce nao pode remover essa usuário.');
    }
    return this.userRespository.delete(id);
  }
}
