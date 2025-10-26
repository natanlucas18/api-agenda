import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsModule } from './contacts/contacts.module';
import { UserModule } from './users/user.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      database: 'agenda',
      password: '241839',
      autoLoadEntities: true,
      synchronize: true, // nao usar em produção
    }),
    UserModule,
    ContactsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
