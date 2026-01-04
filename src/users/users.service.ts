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
import { ResponseDto } from 'src/common/dtos/response.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRespository: Repository<User>,
    private readonly hashingService: HashingService,
  ) { }
  async create(createUserDto: CreateUserDto):Promise<ResponseDto<User>> {
    const passwordHash = await this.hashingService.hash(
      createUserDto.password,
    );
    const user = this.userRespository.create({
      email: createUserDto.email,
      name: createUserDto.name,
      passwordHash,
    });
       await this.userRespository.save(user);
       return {
        success: true,
        data: user
       }
  }

  async findOne(id: number): Promise<ResponseDto<User>> {
    const user = await this.userRespository.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    return {
      success: true,
      data: user
    };
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
    tokenPayloadDto: TokenPayloadDto,
  ): Promise<ResponseDto<User>> {
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
      throw new NotFoundException('Usuário não encontrado.');
    }

    if (user.id !== tokenPayloadDto.sub) {
      throw new ForbiddenException('Voce não pode atualizar esse usuário.');
    }
      await this.userRespository.save(user);
      return {
        success: true,
        data: user
      }
  }

  async remove(id: number, tokenPayloadDto: TokenPayloadDto): Promise<ResponseDto<User>> {
    const user = await this.userRespository.findOneBy({
      id,
    });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }
    if (user.id !== tokenPayloadDto.sub) {
      throw new ForbiddenException('Voce não pode remover esse usuário.');
    }
      await this.userRespository.delete(id);
      return {
        success: true,
        data: user,
      };
  }
}
