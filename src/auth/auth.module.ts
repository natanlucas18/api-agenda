import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { BcryptService } from './bcrypt/bcrypt.service';
import { HashingService } from './hashing/hashing.service';

@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    AuthService,
  ],
  exports: [HashingService],
})
export class AuthModule {}
