import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from 'src/user/entity/user.entity';
import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity('services')
export class ServiceEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  title: string;

  @ApiProperty()
  @Column({ default: '' })
  description: string;

  @ApiProperty({ type: [UserEntity] })
  @ManyToMany(() => UserEntity, (user) => user.services, {
    cascade: true,
  })
  @JoinTable({
    name: 'services_subscribers_users',
    joinColumn: {
      name: 'service_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
  })
  subscribers: UserEntity[];
}
