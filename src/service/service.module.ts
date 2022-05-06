import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entity/user.entity';
import { ServiceEntity } from './entity/service.entity';
import { BannedUsersEntity } from './entity/banned-users.entity';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';

@Module({
  controllers: [ServiceController],
  imports: [
    TypeOrmModule.forFeature([ServiceEntity, UserEntity, BannedUsersEntity]),
  ],
  providers: [ServiceService],
  exports: [ServiceService],
})
export class ServiceModule { }
