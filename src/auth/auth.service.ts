import { Injectable } from '@nestjs/common';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  login(loginDto: LoginDto) {
    console.log(loginDto);
  }
}
